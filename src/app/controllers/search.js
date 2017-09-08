var User = $("User");
var Topic = $("Topic");
var async = require("async");
var _ = require("lodash");

module.exports = {
  query: function (req, res) {
    var q = req.query.q;
    var regex = new RegExp(q, 'i');

    var findUsersTask = function (next) {
      User.find({username: regex})
        .then(function (users) {
          next(null, _.map(users, function (user) {
            return {
              username: user.username,
              slug: user.slug
            }
          }));
        })
        .then(null, $error(res));
    };

    var findTopicsTask = function (users, next) {
      Topic.find({title: regex})
        .then(function (topics) {
          next(null, users, _.map(topics, function (topic) {
            return {
              id: topic.id,
              title: topic.title,
              slug: topic.slug
            }
          }));
        })
        .then(null, $error(res));
    };

    async.waterfall([
        findUsersTask,
        findTopicsTask],
      function (err, users, topics) {
        res.json({
          success: true,
          data: {
            users: users,
            topics: topics
          }
        });
      }
    );
  },
  user: function (req, res) {
    var q = req.query.q;
    var regex = new RegExp(q, 'i');

    User.find({username: regex})
      .limit(10)
      .then(function (users) {
        res.json({
          success: true,
          data: _.map(users, function (user) {
            return {
              username: user.username,
              slug: user.slug
            }
          })
        });
      })
      .then(null, $error(res));
  }
};
