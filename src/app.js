require('dotenv').config();
var sozluk_env = process.env['SOZLUK_ENV'] || 'local';
global.$env_config = require(__dirname + '/confs/' + sozluk_env);

global.$uptime = new Date().getTime();
global.$package = require(__dirname + "/package");
global.$config = require(__dirname + "/confs/global");
global.$enum = require(__dirname + "/libs/enum");
global.$hostname = require("os").hostname();
global.$logger = require(__dirname + "/libs/log")();
global.$hook = require(__dirname + "/libs/hook")();
global.$mail = require(__dirname + "/libs/mail");
global.$out = require(__dirname + "/libs/out");

$logger.info('SOZLUK_ENV #', sozluk_env);

require(__dirname + "/libs/db")(function () {
  require(__dirname + "/libs/err")();
  require(__dirname + "/libs/setup")(function () {
    require(__dirname + "/libs/express")(function () {
      $logger.info("[APP]", "ready", (new Date().getTime() - $uptime) / 1000);
      if (global.whenStarted) {
        $logger.close();
        global.whenStarted();
      }
    });
  });
});
