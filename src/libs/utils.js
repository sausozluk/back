var fs = require("fs");
var colors = require("colors");

module.exports = {
  /**
   * @source https://github.com/frknbasaran/warder/blob/master/lib/req-param.js
   */
  "giffMe": function (type, params) {
    return function (req, res, next) {
      var state = true;
      var notProvided = [];

      params.forEach(function (param) {
        if (req[type][param] == undefined) {
          state = false;
          notProvided.push(param);
        }
      });
      if (state) {
        next();
      } else {
        res.json({
          "success": false,
          "message": "Required fields not provided: " + notProvided.toString()
        });
      }
    };
  },
  "getOnlineUsers": function () {
    var online = [];

    for (var slug in global.clients) {
      if (global.clients.hasOwnProperty(slug)) {
        var user = global.clients[slug];

        if (Object.keys(user).length) {
          online.push(slug);
        }
      }
    }

    return online;
  },
  "expressUp": function (port, next) {
    return function () {
      console.log("[HTTP]", port);
      next();
    };
  },
  "dbErrorHandler": function (res) {
    return function (err) {
      console.error(err);
      res.json({
        success: false,
        message: err.toString()
      });
    };
  },
  "requireDirWithCallback": function (dir, callback) {
    var ext = ".js";
    fs.readdirSync(dir).forEach(function (file) {
      if (file.indexOf(ext) !== -1) {
        var name = file.substring(0, file.length - ext.length);
        callback(dir + name, name);
      }
    });
  },
  "hexToRgb": function (hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : {
      r: 0,
      g: 0,
      b: 0
    };
  },
  "calcPaginate": function (req) {
    var page = req.params.page;
    var limit = 20;
    var paginate;

    if (req.params.limit) {
      limit = req.params.limit;
    }

    if (!page) {
      page = 0;
    } else if (page > 0) {
      page = page - 1;
    } else {
      return {
        error: true
      };
    }

    paginate = page * limit;

    return {
      error: false,
      paginate: paginate,
      page: page,
      limit: limit
    };
  },
  "emailPattern": /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
};
