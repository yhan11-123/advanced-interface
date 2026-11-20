// Week 09 sketches: the mechanics every navigation sketch shares.
// N.init({ names, onPick(place, prev, animate), onFold(state, animate), side: 'open' })
//  - links with [data-place] are the places (sidebar rows and tabs); the picked ones get aria-current="page"
//  - buttons with [data-fold] fold the sidebar (#side); they carry aria-expanded and aria-controls
//  - .view b shows the picked place's name; [data-i="name"] gets an icon
//  - a switch at the bottom right: Open / Rail, Badge / Icon / Text
//  - ?pick=, ?rail, ?open, ?demo= (picks after 700ms) for stills and motion checks
// N.loop(step) runs step(dt) every frame while it returns true or while N.wake(ms) asks; N.spring, N.rel, N.calm help.
window.N = (() => {
  const stage = document.querySelector('.stage');
  const root = document.documentElement;
  const calm = matchMedia('(prefers-reduced-motion: reduce)');
  const fitNow = () => { const w = parseFloat(getComputedStyle(root).getPropertyValue('--w')), h = parseFloat(getComputedStyle(root).getPropertyValue('--h')); root.style.setProperty('--fit', Math.min(innerWidth / w, innerHeight / h, 1.6)); };
  fitNow();
  const fit = () => parseFloat(getComputedStyle(root).getPropertyValue('--fit')) || 1;

  const P = {
    home: '<path d="M4 11 L12 4 L20 11 V20 H4 Z"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 L20.5 20.5"/>',
    heart: '<path d="M12 20 C5 15 3 11.5 3 8.7 C3 6 5 4 7.6 4 C9.5 4 11 5.2 12 6.8 C13 5.2 14.5 4 16.4 4 C19 4 21 6 21 8.7 C21 11.5 19 15 12 20 Z"/>',
    bell: '<path d="M6 17 V11 a6 6 0 0 1 12 0 V17 L19.5 18.5 H4.5 Z M10 20.5 a2 2 0 0 0 4 0 M12 3 V5"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4.5 20.5 a7.5 7.5 0 0 1 15 0"/>',
    chart: '<path d="M4 4 V20 H20 M7 15 L11 11 L14 13.5 L19.5 7.5 M15.5 7.5 H19.5 V11.5"/>',
    receipt: '<path d="M6 3 H18 V21 L16 19.5 L14 21 L12 19.5 L10 21 L8 19.5 L6 21 Z M9 8 H15 M9 11.5 H15 M9 15 H13"/>',
    bike: '<circle cx="6" cy="16" r="3.5"/><circle cx="18" cy="16" r="3.5"/><path d="M6 16 L9.5 9 H15 L18 16 M9.5 9 L12.5 16 H6 M14 6 H16.5"/>',
    swim: '<path d="M3 17 c2 0 2-1.5 4.5-1.5 S10 17 12 17 s2.5-1.5 4.5-1.5 S19 17 21 17 M3 20.5 c2 0 2-1.5 4.5-1.5 S10 20.5 12 20.5 s2.5-1.5 4.5-1.5 S19 20.5 21 20.5 M6 13 L11 8.5 L14.5 11.5 L17 9.5"/><circle cx="17.5" cy="5.5" r="2"/>',
    sleep: '<circle cx="11" cy="13" r="7.5"/><path d="M8 12 h2 M12.5 12 h2 M9 16 a2.5 2.5 0 0 0 4 0 M16 3.5 h4 l-4 4 h4"/>',
    muscle: '<path d="M5 19 C4 14 5 8 8 5 L11 6.5 L10 9 L12 10 C14 8.5 17.5 9 19 11.5 C20.5 14.5 18.5 19 14 19 Z"/>',
    tennis: '<circle cx="12" cy="12" r="8"/><path d="M5.5 7.5 C9 9 9 15 5.5 16.5 M18.5 7.5 C15 9 15 15 18.5 16.5"/>',
    rope: '<circle cx="12" cy="5" r="2"/><path d="M12 7.5 V14 L9 19 M12 14 L15 19 M8 10.5 H16 M5 9 C4 15 8 21 12 21 C16 21 20 15 19 9"/>',
    pulse: '<path d="M3 12 H7 L9.5 6 L13.5 18 L16 12 H21"/>',
    message: '<path d="M4 5 H20 V16 H10 L6 19.5 V16 H4 Z"/>',
    tasks: '<path d="M9 6 H20 M9 12 H20 M9 18 H20 M4 6 l1.2 1.2 L7 5 M4 12 l1.2 1.2 L7 11 M4 18 l1.2 1.2 L7 17"/>',
    folder: '<path d="M3.5 6 H9.5 L11.5 8 H20.5 V18.5 H3.5 Z"/>',
    grid: '<rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/>',
    doc: '<path d="M6 3 H14 L18 7 V21 H6 Z M14 3 V7 H18 M9 12 H15 M9 15.5 H15"/>',
    tag: '<path d="M3.5 12 V4 H11.5 L20.5 13 L12.5 21 Z"/><circle cx="7.5" cy="8" r="1.3"/>',
    book: '<path d="M4 5 C7 4 10 4.5 12 6 C14 4.5 17 4 20 5 V19 C17 18 14 18.5 12 20 C10 18.5 7 18 4 19 Z M12 6 V20"/>',
    star: '<path d="M12 3.5 L14.6 9 L20.5 9.6 L16 13.6 L17.3 19.5 L12 16.5 L6.7 19.5 L8 13.6 L3.5 9.6 L9.4 9 Z"/>',
    check: '<path d="M5 12.5 L10 17.5 L19 7"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5 V12 L15 14"/>',
    play: '<path d="M8 5 L19 12 L8 19 Z"/>',
    snow: '<path d="M12 3 V21 M4.2 7.5 L19.8 16.5 M4.2 16.5 L19.8 7.5"/>',
    lock: '<rect x="5" y="11" width="14" height="9.5" rx="2"/><path d="M8 11 V8 a4 4 0 0 1 8 0 V11"/>',
    up: '<path d="M7 17 L17 7 M9 7 H17 V15"/>',
    chevron: '<path d="M14.5 6 L8.5 12 L14.5 18"/>',
    compass: '<circle cx="12" cy="12" r="8.5"/><path d="M15.5 8.5 L13.5 13.5 L8.5 15.5 L10.5 10.5 Z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 3 V5 M12 19 V21 M3 12 H5 M19 12 H21 M5.6 5.6 L7 7 M17 17 L18.4 18.4 M5.6 18.4 L7 17 M17 7 L18.4 5.6"/>',
    arrow: '<path d="M12 20 V4 M5 11 L12 4 L19 11"/>',
    spark: '<path d="M12 3 L13.8 10.2 L21 12 L13.8 13.8 L12 21 L10.2 13.8 L3 12 L10.2 10.2 Z"/>',
  };
  const icon = name => `<svg viewBox="0 0 24 24" aria-hidden="true">${P[name] || ''}</svg>`;
  const fillIcons = (el = document) => el.querySelectorAll('[data-i]').forEach(s => { if (!s.querySelector('svg')) s.insertAdjacentHTML('afterbegin', icon(s.dataset.i)); });

  // the frame loop
  let raf = 0, last = 0, until = 0; const steps = [];
  const frame = now => {
    const dt = Math.min(.032, (now - last) / 1000 || .016); last = now;
    let more = false; for (const s of steps) if (s(dt, now)) more = true;
    raf = (more || now < until) ? requestAnimationFrame(frame) : 0;
  };
  const wake = (ms = 600) => { until = Math.max(until, performance.now() + ms); if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } };
  const loop = fn => { steps.push(fn); wake(300); };
  // semi-implicit spring, a few substeps so stiff ones stay stable
  const spring = (s, target, k, z, dt, n = 4) => { const w = Math.sqrt(k), h = dt / n; for (let i = 0; i < n; i++) { s.v += (-k * (s.x - target) - 2 * z * w * s.v) * h; s.x += s.v * h; } return Math.abs(s.x - target) > .2 || Math.abs(s.v) > 2; };
  // rect of el relative to ref, in unscaled stage pixels
  const rel = (el, ref) => { const a = el.getBoundingClientRect(), b = ref.getBoundingClientRect(), f = fit(); return { x: (a.left - b.left) / f, y: (a.top - b.top) / f, w: a.width / f, h: a.height / f, cx: (a.left + a.width / 2 - b.left) / f, cy: (a.top + a.height / 2 - b.top) / f }; };

  let opts = {}, ctl = [];
  const current = () => stage.querySelector('[data-place][aria-current]')?.dataset.place;
  const go = (place, animate = true) => {
    const prev = current();
    stage.querySelectorAll('[data-place]').forEach(a => a.dataset.place === place ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current'));
    const v = stage.querySelector('.view b'); if (v && opts.names) v.textContent = opts.names[place];
    opts.onPick && opts.onPick(place, prev, animate && !calm.matches);
    wake(700);
  };
  const fold = (state, animate = true) => {
    stage.dataset.side = state;
    const open = state === 'open', label = open ? 'Collapse sidebar' : 'Expand sidebar';
    stage.querySelectorAll('[data-fold]').forEach(b => { b.setAttribute('aria-expanded', String(open)); b.setAttribute('aria-label', label); b.title = label; });
    stage.querySelectorAll('#side [data-place]').forEach(a => { const l = a.querySelector('.lbl'); open || !l ? a.removeAttribute('title') : (a.title = l.textContent.trim()); });
    ctl.forEach(b => b.dataset.side && b.setAttribute('aria-pressed', String(b.dataset.side === state)));
    opts.onFold && opts.onFold(state, animate && !calm.matches);
    wake(900);
  };

  const init = o => {
    opts = o || {};
    fillIcons();
    addEventListener('resize', () => { fitNow(); wake(); });
    // the switch
    const pill = document.createElement('div'); pill.className = 'ctl-pill'; pill.setAttribute('role', 'group'); pill.setAttribute('aria-label', 'Sketch controls');
    pill.innerHTML = '<button type="button" data-side="open">Open</button><button type="button" data-side="rail">Rail</button><i></i><button type="button" data-slot="badge">Badge</button><button type="button" data-slot="icon">Icon</button><button type="button" data-slot="text">Text</button>';
    document.body.append(pill); ctl = [...pill.querySelectorAll('button')];
    ctl.forEach(b => b.addEventListener('click', () => {
      if (b.dataset.side) return fold(b.dataset.side);
      stage.dataset.slot = b.dataset.slot; ctl.forEach(x => x.dataset.slot && x.setAttribute('aria-pressed', String(x === b)));
      opts.onSlot && opts.onSlot(b.dataset.slot); wake(500);
    }));
    stage.dataset.slot = stage.dataset.slot || 'badge';
    ctl.forEach(x => x.dataset.slot && x.setAttribute('aria-pressed', String(x.dataset.slot === stage.dataset.slot)));
    stage.querySelectorAll('[data-place]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); if (!a.hasAttribute('aria-current')) go(a.dataset.place); }));
    stage.querySelectorAll('[data-fold]').forEach(b => b.addEventListener('click', () => fold(stage.dataset.side === 'open' ? 'rail' : 'open')));
    stage.addEventListener('transitionrun', () => wake(700));
    const q = new URLSearchParams(location.search);
    fold(q.has('rail') ? 'rail' : q.has('open') ? 'open' : (opts.side || 'open'), false);
    go(q.get('pick') || current() || stage.querySelector('[data-place]').dataset.place, false);
    if (q.get('demo')) setTimeout(() => go(q.get('demo')), 700);
  };

  return { init, go, fold, loop, wake, spring, rel, icon, fillIcons, calm, stage, fit, current };
})();
