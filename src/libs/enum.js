var _ = require("lodash");

var enums = {
  user: {
    permission: {
      ADMIN: 2,
      MOD: 1,
      USER: 0
    }
  }
};

module.exports = function (path, conf) {
  var val = eval("enums." + path);
  return conf ? _.values(val) : val;
};