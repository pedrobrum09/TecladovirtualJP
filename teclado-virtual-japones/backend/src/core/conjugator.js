function endsWithAny(s, arr) {
  return arr.some((x) => s.endsWith(x));
}

const godanEndings = ['う', 'く', 'ぐ', 'す', 'つ', 'ぬ', 'ぶ', 'む', 'る'];

const rowMap = {
  う: { a: 'わ', i: 'い', u: 'う', e: 'え', o: 'お' },
  く: { a: 'か', i: 'き', u: 'く', e: 'け', o: 'こ' },
  ぐ: { a: 'が', i: 'ぎ', u: 'ぐ', e: 'げ', o: 'ご' },
  す: { a: 'さ', i: 'し', u: 'す', e: 'せ', o: 'そ' },
  つ: { a: 'た', i: 'ち', u: 'つ', e: 'て', o: 'と' },
  ぬ: { a: 'な', i: 'に', u: 'ぬ', e: 'ね', o: 'の' },
  ぶ: { a: 'ば', i: 'び', u: 'ぶ', e: 'べ', o: 'ぼ' },
  む: { a: 'ま', i: 'み', u: 'む', e: 'め', o: 'も' },
  る: { a: 'ら', i: 'り', u: 'る', e: 'れ', o: 'ろ' },
};

function splitLastKana(reading) {
  const last = reading.slice(-1);
  const base = reading.slice(0, -1);
  return [base, last];
}

function teFormGodan(reading) {
  if (reading === 'いく') return 'いって';
  const [base, last] = splitLastKana(reading);
  if (['う', 'つ', 'る'].includes(last)) return base + 'って';
  if (['ぬ', 'ぶ', 'む'].includes(last)) return base + 'んで';
  if (last === 'く') return base + 'いて';
  if (last === 'ぐ') return base + 'いで';
  if (last === 'す') return base + 'して';
  return base + 'って';
}

function pastFromTe(te) {
  return te.endsWith('て') ? te.slice(0, -1) + 'た' : te.endsWith('で') ? te.slice(0, -1) + 'だ' : te;
}

