module.exports = function (app) {
  app.get("/", routers["home"].index);
  app.get("/status", routers["home"].status);
  app.get("/online", secure, routers["home"].online);
  app.get("/managers", secure, routers["home"].managers);
  app.get("/activities", secure, routers["home"].activities);
  app.get("/force-global-logout", secure, admin, routers["home"].forceGlobalLogout);
};