const express = require('express');
const { kanjiInfo } = require('../services/kanji');

const router = express.Router();

router.get('/:char', async (req, res) => {
  const ch = String(req.params.char || '').charAt(0);
  if (!ch) return res.status(400).json({ error: 'char required' });
  const info = await kanjiInfo(ch);
  res.json(info);
});

module.exports = router;