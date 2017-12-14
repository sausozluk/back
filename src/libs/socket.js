var users$ = require(__dirname + '/../app/services/users');
var chats$ = require(__dirname + '/../app/services/chats');

var uuid = require('uuid/v4');

module.exports = function (server, next) {
  var io = require('socket.io')(server, {
    path: '/service/ws'
  });

  global.clients = {};

  var __send = function (slug, data) {
    if (global.clients.hasOwnProperty(slug)) {
      var targets = global.clients[slug];
      for (var i in targets) {
        if (targets.hasOwnProperty(i)) {
          try {
            targets[i].emit('message', data);
          } catch (e) {
            console.error('[ERR]', e.message);
          }
        }
      }
    }
  };

  global.handleSendMessage = function (user, data) {
    if (user.block.chat) {
      __send(user.slug, {
        action: 'receive_message',
        data: {
          slug: data.to,
          from: '[uyarı]',
          message: 'mesaj göndermeniz engellendi'
        }
      });

      return;
    }

    chats$.sendMessage(user, data.to, data.message);

    /**
     * {action: send_message, data: {to: target_slug, message: message_content}}
     */
    __send(data.to, {
      action: 'receive_message',
      data: {
        slug: user.slug,
        from: user.username,
        message: data.message
      }
    });
  };

  io.use(function (socket, next) {
    var token = socket.handshake.query.token;

    if (!token) {
      next(new Error('Authentication error'));
    } else {
      users$.getUserWithToken(token)
        .then(function (user) {
          user.token = token;
          socket.__data = user;
          socket.uuid = uuid();

          if (!global.clients.hasOwnProperty(user.slug)) {
            global.clients[user.slug] = {};
          }

          global.clients[user.slug][socket.uuid] = socket;

          console.log(user.slug, 'connected!');
          next();
        })
        .catch(function () {
          next(new Error('Authentication error'));
        });
    }
  });

  io.sockets.on('connection', function (socket) {
    var user = socket.__data;

    socket.on('send_message', function (data) {
      handleSendMessage(user, data);
    });

    socket.on('mark_messages', function (data) {
      /**
       * {action: mark_messages, data: {to: target_slug}}
       */
      chats$.markMessages(user._id, [data.to, user.slug].sort().join('-'));
    });

    socket.on('disconnect', function () {
      console.log(user.slug, 'connection lost');
      delete global.clients[user.slug][socket.uuid];
    });
  });

  next();
};
