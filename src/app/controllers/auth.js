var sha512 = require("js-sha512").sha512;
var User = $("User");
var slug = require('slug');
var reserved = require(__dirname + "/../../libs/reserved");
var utils = require(__dirname + "/../../libs/utils");

module.exports = {
  login: function (req, res) {
    var cache = {};
    var info = req.body;

    User.findOne({
      $or: [{
        "username": info.email
      }, {
        "email": info.email
      }],
      password: sha512(info.password)
    }).exec()
      .then(function (user) {
        if (!user) {
          res.json({
            "success": false,
            "message": "yanlış e-posta/şifre"
          });
        } else {
          return user
            .save()
            .then(function () {
              res.json({
                "success": true,
                "data": $out.successLogin(user)
              });
            });
        }
      })
      .then(null, $error(res));
  },
  register: function (req, res) {
    var cache = {};
    var info = req.body;

    var username = info.username.trim();

    if (reserved.indexOf(username) > -1) {
      res.json({
        "success": false,
        "message": "önemini kanıtlaman lazım"
      });
      return;
    }

    if (!utils.usernamePattern.test(username)) {
      res.json({
        "success": false,
        "message": "a\'dan z\'ye seviyoz biz :("
      });
      return;
    }

    User.findOne({
      $or: [{
        "username": info.username
      }, {
        "email": info.email
      }, {
        "slug": slug(info.username)
      }]
    }).exec()
      .then(function (user) {
        if (user) {
          res.json({
            "success": false,
            "message": "böyle birisi var ama"
          });
        } else {
          user = new User();
          user.username = info.username;
          user.email = info.email;
          user.password = info.password;
          return user
            .save()
            .then(function () {
              res.json({
                "success": true,
                "data": $out.successLogin(user)
              });
            });
        }
      })
      .then(null, $error(res));
  },
  check: function (req, res) {
    var token = req.headers.token || $config.jokerToken;

    User.findOne({
      "tokens": token
    }).exec()
      .then(function (user) {
        if (!user) {
          res.json({
            success: true,
            data: {
              isAlive: false
            }
          });
        } else {
          res.json({
            success: true,
            data: {
              isAlive: true,
              user_id: user.id,
              slug: user.slug
            }
          });
        }
      })
      .then(null, $error(res));
  },
  logout: function (req, res) {
    var token = req.headers.token;
    var user = req.user_mdl;
    var index = user.tokens.indexOf(token);
    user.tokens.splice(index, 1);

    user.save().then(function () {
      res.json({
        "success": true
      });
    })
      .then(null, $error(res));
  }
};