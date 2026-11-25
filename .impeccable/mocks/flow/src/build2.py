# Open-book spread and full-screen reading view mockups, direction A.
import pathlib, re
import build  # reuses FONTS, BASE_CSS, A_CSS, A_THEME (also rebuilds a/b)
here = pathlib.Path(__file__).parent
refl = "".join(f"<p>{p}</p>" for p in (here / "m2-reflection.txt").read_text().strip().split("\n") if p)

HEADER = """<header class="top">
  <a class="who" href="#"><strong>Liam Reeves</strong><span>ENGL 3342 · Technical Communication Portfolio</span></a>
  <nav aria-label="Main"><ul>
    <li><a href="#">Home</a></li>
    <li><a href="#" aria-current="page">Modules<span class="caret" aria-hidden="true"></span></a></li>
    <li><a href="#">Style Guide</a></li>
    <li><a href="#">Bio</a></li>
  </ul></nav>
  <button class="menu-btn" type="button"><i aria-hidden="true"></i>Menu</button>
</header>"""

OPEN_CSS = """
.crumbs{display:flex;align-items:center;justify-content:space-between;gap:24px;padding:22px 48px 0}
.back{display:inline-flex;align-items:center;gap:10px;font-weight:700;font-size:16px;text-decoration:none;padding:8px 14px 8px 10px;border:2px solid var(--ink);background:var(--ground)}
.back:hover{background:var(--hover)}
.back .arr{width:10px;height:10px;border-left:3px solid currentColor;border-bottom:3px solid currentColor;transform:rotate(45deg);margin-left:4px}
.back kbd{font:inherit;font-size:13px;color:var(--ink-2);font-weight:600}
.crumbs .where{font-size:15px;color:var(--ink-2)}
.crumbs .where b{color:var(--ink)}
.spread-wrap{display:flex;justify-content:center;padding:26px 48px 72px}
.spread{position:relative;filter:drop-shadow(8px 14px 12px rgba(31,42,29,.30))}
.spread canvas{display:block;image-rendering:pixelated}
.pg{position:absolute;top:40px;bottom:56px;display:flex;flex-direction:column}
.pg.left{left:48px;width:440px}
.pg.right{right:48px;width:440px}
.pg .kick{font-family:"Barlow SC";font-weight:700;font-size:15px;letter-spacing:.06em;text-transform:uppercase;color:#17695D}
.pg h1{font-family:"Barlow SC";font-weight:700;font-size:38px;line-height:1.02;letter-spacing:-0.01em;margin:6px 0 26px;text-wrap:balance}
.toc{border-top:2px solid var(--ink);list-style:none;padding:0}
.toc li{border-bottom:1px solid rgba(31,42,29,.35)}
.toc a{display:grid;grid-template-columns:26px 1fr auto;align-items:baseline;gap:10px;padding:13px 4px;text-decoration:none}
.toc .n{font-family:"Barlow SC";font-weight:700;font-size:18px;color:var(--ink-2);font-variant-numeric:tabular-nums}
.toc .t{font-weight:700;font-size:18px;line-height:1.3}
.toc .t small{display:block;font-weight:400;font-size:14px;color:var(--ink-2);margin-top:2px}
.toc .p{font-size:14px;color:var(--ink-2);font-variant-numeric:tabular-nums}
.toc a:hover .t{text-decoration:underline;text-underline-offset:4px}
.toc a[aria-current]{background:rgba(36,82,181,.09);box-shadow:inset 0 0 0 2px #2452B5}
.toc a[aria-current] .n,.toc a[aria-current] .t{color:#2452B5}
.pg .foot{margin-top:auto;font-size:14px;color:var(--ink-2);line-height:1.45}
.pg .foot b{color:var(--ink)}
.pg.right h2{font-family:"Barlow SC";font-weight:700;font-size:28px;line-height:1.05;margin:4px 0 12px}
.pg.right .body{font-size:15.5px;line-height:1.55}
.pg.right .body p+p{margin-top:.7em}
.readbtn{align-self:flex-start;margin-top:auto;display:inline-flex;align-items:center;gap:10px;background:var(--ink);color:#EEF3E4;font-weight:700;font-size:16px;text-decoration:none;padding:10px 16px}
.readbtn:hover{background:#2452B5}
.expand{width:14px;height:14px;position:relative}
.expand::before,.expand::after{content:"";position:absolute;width:6px;height:6px;border:2px solid currentColor}
.expand::before{top:0;right:0;border-left:0;border-bottom:0}.expand::after{bottom:0;left:0;border-right:0;border-top:0}
.pageno{position:absolute;bottom:-26px;font-family:"Barlow SC";font-weight:700;font-size:14px;color:var(--ink-2)}
.pg.left .pageno{left:0}.pg.right .pageno{right:0}
.flipnote{position:absolute;right:-12px;top:-34px;display:flex;align-items:center;gap:8px;color:#2452B5;font-family:"Barlow SC";font-weight:700;font-size:14px;letter-spacing:.08em;text-transform:uppercase}
@media (max-width:1099px){
  .spread{filter:none;width:100%;max-width:720px}
  .spread canvas,.flipnote,.pageno{display:none}
  .pg{position:static;width:auto!important;background:#F7F6EE;border:8px solid #17695D;padding:28px 32px 32px;box-shadow:0 8px 0 0 #EDEBDD,0 10px 0 #17695D,6px 16px 14px rgba(31,42,29,.25)}
  .pg+.pg{margin-top:28px}
  .pg .foot{margin-top:18px}
  .readbtn{margin-top:22px}
}
@media (max-width:700px){
  .crumbs{padding:16px 20px 0;flex-direction:column;align-items:flex-start;gap:10px}
  .back kbd{display:none}
  .spread-wrap{padding:16px 20px 48px}
  .spread{filter:none;width:100%}
  .spread canvas,.flipnote,.pageno{display:none}
  .pg{position:static;width:auto!important;background:#F7F6EE;border:8px solid #17695D;padding:22px 20px 26px;box-shadow:0 8px 0 -0px #EDEBDD,0 10px 0 #17695D,6px 16px 14px rgba(31,42,29,.25)}
  .pg+.pg{margin-top:28px}
  .pg h1{font-size:30px;margin-bottom:18px}
  .pg.right .body{font-size:16.5px}
  .readbtn{margin-top:22px}
  .pg .foot{margin-top:18px}
}
"""

