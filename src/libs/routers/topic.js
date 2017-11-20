module.exports = function (app) {
  app.post("/topics", giffMe("body", ["entry", "topic"]), secure, time(1), routers["topic"].create);
  app.get("/topics", routers["topic"].list);
  app.get("/topics/i/random", routers["topic"].random);
  app.get("/topics/:id", routers["topic"].fetch);
  app.put("/topics/:id", giffMe("body", ["title"]), secure, moderator, routers["topic"].update);
};