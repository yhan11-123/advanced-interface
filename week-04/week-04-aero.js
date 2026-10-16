// Week 04, Set 2: drawn in code. Stars and a wireframe Earth.
const AERO = (() => {
  const NS = 'http://www.w3.org/2000/svg';
  const rng = seed => () => (seed = (seed * 9301 + 49297) % 233280) / 233280;

  // a field of white pinpoints, a few brighter ones slowly pulsing
  function stars(el, n = 160, seed = 5) {
    const r = rng(seed);
    let s = '';
    for (let i = 0; i < n; i++) {
      const big = r() < .05, rad = big ? .9 + r() * .5 : .25 + r() * .5;
      s += `<circle cx="${(r() * 100).toFixed(2)}%" cy="${(r() * 100).toFixed(2)}%" r="${rad.toFixed(2)}" fill="#fff" opacity="${(big ? .9 : .2 + r() * .5).toFixed(2)}"${big ? ` class="tw" style="animation-delay:${(r() * 4).toFixed(2)}s"` : ''}/>`;
    }
    el.insertAdjacentHTML('beforeend', `<svg width="100%" height="100%" style="position:absolute;inset:0;display:block" aria-hidden="true"><style>.tw{animation:tw 4s ease-in-out infinite alternate}@keyframes tw{from{opacity:.3}to{opacity:1}}</style>${s}</svg>`);
  }

  // the Earth as a wireframe globe, radius 100 round 0,0: outline, meridians, parallels, a stippled night side
  function earth(svg) {
    if (!svg.querySelector('#ae-dots')) svg.insertAdjacentHTML('afterbegin', `<defs>
      <pattern id="ae-dots" width="4" height="4" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".7" fill="#fff"/></pattern>
      <clipPath id="ae-disc"><circle r="100"/></clipPath></defs>`);
    const w = 'fill="none" stroke="#fff" vector-effect="non-scaling-stroke"';
    const mer = [26, 57, 82].map(rx => `<ellipse rx="${rx}" ry="100" ${w} stroke-width="1" opacity=".38"/>`).join('') + `<line y1="-100" y2="100" ${w} stroke-width="1" opacity=".38"/>`;
    const par = [-60, -30, 0, 30, 60].map(a => { const y = 100 * Math.sin(a * Math.PI / 180), x = 100 * Math.cos(a * Math.PI / 180); return `<line x1="${-x}" x2="${x}" y1="${y}" y2="${y}" ${w} stroke-width="1" opacity=".38"/>`; }).join('');
    const g = document.createElementNS(NS, 'g'); g.setAttribute('class', 'earth');
    g.innerHTML = `<circle r="100" fill="#000"/>
      <g clip-path="url(#ae-disc)"><path d="M30 -100 A100 100 0 0 1 30 100 A64 100 0 0 0 30 -100Z" fill="url(#ae-dots)" opacity=".5" transform="translate(-30 0)"/>${mer}${par}</g>
      <circle r="100" ${w} stroke-width="1.25"/>`;
    svg.append(g); return g;
  }
  document.querySelectorAll('.sky, .stars').forEach((el, i) => stars(el, el.classList.contains('sky') ? 160 : 110, 5 + i * 7));
  return { stars, earth, rng };
})();