SPREAD_JS = """
window.EXTRA = (T) => {
  const cv = document.querySelector('[data-spread]'); if (!cv) return;
  const PW = 64, H = 78, B = 2, G = 2;            // page width, height, board, gutter (cells)
  const W = B + PW + G + PW + B;
  const g = grid(W, H + 3);
  const board = '#17695D', stock = '#F7F6EE';
  rect(g, 0, 0, W, H + 1, board);
  rect(g, 0, H + 1, W, 1, shade(board, -0.3));
  // page block edges under each page (stacked leaves)
  for (let k = 0; k < 2; k++) { rect(g, B, H - 2 + k, PW, 1, k ? '#E2DECF' : '#ECE9DC'); rect(g, B + PW + G, H - 2 + k, PW, 1, k ? '#E2DECF' : '#ECE9DC'); }
  rect(g, B, B, PW, H - 4, stock);
  rect(g, B + PW + G, B, PW, H - 4, stock);
  // gutter shading: darker toward the fold
  const gut = ['#E9E6D8', '#DEDACA', '#CFCAB6'];
  gut.forEach((c, i) => { rect(g, B + PW - 1 - (2 - i), B, 1, H - 4, c); rect(g, B + PW + G + (2 - i), B, 1, H - 4, c); });
  rect(g, B + PW, 0, G, H + 1, shade(board, -0.35));
  // faint page rule lines like engineering pad (every 5 cells), very light
  paint(cv, g, T.cell);
};
"""

def write(name, body, extra_css="", extra_js=""):
    html = f"""<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Module 2 · Liam Reeves</title>
<style>{build.FONTS}{build.BASE_CSS}{build.A_CSS}{extra_css}</style></head>
<body>{HEADER}{body}
<script>const BOOKS=[];{extra_js}
function THEME(){{return {build.A_THEME};}}</script>
<script src="mock.js"></script></body></html>"""
    (here / f"{name}.html").write_text(html)

