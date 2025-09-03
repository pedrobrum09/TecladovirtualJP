import { api, debounce } from './api.js';
import { renderSuggestions, nextIndex } from './components/suggestions.js';

const LS_SCRIPT = 'tvj.script';

const editor = document.getElementById('editor');
const hint = document.getElementById('hint');
const suggestionsEl = document.getElementById('suggestions');
const mobileSheet = document.getElementById('bottomSheet');
const mobileSuggestionsEl = document.getElementById('mobileSuggestions');
const closeSheetBtn = document.getElementById('closeSheet');

let script = localStorage.getItem(LS_SCRIPT) || 'hiragana';
let buffer = '';
let kana = '';
let candidates = [];
let selected = 0;
let sheetOpen = false;

function setScript(s) {
  script = s;
  localStorage.setItem(LS_SCRIPT, s);
  updateHint();
}

function toKana(s) {
  if (window.wanakana) {
    return script === 'katakana' ? window.wanakana.toKatakana(s, { IMEMode: true }) : window.wanakana.toHiragana(s, { IMEMode: true });
  }
  return s;
}

function currentToken() {
  const sel = window.getSelection();
  const text = editor.textContent || '';
  const pos = sel && sel.anchorOffset != null ? sel.anchorOffset : text.length;
  const left = text.slice(0, pos);
  const m = left.match(/[A-Za-z']+$/);
  const start = m ? pos - m[0].length : pos;
  const token = text.slice(start, pos);
  return { start, end: pos, token, text };
}

function replaceRange(s, start, end, insert) {
  return s.slice(0, start) + insert + s.slice(end);
}

const fetchSuggestions = debounce(async () => {
  if (buffer.trim().length < 2) { setCandidates([]); return; }
  try {
    const r = await api.suggest(buffer, script, 10);
    const items = r.candidates || [];
    setCandidates(items);
  } catch {
    setCandidates([]);
  }
}, 150);

function setCandidates(items) {
  candidates = items;
  selected = 0;
  const target = isMobile() ? mobileSuggestionsEl : suggestionsEl;
  renderSuggestions(target, candidates, selected);
  target.addEventListener('suggestionSelected', (e) => applyCandidate(e.detail.item));
  if (isMobile()) openSheet(candidates.length > 0);
  editor.setAttribute('aria-expanded', String(candidates.length > 0));
}

function openSheet(open) {
  sheetOpen = open;
  mobileSheet.setAttribute('aria-hidden', String(!open));
}

function isMobile() { return window.matchMedia('(max-width: 599px)').matches; }

function updateHint() {
  hint.textContent = buffer ? toKana(buffer) : '';
}

function applyCandidate(item) {
  const { start, end, text } = currentToken();
  const insert = item.surface || item.reading || toKana(buffer);
  const next = replaceRange(text, start, end, insert + ' ');
  editor.textContent = next;
  clearBuffer();
  renderDetails(item);
}

async function renderDetails(item) {
  const panel = document.getElementById('details');
  if (!panel) return;
  const mod = await import('./components/detailsPanel.js');
  mod.renderDetails(panel, item);
}

function clearBuffer() {
  buffer = '';
  kana = '';
  setCandidates([]);
  updateHint();
}

function onInput(e) {
  const { token } = currentToken();
  buffer = token.replace(/[`´^~¨]/g, '');
  kana = toKana(buffer);
  updateHint();
  fetchSuggestions();
}

function onKeyDown(e) {
  if (e.key === 'Dead') { e.preventDefault(); return; }
  if (e.ctrlKey && e.key === '/') {
    e.preventDefault();
    const langSel = document.getElementById('langSelect');
    langSel.value = langSel.value === 'pt' ? 'jp' : 'pt';
    langSel.dispatchEvent(new Event('change'));
    return;
  }
  if (e.ctrlKey && (e.key.toLowerCase() === 'k')) {
    e.preventDefault();
    const sel = document.getElementById('scriptSelect');
    sel.value = sel.value === 'hiragana' ? 'katakana' : 'hiragana';
    sel.dispatchEvent(new Event('change'));
    return;
  }
  if (e.key === 'Escape') { e.preventDefault(); clearBuffer(); return; }
  if (candidates.length) {
    if (e.key === 'ArrowDown') { e.preventDefault(); selected = nextIndex(selected, candidates, 1); renderSuggestions(isMobile()?mobileSuggestionsEl:suggestionsEl, candidates, selected); return; }
    if (e.key === 'ArrowUp') { e.preventDefault(); selected = nextIndex(selected, candidates, -1); renderSuggestions(isMobile()?mobileSuggestionsEl:suggestionsEl, candidates, selected); return; }
    if (e.key === ' ' || e.code === 'Space') { e.preventDefault(); selected = nextIndex(selected, candidates, 1); renderSuggestions(isMobile()?mobileSuggestionsEl:suggestionsEl, candidates, selected); return; }
    if (e.key === 'Enter') { e.preventDefault(); applyCandidate(candidates[selected]); return; }
    if (/^[1-9]$/.test(e.key)) { const i = Number(e.key) - 1; if (candidates[i]) { e.preventDefault(); applyCandidate(candidates[i]); return; } }
  }
}

editor.addEventListener('input', onInput);
editor.addEventListener('keydown', onKeyDown);

closeSheetBtn.addEventListener('click', () => openSheet(false));

export function initIME() {
  updateHint();
  setCandidates([]);
}