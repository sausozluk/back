var Topic = $("Topic");
var Entry = $("Entry");
var User = $("User");
var _ = require("lodash");
var async = require("async");
var sha512 = require("js-sha512").sha512;
var randomToken = require("rand-token");
var utils = require(__dirname + "/../../libs/utils");

module.exports = {
  getProfileWithSlug: function (req, res) {
    var slug = req.params.slug;

    var userTask = function (next) {
      User.findOne({slug: slug})
        .then((function (user) {
          if (user) {
            this.user = user;
            next(null);
          } else {
            res.json({
              success: false,
              message: "böyle bi yazar yok"
            })
          }
        }).bind(this))
        .then(null, $error(res));
    };

    var entryCountTask = function (next) {
      Entry.count({user: this.user._id})
        .then(function (count) {
          next(null, {
            entry_count: count
          });
        })
        .then(null, $error(res));
    };

    var lastEntriesTask = function (data, next) {
      Entry.find({user: this.user._id})
        .sort({createdAt: -1})
        .limit(10)
        .populate('topic')
        .then(function (entries) {
          data.last_entries = _.map(entries, function (entry) {
            return {
              id: entry.id,
              title: entry.topic.title
            };
          });

          next(null, data);
        }).then(null, $error(res));
    };

    var mostHatedTask = function (data, next) {
      Entry.aggregate([{
        $match: {
          user: this.user._id
        }
      }, {
        "$project": {
          "id": 1,
          "topic": 1,
          "length": {"$size": "$down"}
        }
      }, {"$sort": {"length": -1}}, {"$limit": 5}])
        .exec()
        .then(function (entries) {
          return Entry.populate(entries, {path: 'topic'});
        })
        .then(function (entries) {
          data.most_hated = entries
            .filter(function (entry) {
              return entry.length;
            }).map(function (entry) {
              return {
                id: entry.id,
                title: entry.topic.title
              };
            });
          next(null, data);
        })
        .then(null, $error(res));
    };

    var mostLikedTask = function (data, next) {
      Entry.aggregate([{
        $match: {
          user: this.user._id
        }
      }, {
        "$project": {
          "id": 1,
          "topic": 1,
          "length": {"$size": "$up"}
        }
      }, {"$sort": {"length": -1}}, {"$limit": 5}])
        .exec()
        .then(function (entries) {
          return Entry.populate(entries, {path: 'topic'});
        })
        .then(function (entries) {
          data.most_liked = entries
            .filter(function (entry) {
              return entry.length;
            }).map(function (entry) {
              return {
                id: entry.id,
                title: entry.topic.title
              };
            });
          next(null, data);
        })
        .then(null, $error(res));
    };

    var likedTask = function (data, next) {
      Entry.find({up: this.user._id})
        .sort({createdAt: -1})
        .limit(10)
        .populate('topic')
        .then(function (entries) {
          data.liked = _.map(entries, function (entry) {
            return {
              id: entry.id,
              title: entry.topic.title
            };
          });
          next(null, data);
        }).then(null, $error(res));
    };

    async.waterfall([userTask,
        entryCountTask,
        lastEntriesTask,
        mostLikedTask,
        mostHatedTask,
        likedTask],
      function (err, data) {
        data.username = this.user.username;
        data.last_activities = this.user.activities || [];
        data.generation = this.user.generation;

        if (req.user_mdl) {
          if (req.user_mdl.permission > 1) {
            data.email = this.user.email;
          }

          if (this.user.notes.hasOwnProperty(req.user_mdl.slug)) {
            data.note = this.user.notes[req.user_mdl.slug];
          }
        }

        if (this.user.banned) {
          data.status = "banlandı";
        } else if (this.user.permission === $enum("user.permission.MOD")) {
          data.status = "mod";
        } else if (this.user.permission === $enum("user.permission.ADMIN")) {
          data.status = "admin";
        } else {
          data.status = "yazar";
        }

        var inOnlineObj = utils.getOnlineUsers()
          .find((function (item) {
            return item.slug === slug;
          }));

        data.online = !!inOnlineObj;

        res.json({
          success: true,
          data: data
        });
      });
  },
  getUserWithSlug: function (req, res) {
    User.findOne({slug: req.params.slug})
      .select('username')
      .then(function (user) {
        if (user) {
          res.json({
            success: true,
            data: {
              username: user.username
            }
          })
        } else {
          res.json({
            success: false,
            message: "böyle bi yazar yok"
          });
        }
      })
      .then(null, $error(res));
  },
  changePassword: function (req, res) {
    var info = req.body;
    var user = req.user_mdl;

    if (info['new_password_a'] !== info['new_password_b']) {
      res.json({
        success: false,
        message: 'daha iki şifreyi aynı giremiyosun'
      });

      return;
    }

    if (sha512(info['old_password']) !== user.password) {
      res.json({
        success: false,
        message: 'eski şifreni bilmiyosun :O'
      });

      return;
    }

    if (!info['new_password_a'].trim().length) {
      res.json({
        success: false,
        message: 'dolu dolu bi şifreyi kim sevmez'
      });

      return;
    }

    user.password = info['new_password_a'];
    user.save()
      .then(function () {
        $mail.passwordChange(user.username, user.email);
        res.json({success: true});
      })
      .then(null, $error(res));
  },
  changeMail: function (req, res) {
    var info = req.body;
    var user = req.user_mdl;

    if (info['new_email_a'] !== info['new_email_b']) {
      res.json({
        success: false,
        message: 'daha iki maili aynı giremiyosun'
      });

      return;
    }

    if (info['old_email'] !== user.email ||
      sha512(info.password) !== user.password) {
      res.json({
        success: false,
        message: 'arkadaşın kendi gelemiyor mu?'
      });

      return;
    }

    var key = randomToken.generate(32);
    var mail = info['new_email_a'];

    User.findOne({email: mail})
      .then(function (exist) {
        if (exist) {
          res.json({
            success: false,
            message: "başkasının mailine mi göz diktin şirifsiz"
          });
        } else {
          user.keys.mailChange = {key: key, mail: mail};

          user.save()
            .then(function () {
              $mail.mailChange(user.username, key, mail);
              res.json({success: true});
            })
            .then(null, $error(res));
        }
      });
  },
  forgotPassword: function (req, res) {
    var info = req.body;
    var email = info.email;

    var key = randomToken.generate(32);

    User.findOne({email: email})
      .then(function (exist) {
        if (exist) {
          exist.keys.forgotPassword = key;

          exist.save()
            .then(function () {
              $mail.mailChange(exist.username, key, email);
              res.json({success: true});
            })
            .then(null, $error(res));
        } else {
          res.json({success: true});
        }
      });
  },
  setNoteToUser: function (req, res) {
    var note = req.body.note;
    var slug = req.params.slug;

    User.findOne({slug: slug})
      .then(function (user) {
        if (user) {
          user.notes[req.user_mdl.slug] = note;

          user.markModified('notes');

          user.save()
            .then(function () {
              res.json({success: true});
            })
            .then(null, $error(res));
        } else {
          res.json({
            success: false,
            message: "böyle bi yazar yok"
          });
        }
      })
      .then(null, $error(res));
  },
  activateMail: function (req, res) {
    var token = req.params.token;
    var cache = {};

    User.findOne({"keys.mailChange.key": token})
      .then(function (user) {
        if (user) {
          cache.user = user;
          user.email = user.keys.mailChange.mail;
          user.keys.mailChange.key = randomToken.generate(32);

          return user.save();
        }
      })
      .then(function () {
        if (cache.user) {
          res.json({
            success: true
          });
        } else {
          res.json({
            success: false,
            message: "bulamadım sori"
          });
        }
      })
      .then(null, $error(res));
  },
  banWithSlug: function (req, res) {
    User.findOne({slug: req.params.slug})
      .then(function (user) {
        if (user) {
          user.banned = true;
          user.tokens = [];
          user.moderation.push("BAN," + req.user_mdl.username + "," + new Date().getTime());
          return user.save();
        } else {
          res.json({
            success: false,
            message: "böyle bi yazar yok"
          });
        }
      })
      .then(function () {
        res.json({success: true});
      })
      .then(null, $error(res));
  },
  unbanWithSlug: function (req, res) {
    User.findOne({slug: req.params.slug})
      .then(function (user) {
        if (user) {
          user.banned = false;
          user.tokens = [];
          user.moderation.push("UNBAN," + req.user_mdl.username + "," + new Date().getTime());
          return user.save();
        } else {
          res.json({
            success: false,
            message: "böyle bi yazar yok"
          });
        }
      })
      .then(function () {
        res.json({success: true});
      })
      .then(null, $error(res));
  },
  modWithSlug: function (req, res) {
    User.findOne({slug: req.params.slug})
      .then(function (user) {
        if (user) {
          user.permission = $enum("user.permission.MOD");
          user.tokens = [];
          user.moderation.push("MOD," + req.user_mdl.username + "," + new Date().getTime());
          return user.save();
        } else {
          res.json({
            success: false,
            message: "böyle bi yazar yok"
          });
        }
      })
      .then(function () {
        res.json({success: true});
      })
      .then(null, $error(res));
  },
  unmodWithSlug: function (req, res) {
    User.findOne({slug: req.params.slug})
      .then(function (user) {
        if (user) {
          user.permission = $enum("user.permission.USER");
          user.tokens = [];
          user.moderation.push("UNMOD," + req.user_mdl.username + "," + new Date().getTime());
          return user.save();
        } else {
          res.json({
            success: false,
            message: "böyle bi yazar yok"
          });
        }
      })
      .then(function () {
        res.json({success: true});
      })
      .then(null, $error(res));
  },
  logoutFromEverything: function (req, res) {
    var user = req.user_mdl;
    user.tokens = [];

    user.save()
      .then(function () {
        $activity.logout(user.username, user.slug);
        $session.setFalseWithUser(user._id);

        res.json({
          "success": true
        });
      })
      .then(null, $error(res));
  }
};