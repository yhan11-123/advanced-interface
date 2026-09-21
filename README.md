# Advanced Interface

A 14-week log of vibe-coded design experiments. Each week has a page (process, result, critique) and a live demo that runs inside the site.

Plain HTML, CSS and JavaScript. No build step, no npm, no framework.

## Look at it

Double-click `index.html`. That is the whole workflow. Edit a file, save, refresh the browser.

## Add a week

1. Duplicate the `_template` folder and rename it `week-02`, `week-03`, and so on.
2. Open `week-02/index.html` and fill in the title, date, tags, and the Process, Result and Critique sections.
3. Build the experiment in `week-02/demo.html`. It shows up inside the page automatically and also has its own address.
4. Put sketches and screenshots in `week-02/images/` and point at them with `<img src="images/sketch.png" />`.
5. Open `index.html` and replace the `Week 02 &middot; Upcoming` row with a filled-in row. Copy the Week 01 row as the model.

Step 5 is the only bookkeeping. The `data-tags` attribute on that row is what the topic filter reads, so keep it matching the tags in the post.

## Where things live

```
index.html            home: the 14-week timeline and topic filter
shared/site.css       every page except the demos
shared/favicon.svg
_template/            copy this to start a week
week-01/
  index.html          the writeup
  demo.html           the live experiment, a page of its own
  images/             sketches and screenshots
```

Each demo is a separate page holding its own CSS and JavaScript, so a week's experiment can never break another week or the site around it.

## File naming

Lowercase only, hyphens instead of spaces, no Korean characters in file names. Week folders are `week-01` through `week-14`.

## Save your work

```bash
git add -A
git commit -m "Week 02: title"
git push
```

The code lives on GitHub at `yhan11-123/advanced-interface`.

## Hosting

Not set up yet, on purpose. The site runs from local files.

When a public URL is needed for critique, any static host will serve this folder as-is, and a custom domain can point at it. There is nothing to build first.

## History

Weeks 1 was first built with Astro, a site framework. It was converted to plain HTML on 2026-09-21 to keep everything editable by hand. The Astro version is still in the git history if it is ever wanted back.
