var mongoose = require("mongoose");

module.exports = function () {
  var exitHandler = function (options, err) {
    if (options.cleanup) {
      mongoose.disconnect(function () {
        console.log("[APP]", "Exit.");
        process.exit();
      });
    }

    if (err) {
      console.error(err.stack);
    }

    if (options.exit) {
      console.log("[APP]", "Dropping.");
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