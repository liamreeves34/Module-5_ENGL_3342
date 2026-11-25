// Screenshots each mock page at the verified widths (full page) and reports layout facts.
const { chromium } = require('playwright');
const path = require('path');
const [,, outDir, ...pages] = process.argv;
(async () => {
  const b = await chromium.launch();
  for (const p of pages) for (const w of [1440, 1024, 820, 390]) {
    const pg = await b.newPage({ viewport: { width: w, height: 900 }, deviceScaleFactor: 2 });
    await pg.goto('file://' + path.resolve(p));
    await pg.waitForTimeout(400);
    const info = await pg.evaluate(() => {
      const sw = document.documentElement.scrollWidth, cw = document.documentElement.clientWidth;
      const over = [...document.querySelectorAll('.pg')].map(s => ({ s: s.className, clip: s.scrollHeight - s.clientHeight, h: Math.round(s.getBoundingClientRect().height) }));
      return { hscroll: sw > cw, sw, cw, over, h: document.documentElement.scrollHeight };
    });
    console.log(path.basename(p), w, JSON.stringify(info));
    await pg.screenshot({ path: `${outDir}/${path.basename(p, '.html')}-${w}.png`, fullPage: true });
    await pg.close();
  }
  await b.close();
})();
