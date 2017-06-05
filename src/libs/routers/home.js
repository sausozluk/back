module.exports = function (app) {
  /**
   * @api {get} / Index
   * @apiName index
   * @apiGroup Home
   * @apiVersion 0.0.1
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200
   *     {
   *       "success": true
   *     }
   */
  app.get("/", routers["home"].index);
  /**
   * @api {get} /status Status
   * @apiName status
   * @apiGroup Home
   * @apiVersion 0.0.1
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200
   *     {
   *       "success": true,
   *       "data": {
   *         "version": ""
   *       }
   *     }
   */
  app.get("/status", routers["home"].status);
  /**
   * @api {get} /online Online
   * @apiHeader {String} token Users unique access-key.
   * @apiName online
   * @apiGroup Home
   * @apiVersion 0.0.1
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200
   *     {
   *       "success": true,
   *       "data": {
   *         "online": []
   *       }
   *     }
   */
  app.get("/online", secure, admin, routers["home"].online);
};