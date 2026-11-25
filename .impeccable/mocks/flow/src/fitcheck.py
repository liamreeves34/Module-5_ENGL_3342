# Renders the approved open-book page with each module's reflection on the right page.
import pathlib, subprocess, sys
here = pathlib.Path(__file__).parent; drafts = here.parents[3] / "content" / "drafts"
import build3, build2  # noqa
base = (here / "open.html").read_text()
m2 = "".join(f"<p>{p}</p>" for p in (drafts / "module-2-reflection.txt").read_text().strip().split("\n") if p)
for n in (1, 2, 3, 4):
    r = "".join(f"<p>{p}</p>" for p in (drafts / f"module-{n}-reflection.txt").read_text().strip().split("\n") if p)
    (here / f"fit-m{n}.html").write_text(base.replace(m2, r))
