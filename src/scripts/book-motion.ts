// Opening and closing books between the shelf and their spreads.
//
// The flying book is a real 3D object: a front cover (hinged on its spine), a spine face
// perpendicular to it, and two pages drawn from the same pixel art as the destination spread.
// It is built at the open spread's exact size, so it never stretches: it only moves, turns,
// scales uniformly and opens.
//
//   Open (shelf → spread): the book lifts out, turns to face you while it glides to the right
//   half of where the spread will be, and swings its cover open. The open book is then
//   pixel-identical to the spread, so the next page appears in place (no blend).
//
//   Close (spread → shelf): the text fades off the pages, the cover swings shut, the shelf
//   appears behind the closed book, and the book turns spine-out as it slides back into its
//   slot, landing exactly on the real spine.
//
// Every animation is transform/opacity only. Reduced motion and no-JS skip all of it (the
// router crossfades), and a modified click (new tab) is left alone.
import { navigate } from "astro:transitions/client";
import { spreadHalf, bigCover } from "../lib/pixel";

interface Art {
  id: string; cloth: string; band: string; panel: string; iconA: string; iconB: string; icon: string;
  ink: string; code: string; short: string;
  /** Spread height in cells; faceH and spineW are the shelf cover height and spine width in px. */
  h: number; faceH: number; spineW: number;
}

const W = 536;                      // one page of the spread, and the closed book's width
const PERSPECTIVE = 3200;
const EASE_GLIDE = "cubic-bezier(.45, .05, .2, 1)";
const EASE_SWING = "cubic-bezier(.45, 0, .25, 1)";
const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const home = () => new URL(import.meta.env.BASE_URL, location.origin).pathname;

/** Pivot (cover's top-left, on the spine) at (x, y), uniform scale s, turned deg about the spine. */
const pose = (x: number, y: number, s: number, deg: number) =>
  `translate(${x}px, ${y}px) scale(${s}) perspective(${PERSPECTIVE}px) rotateY(${deg}deg)`;

function run(el: Element, frames: Keyframe[], opts: KeyframeAnimationOptions) {
  return el.animate(frames, { fill: "forwards", ...opts }).finished;
}
/** Fade the book in, then drop the animation: an opacity effect left on the book would make
 *  the browser flatten its 3D structure (the spine face would disappear). */
async function fadeIn(el: HTMLElement, duration: number) {
  const a = el.animate([{ opacity: 0 }, { opacity: 1 }], { duration, easing: "ease-out" });
  await a.finished;
  a.cancel();
}
const div = (cls: string, html = "") => Object.assign(document.createElement("div"), { className: cls, innerHTML: html });

interface Fly {
  el: HTMLDivElement; cover: HTMLDivElement; art: Art; H: number; k: number;
  frontDim: HTMLDivElement; backDim: HTMLDivElement; cast: HTMLDivElement; spineDim?: HTMLDivElement;
}

function buildFly(art: Art, coverOpen: boolean): Fly {
  const H = (art.h + 2) * 8;        // board height of the spread
  const k = H / art.faceH;          // open-size px per shelf px
  const el = div("fly") as HTMLDivElement;
  el.setAttribute("aria-hidden", "true");
  el.style.cssText = `width:${W}px;height:${H}px;--cloth:${art.cloth}`;

  const cast = div("fly-dim fly-cast") as HTMLDivElement;
  const page = div("fly-page", spreadHalf(art.cloth, art.h, "right"));
  page.append(cast);

  const front = div("fly-front", bigCover(art, art.h + 2, art.faceH));
  const label = div("fly-label");
  label.style.cssText = `color:${art.ink};--k:${k}`;
  label.innerHTML = `<span class="fly-code"></span><span class="fly-name"></span><span class="fly-by">Liam Reeves</span>`;
  (label.children[0] as HTMLElement).textContent = art.code;
  (label.children[1] as HTMLElement).textContent = art.short;
  const frontDim = div("fly-dim") as HTMLDivElement;
  front.append(label, frontDim);

  const back = div("fly-back", spreadHalf(art.cloth, art.h, "left"));
  const backDim = div("fly-dim") as HTMLDivElement;
  back.append(backDim);

  const cover = div("fly-cover") as HTMLDivElement;
  cover.append(front, back);
  if (coverOpen) cover.style.transform = "rotateY(-180deg)";
  el.append(page, cover);
  document.body.append(el);
  return { el, cover, art, H, k, frontDim, backDim, cast };
}

