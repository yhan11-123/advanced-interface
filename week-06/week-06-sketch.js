// Week 06 sketches: the menu's behaviour, the same in every sketch.
//   .has-sub           opens its .submenu on hover, on click of its item, or on ArrowRight
//   [role=menuitem…]   ArrowUp / ArrowDown move through the menu it sits in (dimmed ones skipped);
//                      ArrowLeft or Escape closes a submenu and goes back to its item
//   picking an item    marks it .is-picked for a moment; a menuitemradio becomes the checked one
//   .said              (optional) says what was picked
(() => {
  const ITEM = '[role^="menuitem"]';
  const ownMenu = el => el.closest('[role="menu"]');
  const itemsOf = menu => [...menu.querySelectorAll(ITEM)].filter(i => ownMenu(i) === menu && i.getAttribute('aria-disabled') !== 'true');
  const said = document.querySelector('.said');
  const timers = new WeakMap();

  const open = (host, focus) => {
    clearTimeout(timers.get(host));
    host.parentElement.querySelectorAll(':scope > .has-sub.is-open').forEach(h => h !== host && close(h));
    host.classList.add('is-open');
    host.querySelector(ITEM).setAttribute('aria-expanded', 'true');
    if (focus) {
      const sub = host.querySelector('.submenu');
      (sub.querySelector('[aria-checked="true"]') || itemsOf(sub)[0])?.focus();
    }
  };
  const close = (host, focus) => {
    host.classList.remove('is-open');
    const it = host.querySelector(ITEM);
    it.setAttribute('aria-expanded', 'false');
    if (focus) it.focus();
  };
  const hostOf = item => item.parentElement.classList.contains('has-sub') && item === item.parentElement.querySelector(ITEM) ? item.parentElement : null;

  document.querySelectorAll('.has-sub').forEach(host => {
    host.querySelector(ITEM).setAttribute('aria-haspopup', 'menu');
    host.querySelector(ITEM).setAttribute('aria-expanded', 'false');
    host.addEventListener('pointerenter', () => open(host));
    host.addEventListener('pointerleave', () => timers.set(host, setTimeout(() => close(host), 300)));
  });
  // pointing at a plain item closes any open submenu beside it
  document.querySelectorAll(ITEM).forEach(it => {
    if (hostOf(it)) return;
    it.addEventListener('pointerenter', () => {
      const menu = ownMenu(it);
      menu.querySelectorAll(':scope > .has-sub.is-open, :scope .has-sub.is-open').forEach(h => { if (ownMenu(h) === menu) close(h); });
    });
  });

  document.addEventListener('click', e => {
    const it = e.target.closest(ITEM);
    if (!it) return;
    if (it.getAttribute('aria-disabled') === 'true') { if (said) said.textContent = it.textContent.trim().split(/\s+/)[0] + ' is not available'; return; }
    const host = hostOf(it);
    if (host) { host.classList.contains('is-open') && e.detail === 0 ? close(host) : open(host, e.detail === 0); return; }
    if (it.getAttribute('role') === 'menuitemradio') ownMenu(it).querySelectorAll('[role="menuitemradio"]').forEach(r => r.setAttribute('aria-checked', String(r === it)));
    if (it.getAttribute('role') === 'menuitemcheckbox') it.setAttribute('aria-checked', String(it.getAttribute('aria-checked') !== 'true'));
    it.classList.remove('is-picked'); void it.offsetWidth; it.classList.add('is-picked');
    setTimeout(() => it.classList.remove('is-picked'), 600);
    if (said) said.textContent = (it.dataset.say || it.querySelector('.label')?.textContent || it.textContent).trim();
  });

  document.addEventListener('keydown', e => {
    const it = e.target.closest?.(ITEM);
    if (!it) return;
    const list = itemsOf(ownMenu(it)), i = list.indexOf(it);
    const go = n => { e.preventDefault(); list[(i + n + list.length) % list.length]?.focus(); };
    if (e.key === 'ArrowDown') go(1);
    else if (e.key === 'ArrowUp') go(-1);
    else if (e.key === 'ArrowRight' && hostOf(it)) { e.preventDefault(); open(hostOf(it), true); }
    else if (e.key === 'ArrowLeft' || e.key === 'Escape') {
      const host = ownMenu(it).closest('.has-sub');
      if (host) { e.preventDefault(); close(host, true); }
    }
  });

  // keep the picture at its own size; shrink it whole when the window is smaller
  const stage = document.querySelector('.stage');
  const fit = () => document.documentElement.style.setProperty('--fit', Math.min(1, innerWidth / stage.offsetWidth, innerHeight / stage.offsetHeight));
  addEventListener('resize', fit); fit();

  if (window.self === window.top) document.querySelector('.back-pill')?.removeAttribute('hidden');
})();
