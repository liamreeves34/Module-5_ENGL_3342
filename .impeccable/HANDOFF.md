# Handoff: design phase → build

Start here in a new Claude Code session. Read these first (and `.impeccable/DECISIONS.md` for the reasoning behind each decision):

1. `PRODUCT.md`: product truth, the binding bookshelf direction, and the **Assignment compliance** checklist every step is checked against.
2. `.impeccable/surfaces/src-pages-index-astro.md`: the direction contract for the shelf and book flow (look, first viewport, layout rules).
3. `.impeccable/mocks/flow/*.png`: approved mockups (direction A, engineering computation pad): shelf, hover, open book (reflection and document preview), reading view, tablet.
4. `.impeccable/mocks/decision/`: the direction round (A chosen, B declined).

## Status (Nov 25, 2026)

- Direction A is locked. The mockups are approved in principle by Liam, pending the Style Guide and Bio books.
- `.impeccable/config.json` has `buildPath: comp` (mockups before code).
- The mockups are hand-built HTML and canvas, not image generations. Source is in `.impeccable/mocks/flow/src/` (`build.py` builds the shelf, `build2.py` builds the open book and reading view, `mock.js` draws the pixel art). It needs the fonts listed in `build.py`, fetched with `impeccable font-fetch` into `fonts/`.

## Drafted copy (Claude drafted; Liam revises before publishing)

- `content/drafts/home-welcome.txt`: 254 words. The assignment allows 250–300, so keep it at 250 or more.
- `content/drafts/module-2-reflection.txt`: 164 words (150+ required).

## Build status (Nov 25, 2026)

- The Astro build is in place: Home shelf (`/`), one route per module entry (`/modules/2`, `/modules/2/manual`), a reading view per document (`/modules/2/manual/read`), `/style-guide` and `/bio`. 27 static pages.
- Copy is read live from `content/drafts/*.txt` (via `src/data/books.ts`); the drafts are placeholders Liam revises once the site is up.
- PDFs and first-page previews come from `scripts/prepare-docs.sh`; the resume is published with the phone number removed from the PDF content stream (`scripts/redact-resume.py`).
- QA: `npm run build && npx astro preview`, then `node scripts/check-site.cjs http://localhost:4321` (sideways scroll, page overflow, WCAG AA contrast, alt text, internal links at 390/820/1024/1440).
- Still owed: the finish review by a fresh reviewer agent, then DESIGN.md; copy revision.

## Next steps (from the design phase)

1. Mock up the Style Guide and Bio books: full text across one spread, no table of contents.
2. Draft the Module 1, 3, and 4 reflections (150+ words each) and the Style Guide (150–200 words, 3–4 principles) and Bio (150–200 words, third person, contact: liam.reeves01@utrgv.edu and GitHub; no phone number).
3. Build in Astro: real routes per book, view transitions for open and close, the six-frame stepped page flip, PDFs served from `public/`, and a redacted resume (phone number removed).
4. Finish review, then DESIGN.md.

## Open

- Resolved Nov 26: Home uses Liam's generated pixel-art avatar, published unaltered (public/images/liam-avatar.webp).
