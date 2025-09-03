function baseMatchScore(reading, normalizedKana) {
  if (!reading || !normalizedKana) return 0;
  if (reading === normalizedKana) return 1;
  if (reading.startsWith(normalizedKana)) return 0.82;
  if (normalizedKana.startsWith(reading)) return 0.75;
  let lcs = 0;
  const a = reading;
  const b = normalizedKana;
  const dp = Array(a.length + 1)
    .fill(0)
    .map(() => Array(b.length + 1).fill(0));
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  lcs = dp[a.length][b.length];
  return lcs / Math.max(a.length, b.length) * 0.7;
}

function freqScore(freq = 0, jlpt) {
  let s = 0;
  if (typeof freq === 'number') s += Math.min(1, 1000 / (freq + 1)) * 0.2;
  if (jlpt) {
    const map = { N5: 0.15, N4: 0.12, N3: 0.08, N2: 0.05, N1: 0.03 };
    s += map[jlpt] || 0;
  }
  return s;
}

function kanjiBonus(surface) {
  if (!surface) return 0;
  const hasKanji = /[\u4E00-\u9FFF]/.test(surface);
  return hasKanji ? 0.05 : 0;
}

function rankCandidates(candidates, normalizedKana) {
  const seen = new Set();
  const ranked = [];
  for (const c of candidates || []) {
    const key = `${c.surface}__${c.reading}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const score = baseMatchScore(c.reading, normalizedKana) + freqScore(c.frequency, c.jlpt) + kanjiBonus(c.surface);
    ranked.push({ ...c, score: Number(score.toFixed(4)) });
  }
  ranked.sort((a, b) => b.score - a.score);
  return ranked;
}

module.exports = { rankCandidates };