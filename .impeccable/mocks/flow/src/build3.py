# Style Guide and Bio book mockups, direction A.
# Reuses build.py (FONTS, BASE_CSS, A_CSS, A_THEME) and build2.py (header, open-book CSS) so the
# new spreads match the approved Module 2 spread exactly. Copy comes from content/drafts/.
import pathlib, html as H
here = pathlib.Path(__file__).parent
root = here.parents[3]
drafts = root / "content" / "drafts"

# build.py / build2.py read these two inputs at import time; regenerate them from the drafts.
(here / "welcome.html").write_text("".join(f"<p>{p}</p>" for p in (drafts / "home-welcome.txt").read_text().strip().split("\n") if p))
(here / "m2-reflection.txt").write_text((drafts / "module-2-reflection.txt").read_text())
import build, build2  # noqa: E402

def header(current):
    items = [("Home", False), ("Modules", False), ("Style Guide", current == "sg"), ("Bio", current == "bio")]
    lis = "".join(
        f'<li><a href="#"{" aria-current=\"page\"" if cur else ""}>{name}'
        + ('<span class="caret" aria-hidden="true"></span>' if name == "Modules" else "")
        + "</a></li>" for name, cur in items)
    return f"""<header class="top">
  <a class="who" href="#"><strong>Liam Reeves</strong><span>ENGL 3342 · Technical Communication Portfolio</span></a>
  <nav aria-label="Main"><ul>{lis}</ul></nav>
  <button class="menu-btn" type="button"><i aria-hidden="true"></i>Menu</button>
</header>"""

# Spread canvas, parameterised by board cloth and page height (in 8px cells).
# The Guide and Bio spines are shorter than the module spines (38 and 41 cells vs 44),
# so their open spreads are shorter in the same proportion: they read as different kinds of book.
SPREAD_JS = """
window.EXTRA = (T) => {
  const cv = document.querySelector('[data-spread]'); if (!cv) return;
  const PW = 64, H = +cv.dataset.h, B = 2, G = 2;
  const W = B + PW + G + PW + B;
  const g = grid(W, H + 3);
  const board = cv.dataset.board, stock = '#F7F6EE';
  rect(g, 0, 0, W, H + 1, board);
  rect(g, 0, H + 1, W, 1, shade(board, -0.3));
  for (let k = 0; k < 2; k++) { rect(g, B, H - 2 + k, PW, 1, k ? '#E2DECF' : '#ECE9DC'); rect(g, B + PW + G, H - 2 + k, PW, 1, k ? '#E2DECF' : '#ECE9DC'); }
  rect(g, B, B, PW, H - 4, stock);
  rect(g, B + PW + G, B, PW, H - 4, stock);
  const gut = ['#E9E6D8', '#DEDACA', '#CFCAB6'];
  gut.forEach((c, i) => { rect(g, B + PW - 1 - (2 - i), B, 1, H - 4, c); rect(g, B + PW + G + (2 - i), B, 1, H - 4, c); });
  rect(g, B + PW, 0, G, H + 1, shade(board, -0.35));
  paint(cv, g, T.cell);
};
"""

# Shared additions on top of build2.OPEN_CSS. Cloth and running-head colour come from the book.
BOOK_CSS = """
.pg .kick{color:var(--kick)}
.pg.right .kick{margin-bottom:0}
.pg .lede{font-size:16px;line-height:1.5;color:var(--ink);margin:-12px 0 18px;max-width:46ch}
.rules{list-style:none;padding:0;border-top:2px solid var(--ink)}
.rules li{display:grid;grid-template-columns:26px 1fr;gap:10px;padding:13px 4px 14px;border-bottom:1px solid rgba(31,42,29,.35)}
.rules .n{font-family:"Barlow SC";font-weight:700;font-size:18px;line-height:1.3;color:var(--ink-2);font-variant-numeric:tabular-nums}
.pg .rules h2,.pg.right .rules h2{font-family:"Atkinson Next";font-weight:700;font-size:18px;line-height:1.3;margin:0 0 4px;letter-spacing:0}
.rules p{font-size:15.5px;line-height:1.5}
.pg.right .rules{margin-top:12px}
.pg.right h2{text-wrap:balance}
nav a[aria-current]:hover{background:var(--ink)}
.bio-body{font-size:16px;line-height:1.6}
.bio-body p+p{margin-top:.7em}
.contact{margin-top:auto}
.contact h3{font-family:"Barlow SC";font-weight:700;font-size:22px;line-height:1.1;margin-bottom:8px}
.contact dl{border-top:2px solid var(--ink);font-size:16px}
.contact dl div{display:grid;grid-template-columns:72px 1fr;gap:12px;align-items:baseline;padding:10px 4px;border-bottom:1px solid rgba(31,42,29,.35)}
.contact dt{color:var(--ink-2);font-size:15px}
.contact dd{font-weight:700;overflow-wrap:anywhere}
.contact a{text-decoration-thickness:2px;text-underline-offset:4px;text-decoration-color:rgba(31,42,29,.45)}
.contact a:hover{text-decoration-color:currentColor;background:var(--hover)}
.contact a:focus-visible,.back:focus-visible{outline:3px solid #2452B5;outline-offset:3px}
@media (max-width:1099px){
  .pg{border-color:var(--cloth)!important;box-shadow:0 8px 0 0 #EDEBDD,0 10px 0 var(--cloth),6px 16px 14px rgba(31,42,29,.25)!important}
  .pg .lede{margin-top:-8px}
  .contact{margin-top:22px}
}
@media (max-width:700px){
  .pg .lede{font-size:16.5px}
  .rules p{font-size:16.5px}
  .bio-body{font-size:16.5px}
  .contact dl div{grid-template-columns:64px 1fr}
}
"""

