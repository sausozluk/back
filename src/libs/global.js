module.exports = {
  port: 8080,
  author: 'relfishere@gmail.com',
  jokerToken: "BLYAD",
  requestTimeout: 5 * 1000,
  db: $env_config['mongo_uri'],
  mail: $env_config['mail'],
  randomCount: 5,
  ids: ['entries_inc', 'topics_inc'],
  site: "http://sausozluk.net",
  chatLimit: 20
};