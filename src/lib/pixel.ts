// Pixel-art renderer for the books, ledge, spread frame and portrait.
// Ported from the approved mockup renderer (.impeccable/mocks/flow/src/mock.js), but it draws
// static SVG at build time instead of canvas at runtime, so the art shows with JavaScript off.
// Grid law: every pixel is one 8px cell; nothing sits off the grid.

export const CELL = 8;
type Grid = (string | null)[][];

const ICONS: Record<string, string[]> = {
  // 16x16. o = outline, a = main, b = secondary, h = highlight, . = empty
  mail: [
    "................", "................", "................", "oooooooooooooooo",
    "oaaaaaaaaaaaaaao", "obaaaaaaaaaaaabo", "oabaaaaaaaaaabao", "oaabaaaaaaaabaao",
    "oaaabbaaaabbaaao", "oaaaaabbbbaaaaao", "oaaaaaaaaaaaaaao", "oaahhhhhhaaaaaao",
    "oaaaaaaaaaaaaaao", "oooooooooooooooo", "................", "................",
  ],
  box: [
    "................", "................", "....oooooooo....", "....ohhhhhho....",
    "....oh....ho....", "....oh.oo.ho....", "....oh..o.ho....", "....ohhhhhho....",
    "oooooooooooooooo", "oaabaabaabaabaao", "oaabaabaabaabaao", "oaabaabaabaabaao",
    "oaabaabaabaabaao", "oooooooooooooooo", ".oo..........oo.", "................",
  ],
  park: [
    "................", "..oooooooooooo..", "..obbbbbbbbbbo..", "..obhhhhhhbbbo..",
    "..obhbbbbbhbbo..", "..obhbbbbbhbbo..", "..obhhhhhhbbbo..", "..obhbbbbbbbbo..",
    "..obhbbbbbbbbo..", "..obbbbbbbbbbo..", "..oooooooooooo..", ".......oo.......",
    ".......oo.......", ".......oo.......", ".....oooooo.....", "................",
  ],
  bulb: [
    "................", ".....oooooo.....", "....ohhaaaaao...", "...ohaaaaaaaao..",
    "...ohaaaaaaaao..", "...oaaaaaaaaao..", "...oaaaaaaaaao..", "....oaaaaaaao...",
    ".....oaaaaao....", "......oaaao.....", "......obbbo.....", "......ooooo.....",
    "......obbbo.....", "......ooooo.....", ".......ooo......", "................",
  ],
  pencil: [
    "................", "............ooo.", "...........obbo.", "..........obbbo.",
    ".........oaaoo..", "........oaaao...", ".......oaaao....", "......oaaao.....",
    ".....oaaao......", "....oaaao.......", "...ohaao........", "...ohhao........",
    "..ooooo.........", "..oo............", "................", "................",
  ],
  person: [
    "................", "......oooo......", ".....ohhaao.....", "....ohaaaaao....",
    "....oaaaaaao....", "....oaaaaaao....", ".....oaaaao.....", "......oooo......",
    "....oooooooo....", "...obbbbbbbbo...", "..obbbbbbbbbbo..", "..obbbbbbbbbbo..",
    "..obbbbbbbbbbo..", "..oooooooooooo..", "................", "................",
  ],
};

export function shade(hex: string, amt: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  const f = (c: number) => Math.max(0, Math.min(255, Math.round(amt < 0 ? c * (1 + amt) : c + (255 - c) * amt)));
  return "#" + [f(r), f(g), f(b)].map((c) => c.toString(16).padStart(2, "0")).join("");
}

const grid = (cols: number, rows: number): Grid => Array.from({ length: rows }, () => Array(cols).fill(null));
function rect(g: Grid, x: number, y: number, w: number, h: number, c: string) {
  for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) if (g[j] && i >= 0 && i < g[0].length) g[j][i] = c;
}
function stamp(g: Grid, icon: string[], ox: number, oy: number, pal: Record<string, string>) {
  icon.forEach((row, y) => [...row].forEach((ch, x) => { if (ch !== ".") rect(g, ox + x, oy + y, 1, 1, pal[ch]); }));
}

