var users$ = require(__dirname + '/../app/services/users');
var chats$ = require(__dirname + '/../app/services/chats');

var wss = new require("ws").Server;

module.exports = function (server, next) {
  var _wss = new wss({server: server});

  global.clients = {};

  var __closeWithSecurityNeed = function (ws) {
    ws.close(4001);
  };

  var __send = function (slug, data) {
    if (global.clients.hasOwnProperty(slug)) {
      global.clients[slug].send(JSON.stringify(data));
    }
  };

  var __defineEvents = function (ws, slug) {
    ws.on("message", function (obj) {
      var req = JSON.parse(obj);

      if (req.action === 'send_message') {
        var data = req.data;
        var user = global.clients[slug].__data;
        __send(data.to, {
          action: 'receive_message',
          data: {
            slug: slug,
            from: user.username,
            message: data.message
          }
        });

        // db
        chats$.sendMessage(user, data.to, data.message);
      }
    });

    ws.on("close", function () {
      $logger.info(slug, 'connection lost');
      delete global.clients[slug];
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
          global.clients[user.slug] = ws;
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
