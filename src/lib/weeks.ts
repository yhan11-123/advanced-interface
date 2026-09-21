import { getCollection, type CollectionEntry } from 'astro:content';

export type Week = CollectionEntry<'weeks'>;
export const TOTAL_WEEKS = 14;
export const SITE_NAME = 'Advanced Interface';

export const pad = (n: number) => String(n).padStart(2, '0');

/** "src/weeks/week-03/index.mdx" -> "week-03" */
export function slugOf(entry: Week): string {
  const parts = (entry.filePath ?? entry.id).split('/');
  return parts[parts.length - 2] ?? entry.id;
}

export function slugForWeek(n: number): string {
  return `week-${pad(n)}`;
}

/** All weeks, sorted by week number. Drafts only appear in dev. */
export async function getWeeks(): Promise<Week[]> {
  const all = await getCollection('weeks', (e) => import.meta.env.DEV || e.data.status === 'posted');
  return all.sort((a, b) => a.data.week - b.data.week);
}

/** [tag, count] pairs, most used first, then alphabetical. */
export function tagCounts(weeks: Week[]): [string, number][] {
  const counts = new Map<string, number>();
  for (const w of weeks) for (const t of w.data.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
}
