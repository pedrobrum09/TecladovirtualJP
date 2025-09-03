const rateLimit = require('express-rate-limit');

function createRateLimiter() {
  return rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
    max: Number(process.env.RATE_LIMIT_MAX) || 60,
    standardHeaders: true,
    legacyHeaders: false,
  });
}

module.exports = createRateLimiter;