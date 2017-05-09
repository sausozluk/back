module.exports = function (app) {
  /**
   * @api {put} /users/settings Update Settings
   * @apiHeader {String} token Users unique access-key.
   * @apiName UpdateSettings
   * @apiGroup User
   * @apiVersion 0.0.1
   *
   * @apiParam {String} messaging messaging
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200
   *     {
   *       "success": true
   *     }
   */
  app.put("/users/settings", secure, routers["user"].updateUserSettings);
  /**
   * @api {get} /users/profile/:slug Get Profile With Slug
   * @apiName GetProfile
   * @apiGroup User
   * @apiVersion 0.0.1
   *
   * @apiParam {String} slug slug
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200
   *     {
   *       "success": true,
   *       "data": {
   *         "username": "",
   *         "last_entries": [{
   *           "id": "",
   *           "title": ""
   *         }],
   *         "most_liked": [{
   *           "id": "",
   *           "title": ""
   *         }],
   *         "liked": [{
   *           "id": "",
   *           "title": ""
   *         }]
   *       }
   *     }
   */
  app.get("/users/profile/:slug", routers["user"].getProfileWithSlug);
  /**
   * @api {get} /users/me Get Me
   * @apiHeader {String} token Users unique access-key.
   * @apiName GetMe
   * @apiGroup User
   * @apiVersion 0.0.1
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200
   *     {
   *       "success": true,
   *       "data": {
   *         "messaging": ""
   *       }
   *     }
   */
  app.get("/users/me", secure, routers["user"].getMe);
  /**
   * @api {get} /users/:slug Get User With Slug
   * @apiName GetUser
   * @apiGroup User
   * @apiVersion 0.0.1
   *
   * @apiParam {String} slug slug
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200
   *     {
   *       "success": true,
   *       "data": {
   *         "username": ""
   *       }
   *     }
   */
  app.get("/users/:slug", routers["user"].getUserWithSlug);
};