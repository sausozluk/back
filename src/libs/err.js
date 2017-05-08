var mongoose = require("mongoose");

module.exports = function () {
  var exitHandler = function (options, err) {
    if (options.cleanup) {
      mongoose.disconnect(function () {
        $logger.info("[APP]", "down :<");
        process.exit();
      });
    }

    if (err) {
      $mail($hostname + " # " + err.message, err.stack);
      $logger.error(err.stack);
    }

    if (options.exit) {
      $logger.info("[APP]", "nooooooo (like luke)");
      process.exit();
    }
  };

  process.on("exit", exitHandler.bind(null, {
    cleanup: true
  }));

  process.on("SIGINT", exitHandler.bind(null, {
    exit: true
  }));

  process.on("uncaughtException", exitHandler.bind(null, {}));
};