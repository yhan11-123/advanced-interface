// Week 03 · Quirky: draws every control on the page and keeps it moving.
// <span class="ctl" data-kind="switch|checkbox|radio"></span> after its input.
// Each control gets two layers: .q-ink, pen scribbles that go round the shape
// several times, and .q-neon, the same shape cut into neon shards on black
// with halftone, a colour-split edge and spray. CSS swaps them on :checked.
// Two loops keep it alive: the lines boil (a displacement filter re-seeded
// every --boil-ms), and the shards of anything that is on change colour
// every --recolor-ms. Both stop under reduced motion.
(function () {
  const NS = 'http://www.w3.org/2000/svg';
  const css = getComputedStyle(document.documentElement);
  const num = n => parseFloat(css.getPropertyValue(n));
  const col = n => css.getPropertyValue(n).trim();

  const INK_MIN = num('--ink-min'), INK_MAX = num('--ink-max');
  const LOOPS = Math.round(num('--loops')), AMP = num('--scribble-amp');
  const BOIL_MS = num('--boil-ms'), BOIL_SCALE = num('--boil-scale'), RECOLOR_MS = num('--recolor-ms');
  const INK = col('--ink'), VOID = col('--void');
  const NEON = ['--neon-pink', '--neon-green', '--neon-cyan', '--neon-orange', '--neon-yellow', '--neon-violet'].map(col);
  const DEEP = [col('--neon-violet'), col('--neon-pink'), col('--neon-cyan'), col('--neon-violet')];
  const LABEL = [col('--neon-yellow'), col('--neon-green'), col('--neon-cyan'), col('--neon-yellow')];
  const BRIGHT = [col('--neon-yellow'), col('--neon-green'), col('--neon-pink'), col('--neon-cyan'), col('--neon-orange')];

  const rnd = (a, b) => a + Math.random() * (b - a);
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const f = v => +v.toFixed(2);
  let uid = 0;
  function el(name, attrs, parent) {
    const e = document.createElementNS(NS, name);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }

  // ---------- shared defs: two boil filters and the halftone ----------
  const host = el('svg', { width: 0, height: 0, 'aria-hidden': 'true', style: 'position:absolute' });
  document.body.prepend(host);
  const defs = el('defs', {}, host);
  function boilFilter(id, scale) {
    const fl = el('filter', { id, x: '-30%', y: '-30%', width: '160%', height: '160%' }, defs);
    const t = el('feTurbulence', { type: 'fractalNoise', baseFrequency: '0.08', numOctaves: '2', seed: '1', result: 'n' }, fl);
    el('feDisplacementMap', { in: 'SourceGraphic', in2: 'n', scale, xChannelSelector: 'R', yChannelSelector: 'G' }, fl);
    return t;
  }
  const turbs = [boilFilter('q-boil', BOIL_SCALE), boilFilter('q-boil-soft', BOIL_SCALE * .55)];
  const dots = el('pattern', { id: 'q-dots', width: 3.2, height: 3.2, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(30)' }, defs);
  el('circle', { cx: 1.6, cy: 1.6, r: .85, fill: VOID }, dots);
  const neonDots = el('pattern', { id: 'q-dots-neon', width: 5, height: 5, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(30)' }, defs);
  el('circle', { cx: 2.5, cy: 2.5, r: 1.1, fill: col('--neon-pink') }, neonDots);

  // ---------- geometry ----------
  const meas = el('path', {}, host);
  function sample(d, n) {
    meas.setAttribute('d', d);
    const L = meas.getTotalLength(), pts = [];
    for (let i = 0; i < n; i++) { const p = meas.getPointAtLength(L * i / n); pts.push([p.x, p.y]); }
    return pts;
  }
  // Catmull-Rom through the points, as cubic beziers
  function smooth(pts, closed) {
    const n = pts.length, at = i => closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))];
    let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
    const last = closed ? n : n - 1;
    for (let i = 0; i < last; i++) {
      const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
      d += ` C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
    }
    return closed ? d + 'Z' : d;
  }
  const circle = (cx, cy, r) => `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0`;
  const rrect = (x, y, w, h, r) => `M${x + r} ${y} H${x + w - r} A${r} ${r} 0 0 1 ${x + w} ${y + r} V${y + h - r} A${r} ${r} 0 0 1 ${x + w - r} ${y + h} H${x + r} A${r} ${r} 0 0 1 ${x} ${y + h - r} V${y + r} A${r} ${r} 0 0 1 ${x + r} ${y} Z`;
  const stroke = w => ({ fill: 'none', stroke: INK, 'stroke-width': f(w), 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });

  // the pen goes round the shape `loops` times without lifting, wandering a little each pass
  function scribble(g, d, { n = 22, loops = LOOPS, amp = AMP, passes = 2 } = {}) {
    const base = sample(d, n);
    for (let p = 0; p < passes; p++) {
      const pts = [], start = Math.floor(rnd(0, n));
      for (let k = 0; k < loops; k++) {
        const dx = rnd(-amp, amp) * .8, dy = rnd(-amp, amp) * .8;
        for (let i = 0; i < n; i++) {
          const [x, y] = base[(start + i) % n];
          pts.push([x + dx + rnd(-amp, amp) * .6, y + dy + rnd(-amp, amp) * .6]);
        }
      }
      el('path', { d: smooth(pts, false), ...stroke(rnd(INK_MIN, INK_MAX) * (p ? .7 : 1)) }, g);
    }
  }
  function spiral(g, cx, cy, r0, r1, turns) {
    const pts = [], n = Math.round(turns * 14), a0 = rnd(0, 6.28);
    for (let i = 0; i <= n; i++) {
      const t = i / n, a = a0 + t * turns * 6.283, r = r0 + (r1 - r0) * t + rnd(-.5, .5);
      pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
    el('path', { d: smooth(pts, false), ...stroke(rnd(INK_MIN, INK_MAX) * .8) }, g);
  }

  // ---------- neon ----------
  const facets = [];
  function shards(g, x, y, w, h, cols, rows, palette) {
    const P = [];
    for (let j = 0; j <= rows; j++) {
      P.push([]);
      for (let i = 0; i <= cols; i++) {
        const edgeX = i === 0 || i === cols, edgeY = j === 0 || j === rows;
        P[j].push([x - 2 + (w + 4) * i / cols + (edgeX ? 0 : rnd(-.32, .32) * w / cols),
                   y - 2 + (h + 4) * j / rows + (edgeY ? 0 : rnd(-.32, .32) * h / rows)]);
      }
    }
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      const a = P[j][i], b = P[j][i + 1], c = P[j + 1][i + 1], d = P[j + 1][i];
      const tris = Math.random() < .5 ? [[a, b, c], [a, c, d]] : [[a, b, d], [b, c, d]];
      for (const t of tris) {
        const s = el('polygon', { points: t.map(p => p.map(f).join(',')).join(' '), fill: pick(palette), stroke: VOID, 'stroke-width': .7, 'stroke-linejoin': 'round' }, g);
        s.dataset.palette = palette === DEEP ? 'deep' : 'bright';
        facets.push(s);
      }
    }
  }
  function neonFace(g, d, box, cols, rows, palette, dotsOpacity) {
    const id = 'q-clip-' + (++uid);
    el('path', { d }, el('clipPath', { id }, defs));
    const inner = el('g', { 'clip-path': `url(#${id})` }, g);
    el('path', { d, fill: VOID }, inner);
    shards(inner, ...box, cols, rows, palette);
    el('rect', { x: box[0] - 3, y: box[1] - 3, width: box[2] + 6, height: box[3] + 6, fill: 'url(#q-dots)', opacity: dotsOpacity }, inner);
    // the colour-split edge
    el('path', { d, fill: 'none', stroke: col('--neon-cyan'), 'stroke-width': 1.3, transform: 'translate(-1.4 .7)' }, g);
    el('path', { d, fill: 'none', stroke: col('--neon-pink'), 'stroke-width': 1.3, transform: 'translate(1.4 -.7)' }, g);
    el('path', { d, fill: 'none', stroke: VOID, 'stroke-width': 1.8 }, g);
  }
  function spray(g, cx, cy, rx, ry, count) {
    for (let i = 0; i < count; i++) {
      const a = rnd(0, 6.283), k = rnd(1.05, 1.5);
      el('circle', { cx: f(cx + Math.cos(a) * rx * k), cy: f(cy + Math.sin(a) * ry * k), r: f(rnd(.35, 1.1)), fill: pick(NEON) }, g);
    }
  }
  const layer = (svg, cls, filter) => el('g', { class: cls, filter: `url(#${filter})` }, svg);

  // ---------- the three controls ----------
  const build = {
    switch(svg) {
      const W = 72, H = 40, R = 14, track = rrect(0, 0, W, H, H / 2);
      Object.assign(svg.dataset, { w: W, h: H });
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      const ink = layer(svg, 'q-ink', 'q-boil');
      scribble(ink, track, { n: 26 });
      const neon = layer(svg, 'q-neon', 'q-boil-soft');
      spray(neon, W / 2, H / 2, W / 2, H / 2, 16);
      neonFace(neon, track, [0, 0, W, H], 5, 2, DEEP, .6);
      const handle = el('g', { class: 'q-handle' }, svg);
      const hInk = layer(handle, 'q-ink', 'q-boil');
      scribble(hInk, circle(H / 2, H / 2, R - 1), { n: 16, amp: AMP * .9 });
      spiral(hInk, H / 2, H / 2, 1, R - 4, 2.2);
      const hNeon = layer(handle, 'q-neon', 'q-boil-soft');
      neonFace(hNeon, circle(H / 2, H / 2, R), [H / 2 - R, H / 2 - R, 2 * R, 2 * R], 3, 3, BRIGHT, .3);
    },
    checkbox(svg) {
      const S = 30, box = rrect(0, 0, S, S, 5);
      svg.setAttribute('viewBox', `0 0 ${S} ${S}`);
      const ink = layer(svg, 'q-ink', 'q-boil');
      scribble(ink, box, { n: 20 });
      scribble(ink, circle(S + 1, -1, 2.6), { n: 9, loops: 2, passes: 1, amp: .7 });
      const neon = layer(svg, 'q-neon', 'q-boil-soft');
      spray(neon, S / 2, S / 2, S / 2, S / 2, 12);
      neonFace(neon, box, [0, 0, S, S], 3, 3, DEEP, .55);
      const tick = [[5, 13.5], [10.5, 18.5], [20.5, 6], [23.5, 9], [10.5, 23.5], [2.5, 16]].map(p => p.map(v => f(v * S / 26)).join(',')).join(' ');
      el('polygon', { points: tick, fill: col('--neon-pink'), transform: 'translate(1.6 1.6)' }, neon);
      const t = el('polygon', { points: tick, fill: col('--neon-yellow'), stroke: VOID, 'stroke-width': 1.4, 'stroke-linejoin': 'round' }, neon);
      t.dataset.palette = 'mark'; facets.push(t);
    },
    radio(svg) {
      const S = 30, c = S / 2, ring = circle(c, c, 14);
      svg.setAttribute('viewBox', `0 0 ${S} ${S}`);
      const ink = layer(svg, 'q-ink', 'q-boil');
      scribble(ink, circle(c, c, 13.5), { n: 20 });
      spiral(ink, c, c, .8, 8, 2.4);
      for (let i = 0; i < 3; i++) {
        const a = rnd(0, 6.283), d = rnd(17.5, 21), r = rnd(1.5, 3.6);
        scribble(ink, circle(c + Math.cos(a) * d, c + Math.sin(a) * d, r), { n: 9, loops: 2, passes: 1, amp: .6 });
      }
      const neon = layer(svg, 'q-neon', 'q-boil-soft');
      spray(neon, c, c, c, c, 14);
      neonFace(neon, ring, [1, 1, 28, 28], 3, 3, DEEP, .55);
      el('circle', { cx: c + 1.3, cy: c + 1.3, r: 6.5, fill: col('--neon-cyan') }, neon);
      const dot = el('circle', { cx: c, cy: c, r: 6.5, fill: col('--neon-yellow'), stroke: VOID, 'stroke-width': 1.4 }, neon);
      dot.dataset.palette = 'mark'; facets.push(dot);
    },
  };

  for (const ctl of document.querySelectorAll('.ctl[data-kind]')) {
    const svg = el('svg', { 'aria-hidden': 'true', focusable: 'false' }, ctl);
    build[ctl.dataset.kind](svg);
    const vb = svg.viewBox.baseVal;
    svg.setAttribute('width', vb.width); svg.setAttribute('height', vb.height);
  }

  // rough rules between rows
  for (const row of document.querySelectorAll('.row + .row')) {
    const svg = el('svg', { class: 'rule', viewBox: '0 0 100 6', preserveAspectRatio: 'none', 'aria-hidden': 'true' });
    row.prepend(svg);
    const pts = [];
    for (let i = 0; i <= 12; i++) pts.push([i * 100 / 12, 3 + rnd(-1.3, 1.3)]);
    el('path', { d: smooth(pts, false), ...stroke(1.1), 'vector-effect': 'non-scaling-stroke', filter: 'url(#q-boil)' }, svg);
  }

  // ---------- the row, when on: a rough black band with halftone, shards and spray ----------
  // Drawn to each row's real size, and again whenever the row changes size.
  const rowShards = [];
  function band(row) {
    const svg = row.querySelector('.q-row-bg');
    const w = row.clientWidth, h = row.clientHeight;
    if (!w || !h) return;
    svg.replaceChildren();
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    const g = el('g', { filter: 'url(#q-boil-soft)' }, svg);
    const pts = sample(rrect(2, 5, w - 4, h - 10, 6), 44).map(([x, y]) => [x + rnd(-1.2, 1.2), y + rnd(-1.2, 1.2)]);
    const d = smooth(pts, true);
    spray(g, w / 2, h / 2, w / 2, h / 2, 18);
    const id = 'q-clip-' + (++uid);
    el('path', { d }, el('clipPath', { id }, defs));
    const inner = el('g', { 'clip-path': `url(#${id})` }, g);
    el('path', { d, fill: VOID }, inner);
    // a streak of shards across the far end, so the band reads as cut, not printed
    for (let i = 0; i < 7; i++) {
      const x = rnd(w * .55, w), y = rnd(0, h), s = rnd(10, 26);
      const t = el('polygon', { points: [[x, y], [x + rnd(-s, s), y + rnd(-s, s)], [x + rnd(-s, s), y + rnd(-s, s)]].map(p => p.map(f).join(',')).join(' '), fill: pick(DEEP), opacity: .55 }, inner);
      rowShards.push({ row, t });
    }
    el('rect', { x: 0, y: 0, width: w, height: h, fill: 'url(#q-dots-neon)', opacity: .32 }, inner);
    el('path', { d, fill: 'none', stroke: col('--neon-cyan'), 'stroke-width': 1.2, transform: 'translate(-1.5 .8)' }, g);
    el('path', { d, fill: 'none', stroke: col('--neon-pink'), 'stroke-width': 1.2, transform: 'translate(1.5 -.8)' }, g);
  }
  const ro = new ResizeObserver(entries => {
    for (const e of entries) {
      const row = e.target;
      for (let i = rowShards.length - 1; i >= 0; i--) if (rowShards[i].row === row) rowShards.splice(i, 1);
      band(row);
    }
  });
  for (const row of document.querySelectorAll('.row')) {
    row.prepend(el('svg', { class: 'q-row-bg', 'aria-hidden': 'true', preserveAspectRatio: 'none' }));
    ro.observe(row);
  }
  const rowOn = row => row.querySelector('.sr-input').checked;

  // ---------- stepping into and out of faces ----------
  const ctlOf = input => input.nextElementSibling;
  // the class stays until the longest of its animations is done
  function kick(ctl, cls) {
    ctl.classList.remove('pop', 'unpop');
    void ctl.getBoundingClientRect();
    ctl.classList.add(cls);
    clearTimeout(ctl._t);
    const row = ctl.closest('.row');
    row.classList.remove('row-pop', 'row-unpop');
    void row.getBoundingClientRect();
    row.classList.add('row-' + cls);
    ctl._t = setTimeout(() => { ctl.classList.remove('pop', 'unpop'); row.classList.remove('row-pop', 'row-unpop'); }, 800);
  }
  const lastChecked = new Map();
  for (const input of document.querySelectorAll('.sr-input')) {
    if (input.type === 'radio' && input.checked) lastChecked.set(input.name, input);
    input.addEventListener('change', () => {
      kick(ctlOf(input), input.checked ? 'pop' : 'unpop');
      if (input.type === 'radio') {
        const prev = lastChecked.get(input.name);
        if (prev && prev !== input) kick(ctlOf(prev), 'unpop');
        lastChecked.set(input.name, input);
      }
    });
  }

  // ---------- never still ----------
  if (BOIL_MS > 0) {
    let seed = 1;
    setInterval(() => { seed = seed % 97 + 1; for (const t of turbs) t.setAttribute('seed', seed); }, BOIL_MS);
  }
  if (RECOLOR_MS > 0) {
    setInterval(() => {
      for (const s of facets) {
        const on = s.closest('.ctl').previousElementSibling.checked;
        if (!on || Math.random() < .55) continue;
        const p = s.dataset.palette;
        s.setAttribute('fill', pick(p === 'deep' ? DEEP : BRIGHT));
      }
      for (const { row, t } of rowShards) if (rowOn(row) && Math.random() < .4) t.setAttribute('fill', pick(DEEP));
      // the label of a row that is on keeps changing its neon too
      for (const row of document.querySelectorAll('.row')) if (rowOn(row) && Math.random() < .5) row.style.setProperty('--row-neon', pick(LABEL));
    }, RECOLOR_MS);
  }
})();
