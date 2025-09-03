const { createHttp } = require('../utils/http');
const logger = require('../utils/logger');

const baseURL = process.env.KANJI_BASE_URL || 'https://kanjiapi.dev/v1';
const http = createHttp(baseURL);

async function kanjiInfo(char) {
  try {
    const r = await http.get(`/kanji/${encodeURIComponent(char)}`);
    const d = r.data || {};
    return {
      kanji: d.kanji || char,
      grade: d.grade || null,
      strokeCount: d.stroke_count || d.strokes || null,
      jlpt: d.jlpt || null,
      meanings: (d.meanings || []).map((m) => ({ lang: 'en', gloss: m })),
      onReadings: d.on_readings || [],
      kunReadings: d.kun_readings || [],
    };
  } catch (e) {
    logger.error({ err: e.message }, 'kanji fetch failed');
    return { kanji: char };
  }
}

module.exports = { kanjiInfo };