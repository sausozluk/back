var _ = require('lodash');
var Entry = $('Entry');
var User = $('User');
var Topic = $('Topic');
var async = require('async');

module.exports = {
  mostWriterUsers: function (req, res) {
    Entry.aggregate([
      {
        $group: {
          _id: '$user',
          count: {$sum: 1}
        }
      },
      {
        $sort: {
          count: -1
        }
      },
      {
        $limit: 10
      }
    ]).then(function (result) {
      return User.populate(result, {
        path: '_id',
        select: 'username slug -_id'
      });
    }).then(function (results) {
      var data = _.map(results, function (result) {
        return {
          user: {username: result._id.username, slug: result._id.slug},
          entry_count: result.count
        }
      });
      res.json({
        success: true,
        data: data
      });
    }).then(null, $error(res));
  },
  mostUpVotedEntries: function (req, res) {
    Entry.aggregate([{
      "$project": {
        "like_count": {"$size": "$up"},
        "topic": 1,
        "user": 1,
        "id": 1
      }
    }, {
      $match: {like_count: {$gt: 0}}
    },
      {"$sort": {"like_count": -1}},
      {"$limit": 10}
    ])
      .exec()
      .then(function (entries) {
        return Topic.populate(entries, {
          path: 'topic',
          select: 'title slug -_id id'
        });
      })
      .then(function (entries) {
        return User.populate(entries, {
          path: 'user',
          select: 'username slug -_id'
        });
      })
      .then(function (entries) {
        res.json({
          success: true,
          data: entries
        })
      })
      .then(null, $error(res));
  },
  mostUpVotedUsers: function (req, res) {
    Entry.aggregate([
      {
        "$project": {
          "like_count": {"$size": "$up"},
          "user": 1
        }
      },
      {
        $match: {
          like_count: {
            $gt: 0
          }
        }
      },
      {
        $group: {
          _id: '$user',
          count: {$sum: '$like_count'}
        }
      },
      {
        $sort: {
          count: -1
        }
      },
      {
        $limit: 10
      }
    ]).exec()
      .then(function (results) {
        return User.populate(results, {
          path: '_id',
          select: 'username slug -_id'
        }).then(function (results) {
          res.json({
            success: true,
            data: results
          })
        });
      })
      .then(null, $error(res));
  },
  newUsers: function (req, res) {
    User.find({}, 'username slug createdAt').sort('-createdAt').limit(10)
      .then(function (users) {
        res.json({
          success: true,
          data: users
        });
      })
      .then(null, $error(res));
  },
  general: function (req, res) {
    var getEntryCount = function (next) {
      Entry.count({})
        .then(function (count) {
          next(null, {
            entry_count: count
          });
        })
        .then(null, $error(res));
    };

    var getUserCount = function (data, next) {
      User.count({})
        .then(function (count) {
          data.user_count = count;
          next(null, data);
        })
        .then(null, $error(res));
    };

    var getTopicCount = function (data, next) {
      Topic.count({})
        .then(function (count) {
          data.topic_count = count;
          next(null, data);
        })
        .then(null, $error(res));
    };

    var mostActiveTopic = function (data, next) {
      Topic.aggregate([
        {
          "$project": {
            "entry_count": {"$size": "$entries"},
            "slug": 1,
            "title": 1,
            "id": 1
          }
        },
        {
          $match: {entry_count: {$gt: 0}}
        },
        {"$sort": {"entry_count": -1}},
        {"$limit": 1}
      ]).exec()
        .then(function (topics) {
          if (topics.length) {
            data.active_topic = topics[0];
            next(null, data)
          } else {
            data.active_topic = null;
          }
        })
        .then(null, $error(res));
    };

    async.waterfall([
      getEntryCount,
      getUserCount,
      getTopicCount,
      mostActiveTopic
    ], function (err, data) {
      res.json({
        success: true,
        data: data
      });
    });
  }
};
