/* ---------------------------------------------------------------
   Advanced Interface - the ring of deliverables. Needs gallery/items.js
   and shared/viewer.js loaded first, and this markup:
     <div class="ring-stage">
       <div class="scene" tabindex="0"><div class="ring"></div></div>
       <figure class="peek"></figure>
       <p class="note" data-unit="deliverables"></p>
     </div>
   Paths in items.js are relative to the site root, so the page must sit
   there (or set data-root on .ring-stage, e.g. "../").
   Inside an iframe (a portfolio embed) a scroll turns the ring AND still
   scrolls the page around it, the way the reference does; on its own page
   the scroll only turns the ring.
   --------------------------------------------------------------- */
(() => {
  const stage = document.querySelector('.ring-stage');
  if (!stage || !window.GALLERY) return;
  const root = stage.dataset.root || '';
  const items = window.GALLERY.items.filter(i => i.kind === 'deliverable');
  const N = items.length, TAU = Math.PI * 2, STEP = TAU / N;
  const scene = stage.querySelector('.scene'), ring = stage.querySelector('.ring'), peek = stage.querySelector('.peek'), note = stage.querySelector('.note');
  const framed = self !== top;
  const calm = matchMedia('(prefers-reduced-motion: reduce)');
  const css = getComputedStyle(document.documentElement);
  const TILT = css.getPropertyValue('--tilt').trim() || '-14deg', IDLE = parseFloat(css.getPropertyValue('--idle')) || .035;
  const pad = n => String(n).padStart(2, '0');
  const q = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  const weekTitle = Object.fromEntries(window.GALLERY.weeks.map(w => [w.week, w.title]));
  const lastWeek = Math.max(...window.GALLERY.weeks.map(w => w.week));
  if (note) note.innerHTML = `Week ${lastWeek} of 14<br>${N} ${note.dataset.unit || 'deliverables'}`;
  scene.setAttribute('aria-label', `${N} pieces in one ring. Arrow keys turn it, Enter runs the one you are on.`);

  // each card stands on edge on a spoke: turned to its place round the ring, pushed out, then turned
  // side-on so its face runs along the radius. One card per deliverable, in week order.
  let R = 0, CW = 0, CH = 0, moved = false;
  const cards = items.map((it, i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'card viewer-open'; b.tabIndex = -1;
    b.dataset.src = root + it.src; b.dataset.title = it.title; b.dataset.about = it.about; if (it.wide) b.dataset.wide = '';
    b.setAttribute('aria-label', `Run ${it.title}, week ${it.week}`);
    b.innerHTML = `<span class="face"><img src="${q(root + it.thumb)}" alt="" loading="lazy" decoding="async" /></span>`;
    b.addEventListener('pointerenter', () => show(i));
    b.addEventListener('click', e => { if (moved) { e.stopImmediatePropagation(); e.preventDefault(); } }, true);
    ring.append(b); return b;
  });

  const layout = () => {
    const r = scene.getBoundingClientRect();
    R = Math.min(r.width * (r.width < 600 ? .38 : .34), r.height * .62, 440);   // a phone gives the ring more of its width
    CW = R * .46; CH = CW * .68;                                               // along the spoke, and standing height
    cards.forEach((b, i) => {
      b.style.width = CW + 'px'; b.style.height = CH + 'px';
      b.style.transform = `translate(${-CW / 2}px, ${-CH}px) rotateY(${(i * STEP).toFixed(4)}rad) translateZ(${R}px) rotateY(90deg)`;
    });
  };

  let cur = -1;
  const show = i => {
    if (i === cur) return; cur = i;
    const it = items[i];
    peek.innerHTML = `<figcaption>${q(it.title)}<span>Week ${pad(it.week)} · ${q(weekTitle[it.week] || '')}</span></figcaption><img src="${q(root + it.thumb)}" alt="" />`;   // the name above the picture
    peek.classList.remove('swap'); void peek.offsetWidth; peek.classList.add('swap');
    cards.forEach((b, k) => b.classList.toggle('on', k === i));
  };

  // ---- the turn: an angle with momentum. Scroll and drag push it; it drifts slowly when left alone ----
  const S = { a: 0, v: 0 };
  let dragging = false, lastInput = -1e9, last = performance.now();
  const front = () => { const k = Math.round(-S.a / STEP); return ((k % N) + N) % N; };   // the card nearest you
  const tick = now => {
    const dt = Math.min(.04, (now - last) / 1000); last = now;
    if (!dragging) {
      const idle = calm.matches || now - lastInput < 2500 ? 0 : IDLE;      // a slow drift, only after a pause
      S.v += (idle - S.v) * (1 - Math.exp(-dt * 2.2));                      // momentum fades toward the drift
      S.a += S.v * dt;
    }
    ring.style.transform = `rotateX(${TILT}) rotateY(${S.a.toFixed(4)}rad)`;
    if (!scene.matches(':hover') || dragging) show(front());
    requestAnimationFrame(tick);
  };

  scene.addEventListener('wheel', e => {
    if (!framed) e.preventDefault();          // embedded, the page around keeps scrolling too
    lastInput = performance.now();
    const d = e.deltaY + e.deltaX;
    if (calm.matches) S.a -= Math.sign(d) * STEP;
    else S.v = Math.max(-6, Math.min(6, S.v - d * .0045));
  }, { passive: framed });

  // drag sideways to turn; it keeps the spin you gave it
  let px = 0, pt = 0;
  scene.addEventListener('pointerdown', e => { dragging = true; moved = false; px = e.clientX; pt = performance.now(); S.v = 0; lastInput = pt; });
  addEventListener('pointermove', e => {
    if (!dragging) return;
    const dx = e.clientX - px; px = e.clientX;
    if (!moved && Math.abs(dx) > 2) { moved = true; scene.classList.add('dragging'); }
    const now = performance.now(), dt = Math.max(.008, (now - pt) / 1000); pt = now;
    const da = dx / (R * 1.1);
    S.a += da; S.v = da / dt; lastInput = now;
  });
  addEventListener('pointerup', () => { if (!dragging) return; dragging = false; scene.classList.remove('dragging'); setTimeout(() => moved = false, 0); });

  scene.addEventListener('keydown', e => {
    lastInput = performance.now();
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { S.a -= STEP; S.v = 0; e.preventDefault(); }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { S.a += STEP; S.v = 0; e.preventDefault(); }
    else if (e.key === 'Enter' || e.key === ' ') { cards[cur]?.click(); e.preventDefault(); }
  });

  addEventListener('resize', layout);
  layout(); show(0); requestAnimationFrame(tick);
})();
