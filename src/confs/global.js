module.exports = {
  port: 8080,
  errorMail: 'relfishere@gmail.com',
  jokerToken: "BLYAD",
  requestTimeout: 5 * 1000,
  db: $env_config['mongo_uri'],
  mail: {
    from: "sozluk@post.com",
    smtp: "smtp.mail.com",
    password: ""
  },
  randomCount: 5,
  ids: ['entries_inc', 'topics_inc']
};