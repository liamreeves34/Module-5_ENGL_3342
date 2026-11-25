// Mockup renderer: pixel-art books drawn on canvas, all text is real HTML.
const ICONS = {
  // 16x16. o = outline, a = main, b = secondary, h = highlight, . = empty
  mail: [
    "................",
    "................",
    "................",
    "oooooooooooooooo",
    "oaaaaaaaaaaaaaao",
    "obaaaaaaaaaaaabo",
    "oabaaaaaaaaaabao",
    "oaabaaaaaaaabaao",
    "oaaabbaaaabbaaao",
    "oaaaaabbbbaaaaao",
    "oaaaaaaaaaaaaaao",
    "oaahhhhhhaaaaaao",
    "oaaaaaaaaaaaaaao",
    "oooooooooooooooo",
    "................",
    "................",
  ],
  box: [
    "................",
    "................",
    "....oooooooo....",
    "....ohhhhhho....",
    "....oh....ho....",
    "....oh.oo.ho....",
    "....oh..o.ho....",
    "....ohhhhhho....",
    "oooooooooooooooo",
    "oaabaabaabaabaao",
    "oaabaabaabaabaao",
    "oaabaabaabaabaao",
    "oaabaabaabaabaao",
    "oooooooooooooooo",
    ".oo..........oo.",
    "................",
  ],
  park: [
    "................",
    "..oooooooooooo..",
    "..obbbbbbbbbbo..",
    "..obhhhhhhbbbo..",
    "..obhbbbbbhbbo..",
    "..obhbbbbbhbbo..",
    "..obhhhhhhbbbo..",
    "..obhbbbbbbbbo..",
    "..obhbbbbbbbbo..",
    "..obbbbbbbbbbo..",
    "..oooooooooooo..",
    ".......oo.......",
    ".......oo.......",
    ".......oo.......",
    ".....oooooo.....",
    "................",
  ],
  bulb: [
    "................",
    ".....oooooo.....",
    "....ohhaaaaao...",
    "...ohaaaaaaaao..",
    "...ohaaaaaaaao..",
    "...oaaaaaaaaao..",
    "...oaaaaaaaaao..",
    "....oaaaaaaao...",
    ".....oaaaaao....",
    "......oaaao.....",
    "......obbbo.....",
    "......ooooo.....",
    "......obbbo.....",
    "......ooooo.....",
    ".......ooo......",
    "................",
  ],
  pencil: [
    "................",
    "............ooo.",
    "...........obbo.",
    "..........obbbo.",
    ".........oaaoo..",
    "........oaaao...",
    ".......oaaao....",
    "......oaaao.....",
    ".....oaaao......",
    "....oaaao.......",
    "...ohaao........",
    "...ohhao........",
    "..ooooo.........",
    "..oo............",
    "................",
    "................",
  ],
  person: [
    "................",
    "......oooo......",
    ".....ohhaao.....",
    "....ohaaaaao....",
    "....oaaaaaao....",
    "....oaaaaaao....",
    ".....oaaaao.....",
    "......oooo......",
    "....oooooooo....",
    "...obbbbbbbbo...",
    "..obbbbbbbbbbo..",
    "..obbbbbbbbbbo..",
    "..obbbbbbbbbbo..",
    "..oooooooooooo..",
    "................",
    "................",
  ],
};

function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  const f = (c) => Math.max(0, Math.min(255, Math.round(amt < 0 ? c * (1 + amt) : c + (255 - c) * amt)));
  return "#" + [f(r), f(g), f(b)].map((c) => c.toString(16).padStart(2, "0")).join("");
}

function grid(cols, rows) {
  return Array.from({ length: rows }, () => Array(cols).fill(null));
}
function rect(g, x, y, w, h, c) {
  for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) if (g[j] && i >= 0 && i < g[0].length) g[j][i] = c;
}
function paint(canvas, g, cell) {
  const rows = g.length, cols = g[0].length;
  canvas.width = cols * cell;
  canvas.height = rows * cell;
  canvas.style.width = cols * cell + "px";
  canvas.style.height = rows * cell + "px";
  const ctx = canvas.getContext("2d");
  for (let y = 0; y < rows; y++)
    for (let x = 0; x < cols; x++) if (g[y][x]) { ctx.fillStyle = g[y][x]; ctx.fillRect(x * cell, y * cell, cell, cell); }
}
function stamp(g, icon, ox, oy, pal, scale = 1) {
  icon.forEach((row, y) =>
    [...row].forEach((ch, x) => {
      if (ch === ".") return;
      rect(g, ox + x * scale, oy + y * scale, scale, scale, pal[ch]);
    })
  );
}

