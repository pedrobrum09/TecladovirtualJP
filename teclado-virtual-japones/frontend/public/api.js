const BASE = (import.meta?.env?.VITE_API || '') || 'http://localhost:3001';

export function withAbortableFetch() {
  let ctrl;
  return async (url) => {
    if (ctrl) ctrl.abort();
    ctrl = new AbortController();
    const r = await fetch(url, { signal: ctrl.signal });
    return r.json();
  };
}

export function debounce(fn, ms) {
  let h;
  return (...args) => {
    clearTimeout(h);
    return new Promise((resolve) => {
      h = setTimeout(async () => resolve(await fn(...args)), ms);
    });
  };
}

const fetchJSON = withAbortableFetch();

export const api = {
  suggest: (q, script, limit = 10) => fetchJSON(`${BASE}/api/suggest?q=${encodeURIComponent(q)}&script=${script}&limit=${limit}`),
  define: (q, includeConjugations = true) => fetchJSON(`${BASE}/api/define?q=${encodeURIComponent(q)}&includeConjugations=${includeConjugations}`),
  examples: (q, langPref = 'pt,en', limit = 5) => fetchJSON(`${BASE}/api/examples?q=${encodeURIComponent(q)}&langPref=${langPref}&limit=${limit}`),
};