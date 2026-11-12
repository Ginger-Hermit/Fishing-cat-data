# Status

Last updated: 12 Nov 2026. Page version 2026-11-12-a. Live at fishing-cat-data.pages.dev.
`tools/release.py` keeps the version and date up to date. Keep this file under 50 lines.

## What the page does
- **Home** explains the page. **Roblox clan sheet:** screenshots or video of a clan list become an Excel sheet (two AI requests: layout, then rows). An earlier sheet adds history tabs (Leaderboard, Points history, How it's worked out), no extra AI.
- **Bills:** photos or PDFs of household bills (12 at most) become an Excel file: Summary first (sections, "Same as the bill?" check), then every charge. One AI request. The AI only copies; the sheet does the sums.
- Gemini is the default (free key). Anthropic works. OpenAI untested. After a read, an Excel-style table lets you fix cells before Download. Settings has Privacy (see and delete what is saved). Update history is in CHANGELOG.md only.
- The Log and "Copy bug report" are detailed: timings, sizes, AI token counts, errors.

## Next
- **Bills slow on Gemini** (80s+ for 2 photos, 12 Nov, not the page). Waiting for a finished Copy bug report to see tokens and thinking time. Idea: Gemini `thinkingLevel` "minimal" with fallback to "low", plus JSON-only output.
- **Post to Discord (approved 12 Nov, not built).** First check that Discord takes a file from a web page (CORS), else post the message only. Settings box "Discord webhook link" + Test (stored in browser as `fcd_hook`, shown and deletable in Privacy, scrubbed from Log and bug report, only `https://discord.com/api/webhooks/...`). After a clan read: **Post to Discord** (preview: clan, date, top 3 gained, total, new players; built by the page, no AI; message plus .xlsx; on tap only; never on Bills) and **Copy message**. Needs `https://discord.com` in `_headers`, a Stay safe line, "nothing leaves your PC" wording updated. Never ask for the webhook link.
- Ginger: one real run of each tab on the live site, then a screenshot.
- Offered, not approved: one AI request per clan run (saves ~20s on Gemini); PDF-bill and compare-with-last-bill ideas; preview tabs for Leaderboard and Points history.

## Tested
GitHub runs `check.py`, row, bill and fuzz tests, and the page in Chrome, Firefox and Safari's engine with a pretend AI after every push. Stress results: `developer/STRESS_TEST_LOG.md`.

## Not tested
- Any real AI call since 11 Nov (Bills tab, JPEG re-save, PDFs). OpenAI.
- Real Excel by eye (new clan tabs, new Bills Summary): only LibreOffice.
- A real phone by eye. The live `_headers` security header. "Remember my key" beyond one sighting.

## Known limits
- Clan: all pictures go in one request; accuracy may drop past about 20.
- Bills: a cut-off AI reply loses the run. Gas in m3 or CCF without printed factors is flagged, not converted. No currency conversion.
- Label contrast about 4.2 to 1 in Light and Ocean (target 4.5).
- LICENSE is all rights reserved, not checked by a lawyer.
