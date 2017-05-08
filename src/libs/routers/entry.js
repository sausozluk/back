module.exports = function (app) {
  /**
   * @api {delete} /entries/:id Remove Entry With Id
   * @apiHeader {String} token Users unique access-key.
   * @apiName RemoveEntry
   * @apiGroup Entry
   * @apiVersion 0.0.1
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200
   *     {
   *       "success": true
   *     }
   */
  app.delete("/entries/:id", secure, routers["entry"].remove);
  /**
   * @api {post} /entries Create Entry
   * @apiHeader {String} token Users unique access-key.
   * @apiName CreateEntry
   * @apiGroup Entry
   * @apiVersion 0.0.1
   *
   * @apiParam {String} topic_id topic id
   * @apiParam {String} text text
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200
   *     {
   *       "success": true,
   *       "data": {
   *         "id": ""
   *       }
   *     }
   */
  app.post("/entries", giffMe("body", ["topic_id", "text"]), secure, time(0.5), routers["entry"].create);
  /**
   * @api {get} /entries/:id Get Entry
   * @apiName GetEntry
   * @apiGroup Entry
   * @apiVersion 0.0.1
   *
   * @apiParam {String} id id
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200
   *     {
   *       "success": true,
   *       "data": {
   *         "id": "",
   *         "text": "",
   *         "upvotes_count": 0...n,
   *         "downvotes_count": 0...n,
   *         "created_at": "",
   *         "updated_at": "",
   *         "user": {
   *           "id": "",
   *           "username": "",
   *           "slug": ""
   *         },
   *         "topic": {
   *           "id": "",
   *           "title": "",
   *           "slug": "",
   *           "created_at": "",
   *           "updated_at": ""
   *         }
   *       }
   *     }
   */
  app.get("/entries/:id", routers["entry"].fetch);
  /**
   * @api {post} /entry/vote/up Give Up Vote For Entry
   * @apiHeader {String} token Users unique access-key.
   * @apiName UpVoteEntry
   * @apiGroup Entry
   * @apiVersion 0.0.1
   *
   * @apiParam {String} id id
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200
   *     {
   *       "success": true,
   *       "data": {
   *         "upvotes_count": 0...n,
   *         "downvotes_count": 0...n
   *       }
   *     }
   */
  app.post("/entry/vote/up", giffMe("body", ["id"]), secure, routers["entry"].upVote);
  /**
   * @api {post} /entry/vote/down Give Down Vote For Entry
   * @apiHeader {String} token Users unique access-key.
   * @apiName DownVoteEntry
   * @apiGroup Entry
   * @apiVersion 0.0.1
   *
   * @apiParam {String} id id
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200
   *     {
   *       "success": true,
   *       "data": {
   *         "upvotes_count": 0...n,
   *         "downvotes_count": 0...n
   *       }
   *     }
   */
  app.post("/entry/vote/down", giffMe("body", ["id"]), secure, routers["entry"].downVote);
  /**
   * @api {put} /entries/:id Update Entry
   * @apiHeader {String} token Users unique access-key.
   * @apiName UpdateEntry
   * @apiGroup Entry
   * @apiVersion 0.0.1
   *
   * @apiParam {String} id id
   * @apiParam {String} text text
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200
   *     {
   *       "success": true
   *     }
   */
  app.put("/entries/:id", giffMe("body", ["text"]), secure, routers["entry"].update);
};