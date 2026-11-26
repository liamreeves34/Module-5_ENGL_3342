---
version: 1
slug: "src-pages-index-astro"
primary_target: "src/pages/index.astro"
related_targets: []
---

## Scope and mode

Home / shelf page (`src/pages/index.astro`) and the book flow it opens into: open-book spread and full-screen reading view for Modules 1–4, Style Guide, and Bio. Mode: Experience (the work leads). The reading view itself behaves as Read.

Audience: Dr. Paudel grading the Module 5 portfolio. Job: find every required section and document within seconds, on any device. Constraints: PRODUCT.md's Assignment compliance list.

## Direction contract

THESIS: A semester of technical writing shelved as hand-colored pixel books on engineering computation paper. The grid that holds a drafter's sketch is the grid the art is built on. It refuses the template portfolio (cards, tabs, hero plus grid) and Stripe Press's photoreal objects alike.

OWN-WORLD: Pale-green engineering pad ground #EEF3E4 with 8px fine and 40px major green rules. Graphite ink #1F2A1D. Blue pencil #2452B5 reserved for annotation, focus, and the active book. Books are filled square by square on the 8px grid in a strict marker palette (cobalt, teal, mustard, oxblood, orange, graphite, plus band colors), with page stock #F7F6EE and a graphite pixel ledge. Type: Barlow Semi Condensed 700 for display, Atkinson Hyperlegible Next for body. Components speak drafting: dimension lines, leader callouts, ruled tables. No rounded cards, no gradients.

STORY: The visitor sees Liam's name and six labeled books, and reads the welcome below the shelf. Hovering or tabbing pulls a book out face-out and the title band updates. Clicking opens the spread: contents on the left, reflection on the right. Other lines turn the page. "Read full screen" opens the document. Exiting reverses every step.

FIRST VIEWPORT: The header has the name on the left and the text nav on the right (Home · Modules ▾ · Style Guide · Bio). Below it, the h1 "Four modules of technical writing in computer science" at 56px on the left with a meta line on the right (it stacks under 960px). Hovering or focusing a book swaps the h1 text to that book's full title. Centered beneath, six pixel books at an 8px cell (spines 88×352, face-out 240×352) on a full-width ledge, no book pulled out on load; a blue-pencil dimension line appears over the face-out book on hover or focus. The Guide spine cloth is #EC7F45 so its 17px label clears 4.5:1. Then a one-line invitation ("Pick any book off the shelf to see what’s inside."; no keyboard hint, at Liam's request), and the welcome section (240px portrait plus a 68ch column) starting about 740px down. The primary action is the books themselves, each a real link.

FORM: candidate 6 of 7 on the grounded list (engineering computation pad), seed:542d3edae1a59a8a. Pinned by Liam and honored: "every module to be a book … opens into a 'table of contents' page", "pixel art like construction", interaction modeled on stripe.press.
- Raise from the CRT arcade challenger (declined): grid law. Every pixel sits on the integer-scaled 8px grid, nothing off-grid, and state changes are sprite swaps.
- Raise from the WPA poster challenger (declined): on phones the shelf crops from the outside in, so the selected book always survives whole.
- Raise from the Rietveld house challenger (declined): every transition is reversible and announced to assistive tech.
- Raise from the split-flap board challenger (declined): the contents is a fixed ruled table; only the selected row and the right page change.
- Raise from the bioluminescent sea challenger (declined): blue pencil marks only the active thing. Accretion disk (declined): nothing beyond that.
Signature interaction: a six-frame, stepped pixel page flip between contents entries. Motion grammar: books pull out two cells in whole-cell steps; open and close run through view transitions; reduced motion crossfades.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Layout rules

- The open-book spread appears at 1100px and wider; below that the pages stack, full-width up to 720px.

## Unresolved

- Resolved: Liam's generated pixel-art avatar (public/images/liam-avatar.webp), unaltered, 240px in an 8px ink frame.
- Copy drafts await Liam's revision.
