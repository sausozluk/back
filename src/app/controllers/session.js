var User = $("User");
var Session = $("Session");
var geoip = require('geoip-lite');
var _ = require('lodash');
var useragent = require('express-useragent');

module.exports = {
  getSessionsWithSlug: function (req, res) {
    var slug = req.params.slug;

    User.findOne({slug: slug})
      .then(function (user) {
        if (user) {
          Session
            .find({user: user._id})
            .sort({createdAt: -1})
            .limit(10).populate('user', 'username slug')
            .then(function (sessions) {
              var data = _.map(sessions, function (item) {
                var json = item.toJSON();
                delete json.token;
                json.detail = {};
                json.detail['remote_ip'] = geoip.lookup(json['remote_ip']);
                json.detail['user_agent'] = useragent.parse(json['user_agent']);
                return json;
              });

              res.json({
                success: true,
                data: data
              })
            })
            .then(null, $error(res));
        } else {
          res.json({
            success: false,
            message: "böyle bi yazar yok"
          })
        }
      })
      .then(null, $error(res));
  }
};