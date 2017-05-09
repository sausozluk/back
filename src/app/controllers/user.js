var Topic = $("Topic");
var Entry = $("Entry");
var User = $("User");
var _ = require("lodash");
var async = require("async");
var users$ = require(__dirname + '/../services/users');

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
  updateUserSettings: function (req, res) {
    var _id = req.user_mdl._id;
    var settings = req.body;

    users$.updateUserSettings(_id, settings)
      .then(function () {
        res.json({
          success: true
        });
      })
      .catch(function () {
        res.json({
          success: false,
          message: "başaramadık :("
        });
      });
  },
  getMe: function (req, res) {
    var user = req.user_mdl;

    res.json({
      success: true,
      data: user.settings
    });
  }
};