// Week 07, Set 2 · Drip: the folding toolbar, after the user's sketch.
//   Step 1: one main toolbar.
//   Step 2: press a main tool that holds more tools. It stays at the end of its row as a coloured disc;
//           its tools open in a secondary toolbar of the same colour on the row below (not joined to it), and every main tool
//           after it travels down to join that secondary bar on its right by a bridge. Bars and
//           bridges are drawn as one ink shape, melted together (goo), so they read as one body. Press a main tool on
//           a lower row and it folds again, one more row down.
// Everything is placed by one layout and moved there on one soft spring (constants from the CSS).
//   makeCascade(el, { groups, open, align, content, still })
//     groups: [{ name, tools: [[key, name], ...] }]   open: group indexes   still: draw once, no motion
window.makeCascade = (root, cfg) => {
  const css = getComputedStyle(document.documentElement), T = n => parseFloat(css.getPropertyValue(n));
  const S = { btn: T('--btn'), bar: T('--bar-h'), pad: T('--pad'), gap: T('--gap'), tier: T('--tier-gap'), join: T('--join'), neck: T('--neck'), bridge: T('--bridge'), frame: T('--frame') || 0,
    k: T('--spring-k'), z: T('--spring-zeta'), stagger: T('--stagger'), pipeT: T('--pipe-time'), back: T('--fold-back-wait') || 120 };
  // pair colours: an open tool and its bar share one (nothing else joins them); each open pair gets a different one
  const PAL = [1, 2, 3, 4].map(n => css.getPropertyValue('--pair-' + n).trim()).filter(Boolean);
  const colour = {};
  const calm = matchMedia('(prefers-reduced-motion: reduce)');
  const still = !!cfg.still, ICON = cfg.icons, groups = cfg.groups;
  let open = [...(cfg.open || [])].sort((a, b) => a - b), align = cfg.align || 'center';
  const chosen = groups.map((g, i) => (cfg.chosen && cfg.chosen[i]) || 0);
  root.classList.add('cascade'); root.dataset.content = cfg.content || 'icon';

  const face = (k, name) => `<span class="face"><svg viewBox="0 0 22 22" aria-hidden="true">${ICON[k]}</svg><span class="lbl">${name}</span></span>`;
  const uid = 'goo' + Math.random().toString(36).slice(2);
  root.innerHTML = `<svg class="pipes" aria-hidden="true"><defs><filter id="${uid}" filterUnits="userSpaceOnUse" x="-200" y="-200" width="6000" height="3000"><feGaussianBlur in="SourceGraphic" stdDeviation="${T('--goo')}" result="b"/><feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10"/></filter></defs><g filter="url(#${uid})"></g><g filter="url(#${uid})"></g></svg>`;
  // two melted layers: the ink layer is the whole body's outline; the colour layer lies on top, only
  // where a pair colour belongs, so colours meet ink on a clean edge instead of a smudge
  const svg = root.firstElementChild, [ink, tint] = svg.querySelectorAll('g');
  // main buttons
  const mains = groups.map((g, i) => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'btn' + (g.tools.length > 1 ? ' more' : '');
    b.dataset.g = i; b.innerHTML = face(...g.tools[chosen[i]]);
    if (g.tools.length > 1) { b.setAttribute('aria-expanded', 'false'); b.setAttribute('aria-haspopup', 'true'); }
    root.append(b); return b;
  });
  // secondary bars, one per group with more tools
  const secs = groups.map((g, i) => {
    if (g.tools.length < 2) return null;
    const d = document.createElement('div'); d.className = 'sec'; d.setAttribute('role', 'toolbar'); d.setAttribute('aria-label', g.name + ' tools');
    d.innerHTML = g.tools.map(([k, n], j) => `<button class="btn" type="button" data-g="${i}" data-t="${j}" aria-pressed="${j === chosen[i]}">${face(k, n)}</button>`).join('');
    d.style.opacity = 0; d.style.visibility = 'hidden';
    root.append(d); return d;
  });
  // give a group its pair colour: the one it had before if no other open pair is using it, else the first free
  const paint = g => {
    if (!PAL.length) return;
    const used = open.filter(x => x !== g).map(x => colour[x]);
    if (!colour[g] || used.includes(colour[g])) colour[g] = PAL.find(c => !used.includes(c)) || PAL[0];
    mains[g].style.setProperty('--c', colour[g]); secs[g].style.setProperty('--c', colour[g]);
  };
  open.forEach(paint);
  // bar segments, one per row of main tools, known by the first tool they carry, so a row's bar keeps its
  // identity as the toolbar folds: it is the same piece of bar that travels down and back up
  const segPool = [], segBy = new Map();
  const segEl = f => { if (!segBy.has(f)) { const d = document.createElement('div'); d.className = 'seg-bg'; d.style.opacity = 0; d.dataset.f = f; root.insertBefore(d, svg.nextSibling); segPool.push(d); segBy.set(f, d); } return segBy.get(f); };

  // ---- animated values: every element's x, y, width, opacity on its own spring ----
  const A = new Map();
  const prop = (el, init) => { if (!A.has(el)) A.set(el, { x: init.x, y: init.y, w: init.w, o: init.o ?? 1, vx: 0, vy: 0, vw: 0, vo: 0, t: { ...init }, wait: 0, wq: {} }); return A.get(el); };
  const pipes = new Map();        // group -> { p, vp, to, wait }

  // ---- layout ----
  const label = () => root.dataset.content !== 'icon';
  const wOf = b => b.offsetWidth;
  const secW = g => { const kids = [...secs[g].children]; return S.pad * 2 + kids.reduce((s, b) => s + b.offsetWidth, 0) + S.gap * (kids.length - 1); };
  const layout = () => {
    const L = { main: [], segs: [], secs: {}, joins: [], pipes: [], order: [] };
    let y = 0, segStart = 0, segF = 0, cur = S.pad, tierOrder = [];
    const by = (S.bar - S.btn) / 2;
    groups.forEach((g, i) => {
      L.main[i] = { x: cur, y: y + by, w: wOf(mains[i]) }; tierOrder.push(mains[i]);
      cur += wOf(mains[i]) + S.gap;
      if (open.includes(i)) {
        L.segs.push({ x: segStart, y, w: cur - S.gap + S.pad - segStart, f: segF });
        const ny = y + S.bar + S.tier, sx = L.main[i].x - S.pad, sw = secW(i);
        L.secs[i] = { x: sx, y: ny, w: sw };
        L.pipes.push({ g: i });
        L.order.push(tierOrder); tierOrder = [...secs[i].children];
        y = ny;
        if (i < groups.length - 1) { L.joins.push({ g: i }); segStart = sx + sw + S.join; segF = i + 1; cur = segStart + S.pad; }
        else { segStart = null; }
      }
    });
    if (segStart !== null && (open.length === 0 || open[open.length - 1] < groups.length - 1)) L.segs.push({ x: segStart, y, w: cur - S.gap + S.pad - segStart, f: segF });
    L.order.push(tierOrder);
    // the whole cascade's extent, then alignment inside the root's width
    const right = Math.max(...L.segs.map(s => s.x + s.w), ...Object.values(L.secs).map(s => s.x + s.w));
    L.w = right; L.h = y + S.bar;
    // never past the left edge: when it is wider than the room (labels on, several rows open) it starts at
    // the left and the page scrolls sideways for the rest
    const W = root.clientWidth, off = Math.max(0, align === 'left' ? 0 : align === 'right' ? W - right : (W - right) / 2);
    root.style.minWidth = right + 'px';
    L.main.forEach(p => p.x += off); L.segs.forEach(p => p.x += off); Object.values(L.secs).forEach(p => p.x += off);
    return L;
  };

  // ---- apply a layout: set every target; new things start where they come from ----
  let L = null;
  const apply = (instant) => {
    const prev = L; L = layout();
    const now = performance.now(), spreadAfter = S.pipeT * .6;
    // main buttons. Folding out, the ones that move set off one after another, left to right; folding
    // back is the same played backwards: they set off right to left, once the bar has begun to close
    const movers = [];
    mains.forEach((b, i) => {
      const t = L.main[i], a = prop(b, { ...t, w: t.w });
      if (Math.abs(a.t.y - t.y) > 1 || Math.abs(a.t.x - t.x) > 1) movers.push([a, t.y < a.t.y - 1]);
      a.t = { ...t, o: 1 }; a.wait = 0; a.wq = {};
    });
    if (!instant) {
      const up = movers.some(([, u]) => u);
      // a row travels as one solid piece with its bar (no gaps opening between its tools); rows set off one after another
      // In time with the drop of colour: folding out, the row sinks with the drop, then slides right as the bar
      // spreads; folding back, it slides left as the bar draws in, then rises with the drop
      const rows = [...new Set(movers.map(([a]) => Math.round(a.t.y)))];
      movers.forEach(([a]) => {
        const r = rows.indexOf(Math.round(a.t.y)), lag = (up ? rows.length - 1 - r : r) * S.stagger;
        const t0 = now + (up ? S.back : 0) + lag;
        a.wait = 0; a.wq = up ? { x: t0, y: t0 + spreadAfter } : { y: t0, x: t0 + spreadAfter };
      });
    }
    // bar segments behind the main buttons. A new row's bar is the piece of the bar its tools sit on now: it
    // starts there, solid, and travels down with them, so the row is seen to flow out of the bar above.
    // A row that folds back travels up with its tools into the bar it joins, and only melts away there.
    const by = (S.bar - S.btn) / 2, live = new Set();
    L.segs.forEach(s => {
      const d = segEl(s.f), fresh = !A.has(d) || A.get(d).t.o === 0 || A.get(d).dying;
      const a = prop(d, { ...s, o: 0 }); live.add(d);
      if (fresh && prev && !instant) {
        const fa = A.get(mains[s.f]);
        if (fa && A.get(d).t.o === 0) { a.x = fa.x - S.pad; a.y = fa.y - by; a.w = s.w; a.vx = a.vy = a.vw = 0; }
        a.o = 1;
        // it sets off with its first tool
        a.wait = 0; a.wq = { ...(A.get(mains[s.f]).wq || {}) };
      } else {
        a.wait = 0; a.wq = {};
        // a bar that grows (a row coming back up to join it) waits for the row before it reaches out
        if (!instant && prev && s.w > a.t.w + 1) a.wq = { w: now + S.back + spreadAfter };
      }
      a.dying = false; a.t = { ...s, o: 1 };
    });
    segPool.forEach(d => {
      if (live.has(d)) return;
      const a = A.get(d); if (!a || a.t.o === 0) return;
      const f = +d.dataset.f, m = L.main[f];
      if (instant || !m) { a.t = { ...a.t, o: 0 }; return; }
      a.t = { x: m.x - S.pad, y: m.y - by, w: a.t.w, o: 1 }; a.dying = true;
      a.wait = 0; a.wq = { ...(A.get(mains[f]).wq || {}) };
    });
    // secondary bars. Opening, the bar is first a drop of the pressed tool's colour, sitting on the tool: it
    // runs down (the ink neck stretching behind it), then spreads out to the right, and its tools come in.
    // Folding back is the same backwards: tools leave, the bar draws in to a drop, the drop climbs back up
    // into its tool and melts there.
    secs.forEach((d, g) => {
      if (!d) return;
      const isOpen = g in L.secs, m = L.main[g];
      const tuck = { x: m.x - S.pad, y: m.y - by, w: S.bar, o: 0 };
      const a = prop(d, tuck);
      if (isOpen) {
        const opening = a.t.o === 0 || a.dying;
        if (opening && !instant) {
          if (a.t.o === 0) { a.x = tuck.x; a.y = tuck.y; a.w = tuck.w; a.vx = a.vy = a.vw = 0; }
          a.o = 1; a.vo = 0; a.wait = 0; a.wq = { w: now + spreadAfter };
        } else { a.wait = 0; a.wq = {}; }
        if (a.home) { a.home.classList.remove('homing'); a.home = null; }
        a.dying = false; a.t = { ...L.secs[g], o: 1 }; d.style.visibility = '';
        // only a bar that is just opening brings its tools in; a relayout of an open one leaves them be
        if (opening) [...d.children].forEach(c => c.getAnimations().forEach(x => x.cancel()));
        if (opening && !instant && !calm.matches) [...d.children].forEach((c, j) => c.animate?.([{ opacity: 0, transform: 'translateX(-8px)' }, { opacity: 1, transform: 'none' }], { duration: 380, delay: spreadAfter + 160 + j * S.stagger, easing: 'cubic-bezier(.22, 1, .36, 1)', fill: 'backwards' }));
      } else if (a.t.o === 1 && !a.dying && !instant && !calm.matches) {
        const kids = [...d.children];
        kids.forEach((c, j) => c.animate?.([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateX(-8px)' }], { duration: 200, delay: (kids.length - 1 - j) * S.stagger, easing: 'cubic-bezier(.5, 0, .7, .4)', fill: 'forwards' })
        );
        // draws in first, then climbs back; it melts only once it is home
        const t0 = now + S.back;
        a.wait = 0; a.wq = { w: t0, x: t0 + spreadAfter, y: t0 + spreadAfter };
        a.t = { ...tuck, o: 1 }; a.dying = true;
        // its tool keeps the pair colour until the drop is home, then lets it go
        a.home = mains[g]; mains[g].classList.add('homing');
      } else if (!isOpen && !a.dying) { a.t = { ...tuck, o: 0 }; a.wait = 0; a.wq = {}; }
      else if (!isOpen && instant) { a.t = { ...tuck, o: 0 }; a.dying = false; }
    });
    // pipes
    groups.forEach((g, i) => {
      if (!secs[i]) return;
      const p = pipes.get(i) || { p: 0, vp: 0, to: 0, wait: 0 };
      const want = i in L.secs ? 1 : 0;
      // a short beat before the secondary bar swells out; on folding in, the last beat
      if (want !== p.to) p.wait = want ? 0 : (instant ? 0 : now + S.back + S.pipeT * .3);
      p.to = want; pipes.set(i, p);
    });
    if (instant || calm.matches) settle();
  };
  const settle = () => { A.forEach(a => { if (a.dying) { a.dying = false; a.t = { ...a.t, o: 0 }; } if (a.home) { a.home.classList.remove('homing'); a.home = null; } a.wq = {}; Object.assign(a, { x: a.t.x, y: a.t.y, w: a.t.w, o: a.t.o, vx: 0, vy: 0, vw: 0, vo: 0, wait: 0 }); }); pipes.forEach(p => { p.p = p.to; p.vp = 0; }); };

  // ---- draw: place everything where its springs are; pipes and joins from those places ----
  const draw = () => {
    // the root is as tall as the layout, or as what is still on its way back up, whichever is taller
    let hh = L ? L.h : 0; A.forEach((a, el) => { if (a.o > .01 && !el.classList.contains('btn')) hh = Math.max(hh, a.y + S.bar); });
    root.style.height = hh + 'px';
    A.forEach((a, el) => {
      el.style.transform = `translate(${a.x.toFixed(2)}px, ${a.y.toFixed(2)}px)`;
      if (el.classList.contains('seg-bg') || el.classList.contains('sec')) el.style.width = Math.max(0, a.w).toFixed(2) + 'px';
      el.style.opacity = Math.max(0, Math.min(1, a.o)).toFixed(3);
      if (el.classList.contains('sec') && a.o < .02 && a.t.o === 0) el.style.visibility = 'hidden';
    });
    // one ink shape: every bar and every bridge drawn together and melted by the goo filter,
    // so where they meet the edge runs on in one smooth curve
    let html = '', col = '';
    // a coloured bar is drawn --frame inside its ink twin underneath, so the black bar shows round the pair colour
    const bar = (x, y, w, o, c) => { const e = c ? -S.frame : 0; return `<rect x="${(x - e).toFixed(2)}" y="${(y - e).toFixed(2)}" width="${Math.max(0, w + 2 * e).toFixed(2)}" height="${S.bar + 2 * e}" rx="${S.bar / 2 + e}" opacity="${Math.max(0, Math.min(1, o)).toFixed(3)}"${c ? ` style="fill:${c}"` : ''}/>`; };
    segPool.forEach(e => { const a = A.get(e); if (a && a.o > .01) html += bar(a.x, a.y, a.w, a.o); });
    secs.forEach((e, g) => { const a = e && A.get(e); if (a && a.o > .01) { html += bar(a.x, a.y, a.w, a.o); if (colour[g]) col += bar(a.x, a.y, a.w, a.o, colour[g]); } });
    pipes.forEach((p, g) => {
      const m = A.get(mains[g]), s = A.get(secs[g]); if (!m || !s) return;
      // the neck: ink, from the pressed tool to wherever its drop is now, so it stretches as the drop runs
      // down and shortens as it climbs back. Never the pair colour
      if (s.o > .02) {
        const x0 = m.x + S.btn / 2, y0 = m.y + S.btn / 2, x1 = s.x + S.pad + S.btn / 2, y1 = s.y + S.bar / 2, ym = (y0 + y1) / 2;
        if (y1 - y0 > 1) html += `<path d="M${x0} ${y0} C${x0} ${ym} ${x1} ${ym} ${x1} ${y1}" style="fill:none;stroke:var(--ink);stroke-width:${S.neck}px;stroke-linecap:round"/>`;
      }
      // the bridge: a thin ink band from the secondary bar into the main bar after it (no pair colour)
      const segAfter = segPool.find(e => { const a = A.get(e); return a && a.o > .5 && Math.abs(a.y - s.y) < 4 && a.x > s.x; });
      if (segAfter && s.o > .05) {
        const a = A.get(segAfter), bx0 = s.x + s.w - S.bar / 2, bx1 = a.x + S.bar / 2, y = (s.y + (S.bar - S.bridge) / 2).toFixed(2), o = Math.min(1, s.o).toFixed(3);
        // the bridge only forms once the bar has spread out to meet the row after it: no long thread across empty space
        if (bx1 > bx0 && bx1 - bx0 < S.join + S.bar * 1.5) {
          html += `<rect x="${bx0.toFixed(2)}" y="${y}" width="${(bx1 - bx0).toFixed(2)}" height="${S.bridge}" opacity="${o}"/>`;
        }
      }
    });
    ink.innerHTML = html; tint.innerHTML = col;
  };

  // ---- the spring ----
  const K = S.k, Cd = 2 * S.z * Math.sqrt(K);
  let last = performance.now();
  const step = now => {
    const dt = Math.min(.033, (now - last) / 1000); last = now;
    A.forEach(a => {
      if (a.wait && now < a.wait) return;
      if (a.dying && Math.abs(a.x - a.t.x) < 4 && Math.abs(a.y - a.t.y) < 4 && Math.abs(a.w - a.t.w) < 6) { a.dying = false; a.t = { ...a.t, o: 0 }; if (a.home) { a.home.classList.remove('homing'); a.home = null; } }
      for (const q of ['x', 'y', 'w', 'o']) { if (a.wq[q] && now < a.wq[q]) continue; const v = 'v' + q, kq = q === 'o' ? K * 1.6 : K; a[v] += (kq * (a.t[q] - a[q]) - Cd * a[v]) * dt; a[q] += a[v] * dt; }
    });
    // the pipe runs down first when opening; draws back last when closing
    pipes.forEach(p => { if (p.wait && now < p.wait) return; const kp = 1 / (S.pipeT / 1000); p.p += Math.sign(p.to - p.p) * Math.min(Math.abs(p.to - p.p), kp * dt); });
    draw(); requestAnimationFrame(step);
  };

  apply(true); draw();
  if (!still) requestAnimationFrame(step);
  const relayout = () => { apply(still); draw(); };
  (document.fonts?.ready || Promise.resolve()).then(() => { apply(true); draw(); });
  addEventListener('resize', relayout);

  // ---- behaviour (not for stills) ----
  const api = {
    root, mains, secs,
    isOpen: g => open.includes(g),
    toggle: g => {
      if (!secs[g]) return false;
      const was = open.includes(g);
      open = was ? open.filter(x => x !== g) : [...open, g].sort((a, b) => a - b);
      if (!was && open.length > 3) open = open.filter(x => x !== open.find(y => y !== g));   // at most three rows down
      if (!was) paint(g);
      mains.forEach((b, i) => b.hasAttribute('aria-expanded') && b.setAttribute('aria-expanded', String(open.includes(i))));
      apply(false); return !was;
    },
    choose: (g, t) => {
      chosen[g] = t; mains[g].innerHTML = face(...groups[g].tools[t]);
      [...secs[g].children].forEach((b, j) => b.setAttribute('aria-pressed', String(j === t)));
      if (!calm.matches) mains[g].querySelector('svg').animate([{ transform: 'scale(.4) rotate(-20deg)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 360, easing: 'cubic-bezier(.22, 1.2, .36, 1)' });
    },
    setAlign: a => { align = a; apply(false); },
    setContent: c => { root.dataset.content = c; requestAnimationFrame(() => apply(false)); },
    order: () => L.order.flat(),
    chosen
  };
  mains.forEach((b, i) => b.hasAttribute('aria-expanded') && b.setAttribute('aria-expanded', String(open.includes(i))));
  return api;
};
