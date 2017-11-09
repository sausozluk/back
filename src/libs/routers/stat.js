module.exports = function (app) {
  app.get("/stats", routers["stat"].all);
};