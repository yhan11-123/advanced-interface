# Advanced Interface

A 14-week log of vibe-coded design experiments. Each week has a page (process, result, critique) and a live demo that runs inside the site.

Plain HTML, CSS and JavaScript. No build step, no npm, no framework.

## Look at it

Double-click `index.html`. That is the whole workflow. Edit a file, save, refresh the browser.

## Add a week

1. Duplicate the `_template` folder and rename it `week-02`, `week-03`, and so on.
2. Rename the two files inside it the same way: `week-00.html` becomes `week-02.html`, and `week-00-demo.html` becomes `week-02-demo.html`. Every file carries its week number, so nothing is ever called `index.html` twice.
3. Open `week-02/week-02.html` and fill in the title, date, tags, and the Process, Result and Critique sections.
4. Build the experiment in `week-02/week-02-demo.html`. It shows up inside the page automatically and also opens on its own.
5. Put sketches and screenshots in `week-02/images/` and point at them with `<img src="images/sketch.png" />`.
6. Open `index.html` and replace the `Week 02 Upcoming` row with a filled-in row. Copy the Week 01 row as the model.

Step 6 is the only bookkeeping. The `data-tags` attribute on that row is what the topic filter reads, so keep it matching the tags in the post.

## Where things live

```
index.html            home: the 14-week timeline and topic filter
shared/site.css       every page except the demos
shared/favicon.svg
_template/            copy this to start a week
  week-00.html
  week-00-demo.html
  images/
week-01/
  week-01.html        the writeup
  week-01-demo.html   the live experiment, a page of its own
  images/             sketches and screenshots
```

Each demo is a separate page holding its own CSS and JavaScript, so a week's experiment can never break another week or the site around it.

## Photos of physical work

Scans and phone photos of sketches, paper prototypes and models go in that week's `images/` folder, same as screenshots. The template shows two patterns to copy: one image with a caption, and a row of images sharing one caption.

Rename phone files before adding them, since `IMG_4821.JPG` says nothing six weeks later. Something like `sketch-01.jpg` or `paper-test-02.jpg` works. If a photo is larger than a few megabytes, shrink it first so the repository stays quick to clone.

## File naming

Lowercase only, hyphens instead of spaces, no Korean characters in file names. Week folders are `week-01` through `week-14`, and the files inside repeat that number so every open tab says which week it is.

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
