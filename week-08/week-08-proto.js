// Week 08 deliverables (Melt, Drain): the behaviour both prototypes share. Each page carries its own look,
// motion and spec.
//   form.ctl            radio name="content" (both | text | icon) sets data-content on [data-buttons];
//                       checkbox name="off" turns [data-off] buttons off (disabled, skipped by Tab)
//   [data-name]         an icon-only button takes its data-name as aria-label and title
//   any live button     .is-down while held (pointer, Space or Enter); on release .is-up for 600ms;
//                       'down' / 'up' events bubble from it
//   [role=radiogroup]   single selection: one tab stop, arrows move the pick, aria-checked follows;
//                       a 'pick' event fires on the group with detail { from, to }
//   [data-static]       state samples in the States table: never interactive
// window.P: { calm, onContent(fn), sync() }
(() => {
  const calm = matchMedia('(prefers-reduced-motion: reduce)');
  const live = document.querySelector('[data-buttons]');
  const contentFns = [];

  const name = () => {
    const iconOnly = live.dataset.content === 'icon';
    live.querySelectorAll('[data-name]').forEach(b => {
      if (iconOnly) { b.setAttribute('aria-label', b.dataset.name); b.title = b.dataset.name; }
      else { b.removeAttribute('aria-label'); b.removeAttribute('title'); }
    });
  };
  const setContent = v => {
    const els = [...live.querySelectorAll('button')].filter(b => b.offsetParent);
    const before = els.map(b => b.offsetWidth);
    live.dataset.content = v; name();
    contentFns.forEach(f => f(v));
    if (calm.matches) return;
    els.forEach((b, i) => {
      const w = b.offsetWidth;
      if (Math.abs(w - before[i]) > .5) b.animate([{ width: before[i] + 'px' }, { width: w + 'px' }], { duration: 520, easing: 'cubic-bezier(.3, .7, .2, 1)' });
    });
  };
  name();

  const form = document.querySelector('form.ctl');
  form?.addEventListener('change', e => {
    if (e.target.name === 'content') setContent(e.target.value);
    if (e.target.name === 'off') {
      live.querySelectorAll('[data-off]').forEach(b => { b.disabled = e.target.checked; });
      live.dispatchEvent(new CustomEvent('off', { detail: e.target.checked }));
    }
  });

  // press and release
  const timers = new WeakMap();
  const down = b => { clearTimeout(timers.get(b)); b.classList.remove('is-up'); b.classList.add('is-down'); b.dispatchEvent(new CustomEvent('down', { bubbles: true })); };
  const up = b => {
    if (!b.classList.contains('is-down')) return;
    b.classList.remove('is-down'); b.classList.add('is-up');
    b.dispatchEvent(new CustomEvent('up', { bubbles: true }));
    timers.set(b, setTimeout(() => b.classList.remove('is-up'), 600));
  };
  live.addEventListener('pointerdown', e => {
    const b = e.target.closest('button'); if (!b || b.disabled) return;
    down(b);
    const done = () => { up(b); removeEventListener('pointerup', done); removeEventListener('pointercancel', done); };
    addEventListener('pointerup', done); addEventListener('pointercancel', done);
  });
  live.addEventListener('keydown', e => { if ((e.key === ' ' || e.key === 'Enter') && e.target.matches('button') && !e.repeat) down(e.target); });
  live.addEventListener('keyup', e => { if ((e.key === ' ' || e.key === 'Enter') && e.target.matches('button')) up(e.target); });
  live.addEventListener('focusout', e => { if (e.target.matches?.('button')) up(e.target); });

  // single selection
  live.querySelectorAll('[role=radiogroup]').forEach(g => {
    const radios = () => [...g.querySelectorAll('[role=radio]')];
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
      const list = radios().filter(r => !r.disabled), i = list.indexOf(document.activeElement); if (i < 0) return;
      const n = list.length;
      const to = { ArrowRight: (i + 1) % n, ArrowDown: (i + 1) % n, ArrowLeft: (i - 1 + n) % n, ArrowUp: (i - 1 + n) % n, Home: 0, End: n - 1 }[e.key];
      if (to === undefined) return;
      e.preventDefault(); pick(list[to], true);
    });
  });

  // state samples are pictures, not controls
  document.querySelectorAll('[data-static] button').forEach(b => { b.tabIndex = -1; b.setAttribute('aria-hidden', 'true'); });

  window.P = { calm, onContent: f => contentFns.push(f), live };
  const still = /[?&](still|pose|shot|deep)=/.test(location.search);
  if (window.self === window.top && !still) document.querySelector('.back-pill')?.removeAttribute('hidden');
})();
