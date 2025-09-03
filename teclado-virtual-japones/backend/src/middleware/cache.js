const LRU = require('lru-cache');

const cache = new LRU({
  max: 500,
  ttl: 1000 * 60 * 10,
});

function cacheMiddleware(req, res, next) {
  if (req.method !== 'GET') return next();
  const key = req.originalUrl;
  const hit = cache.get(key);
  if (hit) {
    res.setHeader('X-Cache', 'HIT');
    return res.json(hit);
  }
  const json = res.json.bind(res);
  res.json = (body) => {
    try {
      cache.set(key, body);
    } catch (_) {}
    return json(body);
  };
  next();
}

module.exports = cacheMiddleware;