function spine(book, T) {
  const W = book.W || T.spineW, H = book.H || T.spineH;
  const g = grid(W, H);
  const c = book.cloth;
  rect(g, 0, 0, W, H, c);
  rect(g, 0, 0, 1, H, shade(c, 0.22));
  rect(g, W - 1, 0, 1, H, shade(c, -0.35));
  rect(g, 1, 0, W - 2, 1, shade(c, -0.25));
  // head band and tail band
  rect(g, 1, 3, W - 2, 1, book.band);
  rect(g, 1, 5, W - 2, 1, book.band);
  rect(g, 1, H - 6, W - 2, 1, book.band);
  rect(g, 1, H - 4, W - 2, 1, book.band);
  // cloth weave: sparse checker of a slightly lighter tone
  for (let y = 7; y < H - 7; y++) for (let x = 1; x < W - 1; x++) if ((x * 7 + y * 3) % 11 === 0) g[y][x] = shade(c, 0.08);
  if (T.label) rect(g, 2, H - 17, W - 4, 9, T.label);
  return g;
}

function cover(book, T) {
  const W = T.coverW, H = book.H || T.spineH, P = 2; // P = page-block depth on the right
  const g = grid(W + P, H);
  const c = book.cloth;
  rect(g, 0, 0, W, H, c);
  rect(g, 0, 0, 2, H, shade(c, -0.25)); // hinge
  rect(g, 2, 0, 1, H, shade(c, 0.18));
  rect(g, W - 1, 0, 1, H, shade(c, -0.3));
  rect(g, 0, H - 1, W, 1, shade(c, -0.3));
  rect(g, W, 1, P, H - 1, T.pages);
  for (let y = 2; y < H; y += 2) g[y][W + 1] = shade(T.pages, -0.12);
  for (let y = 7; y < H - 2; y++) for (let x = 3; x < W - 1; x++) if ((x * 7 + y * 3) % 11 === 0) g[y][x] = shade(c, 0.08);
  // art panel
  const panelW = 20, panelX = Math.floor((W - panelW) / 2) + 1, panelY = H - 25;
  rect(g, panelX, panelY, panelW, 20, book.panel);
  const pal = { o: T.inkPixel, a: book.iconA, b: book.iconB, h: "#FFFFFF" };
  stamp(g, ICONS[book.icon], panelX + 2, panelY + 2, pal);
  return g;
}

function shelfRow(T) {
  const host = document.querySelector("[data-shelf]");
  if (!host) return;
  const featured = host.dataset.featured;
  BOOKS.forEach((book) => {
    const isOut = book.id === featured;
    const el = document.createElement("a");
    el.href = "#";
    el.className = "book" + (isOut ? " is-out" : "");
    el.setAttribute("aria-label", book.code + ": " + book.title);
    const cv = document.createElement("canvas");
    paint(cv, isOut ? cover(book, T) : spine(book, T), T.cell);
    el.appendChild(cv);
    const t = document.createElement("span");
    t.className = isOut ? "cover-title" : "spine-title";
    t.style.color = book.text;
    t.innerHTML = isOut
      ? `<span class="cover-code">${book.code}</span><span class="cover-name">${book.short}</span>`
      : `${book.short}`;
    el.appendChild(t);
    const code = document.createElement("span");
    code.className = isOut ? "cover-by" : "spine-code";
    code.style.color = isOut ? book.text : T.label ? T.labelInk : book.text;
    code.textContent = isOut ? "Liam Reeves" : T.label ? book.call : book.code;
    el.appendChild(code);
    if (isOut && T.dim) el.insertAdjacentHTML('beforeend', `<span class="dim" aria-hidden="true"><i></i><b>${book.entries}</b><i></i></span>`);
    host.appendChild(el);
  });
}

function ledge(T) {
  const cv = document.querySelector("[data-ledge]");
  if (!cv) return;
  const cols = Math.ceil(cv.parentElement.clientWidth / T.cell) + 1;
  const g = grid(cols, T.ledgeRows);
  T.ledge(g, cols);
  paint(cv, g, T.cell);
}

function placeholder(T) {
  const cv = document.querySelector("[data-portrait]");
  if (!cv) return;
  const n = 30, g = grid(n, n);
  rect(g, 0, 0, n, n, T.frame);
  rect(g, 1, 1, n - 2, n - 2, T.frameIn);
  stamp(g, ICONS.person, 7, 7, { o: T.frame, a: T.frameMark, b: T.frameMark, h: T.frameIn }, 1);
  paint(cv, g, T.cell);
}

window.addEventListener("DOMContentLoaded", async () => {
  await document.fonts.ready;
  const T = THEME();
  shelfRow(T);
  ledge(T);
  placeholder(T);
  if (window.EXTRA) window.EXTRA(T);
});
