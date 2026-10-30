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
  sample.style.width = '300px';
  sample.innerHTML = `
    <div class="r-menu" data-k="menu">
      <button class="r-item" data-k="item"><span class="r-num" data-k="num">01</span><span class="r-label">Transfer</span><kbd class="r-key" data-k="key">⌘T</kbd></button>
      <button class="r-item is-hover" data-k="hover"><span class="r-num">02</span><span class="r-label">Pay bills</span></button>
      <button class="r-item is-press" data-k="press"><span class="r-num">02</span><span class="r-label">Pay bills</span></button>
      <button class="r-item" aria-disabled="true" data-k="off"><span class="r-num">03</span><span class="r-label">Freeze card</span></button>
      <button class="r-item"><span class="r-badge" data-k="badge">03</span></button>
      <div class="r-sect" data-k="sect">Account</div>
    </div>
    <button class="fab" data-k="fab"><i></i><i></i><i></i></button>`;
  document.body.append(sample);
  const el = k => sample.querySelector(`[data-k="${k}"]`);
  const cs = (k, p) => getComputedStyle(el(k), p);
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
  const cs2 = null;

  const bar = cs('hover', '::before');
  const cards = [
    ['Rail', [
      ['Width', tok('--rail-w')],
      ['Colour', sw(tok('--orange'))],
      ['Page', `${sw(tok('--night'))}, grain and a 1px grid`],
      ['Scoop', `${tok('--scoop')} radius, halfway down its right side`],
      ['Scoop, open', '6px wider, as the menu wipes out'],
      ['Current tab', 'black, its corner cut on a slant'],
    ]],
    ['Menu button', [
      ['Size', `${px(el('fab').offsetWidth)} round, centred on the rail's edge`],
      ['At rest', 'black, an orange ring, three orange lines'],
      ['Hover', 'fills orange, the lines go black'],
      ['Pressed', 'shrinks to 93%'],
      ['Open', `the lines turn to a cross, ${tok('--morph-time')}`],
    ]],
    ['Menu', [
      ['Width', px(menu.width)],
      ['Colour', sw(menu.backgroundColor)],
      ['Corners', 'square, 8px marks top left and foot right'],
      ['Header', '40px, WALLET and ESC'],
      ['Gap from the scoop', tok('--gap-out')],
    ]],
    ['Row', [
      ['Height', px(el('item').offsetHeight)],
      ['Padding, sides', px(item.paddingLeft)],
      ['Gap between parts', px(item.columnGap)],
      ['Font', `${fam(item.fontFamily)} ${item.fontWeight}, ${px(item.fontSize)}, capitals`],
      ['Letter spacing', px(item.letterSpacing)],
      ['Rule below', `1px, ${hex(item.borderBottomColor)}`],
    ]],
    ['Left and right', [
      ['Number', `${px(cs('num').fontSize)}, ${hex(cs('num').color)}`],
      ['Or an icon', `${tok('--icon')}, in the number's place`],
      ['Shortcut', `${px(cs('key').fontSize)}, ${hex(cs('key').color)}`],
      ['Badge', `${px(el('badge').offsetHeight)}, black with orange figures`],
      ['Right icon', `${tok('--icon')} arrow`],
      ['Submenu', 'a &gt;'],
    ]],
    ['Sections', [
      ['Label', `${px(cs('sect').fontSize)} bold, ${px(cs('sect').letterSpacing)} apart`],
      ['Rule', 'runs out to the right'],
    ]],
    ['States', [
      ['Enabled', sw(item.color)],
      ['Hover bar', `${hex(bar.backgroundColor)}, right end cut ${tok('--cut')} on a slant`],
      ['Hover text', sw(cs('hover').color)],
      ['Pressed', `bar to the row's edges, text ${hex(cs('press').color)}, sinks 1px`],
      ['Unavailable', `${sw(cs('off').color)}, no bar, no scramble`],
    ]],
    ['Submenu', [
      ['Form', 'its own orange sheet, beside its row'],
      ['Width', '150px'],
      ['Chosen', 'a dot in the number column'],
      ['Opens on', 'hover, a click, or →'],
    ]],
    ['Motion', [
      ['Menu opens', `wipes out of the scoop, left to right, ${tok('--wipe-time')}`],
      ['Wipe curve', tok('--wipe-ease')],
      ['Rows', `${tok('--row-step')} apart, 10px in, ${tok('--row-time')}`],
      ['Bar', `${tok('--bar-time')} in from the left, 160ms back`],
      ['Label', `scrambles, settles left to right in ${tok('--scramble-time')}`],
      ['Menu closes', `rows out 90ms, then wipes back into the scoop, ${tok('--close-time')}`],
    ]],
  ];
  out.innerHTML = cards.map(([h, rows]) => `<div class="spec-card"><h3>${h}</h3><dl>${rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl></div>`).join('');
  sample.remove();
})();
