// Site QA: for each page at 390/820/1024/1440 reports horizontal scroll, content that overflows
// its page box, text contrast failures (WCAG AA), images without alt, and broken internal links.
// Usage: node scripts/check-site.cjs http://localhost:4321 [outDir for screenshots]
const { chromium } = require("playwright");
const BASE = process.argv[2] || "http://localhost:4321";
const OUT = process.argv[3];
const PAGES = ["/", "/modules/1", "/modules/1/email-conventions", "/modules/2", "/modules/2/manual", "/modules/3", "/modules/3/final-report",
  "/modules/3/peer-review", "/modules/4", "/modules/4/resume-cover-letter", "/modules/2/manual/read", "/style-guide", "/bio"];
(async () => {
  const b = await chromium.launch();
  const links = new Set();
  let problems = 0;
  for (const p of PAGES) for (const w of [1440, 1024, 820, 390]) {
    const pg = await b.newPage({ viewport: { width: w, height: 900 } });
    await pg.goto(BASE + p, { waitUntil: "networkidle" });
    const r = await pg.evaluate(() => {
      const rgb = (s) => s.match(/[\d.]+/g).map(Number);
      const L = (c) => { c = c.slice(0, 3).map((v) => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }); return .2126 * c[0] + .7152 * c[1] + .0722 * c[2]; };
      const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
      const bg = (el) => { const cl = el.closest('[data-bg]'); if (cl) return hex(cl.dataset.bg); while (el) { const c = rgb(getComputedStyle(el).backgroundColor); if (c.length < 4 || c[3] > .9) return c; el = el.parentElement; } return [238, 243, 228]; };
      const fails = []; let minCr = 99;
      const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      while (tw.nextNode()) {
        const t = tw.currentNode; if (!t.textContent.trim()) continue;
        const el = t.parentElement; const cs = getComputedStyle(el);
        if (!el.getClientRects().length || el.closest(".sr-only,.skip")) continue;
        const a = L(rgb(cs.color)), c = L(bg(el)); const cr = (Math.max(a, c) + .05) / (Math.min(a, c) + .05);
        const fs = parseFloat(cs.fontSize), large = fs >= 24 || (+cs.fontWeight >= 700 && fs >= 18.66);
        minCr = Math.min(minCr, cr);
        if (cr < (large ? 3 : 4.5)) fails.push(`${t.textContent.trim().slice(0, 30)} ${cr.toFixed(2)}`);
      }
      const overflow = [...document.querySelectorAll(".pg")].map((s) => {
        const box = s.getBoundingClientRect(); let worst = 0;
        s.querySelectorAll("*").forEach((k) => { const r = k.getBoundingClientRect(); if (r.height) worst = Math.max(worst, r.bottom - box.bottom, r.right - box.right); });
        return Math.round(worst);
      }).filter((v) => v > 0);
      return {
        hscroll: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        overflow, fails, minCr: +minCr.toFixed(2),
        noAlt: [...document.images].filter((i) => !i.hasAttribute("alt")).length,
        h1: document.querySelectorAll("h1").length,
        links: [...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href")).filter((h) => h.startsWith("/")),
      };
    });
    r.links.forEach((l) => links.add(l));
    const bad = r.hscroll || r.overflow.length || r.fails.length || r.noAlt || r.h1 !== 1;
    if (bad) problems++;
    console.log(`${bad ? "FAIL" : "ok  "} ${p} @${w}  minContrast ${r.minCr}${r.hscroll ? " HSCROLL" : ""}${r.overflow.length ? " overflow " + r.overflow : ""}${r.fails.length ? " contrast " + r.fails.join("; ") : ""}${r.noAlt ? " noAlt " + r.noAlt : ""}${r.h1 !== 1 ? " h1=" + r.h1 : ""}`);
    if (OUT) await pg.screenshot({ path: `${OUT}/${(p.replace(/\//g, "_") || "_home").replace(/^_$/, "_home")}-${w}.png`, fullPage: true });
    await pg.close();
  }
  for (const l of links) {
    const res = await fetch(BASE + l);
    if (res.status !== 200) { problems++; console.log("BROKEN LINK", l, res.status); }
  }
  console.log(`${links.size} internal links checked; ${problems} problem(s)`);
  await b.close();
})();
