// Usage: npm run new-week 3   ->  creates src/weeks/week-03 from src/weeks/_template
import { cpSync, existsSync, readFileSync, writeFileSync } from 'node:fs';

const n = Number.parseInt(process.argv[2] ?? '', 10);
if (!Number.isInteger(n) || n < 1 || n > 14) {
  console.error('Usage: npm run new-week <1-14>');
  process.exit(1);
}

const slug = `week-${String(n).padStart(2, '0')}`;
const src = 'src/weeks/_template';
const dest = `src/weeks/${slug}`;

if (existsSync(dest)) {
  console.error(`${dest} already exists. Nothing changed.`);
  process.exit(1);
}

cpSync(src, dest, { recursive: true });

const mdxPath = `${dest}/index.mdx`;
const today = new Date().toISOString().slice(0, 10);
const mdx = readFileSync(mdxPath, 'utf8')
  .replace(/^week: .*$/m, `week: ${n}`)
  .replace(/^date: .*$/m, `date: ${today}`);
writeFileSync(mdxPath, mdx);

console.log(`Created ${dest}
  1. Fill in ${mdxPath}  (title, tags, summary, sections)
  2. Build the experiment in ${dest}/Demo.astro
  3. Set status: posted when it is ready to share
  Preview: http://localhost:4321/${slug}`);
