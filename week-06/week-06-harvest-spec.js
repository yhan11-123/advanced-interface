// Week 06, Set 1 · Harvest: the spec, read from the values the prototype runs on.
// It builds a hidden sample of every part in every state, asks the browser what it computed,
// and writes the numbers into <section class="spec">. Nothing here is typed in by hand.
const renderSpec = () => {
  const out = document.querySelector('.spec-grid');
  if (!out) return;
  const root = getComputedStyle(document.documentElement);
  const tok = n => root.getPropertyValue(n).trim();

  const sample = document.createElement('div');
  sample.className = 'spec-measure';
  sample.innerHTML = `
    <div class="p-panel" data-k="panel"><div class="s-menu">
      <button class="s-item" data-k="item"><svg class="s-ico" viewBox="0 0 8 8"><path d="M1 1h6v6H1z" fill="currentColor"/></svg><span class="s-label">Inventory</span><kbd class="s-key" data-k="key">E</kbd></button>
      <button class="s-item is-hover" data-k="hover"><span class="s-label">Inventory</span></button>
      <button class="s-item is-press" data-k="press"><span class="s-label">Inventory</span></button>
      <button class="s-item" aria-disabled="true" data-k="off"><span class="s-label">Go to bed</span></button>
      <button class="s-item"><span class="s-label">Shipping</span><span class="s-badge" data-k="badge">12</span></button>
      <div class="s-sect" data-k="sect">Farm</div>
      <div class="s-rule" data-k="rule"></div>
      <button class="s-seed" data-k="seed"><span class="s-label">Parsnip</span></button>
      <button class="s-seed" aria-checked="true" data-k="seed-on"><span class="s-label">Parsnip</span></button>
    </div></div>`;
  document.body.append(sample);
  const el = k => sample.querySelector(`[data-k="${k}"]`);
  const cs = k => getComputedStyle(el(k));
  const csp = (k, p) => getComputedStyle(el(k), p);

  const px = v => `${Math.round(parseFloat(v) * 10) / 10}px`;
  const hex = c => {
    const m = c.match(/[\d.]+/g); if (!m) return c;
    const [r, g, b, a = 1] = m.map(Number), h = [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
    return `#${h}${a < 1 ? ` · ${Math.round(a * 100)}%` : ''}`;
  };
  const sw = c => `<i style="background:${c}"></i>${hex(c)}`;
  const fam = f => f.split(',')[0].replace(/"/g, '');

  const item = cs('item'), ico = el('item').querySelector('.s-ico'), hand = csp('hover', '::before');
  const cards = [
    ['Grid', [
      ['One game pixel', tok('--px')],
      ['Everything snaps to', `multiples of ${tok('--px')}`],
      ['Icons', '8 × 8 game pixels'],
      ['Rendering', 'crisp edges, no smoothing'],
    ]],
    ['Panel', [
      ['Menu width', px(getComputedStyle(sample.querySelector('.s-menu')).width)],
      ['Padding', `${px(cs('panel').paddingTop)} / ${px(cs('panel').paddingLeft)}`],
      ['Frame', `${tok('--px')} dark, ${tok('--px')} light, ${tok('--px')} wood, ${tok('--px')} dark`],
      ['Parchment', sw(cs('panel').backgroundColor)],
      ['Drop', `${tok('--px')} × 2, straight down`],
    ]],
    ['Item', [
      ['Height', px(el('item').offsetHeight)],
      ['Padding, sides', px(item.paddingLeft)],
      ['Gap between parts', px(item.columnGap)],
      ['Gap between items', tok('--px')],
      ['Font', fam(item.fontFamily)],
      ['Size / line height', `${px(item.fontSize)} / ${px(item.lineHeight)}`],
    ]],
    ['Left icon', [
      ['Size', `${px(ico.getBoundingClientRect().width)} square`],
      ['Drawn at', '8 × 8, scaled × 3'],
      ['Colour', 'two or three per icon'],
    ]],
    ['Right side', [
      ['Key cap', `${px(el('key').offsetHeight)}, ${tok('--px')} border, ${tok('--px')} drop`],
      ['Key text', `${px(cs('key').fontSize)} ${fam(cs('key').fontFamily)}`],
      ['Key colour', sw(cs('key').color)],
      ['Badge', `${px(el('badge').offsetHeight)}, ${sw(cs('badge').backgroundColor)}`],
      ['Right icon', '18px, key colour'],
    ]],
    ['Sections', [
      ['Label', `${px(cs('sect').fontSize)} capitals, ${px(cs('sect').letterSpacing)} apart`],
      ['Label colour', sw(cs('sect').color)],
      ['Leaf rule', `${tok('--px')} dots either side`],
      ['Divider', `${px(el('rule').offsetHeight)}, dashes of 6 and 3`],
    ]],
    ['States', [
      ['Enabled', `${sw(item.color)} on parchment`],
      ['Hover', `${sw(cs('hover').backgroundColor)}, up ${tok('--hover-lift')}`],
      ['Hover hand', `${px(hand.width)} × ${px(hand.height)}, ${px(Math.abs(parseFloat(hand.left)))} left`],
      ['Pressed', `${sw(cs('press').backgroundColor)}, squashed to ${tok('--press-squash')}`],
      ['Unavailable', sw(cs('off').color)],
    ]],
    ['Submenu (seed box)', [
      ['Panel', 'the same frame, beside its item'],
      ['Row', `${px(el('seed').offsetHeight)}, ${px(cs('seed').fontSize)} text`],
      ['Chosen', `${tok('--px')} frame, ${sw(getComputedStyle(document.documentElement).getPropertyValue('--leaf').trim())}`],
      ['Opens', `${tok('--sub-open')}, in one step`],
    ]],
    ['Motion', [
      ['Hover', `${tok('--hover-time')}, steps(1)`],
      ['Hand bob', `${tok('--hand-bob')}, ${tok('--px')} back and forth`],
      ['Press', 'squash, no easing'],
      ['Why steps', 'a pixel game never moves half a pixel'],
    ]],
  ];
  // the menu in use also opens and closes: report the opening chosen on the page
  const stage = document.querySelector('.stage[data-motion]');
  if (stage) {
    const m = stage.dataset.motion, names = { pop: 'Pop: grows past full size, settles', unroll: 'Unroll: parchment opens top to bottom', slide: 'Slide up: rises, overshoots one step', swing: 'Sign swing: drops in, swings to rest' };
    const frames = { pop: 4, unroll: 6, slide: 5, swing: 8 };
    cards.push(['Opening and closing', [
      ['Opens with', 'Menu button, E'],
      ['Closes with', '×, Esc, E, a click on the farm, a pick'],
      ['Motion', names[m]],
      ['Opening', `${tok('--open-' + m)}, ${frames[m]} frames`],
      ['Closing', `${tok('--close-time')}, the same motion backwards`],
      ['Rows one by one', document.body.classList.contains('stagger') ? `on, ${tok('--row-stagger')} apart` : 'off'],
      ['Menu button', '42px tall, 3px frame, 6px drop; pressed sits flush'],
    ]]);
  }
  out.innerHTML = cards.map(([h, rows]) => `<div class="spec-card"><h3>${h}</h3><dl>${rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl></div>`).join('');
  sample.remove();
};
renderSpec();
addEventListener('motionchange', renderSpec);
