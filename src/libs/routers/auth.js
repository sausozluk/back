module.exports = function (app) {
  /**
   * @api {Post} /sessions Login
   * @apiName Login
   * @apiGroup Auth
   * @apiVersion 0.0.1
   *
   * @apiParam {String} password password
   * @apiParam {String} email email
   *
   * @apiErrorExample {json} UserNotFound-Response:
   *     HTTP/1.1 200
   *     {
   *       "success": false,
   *       "message": "yanlış e-posta/şifre"
   *     }
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200
   *     {
   *       "success": true,
   *       "data": {
   *         user_id: "",
   *         token: "",
   *         email: "",
   *         username: "",
   *         slug: "",
   *         authority: ""
   *       }
   *     }
   */
  app.post("/sessions", giffMe("body", ["password", "email"]), routers["auth"].login);
  /**
   * @api {Post} /users Register
   * @apiName Register
   * @apiGroup Auth
   * @apiVersion 0.0.1
   *
   * @apiParam {String} username username
   * @apiParam {String} password password
   * @apiParam {String} email email
   *
   * @apiErrorExample {json} AlreadyRegistered-Response:
   *     HTTP/1.1 200
   *     {
   *       "success": false,
   *       "message": "böyle birisi var ama"
   *     }
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200
   *     {
   *       "success": true,
   *       "data": {
   *         user_id: "",
   *         token: "",
   *         email: "",
   *         username: "",
   *         slug: "",
   *         authority: ""
   *       }
   *     }
   */
  app.post("/users", giffMe("body", ["username", "password", "email"]), routers["auth"].register);
  /**
   * @api {Post} /sessions/check Session Check
   * @apiHeader {String} token Users unique access-key.
   * @apiName Check
   * @apiGroup Auth
   * @apiVersion 0.0.1
   *
   * @apiSuccessExample {json} SessionExist-Response:
   *     HTTP/1.1 200
   *     {
   *       "success": true,
   *       "data": {
   *         "isAlive": true,
   *         "user_id": "",
   *         "slug": ""
   *       }
   *     }
   *
   * @apiSuccessExample {json} SessionNotExist-Response:
   *     HTTP/1.1 200
   *     {
   *       "success": true,
   *       "data": {
   *         "isAlive": false
   *       }
   *     }
   */
  app.post("/sessions/check", routers["auth"].check);
  /**
   * @api {Delete} /sessions Logout
   * @apiHeader {String} token Users unique access-key.
   * @apiName Logout
   * @apiGroup Auth
   * @apiVersion 0.0.1
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200
   *     {
   *       success: true
   *     }
   */
  app.delete("/sessions", secure, routers["auth"].logout);
  /**
   * @api {get} /activate/:token Activate
   * @apiHeader {String} token Activation Token.
   * @apiName Activate
   * @apiGroup Auth
   * @apiVersion 0.0.1
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200
   *     {
   *       success: true
   *     }
   */
  app.get("/activate/:token", routers["auth"].activate);
};