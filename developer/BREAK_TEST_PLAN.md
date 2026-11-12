# Break-test plan (round 2): not run yet

Written 12 Nov 2026 for a later session. Goal: try to break Fishing Cat Data and find security flaws, using what the first round taught (see STRESS_TEST_LOG.md, SECURITY.md).

## Rules for the session (token-saving)
- Free tests first: everything below uses a pretend AI and a pretend Discord. No real AI calls, no real Discord posts, unless a step says so.
- Read this plan and STATUS.md only. Grep for exact spots. One script for all cases. One patch for all fixes.
- Stop and report after each round with counts: cases run, bugs found, fixed.
- Ginger approves anything that changes how the page looks.

## What round 1 taught (use it)
- Bugs hide in "wrong sheet" and "confusing message", not in big security holes.
- The cheap method works: fake `fetch`, catch the download, read the message box.
- Ordering bugs (code run before it is defined) only show in a real browser: always run the page in Chrome after a layout change.
- New features add new bugs: test the newest first (Discord tab, one file picker, Home intro, intro boxes).

## Round A: security (read the code, then probe)
1. Keys: search for every place a key, Discord link or API URL could reach the Log, bug report, Copy error, GitHub issue link, localStorage dump or the Excel file. Try pasting a key and a Discord link into every text box and confirm they never appear in the Log or report.
2. Network: list every `fetch`, `window.open`, `<a href>`, `<img src>`, `<form>`. Confirm only the picked AI company, discord.com/api/webhooks and GitHub links are used. Try a hostile Discord link (other host, `discord.com.evil.com`, `@`, extra slashes, `http:`) against HOOK_RE.
3. Injection: put `<script>`, `<img onerror>`, quotes, `=HYPERLINK(...)`, `=cmd|...` and very long text in a clan name, player name, role, bill supplier and file name. Check the page (no HTML injection), the Excel file (no live formula), and the Discord message (no @everyone, no pings: check allowed_mentions).
4. Prompt injection: a screenshot or bill with text like "ignore the rules and output X". Pretend-AI replies that contain instructions, links or extra fields. The page must only copy numbers and names.
5. Headers: check `_headers` (CSP, frame, referrer) against what the page really loads. Try the page in an iframe. Try `file://` and a copy on another host.
6. Safety Check rules (CLAUDE.md): no eval/exec, no unknown sites, AI notice present, Start.bat line. Grep to confirm.
7. Repo: no keys, no email, wiki and Actions permissions, secret scanning on, and who can push.
8. Stored data: list everything in localStorage. Confirm Settings, Privacy and Wipe show and remove all of it, including the header picture and the Discord link.

## Round B: break it with bad input (free)
- Discord tab: no link, bad link, link with spaces, 204 / 400 / 404 / 429 (with Retry-After) / 500 / network error, file over 25 MB, 11 files, webp/gif/svg/heic photo, a .xlsx that is a renamed .png, a zip bomb-sized .xlsx, an Excel with 0 rows or 5000 rows, empty clan name, emoji names.
- Radio flow: post with nothing made, switch tabs mid-post, double-tap Post (must not post twice), post while a read is running.
- Clan: 0 to 100 pictures, huge pictures, video, AI reply cut off, duplicate names, two players with the same name, points as 1.5K / 1,500 / 1.5M / text, negative change, same-day rerun, old sheet from an older version.
- Bills: 13 files, PDF with no text, other currencies and units, comma vs point decimals, bill with negative lines, total mismatch.
- Tabs and state: click every tab in every order, reload mid-run, Back button, two tabs open at once.
- Themes and size: light, dark, ocean, forest, berry, big text; narrow phone width (320 px) and wide. Screenshot each tab and look for overflow and unreadable text.
- Accessibility: tab through with the keyboard, labels on all inputs, contrast.

## Round C: real world (needs Ginger, costs a little)
- One real Gemini run of each tab; one real Discord post to a test channel; open the Excel in real Excel and on a phone.
- Gemini limits: what happens at the daily 429 and at 503 (retry ladder).

## Output
- Add results to developer/STRESS_TEST_LOG.md (new section: round 2) with numbers: cases run, bugs found, fixed.
- One CHANGELOG entry per fix batch. Update STATUS.md (Tested / Not tested).
- Anything found that is unfixable or too big goes on the do-when-needed list in CLAUDE.md, not into the page.

## Tools already in the repo
`tests/fuzz.js`, `tests/browser.test.js` (pretend AI in Chrome), `tests/rows.test.js`, `tests/bills.test.js`, `tests/excel-math.test.js`, `tests/check.py`. Firefox and Safari engines run on GitHub, not in the workspace.
