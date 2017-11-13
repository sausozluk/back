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
    console.error("[DB] Error:", err.message);
  });

  mongoose.connection.on("connected", function () {
    console.log("[DB] Ready.");
    next();
    idm();
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