/** Grid to SVG markup: one rect per horizontal run of a colour, crisp edges, decorative. */
export function svg(g: Grid, cls = ""): string {
  const rows = g.length, cols = g[0].length;
  let out = "";
  for (let y = 0; y < rows; y++) {
    let x = 0;
    while (x < cols) {
      const c = g[y][x];
      if (!c) { x++; continue; }
      let run = 1;
      while (x + run < cols && g[y][x + run] === c) run++;
      out += `<rect x="${x}" y="${y}" width="${run}" height="1" fill="${c}"/>`;
      x += run;
    }
  }
  return `<svg class="${cls}" viewBox="0 0 ${cols} ${rows}" width="${cols * CELL}" height="${rows * CELL}" shape-rendering="crispEdges" aria-hidden="true" focusable="false">${out}</svg>`;
}

export interface Cloth {
  cloth: string; band: string; panel: string; iconA: string; iconB: string; icon: string;
  W?: number; H?: number;
}
const T = { spineW: 11, spineH: 44, coverW: 30, pages: "#F7F6EE", inkPixel: "#1F2A1D" };

export function spine(book: Cloth) {
  const W = book.W ?? T.spineW, H = book.H ?? T.spineH;
  const g = grid(W, H), c = book.cloth;
  rect(g, 0, 0, W, H, c);
  rect(g, 0, 0, 1, H, shade(c, 0.22));
  rect(g, W - 1, 0, 1, H, shade(c, -0.35));
  rect(g, 1, 0, W - 2, 1, shade(c, -0.25));
  rect(g, 1, 3, W - 2, 1, book.band);
  rect(g, 1, 5, W - 2, 1, book.band);
  rect(g, 1, H - 6, W - 2, 1, book.band);
  rect(g, 1, H - 4, W - 2, 1, book.band);
  for (let y = 7; y < H - 7; y++) for (let x = 1; x < W - 1; x++) if ((x * 7 + y * 3) % 11 === 0) g[y][x] = shade(c, 0.08);
  return svg(g, "px spine-art");
}

export function cover(book: Cloth) {
  const W = T.coverW, H = book.H ?? T.spineH, P = 2;
  const g = grid(W + P, H), c = book.cloth;
  rect(g, 0, 0, W, H, c);
  rect(g, 0, 0, 2, H, shade(c, -0.25));
  rect(g, 2, 0, 1, H, shade(c, 0.18));
  rect(g, W - 1, 0, 1, H, shade(c, -0.3));
  rect(g, 0, H - 1, W, 1, shade(c, -0.3));
  rect(g, W, 1, P, H - 1, T.pages);
  for (let y = 2; y < H; y += 2) g[y][W + 1] = shade(T.pages, -0.12);
  for (let y = 7; y < H - 2; y++) for (let x = 3; x < W - 1; x++) if ((x * 7 + y * 3) % 11 === 0) g[y][x] = shade(c, 0.08);
  const panelW = 20, panelX = Math.floor((W - panelW) / 2) + 1, panelY = H - 25;
  rect(g, panelX, panelY, panelW, 20, book.panel);
  stamp(g, ICONS[book.icon], panelX + 2, panelY + 2, { o: T.inkPixel, a: book.iconA, b: book.iconB, h: "#FFFFFF" });
  return svg(g, "px cover-art");
}

