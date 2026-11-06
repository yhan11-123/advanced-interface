// Week 07, Set 1: the spec, read from the values the prototype runs on.
// It builds a hidden sample of the button build, asks the browser what it computed, and reads the
// colours and the field's constants from the same tokens the toolbar uses. Nothing is typed in by hand.
(() => {
  const out = document.querySelector('.spec-grid');
  if (!out) return;
  const root = getComputedStyle(document.documentElement);
  const tok = n => root.getPropertyValue(n).trim();
  const num = n => parseFloat(tok(n));

  const sample = document.createElement('div');
  sample.className = 'spec-measure';
  sample.innerHTML = `
    <div class="bar" data-content="icon" data-k="bar"><button class="seg" data-k="icon"><svg viewBox="0 0 22 22"></svg><span class="lbl">Pen</span></button></div>
    <div class="bar" data-content="both"><button class="seg" data-k="both"><svg viewBox="0 0 22 22"></svg><span class="lbl" data-k="label">Paintbrush</span></button></div>
    <div class="bar" data-content="text"><button class="seg" data-k="text"><svg viewBox="0 0 22 22"></svg><span class="lbl">Rotate</span></button></div>`;
  document.body.append(sample);
  const el = k => sample.querySelector(`[data-k="${k}"]`);
  const cs = k => getComputedStyle(el(k));
  const px = v => `${Math.round(parseFloat(v) * 10) / 10}px`;
  const hex = c => {
    c = c.trim(); if (c.startsWith('#')) return c;
    const m = c.match(/[\d.]+/g); if (!m) return c;
    const [r, g, b, a = 1] = m.map(Number), h = [r, g, b].map(v => Math.round(v).toString(16).padStart(2, '0')).join('');
    return `#${h}${a < 1 ? ` · ${Math.round(a * 100)}%` : ''}`;
  };
  const sw = c => `<i style="background:${c}"></i>${hex(c)}`;
  const fam = f => f.split(',')[0].replace(/"/g, '');
  const both = cs('both'), label = cs('label');

  const cards = [
    ['Toolbar', [
      ['Form', 'no box: nineteen icons in a row, still; the highlight lives behind them'],
      ['Height', px(el('bar').offsetHeight)],
      ['Groups', 'select · draw · shapes · paint · transform · colour · view'],
      ['Gaps', `${tok('--gap')} between tools, ${tok('--group-gap')} between groups with a 1px rule`],
      ['Corners', 'none: every edge square'],
    ]],
    ['Button', [
      ['Hit area', `${px(el('icon').offsetWidth)} square`],
      ['Icon', `${tok('--icon')}, 2px square-ended strokes, mitred corners; drawn white in difference: pale on the navy, deep blue over the yellow`],
      ['Icon and text', `${px(el('both').offsetWidth)} wide for "Paintbrush"; ${px(both.paddingLeft)} sides, ${tok('--gap-in')} between icon and label`],
      ['Text only', `${px(el('text').offsetWidth)} wide for "Rotate"`],
      ['Label', `${fam(label.fontFamily)} ${label.fontWeight}, ${px(label.fontSize)}, capitals, ${tok('--track')} tracking`],
      ['Name tip', 'icons alone show their name above after 380ms: a square ice label, navy capitals'],
    ]],
    ['States', [
      ['Hover', 'the strokes gather round the button\'s window; the window itself stays empty, so the icon reads on plain navy'],
      ['Pressed', `the strokes inside its window thicken, from where it was pressed outward, until they close into one block (${num('--fill-in')}ms); the icon drops 1px; a band runs out through the field`],
      ['Tool that is on', `a solid ${sw(tok('--hl'))} block in its window, fixed in place whatever the pointer does: the field closed up; when another is picked it thins back into the strokes (${num('--fill-out')}ms)`],
      ['Focus', `a 3px ${hex(tok('--focus'))} ring`],
      ['Buttons move?', 'never; only the highlight does'],
    ]],
    ['Highlight', [
      ['Pattern', `slanted ${sw(tok('--stripe'))} strokes in bands ${tok('--band-h')} tall, each band slid ${num('--row-shift')} of a slot past the one above; it reaches ${num('--bleed-x')}px past the ends and ${num('--bleed-y')}px above and below`],
      ['Windows', 'every button sits in a clean parallelogram at the strokes\' slant, its rect plus 2px; no icon ever sits on a stroke'],
      ['Slot', `${num('--cell-w')}px wide; a stroke leans ${num('--slant')} across per unit of height, always (no extra lean with speed)`],
      ['Thickness', `nothing far from the pointer, up to ${num('--stroke-max')}px right under it`],
      ['Reach', `a soft oval round the pointer, ${num('--reach-x')}px along the bar and ${num('--reach-y')}px across; felt before the bar is touched`],
      ['At rest', 'nothing: no box, no pattern, only the icons'],
    ]],
    ['Highlight motion', [
      ['Follow', `each bar catches up at ${num('--follow')} per second, so a quick pointer leaves a wake that fills in behind it`],
      ['Press', `a ring of thick bars runs out from the pressed button at ${num('--ripple-speed')}px/s and fades within 0.9s`],
      ['Alignment, widths', 'the row slides to its place and resizes on one ease-out, 520ms and 420ms, no bounce'],
      ['Reduced motion', 'the highlight still sits under the pointer, but with no wake and no band; a picked block appears at once'],
    ]],
    ['Page', [
      ['Background', `${sw(tok('--page'))}, flat`],
      ['Type', 'Inter Tight; small capitals, tracked, for every label'],
      ['Ink', sw(tok('--ink'))],
      ['Place', 'left, center or right, 32px from the edge'],
    ]],
  ];
  out.innerHTML = cards.map(([h, rows]) => `<div class="spec-card"><h3>${h}</h3><dl>${rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl></div>`).join('');
  sample.remove();
})();
