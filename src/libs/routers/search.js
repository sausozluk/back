module.exports = function (app) {
  app.get("/search", giffMe("query", ["q"]), routers["search"].query);
  app.get("/search/user", giffMe("query", ["q"]), routers["search"].user);
};