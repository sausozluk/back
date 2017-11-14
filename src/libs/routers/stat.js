module.exports = function (app) {
  app.get("/stats/most-writers", routers["stat"].mostWriterUsers);
  app.get("/stats/most-up-voted", routers["stat"].mostUpVotedEntries);
};