"""Draws Liam's pixel avatar (32 x 32 cells) and writes it to src/data/avatar.json.

The avatar is drawn from shapes rather than downsampled, so it reads as pixel art; proportions
and colours follow Liam's photo (long brown hair parted to one side, dark rectangular glasses,
slight smile, dark shirt). The photo itself is not stored in the repository.
Usage: python3 scripts/make-avatar.py [preview.png]
"""
import json, sys

N = 32
PAL = {
    "b": "#E1EAD3",  # background: the pad's pale green
    "H": "#3C2A24",  # hair, dark
    "h": "#6B4A3A",  # hair
    "j": "#94725C",  # hair, highlight
    "s": "#E6B49A",  # skin, lit
    "S": "#D49F84",  # skin
    "t": "#B07E65",  # skin, shadow
    "g": "#1F1B1B",  # glasses frame
    "l": "#F2D2C0",  # lens glare
    "e": "#3A2C26",  # eye
    "w": "#F3E6DC",  # eye white
    "m": "#A8604F",  # lips
    "k": "#26221F",  # shirt
    "K": "#3A3430",  # shirt, light edge
}
g = [["b"] * N for _ in range(N)]

def put(x, y, c):
    if 0 <= x < N and 0 <= y < N: g[y][x] = c
def ellipse(cx, cy, rx, ry, c, rows=None):
    for y in range(N):
        for x in range(N):
            if ((x + .5 - cx) / rx) ** 2 + ((y + .5 - cy) / ry) ** 2 <= 1 and (rows is None or rows[0] <= y <= rows[1]):
                g[y][x] = c
def rect(x0, y0, x1, y1, c):
    for y in range(y0, y1 + 1):
        for x in range(x0, x1 + 1): put(x, y, c)

# Shirt and shoulders
ellipse(16, 35, 15, 9, "k")
for y in range(27, 32): put(2 + (31 - y) // 2, y, "K"); put(29 - (31 - y) // 2, y, "K")
# Long hair: a full mass behind the head, falling past the shoulders on both sides
ellipse(16, 12, 12.5, 10.5, "h")
rect(3, 11, 8, 29, "h"); rect(23, 11, 28, 29, "h")
for y in range(22, 30): put(2, y, "h"); put(29, y, "h")
rect(3, 15, 4, 29, "H"); rect(27, 15, 28, 29, "H")
for (x, y) in [(9, 3), (8, 4), (7, 5), (6, 7), (5, 9), (5, 11), (4, 13), (5, 16), (4, 19), (5, 22), (6, 25)]:
    put(x, y, "j")                                     # light strand down the left
for (x, y) in [(20, 3), (22, 4), (24, 6), (25, 8), (26, 11), (26, 14), (25, 18)]:
    put(x, y, "H")                                     # shadowed fall on the right
# Neck in shadow under the chin, then the shirt collar over it
rect(11, 22, 20, 27, "t")
rect(9, 24, 10, 27, "h"); rect(21, 24, 22, 27, "h")
ellipse(16, 35, 15, 9, "k", rows=(28, 31))
# Face: round and full, forehead showing under hair swept back from a side part
ellipse(16, 16.5, 8, 9.6, "S", rows=(5, 26))
ellipse(15.5, 13.5, 6.4, 7, "s", rows=(5, 19))
for y in range(19, 26): put(8 + (y - 19) // 2, y, "t"); put(23 - (y - 19) // 2, y, "t")
rect(12, 25, 19, 25, "t"); rect(13, 26, 18, 26, "t")   # jaw shadow, a little stubble
for x in range(8, 25):                                  # hairline: high, dipping at the temples
    top = 5 if 12 <= x <= 20 else 6 if 10 <= x <= 22 else 8
    for y in range(3, top): put(x, y, "h")
put(14, 4, "j"); put(13, 4, "j"); put(15, 3, "j")      # the part
# Eyebrows
rect(10, 11, 14, 11, "H"); rect(17, 11, 21, 11, "H")
# Glasses: wide rectangular rims, a bridge, and arms running back into the hair
for (x0, x1) in [(9, 15), (16, 22)]:
    rect(x0, 13, x1, 13, "g"); rect(x0, 17, x1, 17, "g")
    rect(x0, 13, x0, 17, "g"); rect(x1, 13, x1, 17, "g")
put(8, 14, "g"); put(23, 14, "g")
for (x, y) in [(10, 14), (17, 14)]: put(x, y, "l")
# Eyes
for x0 in (11, 18):
    put(x0, 15, "w"); put(x0 + 1, 15, "e"); put(x0 + 2, 15, "w"); put(x0 + 1, 16, "t")
# Nose
put(15, 18, "t"); put(15, 19, "t"); put(16, 20, "t")
# Mouth: a slight, closed smile
rect(14, 22, 17, 22, "m"); put(13, 21, "m"); put(18, 22, "t")

# Fill any background gaps left between the hair and the face
for y in range(10, 30):
    for x in range(3, 29):
        if g[y][x] == "b": g[y][x] = "h"

rows = ["".join(r) for r in g]
json.dump({"palette": PAL, "rows": rows}, open("src/data/avatar.json", "w"), indent=1)
print("\n".join(rows))
if len(sys.argv) > 1:
    from PIL import Image
    im = Image.new("RGB", (N, N))
    im.putdata([tuple(int(PAL[c][i:i + 2], 16) for i in (1, 3, 5)) for r in rows for c in r])
    im.resize((N * 8, N * 8), Image.Resampling.NEAREST).save(sys.argv[1])
