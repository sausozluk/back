module.exports = function (app) {
  app.delete("/entries/:id", secure, routers["entry"].remove);
  app.post("/entries", giffMe("body", ["topic_id", "text"]), secure, time(0.5), routers["entry"].create);
  app.get("/entries/:id/votes", routers["entry"].fetchVotes);
  app.get("/entries/:id", routers["entry"].fetch);
  app.post("/entry/vote/up", giffMe("body", ["id"]), secure, routers["entry"].upVote);
  app.post("/entry/vote/down", giffMe("body", ["id"]), secure, routers["entry"].downVote);
  app.put("/entries/:id", giffMe("body", ["text"]), secure, routers["entry"].update);
};