// Week 07 sketches: the toolbar's behaviour and motion, the same in every sketch.
//   .stage[data-align]   an align switch (left, center, right) is added at the bottom right; things marked
//                        [data-glide] slide on a spring from where they were to where the new alignment puts them
//   [role=toolbar]       one tab stop; ArrowLeft / ArrowRight (Home, End) move along its buttons
//   [aria-pressed]       a toggle; inside a [data-radio] group only one stays pressed
//   [data-opens=ID]      opens or closes the [data-tier] with that id (a sub-row); aria-expanded follows.
//                        The row unfolds out of the key that opened it, its keys landing one after another;
//                        closing folds them back up into the key, last key first, quicker than it opened.
//   [data-manual]        a button whose pressed state the sketch sets itself (no toggling here)
//   any button           squashes while held and springs back past its size on release
//                        ([data-no-squash] on it or an ancestor opts out); .is-picked for a moment after
//   .said                (optional) says what was pressed: data-say, else aria-label, else its text
// window.M gives sketches the same springs and helpers: M.ease.snap/open/glide/flow/pop, M.dur.*, M.tier(id, open),
// M.fit(), M.calm.
(() => {
  const stage = document.querySelector('.stage');
  const said = document.querySelector('.said');
  const calm = matchMedia('(prefers-reduced-motion: reduce)');
  const say = t => { if (said && t) said.textContent = t; };
  const nameOf = b => (b.dataset.say || b.getAttribute('aria-label') || b.textContent).trim().replace(/\s+/g, ' ');

  // Springs sampled into linear(), Motion's visualDuration / bounce:
  //   snap .22 / .45  press release     open .32 / .28  rows unfolding     glide .42 / .12  alignment
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
  // the same springs as CSS variables, for transitions: var(--pop) over var(--pop-t), and so on
  for (const k in dur) { document.documentElement.style.setProperty('--' + k, ease[k]); document.documentElement.style.setProperty('--' + k + '-t', dur[k] + 'ms'); }
  const fitOf = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--fit')) || 1;

  // keep the picture at its own size; shrink it whole when the window is smaller
  const fit = () => document.documentElement.style.setProperty('--fit', Math.min(1, innerWidth / stage.offsetWidth, (innerHeight - 8) / stage.offsetHeight));
  addEventListener('resize', fit); fit();

  // alignment: measure, change, then slide each [data-glide] from where it was (on `translate`, so it
  // never fights a row's own unfolding, which uses `transform`)
  const glide = change => {
    const els = [...document.querySelectorAll('[data-glide]')].filter(el => el.offsetParent);
    const before = els.map(el => el.getBoundingClientRect().left);
    change();
    if (calm.matches) return;
    const f = fitOf();
    els.forEach((el, k) => {
      const dx = (before[k] - el.getBoundingClientRect().left) / f;
      if (Math.abs(dx) > .5) el.animate([{ translate: `${dx}px 0` }, { translate: '0 0' }], { duration: dur.glide, easing: ease.glide, delay: k * 18, fill: 'backwards' });
    });
  };
  if (stage.dataset.align) {
    const pill = document.createElement('div');
    pill.className = 'align-pill'; pill.setAttribute('role', 'group'); pill.setAttribute('aria-label', 'Alignment');
    const marks = { left: 'M1 2h9M1 6h14M1 10h7', center: 'M4 2h8M1 6h14M5 10h6', right: 'M6 2h9M1 6h14M8 10h7' };
    pill.innerHTML = Object.entries(marks).map(([k, d]) => `<button type="button" data-align-to="${k}" aria-label="Align ${k}" aria-pressed="${stage.dataset.align === k}"><svg viewBox="0 0 16 12" aria-hidden="true"><path d="${d}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></button>`).join('');
    document.body.append(pill);
    pill.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      pill.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      glide(() => { stage.dataset.align = b.dataset.alignTo; });
      say('Aligned ' + b.dataset.alignTo);
    });
  }

  // squash and spring back: held, a button sinks to 94%; let go, it springs past 100% and settles.
  // Uses the `scale` property so it adds to whatever transform a sketch already gives the button.
  const held = new WeakMap();
  document.addEventListener('pointerdown', e => {
    const b = e.target.closest('button');
    if (!b || b.disabled || b.closest('[data-no-squash], .align-pill') || calm.matches) return;
    held.get(b)?.cancel();
    held.set(b, b.animate([{ scale: 1 }, { scale: .94 }], { duration: 90, easing: 'ease-out', fill: 'forwards' }));
    const up = () => {
      const a = held.get(b); if (!a) return;
      const s = parseFloat(getComputedStyle(b).scale) || .94;
      a.cancel(); held.delete(b);
      b.animate([{ scale: s }, { scale: 1 }], { duration: dur.snap, easing: ease.snap });
      removeEventListener('pointerup', up); removeEventListener('pointercancel', up);
    };
    addEventListener('pointerup', up); addEventListener('pointercancel', up);
  });

  // rows: unfold out of their key, fold back into it
  const openerOf = id => document.querySelector(`[data-opens="${id}"]:not(.close)`);
  const kidsOf = tier => [...(tier.querySelector('.tier-in') || tier).children];
  const tier = (id, open) => {
    const t = document.getElementById(id); if (!t) return;
    const was = t.classList.contains('is-open');
    open = open ?? !was;
    document.querySelectorAll(`[data-opens="${id}"]`).forEach(o => o.setAttribute('aria-expanded', String(open)));
    if (open === was) return open;
    const key = openerOf(id);
    const kids = kidsOf(t);
    kids.forEach(k => k.getAnimations().forEach(a => a.cancel()));
    if (open) {
      t.classList.remove('is-leaving'); t.classList.add('is-open');
      if (calm.matches) return open;
      // each key starts where the opening key is, a little above, and lands in place one after another
      const kr = key?.getBoundingClientRect(), f = fitOf();
      kids.forEach((k, i) => {
        const r = k.getBoundingClientRect();
        const dx = kr ? (kr.left + kr.width / 2 - (r.left + r.width / 2)) / f * .35 : 0;
        const dy = kr ? Math.max(-40, (kr.bottom - r.top) / f * .5) : -10;
        k.animate([{ opacity: 0, transform: `translate(${dx}px, ${dy}px) scale(.7)` }, { opacity: 1, transform: 'none' }],
          { duration: dur.open, easing: ease.open, delay: i * 24, fill: 'backwards' });
      });
    } else {
      t.classList.remove('is-open');
      if (calm.matches) return open;
      t.classList.add('is-leaving');
      // quicker than opening, and from the far end back towards the key
      const n = kids.length, last = kids.map((k, i) => k.animate(
        [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-8px) scale(.85)' }],
        { duration: 140, easing: ease.out, delay: (n - 1 - i) * 14, fill: 'forwards' }));
      Promise.all(last.map(a => a.finished)).then(() => {
        if (t.classList.contains('is-open')) return;
        t.classList.remove('is-leaving'); last.forEach(a => a.cancel());
      }).catch(() => {});
    }
    return open;
  };

  // one tab stop per toolbar, arrows inside it
  const usable = bar => [...bar.querySelectorAll('button')].filter(b => !b.disabled && b.getAttribute('aria-disabled') !== 'true' && b.closest('[role=toolbar]') === bar && b.offsetParent);
  document.querySelectorAll('[role=toolbar]').forEach(bar => {
    [...bar.querySelectorAll('button')].filter(b => b.closest('[role=toolbar]') === bar).forEach((b, i) => b.tabIndex = i ? -1 : 0);
    bar.addEventListener('keydown', e => {
      const list = usable(bar), i = list.indexOf(document.activeElement);
      if (i < 0) return;
      const n = list.length;
      const to = { ArrowRight: (i + 1) % n, ArrowLeft: (i - 1 + n) % n, Home: 0, End: n - 1 }[e.key];
      if (to === undefined) return;
      e.preventDefault();
      list.forEach(b => b.tabIndex = -1); list[to].tabIndex = 0; list[to].focus();
    });
  });

  document.querySelectorAll('[data-opens]').forEach(b => b.setAttribute('aria-expanded', String(!!document.getElementById(b.dataset.opens)?.classList.contains('is-open'))));

  document.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b || b.closest('.align-pill') || b.disabled) return;
    if (b.getAttribute('aria-disabled') === 'true') {
      say(nameOf(b) + ' is not available');
      // a small shake: it heard you, it can't
      if (!calm.matches) b.animate([{ translate: '0 0' }, { translate: '-3px 0' }, { translate: '3px 0' }, { translate: '-2px 0' }, { translate: '0 0' }], { duration: 260, easing: 'ease-out' });
      return;
    }
    const bar = b.closest('[role=toolbar]');
    if (bar) { usable(bar).forEach(x => x.tabIndex = -1); b.tabIndex = 0; }
    b.classList.remove('is-picked'); void b.offsetWidth; b.classList.add('is-picked');
    setTimeout(() => b.classList.remove('is-picked'), 500);
    if (b.hasAttribute('data-manual')) return;   // the sketch handles this button's state itself

    if (b.dataset.opens) {
      const open = tier(b.dataset.opens);
      say(nameOf(b) + (open ? ' opened' : ' closed'));
      return;
    }
    if (b.hasAttribute('aria-pressed')) {
      const group = b.closest('[data-radio]');
      if (group) {
        group.querySelectorAll('[aria-pressed]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
        say(nameOf(b));
      } else {
        const on = b.getAttribute('aria-pressed') !== 'true';
        b.setAttribute('aria-pressed', String(on));
        say(nameOf(b) + (on ? ' on' : ' off'));
      }
      return;
    }
    say(nameOf(b));
  });

  // a real spring for values JS drives (a scrubber's position after a fling): it starts from the value
  // and velocity it has, so it can be thrown and caught mid-flight. Returns a stop function.
  const spring = (from, to, v0, onUpdate, { visual = .36, bounce = .2, done } = {}) => {
    const root = 2 * Math.PI / (visual * 1.2), k = root * root, c = 2 * (1 - bounce) * root;
    let x = from, v = v0 * 1000, last = performance.now(), id;
    const step = now => {
      const dt = Math.min(.032, (now - last) / 1000); last = now;
      v += (k * (to - x) - c * v) * dt; x += v * dt;
      if (Math.abs(to - x) < .001 && Math.abs(v) < .01) { onUpdate(to); done?.(); return; }
      onUpdate(x); id = requestAnimationFrame(step);
    };
    if (calm.matches) { onUpdate(to); done?.(); return () => {}; }
    id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  };

  window.M = { ease, dur, tier, spring, fit: fitOf, calm };
  if (window.self === window.top) document.querySelector('.back-pill')?.removeAttribute('hidden');
})();
