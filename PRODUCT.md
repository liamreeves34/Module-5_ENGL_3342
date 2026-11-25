# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro 7 + TypeScript (strict) + Tailwind CSS 4 (via `@tailwindcss/vite`), scaffolded from the Astro minimal starter at the repo root. Static output; no data handling. Page logic and animations are in scope.

Deploy: Vercel, served from the site root (no `site` or `base` in `astro.config.mjs`; no GitHub Actions workflow). Internal links and asset paths must not carry a `/Module-5_ENGL_3342` prefix. Where code builds internal paths, use `import.meta.env.BASE_URL`, which resolves to `/`. The production URL has not been recorded yet.

## Users

- **Primary: Dr. Shankar Paudel**, instructor of ENGL 3342 Technical Communication at UTRGV, grading the Module 5 Digital Portfolio against the assignment guidelines (`instructions/Module 5_Assignment Guidelines.pdf`). He checks required sections, word counts, reflection quality, working embeds/links, and usability on desktop, tablet, and mobile, and he tests in a private/incognito window.
- **No other audience.** The site only has to satisfy the assignment (confirmed by Liam); it is not being built as an internship or graduate-application writing sample.

## Product Purpose

A multi-page digital portfolio for Liam Reeves, a UTRGV Computer Science undergraduate. It showcases his best work from Modules 1–4 and explains how he developed as a technical communicator over the semester. Success: it fully meets the assignment, it is published at a public URL that loads cleanly signed out, and it is submitted by **December 10, 2026 (no extensions)**.

## Positioning

Most classmates will use Google Sites, Wix, or Canva templates. Liam's portfolio is hand-built in code by a CS student, so the site itself shows the skills it describes: clear structure, accessible navigation, and deliberate design choices. The content is specific to communication in computer science (email conventions, an instruction manual for containerizing a PyTorch model, a usability report, an AI-literacy flyer, a resume and cover letter), not generic reflection.

## Operating Context

- The grader reads the portfolio alongside the assignment rubric and opens the embedded or linked PDFs to review the actual submissions.
- Visitors may be on desktop, tablet, or phone; all four sections must work on each.
- The pre-submission checklist requires public file access, an incognito-window test, readable fonts, consistent spacing, strong contrast, clear navigation labels, and no placeholder text.
- Submission is the published URL with the line "Here is my published website."

## Capabilities and Constraints

Required architecture, with clear navigation across all four sections:

- **A. Home / Welcome** (approx. 250–300 words): introduce Liam, his major, and his career interests; a photo, avatar, or representative image; a synthesis of what effective technical communication in CS means now compared with the start of the semester.
- **B. The Four Modules** (separate pages or clearly divided sub-tabs, 150+ words each): showcase the work (embedded submissions, flyers, or screenshots), plus a reflection on what he did, what challenged him, and which rhetorical and design choices worked.
- **C. Disciplinary Communication Style & Strategy Guide** (approx. 150–200 words): a practical, visitor-friendly resource for CS covering 3–4 essential principles, conventions, or audience strategies for writing for clients, users, or the public.
- **D. Professional Bio & Future Application** (approx. 150–200 words): a forward-looking profile written in **third person**, plus a contact/connect section, explaining how he will use these skills in internships, graduate study, or his career.

Constraints:
- Links must be accessible; embedded PDFs must load for a signed-out visitor (they are served from this repo, not Google Drive).
- Word-count ranges are part of the grade, so layouts must hold the full required text.
- **Copy:** Claude drafts all page text from Liam's actual module work; Liam revises it into his own voice before submission. Drafts are not final until he signs off.
- **Open, undecided:** which image represents him on Home.

### Assignment compliance (the bookshelf direction must satisfy all of these)

Checked against `instructions/Module 5_Assignment Guidelines.pdf` on Nov 25. Every design, build, and copy pass is checked against this list before it counts as done.

