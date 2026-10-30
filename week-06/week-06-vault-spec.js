// Week 06, Set 1 · Vault: the spec, read from the values the prototype runs on.
// It builds a hidden sample of a tile in every state, asks the browser what it computed,
// and writes the numbers into <section class="spec">. Nothing here is typed in by hand.
(() => {
  const out = document.querySelector('.spec-grid');
  if (!out) return;
  const root = getComputedStyle(document.documentElement);
  const tok = n => root.getPropertyValue(n).trim();
  const ms = n => parseFloat(tok(n));

  const sample = document.createElement('div');
  sample.className = 'spec-measure';
  sample.innerHTML = `
    <div class="t-sect" data-k="sect">Mission</div>
    <div class="t-grid" data-k="grid">
      <button class="tile" data-k="tile"><svg class="t-ico" data-k="ico" viewBox="0 0 24 24"></svg><kbd class="t-key" data-k="key">M</kbd><span class="t-note" data-k="note">2 NEW</span><span class="t-label" data-k="label">Map</span></button>
      <button class="tile is-hover" data-k="hover"><span class="t-label">Map</span></button>
      <button class="tile is-press" data-k="press"><span class="t-label">Map</span></button>
      <button class="tile" aria-expanded="true" data-k="open"><span class="t-label">Gear</span></button>
      <button class="tile" aria-disabled="true" data-k="off"><span class="t-label">Upgrades</span></button>
      <button class="tile"><span class="t-badge" data-k="badge">2</span></button>
    </div>
    <span class="board-glass" data-k="glass" style="position:relative;display:block;width:10px;height:10px"></span>`;
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
  const tile = cs('tile');

  const cards = [
    ['Board', [
      ['Fills', 'the bottom half of the play screen'],
      ['Leans back', tok('--board-tilt')],
      ['Glass', 'dotted every 20px, 62% to 80%'],
      ['Edge', `1px, ${hex(cs('glass').borderTopColor)}`],
      ['Corners', `18px brackets, ${tok('--edge')}`],
      ['Sections', `side by side, ${tok('--section-gap')} apart`],
    ]],
    ['Tile', [
      ['Size', `${px(el('tile').offsetWidth)} × ${px(el('tile').offsetHeight)}`],
      ['Shape', 'a plain box, square corners'],
      ['Padding', tok('--tile-pad')],
      ['Gap', `${tok('--tile-gap')} each way`],
      ['Fill', sw(tile.backgroundColor)],
      ['Label', `${fam(tile.fontFamily)} ${tile.fontWeight}, ${px(tile.fontSize)}, capitals, ${px(tile.letterSpacing)}`],
    ]],
    ['Parts', [
      ['Left icon', `${px(el('ico').getBoundingClientRect().width)}, top left, stroke ${tok('--icon-stroke')}`],
      ['Shortcut', `${fam(cs('key').fontFamily)} ${px(cs('key').fontSize)}, boxed, top right`],
      ['Badge', `${px(el('badge').offsetHeight)}, ${hex(cs('badge').color)} outline, top right`],
      ['Right icon', '14px arrow, top right'],
      ['Note', `${fam(cs('note').fontFamily)} ${px(cs('note').fontSize)}, above the label`],
      ['Submenu', '14px chevron, foot right'],
    ]],
    ['Sections', [
      ['Label', `${fam(cs('sect').fontFamily)} ${px(cs('sect').fontSize)}, ${px(cs('sect').letterSpacing)} apart`],
      ['Label colour', sw(cs('sect').color)],
      ['Rule', 'dashes of 6 and 4, after the label'],
    ]],
    ['States', [
      ['Enabled', `${sw(tile.color)} on 13% light`],
      ['Hover', `lifts ${tok('--lift')}, fill ${hex(cs('hover').backgroundColor)}, 26px glow`],
      ['Pressed', `lit through, ink ${hex(cs('press').color)}, sinks to 3px`],
      ['Submenu open', 'lit through, stays lifted'],
      ['Chosen', '2px hot outline, “EQUIPPED”'],
      ['Unavailable', `${sw(cs('off').color)}, dashed outline, never lifts`],
    ]],
    ['Submenu', [
      ['Form', 'a smaller board, stacked above the first'],
      ['Stands', '70px above the board'],
      ['Its boxes', 'built the same way, in five steps'],
      ['Tiles', 'three, one chosen at a time'],
    ]],
    ['Motion · the board', [
      ['Opens', `${tok('--open-time')}: a line of light, then the glass rises from it`],
      ['Boxes built', `left to right, ${tok('--stack-step')} apart`],
      ['Taken down', `right to left, ${tok('--leave-step')} apart`],
      ['Glass folds', `${tok('--close-time')}, back into its line`],
      ['Play', 'dims to 50% and pauses'],
      ['Hover', `${tok('--hover-time')}, ${tok('--ease-out')}`],
    ]],
    ['Motion · one box built', [
      ['1 · nodes', `two, opposite corners, 6px ${hex(tok('--node'))}`],
      ['2 · footprint', `+${tok('--phase')}, lines run out of the nodes, ${tok('--draw-time')}`],
      ['3 · dotted layer', `+${2 * ms('--phase')}ms, rises to ${tok('--mid-z')}`],
      ['4 · the box', `+${3 * ms('--phase')}ms, rises to ${tok('--rest')}, ${tok('--stack-time')}, edge flash`],
      ['Rise curve', tok('--stack-ease')],
      ['5 · its writing', `+${4.5 * ms('--phase')}ms, comes up 3px`],
    ]],
    ['Motion · one box taken down', [
      ['Writing, box', 'out together, 140–160ms'],
      ['Dotted layer', '+60ms, sinks'],
      ['Footprint', '+100ms, lines pulled back into the nodes'],
      ['Nodes', '+180ms, go last'],
      ['Log types', `${tok('--type-speed')} a letter`],
    ]],
  ];
  out.innerHTML = cards.map(([h, rows]) => `<div class="spec-card"><h3>${h}</h3><dl>${rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl></div>`).join('');
  sample.remove();
})();
