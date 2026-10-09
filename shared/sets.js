/* ---------------------------------------------------------------
   Advanced Interface - deliverable sets that open in a popup.
   Add <script src="../shared/sets.js?v=1"></script> to a post whose sets are
   .set-box cards (see "A deliverable set" in site.css).
   --------------------------------------------------------------- */
// Deliverable sets: each card opens its set in a popup (a modal <dialog>): the prototypes,
// then the process. Close with the button, Esc, or a click outside. A link to a set
// (#set-somber) opens it too.
(() => {
  const lock = on => document.documentElement.classList.toggle('has-dialog', on);
  for (const box of document.querySelectorAll('.set-box')) {
    const card = box.querySelector('.set-card');
    const dlg = box.querySelector('.set-dialog');
    card.addEventListener('click', () => { dlg.showModal(); lock(true); dlg.querySelector('.set-body').scrollTop = 0; });
    dlg.querySelector('.set-close').addEventListener('click', () => dlg.close());
    dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });   // the backdrop
    dlg.addEventListener('close', () => { lock(false); if (location.hash === '#' + box.id) history.replaceState(null, '', location.pathname + location.search); });
  }
  const fromHash = () => { const box = location.hash && document.querySelector(location.hash + '.set-box'); if (box && !box.querySelector('dialog').open) box.querySelector('.set-card').click(); };
  fromHash(); addEventListener('hashchange', fromHash);
})();
