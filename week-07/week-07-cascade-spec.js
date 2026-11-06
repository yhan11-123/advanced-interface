// Week 07, Set 2 · Cascade: the spec, read from the values the prototype runs on.
(() => {
  const out = document.querySelector('.spec-grid');
  if (!out) return;
  const root = getComputedStyle(document.documentElement);
  const tok = n => root.getPropertyValue(n).trim();
  const num = n => parseFloat(tok(n));
  const sample = document.createElement('div');
  sample.className = 'spec-measure';
  sample.innerHTML = `
    <div class="pill" data-content="icon"><button class="btn" data-k="icon"><span class="face"><svg viewBox="0 0 22 22"></svg><span class="lbl">Pen</span></span></button></div>
    <div class="pill" data-content="both"><button class="btn" data-k="both"><span class="face"><svg viewBox="0 0 22 22"></svg><span class="lbl" data-k="label">Paintbrush</span></span></button></div>
    <div class="pill" data-content="text" data-k="bar"><button class="btn" data-k="text"><span class="face"><svg viewBox="0 0 22 22"></svg><span class="lbl">Rotate</span></span></button></div>`;
  document.body.append(sample);
  const el = k => sample.querySelector(`[data-k="${k}"]`);
  const cs = k => getComputedStyle(el(k));
  const px = v => `${Math.round(parseFloat(v) * 10) / 10}px`;
  const hex = c => { c = c.trim(); if (c.startsWith('#')) return c; const m = c.match(/[\d.]+/g); if (!m) return c; const [r, g, b, a = 1] = m.map(Number); return '#' + [r, g, b].map(v => Math.round(v).toString(16).padStart(2, '0')).join('') + (a < 1 ? ` · ${Math.round(a * 100)}%` : ''); };
  const sw = c => `<i style="background:${c}"></i>${hex(c)}`;
  const fam = f => f.split(',')[0].replace(/"/g, '');
  const label = cs('label');
  const z = num('--spring-zeta'), over = z < 1 ? Math.round(Math.exp(-z * Math.PI / Math.sqrt(1 - z * z)) * 1000) / 10 : 0;

  const cards = [
    ['Main toolbar', [
      ['Form', 'one rounded bar of nine tools; each holds more tools'],
      ['Height', px(el('bar').offsetHeight)],
      ['Corners', `half its height: fully round ends`],
      ['Colour', `${sw(tok('--ink'))} with ${hex(tok('--on-bar'))} icons, on ${sw(tok('--page'))}`],
      ['Inside', `${tok('--pad')} at each end, ${tok('--gap')} between buttons`],
    ]],
    ['Folding', [
      ['Press a tool', 'it keeps its place at the end of its row and turns into a pale disc'],
      ['Its tools', `a secondary bar on the row below, ${tok('--tier-gap')} down, its first tool under the pressed one`],
      ['The neck', `${tok('--neck')} thick, ink, from the pressed tool down into the first of its tools, ${tok('--tier-gap')} below`],
      ['The rest', `every main tool after the pressed one comes down to the new row, after the secondary bar, joined by a ${tok('--bridge')} bridge across ${tok('--join')}`],
      ['One shape', `bars and bridges are drawn together and melted (a ${num('--goo')}px blur, then a hard edge), so where they meet the outline runs on in one smooth curve`],
      ['Again', 'press a main tool on a lower row and it folds one more row down; at most three rows open'],
      ['Fold back', `the same motion played backwards: its tools leave right to left; ${num('--fold-back-wait')}ms later the bar draws in to a drop and the rest slide back left with it; then the drop and the rest rise together, the drop melting into its tool, which keeps the colour until it is home`],
    ]],
    ['Pair colours', [
      ['Why', 'an open tool and its secondary bar share one colour (the neck and bridges stay ink), so you can see which bar belongs to which tool'],
      ['Colours', `${sw(tok('--pair-1'))} ${sw(tok('--pair-2'))} ${sw(tok('--pair-3'))} ${sw(tok('--pair-4'))}, after a set of retro-tech cards`],
      ['Choosing', 'each open pair takes the first colour no other open pair is using; a tool opened again gets its old colour back if it is free'],
      ['Frame', `a secondary bar's colour sits ${tok('--frame')} inside its ink bar, so a black frame shows round it`],
      ['The rest', `main bars, necks and bridges stay ${hex(tok('--ink'))}; the bridge is a thin ${tok('--bridge')} band`],
    ]],
    ['Button', [
      ['Size', `${px(el('icon').offsetWidth)} round`],
      ['Icon', `${tok('--icon')}, Phosphor icons in their fill weight: solid shapes that hold up small on a dark bar`],
      ['Icon and text', `${px(el('both').offsetWidth)} wide for "Paintbrush"; ${tok('--text-pad')} sides`],
      ['Text only', `${px(el('text').offsetWidth)} wide for "Rotate"`],
      ['Label', `${fam(label.fontFamily)} ${label.fontWeight}, ${px(label.fontSize)}`],
      ['Name tip', 'icons alone show their name above after 420ms'],
    ]],
    ['States', [
      ['Hover', 'a soft pale circle behind it (14%)'],
      ['Pressed', 'the circle deepens (26%) and the icon gives to 88%'],
      ['Holds more', 'a small dot in its lower right corner'],
      ['Tools out', 'a disc in its pair colour, ink icon'],
      ['In its bar', `ink icons on the pair colour; the picked one on an ink disc set ${tok('--pick-inset')} in, so it never touches the bar's edge, its icon light, a dot in the pair colour; the main tool takes its icon`],
      ['Focus', `a 2px ${hex(tok('--focus'))} ring`],
    ]],
    ['Motion', [
      ['Spring', `stiffness ${num('--spring-k')}, damping ratio ${z}: a soft settle, about ${over}% past`],
      ['The rest', `travel as one solid piece of bar: they sink with the drop, then slide right as the bar spreads, so the bridge forms as they meet (each further row ${num('--stagger')}ms later)`],
      ['Opening', `a drop of the pair colour runs down out of the pressed tool, the ink neck stretching behind it; ${Math.round(num('--pipe-time') * .6)}ms in, it spreads to the right into the bar, its tools sliding in ${num('--stagger')}ms apart`],
      ['Picking', 'the main tool\'s icon turns into the picked one'],
      ['Alignment, widths', 'everything moves to its new place on the same spring'],
      ['Reduced motion', 'everything is simply in its new place'],
    ]],
  ];
  out.innerHTML = cards.map(([h, rows]) => `<div class="spec-card"><h3>${h}</h3><dl>${rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl></div>`).join('');
  sample.remove();
})();
