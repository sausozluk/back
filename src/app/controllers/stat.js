var _ = require('lodash');
var Entry = $('Entry');
var User = $('User');
var Topic = $('Topic');

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
  }
};
