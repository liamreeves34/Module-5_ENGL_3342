# Decision log: Module 5 portfolio (design phase, Nov 24–25, 2026)

Why each decision was made, what was considered, and what was rejected. `PRODUCT.md` records *what* is true; this file records *why*. When a later change seems to conflict with something here, read the reasoning before overriding it.

---

## 1. Product and audience

**Audience: Dr. Paudel grading only.**
Liam confirmed the site only has to satisfy the assignment. An earlier assumption that recruiters and grad programs might see it was removed. Consequence: every trade-off favors what a grader checks (required sections, word counts, findability, mobile, accessibility) over impressing outsiders.

**Hosting: Vercel, served from the site root.**
It was originally GitHub Pages with base `/Module-5_ENGL_3342`. Liam switched to Vercel and removed `site` and `base`. Never add that prefix. Keep `import.meta.env.BASE_URL` wherever paths are built; it now resolves to `/`.

**Copy: Claude drafts, Liam revises.**
The reflections are graded as Liam's own development, so drafts are built strictly from his real documents (facts checked against the PDFs) and are never final until he signs off.

**Contact: `liam.reeves01@utrgv.edu` and GitHub only. No phone, no LinkedIn.**
Liam first typed a Gmail address by mistake, then confirmed the UTRGV address. The resume PDF contains his phone number, so a redacted copy must be published instead of the original.

**Peer review published unredacted.**
Joanna Gutierrez gave permission. It appears credited to her.

**Build path: mockups before code (`buildPath: comp`).**
Liam: "I want to nail the design before the code." No harness image generator was available (third-party generators would spend his credits), so the mockups are hand-built HTML/canvas renders, screenshotted with headless Chrome. That is arguably better for pixel art: exact grid and real text, with no AI-image artifacts.

---

## 2. The bookshelf direction (pinned by Liam)

**Source:** `example/sites.txt` plus screenshots of stripe.press. Liam wanted Stripe Press's shelf interaction with a different design philosophy:
- Every module is a book on a shelf, with a hover cue showing which book a click would select.
- A book opens to a table of contents, a contents line expands to full screen, exiting flips back to the contents, and exiting again returns the book to the shelf.
- The books are pixel art, not photoreal.

We take the interaction model only, never Stripe's logo, typefaces, cover art, or bracketed-mono label style. Pixel art also keeps the result visibly distinct.

### Structure questions (Liam's answers, with the reasoning offered)

| Decision | Chosen | Why | Rejected |
|---|---|---|---|
| Where Home, Style Guide, and Bio live | The shelf is Home; all six are books (Modules 1–4, Guide, Bio) | One consistent interaction. The Guide and Bio books are shaped differently (shorter, narrower) so they read as different kinds of book. | Shelf for modules only; a separate Home page |
| Pixel scope | Pixel objects on a clean page | The rubric grades readable fonts and contrast, and every page carries 150–300 word passages. Pixel body text would hurt reading. | A full pixel scene; pixel everything |
| Reading view | Flat full-screen page inside a book-edge frame | A 38-page PDF squeezed into a book page is unreadable, especially on a phone. | Reading inside a two-page spread |
| Text nav | Always visible (Home · Modules ▾ · Style Guide · Bio) | The rubric explicitly grades "clear navigation labels" and accessible navigation. It is also the keyboard and screen-reader path. | Shelf-only navigation |

### Open-book refinement (Liam, Nov 25)

Liam pictured "contents on the left page, content on the right." That reconciled with the flat reading view as follows:

- The open book is a spread with the **contents on the left** and a **preview of the selected entry on the right**. The reflection shows by default.
- **"Read full screen"** expands into the flat reading view.
- Choosing a different contents line **turns the page**.

Liam asked whether the page turn would cause jank. Answer: no, under three rules:
1. Animate only `transform` on one page element, so the browser can run it on the GPU without re-laying out the page.
2. Never put a live PDF viewer inside a turning page; iframes and PDF plugins stutter during transforms. Use a still first-page image plus a summary instead.
3. If the visitor clicks again mid-turn, finish the current turn before starting the next, so animations never pile up.

The turn is a **six-frame stepped pixel flip** (`steps()`), which suits the pixel world and is cheaper than a smooth 3D turn. The smooth 3D turn remains a one-line alternative. Reduced motion falls back to a crossfade. On phones the pages stack and the preview turns in place.

---

## 3. Assignment compliance: why the structure looks the way it does

Liam asked twice to verify adherence. The full checklist is in `PRODUCT.md` → *Assignment compliance*. These rules exist because the concept would otherwise break the rubric:

- **Real pages, not overlays.** The guidelines ask for modules as "separate pages or clearly divided sub-tabs." If books only opened as JS overlays on one page, back buttons and direct links would break, and the grader would land on the shelf. Each book is its own route, and the animations are a layer on top.
- **Home text sits on the shelf page, visible without opening a book.** The 250–300 words and the photo are graded Home content.
- **Reflections come first in each book's contents** (they were last in the first draft). They are the graded part.
- **The Style Guide and Bio have no contents page.** "Readable in one view" was required, and a contents list would split 150–200 words across entries.
- **PDFs get a preview image, an inline viewer, and an always-visible "Open PDF" link.** Android Chrome does not render embedded PDFs, so a grader on a phone would otherwise see a blank box.
- **Collaborators are credited:** Gaby Saboia on Module 3, Joanna Gutierrez on the peer review, Tim Trasmonte on the Module 4 workshop.

