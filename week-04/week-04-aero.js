// Week 04, Set 2: space, drawn in code. Stars for the sky and the windows, and an Earth to look down on.
const AERO = (() => {
  const NS = 'http://www.w3.org/2000/svg';
  const rng = seed => () => (seed = (seed * 9301 + 49297) % 233280) / 233280;

  // a field of stars inside an element: mostly faint pinpoints, a few bright ones, the odd warm or blue one
  function stars(el, n = 160, seed = 5) {
    const r = rng(seed), tints = ['#ffffff', '#ffffff', '#ffffff', '#cfe6ff', '#ffe9c7'];
    let s = '';
    for (let i = 0; i < n; i++) {
      const big = r() < .06, rad = big ? 1 + r() * .7 : .25 + r() * .55;
      s += `<circle cx="${(r() * 100).toFixed(2)}%" cy="${(r() * 100).toFixed(2)}%" r="${rad.toFixed(2)}" fill="${tints[Math.floor(r() * tints.length)]}" opacity="${(big ? .9 : .25 + r() * .55).toFixed(2)}"${big ? ` class="tw" style="animation-delay:${(r() * 4).toFixed(2)}s"` : ''}/>`;
    }
    el.insertAdjacentHTML('beforeend', `<svg width="100%" height="100%" style="position:absolute;inset:0;display:block" aria-hidden="true"><style>.tw{animation:tw 4s ease-in-out infinite alternate}@keyframes tw{from{opacity:.35}to{opacity:1}}</style>${s}</svg>`);
  }

  // the Earth, drawn at radius 100 round 0,0: oceans, land, cloud, the night side, and the thin blue air at the limb
  const EARTH_DEFS = `
    <radialGradient id="ae-ocean" cx="-.25" cy="-.3" r="1.2" gradientUnits="objectBoundingBox" fx=".3" fy=".28"><stop offset="0" stop-color="#6cc0ff"/><stop offset=".45" stop-color="#2468bf"/><stop offset="1" stop-color="#0a2550"/></radialGradient>
    <radialGradient id="ae-air" r=".5" cx=".5" cy=".5"><stop offset=".86" stop-color="#8fd8ff" stop-opacity="0"/><stop offset=".905" stop-color="#8fd8ff" stop-opacity=".75"/><stop offset=".94" stop-color="#4aa8ff" stop-opacity=".25"/><stop offset="1" stop-color="#4aa8ff" stop-opacity="0"/></radialGradient>
    <linearGradient id="ae-night" x1="0" y1="0" x2="1" y2="1"><stop offset=".42" stop-color="#000" stop-opacity="0"/><stop offset=".7" stop-color="#00030c" stop-opacity=".8"/><stop offset="1" stop-color="#00030c" stop-opacity=".97"/></linearGradient>
    <clipPath id="ae-disc"><circle r="100"/></clipPath>
    <filter id="ae-soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.2"/></filter>`;
  const EARTH = `
    <circle r="112" fill="url(#ae-air)"/>
    <circle r="100" fill="url(#ae-ocean)"/>
    <g clip-path="url(#ae-disc)">
      <g fill="#5d8a4e" opacity=".85">
        <path d="M-70 -40 C-50 -70 -10 -60 0 -35 C10 -12 -18 0 -30 18 C-42 36 -66 30 -78 8 C-88 -10 -84 -24 -70 -40Z"/>
        <path d="M18 -82 C40 -90 62 -74 58 -54 C55 -38 36 -40 30 -26 C24 -12 6 -18 4 -36 C2 -54 0 -74 18 -82Z"/>
        <path d="M30 20 C52 8 80 16 84 40 C88 62 64 80 44 74 C26 68 20 52 22 40 C23 32 24 26 30 20Z"/>
      </g>
      <g fill="#b39a6a" opacity=".55"><path d="M-58 -28 C-44 -40 -24 -36 -20 -24 C-18 -14 -34 -6 -46 -10 C-56 -14 -64 -20 -58 -28Z"/><path d="M40 30 C54 26 66 34 64 46 C60 56 46 54 40 46Z"/></g>
      <g fill="#ffffff" filter="url(#ae-soft)" opacity=".7">
        <ellipse cx="-30" cy="-62" rx="44" ry="7" transform="rotate(-12 -30 -62)"/><ellipse cx="10" cy="-8" rx="50" ry="6" transform="rotate(18 10 -8)"/>
        <ellipse cx="-40" cy="44" rx="36" ry="8" transform="rotate(-24 -40 44)"/><ellipse cx="56" cy="-30" rx="26" ry="5"/><ellipse cx="10" cy="70" rx="40" ry="6" transform="rotate(8 10 70)"/>
        <path d="M-12 22 q14 -10 26 0 q-12 12 -26 0z"/>
      </g>
      <rect x="-100" y="-100" width="200" height="200" fill="url(#ae-night)"/>
    </g>
    <circle r="100" fill="none" stroke="#a9e4ff" stroke-width="1.2" opacity=".55"/>`;
  function earth(svg) {
    svg.insertAdjacentHTML('afterbegin', `<defs>${EARTH_DEFS}</defs>`);
    const g = document.createElementNS(NS, 'g'); g.setAttribute('class', 'earth'); g.innerHTML = EARTH; svg.append(g); return g;
  }
  document.querySelectorAll('.sky, .stars').forEach((el, i) => stars(el, el.classList.contains('sky') ? 220 : 120, 5 + i * 7));
  return { stars, earth, rng };
})();
