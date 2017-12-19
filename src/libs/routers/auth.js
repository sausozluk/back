module.exports = function (app) {
  app.post("/sessions", giffMe("body", ["password", "email"]), routers["auth"].login);
  app.post("/users", giffMe("body", ["username", "password", "email"]), routers["auth"].register);
  app.post("/sessions/check", routers["auth"].check);
  app.get("/sessions/logout", secure, routers["auth"].logout);
  app.get("/activate/:token", routers["auth"].activate);
};