function conjugateVerb({ lemma, reading, class: klass }) {
  const plain = {};
  const polite = {};

  if (klass === 'suru' || lemma === 'する' || reading === 'する') {
    plain.present = 'する';
    plain.negative = 'しない';
    const te = 'して';
    plain.te = te;
    plain.past = 'した';
    plain.negativePast = 'しなかった';
    plain.potential = 'できる';
    plain.passive = 'される';
    plain.causative = 'させる';
    plain.causativePassive = 'させられる';
    plain.volitional = 'しよう';
    plain.imperative = 'しろ';
    plain.conditional = { tara: 'したら', ba: 'すれば' };
    plain.desiderative = 'したい';
    polite.present = 'します';
    polite.negative = 'しません';
    polite.past = 'しました';
    polite.negativePast = 'しませんでした';
    polite.volitional = 'しましょう';
    polite.conditional = { ba: 'しますれば' };
    return { base: { lemma, reading }, plain, polite };
  }

  if (klass === 'kuru' || lemma === '来る' || reading === 'くる') {
    plain.present = 'くる';
    plain.negative = 'こない';
    const te = 'きて';
    plain.te = te;
    plain.past = 'きた';
    plain.negativePast = 'こなかった';
    plain.potential = 'こられる';
    plain.passive = 'こられる';
    plain.causative = 'こさせる';
    plain.causativePassive = 'こさせられる';
    plain.volitional = 'こよう';
    plain.imperative = 'こい';
    plain.conditional = { tara: 'きたら', ba: 'くれば' };
    plain.desiderative = 'きたい';
    polite.present = 'きます';
    polite.negative = 'きません';
    polite.past = 'きました';
    polite.negativePast = 'きませんでした';
    polite.volitional = 'きましょう';
    polite.conditional = { ba: 'きますれば' };
    return { base: { lemma, reading }, plain, polite };
  }

  if (klass === 'ichidan') {
    const stem = reading.slice(0, -1);
    plain.present = reading;
    plain.negative = stem + 'ない';
    plain.te = stem + 'て';
    plain.past = stem + 'た';
    plain.negativePast = stem + 'なかった';
    plain.potential = stem + 'られる';
    plain.passive = stem + 'られる';
    plain.causative = stem + 'させる';
    plain.causativePassive = stem + 'させられる';
    plain.volitional = stem + 'よう';
    plain.imperative = stem + 'ろ';
    plain.conditional = { tara: plain.past + 'ら', ba: stem + 'れば' };
    plain.desiderative = stem + 'たい';

    polite.present = stem + 'ます';
    polite.negative = stem + 'ません';
    polite.past = stem + 'ました';
    polite.negativePast = stem + 'ませんでした';
    polite.volitional = stem + 'ましょう';
    polite.conditional = { ba: stem + 'ますれば' };

    return { base: { lemma, reading }, plain, polite };
  }

  if (klass === 'godan' || godanEndings.some((e) => reading.endsWith(e))) {
    const [base, last] = splitLastKana(reading);
    const row = rowMap[last] || rowMap['う'];
    const stemI = base + row.i;
    const stemA = base + row.a;
    const stemE = base + row.e;

    plain.present = reading;
    plain.negative = (last === 'う' ? base + 'わ' : stemA) + 'ない';
    const te = teFormGodan(reading);
    plain.te = te;
    plain.past = pastFromTe(te);
    plain.negativePast = (last === 'う' ? base + 'わ' : stemA) + 'なかった';
    plain.potential = stemE + 'る';
    plain.passive = stemA + 'れる';
    plain.causative = stemA + 'せる';
    plain.causativePassive = stemA + 'せられる';
    plain.volitional = base + row.o + 'う';
    plain.imperative = stemE;
    plain.conditional = { tara: plain.past + 'ら', ba: stemE + 'ば' };
    plain.desiderative = stemI + 'たい';

    polite.present = stemI + 'ます';
    polite.negative = stemI + 'ません';
    polite.past = stemI + 'ました';
    polite.negativePast = stemI + 'ませんでした';
    polite.volitional = stemI + 'ましょう';
    polite.conditional = { ba: stemI + 'ますれば' };

    return { base: { lemma, reading }, plain, polite };
  }

  return { base: { lemma, reading } };
}

function isIAdjective(lemma, pos, klass) {
  if (klass === 'i-adj') return true;
  if (pos && /adjective/i.test(pos)) return true;
  return lemma.endsWith('い');
}

function conjugateAdjective({ lemma, reading, class: klass }) {
  if (isIAdjective(lemma || reading || '', 'adjective', klass)) {
    const stem = (reading || lemma).slice(0, -1);
    return {
      base: { lemma, reading },
      plain: {
        present: reading || lemma,
        negative: stem + 'くない',
        past: stem + 'かった',
        negativePast: stem + 'くなかった',
        te: stem + 'くて',
        adverb: stem + 'く',
        conditional: { tara: stem + 'かったら', ba: stem + 'ければ' },
      },
      polite: {
        present: (reading || lemma) + 'です',
        negative: stem + 'くないです',
        past: stem + 'かったです',
        negativePast: stem + 'くなかったです',
      },
    };
  }
  const base = reading || lemma;
  return {
    base: { lemma, reading },
    plain: {
      present: base + 'だ',
      negative: base + 'じゃない',
      past: base + 'だった',
      negativePast: base + 'じゃなかった',
      te: base + 'で',
      adverb: base + 'に',
      conditional: { tara: base + 'だったら', ba: base + 'なら' },
    },
    polite: {
      present: base + 'です',
      negative: base + 'ではありません',
      past: base + 'でした',
      negativePast: base + 'ではありませんでした',
    },
  };
}

function conjugate(payload) {
  if (!payload || !payload.pos) return {};
  if (/verb/i.test(payload.pos)) return conjugateVerb(payload);
  if (/adj/i.test(payload.pos)) return conjugateAdjective(payload);
  return {};
}

module.exports = { conjugate, conjugateVerb, conjugateAdjective };