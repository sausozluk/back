var _ = require('lodash');

module.exports = {
  index: function (req, res) {
    res.json({
      success: true
    });
  },
  online: function (req, res) {
    res.json({
      success: true,
      data: {
        online: _.map(global.clients || [], "__data.username")
      }
    })
  },
  status: function (req, res) {
    res.json({
      success: true,
      data: {
        version: $package.version
      }
    });
  },
  default: function (req, res) {
    res.status(404).json({
      success: false,
      msg: "yok ki"
    });
  }
};
