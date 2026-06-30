# CLAUDE.md

Public repo

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A self-paced **OSCP+ course** delivered as a static, dependency-free website: hand-authored
HTML/CSS content plus three small client-side JS widgets. There is no server, no framework, no
package manifest, and no test suite. The only executable code is `build-artifact.py` (a
regex-based HTML compiler) and the `assets/*.js` widgets.

The course ships in **two forms from the same source**, and every change must keep both working:

1. **Multi-file site** — `index.html` + `lessons/*.html` + `reference/*.html` + `assets/`. This is
   what gets deployed (GitHub Pages via `.nojekyll`; Vercel via `.vercelignore`). Open `index.html`
   in a browser to preview.
2. **Single-file artifact** — `oscp-course.html`, produced by `build-artifact.py`. It inlines all
   CSS/JS and concatenates every page into one self-contained file with no external dependencies
   (only outbound `https` links). This is the shareable **Claude artifact** (paste into claude.ai →
   render → Publish). It is the shippable deliverable — regenerate it after any content/script change.

## Commands

```bash
python3 build-artifact.py        # compile multi-file site → oscp-course.html (run after ANY change)
ruff check build-artifact.py     # lint the only Python file (no ruff config → defaults; .ruff_cache present)
```

There are no tests. The regression check is a **byte-identical rebuild** of `oscp-course.html` plus
the grep invariants in the quality gate below — a refactor that leaves the artifact byte-identical is
proven behaviour-preserving.

A global format-on-save hook reformats `build-artifact.py` with ruff and normalizes some HTML
entities on write (e.g. `&amp;` → bare `&`). **Re-`Read` any file immediately before `Edit`** — it
may have been reformatted since you last read it.

## Architecture

**`PAGES` in `build-artifact.py` is the single source of truth** for document order and section ids.
`LINKMAP` (basename → in-page anchor) is *derived* from it — never hand-maintain it. Adding/removing/
reordering a page means editing `PAGES`, and nothing else for ordering.

The compiler munges HTML by regex + `str.replace`, so it depends on **structural invariants** in the
content pages. For each page it: extracts `<body>…</body>`; strips per-page chrome (`<nav class="crumbs">`,
`<footer>`, and the `quiz.js` / `site-nav.js` / `practice-boxes*.js` script tags); makes ids unique per
section (`id="quiz"`→`id="quiz-<sec>"`, `renderQuiz('quiz'`→`renderQuiz('quiz-<sec>'`, citation anchors
`id="sN"`/`href="#sN"`→`<sec>-sN`); rewrites relative cross-doc links to in-page anchors (external links
untouched); and hardens external `<a>` with `target="_blank" rel="noopener"`. It then inlines one shared
copy each of `lesson.css`, `quiz.js`, `practice-boxes-data.js`, `practice-boxes.js`, plus a Python-rendered
sticky TOC.

**Navigation has two parallel implementations** because the two output forms link differently (separate
files vs. in-page anchors), and they are kept in sync by hand:
- `assets/site-nav.js` — a `PAGES` list injected client-side as the sticky TOC on the multi-file site.
- `build-artifact.py` `PAGES` — renders the equivalent TOC for the bundle (and strips the `site-nav.js` tag).

When you add/rename/reorder a page, update **both** `PAGES` lists.

**Shared widgets** (`assets/`), each a single-source renderer used across all pages:
- `quiz.js` — declarative retrieval-practice quiz. A page has `<div class="quiz" id="quiz"></div>` and a
  `renderQuiz('quiz', [...])` call; options are shuffled at render, so `answer` is the index into the
  authored `options` array. Container id must be exactly `id="quiz"` for the compiler to uniquify it.
- `practice-boxes-data.js` — the single source of truth for the practice-box map (`PB_BOXES` machine facts +
  `PB_LESSONS` per-lesson context). One machine = one home lesson + optional `reuse:{from:N}` cards.
- `practice-boxes.js` — renders `<div data-practice-boxes data-lesson="N">` in lessons and on the reference
  map. Checkmarks persist in `localStorage` (this browser only), keyed by box slug.

## Authoring conventions (invariants the compiler relies on)

When creating or editing a lesson/reference page, preserve these — breaking one silently corrupts the
single-file artifact:

- Every page links `assets/lesson.css` and carries a `<nav class="crumbs">` that includes a `Links` item
  pointing to `reference/links.html` (`reference/links.html` itself is the one exception).
- `<footer>` has **no attributes**; external `<a>` put `href` first; quiz containers use exactly `id="quiz"`;
  `<body>…</body>` is present.
- Each lesson `<footer>` carries references on one side and `Next → Lesson N+1` on the other. **When adding
  lesson N, backfill a `Next →` link into lesson N-1's footer** (the newest lesson has no Next yet).
- New external links go in **both** `reference/links.html` (the clickable board) **and** `RESOURCES.md` —
  adding to only one is the most common omission.
- New pages must be wired into both `PAGES` lists (see Architecture), then rebuild.

## Quality gate (run after content/script changes)

```bash
ruff check build-artifact.py
python3 build-artifact.py
grep -oE 'id="[^"]+"' oscp-course.html | sort | uniq -d     # MUST be empty (no id collisions)
grep -noE 'href="(\./|\.\./)[^"]+"' oscp-course.html        # MUST be empty (no leftover relative links)
grep -c 'class="crumbs"' oscp-course.html                   # MUST be 0 (chrome stripped)
grep -c '<footer>' oscp-course.html                         # MUST be 0
grep -coE '<a [^>]*href="https?:' oscp-course.html          # these two counts MUST be equal
grep -coE '<a target="_blank" rel="noopener" href="https?:' oscp-course.html
```

A failing invariant is a real bug — the shareable artifact is broken or will silently break as content grows.
The project-specific review skill `.claude/skills/code-review-oscp/` documents these in depth and delegates
generic dimensions to `code-review-small`.

## Teaching brief & local-only files

These files are **gitignored / not deployed** (`.gitignore`, `.vercelignore`) but are the context for
*authoring* the course — read them before designing or editing lessons:

- `MISSION.md` — the goal and the learner's profile (senior SWE, strong on CVE triage, new to hands-on
  exploitation → skip fundamentals, focus on the attacker workflow).
- `NOTES.md` — how to teach this learner (attempt-first deliberate practice, spaced retrieval, the
  workspace conventions above) — **read before designing any lesson**.
- `RESOURCES.md` — the canonical external-resource list mirrored by `reference/links.html`.
- `learning-records/` — the learner's personal progress/box write-ups.

Content prose accuracy (OSCP facts, lesson pedagogy) is a teaching concern, not a code concern.
