const wanakana = require('wanakana');

const deadKeys = /[`´^~¨˙˘˚ˇ]/g;

function stripDeadKeys(s) {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(deadKeys, '');
}

function normalizeInput(q, script = 'hiragana') {
  const clean = stripDeadKeys(String(q || '').trim());
  const toKana = script === 'katakana' ? wanakana.toKatakana : wanakana.toHiragana;
  const normalizedKana = toKana(clean, { IMEMode: true, useObsoleteKana: false, customKanaMapping: { "n'": 'ん' } });
  return { normalizedKana };
}

module.exports = { normalizeInput, stripDeadKeys };