# Assembles the two direction mockups from one skeleton + per-direction CSS/data.
import pathlib
here = pathlib.Path(__file__).parent
welcome = (here / "welcome.html").read_text()

FONTS = """
@font-face{font-family:"Atkinson Next";src:url(fonts/atkinson-hyperlegible-next-latin.woff2) format("woff2");font-weight:200 800;font-display:block}
@font-face{font-family:"Barlow SC";src:url(fonts/barlow-semi-condensed-400-latin.woff2) format("woff2");font-weight:400;font-display:block}
@font-face{font-family:"Barlow SC";src:url(fonts/barlow-semi-condensed-700-latin.woff2) format("woff2");font-weight:700;font-display:block}
@font-face{font-family:"Archivo";src:url(fonts/archivo-latin.woff2) format("woff2");font-weight:100 900;font-display:block}
"""

BASE_CSS = """
*{box-sizing:border-box;margin:0}
html{-webkit-font-smoothing:antialiased}
body{font-family:"Atkinson Next",system-ui,sans-serif;color:var(--ink);background:var(--ground);font-size:18px;line-height:1.6}
a{color:inherit}
::selection{background:var(--select);color:var(--ink)}
.top{display:flex;align-items:center;justify-content:space-between;gap:2rem;padding:20px 48px;border-bottom:2px solid var(--rule)}
.who{display:flex;flex-direction:column;line-height:1.15}
.who strong{font-family:var(--display);font-weight:700;font-size:26px;letter-spacing:-0.01em}
.who span{font-size:14px;color:var(--ink-2)}
nav ul{display:flex;gap:6px;list-style:none;padding:0}
nav a{display:block;padding:8px 14px;text-decoration:none;font-weight:600;font-size:16px;border-radius:2px}
nav a[aria-current]{background:var(--ink);color:var(--ground)}
nav a:hover{background:var(--hover)}
.caret{display:inline-block;width:8px;height:8px;margin-left:6px;border-right:2px solid currentColor;border-bottom:2px solid currentColor;transform:translateY(-3px) rotate(45deg)}
.menu-btn{display:none}
.stage{padding:36px 48px 0}
.now{display:flex;align-items:flex-end;justify-content:space-between;gap:24px;min-height:120px}
.now h1{font-family:var(--display);font-weight:700;font-size:56px;line-height:1;letter-spacing:-0.02em;max-width:22ch;text-wrap:balance}
.now .meta{font-size:16px;color:var(--ink-2);text-align:right;line-height:1.5;padding-bottom:6px}
.now .meta b{color:var(--ink);font-weight:700}
.shelf{position:relative;margin-top:28px}
.row{display:flex;align-items:flex-end;justify-content:center;gap:var(--gap);position:relative;z-index:1}
.book{position:relative;display:block;text-decoration:none;filter:drop-shadow(6px 10px 8px var(--shadow))}
.book canvas{display:block;image-rendering:pixelated}
.book:not(.is-out):hover,.book:not(.is-out):focus-visible{transform:translateY(-16px)}
.spine-title{position:absolute;left:0;right:0;top:calc(var(--cell)*7.5);bottom:var(--title-bottom);writing-mode:vertical-rl;display:flex;align-items:center;justify-content:center;font-family:var(--display);font-weight:700;font-size:20px;line-height:1.05;text-align:center;padding:0 8px}
.spine-code{position:absolute;left:0;right:0;bottom:var(--code-bottom);text-align:center;font-family:var(--display);font-weight:700;font-size:var(--code-size);line-height:1.1;letter-spacing:.02em}
.cover-title{position:absolute;left:var(--cover-x);right:calc(var(--cover-x) + 16px);top:calc(var(--cell)*4);display:flex;flex-direction:column;gap:8px}
.cover-code{font-size:14px;font-weight:700;letter-spacing:.06em;text-transform:uppercase}
.cover-name{font-family:var(--display);font-weight:700;font-size:25px;line-height:1.05;letter-spacing:-0.005em;text-wrap:balance}
.cover-by{position:absolute;left:var(--cover-x);bottom:calc(var(--cell)*2);font-size:14px;font-weight:700;letter-spacing:.02em}
.ledge{display:block;margin-top:-2px;image-rendering:pixelated}
.hint{display:flex;justify-content:center;gap:28px;padding:14px 0 0;font-size:15px;color:var(--ink-2)}
.hint kbd{font:inherit;font-weight:700;color:var(--ink);border:2px solid var(--rule);padding:0 6px;border-radius:2px}
.welcome{display:grid;grid-template-columns:240px minmax(0,68ch);gap:56px;justify-content:center;padding:72px 48px 96px}
.welcome h2{font-family:var(--display);font-weight:700;font-size:40px;line-height:1.05;letter-spacing:-0.015em;margin-bottom:20px}
.welcome p+p{margin-top:1em}
.portrait figcaption{font-size:14px;color:var(--ink-2);margin-top:10px;line-height:1.4}
.portrait canvas{display:block;image-rendering:pixelated}
@media (max-width:960px){
  .now{display:block}
  .now .meta{text-align:left;margin-top:12px}
}
@media (max-width:700px){
  body{font-size:17px}
  .top{padding:14px 20px}
  .who strong{font-size:22px}
  nav ul{display:none}
  .menu-btn{display:inline-flex;align-items:center;gap:10px;font:inherit;font-weight:700;font-size:16px;color:var(--ink);background:none;border:2px solid var(--ink);padding:6px 12px;border-radius:2px}
  .menu-btn i{display:block;width:16px;height:2px;background:currentColor;box-shadow:0 5px 0 currentColor,0 -5px 0 currentColor}
  .stage{padding:24px 0 0}
  .now{display:block;padding:0 20px;min-height:0}
  .now h1{font-size:38px}
  .now .meta{text-align:left;margin-top:10px}
  .shelf{overflow:hidden}
  .row{justify-content:flex-start;padding:0 20px;transform:translateX(-64px)}
  .hint{padding:12px 20px 0;justify-content:flex-start}
  .hint .keys{display:none}
  .welcome{grid-template-columns:1fr;gap:24px;padding:48px 20px 64px}
  .welcome h2{font-size:32px}
}
"""

