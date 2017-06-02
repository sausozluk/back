var sha512 = require("js-sha512").sha512;
var User = $("User");
var getSlug = require('speakingurl');
var reserved = require(__dirname + "/../../libs/reserved");
var users$ = require(__dirname + '/../services/users');
var randomToken = require("rand-token");

var slug = function (str) {
  return getSlug(str, {
    lang: 'tr',
    symbols: false
  });
};

module.exports = {
  login: function (req, res) {
    var info = req.body;
    var cache = {};

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
          if (user.active) {
            cache.user = user;

            return users$.getUserUnseenMessage(user._id);
          } else {
            res.json({
              "success": false,
              "message": "aktif değilsin? belki de pasifsin ;)"
            });
          }
        }
      })
      .then(function (count) {
        if (cache.user) {
          var user = cache.user;

          return user
            .save()
            .then(function () {
              res.json({
                "success": true,
                "data": $out.successLogin(user, count)
              });
            });
        }
      })
      .then(null, $error(res));
  },
  register: function (req, res) {
    var info = req.body;
    var cache = {};

    var username = info.username.trim();
    var username_slug = slug(username);

    if (reserved.indexOf(username) > -1 ||
      reserved.indexOf(username_slug) > -1) {
      res.json({
        "success": false,
        "message": "önemini kanıtlaman lazım"
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
          user.keys.activation = randomToken.generate(32);

          cache.user = user;

          return user.save();
        }
      })
      .then(function () {
        if (cache.user) {
          var user = cache.user;
          $mail.activation(user.username, user.keys.activation, user.email);
          res.json({"success": true});
        }
      })
      .then(null, $error(res));
  },
  check: function (req, res) {
    var token = req.headers.token || $config.jokerToken;
    var cache = {};

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
          cache.user = user;

          return users$.getUserUnseenMessage(user._id);
        }
      })
      .then(function (count) {
        if (cache.user) {
          var user = cache.user;

          res.json({
            success: true,
            data: {
              isAlive: true,
              user_id: user.id,
              slug: user.slug,
              unread: count
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

    user.save()
      .then(function () {
        res.json({
          "success": true
        });
      })
      .then(null, $error(res));
  },
  activate: function (req, res) {
    var token = req.params.token;

    $("User")
      .update({"keys.activation": token}, {"activate": true})
      .then(function () {
        res.json({
          "success": true
        });
      })
      .then(null, $error(res));
  }
};
