module.exports = function (app) {
  app.post("/reports", giffMe("body", ["entry"]), secure, routers["report"].create);
  app.get("/reports", secure, admin, routers["report"].fetch);
};