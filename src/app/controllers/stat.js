var _ = require('lodash');
var Entry = $('Entry');
var User = $('User');

module.exports = {
  all: function (req, res) {
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
  }
};
