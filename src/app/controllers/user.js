var Topic = $("Topic");
var Entry = $("Entry");
var User = $("User");
var _ = require("lodash");
var async = require("async");
var sha512 = require("js-sha512").sha512;
var randomToken = require("rand-token");

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

    var lastEntriesTask = function (next) {
      Entry.find({user: this.user._id})
        .sort({createdAt: -1})
        .limit(10)
        .populate('topic')
        .then(function (entries) {
          next(null, {
            last_entries: _.map(entries, function (entry) {
              return {
                id: entry.id,
                title: entry.topic.title
              };
            })
          });
        }).then(null, $error(res));
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
        lastEntriesTask,
        mostLikedTask,
        likedTask],
      function (err, data) {
        data.username = this.user.username;
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
          })
        }
      })
      .then(null, $error(res));
  },
  changeMail: function (req, res) {
    var info = req.body;
    var user = req.user_mdl;

    if (info.new_email_a !== info.new_email_b) {
      res.json({
        success: false,
        message: 'daha iki maili aynı giremiyosun'
      });

      return;
    }

    if (info.old_email !== user.email ||
      sha512(info.password) !== user.password) {
      res.json({
        success: false,
        message: 'arkadaşın kendi gelemiyor mu?'
      });

      return;
    }

    var key = randomToken.generate(32);
    var mail = info.new_email_a;

    user.keys.mailChange = {key: key, mail: mail};

    user.save()
      .then(function () {
        $mail.mailChange(user.username, key, mail);
        res.json({success: true});
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
          user.keys.mailChange = {};

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
  }
};