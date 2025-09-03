const logger = require('../utils/logger');

function errorHandler(err, req, res, next) {
  logger.error({ err, url: req.originalUrl });
  if (res.headersSent) return next(err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Internal Server Error' });
}

module.exports = errorHandler;