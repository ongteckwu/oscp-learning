#!/usr/bin/env python3
"""Compile the multi-file OSCP course into ONE self-contained HTML artifact.

Output: oscp-course.html — no external dependencies (only outbound https links).
This single file IS a valid Claude artifact: paste/upload it into claude.ai, ask
Claude to render it as an artifact, then Publish to get a live shareable link.

Re-run after adding lessons/references:  python3 build-artifact.py
"""

import re
import pathlib

ROOT = pathlib.Path(__file__).parent
OUT = ROOT / "oscp-course.html"

# (file, section-id, nav-label) — order defines the document + the table of contents
PAGES = [
    ("index.html", "home", "Contents"),
    ("lessons/0001-the-oscp-attack-chain.html", "lesson-1", "01 · Attack Chain"),
    (
        "lessons/0002-the-deliberate-practice-loop.html",
        "lesson-2",
        "02 · Practice Loop",
    ),
    ("lessons/0003-service-enumeration.html", "lesson-3", "03 · Enumeration"),
    ("lessons/0004-attacking-the-web-service.html", "lesson-4", "04 · Web Service"),
    (
        "lessons/0005-exploiting-the-web-foothold.html",
        "lesson-5",
        "05 · Web Exploitation",
    ),
    ("lessons/0006-linux-privilege-escalation.html", "lesson-6", "06 · Linux Privesc"),
    (
        "lessons/0007-windows-privilege-escalation.html",
        "lesson-7",
        "07 · Windows Privesc",
    ),
    (
        "lessons/0008-password-attacks-and-credential-reuse.html",
        "lesson-8",
        "08 · Password Attacks",
    ),
    ("lessons/0009-footholds-beyond-the-web.html", "lesson-9", "09 · Footholds"),
    (
        "lessons/0010-active-directory-enumeration.html",
        "lesson-10",
        "10 · AD Enumeration",
    ),
    (
        "lessons/0011-active-directory-authentication-attacks.html",
        "lesson-11",
        "11 · AD Auth Attacks",
    ),
    (
        "lessons/0012-active-directory-lateral-movement.html",
        "lesson-12",
        "12 · AD → Domain Admin",
    ),
    ("lessons/0013-pivoting-and-tunneling.html", "lesson-13", "13 · Pivoting"),
    ("lessons/0014-post-exploitation-looting.html", "lesson-14", "14 · Looting"),
    ("lessons/0015-writing-the-report.html", "lesson-15", "15 · The Report"),
    ("lessons/0016-exam-strategy.html", "lesson-16", "16 · Exam Strategy"),
    ("lessons/0017-mock-exam.html", "lesson-17", "17 · Mock Exam"),
    ("reference/glossary.html", "glossary", "Glossary"),
    ("reference/exam-format.html", "exam-format", "Exam Format"),
    ("reference/practice-boxes.html", "practice-boxes", "Practice Boxes"),
    ("reference/enumeration-cheatsheet.html", "enum-cheatsheet", "Enum Cheatsheet"),
    ("reference/web-exploitation.html", "web-exploitation", "Web Exploitation"),
    ("reference/linux-privesc.html", "linux-privesc", "Linux Privesc"),
    ("reference/windows-privesc.html", "windows-privesc", "Windows Privesc"),
    ("reference/password-attacks.html", "password-attacks", "Password Attacks"),
    ("reference/active-directory.html", "active-directory", "Active Directory"),
    ("reference/pivoting.html", "pivoting", "Pivoting"),
    ("reference/report-writing.html", "report-writing", "Report Writing"),
    ("reference/links.html", "links", "Useful Links"),
]

# internal link basename -> in-page anchor, derived from PAGES (single source of truth).
# External https links are left untouched.
LINKMAP = {pathlib.Path(f).name: f"#{sec}" for f, sec, _ in PAGES}

# One alternation over every known basename, longest first so a basename that is a
# substring of another can't match the wrong page. A trailing #fragment is preserved
# (deep links like practice-boxes.html#pb-06 survive in the single-file artifact);
# citation anchors sN are uniquified per section, so #sN is remapped to #<sec>-sN.
_CROSS_LINK = re.compile(
    r'href="(?!http)[^"]*?(?P<base>'
    + "|".join(re.escape(b) for b in sorted(LINKMAP, key=len, reverse=True))
    + r')(?:#(?P<frag>[^"]*))?"'
)


