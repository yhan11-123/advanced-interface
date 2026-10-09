// Week 03 · Playful: one-off pops, and the checkbox's burst lines.
// On change, the control gets .pop (just turned on) or .unpop (just turned off)
// for the length of its animation, so CSS keyframes run once per change.
// Each checkbox also gets a ring of short lines around it that fly out when it pops.
(function () {
  const NS = 'http://www.w3.org/2000/svg';
  const css = getComputedStyle(document.documentElement);
  const COLORS = ['--pop-1', '--pop-2', '--pop-3', '--pop-4', '--pop-5'].map(v => css.getPropertyValue(v).trim());

  // eight lines, alternating long and short, every 45°, starting just outside the box
  for (const box of document.querySelectorAll('.box')) {
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'burst');
    svg.setAttribute('viewBox', '-40 -40 80 80');
    svg.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < 8; i++) {
      const g = document.createElementNS(NS, 'g');
      g.setAttribute('transform', `rotate(${i * 45 + 22.5})`);
      const line = document.createElementNS(NS, 'line');
      const long = i % 2 === 0;
      line.setAttribute('x1', 0); line.setAttribute('y1', -19);
      line.setAttribute('x2', 0); line.setAttribute('y2', long ? -27 : -24);
      line.setAttribute('stroke', COLORS[i % COLORS.length]);
      g.append(line);
      svg.append(g);
    }
    box.append(svg);
  }

  function kick(ctl, cls) {
    ctl.classList.remove('pop', 'unpop');
    void ctl.offsetWidth;
    ctl.classList.add(cls);
    clearTimeout(ctl._t);
    ctl._t = setTimeout(() => ctl.classList.remove('pop', 'unpop'), 1000);
  }
  const chosen = new Map();
  for (const input of document.querySelectorAll('.sr-input')) {
    if (input.type === 'radio' && input.checked) chosen.set(input.name, input);
    input.addEventListener('change', () => {
      kick(input.nextElementSibling, input.checked ? 'pop' : 'unpop');
      if (input.type === 'radio') {
        const prev = chosen.get(input.name);
        if (prev && prev !== input) kick(prev.nextElementSibling, 'unpop');
        chosen.set(input.name, input);
      }
    });
  }
})();
