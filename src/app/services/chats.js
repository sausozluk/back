var Chat = $("Chat");
var User = $("User");
var Promise = require("promise");
var _ = require('lodash');

module.exports = {
  createChat: function (user_list) {
    return new Promise(function (resolve, reject) {
      User
        .find({slug: {$in: user_list}})
        .then(function (users) {
          if (users.length === 2) {
            var chat = new Chat({
              users: users,
              slug: _
                .map(users, "slug")
                .sort()
                .join("-")
            });
            return chat.save();
          } else {
            reject(false);
          }
        })
        .then(function (chat) {
          resolve(chat);
        })
        .then(null, function (err) {
          reject(false);
        });
    });
  },
  sendMessage: function (from_user, to_slug, message) {
    var self = this;
    return new Promise(function (resolve, reject) {
      var to_user = void 0;

      User
        .findOne({slug: to_slug})
        .then(function (user) {
          if (user) {
            to_user = user;
            return Chat.findOne({slug: [to_user.slug, from_user.slug].sort().join("-")})
          } else {
            reject(false);
          }
        })
        .then(function (chat) {
          if (chat) {
            if (chat.messages.length >= $config.chatLimit) {
              var targetId = chat.messages[0]._id;
              Chat.update({_id: chat._id}, {$pull: {messages: {_id: targetId}}}, {safe: true})
                .then(function (r) {
                });
            }

            return Chat.update({_id: chat._id}, {
              $push: {
                messages: {
                  message: message,
                  user: from_user._id,
                  date: Date.now()
                }
              }
            })
          } else {
            self.createChat([to_user.slug, from_user.slug])
              .then(function (chat) {
                Chat.update({_id: chat._id}, {
                  $push: {
                    messages: {
                      message: message,
                      user: from_user._id,
                      date: Date.now()
                    }
                  }
                }).then(function () {
                  resolve(true)
                }).then(null, function (err) {
                  reject(false);
                });
              })
              .catch(function (err) {
                reject(err);
              })
          }
        })
        .then(function () {
          resolve(true);
        })
        .then(null, function (err) {
          reject(false);
        });
    });
  },
  markMessages: function (from_user, chat_slug) {
    return new Promise(function (resolve, reject) {
      Chat
        .findOne({slug: chat_slug})
        .then(function (chat) {
          if (chat) {
            var messages = chat.messages;
            messages.forEach(function (message) {
              if (from_user.toString() !== message.user.toString()) {
                message['seen'] = true;
              }
            });

            return chat.save();
          } else {
            resolve(false);
          }
        })
        .then(function () {
          resolve(true);
        })
        .then(null, function (err) {
          reject(false);
        });

    });
  }
};
