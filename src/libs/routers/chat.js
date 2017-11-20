module.exports = function (app) {
  app.post("/chats", giffMe("body", ["users"]), secure, routers["chats"].create);
  app.post("/chats/send", giffMe("body", ["to", "message"]), secure, routers["chats"].send);
  app.get("/chats", secure, routers["chats"].inbox);
  app.get("/chats/:slug", secure, routers["chats"].chat);
  app.delete("/chats/:slug", secure, routers["chats"].remove);
};