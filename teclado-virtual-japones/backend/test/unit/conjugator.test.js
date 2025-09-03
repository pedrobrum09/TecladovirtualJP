const { describe, it, expect } = require('vitest');
const { conjugateVerb, conjugateAdjective } = require('../../src/core/conjugator');

describe('conjugateVerb ichidan', () => {
  it('食べる', () => {
    const r = conjugateVerb({ lemma: '食べる', reading: 'たべる', class: 'ichidan' });
    expect(r.plain.present).toBe('たべる');
    expect(r.plain.past).toBe('たべた');
    expect(r.plain.negative).toBe('たべない');
    expect(r.plain.te).toBe('たべて');
  });
});

describe('conjugateVerb godan', () => {
  it('書く', () => {
    const r = conjugateVerb({ lemma: '書く', reading: 'かく', class: 'godan' });
    expect(r.plain.te).toBe('かいて');
    expect(r.plain.past).toBe('かいた');
    expect(r.plain.negative).toBe('かかない');
    expect(r.plain.volitional).toBe('かこう');
  });
});

describe('adjectives', () => {
  it('高い i-adj', () => {
    const r = conjugateAdjective({ lemma: 'たかい', reading: 'たかい', class: 'i-adj' });
    expect(r.plain.negative).toBe('たかくない');
    expect(r.plain.past).toBe('たかかった');
  });
  it('静か na-adj', () => {
    const r = conjugateAdjective({ lemma: 'しずか', reading: 'しずか', class: 'na-adj' });
    expect(r.plain.present).toBe('しずかだ');
    expect(r.polite.present).toBe('しずかです');
  });
});