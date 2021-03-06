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
          if (user.banned) {
            res.json({
              "success": false,
              "message": "kovuldun"
            });
          }

          if (!user.active) {
            res.json({
              "success": false,
              "message": "aktif değilsin? belki de pasifsin ;)"
            });

            return;
          }

          cache.user = user;

          return users$.getUserUnseenMessage(user._id);
        }
      })
      .then(function (count) {
        if (cache.user) {
          var user = cache.user;

          user.tokens.push(randomToken.generate(32));

          return user
            .save()
            .then(function () {
              $activity.login(user.username, user.slug);
              var out = $out.successLogin(user, count);
              $session.create(req, user._id, out.token);

              res.json({
                "success": true,
                "data": out
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

    if (!info.password.trim().length) {
      res.json({
        success: false,
        message: 'dolu dolu bi şifreyi kim sevmez'
      });

      return;
    }

    $generation.get((function (current) {
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
            user.keys.forgotPassword = randomToken.generate(32);
            user.keys.mailChange.key = randomToken.generate(32);
            user.keys.mailChange.mail = info.email;
            user.tokens.push(randomToken.generate(32));
            user.generation = current;
            user.slug = slug(info.username);

            cache.user = user;

            return user.save();
          }
        })
        .then(function () {
          if (cache.user) {
            var user = cache.user;

            $mail.activation(user.username, user.keys.activation, user.email);

            $activity.register(user.username, user.slug);

            res.json({
              "success": true
            });
          }
        })
        .then(null, $error(res));
    }).bind(this));
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
        if (!req.isAdminMode) {
          $activity.logout(user.username, user.slug);
        }

        $session.setFalseWithToken(token);

        res.json({
          "success": true
        });
      })
      .then(null, $error(res));
  },
  activate: function (req, res) {
    var token = req.params.token;

    User
      .update({"keys.activation": token}, {"active": true})
      .then(function () {
        res.json({
          "success": true
        });
      })
      .then(null, $error(res));
  }
};
