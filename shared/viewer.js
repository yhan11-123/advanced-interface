/* ---------------------------------------------------------------
   Advanced Interface - the "View larger" popup, shared by every week.

   Any <button class="viewer-open" data-src="sketch.html"> opens that
   sketch in a popup in the middle of the screen, half its width and
   height (so the same shape as the screen), each part its own floating
   card: the sketch; under it, the name and the card's description (2)
   beside a speed slider (1); and a small close button above the sketch's
   corner. Esc or a click outside closes it too. data-about overrides the
   description.
   The title comes from data-title, or else the card's name (with its
   tone, for a prototype), or else its iframe's title.

   Speed: the sketch is loaded with a small clock of its own put in
   first, so performance.now(), Date.now() and requestAnimationFrame
   times run at the chosen speed, and so do its CSS animations. If the
   sketch can't be fetched (opened from disk, say) it still shows, only
   without the slider. The sketch also finds window.__viewer set, so one
   that hides its own controls in a card can show them here.
   --------------------------------------------------------------- */

(() => {
  // Put ahead of the sketch's own scripts. window.__speed(s) sets the pace.
  const CLOCK = `<script>(() => {
    const P = performance, realNow = P.now.bind(P), realDate = Date.now, raf = requestAnimationFrame.bind(window);
    let speed = 1, last = realNow(), t = last, lastDate = realDate(), date = lastDate;
    const now = () => { const r = realNow(); t += (r - last) * speed; last = r; return t; };
    P.now = now;
    Date.now = () => { const r = realDate(); date += (r - lastDate) * speed; lastDate = r; return Math.round(date); };
    window.requestAnimationFrame = cb => raf(() => cb(now()));
    const css = () => { try { for (const a of document.getAnimations()) if (a.playbackRate !== speed) a.updatePlaybackRate(speed); } catch (e) {} };
    setInterval(css, 250);
    window.__speed = s => { now(); Date.now(); speed = s; css(); };
    window.__viewer = true;   // a sketch may show its own controls here, as it does on its own
  })();<\/script>`;

  let dialog, frame, title, about, slider, rate, source = null, ticket = 0;

  function build() {
    dialog = document.createElement('dialog');
    dialog.className = 'viewer';
    dialog.tabIndex = -1;
    dialog.setAttribute('aria-labelledby', 'viewer-title');
    dialog.innerHTML = `
      <button type="button" class="viewer-close" aria-label="Close">
        <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>
      </button>
      <div class="viewer-stage"><iframe title=""></iframe></div>
      <div class="viewer-info">
        <div class="viewer-text">
          <h2 id="viewer-title"></h2>
          <p class="viewer-about"></p>
        </div>
        <div class="viewer-speed">
          <input type="range" min="0.25" max="3" step="0.05" value="1" aria-label="Speed" />
          <button type="button" class="viewer-rate" title="Back to 1×">1.0×</button>
        </div>
      </div>`;
    document.body.appendChild(dialog);
    frame = dialog.querySelector('iframe');
    title = dialog.querySelector('h2');
    about = dialog.querySelector('.viewer-about');
    slider = dialog.querySelector('input');
    rate = dialog.querySelector('.viewer-rate');

    dialog.querySelector('.viewer-close').addEventListener('click', () => dialog.close());
    // a click on the backdrop (outside the popup's box) closes it
    dialog.addEventListener('click', e => {
      const r = dialog.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close();
    });
    // stop the sketch once closed (unless another has been opened meanwhile)
    dialog.addEventListener('close', () => { if (dialog.open) return; ticket++; frame.removeAttribute('srcdoc'); frame.src = 'about:blank'; });
    slider.addEventListener('input', () => { show(); try { frame.contentWindow.__speed?.(+slider.value); } catch (e) {} });
    // the readout doubles as a reset to normal speed
    rate.addEventListener('click', () => { slider.value = 1; slider.dispatchEvent(new Event('input')); });
    frame.addEventListener('load', () => { try { frame.contentWindow.__speed?.(+slider.value); } catch (e) {} });
  }

  // the readout, the filled part of the bar, and what a screen reader hears
  function show() {
    const s = +slider.value, min = +slider.min, max = +slider.max;
    slider.style.setProperty('--fill', ((s - min) / (max - min) * 100).toFixed(2) + '%');
    rate.textContent = (s < 1 ? s.toFixed(2) : s.toFixed(1)) + '\u00d7';
    slider.setAttribute('aria-valuetext', s.toFixed(2) + ' times');
  }

  async function load() {
    const url = new URL(source, location.href).href, mine = ++ticket;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(res.status);
      const html = await res.text();
      if (mine !== ticket) return;          // closed, or something else opened, while it was fetched
      const head = `<base href="${url}">` + CLOCK;
      frame.removeAttribute('src');
      frame.srcdoc = /<head[^>]*>/i.test(html) ? html.replace(/<head[^>]*>/i, m => m + head) : head + html;
      slider.disabled = false;
    } catch (e) {
      if (mine !== ticket) return;
      frame.removeAttribute('srcdoc');
      frame.src = url;                     // shown as it is, at its own speed
      slider.disabled = true;
    }
  }

  function open(button) {
    if (!dialog) build();
    source = button.dataset.src;
    const card = button.closest('figure');
    // the card's name, and for a prototype the tone it belongs to (the h3 above its grid)
    let tone = null;
    for (let el = card?.parentElement?.previousElementSibling; el && !tone; el = el.previousElementSibling) if (el.tagName === 'H3') tone = el.textContent;
    const own = card?.querySelector('figcaption b')?.textContent;
    const name = button.dataset.title
      || (own && (card.classList.contains('proto') && tone ? `${tone} · ${own}` : own))
      || card?.querySelector('iframe')?.title || 'Sketch';
    title.textContent = name;
    frame.title = name;
    // the card's own words on it, if it has any
    const words = button.dataset.about ?? [...(card?.querySelectorAll('figcaption span:not(.soon)') || [])].map(el => el.textContent).join(' ');
    about.textContent = words;
    about.hidden = !words;
    slider.value = 1;
    show();
    load();
    dialog.showModal();
    dialog.focus();                        // start on the popup itself, not ringed on the close button
  }

  document.addEventListener('click', e => {
    const button = e.target.closest('.viewer-open');
    if (button) open(button);
  });
})();