OPEN_BODY = f"""<main>
<div class="crumbs"><a class="back" href="#"><span class="arr" aria-hidden="true"></span>Back to shelf <kbd>Esc</kbd></a>
<p class="where"><b>Module 2</b> · 3 entries · Sept–Oct 2026</p></div>
<div class="spread-wrap"><div class="spread">
  <canvas data-spread aria-hidden="true"></canvas>
  <section class="pg left" aria-label="Contents">
    <p class="kick">Module 2 · Instruction manual</p>
    <h1>Containerizing a PyTorch Digit Classifier in Docker</h1>
    <ol class="toc">
      <li><a href="#" aria-current="true"><span class="n">1</span><span class="t">Reflection<small>What I did, what challenged me, what worked</small></span><span class="p">Read first</span></a></li>
      <li><a href="#"><span class="n">2</span><span class="t">Project Proposal<small>Scope, audience, and plan, approved Sept 20</small></span><span class="p">3 pp.</span></a></li>
      <li><a href="#"><span class="n">3</span><span class="t">Docker Instruction Manual<small>FastAPI + Docker on Windows 11 with WSL2</small></span><span class="p">38 pp.</span></a></li>
    </ol>
    <p class="foot"><b>Audience:</b> Python programmers who have trained a PyTorch model but never deployed one.</p>
    <span class="pageno">i</span>
  </section>
  <section class="pg right" aria-label="Reflection" aria-live="polite">
    <p class="kick">Entry 1</p>
    <h2>Reflection</h2>
    <div class="body">{refl}</div>
    <span class="pageno">1</span>
  </section>
</div></div>
</main>"""
write("open", OPEN_BODY, OPEN_CSS, SPREAD_JS)
MAN_RIGHT = """<section class="pg right" aria-label="Docker Instruction Manual" aria-live="polite">
    <p class="kick">Entry 3 · 38 pages</p>
    <h2>Docker Instruction Manual</h2>
    <div class="preview"><img src="pages/manual-03.png" alt="First page of the Docker instruction manual"><div class="body"><p>Three phases take a trained PyTorch model to a prediction served from a Docker container: run the predictor, wrap it in a FastAPI web API, then containerize it.</p><p>Opens with a memo explaining the switch from scikit-learn to PyTorch and the new reader prerequisites.</p></div></div>
    <a class="readbtn" href="#">Read full screen<span class="expand" aria-hidden="true"></span></a>
    <span class="pageno">3</span>
  </section>"""
MB = OPEN_BODY.split('<section class="pg right"')[0] + MAN_RIGHT + "\n</div></div>\n</main>"
MB = MB.replace('<li><a href="#" aria-current="true"><span class="n">1</span>','<li><a href="#"><span class="n">1</span>').replace('<li><a href="#"><span class="n">3</span>','<li><a href="#" aria-current="true"><span class="n">3</span>')
write("open-manual", MB, OPEN_CSS + ".preview{display:grid;grid-template-columns:190px 1fr;gap:20px;align-items:start}.preview img{width:190px;border:2px solid var(--ink);box-shadow:4px 6px 8px rgba(31,42,29,.22);background:#fff}@media (max-width:700px){.preview{grid-template-columns:1fr}.preview img{width:70%}}", SPREAD_JS)

