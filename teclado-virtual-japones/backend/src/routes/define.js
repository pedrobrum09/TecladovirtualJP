const express = require('express');
const jotoba = require('../services/jotoba');
const { conjugate } = require('../core/conjugator');

const router = express.Router();

function detectClass(entry) {
  const lemma = entry.surface;
  const reading = entry.reading;
  const pos = (entry.pos || '').toLowerCase();
  if (lemma === 'する' || reading === 'する' || pos.includes('suru')) return 'suru';
  if (lemma === '来る' || reading === 'くる' || pos.includes('kuru')) return 'kuru';
  if (pos.includes('ichidan') || pos.includes('v1')) return 'ichidan';
  if (pos.includes('godan') || pos.includes('v5')) return 'godan';
  if (pos.includes('adjective-i') || pos.includes('i-adj')) return 'i-adj';
  if (pos.includes('adjective-na') || pos.includes('na-adj')) return 'na-adj';
  return null;
}

router.get('/', async (req, res) => {
  const q = String(req.query.q || '');
  const includeConj = String(req.query.includeConjugations || 'false') === 'true';
  if (!q) return res.json({ query: q, entries: [] });
  const entries = await jotoba.define(q);
  const mapped = entries.map((e) => {
    const cls = detectClass(e);
    const out = { ...e };
    if (includeConj && e.pos && (/(verb|adj)/i.test(e.pos) || cls)) {
      const pos = /(adj)/i.test(e.pos) ? 'adjective' : 'verb';
      out.conjugations = conjugate({ lemma: e.surface, reading: e.reading, pos, class: cls || (pos === 'verb' ? 'godan' : 'i-adj') });
    }
    return out;
  });
  res.json({ query: q, entries: mapped });
});

module.exports = router;