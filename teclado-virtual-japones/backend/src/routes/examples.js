const express = require('express');
const { examples } = require('../services/tatoeba');

const router = express.Router();

router.get('/', async (req, res) => {
  const q = String(req.query.q || '');
  const langPref = String(req.query.langPref || 'pt,en');
  const limit = Math.min(Number(req.query.limit) || 5, 10);
  if (!q) return res.json({ query: q, items: [] });
  const items = await examples(q, { langPref, limit });
  res.json({ query: q, items });
});

module.exports = router;