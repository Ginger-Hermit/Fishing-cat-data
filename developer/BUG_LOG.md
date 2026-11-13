# Bug log
One line per notable bug: date, what broke, cause, fix, commit. Newest at the bottom.
Older bugs: `BREAK_TEST_PLAN.md` (appendix) and `STRESS_TEST_LOG.md`.

- 12 Nov 2026: Discord "who to ping" picker had no name for screen readers. Cause: missing label. Fix: added `aria-label`; new axe test catches it. [8904e69](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/8904e69)
- 12 Nov 2026: a cut-off AI reply lost the whole bill run. Cause: reply parsed only as complete JSON. Fix: `closeCut` keeps every complete charge. [089a57c](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/089a57c)
- 12 Nov 2026: the robot break test never actually ran on GitHub. Cause: `python3 -I` hid the installed Playwright. Fix: run it without `-I` in CI. [4531cc6](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/4531cc6)
- 12 Nov 2026: saved last-sheet history used without checking; negative points became text in the CSV fallback. Cause: no shape check (okHist), toCsv escaped numbers. Fix: okHist + numbers left as numbers. [7f62508](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/7f62508add099deeddcec8b9400d67917ce06375)
- 12 Nov 2026: points like "1.234.567" or "1 234" came out blank. Cause: parsePoints only knew comma thousands marks. Fix: dot, space and apostrophe groups of three read as thousands. [88454da](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/88454da)
- 2026-11-13: Video missed new clan members (3 of 8+ dropped). Cause: tiny 96x54 compare called a scrolled clan panel the same picture, and 4 looks a second skipped fast scrolls. Fix: 192x108 compare, stricter threshold, 8 looks a second.
- 2026-11-13: Video missed new clan members. Cause: 96x54 compare called a scrolled clan panel the same picture; 4 looks a second skipped fast scrolls. Fix: 192x108 compare, stricter threshold, 8 looks a second.
- 2026-11-13: Deathgold1198 became Deathgoldl198 in every tab. Cause: fixNames renamed the history to today's misread. Fix: today's row takes the earlier spelling.
- 12 Nov: clan video gave 5 of 11 members. Cause: Test read sent only the first still of the video. Fix: Test read sends all stills of a video.
- 12 Nov 2026: clan names misread (Deathgold1198 as Deathgoldl198, rakha_112233 as rakha..112233). Cause: prompt too loose. Fix: stricter username rule in buildPrompt. Commit 95d4423.
- 12 Nov 2026: correct new name (rakha_112233) replaced by the wrong one from the earlier sheet (rakha..112233). Cause: fixNames always kept the earlier spelling. Fix: keep the new one when the earlier is not a valid Roblox name. Commit 13811fc.
- 13 Nov 2026: GitHub Check was red for about 8 commits, so nothing went live. Cause: the Excel test copies named functions out of app.js and missed the new okName const. Fix: the test now copies that line too. Commit d68c3e7.
- 13 Nov 2026: Bills read 1 234,56 as 1. Cause: parseNum stopped at the space. Fix: join space-split digit groups.
- 13 Nov 2026: Bills left 1.234.567 blank. Cause: parseNum guessed dot = decimal. Fix: repeated 3-digit dot groups mean thousands.
- 13 Nov 2026: USD -12.50 read as +12.50. Cause: minus check stopped at the first space. Fix: look at all text before the number.
- 13 Nov 2026: 1'234.50 read as 1. Cause: apostrophe separator not known. Fix: treat it like a space.
- 13 Nov 2026: 1,5K read as 15000. Cause: commas always removed. Fix: comma + 1-2 digits + K/M/B/T is a decimal.
- 13 Nov 2026: +1,234 and 12,345 pts left blank. Cause: extras not stripped. Fix: drop them.
- 13 Nov 2026: p per kWh flagged as unknown unit. Cause: only / was understood. Fix: accept per.
- 13 Nov 2026: example post picture showed broken. Cause: drawn before the page finished starting (artUrl not ready). Fix: draw it a moment later. Commit cf01ecd.
- 13 Nov 2026: after the weekly reset everyone showed a big drop. Cause: compared with last week's total. Fix: earlier sheet from before the reset counts as 0 (weekBase).
- 13 Nov 2026: second run the same day compared with only 1 player. Cause: saved last sheet was the cut-down same-day baseline, not the full sheet. Fix: save the full sheet. (ad3af291fe8af8fe18ba61e95ae0eedbb5f7656d)
