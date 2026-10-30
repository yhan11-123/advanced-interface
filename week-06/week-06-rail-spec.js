// Week 06, Set 2 · Rail: the spec, read from the values the prototype runs on.
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
    <div class="r-menu" data-k="menu">
      <button class="r-item" data-k="item"><svg class="r-ico" data-k="ico" viewBox="0 0 18 18"></svg><span class="r-label">Transfer</span><kbd class="r-key" data-k="key">⌘T</kbd></button>
      <button class="r-item is-hover" data-k="hover"><span class="r-label">Transfer</span></button>
      <button class="r-item is-press" data-k="press"><span class="r-label">Transfer</span></button>
      <button class="r-item" aria-disabled="true" data-k="off"><span class="r-label">Freeze card</span></button>
      <button class="r-item"><span class="r-badge" data-k="badge">3</span></button>
      <div class="r-sect" data-k="sect">Account</div>
      <div class="r-rule" data-k="rule"></div>
    </div>
    <button class="fab" data-k="fab"><i></i><i></i><i></i></button>`;
  document.body.append(sample);
  const el = k => sample.querySelector(`[data-k="${k}"]`);
  const cs = k => getComputedStyle(el(k));
  const px = v => `${Math.round(parseFloat(v) * 10) / 10}px`;
  const hex = c => {
    if (c.startsWith('#')) return c;
    const m = c.match(/[\d.]+/g); if (!m) return c;
    const [r, g, b, a = 1] = m.map(Number), h = [r, g, b].map(v => Math.round(v).toString(16).padStart(2, '0')).join('');
    return `#${h}${a < 1 ? ` · ${Math.round(a * 100)}%` : ''}`;
  };
  const sw = c => `<i style="background:${c}"></i>${hex(c)}`;
  const fam = f => f.split(',')[0].replace(/"/g, '');
  const item = cs('item'), menu = cs('menu');

  const cards = [
    ['Rail', [
      ['Width', tok('--rail-w')],
      ['Gradient', `${sw(tok('--g1'))} top to ${sw(tok('--g2'))} foot`],
      ['Corners', tok('--rail-r')],
      ['Scoop', `${tok('--scoop')} radius, halfway down its right side`],
      ['Scoop, open', '6px wider, on the spring'],
    ]],
    ['Menu button', [
      ['Size', `${px(el('fab').offsetWidth)} round, centred on the rail's edge`],
      ['Lines', '3 × 30px, 3px thick, 9px apart'],
      ['Hover', 'grows to 105%, a 6px green halo'],
      ['Pressed', 'shrinks to 94%'],
      ['Open', `the lines turn to a cross, ${tok('--morph-time')}`],
    ]],
    ['Menu', [
      ['Width', px(menu.width)],
      ['Padding', px(menu.paddingTop)],
      ['Corners', px(menu.borderTopLeftRadius)],
      ['Fill', 'the rail\'s gradient, at 160°'],
      ['Gap from the scoop', tok('--gap-out')],
    ]],
    ['Item', [
      ['Height', px(el('item').offsetHeight)],
      ['Padding, sides', px(item.paddingLeft)],
      ['Gap between parts', px(item.columnGap)],
      ['Corners', px(item.borderTopLeftRadius)],
      ['Font', `${fam(item.fontFamily)} ${item.fontWeight}, ${px(item.fontSize)}`],
      ['Left icon', `${px(el('ico').getBoundingClientRect().width)}, stroke ${tok('--icon-stroke')}`],
    ]],
    ['Right side', [
      ['Shortcut', `${px(cs('key').fontSize)}, ${hex(cs('key').color)}`],
      ['Badge', `${px(el('badge').offsetHeight)} pill, white, ${hex(cs('badge').color)} text`],
      ['Right icon', '16px, the shortcut colour'],
      ['Submenu', 'a chevron, the same'],
    ]],
    ['Sections', [
      ['Label', `${px(cs('sect').fontSize)} ${cs('sect').fontWeight}, capitals, ${px(cs('sect').letterSpacing)} apart`],
      ['Label colour', sw(cs('sect').color)],
      ['Divider', `${px(el('rule').offsetHeight)}, ${hex(cs('rule').backgroundColor)}`],
    ]],
    ['States', [
      ['Enabled', sw(item.color)],
      ['Hover', `white wash ${hex(cs('hover').backgroundColor)}`],
      ['Pressed', `wash ${hex(cs('press').backgroundColor)}, sinks 1px`],
      ['Unavailable', `${sw(cs('off').color)}, no wash`],
    ]],
    ['Submenu', [
      ['Opens', 'beside its row, from its bottom left corner'],
      ['Width', '140px'],
      ['Chosen', 'a tick'],
      ['Opens on', 'hover, a click, or →'],
    ]],
    ['Motion', [
      ['Menu opens', `${tok('--open-time')}, from .2, out of the button's centre`],
      ['Spring', tok('--spring')],
      ['Rows', `${tok('--stagger')} apart, sliding in 8px`],
      ['Menu closes', `${tok('--close-time')}, back into the scoop, no spring`],
      ['Hover', tok('--hover-time')],
    ]],
  ];
  out.innerHTML = cards.map(([h, rows]) => `<div class="spec-card"><h3>${h}</h3><dl>${rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl></div>`).join('');
  sample.remove();
})();
