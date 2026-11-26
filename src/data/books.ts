// Every book on the shelf and everything inside it. Copy that Liam revises lives in
// content/drafts/*.txt and is imported here, so editing a draft updates the site.
import welcome from "../../content/drafts/home-welcome.txt?raw";
import m1r from "../../content/drafts/module-1-reflection.txt?raw";
import m2r from "../../content/drafts/module-2-reflection.txt?raw";
import m3r from "../../content/drafts/module-3-reflection.txt?raw";
import m4r from "../../content/drafts/module-4-reflection.txt?raw";
import guideTxt from "../../content/drafts/style-guide.txt?raw";
import bioTxt from "../../content/drafts/bio.txt?raw";
import type { Cloth } from "../lib/pixel";

/** Split a draft into paragraphs (one per non-empty line). */
export const paras = (t: string) => t.split("\n").map((l) => l.trim()).filter(Boolean);

/** A draft read as blocks, so the layout follows how Liam writes it: a short line with no final
 *  period is a heading, "Email:" / "GitHub:" lines become contact links (a "Contact" heading just
 *  before them heads that list), and everything else is a paragraph. */
export type Block =
  | { kind: "p" | "h"; text: string }
  | { kind: "contact"; heading?: string; items: { label: string; text: string; href: string }[] };
const contactLine = /^(email|github)\s*:\s*(.+)$/i;
export function blocks(t: string): Block[] {
  const out: Block[] = [];
  for (const line of paras(t)) {
    const c = line.match(contactLine);
    if (c) {
      const label = c[1][0].toUpperCase() + c[1].slice(1).toLowerCase();
      const text = c[2].trim();
      const href = /^email$/i.test(c[1]) ? `mailto:${text}` : `https://${text.replace(/^https?:\/\//, "")}`;
      const last = out[out.length - 1];
      if (last?.kind === "contact") last.items.push({ label: label === "Github" ? "GitHub" : label, text, href });
      else {
        const heading = last?.kind === "h" && /^contact$/i.test(last.text) ? (out.pop() as { text: string }).text : undefined;
        out.push({ kind: "contact", heading, items: [{ label: label === "Github" ? "GitHub" : label, text, href }] });
      }
    } else if (line.split(/\s+/).length <= 8 && !/[.,;:]$/.test(line)) out.push({ kind: "h", text: line });
    else out.push({ kind: "p", text: line });
  }
  return out;
}

export const welcomeBlocks = blocks(welcome);

export interface Doc {
  slug: string;
  title: string;
  /** Second line in the contents table. */
  sub: string;
  pages: number;
  pdf: string;
  preview: string;
  /** Right-page and reading-view description. */
  summary: string[];
  facts: [string, string][];
}

export interface ModuleBook extends Cloth {
  kind: "module";
  id: string;
  n: number;
  code: string;
  /** Spine and cover title. */
  short: string;
  title: string;
  /** Running head on the contents page. */
  runningHead: string;
  /** Meta line beside "Back to shelf". */
  where: string;
  /** Running-head colour on page stock (all clear 4.5:1). */
  kick: string;
  text: string;
  foot: [string, string];
  reflection: string[];
  docs: Doc[];
  /** Open-spread height in cells; the module default is 78. */
  spreadH?: number;
}

const doc = (slug: string, d: Omit<Doc, "slug" | "pdf" | "preview">, file: string): Doc => ({
  slug, ...d, pdf: `docs/${file}.pdf`, preview: `previews/${file}.png`,
});

