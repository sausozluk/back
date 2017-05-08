var utils = require(__dirname + "/utils");
global.giffMe = utils.giffMe;
global.routers = {};

// include all controllers
(function () {
  utils.requireDirWithCallback(__dirname + "/../app/controllers/", function (dir, name) {
    routers[name] = require(dir);
  });
})();

module.exports = function (app) {
  // include all routers
  utils.requireDirWithCallback(__dirname + "/routers/", function (dir) {
    require(dir)(app);
  });
};