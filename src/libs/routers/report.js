module.exports = function (app) {
  app.post("/reports", giffMe("body", ["entry"]), secure, routers["report"].create);
  app.get("/reports", secure, moderator, routers["report"].fetch);
  app.delete("/reports/:id", secure, moderator, routers["report"].remove)
};