export const modules: ModuleBook[] = [
  {
    kind: "module", id: "m1", n: 1, code: "Module 1", short: "Email Conventions",
    title: "Email Conventions in Computer Science",
    runningHead: "Module 1 · Email conventions", where: "2 entries · Sept 2026",
    cloth: "#2449A6", band: "#F2C14E", panel: "#DDE5F6", iconA: "#F2C14E", iconB: "#2449A6", text: "#FFFFFF", icon: "mail", kick: "#2449A6",
    foot: ["Audience", "Dr. Paudel, and the CS students and faculty who read department email."],
    reflection: paras(m1r),
    spreadH: 84,
    docs: [
      doc("email-conventions", {
        title: "Email Conventions in Computer Science", sub: "Rhetorical analysis, professional email, redacted sample", pages: 7,
        summary: [
          "A rhetorical and design analysis of a mass registration email from the computer science department chair: its rhetorical situation, its list-like paragraphs, and its informal tone.",
          "Followed by my own professional email to Dr. Paudel and, in an appendix, the sample email with every personal name redacted.",
        ],
        facts: [["Pages", "7"], ["Written", "Sept 9, 2026"], ["Includes", "Redacted sample email"]],
      }, "m1-email-conventions"),
    ],
  },
  {
    kind: "module", id: "m2", n: 2, code: "Module 2", short: "Containerizing a Digit Classifier",
    title: "Containerizing a PyTorch Digit Classifier in Docker",
    runningHead: "Module 2 · Instruction manual", where: "3 entries · Sept–Oct 2026",
    cloth: "#17695D", band: "#F28C38", panel: "#D9EFE9", iconA: "#F28C38", iconB: "#17695D", text: "#FFFFFF", icon: "box", kick: "#17695D",
    foot: ["Audience", "Python programmers who have trained a PyTorch model but never deployed one."],
    reflection: paras(m2r),
    docs: [
      doc("proposal", {
        title: "Project Proposal", sub: "Scope, audience, and plan, approved Sept 20", pages: 3,
        summary: [
          "Proposes a 14-step procedure for packaging a trained model as a Docker service on Windows 11 with WSL2.",
          "It names the real risk up front: silent failures, such as a model saved under one library version that will not load under another.",
        ],
        facts: [["Pages", "3"], ["Written", "Sept 20, 2026"], ["Platform", "Windows 11 + WSL2"]],
      }, "m2-proposal"),
      doc("manual", {
        title: "Docker Instruction Manual", sub: "FastAPI + Docker on Windows 11 with WSL2", pages: 38,
        summary: [
          "Three phases take a trained PyTorch model to a prediction served from a Docker container: run the predictor, wrap it in a FastAPI web API, then containerize it.",
          "Opens with a memo explaining the switch from scikit-learn to PyTorch and the new reader prerequisites.",
        ],
        facts: [["Pages", "38"], ["Written", "Oct 6, 2026"], ["Platform", "Windows 11 + WSL2"], ["Time to complete", "45–60 min"]],
      }, "m2-manual"),
    ],
  },
  {
    kind: "module", id: "m3", n: 3, code: "Module 3", short: "Parking Availability Redesign",
    title: "Redesigning UTRGV Parking Availability",
    runningHead: "Module 3 · Recommendation report", where: "5 entries · Oct–Nov 2026 · with Gaby Saboia",
    cloth: "#F0B429", band: "#1F2A44", panel: "#FFF4D6", iconA: "#1F2A44", iconB: "#2449A6", text: "#1F2A1D", icon: "park", kick: "#7A5300",
    foot: ["Credits", "Co-written with Gaby Saboia. Peer review by Joanna Gutierrez."],
    reflection: paras(m3r),
    spreadH: 84,
    docs: [
      doc("problem-proposal", {
        title: "Problem Proposal", sub: "The flaw, the users it affects, our research plan", pages: 4,
        summary: [
          "Defines the problem with the “Parking Spaces” section: an occupancy bar that is green at 1% and at 100%, no map links or directions, and only seven lots listed.",
          "Introduces the users it affects, including our persona Sam, and the research we planned.",
        ],
        facts: [["Pages", "4"], ["Written", "Oct 18, 2026"], ["Authors", "Gaby Saboia, Liam Reeves"]],
      }, "m3-problem-proposal"),
      doc("report-draft", {
        title: "Report Draft", sub: "The draft we sent for peer review", pages: 6,
        summary: [
          "The design-challenge draft we submitted for peer review: the proposal, our survey method, and the first findings from 11 responses.",
        ],
        facts: [["Pages", "6"], ["Written", "Oct 27, 2026"], ["Authors", "Liam Reeves, Gaby Saboia"]],
      }, "m3-report-draft"),
      doc("peer-review", {
        title: "Peer Review", sub: "By Joanna Gutierrez", pages: 4,
        summary: [
          "Joanna Gutierrez’s section-by-section review of our draft, scored on a five-point scale with strengths and areas for improvement.",
        ],
        facts: [["Pages", "4"], ["Reviewed", "Oct 27, 2026"], ["Reviewer", "Joanna Gutierrez"]],
      }, "m3-peer-review"),
      doc("final-report", {
        title: "Final Recommendation Report", sub: "Survey of 11, two prototypes, one recommendation", pages: 27,
        summary: [
          "Recommends replacing the seven sidebar lot cards with a compact lot panel and verifying that the sensor counts match actual lot conditions.",
          "Built on a survey of 11 students and faculty, it scores the current page and two prototypes; the compact panel scored 7.90 out of 10.",
        ],
        facts: [["Pages", "27"], ["Submitted", "Nov 2, 2026"], ["Authors", "Liam Reeves, Gaby Saboia"]],
      }, "m3-final-report"),
    ],
  },
  {
    kind: "module", id: "m4", n: 4, code: "Module 4", short: "AI Literacy & Job Materials",
    title: "AI Literacy, Job Materials & Plain-Language Writing",
    runningHead: "Module 4 · AI literacy, jobs, plain language", where: "5 entries · Fall 2026",
    cloth: "#7A2338", band: "#F2C14E", panel: "#F6E1E5", iconA: "#F2C14E", iconB: "#7A2338", text: "#FFFFFF", icon: "bulb", kick: "#7A2338",
    foot: ["Credits", "Workshop and flyer made with Tim Trasmonte."],
    reflection: paras(m4r),
    spreadH: 84,
    docs: [
      doc("ai-flyer", {
        title: "AI Flyer: Think Before You Prompt", sub: "One page for classmates, with Tim Trasmonte", pages: 1,
        summary: [
          "Four messages for students using AI: specify your prompts, responses are your responsibility, AI is biased, and AI can hallucinate.",
          "It ends with four questions to ask before submitting AI-generated work.",
        ],
        facts: [["Pages", "1"], ["Made with", "Tim Trasmonte"], ["Audience", "Classmates"]],
      }, "m4-ai-flyer"),
      doc("ai-workshop", {
        title: "Critical AI Literacy Workshop", sub: "Comparing two prompts, with Tim Trasmonte", pages: 5,
        summary: [
          "Our workshop worksheet: what we noticed comparing Copilot’s responses to a general prompt and a CLEAR-engineered prompt, the flyer’s key messages, and my exit ticket.",
        ],
        facts: [["Pages", "5"], ["Made with", "Tim Trasmonte"]],
      }, "m4-ai-workshop"),
      doc("resume-cover-letter", {
        title: "Resume & Cover Letter", sub: "Phone number removed for the web", pages: 2,
        summary: [
          "A cover letter and one-page resume for a Business Intelligence Analyst I position at Lone Star National Bank.",
          "The phone number has been removed from this web copy.",
        ],
        facts: [["Pages", "2"], ["Written", "Nov 14, 2026"]],
      }, "m4-resume-cover-letter"),
      doc("plain-language-summary", {
        title: "Plain-Language Summary", sub: "What heat really costs America’s freight trains", pages: 3,
        summary: [
          "My rail-heat research rewritten for readers outside the field. Heat-caused accidents are too rare to price, so the study prices the “slow orders” that prevent them: rules that slow trains in hot weather.",
          "On each railroad’s own track, slow orders cost $65 to $244 million a year.",
        ],
        facts: [["Pages", "3"], ["Written", "Nov 22, 2026"], ["Summarizes", "Reeves et al., manuscript in preparation"]],
      }, "m4-plain-language-summary"),
    ],
  },
];

