global.activities = [];

module.exports = {
  login: function (username, user_slug) {
    activities.push({
      action: 'login',
      user: {username: username, slug: user_slug},
      date: new Date()
    });
  },
  logout: function (username, user_slug) {
    activities.push({
      action: 'logout',
      user: {username: username, slug: user_slug},
      date: new Date()
    });
  },
  register: function (username, user_slug) {
    activities.push({
      action: 'register',
      user: {username: username, slug: user_slug},
      date: new Date()
    });
  },
  create_entry: function (username, user_slug, id) {
    activities.push({
      action: 'create_entry',
      user: {username: username, slug: user_slug},
      data: {id: id},
      date: new Date()
    });
  },
  create_topic: function (username, user_slug, id, topic_slug) {
    activities.push({
      action: 'create_topic',
      user: {username: username, slug: user_slug},
      data: {id: id, slug: topic_slug},
      date: new Date()
    });
  }
};