/** The spine face: the shelf spine itself, scaled to open-book size, standing at the hinge. */
function addSpine(f: Fly, shelfSpine: Element) {
  const T = f.art.spineW * f.k;
  const face = div("fly-spine");
  face.style.cssText = `width:${T}px;left:${-T}px`;
  const art = shelfSpine.cloneNode(true) as HTMLElement;
  art.classList.add("fly-spine-art");
  art.style.cssText = `width:${f.art.spineW}px;height:${f.art.faceH}px;transform:scale(${f.k});color:${f.art.ink}`;
  f.spineDim = div("fly-dim") as HTMLDivElement;
  face.append(art, f.spineDim);
  f.el.prepend(face);
}

/** Shading as the whole book turns: the cover darkens as it turns away, the spine lightens. */
function turnShade(f: Fly, from: number, to: number, opts: KeyframeAnimationOptions) {
  const coverDark = (d: number) => 0.45 * Math.sin((d * Math.PI) / 180);
  const spineDark = (d: number) => 0.45 * Math.cos((d * Math.PI) / 180);
  run(f.frontDim, [{ opacity: coverDark(from) }, { opacity: coverDark(to) }], opts);
  if (f.spineDim) run(f.spineDim, [{ opacity: spineDark(from) }, { opacity: spineDark(to) }], opts);
}

/** Swing the cover open (0 → -180) or shut, with the cover's shadow passing over the page. */
function swing(f: Fly, open: boolean, duration: number) {
  const o = { duration, easing: EASE_SWING };
  const [a, b] = open ? [0, -180] : [-180, 0];
  const frontShade = [{ opacity: 0 }, { opacity: 0.5, offset: 0.5 }, { opacity: 0.5 }];
  const backShade = [{ opacity: 0.5 }, { opacity: 0.5, offset: 0.5 }, { opacity: 0 }];
  run(f.frontDim, open ? frontShade : [...frontShade].reverse(), o);
  run(f.backDim, open ? backShade : [...backShade].reverse(), o);
  run(f.cast, [{ opacity: 0 }, { opacity: 1, offset: 0.4 }, { opacity: 0 }], o);
  return run(f.cover, [{ transform: `rotateY(${a}deg)` }, { transform: `rotateY(${b}deg)` }], o);
}

/** Where the spread sits on a book page: below the header, the crumbs row and padding. */
function spreadSpot(art: Art) {
  const vw = document.documentElement.clientWidth, vh = innerHeight;
  const header = document.querySelector<HTMLElement>(".top")?.offsetHeight ?? 88;
  if (vw >= 1100) return { x: vw / 2, y: header + 94, s: 1, wide: true };
  const H = (art.h + 2) * 8, s = Math.min(1, (vw - 40) / (2 * W));
  return { x: vw / 2, y: Math.max(header + 24, (vh - H * s) / 2), s, wide: false };
}

/** Pose that lays the book over a shelf book: face-out if its cover shows, else spine-out. */
function shelfPose(f: Fly, book: HTMLElement) {
  const s0 = f.art.faceH / f.H;
  const face = book.querySelector<HTMLElement>(".face")!;
  if (getComputedStyle(face).display !== "none") {
    const r = face.getBoundingClientRect();
    const deg = (Math.acos(Math.min(1, r.width / (W * s0))) * 180) / Math.PI;
    return { x: r.left, y: r.top, s: s0, deg };
  }
  const r = book.querySelector(".spine")!.getBoundingClientRect();
  return { x: r.right, y: r.top, s: s0, deg: 90 };
}

// ---------------------------------------------------------------- open (on the shelf)

let pendingOpen: Promise<unknown> | null = null;
let snapNext = false;
let busy = false;

async function openBook(book: HTMLAnchorElement) {
  const art: Art = JSON.parse(book.dataset.art!);
  const f = buildFly(art, false);
  addSpine(f, book.querySelector(".spine")!);
  const p0 = shelfPose(f, book);
  book.style.visibility = "hidden";
  const to = spreadSpot(art);

  // Lift out of the slot, then glide while turning to face the reader; one animation so the
  // two phases join without a pause.
  const glide = { duration: 420, easing: "linear" };
  turnShade(f, p0.deg, 0, { duration: 420, easing: EASE_GLIDE });
  await run(f.el, [
    { transform: pose(p0.x, p0.y, p0.s, p0.deg), easing: "ease-out" },
    { transform: pose(p0.x, p0.y - 18, p0.s, p0.deg), offset: 0.16, easing: EASE_GLIDE },
    { transform: pose(to.x, to.y, to.s, 0) },
  ], glide);
  await swing(f, true, 300);
  if (!to.wide) await run(f.el, [{ opacity: 1 }, { opacity: 0 }], { duration: 120 });
}