def page(name, css, theme_js, books_js, featured, title, meta_html):
    html = f"""<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Liam Reeves · Technical Communication Portfolio</title>
<style>{FONTS}{BASE_CSS}{css}</style></head>
<body>
<header class="top">
  <a class="who" href="#"><strong>Liam Reeves</strong><span>ENGL 3342 · Technical Communication Portfolio</span></a>
  <nav aria-label="Main"><ul>
    <li><a href="#" aria-current="page">Home</a></li>
    <li><a href="#">Modules<span class="caret" aria-hidden="true"></span></a></li>
    <li><a href="#">Style Guide</a></li>
    <li><a href="#">Bio</a></li>
  </ul></nav>
  <button class="menu-btn" type="button"><i aria-hidden="true"></i>Menu</button>
</header>
<main>
  <section class="stage" aria-label="Bookshelf">
    <div class="now"><h1 aria-live="polite">{title}</h1><p class="meta">{meta_html}</p></div>
    <div class="shelf"><div class="row" data-shelf data-featured="{featured}"></div><canvas class="ledge" data-ledge></canvas></div>
    <p class="hint"><span>Hover a spine to pull it out. Click to open the book.</span><span class="keys"><kbd>Tab</kbd> moves between books</span></p>
  </section>
  <section class="welcome" aria-labelledby="hi">
    <figure class="portrait"><canvas data-portrait></canvas><figcaption>Placeholder: Liam's photo or pixel avatar goes here.</figcaption></figure>
    <div><h2 id="hi">Welcome to my shelf.</h2>{welcome}</div>
  </section>
</main>
<script>{books_js}
function THEME(){{return {theme_js};}}</script>
<script src="mock.js"></script>
</body></html>"""
    (here / f"{name}.html").write_text(html)

