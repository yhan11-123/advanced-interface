/* ---------------------------------------------------------------
   Advanced Interface - the "View larger" popup, shared by every week.

   Any <button class="viewer-open" data-src="sketch.html"> opens that
   sketch in a popup in the middle of the screen, half its width and
   height (so the same shape as the screen), each part its own floating
   card: the sketch; under it, the name and the card's description; and a
   small close button above the sketch's
   corner. Esc or a click outside closes it too. data-about overrides the
   description. data-wide opens it big instead, near the whole screen, with
   no description: for a piece that is itself a wide chart.
   The title comes from data-title, or else the card's name (with its
   tone, for a prototype), or else its iframe's title.

   The sketch is loaded with window.__viewer set ahead of its own scripts,
   so one that hides its own controls in a card can show them here, and
   one can lay itself out for the popup. If it can't be fetched (opened
   from disk, say) it still shows, only without that flag.
   --------------------------------------------------------------- */

(() => {
  // Put ahead of the sketch's own scripts.
  const FLAG = `<script>window.__viewer = true;<\/script>`;

  let dialog, frame, title, about, source = null, ticket = 0;

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
      </div>`;
    document.body.appendChild(dialog);
    frame = dialog.querySelector('iframe');
    title = dialog.querySelector('h2');
    about = dialog.querySelector('.viewer-about');

    dialog.querySelector('.viewer-close').addEventListener('click', () => dialog.close());
    // a click on the backdrop (outside the popup's box) closes it
    dialog.addEventListener('click', e => {
      const r = dialog.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close();
    });
    // stop the sketch once closed (unless another has been opened meanwhile)
    dialog.addEventListener('close', () => { if (dialog.open) return; ticket++; frame.removeAttribute('srcdoc'); frame.src = 'about:blank'; });
  }

  async function load() {
    const url = new URL(source, location.href).href, mine = ++ticket;
    try {
      const res = await fetch(url, { cache: 'no-cache' });   // always the sketch as it is now, not a copy kept from before
      if (!res.ok) throw new Error(res.status);
      const html = await res.text();
      if (mine !== ticket) return;          // closed, or something else opened, while it was fetched
      const head = `<base href="${url}">` + FLAG;
      frame.removeAttribute('src');
      frame.srcdoc = /<head[^>]*>/i.test(html) ? html.replace(/<head[^>]*>/i, m => m + head) : head + html;
    } catch (e) {
      if (mine !== ticket) return;
      frame.removeAttribute('srcdoc');
      frame.src = url;                     // shown as it is
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
    dialog.classList.toggle('is-wide', 'wide' in button.dataset);
    // the card's own words on it, if it has any
    const words = button.dataset.about ?? [...(card?.querySelectorAll('figcaption span:not(.soon)') || [])].map(el => el.textContent).join(' ');
    about.textContent = words;
    about.hidden = !words;
    load();
    dialog.showModal();
    dialog.focus();                        // start on the popup itself, not ringed on the close button
  }

  document.addEventListener('click', e => {
    const button = e.target.closest('.viewer-open');
    if (button) open(button);
  });
})();
