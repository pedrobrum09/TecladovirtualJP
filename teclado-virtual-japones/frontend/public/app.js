import { setLang } from './i18n.js';
import { initIME } from './ime.js';

const scriptSelect = document.getElementById('scriptSelect');
const langSelect = document.getElementById('langSelect');

scriptSelect.value = localStorage.getItem('tvj.script') || 'hiragana';
langSelect.value = localStorage.getItem('tvj.lang') || 'pt';

scriptSelect.addEventListener('change', (e) => {
  localStorage.setItem('tvj.script', e.target.value);
  const ev = new CustomEvent('scriptChange', { detail: e.target.value });
  window.dispatchEvent(ev);
});

langSelect.addEventListener('change', (e) => setLang(e.target.value));

window.addEventListener('resize', () => {
  const bs = document.getElementById('bottomSheet');
  if (!window.matchMedia('(max-width: 599px)').matches) bs.setAttribute('aria-hidden', 'true');
});

document.addEventListener('DOMContentLoaded', () => {
  initIME();
});