/**
 * @author Eray Arslan
 * @description Modular Test Runner
 */

console.log('[bOOt]', 'running!\n');

var fs = require('fs');
var path = require('path');

var getFolders = function (source) {
  return fs.readdirSync(source).filter(function (file) {
    return fs.statSync(path.join(source, file)).isDirectory();
  });
};

var folders = getFolders(__dirname);

var generateTestNameFromFileName = function (fileName) {
  return "[" + fileName.split(".").slice(0, -1).join(".") + "]";
};

require(__dirname + "/../src/app");

var importTest = function (name, path) {
  describe(name, function () {
    require(path);
  });
};

describe("(sozluk-api)", function () {
  this.timeout(0);
  before(function (done) {
    global.whenStarted = (function () {
      global.$api = "http://localhost:" + $config.port + "/api/v1";
      console.log();
      done();
    }).bind(this);
  });

  folders.forEach(function (folder) {
    var parent = __dirname + "/" + folder + "/";
    fs.readdirSync(parent).forEach(function (fileName) {
      var testName = generateTestNameFromFileName(folder + "/" + fileName);
      importTest(testName, parent + fileName);
    });
  });
});