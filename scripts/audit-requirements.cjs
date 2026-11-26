// Checks the built site against the Module 5 assignment guidelines (instructions/), using the
// rendered pages. Usage: node scripts/audit-requirements.cjs http://localhost:4321
const { chromium } = require("playwright");
const { execSync } = require("child_process");
const BASE = process.argv[2] || "http://localhost:4321";
const words = (t) => t.replace(/[“”"’']/g, "").split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w)).length;
const results = [];
const check = (ok, name, detail) => results.push(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? " — " + detail : ""}`);
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const text = async (path, sel) => { await p.goto(BASE + path); return p.$$eval(sel, (els) => els.map((e) => e.innerText).join("\n")); };

  // A. Home
  const home = await text("/", ".welcome-text p");
  const hw = words(home);
  check(hw >= 250 && hw <= 300, "A. Home welcome is 250–300 words", `${hw} words`);
  await p.goto(BASE + "/");
  const img = await p.$$eval(".portrait svg, .portrait img", (e) => e.length);
  check(img > 0, "A. Home has a picture/avatar/image", img ? "present" : "missing");
  const nav = await p.$$eval("#site-nav a", (as) => as.map((a) => a.textContent.trim().replace(/\s+/g, " ")));
  const need = ["Home", "Module 1", "Module 2", "Module 3", "Module 4", "Style Guide", "Bio"];
  const missing = need.filter((n) => !nav.some((t) => t.includes(n)));
  check(!missing.length, "Navigation reaches every section", missing.length ? "missing " + missing.join(", ") : nav.length + " links");

  // B. Modules
  for (const n of [1, 2, 3, 4]) {
    const r = await text(`/modules/${n}`, ".pg.right .body p");
    const w = words(r);
    await p.goto(BASE + `/modules/${n}`);
    const docs = await p.$$eval(".toc a", (as) => as.slice(1).map((a) => a.getAttribute("href")));
    let embeds = 0, links = 0, previews = 0;
    for (const d of docs) {
      await p.goto(BASE + d); previews += await p.$$eval(".preview img", (e) => e.length);
      links += await p.$$eval("a.pdflink", (e) => e.length);
      await p.goto(BASE + d + "/read"); embeds += await p.$$eval("object[type='application/pdf']", (e) => e.length);
    }
    check(w >= 150, `B. Module ${n} reflection is 150+ words`, `${w} words`);
    check(docs.length > 0 && embeds === docs.length && links === docs.length && previews === docs.length,
      `B. Module ${n} showcases its work`, `${docs.length} documents, each with preview, inline viewer and Open PDF link`);
  }
  const m3 = await text("/modules/3", ".pg.left .foot");
  check(/Gaby Saboia/.test(m3) && /Joanna Gutierrez/.test(m3), "Collaborators credited on Module 3", m3.trim());
  const m4 = await text("/modules/4", ".pg.left .foot");
  check(/Tim Trasmonte/.test(m4), "Collaborator credited on Module 4", m4.trim());

  // C. Style guide
  const g = await text("/style-guide", ".pg .lede, .rules h2, .rules p");
  await p.goto(BASE + "/style-guide");
  const principles = await p.$$eval(".rules li", (e) => e.length);
  check(words(g) >= 150 && words(g) <= 200, "C. Style Guide is 150–200 words", `${words(g)} words (with principle headings)`);
  check(principles >= 3 && principles <= 4, "C. Style Guide has 3–4 principles", `${principles}`);

  // D. Bio
  const bio = await text("/bio", ".bio-body p");
  const bw = words(bio);
  const firstPerson = (bio.match(/\b(I|me|my|mine|I'm|I’m|we|our)\b/g) || []);
  await p.goto(BASE + "/bio");
  const contact = await p.$$eval(".contact a", (as) => as.map((a) => a.getAttribute("href")));
  check(bw >= 150 && bw <= 200, "D. Bio is 150–200 words", `${bw} words (excluding the contact block)`);
  check(!firstPerson.length, "D. Bio is strictly third person", firstPerson.length ? "found: " + firstPerson.join(", ") : "no first-person words");
  check(contact.includes("mailto:liam.reeves01@utrgv.edu") && contact.some((h) => h.includes("github.com/liamreeves34")), "D. Bio has a contact section", contact.join(", "));
  const futures = [["internships", /internship/i], ["graduate study", /graduat|M\.S\.|master|Ph\.?D/i], ["career", /career|industry|job/i]].filter(([, r]) => r.test(bio)).map(([n]) => n);
  check(futures.length > 0, "D. Bio explains how he will use these skills (internships, graduate study, or career)", futures.join(", "));

  // Checklist
  const html = execSync("cat dist/index.html dist/*/index.html dist/modules/*/index.html dist/modules/*/*/index.html dist/modules/*/*/read/index.html", { maxBuffer: 64 * 1024 * 1024 }).toString().replace(/<svg[\s\S]*?<\/svg>/g, "");
  const ph = html.match(/placeholder|lorem ipsum|\bTODO\b|\bTBD\b/gi) || [];
  check(!ph.length, "No placeholder text in the published site", ph.length ? `found "${[...new Set(ph)].join('", "')}"` : "");
  const phone = execSync("for f in dist/docs/*.pdf; do pdftotext \"$f\" - 2>/dev/null; done; cat dist/index.html dist/*/index.html", { maxBuffer: 64 * 1024 * 1024 }).toString().match(/\(?\b\d{3}\)?[ .-]\d{3}[ .-]\d{4}\b/g) || [];
  check(!phone.length, "No phone number anywhere on the site or in its PDFs", phone.length ? phone.length + " found" : "");
  await b.close();
  console.log(results.join("\n"));
})();
