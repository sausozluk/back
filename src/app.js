require('dotenv').config();
var sozluk_env = process.env['SOZLUK_ENV'] || 'local';
global.$isProd = sozluk_env === 'prod';
global.$env_config = require(__dirname + '/confs/' + sozluk_env);

global.$uptime = new Date().getTime();
global.$package = require(__dirname + "/package");
global.$config = require(__dirname + "/libs/global");
global.$extend = require(__dirname + "/libs/extend");
global.$enum = require(__dirname + "/libs/enum");
global.$hostname = require("os").hostname();
global.$activity = require(__dirname + "/libs/activity");
global.$logger = require(__dirname + "/libs/log")();
global.$mail = require(__dirname + "/libs/mail");
global.$out = require(__dirname + "/libs/out");

console.log('SOZLUK_ENV #', sozluk_env);

require(__dirname + "/libs/db")(function () {
  require(__dirname + "/libs/err")();
  require(__dirname + "/libs/setup")(function () {
    require(__dirname + "/libs/express")(function () {
      console.log("[APP]", (new Date().getTime() - $uptime) / 1000);
      if (global.whenStarted) {
        $logger.close();
        global.whenStarted();
      }
    });
  });
});
