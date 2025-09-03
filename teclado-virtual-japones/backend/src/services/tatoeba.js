const { createHttp } = require('../utils/http');
const logger = require('../utils/logger');

const baseURL = process.env.TATOEBA_BASE_URL || 'https://tatoeba.org';
const http = createHttp(baseURL);

async function examples(term, { langPref = 'pt,en', limit = 5 } = {}) {
  const langs = langPref.split(',').map((s) => s.trim());
  const res = { items: [] };
  for (const lang of langs) {
    try {
      const r = await http.get('/eng/api_v0/search', {
        params: { from: 'jpn', to: lang, query: term, sort: 'relevance', limit },
      });
      const data = r.data || {};
      const sentences = data.results || data || [];
      for (const s of sentences) {
        const tr = (s.translations || []).find((t) => t.language === lang) || (s.translations || [])[0];
        if (!tr) continue;
        res.items.push({
          id: s.id || s.uuid || null,
          jp: s.text || s.japanese || s.sentence || '',
          reading: null,
          translation: tr.text || tr.sentence || '',
          source: 'tatoeba',
          lang,
        });
        if (res.items.length >= limit) break;
      }
      if (res.items.length >= limit) break;
    } catch (e) {
      logger.warn({ err: e.message, lang }, 'tatoeba fetch failed for lang');
    }
  }
  return res.items.slice(0, limit);
}

module.exports = { examples };