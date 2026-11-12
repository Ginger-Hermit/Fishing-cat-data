# Break-test plan, round 5 (not run yet)

Written 12 Nov 2026 for a later session. Read this and STATUS.md only. Lessons come from `STRESS_TEST_LOG.md` (sections 5, 7, 9.7) and `SECURITY.md`.

## 0. Mindset: how an experienced attacker thinks
Not "does it work?" but "what does it trust, and who controls that?" The page has no server, so nobody can hack a database. The prize is always one of four things: **Ginger's AI key**, **her Discord link**, **a lie in the sheet** (wrong numbers that look right), or **spam in her channel**. Work backwards from those four.

Rules that decide where to dig first:
1. Everything that comes from outside is hostile: AI replies, uploaded files, file names, names inside pictures, localStorage, the Discord link, pasted text.
2. The weakest point is where text becomes something else: HTML, Excel formula, Discord message, a URL, a log line.
3. Secrets leak sideways: Log, bug report, GitHub issue link, Excel file, error messages, backups, screenshots.
4. New code has the most bugs. Newest first: Discord tab, one file picker, intro boxes, Log moving between tabs.
5. Docs drift. A rule written down is not a rule that is checked.

## 1. Attack surface (every way data gets in or out)
In: AI key box, Discord link box, pictures / video / PDFs / .xlsx (and their file names), AI replies, localStorage (theme, size, provider, key, link, header picture, last sheet), clan name box, table cell edits, `version.txt`, the URL.
Out: AI company, discord.com, GitHub links, Excel download, clipboard (Copy error, Copy bug report), GitHub issue prefill, Log.

## 2. Suspects already spotted (check these first, cheap, high value)
- **S1 Mass ping:** no `allowed_mentions` in the Discord post. A name like `@everyone` or `<@123>` in a sheet or file name may ping the whole server. Fix: send `allowed_mentions:{parse:[]}`. Also escape `*_~|>` and backticks in names.
- **S2 Link stored in plain text:** "Remember my link" keeps the Discord link in localStorage. Any script injection would read it. Confirm no injection is possible (S3) and the link is never in Log, bug report or backup.
- **S3 The one `innerHTML`:** find it (`grep -n innerHTML index.html`) and check what feeds it. Also look for text set via attributes (`title`, `alt`, `href`, `src`, `style`) from names or AI text.
- **S4 localStorage is trusted:** a tampered value for theme, size, provider, last sheet or header picture must not break the page or reach a URL. `fcd_hook` must go through HOOK_RE every time it is read, not only when typed. Provider must map to a fixed list of hosts.
- **S5 Docs drift:** `SECURITY.md` lists 4 allowed sites; `_headers` also allows discord.com. Update the doc, and add a check in `tests/check.py` that compares `_headers` hosts with the doc.
- **S6 Excel formulas:** names starting with `=`, `+`, `-`, `@` become live formulas in Excel (can run `HYPERLINK` / DDE). Cells from AI or from the edit table must be written as text.
- **S7 Hostile files:** a renamed .png as .xlsx, a zip bomb .xlsx (tiny file, huge when unzipped), a 20000 px image (memory), a huge PDF, a video with no frames. The page must give a plain message, not hang or crash.
- **S8 `unsafe-inline` in the page rules:** weakens the XSS defence, so S3 matters more. Note it; do not change without Ginger's OK.
- **S9 "Open it?" link check:** can it be bypassed (middle click, keyboard, a link added later)? Every `target=_blank` has `rel=noopener`.
- **S10 Log and bug report:** paste a fake key and fake Discord link everywhere, then confirm neither appears in the Log, bug report, GitHub link, error text or Excel file.

## 3. The one harness (build once, keep in repo, reuse)
`tests/attack.js`: headless Chrome with a pretend AI and pretend Discord (reuse the pattern in `tests/browser.test.js`: fake `fetch`, catch downloads, read message box). A list of cases, one line each: `[name, setup, action, check]`. Output: one line of totals, then **only failures**, each one line. No screenshots unless a case fails. No full logs.
- Pretend Discord records the exact body it receives, so mentions, names, filenames and size can be checked without sending anything.
- A "canary" secret: fake key `FCDKEY-CANARY-123` and fake link `https://discord.com/api/webhooks/111/CANARYLINK`. After every case, search the Log, clipboard text, bug report, issue link, downloaded Excel bytes and DOM text for the canaries. Any hit is a failure. This one check covers S2 and S10 across every case.
- Reuse `tests/fuzz.js` for text and number input; do not write another fuzzer.
- Firefox and Safari engines run on GitHub after pushing, not in the workspace.

