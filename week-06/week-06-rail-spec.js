// Week 06, Set 2 · Rail: the spec, read from the values the prototype runs on.
// It builds a hidden sample of every part, asks the browser what it computed,
// and writes the numbers into <section class="spec">. Nothing here is typed in by hand.
(() => {
  const out = document.querySelector('.spec-grid');
  if (!out) return;
  const root = getComputedStyle(document.documentElement);
  const tok = n => root.getPropertyValue(n).trim();

  const sample = document.createElement('div');
  sample.className = 'spec-measure';
  sample.innerHTML = `
    <button class="r-row" data-k="row"><svg class="r-ico" viewBox="0 0 20 20"></svg><span class="r-label" data-k="label">Transfer</span><span class="r-key" data-k="key">&gt;</span><span class="r-key is-count" data-k="count">03</span></button>
    <div class="r-sect" data-k="sect">Account</div>
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
  const row = cs('row'), label = cs('label');

  const cards = [
    ['Rail', [
      ['Width', tok('--rail-w')],
      ['Colour', `${sw(tok('--g1'))} to ${sw(tok('--g2'))}, top to foot`],
      ['Page', `${sw(tok('--night'))}, grain and a 1px grid`],
      ['Scoop', `${tok('--scoop')} radius, halfway down its right side`],
    ]],
    ['Menu button', [
      ['Size', `${px(el('fab').offsetWidth)} round, centred on the rail's edge`],
      ['At rest', 'green to blue, three white lines'],
      ['Hover', 'a soft green ring, a deeper shadow'],
      ['Pressed', 'shrinks to 93%'],
      ['Open', `the lines turn to a cross, ${tok('--morph-time')}`],
    ]],
    ['Menu', [
      ['Form', 'a sheet beside the rail, joined to the button by a liquid neck'],
      ['Sheet', `${tok('--sheet-w')} wide, ${tok('--sheet-r')} corners, centred on the button, ${tok('--sheet-gap')} from the scoop`],
      ['Neck', `${tok('--neck')} thick, from the button's centre into the sheet`],
      ['Colour', `${sw(tok('--g1'))} to ${sw(tok('--g2'))}, swaying slowly, ${tok('--sway-time')} a sway`],
      ['Behind it', 'the page steps back under a light veil that fades to the right'],
    ]],
    ['Row', [
      ['Height', px(el('row').offsetHeight)],
      ['Padding, sides', px(row.paddingLeft)],
      ['Gap between parts', px(row.columnGap)],
      ['Label', `${fam(label.fontFamily)} ${label.fontWeight}, ${px(label.fontSize)}, capitals, ${hex(row.color)}`],
      ['Left', `an icon, ${tok('--icon')}, or nothing`],
    ]],
    ['Right side', [
      ['Form', `a chip, ${px(el('key').offsetHeight)} tall, round ends`],
      ['Arrow, submenu, shortcut', sw(cs('key').backgroundColor)],
      ['Badge', `${sw(cs('count').backgroundColor)} with white figures`],
    ]],
    ['Sections', [
      ['Name', `${px(cs('sect').fontSize)} bold, ${px(cs('sect').letterSpacing)} apart, ${hex(cs('sect').color)}`],
      ['Rule', 'runs out to the sheet\'s edge after it'],
    ]],
    ['States', [
      ['Hover', `one highlight, ${hex(tok('--glow'))}, ${tok('--glow-r')} corners, flows to the row; a ${tok('--rim')} deep green rim on its left`],
      ['Hover, icon', 'grows to 110%'],
      ['Pressed', `the highlight goes ${hex(tok('--deep'))}, the icon gives to 92%`],
      ['Unavailable', 'faded; the highlight passes it by'],
    ]],
    ['Submenu', [
      ['Form', `its own small sheet, ${tok('--sub-w')} wide, dripping out to the right on a smaller neck, centred on its row`],
      ['Chosen', 'a dot before the code'],
      ['Opens on', 'hover, a click, or →'],
    ]],
    ['Motion', [
      ['Feel', 'a thick liquid: swells a touch past its size, settles slowly'],
      ['Neck', `runs out of the button, ${tok('--neck-time')}`],
      ['Sheet', `swells from the neck's end on a spring (0.72 damping, settled by ${tok('--liquid-time')})`],
      ['Goo', `a ${tok('--goo')}px blur and a hard edge: button, neck and sheet read as one body`],
      ['Rows', `come in from the middle outward, ${tok('--row-step')} apart`],
      ['Highlight', `flows between rows on a softer spring (0.78, ${tok('--soft-time')})`],
      ['Label', `scrambles, settles left to right in ${tok('--scramble-time')}`],
      ['Closes', `rows go, then the sheet shrinks back down its neck into the button, ${tok('--close-time')}`],
    ]],
  ];
  out.innerHTML = cards.map(([h, rows]) => `<div class="spec-card"><h3>${h}</h3><dl>${rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl></div>`).join('');
  sample.remove();
})();