### Failures found by the second audit, and their fixes

1. **Tablets clipped the open book.** The spread is a fixed 1072px, so it cut off at 820px and 1024px. Fix: the spread appears only at **1100px and wider**; below that the pages stack full-width (max 720px). Checked at 390, 820, 1024, and 1440px.
2. **Home looked like Module 2.** The biggest text on load was a module title, so the grader would not know they were on Home. Fix: on load no book is pulled out, and the h1 reads "Six books from one semester of technical writing." Hovering or focusing a book swaps the h1 to that book's title (announced politely) and swaps it back afterward.
3. **Contrast.** The 17px "Guide" label on orange cloth measured 3.95:1. The cloth is now `#EC7F45`, which gives 5.46:1. All other measured pairs fall between 5.7:1 and 13.2:1.
4. **"164 words" in the contents** read like gaming the rubric. It now says "Read first."

---

## 4. Visual world: why the engineering pad

Liam's pins left palette, type, and page material open, so the design process ran its direction roll (`concept-seed --scope direction --mode experience`, seed `seed:542d3edae1a59a8a`). The mode is Experience, because the work itself leads on a portfolio shelf.

**Seven grounded candidates, each honoring the pin**, ordered by resonance:
1. University library stacks (QA76 call numbers)
2. Publisher's bookcloth catalogue
3. 16-bit RPG library
4. 1-bit Mac dithered art
5. Game Boy four-shade palette
6. **Engineering computation pad**
7. ANSI text-mode art

**The roll assigned #6.** It exists to break the ranking rut (the top-ranked option is what every run ships). Liam chose between:
- **A, engineering pad (assigned).** Pale-green engineering paper, where each pixel of the books is one 8px grid square, as if colored in by hand. Blue-pencil drafting dimension lines serve as annotation. Why it resonates: CS and engineering students plan on graph paper, and pixel art is literally designed on grids. It is also not the category default (cream paper plus serif for a book subject).
- **B, library stacks (Claude's top-ranked pick).** A steel shelf and bookcloth spines with QA76 labels; QA76 is the real Library of Congress class for computing. Honest risk: more familiar, and closer to Stripe Press itself.

**Liam chose A.**

**Challengers dealt by the roll, all declined.** Each lost on product clarity, and several also conflicted with the "clean page" pin. Each still donated one discipline:
- **CRT arcade:** grid law. Every pixel sits on the integer-scaled grid, and state changes are sprite swaps.
- **WPA poster:** on phones the shelf crops from the outside in, so the selected book stays whole.
- **Rietveld house:** every transition is reversible and announced to assistive tech.
- **Split-flap board:** the contents is a fixed ruled table; only the selected row and the right page change.
- **Bioluminescent sea:** the blue-pencil accent marks only the active thing.
- **Accretion disk:** nothing beyond the bioluminescent sea's rule.

**Type**
- Barlow Semi Condensed 700 for display: engineering and highway-gothic lettering that suits drafting.
- Atkinson Hyperlegible Next for body: designed for legibility, which supports the assignment's readability criteria.
- Both are self-hosted.
- The design skill's ban list rules out the usual trained defaults (Fraunces, Space Grotesk, IBM Plex, Inter as display, and others), and a mono face used only as a "technical" costume.

**Palette**
- Ground `#EEF3E4` with fine 8px and major 40px green rules.
- Ink `#1F2A1D`.
- Blue pencil `#2452B5`, reserved for annotation, focus, and the active state.
- Book cloths: cobalt `#2449A6`, teal `#17695D`, mustard `#F0B429`, oxblood `#7A2338`, orange `#EC7F45`, graphite `#2B3328`.
- Page stock `#F7F6EE`.

Light mode was chosen from the use scene: a grader at a desk in daylight.

**Rejected from the craft floor:** eyebrow or kicker labels above headings. The small uppercase labels in the mockups (for example "MODULE 2 · INSTRUCTION MANUAL") sit *inside* book pages as running heads. If the finish review flags them, convert them to plain metadata lines.

---

## 5. Copy decisions

- **Welcome (254 words).** Structure: who Liam is → what he thought technical communication meant at the start of the semester (accuracy and completeness) → three concrete lessons from Modules 2–4 → what he thinks now (communication works like engineering: define the user, test, revise). It points the reader to the shelf. It is close to the 250-word floor, so do not trim below 250.
- **Module 2 reflection (164 words).** Covers the three rubric prompts: what he did (proposal plus a 38-page FastAPI/Docker/WSL2 manual), the challenge (the audience shift from scikit-learn to PyTorch handled by a memo, and the peer test only covering Ubuntu), and what worked (every phase ends with the same request, and notices sit right before their actions). Every fact comes from the PDFs.
- **Book short titles** (on the spines): Email Conventions · Containerizing a Digit Classifier · Parking Availability Redesign · AI Literacy & Job Materials · CS Writing Style Guide · About Liam.

---

## 6. Process notes for the next agent

- The design skill's decision page could not be shown here: it runs as a local web page and the session ran in a cloud container. The choices were made through structured questions instead. On the desktop with a browser, the decision page should work normally.
- `impeccable login` only saves critiques and audits to an Impeccable account. It does not transfer context; the repo files do.
- Still owed before the task counts as finished: the finish review by a fresh reviewer agent, then a DESIGN.md recorded from the built site, not from these intentions.
