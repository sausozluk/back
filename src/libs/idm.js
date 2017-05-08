// auto inc id manager
var ids = $config.ids;

module.exports = function () {
  var _do = function (key) {
    $('Id').findOne({key: key})
      .then(function (id) {
        if (!id) {
          new $('Id')({
            name: key
          }).save();
        }
      });
  };

  for (var i in ids) {
    var key = ids[i];
    _do(key);
  }
};