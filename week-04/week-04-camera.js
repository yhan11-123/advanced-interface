// Week 04, Set 2: the scene in the viewfinder, a harbour at dusk with a lighthouse in the middle.
// Drawn at twice the frame, so 0.5x shows all of it, 1x the middle half, 5x the lighthouse up close.
document.querySelectorAll('svg.scene').forEach(svg => {
  svg.setAttribute('viewBox', '0 0 560 340');
  svg.setAttribute('aria-hidden', 'true'); svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
  svg.innerHTML = `
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#22385a"/><stop offset=".55" stop-color="#8a6f8c"/><stop offset="1" stop-color="#f0a86a"/></linearGradient>
    <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a5f7a"/><stop offset="1" stop-color="#15233a"/></linearGradient>
    <radialGradient id="sun" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff2c8"/><stop offset=".5" stop-color="#ffcf7a"/><stop offset="1" stop-color="#ffcf7a" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="560" height="206" fill="url(#sky)"/>
  <circle cx="392" cy="176" r="46" fill="url(#sun)"/>
  <circle cx="392" cy="176" r="15" fill="#fff4d6"/>
  <g fill="#f6d6c0" opacity=".35"><rect x="60" y="70" width="90" height="6" rx="3"/><rect x="88" y="80" width="60" height="5" rx="2.5"/><rect x="420" y="96" width="80" height="5" rx="2.5"/></g>
  <path d="M0 206 L0 150 L30 140 L60 152 L92 128 L130 150 L160 146 L190 170 L214 206 Z" fill="#2c2b40"/>
  <path d="M560 206 L560 160 L520 150 L486 168 L452 162 L420 186 L400 206 Z" fill="#3a3550"/>
  <rect y="206" width="560" height="134" fill="url(#sea)"/>
  <g fill="#ffd9a0" opacity=".55"><rect x="372" y="212" width="40" height="2" rx="1"/><rect x="380" y="220" width="26" height="2" rx="1"/><rect x="386" y="229" width="16" height="2" rx="1"/></g>
  <path d="M256 206 Q268 196 280 195 Q292 196 304 206 Z" fill="#1d1a2b"/>
  <g transform="translate(280 196) scale(.42) translate(0 -186)">
    <path d="M-7 186 L-5 146 L5 146 L7 186 Z" fill="#f2ece2"/>
    <rect x="-6" y="158" width="12" height="5" fill="#c4473a"/><rect x="-6.6" y="172" width="13.2" height="5" fill="#c4473a"/>
    <rect x="-6" y="138" width="12" height="8" fill="#2a2a33"/><rect x="-3.5" y="139.5" width="7" height="5" fill="#ffe08a"/>
    <path d="M-7 138 L0 131 L7 138 Z" fill="#c4473a"/><rect x="-.5" y="127" width="1" height="4" fill="#2a2a33"/>
    <rect x="-1.5" y="165" width="3" height="4" rx="1" fill="#2a2a33"/>
    <path d="M3 142 L90 128 L90 156 Z" fill="#ffe7a6" opacity=".18"/>
  </g>
  <g transform="translate(312 222) scale(.5)"><path d="M-14 0 L14 0 L10 6 L-10 6 Z" fill="#20202a"/><path d="M0 -1 L0 -20 L11 -2 Z" fill="#efe6d8"/><rect x="-.6" y="-21" width="1.2" height="21" fill="#20202a"/></g>
  <g fill="none" stroke="#1d1a2b" stroke-width="1.4" stroke-linecap="round"><path d="M262 168 q2 -2 4 0 q2 -2 4 0"/><path d="M290 160 q1.5 -1.5 3 0 q1.5 -1.5 3 0"/><path d="M170 112 q5 -5 10 0 q5 -5 10 0"/></g>
  <g fill="#fff" opacity=".6"><circle cx="70" cy="30" r="1"/><circle cx="140" cy="18" r=".8"/><circle cx="210" cy="40" r="1"/><circle cx="480" cy="26" r=".9"/><circle cx="520" cy="56" r=".7"/></g>`;
});
