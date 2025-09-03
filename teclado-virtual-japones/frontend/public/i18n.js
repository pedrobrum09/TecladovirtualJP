export const strings = {
  pt: {
    script: 'Script',
    uiLang: 'Idioma UI',
    close: 'Fechar',
    suggestions: 'Sugestões',
    conjugations: 'Conjugações',
    examples: 'Exemplos',
  },
  jp: {
    script: '文字種',
    uiLang: 'UI 言語',
    close: '閉じる',
    suggestions: '候補',
    conjugations: '活用',
    examples: '例文',
  }
};

const LS_KEY = 'tvj.lang';
export let currentLang = localStorage.getItem(LS_KEY) || 'pt';

export function setLang(lang) {
  currentLang = lang;
  localStorage.setItem(LS_KEY, lang);
  for (const el of document.querySelectorAll('[data-i18n]')) {
    const k = el.getAttribute('data-i18n');
    el.textContent = strings[currentLang][k] || k;
  }
}

export function t(k) {
  return strings[currentLang][k] || k;
}

document.addEventListener('DOMContentLoaded', () => setLang(currentLang));