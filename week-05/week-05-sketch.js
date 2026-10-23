// Week 05 sketches: the brief's in-place action, the same in every sketch.
//   [data-expand]   opens or closes its [data-item] in place
(() => {
  document.addEventListener('click', e => {
    const ex = e.target.closest('[data-expand]');
    if (ex) {
      const open = ex.getAttribute('aria-expanded') !== 'true';
      ex.setAttribute('aria-expanded', open);
      ex.closest('[data-item]')?.classList.toggle('is-open', open);
    }
  });

  // keep the list at its own width; shrink it whole when the window is narrower
  const stage = document.querySelector('.stage');
  const fit = () => document.documentElement.style.setProperty('--fit', Math.min(1, innerWidth / stage.offsetWidth));
  addEventListener('resize', fit); fit();

  // in the "View larger" popup, a list shorter than the popup sits in its middle, top to bottom;
  // measured with the list as it first shows, so opening an item grows it downward, not both ways
  // (the flag the popup sets, or, if it showed the file as it is, the popup the frame sits in)
  let inViewer = !!window.__viewer;
  try { inViewer ||= !!window.frameElement?.closest('.viewer'); } catch (e) {}
  if (inViewer) {
    const center = () => document.querySelectorAll('.level').forEach(l => {
      l.style.paddingTop = '';
      const kids = [...l.children].filter(k => k.offsetHeight);
      if (!kids.length) return;
      const top = Math.min(...kids.map(k => k.offsetTop)), bottom = Math.max(...kids.map(k => k.offsetTop + k.offsetHeight));
      const free = l.clientHeight - (bottom - top);
      if (free > 0) l.style.paddingTop = parseFloat(getComputedStyle(l).paddingTop) + free / 2 - top + 'px';
    });
    addEventListener('resize', center); center();
    document.fonts?.ready.then(center); addEventListener('load', center);
  }

  if (window.self === window.top) document.querySelector('.back-pill')?.removeAttribute('hidden');
})();
