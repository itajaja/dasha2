# darjafilippova.com

Personal website of Dasha (Darja) Filippova — performance artist, ritual theatre maker, and scholar.

A plain static site: no build step, no dependencies.

- `index.html` — the whole site (single page)
- `styles.css` — styles
- `site.js` — gallery toggles, lightbox, scroll-reveal, nav state
- `img/` — photographs

## Local preview

```
python3 -m http.server 8000
```

then open http://localhost:8000.

## Deployment

Pushes to `main` are published to the `gh-pages` branch by
`.github/workflows/deploy.yml`, which GitHub Pages serves at
[darjafilippova.com](http://darjafilippova.com).
