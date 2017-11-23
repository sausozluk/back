module.exports = function (app) {
  app.get("/users/profile/:slug", opt, routers["user"].getProfileWithSlug);
  app.post("/users/note/:slug", giffMe("body", ["note"]), secure, routers["user"].setNoteToUser);
  app.get("/users/ban/:slug", secure, admin, routers["user"].banWithSlug);
  app.get("/users/unban/:slug", secure, admin, routers["user"].unbanWithSlug);
  app.get("/users/mod/:slug", secure, admin, routers["user"].modWithSlug);
  app.get("/users/unmod/:slug", secure, admin, routers["user"].unmodWithSlug);
  app.get("/users/exit/:slug", secure, routers["user"].logoutFromEverything);
  app.get("/users/activate-mail/:token", routers["user"].activateMail);
  app.get("/users/:slug", routers["user"].getUserWithSlug);

  app.post("/users/change-mail", giffMe("body", ["old_email", "password", "new_email_a", "new_email_b"]), secure, routers["user"].changeMail);
  app.post("/users/change-password", giffMe("body", ["old_password", "new_password_a", "new_password_b"]), secure, routers["user"].changePassword);
};