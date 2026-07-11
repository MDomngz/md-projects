# Columbia, Pennsylvania — Three Hundred Years on the River

A responsive heritage website for Columbia, PA's **tricentennial (1726–2026)**.
Pure static HTML + CSS + a small JS file — no build step, no dependencies,
ready for GitHub Pages.

## Structure (tricentennial edition)

Nine pages consolidated into four longer reads:

| File | Page |
|------|------|
| `index.html`  | Home — commemorative seal, 1726–2026 identity, three doorways |
| `story.html`  | The Story — the full chronicle in three centuries: The Crossing (1726–1826, incl. Wright's Ferry in depth), Fire & Freedom (1826–1926, incl. the Burning Bridge in depth), Keeping the Past (1926–2026) |
| `people.html` | People & Freedom — Susanna Wright, the founders, the Underground Railroad, and the 1834 riots in one continuous narrative |
| `visit.html`  | Visit & Archive — Wright's Ferry Mansion, antique markets, riverfront, plus the full sources archive |

Retired pages (`ferry.html`, `bridge.html`, `freedom.html`, `riots.html`,
`archive.html`) are kept as instant redirects to their new anchors, so old
links and bookmarks keep working.

Shared assets live in `assets/` (`style.css`, `site.js`). Image placeholders and a
manifest live in `images/` — see `images/README.md`.

## Design

The "river archive" system (aged-paper palette, Susquehanna slate, rationed
ember accent, brass details) now carries a **tricentennial layer**:

- A gold-on-slate anniversary ribbon above the nav on every page
- An SVG commemorative seal (300 / 1726–2026) in the hero and a mini seal in the brand
- Commemorative gold tokens (`--gold-deep`, `--gold-bright`) reserved for anniversary elements
- Century dividers structuring the chronicle (I · The Crossing, II · Fire & Freedom, III · Keeping the Past)
- Pill-style on-this-page navigation for the long consolidated pages
- A dark closing "tricentennial band" replacing plain CTAs at the foot of each page

Accessibility is unchanged: skip link, keyboard-navigable nav, descriptive
`role="img"` labels on every placeholder, semantic headings, strong contrast,
`prefers-reduced-motion` respected.

## Adding images

Each placeholder block in the HTML names a suggested filename and includes
ready-written alt text. Drop a real image into `images/`, then replace the
`<div class="img-ph">…</div>` with:

```html
<img src="images/your-file.jpg" alt="...the alt text from the placeholder...">
```

## Deploy to GitHub Pages

1. Create a repository and push these files to the root (keep the folder structure;
   `index.html` must be at the repo root).
   ```bash
   git init
   git add .
   git commit -m "Columbia, PA tricentennial site"
   git branch -M main
   git remote add origin https://github.com/<you>/<repo>.git
   git push -u origin main
   ```
2. On GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a
   branch**, branch **main**, folder **/ (root)**, then **Save**.
3. Your site goes live at `https://<you>.github.io/<repo>/` within a minute or two.

The included `.nojekyll` file tells GitHub Pages to serve the files as-is. All
links are relative, so the site works from the repo root or a project subpath.

## Notes

- Draft copy is grounded in public/institutional sources cited in the archive
  section of `visit.html`. Re-verify before publication; folklore (e.g. Susanna
  Wright's silk reaching Queen Charlotte) is marked as tradition, not settled fact.
- Per the brief's guardrail, the site keeps **Columbia, Pennsylvania** distinct from
  Columbia, Tennessee — the 1834 PA riots are not the 1946 "Mink Slide" TN events.
