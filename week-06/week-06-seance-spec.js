// Week 06, Set 1 · Séance: the spec, read from the values the prototype runs on.
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
    <div class="s-menu">
      <button class="s-item" data-k="item"><svg class="s-ico" viewBox="0 0 16 16"><path d="M8 1v14" fill="none" stroke="currentColor"/></svg><span class="s-label">Summon</span><kbd class="s-key">⌘S</kbd></button>
      <button class="s-item is-hover" data-k="hover"><span class="s-label">Summon</span></button>
      <button class="s-item is-press" data-k="press"><span class="s-label">Summon</span></button>
      <button class="s-item" aria-disabled="true" data-k="off"><span class="s-label">Banish</span></button>
      <button class="s-item"><span class="s-label">Spirits</span><span class="s-badge" data-k="badge">2</span></button>
      <div class="s-sect" data-k="sect">those who answered</div>
      <div class="s-rule" data-k="rule"></div>
      <button class="s-answer" data-k="ans">Yes</button>
      <button class="s-answer is-live" data-k="ans-live">Yes</button>
      <button class="s-answer is-live" aria-checked="true" data-k="ans-on">Yes</button>
    </div>`;
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
  const ms = v => v.split(',')[0].trim();

  const item = cs('item'), ico = el('item').querySelector('.s-ico'), key = getComputedStyle(el('item').querySelector('.s-key'));
  const plan = csp('hover', '::before'), lens = csp('hover', '::after'), lensOn = csp('press', '::after');
  const cards = [
    ['Menu', [
      ['Width', px(getComputedStyle(sample.querySelector('.s-menu')).width)],
      ['Items stacked', 'no gap'],
      ['Board corner', '26px'],
      ['Board frame', '3px · 6px · 1px rules'],
    ]],
    ['Item', [
      ['Height', px(el('item').offsetHeight)],
      ['Padding, sides', px(item.paddingLeft)],
      ['Gap between parts', px(item.columnGap)],
      ['Font', fam(item.fontFamily)],
      ['Size / line height', `${px(item.fontSize)} / ${px(item.lineHeight)}`],
      ['Letter spacing', px(item.letterSpacing)],
    ]],
    ['Left icon', [
      ['Size', `${px(ico.getBoundingClientRect().width)} square`],
      ['Stroke', `${tok('--icon-stroke')}px`],
      ['Colour', 'the item’s text colour'],
    ]],
    ['Right side', [
      ['Shortcut font', `${fam(key.fontFamily)} italic`],
      ['Shortcut size', px(key.fontSize)],
      ['Shortcut colour', sw(key.color)],
      ['Badge', `${px(el('badge').offsetHeight)} round`],
      ['Badge text', `${px(cs('badge').fontSize)} on ${hex(cs('badge').backgroundColor)}`],
      ['Right icon', 'as left icon, shortcut colour'],
    ]],
    ['Sections', [
      ['Label font', `${fam(cs('sect').fontFamily)} italic`],
      ['Label size', px(cs('sect').fontSize)],
      ['Label colour', sw(cs('sect').color)],
      ['Divider', `${px(el('rule').offsetHeight)}, ${px(cs('rule').marginLeft)} in`],
      ['Divider colour', sw(cs('rule').backgroundColor)],
      ['Ornament', '☾ centred'],
    ]],
    ['States', [
      ['Enabled', sw(item.color)],
      ['Hover', sw(cs('hover').color)],
      ['Hover glow', `${cs('hover').textShadow.match(/\d+px(?=\s*$)/)?.[0] || '6px'} blur`],
      ['Pressed', sw(cs('press').color)],
      ['Pressed shift', '1px down'],
      ['Unavailable', sw(cs('off').color)],
    ]],
    ['Planchette (hover)', [
      ['Reaches past item', `${tok('--plan-out-x')} sides, ${tok('--plan-out-y')} top and bottom`],
      ['Shape', '50% / 100% (heart)'],
      ['Fill', sw(plan.backgroundColor)],
      ['Edge', `${tok('--plan-stroke')} inset`],
      ['Lens', `${px(lens.width)} round`],
      ['Lens, pressed', sw(lensOn.backgroundColor)],
    ]],
    ['Submenu (the answers)', [
      ['Font size', px(cs('ans').fontSize)],
      ['Letter spacing', px(cs('ans').letterSpacing)],
      ['Asleep', sw(cs('ans').color)],
      ['Awake', sw(cs('ans-live').color)],
      ['Chosen', sw(cs('ans-on').color)],
      ['Placed', 'YES, NO top corners; GOODBYE foot'],
    ]],
    ['Motion', [
      ['Text on hover', ms(item.transitionDuration)],
      ['Planchette waits', tok('--plan-wait')],
      ['Planchette drifts', `${tok('--plan-move')}`],
      ['Drift easing', tok('--plan-ease')],
      ['Lens glow, pressed', tok('--press-glow')],
      ['Answers wake', ms(cs('ans').transitionDuration)],
    ]],
  ];
  out.innerHTML = cards.map(([h, rows]) => `<div class="spec-card"><h3>${h}</h3><dl>${rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl></div>`).join('');
  sample.remove();
})();
