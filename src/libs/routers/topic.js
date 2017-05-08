module.exports = function (app) {
  /**
   * @api {post} /topics Create Topic
   * @apiHeader {String} token Users unique access-key.
   * @apiName CreateTopic
   * @apiGroup Topic
   * @apiVersion 0.0.1
   *
   * @apiParam {Object} data.entry
   * @apiParam {String} data.entry.text text
   * @apiParam {Object} data.topic
   * @apiParam {String} data.topic.title title
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200
   *     {
   *       "success": true,
   *       "entry_id": ""
   *     }
   */
  app.post("/topics", giffMe("body", ["entry", "topic"]), secure, time(1), routers["topic"].create);
  /**
   * @api {post} /topics?count=:count&timestamp:timestamp Get Topics
   * @apiName GetTopics
   * @apiGroup Topic
   * @apiVersion 0.0.1
   *
   * @apiParam {String} count count (Optional)
   * @apiParam {String} timestamp timestamp (Optional)
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200
   *     {
   *       "success": true,
   *       "data": {
   *         "entries_count": 0...n,
   *         "topics": [{
   *           "id": "",
   *           "title": "",
   *           "slug": "",
   *           "count": 0...n,
   *           "created_at": "",
   *           "updated_at": ""
   *         }],
   *         "topics_count": 0...n
   *       }
   *     }
   */
  app.get("/topics", routers["topic"].list);
  /**
   * @api {get} /topics/i/random Get Random 5 Topic
   * @apiName GetRandomTopics
   * @apiGroup Topic
   * @apiVersion 0.0.1
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200
   *     {
   *       "success": true,
   *       "data": [
   *         "entry": {
   *           "id": "",
   *           "user": {
   *             "id": "",
   *             "slug": "",
   *             "username": ""
   *           },
   *           "text": "",
   *           "upvotes_count": 0...n,
   *           "downvotes_count": 0...n,
   *           "created_at": "",
   *           "updated_at": ""
   *         },
   *         "topic": {
   *           "id": "",
   *           "slug": "",
   *           "title": ""
   *         },
   *       ]
   *     }
   */
  app.get("/topics/i/random", routers["topic"].random);
  /**
   * @api {post} /topics/:id?page=:page Get Topic
   * @apiName GetTopic
   * @apiGroup Topic
   * @apiVersion 0.0.1
   *
   * @apiParam {String} id id
   * @apiParam {String} page page (Optional)
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200
   *     {
   *       "success": true,
   *       "data": {
   *         "title": "",
   *         "slug": "",
   *         "entries": [{
   *           "id": "",
   *           "user": {
   *             "id": "",
   *             "slug": "",
   *             "username": ""
   *           },
   *           "text": "",
   *           "upvotes_count": 0...n,
   *           "downvotes_count": 0...n,
   *           "created_at": "",
   *           "updated_at": ""
   *         }],
   *         "total_page": 0...n
   *       }
   *     }
   */
  app.get("/topics/:id", routers["topic"].fetch);
};