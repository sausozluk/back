module.exports = function (app) {
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
  app.get("/users/:slug", routers["user"].getUserWithSlug)
};