"""Publishes the resume and cover letter without the phone number.

The number is removed from each page's content stream (not covered with a box), the
separator after it goes with it, and the contact line is re-centred. Fails loudly if the
expected text is not found or if any digit run of a phone number survives.
Usage: python3 scripts/redact-resume.py <in.pdf> <out.pdf>
"""
import re, sys, zlib
from pypdf import PdfReader, PdfWriter
from pypdf.generic import NameObject, StreamObject, ContentStream

src, out = sys.argv[1], sys.argv[2]
r = PdfReader(src)
w = PdfWriter()
# "<x> 0 Td [(phone)]TJ /Fsep size Tf <dx> 0 Td [(j)]TJ /Ftext size Tf <x2> 0 Td"  ->  "<x> 0 Td"
pat = re.compile(rb"(-?[\d.]+) 0 Td \[\(\\050\d{3}\\051\)-?\d+\(\d{3}-\d{4}\)\]TJ/F\d+ [\d.]+ Tf (-?[\d.]+) 0 Td \[\(j\)\]TJ(/F\d+ [\d.]+ Tf) (-?[\d.]+) 0 Td")
lead = re.compile(rb"(-?[\d.]+) (-?[\d.]+) Td (\[\(Edin\))")
for page in r.pages:
    data = page.get_contents().get_data()
    m = pat.search(data)
    if not m:
        sys.exit("phone pattern not found on a page; refusing to publish")
    removed = float(m.group(2)) + float(m.group(4))       # width the line loses
    data = data[:m.start()] + m.group(1) + b" 0 Td" + data[m.end():]
    data = data.replace(m.group(3) + b" " + m.group(1) + b" 0 Td", m.group(3) + b" " + m.group(1) + b" 0 Td", 1)
    lm = lead.search(data)
    data = data[:lm.start()] + f"{float(lm.group(1)) + removed:.3f}".encode() + b" " + lm.group(2) + b" Td " + lm.group(3) + data[lm.end():]
    stream = StreamObject()
    stream.set_data(data)
    page[NameObject("/Contents")] = w._add_object(stream)
    w.add_page(page)
w.add_metadata({"/Title": "Resume and Cover Letter, Liam Reeves (phone number removed)"})
with open(out, "wb") as f:
    w.write(f)

check = PdfReader(out)
text = "".join(p.extract_text() for p in check.pages)
if re.search(r"\d{3}\)?[ .-]?\d{3}[ .-]\d{4}", text):
    sys.exit("a phone-number pattern survived")
raw = open(out, "rb").read()
for chunk in re.findall(rb"stream\r?\n(.*?)endstream", raw, re.S):
    try:
        if re.search(rb"\\050\d{3}\\051", zlib.decompress(chunk)):
            sys.exit("phone digits still in a stream")
    except zlib.error:
        pass
print("ok:", out)
