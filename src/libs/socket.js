var users$ = require(__dirname + '/../app/services/users');
var chats$ = require(__dirname + '/../app/services/chats');

var uuid = require('uuid/v4');

var wss = new require("ws").Server;

module.exports = function (server, next) {
  var _wss = new wss({server: server});

  global.clients = {};

  var __closeWithSecurityNeed = function (ws) {
    ws.close(4001);
  };

  var __send = function (slug, data) {
    if (global.clients.hasOwnProperty(slug)) {
      var targets = global.clients[slug];
      for (var i in targets) {
        if (targets.hasOwnProperty(i)) {
          targets[i].send(JSON.stringify(data));
        }
      }
    }
  };

  var __defineEvents = function (ws, slug) {
    ws.on("message", function (obj) {
      var req = JSON.parse(obj);
      var user = ws.__data;
      var data = req.data;

      if (req.action === 'send_message') {
        /**
         * {action: send_message, data: {to: target_slug, message: message_content}}
         */
        __send(data.to, {
          action: 'receive_message',
          data: {
            slug: slug,
            from: user.username,
            message: data.message
          }
        });

        chats$.sendMessage(user, data.to, data.message);
      } else if (req.action === 'mark_messages') {
        /**
         * {action: mark_messages, data: {to: target_slug}}
         */
        chats$.markMessages(user._id, [data.to, slug].sort().join('-'));
      }
    });

    ws.on("close", function () {
      $logger.info(slug, 'connection lost');
      delete global.clients[slug][ws.uuid];
    });
  };

  _wss.on("connection", function (ws) {
    var token = ws.upgradeReq.url.slice(1);

    if (!token) {
      __closeWithSecurityNeed(ws);
    } else {
      users$.getUserWithToken(token)
        .then(function (user) {
          user.token = token;
          ws.__data = user;
          ws.uuid = uuid();

          if (!global.clients.hasOwnProperty(user.slug)) {
            global.clients[user.slug] = {};
          }

          global.clients[user.slug][ws.uuid] = ws;

          $logger.info(user.slug, 'connected!');
          __defineEvents(ws, user.slug);
        })
        .catch(function () {
          __closeWithSecurityNeed(ws);
        });
    }
  });

  next();
};