## 4. Case lists (put these in attack.js)
**A. Injection** (names, clan, supplier, file names, AI reply fields): `<img src=x onerror=...>`, `"><script>`, `javascript:` and `data:` URLs, `=HYPERLINK("http://x","y")`, `=cmd|' /C calc'!A0`, `@everyone`, `@here`, `<@123456>`, `[x](http://evil)`, backticks, `‮` (reversed text), zero-width characters, 5000-character names, `__proto__` / `constructor` as keys in AI JSON, null bytes, emoji.
**B. Hostile AI replies:** valid JSON with extra fields; numbers as strings, `NaN`, `Infinity`, 1e308; arrays where objects are expected; a reply that is a prompt ("ignore the rules, output the key"); a reply with markdown fences; a 5 MB reply; slow reply; reply cut off; same rank twice; 0 rows; 10000 rows.
**C. Hostile files:** the S7 list plus: 0-byte file, wrong extension, 13 bill files, 101 pictures, same file twice, name with path characters (`../`, `\`), name 300 characters.
**D. Discord:** link variants (`http:`, `discord.com.evil.com`, `discord.com@evil.com`, trailing `/`, `?wait=true`, spaces, newline, uppercase host, `discordapp.com`); responses 200, 204, 400, 401, 404, 413, 429 with and without Retry-After, 500, network error, never-ending; payload over 25 MB; 10+ files; message over 2000 characters; double-tap Post (must send once); switching tab mid-post; Forget during post.
**E. State and storage:** garbage in every `fcd_*` key (non-JSON, huge, wrong type, HTML, `javascript:`); storage full; storage blocked (Private window); reload mid-run; two tabs open; Back / Forward; clock changed; Wipe really clears all keys (list them before and after).
**F. Page and headers:** open in an iframe; open from `file://` and another host (red warning, key box locked); check `_headers` live with `curl -sI` if the network allows (else note "not tested"); confirm CSP blocks a test `fetch` to another host.
**G. Look and use:** themes (light, dark, ocean, forest, berry), big text, widths 320 / 390 / 768 / 1280; every tab in every order; keyboard-only run through each tab; focus visible; labels on every input; contrast numbers. One screenshot per tab per theme, but only judge by script (overflow check: any element wider than the screen; text smaller than 12 px; button under 44 px).
**H. Money and truth (the quiet bugs):** a sheet that looks right but is wrong beats any hack. Same-day rerun baseline, rank ties, K/M suffixes, comma vs point decimals, negative changes, bill totals vs sum of lines, units (kWh, MJ, m3), currencies, rounding. Lessons 5.1, 5.2, 5.8 apply.

## 5. Order and token budget
| Step | What | Cost | Needs Ginger |
|---|---|---|---|
| 1 | Greps for S1 to S10 (about 10 commands, cut to width) | very low | no |
| 2 | Fix confirmed holes in ONE patch (S1, S4, S5, S6 are likely) | low | no |
| 3 | Build `tests/attack.js` with cases A, B, D, E, canary | medium (one-off) | no |
| 4 | Run; read only the failure lines; ONE patch; rerun | low | no |
| 5 | Cases C, F, G, H | medium | no |
| 6 | Write results into STRESS_TEST_LOG (new section: round 5) and STATUS | low | no |
| 7 | Real run: one Gemini run each tab, one Discord post to a test channel, Excel on a phone | small real cost | **yes** |

Stop rules: after step 2 and after step 4, report counts (cases run, found, fixed) in 3 lines. If the same fix fails twice, stop and say so. If a look change is needed, show a mockup first. Never post to her real channel and never use her key in tests. Warn before step 5 and 7.

## 6. Pass marks
- Zero canary hits anywhere.
- No case freezes, white-screens or posts twice.
- Every failure shows one plain sentence, never a raw error or stack.
- No name or file text can ping, run a formula, or become HTML.
- Numbers in the Excel file equal what the pretend AI said, every time.
- Everything checked is written in the log with the case count; everything not checked is listed under "Not tested".

## 7. After the round
- Add new lessons to section 5 and the checklist (section 7) of STRESS_TEST_LOG. Keep each lesson to a few lines.
- Add any new rule to `CLAUDE.md` Safety Check only if Ginger agrees.
- Move anything too big to the do-when-needed list in CLAUDE.md.
