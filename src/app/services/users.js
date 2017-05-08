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
  }
};
