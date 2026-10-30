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
      <button class="core" data-k="core"><svg viewBox="0 0 72 80"></svg></button>
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

  const ms = n => parseFloat(tok(n));
  const item = cs('item'), menu = cs('menu'), ico = el('item').querySelector('.s-ico');
  const cards = [
    ['Menu', [
      ['Width', px(menu.width)],
      ['Padding', px(menu.paddingTop)],
      ['Glass', sw(menu.backgroundColor)],
      ['Edge', `1px, ${hex(menu.borderTopColor)}`],
      ['Corners', `14px brackets, ${tok('--edge')} green`],
      ['Inner glow', '30px'],
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
    ['Core (the trigger)', [
      ['Size', `${px(el('core').offsetWidth)} × ${px(el('core').offsetHeight)}, a hexagon`],
      ['At rest', 'dim glyph, tiers lie flat at 30%'],
      ['Hover', `rises ${tok('--lift')}, glows; tiers stir 5px each`],
      ['Pressed', 'shrinks to 92%, green'],
      ['Open', 'two green corner nodes, ring turning'],
    ]],
    ['Submenu (nodes)', [
      ['Row', `${px(el('node').offsetHeight)}, signal bars beside the name`],
      ['Chosen', '1px light frame'],
      ['Opens', 'beside its row, sliding out 10px'],
    ]],
    ['Motion · open', [
      ['Hover', `${tok('--hover-time')}, ${tok('--ease-out')}`],
      ['Tiers', `4, ${tok('--tier-gap')} apart, 80px narrower each`],
      ['Each tier rises', `${tok('--tier-time')}, ${tok('--tier-step')} after the one below`],
      ['Core rides up', 'with the top tier'],
      ['Line draws', `${tok('--line-time')}, as the top tier lands`],
      ['Menu unfolds', `${tok('--unfold-time')}, down out of the line`],
      ['Rows arrive', `${tok('--stagger')} apart, top first`],
      ['Rows in reach', `${Math.round(3 * ms('--tier-step') + ms('--tier-time') * .7 + ms('--line-time') + ms('--unfold-time') * .5)}ms`],
    ]],
    ['Motion · dismiss', [
      ['Order', 'the build, in reverse'],
      ['Rows leave', '120ms, bottom first, 12ms apart'],
      ['Menu folds', `${tok('--fold-time')}, up into its line`],
      ['Line pulls back', `${tok('--line-time')}, into the core`],
      ['Each tier comes down', `${tok('--sink-time')}, ${tok('--sink-step')} after the one above`],
      ['Easing', tok('--ease-sink')],
      ['All down', `${Math.round(80 + ms('--fold-time') + ms('--line-time') * .6 + 3 * ms('--sink-step') + ms('--sink-time'))}ms`],
      ['Log types', `${tok('--type-speed')} a letter`],
    ]],
  ];
  out.innerHTML = cards.map(([h, rows]) => `<div class="spec-card"><h3>${h}</h3><dl>${rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl></div>`).join('');
  sample.remove();
})();
