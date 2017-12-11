var Chat = $('Chat');
var chats$ = require(__dirname + '/../services/chats');
var _ = require('lodash');

module.exports = {
  create: function (req, res) {
    chats$.createChat(req.body.users)
      .then(function (chat) {
        res.json({
          success: true,
          data: {
            chat: chat._id
          }
        });
      })
      .catch(function (err) {
        res.json({
          success: false,
          message: "kavuşamazsınız"
        })
      });
  },
  send: function (req, res) {
    var from_user = req.user_mdl;
    var to_slug = req.body.to;
    var message = req.body.message;

    chats$.sendMessage(from_user, to_slug, message)
      .then(function () {
        res.json({
          success: true
        })
      })
      .catch(function (err) {
        res.json({
          success: false
        })
      });
  },
  remove: function (req, res) {
    var from_user = req.user_mdl;
    var to_slug = req.params.slug;

    var chat_slug = [to_slug, from_user.slug].sort().join("-");

    Chat
      .findOne({slug: chat_slug})
      .then(function (chat) {
        if (chat) {
          _.forEach(chat.messages, function (message) {
            var already_deleted = message.deleted.indexOf(from_user._id) > -1;
            if (!already_deleted) {
              message.deleted.push(from_user);
            }
          });

          chat.save()
            .then(function () {
              res.json({
                success: true
              });
            });
        } else {
          res.json({
            success: false,
            message: "böyle bi konuşma yok"
          })
        }
      })
      .then(null, $error(res));
  },
  inbox: function (req, res) {
    var me = req.user_mdl._id;

    Chat.aggregate([
      {$match: {users: me}},
      {$unwind: '$messages'},
      {$match: {'messages.deleted': {$ne: req.isAdminMode ? '' : me}}},
      {
        $group: {
          '_id': '$_id',
          'messages': {'$push': '$messages'},
          'users': {'$first': '$users'},
          'updatedAt': {'$first': '$updatedAt'}
        }
      },
      {
        "$project": {
          "length": {"$size": "$messages"},
          "messages": {"$slice": ["$messages", -1]},
          "updatedAt": 1,
          "users": 1
        }
      },
      {"$sort": {"updatedAt": -1}}
    ])
      .exec()
      .then(function (chats) {
        return Chat.populate(chats, {
          path: 'users',
          match: {_id: {$ne: me}},
          select: 'username slug -_id'
        });
      })
      .then(function (chats) {
        res.json({
          success: true,
          data: chats
        })
      })
      .then(null, $error(res));
  },
  chat: function (req, res) {
    var slug = req.params.slug;
    var me = req.user_mdl._id;

    if (slug === req.user_mdl.slug) {
      res.json({
        success: false,
        message: "partenogenez?"
      });

      return;
    }

    var chat_slug = [slug, req.user_mdl.slug].sort().join("-");

    Chat
      .aggregate([
        {$match: {slug: chat_slug}},
        {$unwind: '$messages'},
        {$match: {'messages.deleted': {$ne: req.isAdminMode ? '' : me}}},
        {
          $group: {
            '_id': '$_id',
            'messages': {'$push': '$messages'}
          }
        }
      ])
      .then(function (chat) {
        if (chat.length) {
          chat = chat[0];

          chats$.markMessages(req.user_mdl._id, chat_slug)
            .then(function () {
              res.json({
                success: true,
                data: chat.messages
              });
            })
            .then(null, $error(res));
        } else {
          res.json({
            success: true,
            data: []
          });
        }
      })
      .then(null, $error(res));
  }
};