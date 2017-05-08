var Topic = $("Topic");
var Entry = $("Entry");
var _ = require("lodash");
var async = require("async");

module.exports = {
  create: function (req, res) {
    var info = req.body;
    var content = info.entry.text;
    var title = info.topic.title;

    var entry = new Entry({
      user: req.user_mdl,
      text: content
    });

    var topic = new Topic({
      title: title
    });

    // fat
    topic.save()
      .then(function () {
        entry.topic = topic._id;
        entry.save()
          .then(function () {
            Topic.update({_id: topic._id}, {$push: {entries: entry}})
              .then(function () {
                res.json({
                  success: true,
                  entry_id: entry.id
                })
              })
              .then(null, function (err) {
                // fallback
                entry.remove();
                topic.remove();
                res.json({
                  success: false,
                  message: err.message
                })
              });
          })
          .then(null, function (err) {
            // fallback
            topic.remove();
            res.json({
              success: false,
              message: err.message
            })
          });
      })
      .then(null, $error(res));
  },
  list: function (req, res) {
    var start = new Date();
    start.setHours(0, 0, 0, 0);

    var end = new Date();
    end.setHours(23, 59, 59, 999);


    var count = parseInt(req.query.count && req.query.count ? req.query.count : 25);
    var timestamp = req.query.timestamp ? req.query.timestamp : end;

    var results = [];

    var getTodayEntryCount = function (next) {
      Entry
        .count({"createdAt": {"$gte": start, "$lt": end}})
        .then((function (entry_count) {
          this.entry_count = entry_count;
          next(null);
        }).bind(this))
        .then(null, $error(res));
    };

    var getTodayTopicCount = function (next) {
      Topic
        .count({"createdAt": {"$gte": start, "$lt": end}})
        .then((function (topic_count) {
          this.topic_count = topic_count;
          next(null);
        }).bind(this))
        .then(null, $error(res));
    };

    var getTodayEntriesTask = function (next) {
      Entry
        .find({"createdAt": {"$gte": start, "$lt": timestamp}})
        .then(function (entries) {
          next(null, entries);
        })
        .then(null, $error(res));
    };

    var getTopicsTask = function (entries, next) {
      var ids = _.map(entries, '_id');

      Topic
        .find({"updatedAt": {"$lt": timestamp}})
        .limit(count)
        .sort({updatedAt: -1})
        .then(function (topics) {
          _.each(topics, function (topic) {
            var i = 0;

            _.each(topic.entries, function (id) {
              i += _.findIndex(ids, function (o) {
                return o.toString() === id.toString();
              }) > -1 ? 1 : 0;
            });

            results.push({
              id: topic.id,
              slug: topic.slug,
              title: topic.title,
              count: i,
              updated_at: topic.updatedAt,
              created_at: topic.createdAt
            });
          });

          next(null);
        })
        .then(null, $error(res));
    };

    async.waterfall([
        getTodayEntryCount,
        getTodayTopicCount,
        getTodayEntriesTask,
        getTopicsTask],
      function () {
        res.json({
          success: true,
          data: {
            entries_count: this.entry_count ? this.entry_count : "no",
            topics: results,
            topics_count: this.topic_count ? this.topic_count : "no"
          }
        })
      });
  },
  random: function (req, res) {
    var limit = $config.randomCount;
    var boom = false;

    var results = [];

    var randomTask = function (next) {
      Topic.random(function (err, topic) {
        if (topic) {
          var entries = topic.entries;
          var id = entries[Math.floor(Math.random() * entries.length)];
          Entry.findOne({_id: id})
            .populate("user")
            .then(function (entry) {
              next({
                entry: {
                  id: entry.id,
                  user: {
                    id: entry.user._id,
                    slug: entry.user.slug,
                    username: entry.user.username
                  },
                  text: entry.text,
                  upvotes_count: entry.up.length,
                  downvotes_count: entry.down.length,
                  created_at: entry.createdAt,
                  updated_at: entry.updatedAt
                },
                topic: {
                  id: topic.id,
                  slug: topic.slug,
                  title: topic.title
                }
              });
            })
            .then(null, $error(res));
        } else {
          if (!boom) {
            res.json({
              success: false,
              message: "sözlük bomboş :("
            });
          }

          boom = true;
        }
      });
    };

    var loop = limit;
    for (var i = 0; i < limit; i++) {
      randomTask(function (topic) {
        results.push(topic);

        if (--loop == 0) {
          res.json({
            success: true,
            data: results
          });
        }
      });
    }
  },
  fetch: function (req, res) {
    var id = req.params.id;
    var count = 10;
    var page = parseInt(req.query.page && req.query.page ? req.query.page : 1);

    Topic.findOne({id: id})
      .then(function (topic) {
        if (!topic) {
          res.json({
            success: false,
            message: "böyle bir başlık yok"
          });

          return;
        }

        return Entry.find({_id: {$in: topic.entries}})
          .sort({createdAt: 1})
          .skip((page - 1) * count)
          .limit(count)
          .populate("user")
          .then(function (entries) {
            res.json({
              success: true,
              data: {
                entries: _.map(entries, function (entry) {
                  return {
                    id: entry.id,
                    text: entry.text,
                    created_at: entry.createdAt,
                    updated_at: entry.updatedAt,
                    upvotes_count: entry.up.length,
                    downvotes_count: entry.down.length,
                    user: {
                      id: entry.user._id,
                      slug: entry.user.slug,
                      username: entry.user.username
                    }
                  }
                }),
                total_page: Math.ceil(topic.entries.length / count),
                slug: topic.slug,
                title: topic.title
              }
            });
          })
          .then(null, $error(res));
      })
      .then(null, $error(res));
  }
};