# Advanced Interface

A 14-week log of vibe-coded design experiments. Each week has a post (process, result, critique) and a live demo that runs inside the site.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:4321. Every save shows up in the browser instantly.

## Add a week

```bash
npm run new-week 3
```

That copies `src/weeks/_template` to `src/weeks/week-03` and sets the week number and date. Then:

1. Edit `src/weeks/week-03/index.mdx`: title, tags, summary, and the Process / Result / Critique sections.
2. Build the experiment in `src/weeks/week-03/Demo.astro`. Plain HTML/CSS/JS or a React component, anything goes.
3. Put sketches and screenshots in `src/weeks/week-03/images/` and reference them as `![caption](./images/file.png)`.
4. Change `status: draft` to `status: posted` when it is ready. Drafts show locally but are hidden from the deployed site.

Or skip the script and duplicate the `_template` folder by hand. Nothing needs registering; the timeline and tag pages pick the folder up automatically.

## Where things live

```
src/weeks/week-01/        one folder per week
  index.mdx               frontmatter + writeup, <Demo /> marks where the demo embeds
  Demo.astro              the live experiment, served at /week-01/demo
  images/                 sketches and screenshots
src/pages/                site routes (home, tags, week post, demo)
src/components/           Timeline card, demo frame
src/layouts/Base.astro    site shell
src/styles/global.css     site styles (demos have their own scoped styles)
```

## URLs

| Page | URL |
|---|---|
| Timeline with tag filters | `/` |
| Week post | `/week-01` |
| Full-screen demo | `/week-01/demo` |
| All topics | `/tags` |
| One topic | `/tags/motion` |

## Frontmatter

```yaml
title: "Cursor-reactive gradient field"
week: 1
date: 2026-09-21
tags: [motion, color, interaction]
summary: "One line shown on the timeline."
status: posted        # draft | posted
```

## File naming

Lowercase only, hyphens instead of spaces, no Korean characters in file names. Week folders are `week-01` through `week-14`.

## Deploy

Every push to `main` on GitHub deploys automatically on Vercel.

```bash
git add -A
git commit -m "Week 03: title"
git push
```