# ---------- Direction A: engineering computation pad ----------
A_CSS = """
:root{--ground:#EEF3E4;--ink:#1F2A1D;--ink-2:#46553F;--rule:#1F2A1D;--hover:#DCE6CC;--select:#F4D35E;
--shadow:rgba(31,42,29,.28);--display:"Barlow SC";--gap:0px;--code-bottom:62px;--code-size:17px;--cell:8px;--cover-x:28px;--title-bottom:96px}
body{background-color:var(--ground);
background-image:
 linear-gradient(rgba(70,110,60,.20) 1px,transparent 1px),
 linear-gradient(90deg,rgba(70,110,60,.20) 1px,transparent 1px),
 linear-gradient(rgba(70,110,60,.07) 1px,transparent 1px),
 linear-gradient(90deg,rgba(70,110,60,.07) 1px,transparent 1px);
background-size:40px 40px,40px 40px,8px 8px,8px 8px;background-position:-1px -1px}
.top{background:var(--ground)}
.welcome{background:linear-gradient(var(--ground),var(--ground)) padding-box}
.welcome > div{background:var(--ground)}
nav a:focus-visible,.book:focus-visible{outline:3px solid #2452B5;outline-offset:4px}
.dim{position:absolute;left:0;right:16px;top:-30px;display:flex;align-items:center;gap:8px;color:#2452B5;font-family:"Barlow SC";font-weight:700;font-size:14px;letter-spacing:.08em;text-transform:uppercase}
.dim i{flex:1;height:2px;background:#2452B5;position:relative}
.dim i:first-child::before,.dim i:last-child::after{content:"";position:absolute;top:-6px;width:2px;height:14px;background:#2452B5}
.dim i:first-child::before{left:0}.dim i:last-child::after{right:0}
"""
A_BOOKS = """const BOOKS=[
{id:'m1',code:'Module 1',short:'Email Conventions',title:'Email Conventions in Computer Science',cloth:'#2449A6',band:'#F2C14E',panel:'#DDE5F6',iconA:'#F2C14E',iconB:'#2449A6',text:'#FFFFFF',icon:'mail'},
{id:'m2',entries:'3 entries',code:'Module 2',short:'Containerizing a Digit Classifier',title:'Containerizing a PyTorch Digit Classifier in Docker',cloth:'#17695D',band:'#F28C38',panel:'#D9EFE9',iconA:'#F28C38',iconB:'#17695D',text:'#FFFFFF',icon:'box'},
{id:'m3',code:'Module 3',short:'Parking Availability Redesign',title:'Redesigning UTRGV Parking Availability',cloth:'#F0B429',band:'#1F2A44',panel:'#FFF4D6',iconA:'#1F2A44',iconB:'#2449A6',text:'#1F2A1D',icon:'park'},
{id:'m4',code:'Module 4',short:'AI Literacy & Job Materials',title:'AI Literacy, Resume & Cover Letter',cloth:'#7A2338',band:'#F2C14E',panel:'#F6E1E5',iconA:'#F2C14E',iconB:'#7A2338',text:'#FFFFFF',icon:'bulb'},
{id:'sg',code:'Guide',short:'CS Writing Style Guide',title:'Communication Style & Strategy Guide',cloth:'#EC7F45',band:'#1F2A1D',panel:'#FBE3D7',iconA:'#F2C14E',iconB:'#DD5A26',text:'#1F2A1D',icon:'pencil',W:9,H:38},
{id:'bio',code:'Bio',short:'About Liam',title:'Professional Bio & Future Plans',cloth:'#2B3328',band:'#B9CC9E',panel:'#E3EBD5',iconA:'#B9CC9E',iconB:'#2B3328',text:'#EEF3E4',icon:'person',W:10,H:41},
];"""
A_THEME = """{dim:true,cell:8,spineW:11,spineH:44,coverW:30,pages:'#F7F6EE',inkPixel:'#1F2A1D',ledgeRows:3,
frame:'#1F2A1D',frameIn:'#E1EAD3',frameMark:'#9DB585',
ledge:(g,cols)=>{for(let x=0;x<cols;x++){g[0][x]='#1F2A1D';g[1][x]=(x%5===0)?'#46553F':'#7C8F6E';g[2][x]='#1F2A1D';}}}"""
page("a", A_CSS, A_THEME, A_BOOKS, "", "Six books from one semester of technical writing",
     "<b>Modules 1–4</b> · Style Guide · Bio<br>Pick a book to open it")
page("a-hover", A_CSS, A_THEME, A_BOOKS, "m2", "Containerizing a PyTorch Digit Classifier in Docker",
     "<b>Module 2</b> · Instruction manual<br>Proposal · Manual · Reflection")

