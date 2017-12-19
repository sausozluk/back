module.exports = function (app) {
  app.get("/users/profile/:slug", opt, routers["user"].getProfileWithSlug);
  app.post("/users/note/:slug", giffMe("body", ["note"]), secure, routers["user"].setNoteToUser);
  app.get("/users/toggle-ban/:slug", secure, admin, routers["user"].toggleBanWithSlug);
  app.get("/users/toggle-mod/:slug", secure, admin, routers["user"].toggleModWithSlug);
  app.get("/users/toggle-block-chat/:slug", secure, moderator, routers["user"].toggleBlockChatWithSlug);
  app.get("/users/login/:slug", secure, admin, routers["user"].loginWithSlug);
  app.get("/users/exit/:slug", secure, routers["user"].logoutFromEverything);
  app.get("/users/activate-mail/:token", routers["user"].activateMail);
  app.get("/users/:slug", routers["user"].getUserWithSlug);
  app.post("/users/change-mail", giffMe("body", ["old_email", "password", "new_email_a", "new_email_b"]), secure, routers["user"].changeMail);
  app.post("/users/change-password", giffMe("body", ["old_password", "new_password_a", "new_password_b"]), secure, routers["user"].changePassword);
  app.post("/users/forgot-password", giffMe("body", ['email']), routers["user"].forgotPassword);
  app.post("/users/define-new-password/:key", giffMe("body", ["new_password_a", "new_password_b"]), routers["user"].defineNewPassword);
};