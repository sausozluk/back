module.exports = function (app) {
  /**
   * @api {get} /search?q=:query Search User and Topic with Query
   * @apiName Search
   * @apiGroup Search
   * @apiVersion 0.0.1
   *
   * @apiParam {String} query query
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200
   *     {
   *       "success": true,
   *       "data": {
   *         "users": [{
   *           "username": "",
   *           "slug": ""
   *         }],
   *         "topics": [{
   *           "id": "",
   *           "title": "",
   *           "slug": ""
   *         }]
   *       }
   *     }
   */
  app.get("/search", giffMe("query", ["q"]), routers["search"].query);
  /**
   * @api {get} /search/user?q=:query Search User with Query
   * @apiName SearchUser
   * @apiGroup Search
   * @apiVersion 0.0.1
   *
   * @apiParam {String} query query
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200
   *     {
   *       "success": true,
   *       "data": [{
   *         "username": "",
   *         "slug": ""
   *       }]
   *     }
   */
  app.get("/search/user", giffMe("query", ["q"]), routers["search"].user);
};