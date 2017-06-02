var email = require("emailjs");
var fs = require("fs");

var activation = fs.readFileSync(__dirname + "/contents/activation_mail.html", "utf8").toString();

var server = email.server.connect({
  user: $config.mail.user,
  password: $config.mail.password,
  host: $config.mail.smtp,
  ssl: true
});

module.exports = {
  activation: function (username, token, mail) {
    var template = activation.template($config.site, username, $config.site + "/aktivasyon/" + token);
    this.send("aktivasyon zamanı", mail, template);
  },
  send: function (subject, to, message) {
    if ($config.mail.password.trim() !== "") {
      server.send({
        from: $config.mail.name + " <" + $config.mail.from + ">",
        to: to,
        subject: subject,
        attachment: [{data: message, alternative: true}]
      }, function (err, message) {
        if (err) {
          $logger.error("[MAIL] error", err);
        } else {
          $logger.info("[MAIL]", message.header.to);
        }
      });
    }
  }
};