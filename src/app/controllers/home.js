var User = $('User');
var utils = require(__dirname + '/../../libs/utils');

module.exports = {
  index: function (req, res) {
    res.json({
      success: true
    });
  },
  online: function (req, res) {
    res.json({
      success: true,
      data: {
        online: utils.getOnlineUsers()
      }
    })
  },
  status: function (req, res) {
    res.json({
      success: true,
      data: {
        version: $package.version
      }
    });
  },
  managers: function (req, res) {
    User
      .find({'permission': {$gt: $enum("user.permission.USER")}}, 'username slug permission -_id')
      .then(function (users) {
        res.json({
          success: true,
          data: users
        });
      })
      .then(null, $error(res));
  },
  default: function (req, res) {
    res.status(404).json({
      success: false,
      message: "yok ki"
    });
  }
};
