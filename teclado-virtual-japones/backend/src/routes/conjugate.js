const express = require('express');
const { conjugate } = require('../core/conjugator');

const router = express.Router();

router.post('/', (req, res) => {
  const { lemma, reading, pos, class: klass } = req.body || {};
  if (!pos) return res.status(400).json({ error: 'pos is required' });
  const result = conjugate({ lemma, reading, pos, class: klass });
  res.json(result);
});

module.exports = router;