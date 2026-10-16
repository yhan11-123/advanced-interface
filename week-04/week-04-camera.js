// Week 04, Set 2: the view from orbit. A coastline at night-edge, farm plots, a river and an airfield
// right in the middle, so zooming in always lands on something. Drawn at 560 × 340; pages scale it.
(function () {
  let seed = 11; const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  // farm plots: a loose grid of tilted rectangles over the land
  let plots = '';
  const tones = ['#2a3a2a', '#33402b', '#3d3a28', '#283528', '#3a4433', '#2f3b30'];
  for (let gx = 20; gx < 360; gx += 22) for (let gy = 40; gy < 320; gy += 18) {
    if (rnd() < .22) continue;
    const w = 14 + rnd() * 8, h = 10 + rnd() * 7;
    plots += `<rect x="${gx + rnd() * 4}" y="${gy + rnd() * 3}" width="${w}" height="${h}" fill="${tones[Math.floor(rnd() * tones.length)]}" transform="rotate(${-8 + rnd() * 4} ${gx} ${gy})"/>`;
  }
  // city lights round the airfield
  let lights = '';
  for (let k = 0; k < 80; k++) {
    const a = rnd() * Math.PI * 2, r = 16 + Math.pow(rnd(), 1.8) * 70;
    lights += `<circle cx="${(280 + Math.cos(a) * r * 1.3).toFixed(1)}" cy="${(170 + Math.sin(a) * r * .8).toFixed(1)}" r="${(.3 + rnd() * .5).toFixed(2)}"/>`;
  }
  const SCENE = `
  <defs>
    <linearGradient id="ocean" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0b2433"/><stop offset="1" stop-color="#06131d"/></linearGradient>
    <clipPath id="land"><path d="M0 0 H380 C372 40 398 70 384 104 C370 140 410 160 398 196 C388 228 420 252 402 284 C392 306 404 326 396 340 H0 Z"/></clipPath>
    <filter id="soft"><feGaussianBlur stdDeviation="5"/></filter>
    <filter id="glow"><feGaussianBlur stdDeviation="1.2"/></filter>
  </defs>
  <rect width="560" height="340" fill="url(#ocean)"/>
  <g fill="none" stroke="#14384a" stroke-width=".8" opacity=".7"><path d="M392 20 C380 60 404 90 392 120 C380 150 418 170 406 200 C396 230 428 256 410 288"/><path d="M410 10 C398 60 424 90 410 124 C398 156 436 174 424 204 C414 236 446 260 428 300"/></g>
  <g clip-path="url(#land)">
    <rect width="560" height="340" fill="#1e2a22"/>
    ${plots}
    <path d="M60 0 C90 60 40 110 120 150 C190 186 150 240 230 270 C290 292 300 320 340 340" fill="none" stroke="#0e2a38" stroke-width="5"/>
    <path d="M60 0 C90 60 40 110 120 150 C190 186 150 240 230 270 C290 292 300 320 340 340" fill="none" stroke="#1d4a5c" stroke-width="2"/>
    <g fill="none" stroke="#3b4a3a" stroke-width=".6" opacity=".6"><ellipse cx="90" cy="250" rx="50" ry="30"/><ellipse cx="90" cy="250" rx="34" ry="19"/><ellipse cx="90" cy="250" rx="18" ry="9"/></g>
  </g>
  <path d="M380 0 C372 40 398 70 384 104 C370 140 410 160 398 196 C388 228 420 252 402 284 C392 306 404 326 396 340" fill="none" stroke="#9fd8e6" stroke-width=".7" opacity=".55"/>
  <g fill="#ffcf7a" opacity=".6" filter="url(#glow)">${lights}</g>
  <g fill="#ffe2a8">${lights}</g>
  <g transform="translate(280 170)">
    <rect x="-34" y="-1.6" width="68" height="3.2" fill="#8d98a0"/>
    <rect x="-26" y="-1.4" width="52" height="2.8" fill="#8d98a0" transform="rotate(58)"/>
    <g fill="#e8f0f2"><rect x="-30" y="-.25" width="4" height=".5"/><rect x="-20" y="-.25" width="4" height=".5"/><rect x="-10" y="-.25" width="4" height=".5"/><rect x="0" y="-.25" width="4" height=".5"/><rect x="10" y="-.25" width="4" height=".5"/><rect x="20" y="-.25" width="4" height=".5"/></g>
    <rect x="6" y="6" width="14" height="5" fill="#5d6870"/><rect x="22" y="6" width="5" height="5" fill="#6f7a82"/><rect x="-18" y="-12" width="9" height="4" fill="#5d6870"/>
    <path d="M12 -5.5 l3 0 l.6 -1.8 l.6 1.8 l2.6 0 l-2.6 .9 l-.4 1.6 l-.4 -1.6 z" fill="#ffffff"/>
    <circle r="1.1" fill="#ff5a4a"/>
  </g>
  <g fill="#e9f3f6" opacity=".28" filter="url(#soft)"><ellipse cx="450" cy="70" rx="70" ry="22"/><ellipse cx="500" cy="96" rx="40" ry="14"/><ellipse cx="140" cy="300" rx="80" ry="18"/><ellipse cx="60" cy="40" rx="50" ry="14"/></g>
  <g stroke="#6fe3ff" stroke-width=".4" opacity=".16"><path d="M0 85H560M0 170H560M0 255H560M140 0V340M280 0V340M420 0V340"/></g>`;
  document.querySelectorAll('svg.scene').forEach(svg => {
    svg.setAttribute('viewBox', '0 0 560 340'); svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('width', 560); svg.setAttribute('height', 340);
    svg.innerHTML = SCENE;
  });
})();
