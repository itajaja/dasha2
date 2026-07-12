# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Who reads this file:** the owner of this website is not technical and doesn't want to be. This document is written so that *she* can read it too. Any Claude working here should communicate the same way: talk about what the website does for visitors, not about how it was built.

## What this project is

This is the personal website of **Dasha (Darja) Filippova** — performance artist, ritual theatre maker, and scholar. It is live on the internet at **[darjafilippova.com](http://darjafilippova.com)**.

The whole website is a single page. Visitors scroll down through it, or jump to a section using the menu at the top.

## What's on the website

- **A welcome screen** with Dasha's name (in Russian and English) that fills the whole window when you first arrive.
- **About** — Dasha's story in her own words.
- **Sacra Kaka (The Book)** — a presentation of her book, with a link to read an excerpt and a list of shorter published writing.
- **Performance & Ritual Theatre** — the heart of the site: photo albums of her rituals and performances (Descent Ritual, Ascent Rituals, Summer Solstice, La Pocha Nostra, and more). Each album opens when clicked, and any photo can be enlarged to full screen. Press anywhere (or the Escape key) to close it again.
- **Scholarship** — her academic writing.
- **Teaching** — her teaching practice ("radical tenderness").
- **Contact** — how to write to her.

Nice touches visitors will notice: sections fade in gently as you scroll, the top menu highlights where you are on the page, and everything works on phones as well as computers.

## How a change gets onto the live website

Think of it like editing a book with an editor:

1. **The contractor (Claude) prepares the change** on a separate draft copy, so the live website is never touched directly.
2. **You press the "Create PR" button** shown in the Claude interface. This turns the draft into a proposal (a *pull request*, or "PR").
3. **You merge the PR.** The link to it appears right in the same interface.
4. **The website updates itself automatically.** Within a few minutes of merging, the change is live at darjafilippova.com. Nothing else needs to be done.

If you're *not* happy with the change, don't create or merge anything — just tell the contractor what you'd like different. Nothing changes on the live site until you merge.

## Notes for Claude (the contractor)

- **Audience first:** explain everything in terms of what visitors will see and experience. No jargon in messages, commit summaries the owner might read, or PR descriptions. If a technical term is unavoidable (like "pull request"), explain it in one plain sentence.
- **Always show the end result:** finish every piece of work by publishing an artifact — one link the owner can open, scroll, and click like the real website. Build it with the preview script (see technical notes below), never by hand. In these previews the photographs appear as black rectangles of exactly the right size and place, and a small banner at the bottom says so — everything else (text, colors, fonts, animations, menus, galleries) is the real site. Don't substitute screenshots unless the owner asks for them.
- **Never change the live site directly:** work on a branch and push it. Do not create the pull request yourself and do not paste GitHub links — the Claude interface shows a "Create PR" button and the relevant links on its own. When the work is ready, simply ask the owner to click "Create PR" and then merge the PR. No click-by-click instructions.
- Technical facts, kept out of the owner's way:
  - Plain static site — no build step, no dependencies. `index.html` is the entire page, `styles.css` the styling, `site.js` the interactions (gallery open/close, lightbox, scroll-reveal, nav state), `img/` the photographs.
  - Preview locally with `python3 -m http.server 8000` and open http://localhost:8000.
  - Preview artifact: `python3 tools/build-preview.py <output.html>` packs the site into one self-contained file — inlines `styles.css` and `site.js`, embeds the fonts and the two background photos, swaps every other photo for a black rectangle of identical dimensions, rewrites PDF links to the live site, and emits pure ASCII (the artifact host controls the page's encoding declaration, so raw Cyrillic or em-dashes would render garbled). Publish that file as the artifact. Verify it in a browser before publishing.
  - Merging to `main` publishes automatically: `.github/workflows/deploy.yml` pushes the site to the `gh-pages` branch, which GitHub Pages serves at darjafilippova.com.
