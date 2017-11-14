module.exports = function (app) {
  app.get("/stats/most-writers", secure, routers["stat"].mostWriterUsers);
  app.get("/stats/most-up-voted", secure, routers["stat"].mostUpVotedEntries);
  app.get("/stats/new-users", secure, routers["stat"].newUsers);
};