def p_lines(name):
    return [l for l in (drafts / name).read_text().strip().split("\n") if l]

def write(name, title, current, body, css_vars):
    html = f"""<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title} · Liam Reeves</title>
<style>{build.FONTS}{build.BASE_CSS}{build.A_CSS}{build2.OPEN_CSS}{BOOK_CSS}:root{{{css_vars}}}</style></head>
<body>{header(current)}{body}
<script>const BOOKS=[];{SPREAD_JS}
function THEME(){{return {build.A_THEME};}}</script>
<script src="mock.js"></script></body></html>"""
    (here / f"{name}.html").write_text(html)

def crumbs(where):
    return f"""<div class="crumbs"><a class="back" href="#"><span class="arr" aria-hidden="true"></span>Back to shelf <kbd>Esc</kbd></a>
<p class="where">{where}</p></div>"""

# ---------- Style Guide: one spread, no contents. Principle 1 left (under the title), 2-4 right. ----------
sg = p_lines("style-guide.txt")
lede, rest = sg[0], sg[1:]
principles = [(rest[i].split(". ", 1)[0], rest[i].split(". ", 1)[1], rest[i + 1]) for i in range(0, len(rest), 2)]
def rule_items(items):
    return "".join(f'<li><span class="n">{n}</span><div><h2>{H.escape(t)}</h2><p>{H.escape(b)}</p></div></li>' for n, t, b in items)

SG_BODY = f"""<main>
{crumbs('<b>Style Guide</b> · 4 principles for CS writing')}
<div class="spread-wrap"><div class="spread">
  <canvas data-spread data-board="#EC7F45" data-h="70" aria-hidden="true"></canvas>
  <section class="pg left" aria-labelledby="sg-title">
    <p class="kick">Style guide · For CS beginners</p>
    <h1 id="sg-title">Communication Style &amp; Strategy Guide</h1>
    <p class="lede">{H.escape(lede)}</p>
    <ol class="rules" start="1">{rule_items(principles[:1])}</ol>
    <span class="pageno">1</span>
  </section>
  <section class="pg right" aria-label="Principles 2 to 4">
    <p class="kick">Principles 2–4</p>
    <ol class="rules" start="2">{rule_items(principles[1:])}</ol>
    <span class="pageno">2</span>
  </section>
</div></div>
</main>"""
write("guide", "Style Guide", "sg", SG_BODY, "--cloth:#EC7F45;--kick:#9C4718")

# ---------- Bio: third-person bio left; next steps + contact right. ----------
bio = p_lines("bio.txt")
bio_left, next_head, next_body = bio[0], bio[1], bio[2]
BIO_BODY = f"""<main>
{crumbs('<b>Bio</b> · Professional profile · Contact')}
<div class="spread-wrap"><div class="spread">
  <canvas data-spread data-board="#2B3328" data-h="72" aria-hidden="true"></canvas>
  <section class="pg left" aria-labelledby="bio-title">
    <p class="kick">Professional bio</p>
    <h1 id="bio-title">Liam Reeves</h1>
    <div class="bio-body"><p>{H.escape(bio_left)}</p></div>
    <span class="pageno">1</span>
  </section>
  <section class="pg right" aria-labelledby="next-title">
    <p class="kick">Future application</p>
    <h2 id="next-title">{H.escape(next_head)}</h2>
    <div class="bio-body"><p>{H.escape(next_body)}</p></div>
    <div class="contact"><h3>Contact</h3><dl>
      <div><dt>Email</dt><dd><a href="mailto:liam.reeves01@utrgv.edu">liam.reeves01@utrgv.edu</a></dd></div>
      <div><dt>GitHub</dt><dd><a href="https://github.com/liamreeves34">github.com/liamreeves34</a></dd></div>
    </dl></div>
    <span class="pageno">2</span>
  </section>
</div></div>
</main>"""
write("bio", "Bio", "bio", BIO_BODY, "--cloth:#2B3328;--kick:#2B3328")
print("built guide/bio")