- **Real pages, not overlays.** Home, Modules 1–4, Style Guide, and Bio each have their own URL that renders the full content as static HTML. Book-opening, page-flip, and expand animations are a layer on top of real navigation (for example Astro view transitions). With JavaScript off, or opened from a direct link, every page still shows its full content, the back button works, and nothing graded is reachable only by clicking a book.
- **Home carries its own graded content.** The 250–300 word welcome (who Liam is, his CS major, career interests, and how his view of effective technical communication in CS changed over the semester) and his image are on the shelf page itself, visible without opening a book. The shelf must not push them out of reach or crowd them.
- **Navigation names every section.** The always-visible text nav reaches Home, each of Modules 1–4, Style Guide, and Bio directly (the "Modules" entry opens a menu listing Modules 1–4 by number and title). Labels are plain words.
- **Each reflection is findable and complete.** Each module has a 150+ word reflection covering what he did, what challenged him, and which rhetorical or design choices worked. It is the first thing a module shows (the first TOC entry, or on the TOC page itself), never buried last.
- **Style Guide reads as one page.** 150–200 words with 3–4 principles for CS communication, readable in one view, not split across TOC lines.
- **Bio follows the format.** 150–200 words, strictly third person, forward-looking (how he'll use these skills in internships, grad study, or his career), with a contact section: email `liam.reeves01@utrgv.edu` and GitHub.
- **Documents load everywhere.** Each PDF has a cover or page-image preview, an inline viewer where the browser supports it, and an always-visible "Open PDF" link with descriptive text, because mobile browsers (Android Chrome especially) do not render embedded PDFs inline. All PDFs are served from the site, so signed-out and incognito visitors can open them.
- **Readable on desktop, tablet, and mobile.** The shelf, open book, and reading view each work at phone, tablet, and desktop widths, by touch and by keyboard. Verified widths: 390, 820, 1024, and 1440px. The two-page spread appears only at 1100px and wider; below that the pages stack full-width (max 720px). At no width does any page clip sideways.
- **Home reads as Home.** On load no book is pulled out, and the page's h1 is a Home-level heading ("Six books from one semester of technical writing"). Hovering or focusing a book swaps that line to the book's title, announced politely, and swaps it back on leave.
- **Style Guide and Bio books have no table of contents.** Their spreads hold the whole text (guide: 3–4 principles across both pages; bio: third-person bio on the left, future plans and contact on the right) and stack on smaller screens.
- **Collaborators are credited on their pages.** Gaby Saboia on Module 3 (Joanna Gutierrez on the peer review), Tim Trasmonte on the Module 4 workshop.
- **Accessible links and objects.** Books are real links or buttons with accessible names, visible focus states, and hover cues mirrored on focus. Spine and cover titles are real text, not pixelated images of text. Link text is descriptive.
- **Visual polish checklist.** Readable fonts, consistent spacing, strong contrast (WCAG AA), clear nav labels, and no placeholder text in the published site (unfilled slots block publishing).
- **Word counts are verified,** not estimated, for every section before submission.

## Brand Commitments

- Name: Liam Reeves. Department of Computer Science, University of Texas Rio Grande Valley.
- Every submission carries an AI disclosure statement; the portfolio should be equally honest about AI use.
- **Binding direction from Liam** (source: `example/sites.txt`, screenshots in `example/images/`): modeled on https://stripe.press/'s bookshelf interaction, with a changed design philosophy. Each module is a book on a shelf, with a hover cue showing which book a click would select. Selecting a book opens it to a table-of-contents page. Selecting a TOC line expands the book to full screen and transitions to that content. Exiting content flips the pages back to the TOC, and exiting the book returns it to the shelf beside the other modules. Books are pixel-art constructions, not photorealistic. This takes Stripe Press's interaction model only, not its branding, typefaces, or cover art.
  - Confirmed structure (Nov 25): the shelf page *is* Home. The welcome text and Liam's image sit with the shelf, which holds six books: Modules 1–4, plus a visually distinct Style Guide book and Bio book.
  - Pixel art covers objects only (books, shelf, cursor/hover cues, small UI accents). The page background and all text stay crisp and readable; no pixel font for body text.
  - Open book (Nov 25): a two-page spread. The left page is the table of contents. The right page previews the selected entry: the reflection by default, or a document's first-page image plus a summary. Choosing another contents line turns the page, with a short frame-stepped pixel flip (smooth 3D turn available as an alternative). Rapid clicks finish the current turn before starting the next; reduced motion uses a crossfade. On phones the pages stack, contents first, and the preview turns in place.
  - Reading view: "Read full screen" expands the book into a clean full-width reading page with a book-edge frame and a large PDF viewer. Live PDF viewers load only here, never inside a turning page.
  - A plain text navigation bar (Home · Modules · Style Guide · Bio) is always visible alongside the shelf and is the keyboard and screen-reader path.

## Evidence on Hand

Real submissions in `Tech-com-site/`:

- **Module 1:** `Module1/Email Conventions in Computer Science.pdf` (7 pp., Sept 9, 2026), including a redacted sample email.
- **Module 2:** `Module2/Module-2_Project_Proposal.pdf` (3 pp.) and `Module2/Module-2_Containerizing_a_PyTorch_Digit_Classifier_in_Docker.pdf` (38 pp. instruction manual with a scope-change memo, Oct 6, 2026).
- **Module 3** (co-authored with Gaby Saboia): `Module3/Module-3_Problem_Proposal.pdf`, `Module3/Module-3_research_Liam_and_Gaby_ENGL_3342.pdf`, `Module3/Module-3_Final_Report_Reeves_Saboia.pdf` (27 pp., recommending a redesign of the UTRGV Parking Services "Parking Spaces" section based on a survey of 11 students and faculty), and `Module3/Peer_Review_Feedback_Protocol_-_UTRGV_Parking.pdf` (peer review by Joanna Gutierrez; she gave Liam permission to publish it on the site, so it appears unredacted and credited to her).
- **Module 4:** `Module4/AI_Workshop/Module-4_AI-Flyer.pdf` ("Think Before You Prompt", one page), `Module4/AI_Workshop/Module-4_Critical-AI-Literacy_Workshop.pdf` (group work with Tim Trasmonte), and `Module4/Resume_and_Cover_Letter/Module-4_Resume_and_Cover_Letter_Liam_Reeves.pdf`.

Collaborators must be credited where their work appears. The resume PDF includes a personal phone number, which must **not** appear anywhere on the site (confirmed by Liam), so publish a redacted copy of the resume. Contact section: email link to `liam.reeves01@utrgv.edu` and GitHub (`github.com/liamreeves34`), both confirmed. LinkedIn was not included.

Absent, and must not be invented: a photo/avatar, testimonials, grades or instructor feedback, and final reflection text.

## Product Principles

1. **The rubric is the skeleton.** Every required section, word range, and element is present, findable from the navigation, and impossible to miss.
2. **The work is the evidence.** The real documents lead; reflections explain them and do not replace them.
3. **Practice what it preaches.** As a technical-communication portfolio, its own usability, clarity, and accessibility are graded content.
4. **Works signed-out, on any screen.** Nothing depends on a login, a Drive permission, or a desktop viewport.
5. **Honest and specific.** Real names, real projects, credited collaborators, disclosed AI use; no filler or placeholder text.

## Accessibility & Inclusion

Required by the assignment: readable on desktop, tablet, and mobile; accessible links; readable fonts, consistent spacing, strong color contrast, and clear navigation labels. Target WCAG 2.1 AA, including keyboard-navigable menus, descriptive link text for PDFs, a text alternative for every image and embed, and `prefers-reduced-motion` respected for all animations.
