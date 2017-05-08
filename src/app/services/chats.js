var Chat = $("Chat");
var User = $("User");
var Message = $("Message");
var Promise = require("promise");
var _ = require('lodash');

module.exports = {
  createChat: function (user_list) {
    return new Promise(function (resolve, reject) {
      User.find({
          slug: {$in: user_list},
          "settings.messaging": true
        })
        .then(function (users) {
          if (users.length == 2) {
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

      User.findOne({slug: to_slug})
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
            return Chat.update({_id: chat._id}, {
              $push: {
                messages: new Message({
                  message: message,
                  user: from_user._id,
                  date: Date.now()
                })
              }
            })
          } else {
            self.createChat([to_user.slug, from_user.slug])
              .then(function (chat) {
                Chat.update({_id: chat._id}, {
                  $push: {
                    messages: new Message({
                      message: message,
                      user: from_user._id,
                      date: Date.now()
                    })
                  }
                }).then(function () {
                    resolve(true)
                  })
                  .then(null, function (err) {
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
  }
};
