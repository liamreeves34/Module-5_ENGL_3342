# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro 7 + TypeScript (strict) + Tailwind CSS 4 (via `@tailwindcss/vite`), scaffolded from the Astro minimal starter at the repo root. Static output; no data handling. Page logic and animations are in scope.

Deploy: GitHub Pages via GitHub Actions at `https://liamreeves34.github.io/Module-5_ENGL_3342`. `base` is `/Module-5_ENGL_3342`, so every internal link and asset path must go through `import.meta.env.BASE_URL` (the starter's `/favicon.svg` href does not yet). No Actions workflow exists in the repo yet.

## Users

- **Primary: Dr. Shankar Paudel**, instructor of ENGL 3342 Technical Communication at UTRGV, grading the Module 5 Digital Portfolio against the assignment guidelines (`instructions/Module 5_Assignment Guidelines.pdf`). He checks required sections, word counts, reflection quality, working embeds/links, and usability on desktop, tablet, and mobile, and he tests in a private/incognito window.
- **Secondary (assumed, unconfirmed):** internship and graduate-program reviewers (national labs such as INL, industry) who may get the link later as a writing sample. Liam did not answer this question; treat it as a working assumption to confirm, not a commitment.

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
- **Open, undecided:** who writes the page copy (Liam did not answer; do not ship drafted reflections as his final words without his sign-off); which image represents him on Home.

## Brand Commitments

- Name: Liam Reeves. Department of Computer Science, University of Texas Rio Grande Valley.
- Every submission carries an AI disclosure statement; the portfolio should be equally honest about AI use.

## Evidence on Hand

Real submissions in `Tech-com-site/`:

- **Module 1:** `Module1/Email Conventions in Computer Science.pdf` (7 pp., Sept 9, 2026), including a redacted sample email.
- **Module 2:** `Module2/Module-2_Project_Proposal.pdf` (3 pp.) and `Module2/Module-2_Containerizing_a_PyTorch_Digit_Classifier_in_Docker.pdf` (38 pp. instruction manual with a scope-change memo, Oct 6, 2026).
- **Module 3** (co-authored with Gaby Saboia): `Module3/Module-3_Problem_Proposal.pdf`, `Module3/Module-3_research_Liam_and_Gaby_ENGL_3342.pdf`, `Module3/Module-3_Final_Report_Reeves_Saboia.pdf` (27 pp., recommending a redesign of the UTRGV Parking Services "Parking Spaces" section based on a survey of 11 students and faculty), and `Module3/Peer_Review_Feedback_Protocol_-_UTRGV_Parking.pdf` (peer review by Joanna Gutierrez).
- **Module 4:** `Module4/AI_Workshop/Module-4_AI-Flyer.pdf` ("Think Before You Prompt", one page), `Module4/AI_Workshop/Module-4_Critical-AI-Literacy_Workshop.pdf` (group work with Tim Trasmonte), and `Module4/Resume_and_Cover_Letter/Module-4_Resume_and_Cover_Letter_Liam_Reeves.pdf`.

Collaborators must be credited where their work appears. The resume PDF includes a personal phone number; whether to publish it on a public site is Liam's call. Contact options already in the documents: UTRGV email, LinkedIn, GitHub (`github.com/liamreeves34`).

Absent, and must not be invented: a photo/avatar, testimonials, grades or instructor feedback, and final reflection text.

## Product Principles

1. **The rubric is the skeleton.** Every required section, word range, and element is present, findable from the navigation, and impossible to miss.
2. **The work is the evidence.** The real documents lead; reflections explain them and do not replace them.
3. **Practice what it preaches.** As a technical-communication portfolio, its own usability, clarity, and accessibility are graded content.
4. **Works signed-out, on any screen.** Nothing depends on a login, a Drive permission, or a desktop viewport.
5. **Honest and specific.** Real names, real projects, credited collaborators, disclosed AI use; no filler or placeholder text.

## Accessibility & Inclusion

Required by the assignment: readable on desktop, tablet, and mobile; accessible links; readable fonts, consistent spacing, strong color contrast, and clear navigation labels. Target WCAG 2.1 AA, including keyboard-navigable menus, descriptive link text for PDFs, a text alternative for every image and embed, and `prefers-reduced-motion` respected for all animations.
