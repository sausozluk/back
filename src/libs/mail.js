var email = require("emailjs");
var fs = require("fs");

var activation = fs.readFileSync(__dirname + "/contents/activation_mail.html", "utf8").toString();
var mailChange = fs.readFileSync(__dirname + "/contents/mail_change_mail.html", "utf8").toString();
var passwordChange = fs.readFileSync(__dirname + "/contents/password_change_mail.html", "utf8").toString();

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
  mailChange: function (username, token, mail) {
    var template = mailChange.template($config.site, username, $config.site + "/yeni-mail/" + token);
    this.send("mail değiştirmece", mail, template);
  },
  passwordChange: function (username, mail) {
    var template = passwordChange.template($config.site, username);
    this.send("şifrene bi şey oldu", mail, template);
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
          console.error("[MAIL] error", err);
        } else {
          console.log("[MAIL]", message.header.to);
        }
      });
    }
  }
};