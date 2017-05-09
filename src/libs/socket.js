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
      var targets = global.clients[slug];
      for (var i in targets) {
        targets[i].send(JSON.stringify(data));
      }
    }
  };

  var __defineEvents = function (ws, slug) {
    ws.on("message", function (obj) {
      var req = JSON.parse(obj);

      if (req.action === 'send_message') {
        var data = req.data;
        var user = ws.__data;

        __send(data.to, {
          action: 'receive_message',
          data: {
            slug: slug,
            from: user.username,
            message: data.message
          }
        });

        chats$.sendMessage(user, data.to, data.message);
      }
    });

    ws.on("close", function () {
      $logger.info(slug, 'connection lost');
      delete global.clients[slug][ws.__data.token];
      if (!Object.keys(global.clients[slug]).length) {
        delete global.clients[slug];
      }
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

          if (!global.clients.hasOwnProperty(user.slug)) {
            global.clients[user.slug] = {};
          }

          global.clients[user.slug][token] = ws;

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
