# Bug log
One line per notable bug: date, what broke, cause, fix, commit. Newest at the bottom.
Older bugs: `BREAK_REPORT_2026-11-12.md` and `STRESS_TEST_LOG.md`.

- 12 Nov 2026: Discord "who to ping" picker had no name for screen readers. Cause: missing label. Fix: added `aria-label`; new axe test catches it. [8904e69](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/8904e69)
