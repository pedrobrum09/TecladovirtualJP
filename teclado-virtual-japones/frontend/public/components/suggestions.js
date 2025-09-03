export function renderSuggestions(container, items, selected = 0) {
  container.innerHTML = '';
  items.forEach((it, idx) => {
    const div = document.createElement('div');
    div.className = 'suggestion';
    div.setAttribute('role', 'option');
    div.setAttribute('aria-selected', idx === selected ? 'true' : 'false');
    div.tabIndex = -1;
    div.dataset.index = String(idx);

    const surface = document.createElement('div');
    surface.className = 'suggestion__surface';
    surface.textContent = it.surface;

    const reading = document.createElement('div');
    reading.className = 'suggestion__reading';
    reading.textContent = it.reading;

    const pos = document.createElement('div');
    pos.className = 'suggestion__pos';
    pos.textContent = it.pos || '';

    div.append(surface, reading, pos);
    div.addEventListener('click', () => {
      container.dispatchEvent(new CustomEvent('suggestionSelected', { detail: { item: it, index: idx } }));
    });

    container.appendChild(div);
  });
}

export function nextIndex(current, items, step) {
  if (!items.length) return 0;
  return (current + step + items.length) % items.length;
}