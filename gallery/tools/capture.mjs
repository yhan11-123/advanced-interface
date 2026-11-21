// Advanced Interface - capture a still of every gallery item.
// Reads gallery/items.js, opens each piece in headless Chrome from the local
// server, and saves gallery/thumbs/NAME.jpg (720 px wide). Existing stills are
// kept; pass --force to retake them all, or a name to retake just that one:
//   node gallery/tools/capture.mjs [--force | week-09-strata-nav]
// Needs Google Chrome and the local server: python3 -m http.server 4173
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const BASE = 'http://localhost:4173/';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const arg = process.argv[2] || '';

const src = readFileSync(join(ROOT, 'gallery', 'items.js'), 'utf8');
const { items } = JSON.parse(src.slice(src.indexOf('{'), src.lastIndexOf('}') + 1));
const todo = items.filter(it => arg === '--force' || (arg ? it.thumb.includes(arg) : !existsSync(join(ROOT, it.thumb))));
const seen = new Set(), queue = todo.filter(it => !seen.has(it.thumb) && seen.add(it.thumb));
if (!queue.length) { console.log('nothing to capture'); process.exit(0); }

const chrome = spawn(CHROME, ['--headless=new', '--remote-debugging-port=9351', '--hide-scrollbars', `--user-data-dir=${mkdtempSync(join(tmpdir(), 'gal-'))}`, 'about:blank'], { stdio: 'ignore' });
await new Promise(r => setTimeout(r, 1500));
const list = await (await fetch('http://127.0.0.1:9351/json')).json();
const ws = new WebSocket(list.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(r => ws.onopen = r);
let id = 0; const pend = {};
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) { pend[m.id](m.result); delete pend[m.id]; } };
const send = (method, params = {}) => new Promise(r => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });

for (const it of queue) {
  // a wide piece is a whole page (prototype, states, spec): its first screen; a sketch fills a 3:2 box
  const [w, h] = it.wide ? [1280, 853] : [960, 640];
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: BASE + it.src });
  await new Promise(r => setTimeout(r, 1800));
  const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 80, clip: { x: 0, y: 0, width: w, height: h, scale: 720 / w } });
  writeFileSync(join(ROOT, it.thumb), Buffer.from(shot.data, 'base64'));
  console.log('captured', it.thumb);
}
chrome.kill();
