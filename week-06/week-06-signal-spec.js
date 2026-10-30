// Week 06, Set 2 · Signal: the spec, read from the values the prototype runs on.
// It builds a hidden sample of every part in every state, asks the browser what it computed,
// and writes the numbers into <section class="spec">. Nothing here is typed in by hand.
(() => {
  const out = document.querySelector('.spec-grid');
  if (!out) return;
  const root = getComputedStyle(document.documentElement);
  const tok = n => root.getPropertyValue(n).trim();

  const sample = document.createElement('div');
  sample.className = 'spec-measure';
  sample.style.width = '444px';
  sample.innerHTML = `
    <button class="s-row" data-k="row"><span class="s-num" data-k="num">01</span><span class="s-label">Intro</span><kbd class="s-key" data-k="key">I</kbd></button>
    <button class="s-row is-hover" data-k="hover"><span class="s-num">02</span><span class="s-label">Process</span></button>
    <button class="s-row is-press" data-k="press"><span class="s-num">02</span><span class="s-label">Process</span></button>
    <button class="s-row" aria-disabled="true" data-k="off"><span class="s-num">06</span><span class="s-label">Plans</span></button>
    <button class="s-row"><span class="s-badge" data-k="badge">12</span></button>
    <div class="s-sect" data-k="sect">Work</div>
    <div class="s-sub"><button class="s-row" data-k="sub"><span class="s-label">Brand</span></button></div>
    <button class="tag" data-k="tag"><span>MENU</span></button>
    <button class="shut" data-k="shut">X</button>`;
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
  const row = cs('row'), bar = cs('hover', '::before');

  const cards = [
    ['Sheet', [
      ['Covers', 'the whole page'],
      ['Colour', sw(tok('--orange'))],
      ['Header', '62px, MENU centred, × at the right'],
      ['Corners', '8px marks, top and foot left'],
      ['Foot', 'a network of 34 points, then two actions'],
    ]],
    ['Row', [
      ['Height', px(el('row').offsetHeight)],
      ['Padding, sides', px(row.paddingLeft)],
      ['Gap between parts', px(row.columnGap)],
      ['Font', `${fam(row.fontFamily)} ${row.fontWeight}, ${px(row.fontSize)}, capitals`],
      ['Letter spacing', px(row.letterSpacing)],
      ['Rule below', `1px, ${hex(row.borderBottomColor)}`],
    ]],
    ['Left column', [
      ['Number', `${px(cs('num').fontSize)}, ${hex(cs('num').color)}, ${tok('--num-w')} wide`],
      ['Or an icon', `${tok('--icon')}, in the number's place`],
    ]],
    ['Right side', [
      ['Shortcut', `${px(cs('key').fontSize)}, in [brackets]`],
      ['Badge', `${px(el('badge').offsetHeight)}, ${hex(cs('badge').backgroundColor)} with orange figures`],
      ['Right icon', `${tok('--icon')} arrow`],
      ['Submenu', '+ that turns to −'],
      ['Note', `${tok('--small')}, e.g. SOON`],
    ]],
    ['Sections', [
      ['Label', `${px(cs('sect').fontSize)} bold, ${px(cs('sect').letterSpacing)} apart`],
      ['Rule', 'runs out to the right'],
      ['Submenu rows', `${tok('--sub-h')} high, set in ${tok('--sub-indent')}, dashed rules`],
    ]],
    ['States', [
      ['Enabled', sw(row.color)],
      ['Hover bar', `${hex(bar.backgroundColor)}, right end cut ${tok('--cut')} on a slant`],
      ['Hover text', sw(cs('hover').color)],
      ['Pressed', `bar to the row's edges, text ${hex(cs('press').color)}, sinks 1px`],
      ['Unavailable', `${sw(cs('off').color)}, no bar, no scramble`],
    ]],
    ['Buttons', [
      ['MENU tag', `${px(el('tag').offsetWidth)} × ${px(el('tag').offsetHeight)}, four corner marks`],
      ['Tag, hover', 'fills orange'],
      ['Tag, pressed', 'shrinks to 95%'],
      ['×', `${px(el('shut').offsetWidth)} circle; hover fills black`],
    ]],
    ['Motion · open', [
      ['Sheet', `wipes in from the right, ${tok('--wipe-time')}`],
      ['Wipe curve', tok('--wipe-ease')],
      ['Rows', `${tok('--row-step')} apart, 10px in, ${tok('--row-time')}`],
      ['Network', 'points land, then lines are drawn, 700ms'],
      ['Submenu', 'opens under its row, 220ms'],
    ]],
    ['Motion · hover and close', [
      ['Bar in', `${tok('--bar-time')}, from the left, ${tok('--bar-ease')}`],
      ['Bar out', '160ms, back to the left'],
      ['Label', `scrambles, settles left to right in ${tok('--scramble-time')}`],
      ['Close', `rows out 90ms, then the sheet wipes back out to the right, ${tok('--close-time')}`],
    ]],
  ];
  out.innerHTML = cards.map(([h, rows]) => `<div class="spec-card"><h3>${h}</h3><dl>${rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl></div>`).join('');
  sample.remove();
})();
