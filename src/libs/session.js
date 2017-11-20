var Session = $('Session');

var pushToSessions = function (model) {
  var session = new Session(model);
  session.save()
    .then(function () {
    });
};

module.exports = {
  create: function (req, user_id, token) {
    pushToSessions({
      remote_ip: req['clientIp'],
      local_ip: '127.0.0.1',
      user_agent: req.useragent.source,
      user: user_id,
      token: token,
      active: true
    });
  },
  setFalseWithToken: function (token) {
    Session.update({token: token}, {$set: {active: false}}).exec();
  },
  setFalseWithUser: function (user) {
    Session.updateMany({user: user}, {$set: {active: false}}).exec();
  },
  setFalse: function () {
    Session.updateMany({}, {$set: {active: false}})
      .then(function () {
      });
  }
};