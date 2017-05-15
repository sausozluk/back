var User = $("User");
var Chat = $("Chat");
var Promise = require("promise");

module.exports = {
  getUserWithToken: function (token) {
    return new Promise(function (resolve, reject) {
      User.findOne({
        "tokens": token
      }).exec()
        .then(function (user) {
          if (!user) {
            reject(false);
          } else {
            resolve(user.toObject());
          }
        })
        .then(null, function () {
          reject(false);
        });
    });
  },
  getUserUnseenMessage: function (_id) {
    return new Promise(function (resolve, reject) {
      if (!_id) {
        resolve(0);
      } else {
        Chat.aggregate(
          {$match: {users: _id}},
          {$unwind: '$messages'},
          {$match: {'messages.seen': false, 'messages.user': {$ne: _id}}},
          {$group: {_id: '$_id', messages: {$push: '$messages._id'}}})
          .then(function (chats) {
            var sum = 0;
            chats.forEach(function (chat) {
              sum += chat.messages.length;
            });

            resolve(sum);
          })
          .then(null, function () {
            resolve(0);
          });
      }
    });
  }
};
