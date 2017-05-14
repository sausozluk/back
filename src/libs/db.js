var mongoose = require("mongoose");
var fs = require("fs");
var path = __dirname + "/../app/models";
var idm = require(__dirname + "/idm");

global.mongoose = mongoose;
global.mongoose.Promise = require('promise');
global.ObjectId = mongoose.Schema.Types.ObjectId;
global.Mixed = mongoose.Schema.Types.Mixed;

module.exports = function (next) {
  global.mongoose.connect($config.db);

  mongoose.connection.on("error", function (err) {
    $logger.error("[DB] error:", err.message);
  });

  mongoose.connection.on("disconnected", function () {
    $logger.info("[DB] down.");
  });

  mongoose.connection.on("connected", function () {
    $logger.info("[DB] up");
    next();
    idm(); // make some id
  });

  fs.readdirSync(path).forEach(function (file) {
    if (file.indexOf(".js") !== -1) {
      require(path + "/" + file);
    }
  });

  global.$ = function (name) {
    return mongoose.model(name);
  };
};