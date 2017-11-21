module.exports = function (app) {
  app.get("/sessions/:slug", secure, admin, routers["session"].getSessionsWithSlug);
};