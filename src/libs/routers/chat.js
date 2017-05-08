module.exports = function (app) {
  /**
   * @api {Post} /chats Create Chat
   * @apiHeader {String} token Users unique access-key.
   * @apiName Create
   * @apiGroup Chat
   * @apiVersion 0.0.1
   *
   * @apiParam {Array} users user slug list
   *
   * @apiErrorExample {json} Error-Response:
   *     HTTP/1.1 200
   *     {
   *       "success": false,
   *       "message": "kavuşamazsınız"
   *     }
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200
   *     {
   *       "success": true,
   *       "data": {
   *         chat: ""
   *       }
   *     }
   */
  app.post("/chats", giffMe("body", ["users"]), secure, routers["chats"].create);
  /**
   * @api {Post} /chats/send Send Message
   * @apiHeader {String} token Users unique access-key.
   * @apiName Send
   * @apiGroup Chat
   * @apiVersion 0.0.1
   *
   * @apiParam {String} to to
   * @apiParam {String} message message
   *
   * @apiErrorExample {json} Error-Response:
   *     HTTP/1.1 200
   *     {
   *       "success": false
   *     }
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200
   *     {
   *       "success": true
   *     }
   */
  app.post("/chats/send", giffMe("body", ["to", "message"]), secure, routers["chats"].send);
  /**
   * @api {Get} /chats Inbox
   * @apiHeader {String} token Users unique access-key.
   * @apiName Inbox
   * @apiGroup Chat
   * @apiVersion 0.0.1
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200
   *     {
   *       "success": true,
   *       "data": [Chat]
   *     }
   */
  app.get("/chats", secure, routers["chats"].inbox);
  /**
   * @api {Get} /chats/:slug Get Single Chat
   * @apiHeader {String} token Users unique access-key.
   * @apiName GetSingleChat
   * @apiGroup Chat
   * @apiVersion 0.0.1
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200
   *     {
   *       "success": true,
   *       "data": [Message]
   *     }
   */
  app.get("/chats/:slug", secure, routers["chats"].chat);
};