READ_CSS = """
.back{display:inline-flex;align-items:center;gap:10px;font-weight:700;font-size:16px;text-decoration:none;padding:8px 14px 8px 10px;border:2px solid var(--ink);background:var(--ground)}
.back:hover{background:var(--hover)}
.back .arr{width:10px;height:10px;border-left:3px solid currentColor;border-bottom:3px solid currentColor;transform:rotate(45deg);margin-left:4px}
.reader{padding:22px 48px 72px}
.sheet{position:relative;background:#F7F6EE;border:16px solid #17695D;box-shadow:0 10px 0 -2px #ECE9DC,0 14px 0 -2px #17695D,8px 22px 18px rgba(31,42,29,.28)}
.bar{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:16px 28px;border-bottom:2px solid var(--ink)}
.bar .back{border-color:var(--ink);background:#F7F6EE}
.bar .doc{flex:1;min-width:0}
.bar .doc b{display:block;font-family:"Barlow SC";font-size:26px;line-height:1.1}
.bar .doc span{font-size:14px;color:var(--ink-2)}
.open{display:inline-flex;align-items:center;gap:10px;font-weight:700;font-size:16px;text-decoration:none;padding:10px 16px;background:var(--ink);color:#EEF3E4}
.open:hover{background:#2452B5}
.cols{display:grid;grid-template-columns:minmax(0,34ch) minmax(0,1fr);gap:40px;padding:28px}
.about h2{font-family:"Barlow SC";font-weight:700;font-size:22px;margin-bottom:8px}
.about p{font-size:16px;line-height:1.55}
.about p+p{margin-top:.8em}
.about dl{margin-top:20px;border-top:2px solid var(--ink);font-size:15px}
.about dl div{display:flex;justify-content:space-between;gap:12px;padding:9px 0;border-bottom:1px solid rgba(31,42,29,.3)}
.about dt{color:var(--ink-2)}.about dd{font-weight:700;text-align:right}
.viewer{border:2px solid var(--ink);background:#DCE3D3}
.vbar{display:flex;justify-content:space-between;align-items:center;padding:8px 14px;border-bottom:2px solid var(--ink);background:#E6ECDD;font-size:14px;font-weight:600;font-variant-numeric:tabular-nums}
.vbar .ctl{display:flex;gap:6px}
.vbar button{font:inherit;font-weight:700;border:2px solid var(--ink);background:#F7F6EE;padding:2px 10px;color:var(--ink)}
.pages{display:flex;flex-direction:column;align-items:center;gap:18px;padding:18px;height:540px;overflow:auto}
.pages img{width:min(100%,600px);height:auto;box-shadow:4px 6px 10px rgba(31,42,29,.25);background:#fff}
@media (max-width:700px){
  .reader{padding:14px 12px 40px}
  .sheet{border-width:10px}
  .bar{flex-wrap:wrap;padding:14px 16px}
  .bar .doc{order:-1;flex-basis:100%}
  .bar .doc b{font-size:22px}
  .cols{grid-template-columns:1fr;padding:18px 16px;gap:22px}
  .pages{height:auto;padding:12px}
  .pages img{height:auto;width:100%}
  .pages{height:460px}
}
"""
READ_BODY = """<main class="reader"><article class="sheet">
<div class="bar"><a class="back" href="#"><span class="arr" aria-hidden="true"></span>Back to contents</a>
<div class="doc"><b>Docker Instruction Manual</b><span>Module 2 · Entry 3 of 3</span></div>
<a class="open" href="#">Open PDF in new tab<span class="expand" aria-hidden="true"></span></a></div>
<div class="cols">
 <div class="about"><h2>About this document</h2>
 <p>A 38-page, three-phase manual that takes a trained PyTorch model to a working prediction served from a Docker container: run the predictor, wrap it in a FastAPI web API, then containerize it.</p>
 <p>Opens with a memo to Dr. Paudel explaining the change from scikit-learn to PyTorch and what that meant for the reader's prerequisites.</p>
 <dl><div><dt>Pages</dt><dd>38</dd></div><div><dt>Written</dt><dd>Oct 6, 2026</dd></div><div><dt>Platform</dt><dd>Windows 11 + WSL2</dd></div><div><dt>Time to complete</dt><dd>45–60 min</dd></div></dl></div>
 <div class="viewer" aria-label="PDF viewer"><div class="vbar"><span>Page 7 of 38</span><span class="ctl"><button type="button">Prev</button><button type="button">Next</button></span></div>
 <div class="pages"><img src="pages/manual-07.png" alt="Manual page 7: Phase 1, Step 1, confirming the home folder and Python version"><img src="pages/manual-08.png" alt="Manual page 8"></div></div>
</div></article></main>"""
write("read", READ_BODY, READ_CSS)
print("built open/read")
