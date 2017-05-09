var User = $("User");
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
  updateUserSettings: function (_id, settings) {
    return new Promise(function (resolve, reject) {
      User.findOne({
        "_id": _id
      }).exec()
        .then(function (user) {
          if (!user) {
            reject(false);
          } else {
            user.settings.messaging = settings.messaging;
            return user.save();
          }
        })
        .then(function (user) {
          resolve(user);
        })
        .then(null, function () {
          reject(false)
        });
    });
  }
};
