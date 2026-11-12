// Week 08 sketches: the button's behaviour, the same in every sketch; each sketch carries its own look and motion.
//   .stage[data-content]   a switch at the bottom right sets both | text | icon. Buttons ease their width
//                          from old to new; icon-only buttons get their data-name as aria-label and title.
//   [data-off]             buttons the Disabled switch turns off (disabled, skipped by Tab)
//   any button             .is-down while held (pointer, Space or Enter); on release .is-down goes and
//                          .is-up stays for 700ms, so a sketch can style the press AND the let-go.
//                          --px / --py (0..1) follow the pointer over the button, for lights that track it.
//   [role=radiogroup]      single selection: one tab stop, arrows move the pick; aria-checked follows.
//                          It fires a 'pick' event on the group with detail { from, to } (buttons).
// window.M gives sketches the same springs: M.ease.snap/open/glide/flow/pop, M.dur.*, M.spring, M.calm, M.fit().
(() => {
  const stage = document.querySelector('.stage');
  const calm = matchMedia('(prefers-reduced-motion: reduce)');

  // Springs sampled into linear() (Motion's visualDuration / bounce):
  //   snap .22 / .45  press release     open .32 / .28  something unfolding     glide .42 / .12  sizes
  //   flow .36 / .30  highlights moving  pop .30 / .55   something landing
  const ease = {
    snap: 'linear(0, 0.075, 0.261, 0.466, 0.666, 0.836, 0.977, 1.061, 1.106, 1.122, 1.115, 1.096, 1.071, 1.046, 1.022, 1.006, 0.994, 0.988, 0.985, 0.986, 0.988, 0.991, 0.994, 0.997, 0.999, 1.001, 1.001, 1.002, 1.002, 1.002, 1.001, 1.001, 1, 1, 1)',
    open: 'linear(0, 0.036, 0.12, 0.231, 0.353, 0.475, 0.59, 0.692, 0.779, 0.858, 0.914, 0.957, 0.989, 1.011, 1.025, 1.032, 1.036, 1.035, 1.033, 1.03, 1.025, 1.021, 1.017, 1.013, 1.009, 1.007, 1.004, 1.002, 1.001, 1, 0.999, 0.999, 0.999, 0.999, 0.999, 0.999, 1)',
    glide: 'linear(0, 0.021, 0.072, 0.14, 0.219, 0.302, 0.385, 0.464, 0.538, 0.607, 0.668, 0.722, 0.77, 0.811, 0.846, 0.876, 0.902, 0.923, 0.94, 0.954, 0.965, 0.974, 0.982, 0.987, 0.992, 0.995, 0.997, 0.999, 1, 1.001, 1.002, 1.002, 1.002, 1.002, 1.002, 1.002, 1.002, 1.002, 1.002, 1.001, 1.001, 1)',
    flow: 'linear(0, 0.029, 0.099, 0.193, 0.301, 0.412, 0.52, 0.621, 0.712, 0.79, 0.856, 0.91, 0.953, 0.986, 1.01, 1.026, 1.036, 1.042, 1.044, 1.043, 1.04, 1.036, 1.031, 1.026, 1.021, 1.017, 1.013, 1.009, 1.006, 1.004, 1.002, 1.001, 1, 0.999, 0.998, 0.998, 0.998, 0.998, 0.998, 0.998, 0.999, 0.999, 0.999, 0.999, 1)',
    pop: 'linear(0, 0.043, 0.147, 0.291, 0.454, 0.62, 0.776, 0.912, 1.023, 1.107, 1.163, 1.194, 1.203, 1.195, 1.171, 1.142, 1.108, 1.075, 1.043, 1.016, 0.994, 0.977, 0.966, 0.961, 0.959, 0.961, 0.965, 0.971, 0.978, 0.985, 0.991, 0.997, 1.001, 1.004, 1.007, 1.008, 1.008, 1.008, 1.007, 1.006, 1.005, 1.003, 1.002, 1.001, 1, 0.999, 0.999, 0.998, 0.998, 0.998, 0.999, 0.999, 0.999, 0.999, 1, 1, 1)',
    out: 'cubic-bezier(.4, 0, 1, 1)'
  };
  const dur = { snap: 580, open: 600, glide: 680, flow: 740, pop: 940 };
  for (const k in dur) { document.documentElement.style.setProperty('--' + k, ease[k]); document.documentElement.style.setProperty('--' + k + '-t', dur[k] + 'ms'); }
  const fitOf = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--fit')) || 1;
  const fit = () => document.documentElement.style.setProperty('--fit', Math.min(1, innerWidth / stage.offsetWidth, (innerHeight - 8) / stage.offsetHeight));
  addEventListener('resize', fit); fit();

  const buttons = () => [...stage.querySelectorAll('button')];

  // ---- content: both / text / icon --------------------------------------------------------------
  const name = () => {
    const iconOnly = stage.dataset.content === 'icon';
    buttons().forEach(b => {
      if (!b.dataset.name) return;
      if (iconOnly) { b.setAttribute('aria-label', b.dataset.name); b.title = b.dataset.name; }
      else { b.removeAttribute('aria-label'); b.removeAttribute('title'); }
    });
  };
  const setContent = v => {
    const els = buttons().filter(b => b.offsetParent);
    const before = els.map(b => b.offsetWidth);
    stage.dataset.content = v; name();
    stage.dispatchEvent(new CustomEvent('content', { detail: v }));
    if (calm.matches) return;
    els.forEach((b, i) => {
      const w = b.offsetWidth;
      if (Math.abs(w - before[i]) > .5) b.animate([{ width: before[i] + 'px' }, { width: w + 'px' }], { duration: dur.glide, easing: ease.glide });
    });
    stage.querySelectorAll('.lbl, .ic').forEach(s => s.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 240, delay: 120, easing: 'ease-out', fill: 'backwards' }));
  };
  stage.dataset.content ||= 'both';
  name();

  const setOff = off => {
    stage.querySelectorAll('[data-off]').forEach(b => { b.disabled = off; });
    stage.classList.toggle('is-off', off);
    stage.dispatchEvent(new CustomEvent('off', { detail: off }));
  };

  const pill = document.createElement('div');
  pill.className = 'ctl-pill';
  pill.innerHTML = ['both', 'text', 'icon'].map(k => `<button type="button" data-c="${k}" aria-pressed="${stage.dataset.content === k}">${k === 'both' ? 'Icon + text' : k === 'text' ? 'Text' : 'Icon'}</button>`).join('')
    + '<i aria-hidden="true"></i><button type="button" data-d aria-pressed="false">Disabled</button>';
  pill.setAttribute('role', 'group'); pill.setAttribute('aria-label', 'Sketch controls');
  document.body.append(pill);
  pill.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.c) {
      pill.querySelectorAll('[data-c]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      setContent(b.dataset.c);
    } else {
      const on = b.getAttribute('aria-pressed') !== 'true';
      b.setAttribute('aria-pressed', String(on)); setOff(on);
    }
  });

  // ---- press and release ---------------------------------------------------------------------------
  const upTimers = new WeakMap();
  const down = b => { clearTimeout(upTimers.get(b)); b.classList.remove('is-up'); b.classList.add('is-down'); b.dispatchEvent(new CustomEvent('down', { bubbles: true })); };
  const up = b => {
    if (!b.classList.contains('is-down')) return;
    b.classList.remove('is-down'); b.classList.add('is-up');
    b.dispatchEvent(new CustomEvent('up', { bubbles: true }));
    upTimers.set(b, setTimeout(() => b.classList.remove('is-up'), 700));
  };
  const track = (b, e) => {
    const r = b.getBoundingClientRect();
    b.style.setProperty('--px', ((e.clientX - r.left) / r.width).toFixed(3));
    b.style.setProperty('--py', ((e.clientY - r.top) / r.height).toFixed(3));
  };
  stage.addEventListener('pointerdown', e => {
    const b = e.target.closest('button'); if (!b || b.disabled) return;
    track(b, e); down(b);
    const done = () => { up(b); removeEventListener('pointerup', done); removeEventListener('pointercancel', done); };
    addEventListener('pointerup', done); addEventListener('pointercancel', done);
  });
  stage.addEventListener('pointermove', e => { const b = e.target.closest('button'); if (b) track(b, e); });
  stage.addEventListener('pointerleave', () => buttons().forEach(b => { b.style.removeProperty('--px'); b.style.removeProperty('--py'); }), true);
  stage.addEventListener('keydown', e => {
    if ((e.key === ' ' || e.key === 'Enter') && e.target.matches('button') && !e.repeat) down(e.target);
  });
  stage.addEventListener('keyup', e => { if ((e.key === ' ' || e.key === 'Enter') && e.target.matches('button')) up(e.target); });
  stage.addEventListener('focusout', e => { if (e.target.matches?.('button')) up(e.target); });

  // ---- single selection ----------------------------------------------------------------------------
  stage.querySelectorAll('[role=radiogroup]').forEach(g => {
    const radios = () => [...g.querySelectorAll('[role=radio]')];
    const usable = () => radios().filter(r => !r.disabled);
    const sync = () => radios().forEach(r => r.tabIndex = r.getAttribute('aria-checked') === 'true' ? 0 : -1);
    const pick = (r, focus) => {
      const from = radios().find(x => x.getAttribute('aria-checked') === 'true');
      if (focus) r.focus();
      if (from === r) return;
      radios().forEach(x => x.setAttribute('aria-checked', String(x === r)));
      sync();
      g.dispatchEvent(new CustomEvent('pick', { detail: { from, to: r } }));
    };
    sync();
    g.addEventListener('click', e => { const r = e.target.closest('[role=radio]'); if (r && !r.disabled) pick(r, false); });
    g.addEventListener('keydown', e => {
      const list = usable(), i = list.indexOf(document.activeElement); if (i < 0) return;
      const n = list.length;
      const to = { ArrowRight: (i + 1) % n, ArrowDown: (i + 1) % n, ArrowLeft: (i - 1 + n) % n, ArrowUp: (i - 1 + n) % n, Home: 0, End: n - 1 }[e.key];
      if (to === undefined) return;
      e.preventDefault(); pick(list[to], true);
    });
    g.pickAt = r => pick(r, false);
  });

  // a real spring for values JS drives; starts from the value and velocity it has. Returns a stop function.
  const spring = (from, to, v0, onUpdate, { visual = .36, bounce = .2, done } = {}) => {
    const root = 2 * Math.PI / (visual * 1.2), k = root * root, c = 2 * (1 - bounce) * root;
    let x = from, v = v0, last = performance.now(), id;
    const step = now => {
      const dt = Math.min(.032, (now - last) / 1000); last = now;
      v += (k * (to - x) - c * v) * dt; x += v * dt;
      if (Math.abs(to - x) < .001 && Math.abs(v) < .01) { onUpdate(to, 0); done?.(); return; }
      onUpdate(x, v); id = requestAnimationFrame(step);
    };
    if (calm.matches) { onUpdate(to, 0); done?.(); return () => {}; }
    id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  };

  // move a piece (absolute, inset 0) from the button it sits in into another, sliding its box from the old
  // place to the new one by animating `inset`, so round corners never stretch. Extra keyframes in `mid`
  // (an inset string) let a sketch stretch it on the way. Returns the animation.
  const moveInto = (el, target, { duration = dur.flow, easing = ease.flow, mid } = {}) => {
    const a = el.getBoundingClientRect(), f = fitOf();
    target.prepend(el);
    if (calm.matches) return null;
    const b = el.getBoundingClientRect();
    const t = (a.top - b.top) / f, l = (a.left - b.left) / f, r = (b.right - a.right) / f, bo = (b.bottom - a.bottom) / f;
    const from = `${t}px ${r}px ${bo}px ${l}px`;
    const frames = mid ? [{ inset: from }, { inset: mid(t, r, bo, l), offset: .4 }, { inset: '0px' }] : [{ inset: from }, { inset: '0px' }];
    return el.animate(frames, { duration, easing });
  };

  window.M = { ease, dur, spring, fit: fitOf, calm, stage, moveInto };
  if (window.self === window.top) document.querySelector('.back-pill')?.removeAttribute('hidden');
})();
