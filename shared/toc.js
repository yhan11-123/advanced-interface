/* ---------------------------------------------------------------
   Advanced Interface - "On this page": a table of contents that follows
   the reader. Add <script src="../shared/toc.js?v=1"></script> to a post.

   It reads the post itself: every h2 in .prose (but Sources) is a section,
   the h3s under it are its entries, and each deliverable set (.set-box)
   is an entry under its section too, which opens the set's popup. Headings
   without an id get one from their text. On a wide screen it sits fixed
   in the left margin; on a narrow one it folds into a "Contents" button in
   the lower right. The entry for the part being read is marked.
   --------------------------------------------------------------- */
(() => {
  const prose = document.querySelector('.prose');
  if (!prose) return;

  const slug = t => t.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const used = new Set([...document.querySelectorAll('[id]')].map(e => e.id));
  const idFor = (el, text) => {
    if (el.id) return el.id;
    let id = slug(text) || 'section', n = 2;
    while (used.has(id)) id = slug(text) + '-' + n++;
    used.add(id); el.id = id;
    return id;
  };

  // sections and their entries, in page order
  const sections = [];
  const nodes = prose.querySelectorAll('h2, h3, .set-box');
  for (const el of nodes) {
    if (el.closest('.sources')) continue;
    if (el.tagName === 'H2') {
      sections.push({ el, id: idFor(el, el.textContent), text: el.textContent.trim(), items: [] });
    } else if (sections.length) {
      if (el.closest('.set-box') && el.tagName === 'H3') continue;
      const text = el.matches('.set-box') ? el.querySelector('.set-name')?.textContent.trim() : el.textContent.trim();
      if (!text) continue;
      sections[sections.length - 1].items.push({ el, id: idFor(el, text), text });
    }
  }
  if (!sections.length) return;

  // the nav
  const nav = document.createElement('nav');
  nav.className = 'toc';
  nav.setAttribute('aria-label', 'On this page');
  nav.id = 'toc';
  let html = '<p class="toc-title">On this page</p><ol>';
  for (const s of sections) {
    html += `<li><a href="#${s.id}" class="toc-h2">${s.text}</a>`;
    if (s.items.length) html += '<ol>' + s.items.map(i => `<li><a href="#${i.id}">${i.text}</a></li>`).join('') + '</ol>';
    html += '</li>';
  }
  nav.innerHTML = html + '</ol>';
  document.body.appendChild(nav);

  // the narrow-screen button that opens it
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'toc-button';
  btn.setAttribute('aria-controls', 'toc');
  btn.setAttribute('aria-expanded', 'false');
  btn.textContent = 'Contents';
  document.body.appendChild(btn);
  const setOpen = on => { nav.classList.toggle('is-open', on); btn.setAttribute('aria-expanded', String(on)); };
  btn.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('is-open')) { setOpen(false); btn.focus(); } });
  document.addEventListener('click', e => { if (nav.classList.contains('is-open') && !nav.contains(e.target) && e.target !== btn) setOpen(false); });

  // a link to a set box opens it, even when the address already points there
  nav.addEventListener('click', e => {
    const a = e.target.closest('a');
    if (!a) return;
    const target = document.getElementById(a.hash.slice(1));
    // a set opens its popup
    if (target && target.matches('.set-box')) { e.preventDefault(); target.scrollIntoView({ block: 'center' }); target.querySelector('.set-card').click(); }
    else if (target && target.tagName === 'DETAILS') target.open = true;
    setOpen(false);
  });

  // mark the part being read: the last heading that has passed a line a third of the way down
  const links = [...nav.querySelectorAll('a')];
  const targets = links.map(a => document.getElementById(a.hash.slice(1)));
  let ticking = false;
  function mark() {
    ticking = false;
    const line = innerHeight * .33;
    let current = 0;
    for (let i = 0; i < targets.length; i++) if (targets[i].getBoundingClientRect().top <= line) current = i;
    links.forEach((a, i) => {
      const on = i === current;
      a.classList.toggle('is-current', on);
      if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
    // its section too, when the current entry is inside one
    const li = links[current].closest('ol ol')?.closest('li');
    nav.querySelectorAll('.toc-h2').forEach(a => a.classList.toggle('is-in', !!li && a.parentElement === li));
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(mark); } }, { passive: true });
  addEventListener('resize', mark);
  mark();
})();
