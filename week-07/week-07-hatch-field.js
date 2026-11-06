// Week 07, Set 1: the highlight behind the toolbar. A field of slanted yellow strokes in stepped bands,
// after a poster of parallelograms: one stroke per slot, bands of a fixed height, each band slid a
// part of a slot past the one above. A stroke's thickness is how near the pointer is (a soft oval);
// strokes catch up at a fixed rate, so a quick pointer leaves a wake; a press sends a band out.
// Every button sits in a clean window, a parallelogram at the strokes' slant, so no icon sits on a
// stroke. A tool that is picked is filled from the field: the strokes inside its window thicken, first
// where it was pressed, then outward, until they close into one solid slanted block; the tool it
// replaces thins back into the field. Windows and blocks never move with the pointer.
// All constants come from the CSS tokens.
//   makeField(bar, { live: true })
//   makeField(bar, { still: { at, trail, ring, windows: [rect], on: [rect, f, ox] } })   one frame, for the states sheet
window.makeField = (bar, opt = {}) => {
  const root = getComputedStyle(document.documentElement), T = n => parseFloat(root.getPropertyValue(n));
  const C = { cw: T('--cell-w'), band: T('--band-h'), slant: T('--slant'), smin: T('--stroke-min'), smax: T('--stroke-max'),
    rx: T('--reach-x'), ry: T('--reach-y'), follow: T('--follow'), rs: T('--ripple-speed'), idle: T('--idle'),
    shift: T('--row-shift') || .5, bx: T('--bleed-x') || 0, by: T('--bleed-y') || 0,
    fillIn: T('--fill-in') || 520, fillOut: T('--fill-out') || 360 };
  const stripe = root.getPropertyValue('--stripe').trim();
  const calm = matchMedia('(prefers-reduced-motion: reduce)');
  const cv = document.createElement('canvas'); cv.className = 'field'; cv.setAttribute('aria-hidden', 'true'); bar.prepend(cv);
  const ctx = cv.getContext('2d');
  let W = 0, H = 0, rows = 1, h = 1, cols = 0, vals = new Float32Array(0), dpr = 1;
  let px = -1e4, py = -1e4, ripples = [];

  const rel = r => [r[0] + C.bx, r[1] + C.by, r[2], r[3]];
  const rectOf = el => [el.offsetLeft + C.bx, el.offsetTop + C.by, el.offsetWidth, el.offsetHeight];
  let windowEls = [], stillWindows = (opt.still?.windows || []).map(rel);
  let fills = opt.still?.on ? [{ rect: rel(opt.still.on[0]), f: opt.still.on[1] ?? 1, dir: 0, ox: (opt.still.on[2] ?? opt.still.on[0][0] + opt.still.on[0][2] / 2) + C.bx }] : [];

  const resize = () => {
    W = bar.offsetWidth + 2 * C.bx; H = bar.offsetHeight + 2 * C.by; dpr = Math.min(2, devicePixelRatio || 1);
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    rows = Math.max(1, Math.round(H / C.band)); h = H / rows;
    const c = Math.ceil(W / C.cw) + 3;
    if (c * rows !== vals.length) { cols = c; vals = new Float32Array(c * rows); }
  };
  // slot centre at mid-band: every band slides a fixed part of a slot further than the one above
  const cx = (i, j) => (j - 1) * C.cw + ((i * C.shift) % 1) * C.cw + C.cw / 2;
  const cy = i => (i + .5) * h;
  const pull = (x0, y0, x, y) => Math.exp(-((x0 - x) ** 2 / (2 * C.rx * C.rx) + (y0 - y) ** 2 / (2 * C.ry * C.ry)));
  const ring = (x0, y0, r, age) => Math.exp(-((Math.hypot(x0 - r[0], y0 - r[1]) - C.rs * age) ** 2) / (2 * 16 * 16)) * Math.max(0, 1 - age / .9);

  const target = (i, j, t, s) => {
    const x0 = cx(i, j), y0 = cy(i);
    let v = C.idle * (.5 + .5 * Math.sin(t * .6 + x0 * .015 + i * .7));
    if (s) {
      if (s.at) v += pull(x0, y0, s.at[0] + C.bx, s.at[1] + C.by);
      if (s.trail) s.trail.forEach(([x, y, w]) => { v = Math.max(v, pull(x0, y0, x + C.bx, y + C.by) * w); });
      if (s.ring) v += ring(x0, y0, [s.ring[0][0] + C.bx, s.ring[0][1] + C.by], s.ring[1]) * .9;
    } else {
      v += pull(x0, y0, px, py);
      for (const r of ripples) v += ring(x0, y0, r, t - r[2]) * .9;
    }
    return Math.min(1, v);
  };

  // a window: the button's rect with a 2px margin, as a parallelogram at the strokes' slant. Fixed: it never
  // moves with the pointer.
  const win = r => { const x = r[0] - 2, y = r[1] - 2, w = r[2] + 4, hh = r[3] + 4, run = C.slant * hh; return [[x - run / 2, y + hh], [x + run / 2, y], [x + w + run / 2, y], [x + w - run / 2, y + hh]]; };
  const poly = p => { ctx.moveTo(p[0][0], p[0][1]); for (let k = 1; k < 4; k++) ctx.lineTo(p[k][0], p[k][1]); ctx.closePath(); };
  const strokeW = v => C.smin + (C.smax - C.smin) * Math.pow(v, 1.4);
  const ease = x => 1 - Math.pow(1 - x, 3);

  const draw = () => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H); ctx.fillStyle = stripe;
    const run = C.slant * h;
    const stroke = (n, w) => { const i = (n / cols) | 0, j = n % cols, x0 = cx(i, j) - w / 2 - run / 2, y = i * h; ctx.moveTo(x0, y + h); ctx.lineTo(x0 + run, y); ctx.lineTo(x0 + run + w, y); ctx.lineTo(x0 + w, y + h); ctx.closePath(); };
    const wins = (windowEls.length ? windowEls.map(rectOf) : stillWindows).map(win);
    const live = fills.filter(f => f.f > .001).map(f => ({ ...f, p: win(f.el ? rectOf(f.el) : f.rect) }));

    // 1. the field, with every button's window (and every block) cut out of it
    ctx.save();
    if (wins.length || live.length) { ctx.beginPath(); ctx.rect(0, 0, W, H); wins.forEach(poly); live.forEach(f => poly(f.p)); ctx.clip('evenodd'); }
    ctx.beginPath();
    for (let n = 0; n < vals.length; n++) { const w = strokeW(vals[n]); if (w >= .4) stroke(n, w); }
    ctx.fill(); ctx.restore();

    // 2. each block: inside its window the strokes thicken, nearest the press first, until they close;
    //    fully grown it is simply the window, solid
    for (const f of live) {
      ctx.beginPath();
      if (f.f >= 1) { poly(f.p); ctx.fill(); continue; }
      const x0 = Math.min(f.p[0][0], f.p[1][0]) - C.cw, x1 = Math.max(f.p[2][0], f.p[3][0]) + C.cw, span = Math.max(1, x1 - x0);
      ctx.save(); poly(f.p); ctx.clip(); ctx.beginPath();
      for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) {
        const x = cx(i, j); if (x < x0 || x > x1) continue;
        const n = i * cols + j, dn = Math.abs(x - f.ox) / span, e = ease(Math.max(0, Math.min(1, f.f * 1.9 - dn * .9)));
        const base = strokeW(vals[n]), w = base + (C.cw * 1.25 - base) * e;
        if (w >= .4) stroke(n, w);
      }
      ctx.fill(); ctx.restore();
    }
  };

  resize();
  if (opt.still) {
    const paint = () => { resize(); for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) vals[i * cols + j] = target(i, j, 1.3, opt.still); draw(); };
    paint(); (document.fonts?.ready || Promise.resolve()).then(paint); addEventListener('resize', paint);
    return { paint };
  }

  // live: follow the pointer anywhere on the page (the field is felt before the row is touched)
  addEventListener('pointermove', e => { const r = bar.getBoundingClientRect(); px = e.clientX - r.left + C.bx; py = e.clientY - r.top + C.by; });
  document.addEventListener('pointerleave', () => { px = py = -1e4; });
  new ResizeObserver(resize).observe(bar);
  let last = performance.now();
  const frame = now => {
    const dt = Math.min(.05, (now - last) / 1000), t = now / 1000; last = now;
    const still = calm.matches;
    ripples = ripples.filter(r => t - r[2] < .9);
    for (const f of fills) { if (f.dir > 0) f.f = Math.min(1, f.f + dt * 1000 / C.fillIn); if (f.dir < 0) f.f = Math.max(0, f.f - dt * 1000 / C.fillOut); }
    fills = fills.filter(f => f.dir >= 0 || f.f > 0);
    const k = still ? 1 : 1 - Math.exp(-C.follow * dt);
    for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) { const n = i * cols + j; vals[n] += (target(i, j, still ? 0 : t, null) - vals[n]) * k; }
    draw(); requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
  return {
    ripple: (x, y) => { if (!calm.matches) ripples.push([x + C.bx, y + C.by, performance.now() / 1000]); },
    resize,
    // the buttons whose slots stay empty
    setWindows: els => { windowEls = [...els]; },
    // pick a button: its slots fill from x (relative to the row; its middle if not given); the last one thins away
    select: (el, x, instant) => {
      fills.forEach(f => { if (f.el !== el) f.dir = -1; });
      let f = fills.find(g => g.el === el);
      if (!f) { f = { el, f: 0, dir: 1, ox: 0 }; fills.push(f); }
      f.dir = 1; f.ox = (x ?? el.offsetLeft + el.offsetWidth / 2) + C.bx;
      if (instant || calm.matches) { f.f = 1; fills.forEach(g => { if (g !== f) g.f = 0; }); }
    }
  };
};
