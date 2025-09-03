const express = require('express');
const { normalizeInput } = require('../core/normalize');
const { rankCandidates } = require('../core/ranking');
const jotoba = require('../services/jotoba');

const router = express.Router();

router.get('/', async (req, res) => {
  const q = String(req.query.q || '');
  const script = (req.query.script || 'hiragana').toLowerCase();
  const limit = Math.min(Number(req.query.limit) || 10, 20);
  if (!q || q.length < 2) return res.json({ query: q, normalizedKana: '', candidates: [] });
  const { normalizedKana } = normalizeInput(q, script);
  const raw = await jotoba.suggest(normalizedKana, { limit: 40 });
  const candidates = rankCandidates(raw, normalizedKana).slice(0, limit);
  res.json({ query: q, normalizedKana, candidates });
});

module.exports = router;