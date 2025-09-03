import { api } from '../api.js';
import { t } from '../i18n.js';

function tableFromConjugations(conj) {
  if (!conj || !conj.plain) return '';
  const rows = [];
  const add = (k, v) => rows.push(`<tr><th>${k}</th><td>${v || ''}</td></tr>`);
  add('辞書形', conj.base?.reading || '');
  add('非過去', conj.plain.present);
  add('否定', conj.plain.negative);
  add('過去', conj.plain.past);
  add('否定過去', conj.plain.negativePast);
  add('て形', conj.plain.te);
  if (conj.plain.potential) add('可能', conj.plain.potential);
  if (conj.plain.passive) add('受身', conj.plain.passive);
  if (conj.plain.causative) add('使役', conj.plain.causative);
  if (conj.plain.causativePassive) add('使役受身', conj.plain.causativePassive);
  if (conj.plain.volitional) add('意向', conj.plain.volitional);
  if (conj.plain.imperative) add('命令', conj.plain.imperative);
  if (conj.plain.conditional) {
    add('たら', conj.plain.conditional.tara);
    add('ば', conj.plain.conditional.ba);
  }
  if (conj.plain.desiderative) add('〜たい', conj.plain.desiderative);
  return `<table class="table">${rows.join('')}</table>`;
}

export async function renderDetails(container, item) {
  if (!item) { container.innerHTML = ''; return; }
  let conjHtml = '';
  if (/(verb|adj)/i.test(item.pos || '')) {
    const pos = /adj/i.test(item.pos || '') ? 'adjective' : 'verb';
    const payload = { lemma: item.surface, reading: item.reading, pos, class: undefined };
    try {
      const r = await fetch('http://localhost:3001/api/conjugate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).then((x) => x.json());
      conjHtml = `<h3>${t('conjugations')}</h3>` + tableFromConjugations(r);
    } catch {}
  }
  let examples = [];
  try {
    const ex = await api.examples(item.surface, 'pt,en', 5);
    examples = ex.items || ex;
  } catch {}
  const examplesHtml = examples.length
    ? `<h3>${t('examples')}</h3>` + examples.map((e) => `<p><ruby>${e.jp}</ruby><br/><span style="color:#94a3b8">${e.translation}</span></p>`).join('')
    : '';
  container.innerHTML = `<div><div style="font-size:20px">${item.surface}・${item.reading}</div>${conjHtml}${examplesHtml}</div>`;
}