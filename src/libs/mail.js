var email = require("emailjs");

var server = email.server.connect({
  user: $config.mail.user,
  password: $config.mail.password,
  host: $config.mail.smtp,
  ssl: true
});

module.exports = function (subject, to, message) {
  if ($config.mail.password.trim() !== "") {
    server.send({
      from: $config.mail.name + " <" + $config.mail.from + ">",
      to: to,
      subject: subject,
      attachment: [
        {data: message, alternative: true}
      ]
    }, function (err, message) {
      if (err) {
        $logger.error("[MAIL] error", err);
      } else {
        $logger.info("[MAIL]", message.header.to);
      }
    });
  }
};