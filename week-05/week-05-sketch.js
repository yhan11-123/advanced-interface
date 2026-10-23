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

  if (window.self === window.top) document.querySelector('.back-pill')?.removeAttribute('hidden');
})();