export interface RefBook extends Cloth {
  kind: "guide" | "bio";
  id: string;
  code: string;
  short: string;
  title: string;
  href: string;
  text: string;
  kick: string;
  /** Open-spread height in cells. */
  spreadH: number;
}

export const guide: RefBook = {
  kind: "guide", id: "sg", code: "Guide", short: "CS Writing Style Guide", title: "Communication Style & Strategy Guide", href: "style-guide",
  cloth: "#EC7F45", band: "#1F2A1D", panel: "#FBE3D7", iconA: "#F2C14E", iconB: "#DD5A26", text: "#1F2A1D", icon: "pencil", W: 9, H: 38, kick: "#9C4718", spreadH: 70,
};
export const bio: RefBook = {
  kind: "bio", id: "bio", code: "Bio", short: "About Me", title: "Professional Bio & Future Plans", href: "bio",
  cloth: "#2B3328", band: "#B9CC9E", panel: "#E3EBD5", iconA: "#B9CC9E", iconB: "#2B3328", text: "#EEF3E4", icon: "person", W: 10, H: 41, kick: "#2B3328", spreadH: 72,
};

/** Style guide draft: line 1 intro, then heading/body pairs ("1. Heading"). */
export const guideContent = (() => {
  const [intro, ...rest] = paras(guideTxt);
  const principles = [];
  for (let i = 0; i < rest.length; i += 2) {
    const [n, title] = rest[i].split(/\.\s+/, 2);
    principles.push({ n, title, body: rest[i + 1] });
  }
  return { intro, principles };
})();

/** Bio draft: bio paragraph, "next" heading, "next" paragraph, then a Contact block. */
/** Bio draft: the first paragraph is the bio (left page); the paragraphs after it are the future
 *  plans (right page), under a heading if the draft has one; the contact list comes from the
 *  draft's Email/GitHub lines. */
export const bioContent = (() => {
  const b = blocks(bioTxt);
  const firstP = b.findIndex((x) => x.kind === "p");
  const rest = b.slice(firstP + 1);
  const head = rest.find((x, i) => x.kind === "h" && rest.slice(0, i).every((y) => y.kind === "h"));
  return {
    bio: (b[firstP] as { text: string }).text,
    nextHead: head ? (head as { text: string }).text : undefined,
    next: rest.filter((x) => x.kind === "p").map((x) => (x as { text: string }).text),
    contact: b.find((x) => x.kind === "contact") as Extract<Block, { kind: "contact" }> | undefined,
  };
})();

export const shelf = [...modules, guide, bio];

export const moduleHref = (m: ModuleBook) => `modules/${m.n}`;

/** What the book-opening animation needs to draw a book (see src/scripts/book-motion.ts). */
export const artOf = (b: ModuleBook | RefBook) => JSON.stringify({
  id: b.id, cloth: b.cloth, band: b.band, panel: b.panel, iconA: b.iconA, iconB: b.iconB, icon: b.icon,
  ink: b.text, code: b.code, short: b.short,
  h: b.kind === "module" ? (b.spreadH ?? 78) : b.spreadH,
  faceH: (b.H ?? 44) * 8, spineW: (b.W ?? 11) * 8,
});
