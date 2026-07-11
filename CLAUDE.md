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
2. **The contractor sends a proposal** — on GitHub this is called a *pull request* (a "PR"). It's simply a page that shows what would change, and where you can approve it.
3. **You (the owner) approve it** by pressing the **"Merge"** button on that page.
4. **The website updates itself automatically.** Within a few minutes of merging, the change is live at darjafilippova.com. Nothing else needs to be done.

### If you're asked to "merge the pull request", here's exactly how

1. Open the link to the pull request (the contractor will always give you the link).
2. Read the description at the top — it explains the change in plain words.
3. If you're happy, scroll down and click the green **"Merge pull request"** button, then click **"Confirm merge"**.
4. That's it. Wait a few minutes, then visit darjafilippova.com and refresh the page to see the change.

If you're *not* happy, don't click anything — just tell the contractor what you'd like different. Nothing changes on the live site until you merge.

## Notes for Claude (the contractor)

- **Audience first:** explain everything in terms of what visitors will see and experience. No jargon in messages, commit summaries the owner might read, or PR descriptions. If a technical term is unavoidable (like "pull request"), explain it in one plain sentence.
- **Always show the end result:** finish every piece of work by showing the owner what it looks like — a rendered preview (artifact) of the page or document, not a wall of code.
- **Never change the live site directly:** work on a branch, push it, and give the owner clear, numbered, click-by-click instructions for opening and merging the pull request.
- Technical facts, kept out of the owner's way:
  - Plain static site — no build step, no dependencies. `index.html` is the entire page, `styles.css` the styling, `site.js` the interactions (gallery open/close, lightbox, scroll-reveal, nav state), `img/` the photographs.
  - Preview locally with `python3 -m http.server 8000` and open http://localhost:8000.
  - Merging to `main` publishes automatically: `.github/workflows/deploy.yml` pushes the site to the `gh-pages` branch, which GitHub Pages serves at darjafilippova.com.
