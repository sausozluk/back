var Entry = $('Entry');
var Topic = $('Topic');

var fixTopicUpdatedAt = function (_id) {
  Topic
    .findOne({_id: _id})
    .populate('entries', 'createdAt')
    .then(function (topic) {
      if (topic) {
        var entries = topic.entries;
        var size = entries.length;
        if (size) {
          var last = entries[size - 1];
          Topic
            .update({_id: _id}, {$set: {updatedAt: last.createdAt}})
            .then(function () {
            });
        }
      }
    });
};

module.exports = {
  remove: function (req, res) {
    var id = req.params.id;
    var isPowerful = req.user.permission > $enum("user.permission.USER");
    var topic_id = null;

    Entry
      .findOne({id: id})
      .then(function (entry) {
        if (entry && (entry.user.toString() === req.user_mdl._id.toString() || isPowerful)) {
          Topic.findOneAndUpdate({entries: entry._id}, {$pull: {entries: entry._id}})
            .then(function (topic) {
              if (topic.entries.length === 1) {
                topic.remove()
              } else {
                topic_id = topic._id;
              }

              return entry.remove();
            })
            .then(function () {
              if (topic_id) {
                fixTopicUpdatedAt(topic_id);
              }

              res.json({
                success: true
              });
            })
            .then(null, $error(res));
        } else {
          res.json({
            success: false,
            message: "böyle bir giriniz yok"
          })
        }
      })
      .then(null, $error(res));
  },
  create: function (req, res) {
    var topic_id = req.body.topic_id;
    var text = req.body.text;

    Topic.findOne({id: topic_id})
      .then(function (topic) {
        if (topic) {
          Entry.findOne({text: text, topic: topic._id})
            .then(function (isExist) {
              if (isExist) {
                res.json({
                  success: false,
                  message: '#' + isExist.id + ' da aynı fikirde.'
                });
              } else {
                var entry = new Entry({text: text, user: req.user_mdl._id, topic: topic._id});
                entry.save()
                  .then(function () {
                    return Topic.update({id: topic_id}, {$push: {entries: entry._id}, $set: {updatedAt: Date.now()}})
                  })
                  .then(function () {
                    $activity.create_entry(req.user_mdl.username, req.user_mdl.slug, entry.id);

                    res.json({
                      success: true,
                      data: {
                        id: entry.id
                      }
                    })
                  })
                  .then(null, $error(res));
              }
            })
            .then(null, $error(res));
        } else {
          res.json({
            success: false,
            message: "başlık yok"
          });
        }
      })
      .then(null, $error(res));
  },
  fetchVotes: function (req, res) {
    var id = req.params.id;

    Entry.findOne({id: id}, 'up ')
      .populate("up", "username slug")
      .then(function (entry) {
        if (entry) {
          res.json({
            success: true,
            data: entry
          });
        } else {
          res.json({
            success: false,
            message: "böyle bir entry yok"
          });
        }
      })
      .then(null, $error(res));
  },
  fetch: function (req, res) {
    var id = req.params.id;

    Entry.findOne({id: id})
      .populate("user")
      .then(function (entry) {
        if (entry) {
          Topic.findOne({entries: entry._id})
            .then(function (topic) {
              if (topic) {
                res.json({
                  success: true,
                  data: {
                    id: entry.id,
                    text: entry.text,
                    upvotes_count: entry.up.length,
                    downvotes_count: entry.down.length,
                    created_at: entry.createdAt,
                    updated_at: entry.updatedAt,
                    user: {
                      id: entry.user._id,
                      username: entry.user.username,
                      slug: entry.user.slug
                    },
                    topic: {
                      id: topic.id,
                      title: topic.title,
                      slug: topic.slug,
                      created_at: topic.createdAt,
                      updated_at: topic.updatedAt
                    }
                  }
                });
              } else {
                res.json({
                  success: false,
                  message: "başlıksız entry mi olur?"
                })
              }
            })
            .then(null, $error(res));
        } else {
          res.json({
            success: false,
            message: "böyle bir entry yok"
          })
        }
      })
      .then(null, $error(res));
  },
  upVote: function (req, res) {
    var id = req.body.id;

    Entry.findOne({id: id})
      .then(function (entry) {
        if (entry) {
          if (entry.user.toString() === req.user_mdl._id.toString()) {
            res.json({
              success: false,
              message: "ayıptır, günahtır"
            });
          } else {
            var query = {};
            if (entry.up.indexOf(req.user_mdl._id) === -1 &&
              entry.down.indexOf(req.user_mdl._id) === -1) {
              query['$push'] = {
                up: req.user_mdl._id
              };
            } else if (entry.up.indexOf(req.user_mdl._id) === -1 &&
              entry.down.indexOf(req.user_mdl._id) > -1) {
              query['$push'] = {
                up: req.user_mdl._id
              };

              query['$pull'] = {
                down: req.user_mdl._id
              };
            } else if (entry.up.indexOf(req.user_mdl._id) > -1 &&
              entry.down.indexOf(req.user_mdl._id) === -1) {
              query['$pull'] = {
                up: req.user_mdl._id
              };
            }

            Entry.update({id: id}, query)
              .then(function () {
                return Entry.findOne({id: id});
              })
              .then(function (entry) {
                $notification.like(req.user_mdl.slug, req.user_mdl.username, id, entry.user);

                res.json({
                  success: true,
                  data: {
                    upvotes_count: entry.up.length,
                    downvotes_count: entry.down.length
                  }
                });
              })
              .then(null, $error(res));
          }
        } else {
          res.json({
            success: false,
            message: "böyle bir entry yok"
          });
        }
      })
      .then(null, $error(res));
  },
  downVote: function (req, res) {
    var id = req.body.id;

    Entry.findOne({id: id})
      .then(function (entry) {
        if (entry) {
          if (entry.user.toString() === req.user_mdl._id.toString()) {
            res.json({
              success: false,
              message: "ayıptır, günahtır"
            });
          } else {
            var query = {};
            if (entry.down.indexOf(req.user_mdl._id) === -1 &&
              entry.up.indexOf(req.user_mdl._id) === -1) {
              query['$push'] = {
                down: req.user_mdl._id
              };
            } else if (entry.down.indexOf(req.user_mdl._id) === -1 &&
              entry.up.indexOf(req.user_mdl._id) > -1) {
              query['$push'] = {
                down: req.user_mdl._id
              };

              query['$pull'] = {
                up: req.user_mdl._id
              };
            } else if (entry.down.indexOf(req.user_mdl._id) > -1 &&
              entry.up.indexOf(req.user_mdl._id) === -1) {
              query['$pull'] = {
                down: req.user_mdl._id
              };
            }

            Entry.update({id: id}, query)
              .then(function () {
                return Entry.findOne({id: id});
              })
              .then(function (entry) {
                res.json({
                  success: true,
                  data: {
                    upvotes_count: entry.up.length,
                    downvotes_count: entry.down.length
                  }
                });
              })
              .then(null, $error(res));
          }
        } else {
          res.json({
            success: false,
            message: "böyle bir entry yok"
          });
        }
      })
      .then(null, $error(res));
  },
  update: function (req, res) {
    var id = req.params.id;
    var text = req.body.text;
    var isPowerful = req.user.permission > $enum("user.permission.USER");

    Entry
      .findOne({id: id})
      .then(function (entry) {
        if (entry && (entry.user.toString() === req.user_mdl._id.toString() || isPowerful)) {
          return Entry.update({id: id}, {text: text});
        } else {
          res.json({
            success: false,
            message: "böyle bir entry yok"
          });
        }
      })
      .then(function () {
        res.json({
          success: true
        });
      })
      .then(null, $error(res));
  }
};
