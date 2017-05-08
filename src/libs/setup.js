var Setting = $('Setting');

var generationSetting = function () {
  var key = 'current_generation';

  var create = function () {
    var setting = new Setting({
      key: key,
      value: "1",
      description: "1. nesil"
    });

    return setting.save();
  };

  var init = function (next) {
    Setting
      .findOne({key: key})
      .then(function (setting) {
        if (!setting) {
          return create();
        }
      })
      .then(function () {
        next();
      });
  };

  var get = function (next) {
    Setting
      .findOne({key: key})
      .then(function (setting) {
        if (setting) {
          next(setting.value);
        }
      });
  };

  return {
    init: init,
    get: get
  }
};

module.exports = function (next) {
  global.$generation = generationSetting();
  $generation.init(next);
};