function bindShelf() {
  document.querySelectorAll<HTMLAnchorElement>("a.book[data-art]").forEach((book) => {
    book.addEventListener("click", (e) => {
      if (busy || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || reduced()) return;
      e.preventDefault();
      busy = true;
      document.documentElement.dataset.bookMotion = "open";
      pendingOpen = openBook(book).catch(() => {});
      snapNext = true;
      navigate(book.href);               // loads while the book opens; swaps when it is done
    });
  });
}

// ---------------------------------------------------------------- close (on a spread)

let closing: { fly: Fly; from: { x: number; y: number; s: number } } | null = null;

async function closeBook(spread: HTMLElement) {
  const art: Art = JSON.parse(spread.dataset.art!);
  const wide = document.documentElement.clientWidth >= 1100;
  const f = buildFly(art, wide);
  let at: { x: number; y: number; s: number };
  if (wide) {
    // Lay the open book exactly over the spread; fading it in fades the text off the pages.
    const r = spread.querySelector(".spread-art")!.getBoundingClientRect();
    at = { x: r.left + W, y: r.top, s: 1 };
    f.el.style.transform = pose(at.x, at.y, 1, 0);
    await fadeIn(f.el, 120);
    spread.style.visibility = "hidden";   // the book now stands in for it; nothing shows through
    await swing(f, false, 280);
  } else {
    // Stacked pages: a closed book appears over them.
    const to = spreadSpot(art);
    at = { x: to.x - (W * to.s) / 2, y: to.y, s: to.s };
    f.el.style.transform = pose(at.x, at.y, at.s, 0);
    await fadeIn(f.el, 200);
  }
  closing = { fly: f, from: at };
}

/** On the shelf: the closed book turns spine-out and slides into its slot. */
async function shelveBook() {
  if (!closing) return;
  const { fly: f, from } = closing;
  closing = null;
  const book = document.querySelector<HTMLElement>(`a.book[data-art*='"id":"${f.art.id}"']`);
  if (!book) { f.el.remove(); return; }
  addSpine(f, book.querySelector(".spine")!);
  const r = book.querySelector(".spine")!.getBoundingClientRect();
  const s0 = f.art.faceH / f.H;
  const end = { x: r.right, y: r.top, s: s0 };
  turnShade(f, 0, 90, { duration: 400, easing: EASE_GLIDE });
  await run(f.el, [
    { transform: pose(from.x, from.y, from.s, 0), easing: EASE_GLIDE },
    { transform: pose(end.x, end.y - 18, end.s, 90), offset: 0.82, easing: "ease-in" },
    { transform: pose(end.x, end.y, end.s, 90) },
  ], { duration: 400, easing: "linear" });
  book.style.visibility = "";
  f.el.remove();
}

// ---------------------------------------------------------------- router hooks

document.addEventListener("astro:before-preparation", (e) => {
  const ev = e as Event & { to: URL; loader: () => Promise<void> };
  let wait: Promise<unknown> | null = null;
  if (pendingOpen) {
    wait = pendingOpen;
    pendingOpen = null;
  } else {
    const spread = document.querySelector<HTMLElement>(".spread[data-art]");
    if (spread && !busy && !reduced() && ev.to.pathname === home()) {
      busy = true;
      snapNext = true;
      document.documentElement.dataset.bookMotion = "close";
      wait = closeBook(spread).catch(() => {});
    }
  }
  if (!wait) return;
  const load = ev.loader;
  ev.loader = async () => { await Promise.all([load(), wait]); };
});

// The book already sits where the next page needs it, so skip the router's blend once.
document.addEventListener("astro:before-swap", (e) => {
  if (!snapNext) return;
  snapNext = false;
  const vt = (e as Event & { viewTransition?: ViewTransition }).viewTransition;
  vt?.ready.catch(() => {});
  vt?.skipTransition();
});

// The swap replaces <body>; carry a closing book across and hide its empty slot meanwhile.
document.addEventListener("astro:after-swap", () => {
  if (!closing) return;
  document.body.append(closing.fly.el);
  const id = closing.fly.art.id;
  const book = document.querySelector<HTMLElement>(`a.book[data-art*='"id":"${id}"']`);
  if (book) book.style.visibility = "hidden";
});

document.addEventListener("astro:page-load", () => {
  busy = false;
  bindShelf();
  // Measure the slot one frame later, once the swapped-in page has settled its layout.
  if (closing) requestAnimationFrame(() => shelveBook().finally(() => delete document.documentElement.dataset.bookMotion));
  else delete document.documentElement.dataset.bookMotion;
});
