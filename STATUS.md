# Status

Last updated: 12 Nov 2026. Page version 2026-11-12-b. Live at fishing-cat-data.pages.dev.
`tools/release.py` keeps the two values above up to date. Keep this file under 60 lines: it is read at the start of every chat.

## What the page does
- **Home tab** explains the page. **Clan sheet tab:** screenshots or a video of a Roblox clan member list (any Roblox game) become an Excel sheet. Two AI requests per run (layout, then rows). An earlier sheet can be added to show changes.
- **Bills tab:** photos of household bills (power, gas, water, phone and more; 12 at most) become a sheet with one row per charge and a Summary tab with cost by type. One AI request. The AI only copies; the sheet does the sums.
- Gemini is the default company (free key). Anthropic works. OpenAI is untested.
- Record screen and the Updates tab were removed on 12 Nov. Update history is only in CHANGELOG.md. Live steps and a live Log show during a run. After a read, an Excel-style table lets you fix cells before Download sheet (both tabs). Settings has a Privacy section (see and delete what is saved).

## Next
- Ginger: one real run of each tab on the live site (real clan video, real bill photo), then a screenshot. Nothing since 11 Nov has been run with a real AI.
- **Approved by Ginger 12 Nov, not built: clan history in the Excel file.** No extra AI use: old numbers come from the earlier sheet, Excel does the sums.
  - **Leaderboard** tab (front): #, Username, Now, Gained (all time), Best run (+date), Avg / day, Since. Ranked by points gained (Ginger left the choice to Claude). Top 3 shaded like the main sheet. Players who left stay, greyed.
  - **Points history** tab (behind; was called Every run): one column per run with the gain under each number, Clan total row. At a new month, last month folds into one column.
  - **How it's worked out** tab (last): plain-words list of each column with one worked example from the sheet's own top player (Change, % Change, Gained, Best run, Avg / day, Clan total). Static text plus live cell references. No AI.
  - `readPrevious` must carry both tabs forward from the earlier sheet. Mockup was shown and accepted in chat. Add tests to `tests/excel-math.test.js`.
- **Approved by Ginger 12 Nov, not built: Post to Discord (webhook).** Build after the history tabs. First check that Discord takes a file posted from a web page (CORS); if not, post the message only.
  - Settings: one box "Discord webhook link" with a **Test** button (posts "Fishing Cat Data is connected"). Off until a link is pasted. Stored in the browser only (`fcd_hook`), shown and deletable in Privacy, scrubbed from Log and bug report like the key. Accept only `https://discord.com/api/webhooks/...`.
  - After a clan read: **Post to Discord** button next to Download sheet, with a preview of the message (clan, date, top 3 gained with medals, clan total, new players) built by the page, no AI. Posts message plus the .xlsx. Only on tap. Never on Bills.
  - Also a **Copy message** button (no webhook needed).
  - Needs `https://discord.com` in `_headers` connect-src, a Stay safe line, and the "nothing leaves your PC" wording changed to mention Discord when turned on. Never ask Ginger for the webhook link.
  - Sample sheet she approved the look from: built in chat 12 Nov (tabs Leaderboard, Points history, How it's worked out, simpler About, colour keys, Clan Summary without the empty Season Info box). Tab is called **Points history**, not Every run.
- Offered, not approved: one AI request per clan run instead of two; shorter AI replies; PDF bills; compare with the last bill; preview addresses instead of pushing straight to live.

## Tested
- GitHub runs everything after each push: `check.py`, row tests, bill tests, fuzz (5,000 cases), and `tests/browser.test.js` in Chrome, Firefox and Safari's engine with a pretend AI. A red cross there means fix it first.
- Stress and fuzz results, with numbers: `developer/STRESS_TEST_LOG.md`.

## Not tested
- Any real AI call since 11 Nov, including the whole Bills tab and re-saving pictures as JPEG before sending.
- A real phone by eye (widths were simulated).
- OpenAI. The live security header (`_headers`). "Remember my key" beyond one sighting.

## Known limits
- Clan sheet: all pictures go in one request; accuracy may drop past about 20 pictures.
- Bills: a cut-off AI reply loses the whole run. Gas in m3 or CCF without printed factors is flagged, not converted. Photos only, no PDFs. No currency conversion. No compare-with-last-bill.
- Label text contrast is about 4.2 to 1 in Light and Ocean (target 4.5).
- LICENSE is all rights reserved, owner named as Ginger-Hermit, not checked by a lawyer.
- Fingerprint: not recorded.
