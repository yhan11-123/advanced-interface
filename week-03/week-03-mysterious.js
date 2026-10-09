// Week 03 · Mysterious (conspiracy): two things the CSS cannot do alone.
// 1. The pointer carries a small light over the list (--mx, --my on .stage).
// 2. Tampering. When you switch something on, there is a --tamper-chance that
//    some seconds later (--tamper-min to --tamper-max) it is quietly undone:
//    a burst of red static on the row, then it is off again, as if it never
//    took. A radio group falls back to what was chosen before. Changing it
//    yourself in the meantime cancels it. Screen readers are told plainly.
(function () {
  const stage = document.querySelector('.stage');
  const css = getComputedStyle(document.documentElement);
  const num = n => parseFloat(css.getPropertyValue(n));

  // ---------- the pointer's light ----------
  if (stage && !matchMedia('(hover: none)').matches) {
    let x = 0, y = 0, queued = false;
    stage.addEventListener('pointermove', e => {
      x = e.clientX; y = e.clientY;
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        stage.style.setProperty('--mx', x + 'px');
        stage.style.setProperty('--my', y + 'px');
      });
    });
    stage.addEventListener('pointerenter', () => stage.classList.add('is-lit'));
    stage.addEventListener('pointerleave', () => stage.classList.remove('is-lit'));
  }

  // ---------- tampering ----------
  const CHANCE = num('--tamper-chance'), MIN = num('--tamper-min'), MAX = num('--tamper-max');
  const BURST = num('--tamper-dur') * 1000;
  const live = document.createElement('p');
  live.setAttribute('aria-live', 'polite');
  live.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap';
  document.body.append(live);

  const inputs = [...document.querySelectorAll('.sr-input')];
  const labelOf = input => input.closest('.row').querySelector('.label').textContent.trim();
  const before = new Map();      // radio group name -> the input chosen before the latest choice
  const chosen = new Map();      // radio group name -> the input chosen now
  for (const i of inputs) if (i.type === 'radio' && i.checked) chosen.set(i.name, i);

  function undo(input) {
    const row = input.closest('.row');
    row.classList.remove('is-tampered');
    void row.offsetWidth;
    row.classList.add('is-tampered');
    setTimeout(() => {
      if (input.type === 'radio') {
        const back = before.get(input.name);
        if (!back || !input.checked) return;
        back.checked = true;
        before.set(input.name, input); chosen.set(input.name, back);
        live.textContent = `${labelOf(input)} was not kept. ${labelOf(back)} is chosen.`;
      } else {
        if (!input.checked) return;
        input.checked = false;
        live.textContent = `${labelOf(input)} was turned off.`;
      }
    }, BURST * .6);
    setTimeout(() => row.classList.remove('is-tampered'), BURST + 50);
  }

  for (const input of inputs) {
    input.addEventListener('change', () => {
      clearTimeout(input._tamper);
      if (input.type === 'radio') {
        const prev = chosen.get(input.name);
        if (prev && prev !== input) { before.set(input.name, prev); clearTimeout(prev._tamper); }
        chosen.set(input.name, input);
      }
      if (!input.checked || !(CHANCE > 0) || Math.random() >= CHANCE) return;
      const wait = (MIN + Math.random() * (MAX - MIN)) * 1000;
      input._tamper = setTimeout(() => undo(input), wait);
    });
  }
})();