# ---------- Direction B: university library stacks ----------
B_CSS = """
:root{--ground:#E7EAEC;--ink:#172230;--ink-2:#46525F;--rule:#172230;--hover:#D3D9DE;--select:#9FD3C7;
--shadow:rgba(23,34,48,.30);--display:"Archivo";--gap:4px;--code-bottom:70px;--code-size:12px;--cell:8px;--cover-x:28px;--title-bottom:150px}
.now h1{font-stretch:90%;font-weight:800;letter-spacing:-0.025em}
.who strong{font-weight:800}
.spine-title{font-family:"Archivo";font-weight:700;font-size:18px}
.spine-code{font-family:"Atkinson Next";font-weight:700;line-height:1.25;padding:0 18px;white-space:pre-line}
.stage{background:#E7EAEC}
.shelf::before{content:"";position:absolute;inset:-28px -48px 0;background:#D9DEE2;z-index:0}
.ledge{position:relative;z-index:1}
nav a:focus-visible,.book:focus-visible{outline:3px solid #0F6E5C;outline-offset:4px}
"""
B_BOOKS = """const BOOKS=[
{id:'m1',code:'Module 1',short:'Email Conventions',call:'QA76\\n.R4 M1',title:'Email Conventions in Computer Science',cloth:'#5A2A1F',band:'#C79A3D',panel:'#EADBC9',iconA:'#C79A3D',iconB:'#5A2A1F',text:'#F3E6CF',icon:'mail'},
{id:'m2',code:'Module 2',short:'Containerizing a Digit Classifier',call:'QA76\\n.R4 M2',title:'Containerizing a PyTorch Digit Classifier in Docker',cloth:'#1D3F63',band:'#C79A3D',panel:'#D6E0EA',iconA:'#E07A2F',iconB:'#1D3F63',text:'#F1EBDD',icon:'box'},
{id:'m3',code:'Module 3',short:'Parking Availability Redesign',call:'QA76\\n.R4 M3',title:'Redesigning UTRGV Parking Availability',cloth:'#2F5A3A',band:'#C79A3D',panel:'#DCE8DD',iconA:'#2F5A3A',iconB:'#1D3F63',text:'#F1EBDD',icon:'park'},
{id:'m4',code:'Module 4',short:'AI Literacy & Job Materials',call:'QA76\\n.R4 M4',title:'AI Literacy, Resume & Cover Letter',cloth:'#8C2F2A',band:'#C79A3D',panel:'#F0DAD5',iconA:'#C79A3D',iconB:'#8C2F2A',text:'#F3E6CF',icon:'bulb'},
{id:'sg',code:'Guide',short:'CS Writing Style Guide',call:'REF QA76\\n.R4 G',title:'Communication Style & Strategy Guide',cloth:'#C98A1E',band:'#172230',panel:'#F6E7C8',iconA:'#172230',iconB:'#C98A1E',text:'#172230',icon:'pencil',W:10,H:40},
{id:'bio',code:'Bio',short:'About Liam',call:'REF QA76\\n.R4 B',title:'Professional Bio & Future Plans',cloth:'#3B3F46',band:'#9FD3C7',panel:'#DDE3E6',iconA:'#9FD3C7',iconB:'#3B3F46',text:'#E7EAEC',icon:'person',W:10,H:42},
];"""
B_THEME = """{cell:8,spineW:11,spineH:46,coverW:30,pages:'#F2EEE4',inkPixel:'#172230',label:'#F7F5EF',labelInk:'#172230',ledgeRows:4,
frame:'#172230',frameIn:'#D3D9DE',frameMark:'#7F8C99',
ledge:(g,cols)=>{for(let x=0;x<cols;x++){g[0][x]='#5F6B77';g[1][x]='#8D99A5';g[2][x]='#6E7A86';g[3][x]=(x%24<2)?'#2B3540':'#4A5562';}}}"""
page("b", B_CSS, B_THEME, B_BOOKS, "m2", "Containerizing a PyTorch Digit Classifier in Docker",
     "<b>Module 2</b> · Shelved at QA76 .R4 M2<br>Proposal · Manual · Reflection")
print("built")
