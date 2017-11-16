var User = $('User');

global.activities = [];

var limit = 100;
var limit_per_user = 10;

var addToActivities = function (data) {
  var slug = data.user.slug;
  var action = data.action;

  if (global.activities.length >= limit) {
    global.activities.shift();
  }

  global.activities.push(data);

  User
    .findOne({slug: slug})
    .then(function (user) {
      if (user) {
        if (user.activities.length >= limit_per_user) {
          var pullElId = user.activities[0]._id;

          User.update({slug: slug}, {$pull: {activities: {_id: pullElId}}}, {safe: true}).exec();
        }

        User.update({slug: slug}, {$push: {activities: {action: action, data: data.data || {}}}}).exec();
      }
    });
};

module.exports = {
  login: function (username, user_slug) {
    addToActivities({
      action: 'login',
      user: {username: username, slug: user_slug},
      date: new Date()
    });
  },
  logout: function (username, user_slug) {
    addToActivities({
      action: 'logout',
      user: {username: username, slug: user_slug},
      date: new Date()
    });
  },
  register: function (username, user_slug) {
    addToActivities({
      action: 'register',
      user: {username: username, slug: user_slug},
      date: new Date()
    });
  },
  create_entry: function (username, user_slug, id) {
    addToActivities({
      action: 'create_entry',
      user: {username: username, slug: user_slug},
      data: {id: id},
      date: new Date()
    });
  },
  create_topic: function (username, user_slug, id, topic_slug, topic_title) {
    addToActivities({
      action: 'create_topic',
      user: {username: username, slug: user_slug},
      data: {id: id, slug: topic_slug, title: topic_title},
      date: new Date()
    });
  }
};