const { createHttp } = require('../utils/http');
const logger = require('../utils/logger');

const baseURL = process.env.JOTOBA_BASE_URL || 'https://jotoba.de/api';
const http = createHttp(baseURL);

function mapWordEntry(entry) {
  const kanji = (entry.kanji && entry.kanji[0] && entry.kanji[0].text) || null;
  const kana = (entry.kana && entry.kana[0] && entry.kana[0].text) || null;
  const reading = kana || (entry.reading && entry.reading.text) || '';
  const surface = kanji || reading;
  const pos = (entry.pos && entry.pos[0]) || (entry.senses && entry.senses[0] && entry.senses[0].pos && entry.senses[0].pos[0]) || null;
  const meanings = [];
  if (entry.senses) {
    for (const s of entry.senses) {
      if (s.glosses) {
        for (const g of s.glosses) {
          meanings.push({ lang: g.lang || g.language || 'en', gloss: g.text || g.gloss });
        }
      }
    }
  }
  const frequency = entry.frequency || (entry.meta && entry.meta.commonness) || 0;
  const jlpt = (entry.jlpt && entry.jlpt[0]) || null;
  const variants = [];
  if (entry.kanji) variants.push(...entry.kanji.map((k) => k.text));
  if (entry.kana) variants.push(...entry.kana.map((k) => k.text));
  return { surface, reading, pos, meanings, frequency, jlpt, variants };
}

async function suggest(query, { limit = 10 } = {}) {
  try {
    const res = await http.post('/search/words', { query, limit });
    const items = Array.isArray(res.data) ? res.data : res.data.words || res.data.results || [];
    return (items || []).map(mapWordEntry).slice(0, limit);
  } catch (e) {
    logger.warn({ e: e.message }, 'primary suggest failed, trying GET');
    try {
      const res2 = await http.get('/search/words', { params: { query, limit } });
      const items = Array.isArray(res2.data) ? res2.data : res2.data.words || res2.data.results || [];
      return (items || []).map(mapWordEntry).slice(0, limit);
    } catch (e2) {
      logger.error({ err: e2.message }, 'suggest failed');
      return [];
    }
  }
}

async function define(query) {
  try {
    const res = await http.post('/search/words', { query, limit: 20 });
    const items = Array.isArray(res.data) ? res.data : res.data.words || res.data.results || [];
    return (items || []).map(mapWordEntry);
  } catch (e) {
    logger.error({ err: e.message }, 'define failed');
    return [];
  }
}

module.exports = { suggest, define };