module.exports = function (app) {
  app.get("/stats/most-writers", secure, routers["stat"].mostWriterUsers);
  app.get("/stats/most-up-voted-entries", secure, routers["stat"].mostUpVotedEntries);
  app.get("/stats/most-up-voted-users", secure, routers["stat"].mostUpVotedUsers);
  app.get("/stats/new-users", secure, routers["stat"].newUsers);
  app.get("/stats/general", secure, routers["stat"].general);
};