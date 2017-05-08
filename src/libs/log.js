var winston = require('winston');

module.exports = function () {
  var logger = new winston.Logger({
    transports: [
      new winston.transports.File({
        level: 'error',
        filename: __dirname + '/../error.log',
        handleExceptions: true,
        json: false
      }),
      new winston.transports.Console({
        level: 'debug',
        handleExceptions: true,
        colorize: true,
        humanReadableUnhandledException: true
      })
    ],
    exitOnError: false
  });

  logger._stream = {
    write: function (message, encoding) {
      logger.info(message);
    }
  };

  return logger;
};