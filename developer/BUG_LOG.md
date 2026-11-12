# Bug log
One line per notable bug: date, what broke, cause, fix, commit. Newest at the bottom.
Older bugs: `BREAK_REPORT_2026-11-12.md` and `STRESS_TEST_LOG.md`.

- 12 Nov 2026: Discord "who to ping" picker had no name for screen readers. Cause: missing label. Fix: added `aria-label`; new axe test catches it. [8904e69](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/8904e69)
- 12 Nov 2026: a cut-off AI reply lost the whole bill run. Cause: reply parsed only as complete JSON. Fix: `closeCut` keeps every complete charge. [089a57c](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/089a57c)
- 12 Nov 2026: the robot break test never actually ran on GitHub. Cause: `python3 -I` hid the installed Playwright. Fix: run it without `-I` in CI. [4531cc6](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/4531cc6)
- 12 Nov 2026: saved last-sheet history used without checking; negative points became text in the CSV fallback. Cause: no shape check (okHist), toCsv escaped numbers. Fix: okHist + numbers left as numbers. Commit: see CHANGELOG.
