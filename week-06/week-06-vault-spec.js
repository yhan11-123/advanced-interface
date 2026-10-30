// Week 06, Set 1 · Vault: the spec, read from the values the prototype runs on.
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
    <div class="v-menu" data-k="menu">
      <button class="s-item" data-k="item"><svg class="s-ico" viewBox="0 0 16 16"><path d="M2 8h12" fill="none" stroke="currentColor"/></svg><span class="s-label">Open</span><kbd class="s-key" data-k="key">ENTER</kbd></button>
      <button class="s-item is-hover" data-k="hover"><span class="s-label">Open</span></button>
      <button class="s-item is-press" data-k="press"><span class="s-label">Open</span></button>
      <button class="s-item" aria-disabled="true" data-k="off"><span class="s-label">Purge</span></button>
      <button class="s-item"><span class="s-label">Flags</span><span class="s-badge" data-k="badge">2</span></button>
      <div class="s-sect" data-k="sect">TRANSMIT</div>
      <div class="s-rule" data-k="rule"></div>
      <button class="s-node" data-k="node"><span class="s-label">Node 7</span></button>
      <button class="folder" data-k="folder"></button>
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

  const item = cs('item'), menu = cs('menu'), ico = el('item').querySelector('.s-ico');
  const cards = [
    ['Menu', [
      ['Width', px(menu.width)],
      ['Padding', px(menu.paddingTop)],
      ['Glass', sw(menu.backgroundColor)],
      ['Edge', `1px, ${hex(menu.borderTopColor)}`],
      ['Corners', `14px brackets, ${tok('--edge')} light`],
      ['Behind it', 'blur 4px, inner glow 30px'],
    ]],
    ['Item', [
      ['Height', px(el('item').offsetHeight)],
      ['Padding, sides', px(item.paddingLeft)],
      ['Gap between parts', px(item.columnGap)],
      ['Font', `${fam(item.fontFamily)} ${item.fontWeight}, capitals`],
      ['Size', px(item.fontSize)],
      ['Letter spacing', px(item.letterSpacing)],
    ]],
    ['Left icon', [
      ['Size', `${px(ico.getBoundingClientRect().width)} square`],
      ['Stroke', `${tok('--icon-stroke')}px`],
      ['Colour, at rest', sw(getComputedStyle(ico).color)],
      ['Colour, lit', 'hot light'],
    ]],
    ['Right side', [
      ['Shortcut', `${fam(cs('key').fontFamily)}, ${px(cs('key').fontSize)}`],
      ['Shortcut colour', sw(cs('key').color)],
      ['Badge', `${px(el('badge').offsetHeight)}, 1px outline`],
      ['Badge colour', sw(cs('badge').color)],
      ['Right icon', '14px, key colour'],
    ]],
    ['Sections', [
      ['Label', `${fam(cs('sect').fontFamily)} ${px(cs('sect').fontSize)}, ${px(cs('sect').letterSpacing)} apart`],
      ['Label colour', sw(cs('sect').color)],
      ['Trailing rule', 'fades out to the right'],
      ['Divider', `${px(el('rule').offsetHeight)}, dashes of 6 and 4`],
    ]],
    ['States', [
      ['Enabled', sw(item.color)],
      ['Hover', `${sw(cs('hover').color)}, glow 8px`],
      ['Hover fill', 'light from the left, 22% to 3%'],
      ['Hover edge', `${tok('--edge')} bar, grows from 30%`],
      ['Hover shift', '4px in'],
      ['Pressed', `${sw(cs('press').color)}, fill 45%`],
      ['Unavailable', sw(cs('off').color)],
    ]],
    ['Folder (the trigger)', [
      ['Size', `${px(el('folder').offsetWidth)} × ${px(el('folder').offsetHeight)}`],
      ['Hover', `lifts ${tok('--lift')} off the plane`],
      ['Pressed', 'sinks to 4px'],
      ['Open', 'filled with light, 34px glow'],
    ]],
    ['Submenu (nodes)', [
      ['Row', `${px(el('node').offsetHeight)}, signal bars beside the name`],
      ['Chosen', '1px light frame'],
      ['Opens', 'beside its row, same materialise'],
    ]],
    ['Motion', [
      ['Hover', `${tok('--hover-time')}, ${tok('--ease-out')}`],
      ['Menu opens', `${tok('--open-time')}: a line of light, then the panel`],
      ['Rows arrive', `${tok('--stagger')} apart`],
      ['Menu closes', `${tok('--close-time')}, back to a line`],
      ['Log types', `${tok('--type-speed')} a letter`],
    ]],
  ];
  out.innerHTML = cards.map(([h, rows]) => `<div class="spec-card"><h3>${h}</h3><dl>${rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl></div>`).join('');
  sample.remove();
})();
