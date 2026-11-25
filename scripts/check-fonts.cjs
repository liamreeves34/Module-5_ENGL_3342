// Reports which font files actually render the text on each page (via Chrome DevTools), so
// any fallback to a system font shows up. Usage: node scripts/check-fonts.cjs http://localhost:4321
const { chromium } = require("playwright");
const BASE = process.argv[2] || "http://localhost:4321";
const PAGES = ["/", "/modules/1", "/modules/2/manual", "/modules/3", "/modules/4/resume-cover-letter/read", "/style-guide", "/bio"];
(async () => {
  const b = await chromium.launch();
  const all = {};
  for (const w of [1440, 390]) for (const path of PAGES) {
    const p = await b.newPage({ viewport: { width: w, height: 900 } });
    await p.goto(BASE + path, { waitUntil: "networkidle" });
    await p.evaluate(() => document.fonts.ready);
    if (w === 390) { await p.click(".menu-btn").catch(() => {}); await p.click("details.mods summary").catch(() => {}); }
    else { await p.click("details.mods summary").catch(() => {}); }
    const cdp = await p.context().newCDPSession(p);
    await cdp.send("DOM.enable"); await cdp.send("CSS.enable");
    const { root } = await cdp.send("DOM.getDocument", { depth: -1 });
    const used = {};
    const walk = async (n) => {
      if (n.nodeType === 1 && n.nodeName !== "SCRIPT" && n.nodeName !== "STYLE" && n.nodeName !== "svg") {
        const hasText = (n.children || []).some((c) => c.nodeType === 3 && c.nodeValue.trim());
        if (hasText) {
          try {
            const { fonts } = await cdp.send("CSS.getPlatformFontsForNode", { nodeId: n.nodeId });
            fonts.forEach((f) => { const k = f.familyName + (f.isCustomFont ? "" : " (SYSTEM)"); used[k] = (used[k] || 0) + f.glyphCount; });
          } catch {}
        }
      }
      for (const c of n.children || []) await walk(c);
    };
    await walk(root);
    console.log(`${String(w).padStart(4)} ${path.padEnd(38)} ${Object.entries(used).map(([k, v]) => `${k}: ${v} glyphs`).join(" | ")}`);
    Object.keys(used).forEach((k) => (all[k] = true));
    await p.close();
  }
  console.log("\nFaces used anywhere:", Object.keys(all).join(", "));
  await b.close();
})();