/** Open-book frame grid: board in the book's cloth, two page blocks, gutter shading. */
function spreadGrid(board: string, H: number): Grid {
  const PW = 64, B = 2, G = 2, W = B + PW + G + PW + B;
  const g = grid(W, H + 3), stock = T.pages;
  rect(g, 0, 0, W, H + 1, board);
  rect(g, 0, H + 1, W, 1, shade(board, -0.3));
  for (let k = 0; k < 2; k++) {
    rect(g, B, H - 2 + k, PW, 1, k ? "#E2DECF" : "#ECE9DC");
    rect(g, B + PW + G, H - 2 + k, PW, 1, k ? "#E2DECF" : "#ECE9DC");
  }
  rect(g, B, B, PW, H - 4, stock);
  rect(g, B + PW + G, B, PW, H - 4, stock);
  ["#E9E6D8", "#DEDACA", "#CFCAB6"].forEach((c, i) => {
    rect(g, B + PW - 1 - (2 - i), B, 1, H - 4, c);
    rect(g, B + PW + G + (2 - i), B, 1, H - 4, c);
  });
  rect(g, B + PW, 0, G, H + 1, shade(board, -0.35));
  return g;
}

export function spreadFrame(board: string, H: number) {
  return svg(spreadGrid(board, H), "px spread-art");
}

/** One half of the open spread (67 cells wide, H + 2 rows), pixel-identical to spreadFrame. */
export function spreadHalf(board: string, H: number, side: "left" | "right") {
  const g = spreadGrid(board, H).slice(0, H + 2).map((r) => (side === "left" ? r.slice(0, 67) : r.slice(67)));
  return svg(g, "px");
}

/** The front cover at open-book size (67 cells by H + 2 rows): the shelf cover's design,
 *  with its page block on the right and the icon panel at double size. */
export function bigCover(book: Cloth, Hc: number) {
  const Wc = 67, P = 2, W = Wc - P;
  const g = grid(Wc, Hc), c = book.cloth;
  rect(g, 0, 0, W, Hc, c);
  rect(g, 0, 0, 2, Hc, shade(c, -0.25));
  rect(g, 2, 0, 1, Hc, shade(c, 0.18));
  rect(g, W - 1, 0, 1, Hc, shade(c, -0.3));
  rect(g, 0, Hc - 1, W, 1, shade(c, -0.3));
  rect(g, W, 1, P, Hc - 1, T.pages);
  for (let y = 2; y < Hc; y += 2) g[y][W + 1] = shade(T.pages, -0.12);
  for (let y = 7; y < Hc - 2; y++) for (let x = 3; x < W - 1; x++) if ((x * 7 + y * 3) % 11 === 0) g[y][x] = shade(c, 0.08);
  const panel = 36, px = Math.floor((W - panel) / 2) + 1, py = Hc - panel - 8;
  rect(g, px, py, panel, panel, book.panel);
  ICONS[book.icon].forEach((row, y) => [...row].forEach((ch, x) => {
    if (ch !== ".") rect(g, px + 2 + x * 2, py + 2 + y * 2, 2, 2, ({ o: T.inkPixel, a: book.iconA, b: book.iconB, h: "#FFFFFF" } as Record<string, string>)[ch]);
  }));
  return svg(g, "px");
}

/** Placeholder portrait until Liam supplies a photo or pixel avatar. */
export function portrait() {
  const n = 30, g = grid(n, n);
  rect(g, 0, 0, n, n, "#1F2A1D");
  rect(g, 1, 1, n - 2, n - 2, "#E1EAD3");
  stamp(g, ICONS.person, 7, 7, { o: "#1F2A1D", a: "#9DB585", b: "#9DB585", h: "#E1EAD3" });
  return svg(g, "px portrait-art");
}

/** One 5-cell repeat of the shelf ledge, used as a repeating background. */
export function ledgeTile() {
  const g = grid(5, 3);
  for (let x = 0; x < 5; x++) { g[0][x] = "#1F2A1D"; g[1][x] = x === 0 ? "#46553F" : "#7C8F6E"; g[2][x] = "#1F2A1D"; }
  const inner = svg(g).replace(/ class="[^"]*"| aria-hidden="true"| focusable="false"/g, "").replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" ');
  return `url("data:image/svg+xml,${encodeURIComponent(inner)}")`;
}
