// Week 06, Set 1 · Ledger: the spec, read from the values the prototype runs on.
// It builds a hidden sample of every part in every state, asks the browser what it computed,
// and writes the numbers into <section class="spec">. Nothing here is typed in by hand.
(() => {
  const out = document.querySelector('.spec-grid');
  if (!out) return;
  const root = getComputedStyle(document.documentElement);
  const tok = n => root.getPropertyValue(n).trim();

  const sample = document.createElement('div');
  sample.className = 'spec-measure';
  sample.innerHTML = `
    <div class="l-menu" data-k="menu">
      <button class="s-item" data-k="item"><svg class="s-ico" viewBox="0 0 18 18"><path d="M3 9h12" fill="none" stroke="currentColor"/></svg><span class="s-label">Send</span><kbd class="s-key" data-k="key">S</kbd></button>
      <button class="s-item is-hover" data-k="hover"><span class="s-label">Send</span></button>
      <button class="s-item is-press" data-k="press"><span class="s-label">Send</span></button>
      <button class="s-item" aria-disabled="true" data-k="off"><span class="s-label">Withdraw</span></button>
      <button class="s-item"><span class="s-label">Pending</span><span class="s-badge" data-k="badge">3</span></button>
      <div class="s-sect" data-k="sect">Accounts</div>
      <div class="s-rule" data-k="rule"></div>
      <button class="s-acct" data-k="acct"><span class="s-label">Savings</span></button>
    </div>`;
  document.body.append(sample);
  const el = k => sample.querySelector(`[data-k="${k}"]`);
  const cs = k => getComputedStyle(el(k));
  const px = v => `${Math.round(parseFloat(v) * 10) / 10}px`;
  const hex = c => {
    const m = c.match(/[\d.]+/g); if (!m) return c;
    const [r, g, b, a = 1] = m.map(Number), h = [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
    return `#${h}${a < 1 ? ` · ${Math.round(a * 100)}%` : ''}`;
  };
  const sw = c => `<i style="background:${c}"></i>${hex(c)}`;
  const fam = f => f.split(',')[0].replace(/"/g, '');

  // draw the spring the motion runs on, from the very linear() points in the token
  const springSvg = () => {
    const pts = tok('--spring').replace(/^linear\(|\)$/g, '').split(',').map(s => s.trim().split(/\s+/));
    let last = 0; const xy = pts.map(([v, p], i) => { const x = p ? parseFloat(p) / 100 : (i === 0 ? 0 : i === pts.length - 1 ? 1 : last); last = x; return [x, parseFloat(v)]; });
    const d = xy.map(([x, y], i) => `${i ? 'L' : 'M'}${(x * 240).toFixed(1)} ${(60 - y * 50).toFixed(1)}`).join(' ');
    return `<svg viewBox="-4 0 248 66" aria-hidden="true"><path d="M0 10H240" stroke="rgba(255,255,255,.12)" stroke-dasharray="3 3"/><path d="${d}" fill="none" stroke="#6fd3a8" stroke-width="2"/></svg>`;
  };

  const item = cs('item'), menu = cs('menu'), ico = el('item').querySelector('.s-ico');
  const cards = [
    ['Menu', [
      ['Width', px(menu.width)],
      ['Padding', px(menu.paddingTop)],
      ['Corner', px(menu.borderTopLeftRadius)],
      ['Edge', `1px, ${hex(menu.borderTopColor)}`],
      ['Shadow', '2px close, 40px soft below'],
      ['Surface', sw(menu.backgroundColor)],
    ]],
    ['Item', [
      ['Height', px(el('item').offsetHeight)],
      ['Padding, sides', px(item.paddingLeft)],
      ['Gap between parts', px(item.columnGap)],
      ['Corner', px(item.borderTopLeftRadius)],
      ['Font', `${fam(item.fontFamily)} ${item.fontWeight}`],
      ['Size / line height', `${px(item.fontSize)} / ${px(item.lineHeight)}`],
    ]],
    ['Left icon', [
      ['Size', `${px(ico.getBoundingClientRect().width)} square`],
      ['Stroke', `${tok('--icon-stroke')}px, round ends`],
      ['Colour', sw(getComputedStyle(ico).color)],
    ]],
    ['Right side', [
      ['Shortcut', `${px(el('key').offsetHeight)} key, ${px(cs('key').borderTopLeftRadius)} corner`],
      ['Shortcut text', `${px(cs('key').fontSize)}, ${hex(cs('key').color)}`],
      ['Badge', `${px(el('badge').offsetHeight)} pill`],
      ['Badge colours', `${sw(cs('badge').color)} on ${hex(cs('badge').backgroundColor)}`],
      ['Right icon', '16px, shortcut colour'],
    ]],
    ['Sections', [
      ['Label', `${px(cs('sect').fontSize)} capitals, ${cs('sect').fontWeight}`],
      ['Label colour', sw(cs('sect').color)],
      ['Divider', `${px(el('rule').offsetHeight)}, ${px(cs('rule').marginLeft)} in`],
      ['Divider colour', sw(cs('rule').backgroundColor)],
    ]],
    ['States', [
      ['Enabled', `${sw(item.color)}, no fill`],
      ['Hover', sw(cs('hover').backgroundColor)],
      ['Pressed', `${sw(cs('press').backgroundColor)}, scale ${cs('press').scale}`],
      ['Unavailable', sw(cs('off').color)],
      ['Keyboard focus', 'same as hover'],
    ]],
    ['Submenu (accounts)', [
      ['Row', `${px(el('acct').offsetHeight)}, balance under the name`],
      ['Account mark', '28px circle, its colour'],
      ['Chosen', 'a tick that springs in'],
      ['Slides out', `${tok('--sub-time')}, spring`],
    ]],
    ['Motion', [
      ['Spring', 'settles with one small overshoot'],
      ['Highlight glide', `${tok('--glide-time')}, spring`],
      ['Rows arrive', `${tok('--stagger')} apart`],
      ['Press', `${tok('--press-time')}, ease out`],
      ['Numbers roll', `${tok('--roll-time')}, ease out`],
    ], springSvg()],
  ];
  // the menu in use also opens and closes
  if (document.querySelector('.money-btn')) cards.push(['Opening and closing', [
    ['Opens with', 'Move money, or M'],
    ['Closes with', 'Esc, M, a click outside, a pick'],
    ['Opening', `${tok('--open-time')}, spring, from the button`],
    ['From', 'scale .94, 8px up, 6px blur'],
    ['Closing', `${tok('--close-time')}, ease out`],
    ['Button chevron', 'turns 180°, same spring'],
  ]]);
  out.innerHTML = cards.map(([h, rows, extra = '']) => `<div class="spec-card"><h3>${h}</h3><dl>${rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>${extra}</div>`).join('');
  sample.remove();
})();
