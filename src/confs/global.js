module.exports = {
  port: 8080,
  errorMail: 'relfishere@gmail.com',
  jokerToken: "BLYAD",
  requestTimeout: 5 * 1000,
  db: $env_config['mongo_uri'],
  mail: {
    user: "",
    smtp: "",
    password: "",
    from: "bot@sausozluk.net",
    name: "saü sözlük bot"
  },
  randomCount: 5,
  ids: ['entries_inc', 'topics_inc']
};