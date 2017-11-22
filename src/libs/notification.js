var User = $('User');

var account_slug = "sau-sozluk";
var account = null;

User.findOne({slug: account_slug})
  .then(function (user) {
    if (user) {
      account = user;
      console.log('[NOTIFICATION] Ready.');
    }
  });

module.exports = {
  like: function (from_slug, from_username, entry_id, to_id) {
    var message = '[/biri/' + from_slug + ' ' + from_username + '] `#' + entry_id + '`\'den hoşlaştı ;)';

    if (account) {
      User.findOne({_id: to_id})
        .then(function (user) {
          if (user) {
            handleSendMessage(account, {
              to: user.slug,
              message: message
            });
          }
        });
    }
  }
};