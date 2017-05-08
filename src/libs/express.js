var utils = require(__dirname + "/utils");
var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var morgan = require("morgan");
var cors = require("cors");
var helmet = require("helmet");
var http = require("http");
var socket = require(__dirname + "/socket");

var app = express();
var router = express.Router();
var server = http.createServer(app);
var port = $config.port;

global.$error = utils.dbErrorHandler;

module.exports = function (next) {
  app.use(helmet());
  app.use(cors());
  app.use(cookieParser());
  app.use(bodyParser.json({limit: "50mb"}));
  app.use(bodyParser.urlencoded({limit: "50mb", extended: true}));
  app.use(morgan("combined", {stream: $logger._stream}));
  app.use(utils.responseHandler);
  require(__dirname + "/security");
  require(__dirname + "/router")(router);
  app.use("/api/v1", router);
  app.use("/uploads", express.static(__dirname + "/../uploads"));
  app.use(express.static(__dirname + "/../docs"));
  app.use(routers["home"].default);
  socket(server, function () {
    server.listen(port, utils.expressUp(port, next));
  });
};