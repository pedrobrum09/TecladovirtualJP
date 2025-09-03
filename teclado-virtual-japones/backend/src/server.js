require('dotenv').config();
const express = require('express');
const cors = require('cors');
const logger = require('./utils/logger');
const createRateLimiter = require('./middleware/rateLimit');
const cacheMiddleware = require('./middleware/cache');
const errorHandler = require('./middleware/error');

const suggestRoute = require('./routes/suggest');
const defineRoute = require('./routes/define');
const conjugateRoute = require('./routes/conjugate');
const examplesRoute = require('./routes/examples');
const kanjiRoute = require('./routes/kanji');

const Kuroshiro = require('kuroshiro');
const KuromojiAnalyzer = require('kuroshiro-analyzer-kuromoji');

const app = express();

const origin = process.env.CLIENT_ORIGIN || 'http://localhost:3000';
app.use(cors({ origin, credentials: false }));
app.use(express.json({ limit: '1mb' }));
app.use(createRateLimiter());

app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/api/suggest', cacheMiddleware, suggestRoute);
app.use('/api/define', cacheMiddleware, defineRoute);
app.use('/api/conjugate', conjugateRoute);
app.use('/api/examples', cacheMiddleware, examplesRoute);
app.use('/api/kanji', cacheMiddleware, kanjiRoute);

app.use(errorHandler);

const port = Number(process.env.PORT) || 3001;

const kuroshiro = new Kuroshiro();
(async () => {
  try {
    await kuroshiro.init(new KuromojiAnalyzer());
    app.locals.kuroshiro = kuroshiro;
    logger.info('Kuroshiro initialized');
  } catch (e) {
    logger.warn({ err: e.message }, 'Kuroshiro initialization failed');
  }

  app.listen(port, () => {
    logger.info({ port }, 'Server listening');
  });
})();