const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf, errors } = format;
const morgan = require("morgan");

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

const logger = createLogger({
  level: "info",
  format: combine(timestamp(), errors({ stack: true }), logFormat),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "logs/error.log", level: "error" }),
    new transports.File({ filename: "logs/combined.log" })
  ]
});

const requestsLogger = morgan(":method :url :status :response-time ms", {
  stream: {
    write: (message) => {
      logger.info(message.trim());
    }
  }
});

module.exports = { logger, requestsLogger };
