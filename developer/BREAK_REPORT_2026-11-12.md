# Break and security report: what still needs testing (12 Nov 2026, end of day)

Written from what was built today (Discord tab, role ping, two-message post, breakdown from the Excel file). Read with `BREAK_TEST_PLAN.md` (how to test) and `STRESS_TEST_LOG.md`. Nothing here has been fixed yet unless it says so.

## Fix first (real problems, cheap to fix)
1. **(Fixed 12 Nov)** **Markdown in names can fake a link or break the post.** Player names go straight into the Discord message, including inside code blocks. A member named `[free robux](http://bad.site)` becomes a clickable link in the channel. A name containing three backticks ends the code block early and the rest is formatted as the attacker likes. Pings are already blocked, formatting is not. Fix: one `esc()` that backslash-escapes `\ * _ ~ | > # [ ] ( ) \`` and `@`, and turns three backticks into one inside code blocks. Test with the names in plan section 4A.
2. **(Fixed 12 Nov)** **"Ping @everyone" is remembered.** The ping choice is saved on the device, so next week a post can ping the whole server by accident. Fix: only save the role choice; always start on "Don't ping anyone" for @here and @everyone.
3. **(Fixed 12 Nov)** **Half post.** The post is now two messages. If message 2 fails (rate limit 429, network), message 1 is already in the channel. Fix: on a 429 wait the Retry-After time once and retry; if it still fails say "The picture posted but the breakdown didn't. Tap Post again to resend only the breakdown", and do not repost the picture.
4. **(Fixed 12 Nov)** **Double tap.** Check that tapping Post twice cannot send two posts (the run lock may not cover the Discord tab). Fix: disable the button while a post runs.
5. **Unlimited loops when reading an Excel file.** `readSheet` loops to the last row and column the file claims. A hostile or broken .xlsx (zip bomb, 1 million rows) can freeze the tab. Fix: cap at 500 rows and 60 columns, refuse files over about 5 MB, plain message.

## Test next (needs the attack script from the plan)
6. **Canary check:** fake key and fake Discord link must never appear in the Log, bug report, Excel file, GitHub issue link or error text. The new Discord code logs file names and sizes, so confirm the link is never logged.
7. **Role ping:** non-numeric, 14 and 26 digits, `<@&id>` pasted twice, `@everyone` typed in the box. Only digits may reach the message and `allowed_mentions.roles`.
8. **Discord answers:** 400, 401, 404, 413 (file too big), 429 with and without Retry-After, 500, never answers. Each must give one plain sentence and leave the page usable.
9. **Bad files in My own files:** renamed png as xlsx, zip bomb, 0 bytes, 11 files, webp/gif/heic/svg, name with `../` or 300 characters, two Excel files at once (only the first is used: say so).
10. **Sheets from older versions:** an xlsx without a Points history tab, with history dates as text, with deleted members, with one run only. The breakdown must not crash or print `NaN`/`undefined`.
11. **Long clans:** 50 and 100 members, 40-character names, 10 per list then "and N more", message 2 over 1,900 characters must cut cleanly.
12. **Stored values:** garbage in `fcd_pingmode`, `fcd_pingrole`, `fcd_hook`, `fcd_art` (huge, wrong type). Wipe must remove all four.
13. **Layout:** Discord tab at 320 px and big text, light and dark; buttons 48 px; nothing wider than the screen.

## Already checked today (no action)
- No `eval`, no `document.write`; the only `innerHTML` uses fixed lists (themes, sizes), never names or AI text.
- The Discord link is checked against the allowed pattern again right before every post.
- Posts send `allowed_mentions` (nothing is pinged unless a ping is chosen); verified in Chrome with a pretend Discord.
- Excel cells use the library's text type, so a name starting with `=` should not become a formula (not opened in real Excel).

## Known weak spots (accepted for now)
- `'unsafe-inline'` is still in the page's security header; it makes any future HTML injection worse. On the later list in CLAUDE.md.
- "Save my link" keeps the link in plain text on the device (that is the point of the tick). Anyone with the device or any script in the page could read it.
- Role IDs are not secret; the Discord link is. Never put either in a screenshot.
- Anyone who has the Discord link can post as the bot. The page cannot stop that. Revoke the link in Discord if it leaks.

## Not tested at all
- A real Discord post (colours on phone, two messages, ping, role ping), real Gemini run since 11 Nov, real Excel by eye, a real phone, Firefox and Safari engines in the workspace (they run on GitHub), the live `_headers`.

## Order for the next session (cheap first)
1. Fix 1 to 5 in ONE patch (about one normal patch of tokens). 2. Build the attack script with cases 6 to 12 and the canary check; run; one fix patch. 3. Look-and-feel case 13. 4. Ginger runs the real tests (a test Discord channel, a test role).
