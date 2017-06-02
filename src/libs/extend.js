String.prototype.template = function () {
  var current = this;

  function safeRegexEscape(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  }

  for (var i = 0; i < arguments.length; i++) {
    var arg = arguments[i];
    current = current.replace(new RegExp(safeRegexEscape("%%")), arg);
  }

  return current;
};

module.exports = {};