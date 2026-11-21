#!/usr/bin/env python3
"""Advanced Interface - collect the gallery.

Reads index.html (week titles) and every week-NN/week-NN.html, and lists each
deliverable prototype (figure.proto inside a set's dialog) and each Ideation
sketch (figure.idea). Writes gallery/items.js, which gallery.html loads.

Run from the site root:   python3 gallery/tools/build.py
Then capture any missing stills:   node gallery/tools/capture.mjs
(the capture needs the local server running: python3 -m http.server 4173)

Needs BeautifulSoup (pip install beautifulsoup4).
"""
import json, re, pathlib
from bs4 import BeautifulSoup

ROOT = pathlib.Path(__file__).resolve().parents[2]


def text(el):
    return re.sub(r'\s+', ' ', el.get_text(' ', strip=True)) if el else ''


def first_sentence(s, limit=150):
    m = re.match(r'(.+?[.!?])(\s|$)', s)
    out = m.group(1) if m else s
    return out if len(out) <= limit else out[:limit].rsplit(' ', 1)[0] + '…'


def src_of(fig):
    btn = fig.select_one('.viewer-open[data-src]')
    src = btn['data-src'] if btn else fig.select_one('iframe')['src']
    return src.split('?')[0], bool(btn and btn.has_attr('data-wide'))


def main():
    index = BeautifulSoup((ROOT / 'index.html').read_text(), 'html.parser')
    titles = {}
    for a in index.select('ol.timeline a[href]'):
        m = re.match(r'week-(\d\d)/', a['href'])
        if m:
            titles[int(m.group(1))] = text(a.select_one('.title'))

    items = []
    for page in sorted(ROOT.glob('week-[0-9][0-9]/week-[0-9][0-9].html')):
        week = int(page.parent.name[-2:])
        soup = BeautifulSoup(page.read_text(), 'html.parser')
        folder = page.parent.name

        # deliverables: each set's dialog holds its prototypes
        for dlg in soup.select('dialog.set-dialog'):
            num = text(dlg.select_one('.set-num'))
            name = text(dlg.select_one('.set-name'))
            card = soup.select_one(f'button.set-card[aria-controls="{dlg.get("id")}"]')
            line = text(card.select_one('.set-line')) if card else ''
            # the set's own line starts with its tone when it has one ("Kinetic. A picture editor's board ...")
            m = re.match(r'([A-Z][a-z]+(?: and [a-z]+)?)\. (.*)', line)
            tone, rest = (m.group(1), m.group(2)) if m else ('', line)
            protos = dlg.select('figure.proto')
            for fig in protos:
                src, wide = src_of(fig)
                part = text(fig.select_one('figcaption b'))
                about = ' '.join(text(s) for s in fig.select('figcaption span'))
                # a wide piece is the whole set on one page: named by the set, described by the set's line
                items.append({
                    'kind': 'deliverable', 'week': week, 'set': f'{num} · {name}', 'tone': tone,
                    'title': name if not part or (wide and len(protos) == 1) else f'{name} · {part}',
                    'about': rest if wide and rest else about,
                    'short': first_sentence(rest if wide and rest else about), 'src': f'{folder}/{src}', 'wide': wide,
                })

        # ideation: every sketch in the Ideation grid
        for fig in soup.select('figure.idea'):
            if not fig.select_one('iframe'):
                continue
            src, wide = src_of(fig)
            about = ' '.join(text(s) for s in fig.select('figcaption span:not(.soon)'))
            items.append({
                'kind': 'ideation', 'week': week, 'set': '',
                'title': text(fig.select_one('figcaption b')) or src,
                'about': about, 'short': first_sentence(about), 'src': f'{folder}/{src}', 'wide': wide,
            })

    for it in items:
        it['thumb'] = 'gallery/thumbs/' + pathlib.Path(it['src']).stem + '.jpg'
    weeks = [{'week': w, 'title': titles.get(w, '')} for w in sorted({i['week'] for i in items})]

    out = ROOT / 'gallery' / 'items.js'
    out.write_text('/* written by gallery/tools/build.py - do not edit by hand */\n'
                   f'window.GALLERY = {json.dumps({"weeks": weeks, "items": items}, ensure_ascii=False, indent=1)};\n')
    print(f'{len(items)} items ({sum(i["kind"] == "deliverable" for i in items)} deliverables) -> {out.relative_to(ROOT)}')


if __name__ == '__main__':
    main()
