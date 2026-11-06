// Strip sketches: fills every [data-ctrl] with the system's control strip, the same in all five.
// The chevron folds the strip down to itself and Siri, and opens it again. Load before week-07-sketch.js.
(() => {
  const icon = d => `<svg viewBox="0 0 20 20" aria-hidden="true">${d}</svg>`;
  const html = `
    <button class="key" type="button" aria-label="Fold control strip" data-fold><svg class="chev" viewBox="0 0 8 12" aria-hidden="true" style="color:var(--ink)"><path d="M6 1L2 6l4 5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
    <button class="key" type="button" aria-label="Brightness">${icon('<circle cx="10" cy="10" r="3.4" fill="currentColor"/><path d="M10 2.5v2M10 15.5v2M2.5 10h2M15.5 10h2M4.7 4.7l1.4 1.4M13.9 13.9l1.4 1.4M4.7 15.3l1.4-1.4M13.9 6.1l1.4-1.4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>')}</button>
    <button class="key" type="button" aria-label="Volume">${icon('<path d="M3 8h3l4-3.5v11L6 12H3z" fill="currentColor"/><path d="M13 7.5a3.5 3.5 0 0 1 0 5M15 5.5a6.5 6.5 0 0 1 0 9" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>')}</button>
    <button class="key" type="button" aria-pressed="false" aria-label="Mute">${icon('<path d="M3 8h3l4-3.5v11L6 12H3z" fill="currentColor"/><path d="M13 7.5l4 5M17 7.5l-4 5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>')}</button>
    <button class="key" type="button" aria-label="Siri"><span class="siri"></span></button>`;
  document.querySelectorAll('[data-ctrl]').forEach(c => {
    c.setAttribute('role', 'toolbar'); c.setAttribute('aria-label', 'Control strip');
    c.innerHTML = html;
    const fold = c.querySelector('[data-fold]');
    fold.addEventListener('click', e => {
      e.stopPropagation();
      const folded = c.toggleAttribute('data-collapsed');
      fold.setAttribute('aria-label', folded ? 'Open control strip' : 'Fold control strip');
      fold.querySelector('path').setAttribute('d', folded ? 'M2 1l4 5-4 5' : 'M6 1L2 6l4 5');
    });
  });
})();
