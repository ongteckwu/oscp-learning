# OSCP — A Hands-On Course

A self-paced course taking a working software engineer from "knows vulns" to
"owns boxes" — grounded in one target: passing the **OSCP+**. Seventeen lessons
plus reference cheat-sheets, end to end, from the attack chain to a timed mock exam.

## Read it

- **Online:** open `index.html` (Module 1 starts there; lessons link in order).
- **One file, offline:** `oscp-course.html` — the entire course bundled into a
  single self-contained HTML file (no dependencies). Open it in any browser.

## Structure

- `index.html` — course contents / entry point
- `lessons/` — the seventeen lessons in order
- `reference/` — glossary, exam format, and per-topic cheat-sheets
- `assets/` — shared stylesheet and the quiz widget
- `build-artifact.py` — compiles the multi-file site into `oscp-course.html`
  (`python3 build-artifact.py`)
