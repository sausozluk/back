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
        online: Object.keys(global.clients)
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
      message: "yok ki"
    });
  }
};