def rewrite_cross_link(m):
    sec = LINKMAP[m.group("base")][1:]  # "#home" -> "home"
    frag = m.group("frag")
    if not frag:
        return f'href="#{sec}"'
    if re.fullmatch(r"s\d+", frag):  # citation anchor was uniquified to <sec>-sN
        return f'href="#{sec}-{frag}"'
    return f'href="#{frag}"'


def body_of(html, path):
    m = re.search(r"<body[^>]*>(.*)</body>", html, re.S)
    if not m:
        raise ValueError(f"{path}: no <body>…</body> found")
    return m.group(1)


def process(path, sec):
    html = (ROOT / path).read_text(encoding="utf-8")
    b = body_of(html, path)
    # strip per-page chrome (we provide one global nav + no per-section footers)
    b = re.sub(r'<nav class="crumbs">.*?</nav>', "", b, flags=re.S)
    b = re.sub(r"<footer>.*?</footer>", "", b, flags=re.S)
    b = re.sub(r'<script src="\.\./assets/quiz\.js"></script>', "", b)
    # the live sticky nav is injected by site-nav.js; the bundle has its own
    b = re.sub(r'<script src="[^"]*assets/site-nav\.js"></script>', "", b)
    # make quiz container ids + render calls unique per section
    b = b.replace('id="quiz"', f'id="quiz-{sec}"')
    b = b.replace("renderQuiz('quiz'", f"renderQuiz('quiz-{sec}'")
    # make citation anchors unique per section (s1, s2… collide across lessons).
    # discover the ids actually present so any source count works, not just s1..s4.
    for n in sorted(set(re.findall(r'id="s(\d+)"', b)), key=int):
        b = b.replace(f'id="s{n}"', f'id="{sec}-s{n}"')
        b = b.replace(f'href="#s{n}"', f'href="#{sec}-s{n}"')
    # rewrite relative cross-doc links to in-page anchors; never touch http(s) URLs
    b = _CROSS_LINK.sub(rewrite_cross_link, b)
    # open external links in a new tab, regardless of attribute order
    b = re.sub(
        r'<a (?=[^>]*\bhref="https?:)(?![^>]*\btarget=)',
        '<a target="_blank" rel="noopener" ',
        b,
    )
    return f'<section id="{sec}" class="page">\n{b}\n</section>'


css = (ROOT / "assets/lesson.css").read_text(encoding="utf-8")
# We inline quiz.js raw into a <script> block below. The HTML parser doesn't
# understand JS comments/strings, so a literal "</script" inside the file (it has
# one in its usage docs) would close the block early and dump the rest as page
# text. Escaping the slash neutralizes the match without changing the JS.
quizjs = (ROOT / "assets/quiz.js").read_text(encoding="utf-8").replace("</script", "<\\/script")

# .toc styling lives in assets/lesson.css (shared with index.html). Only the
# bundle-only section framing lives here.
extra_css = """
section.page{scroll-margin-top:3.6rem;}
section.page + section.page{border-top:1px solid var(--rule);margin-top:2.8rem;padding-top:1.4rem;}
@media print{section.page{break-before:page;}}
"""

toc = (
    '<nav class="toc">'
    + "".join(
        f'<a class="{"home" if sec == "home" else ""}" href="#{sec}">{label}</a>'
        for _, sec, label in PAGES
    )
    + "</nav>"
)

sections = "\n\n".join(process(p, sec) for p, sec, _ in PAGES)

OUT.write_text(
    f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>OSCP — A Hands-On Course</title>
<style>
{css}
{extra_css}
</style>
</head>
<body>
<script>
{quizjs}
</script>
{toc}
{sections}
</body>
</html>
""",
    encoding="utf-8",
)

print(f"Wrote {OUT.name} ({OUT.stat().st_size:,} bytes) — {len(PAGES)} sections")
