var hooks = {
  consoleLog: function () {
    var $log = console.log;
    global.$debug = $log;
    console.log = function () {
      $log.apply(this, arguments);
      //$logger.info(Array.prototype.slice.call(arguments).join(" "));
    };
  },
  consoleError: function () {
    var $error = console.error;
    console.error = function () {
      $error.apply(this, arguments);
      //$logger.error(Array.prototype.slice.call(arguments).join(" "));
    };
  }
};

module.exports = function () {
  hooks.consoleLog();
  hooks.consoleError();
  return {
    then: function (next) {
      next();
    }
  };
};