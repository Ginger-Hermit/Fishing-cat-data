# Status

Last updated: 12 Nov 2026. Page version 2026-11-12-g. Live at fishing-cat-data.pages.dev.
`tools/release.py` keeps the two values above up to date. Keep this file under 60 lines: it is read at the start of every chat.

## What the page does
- **Games tab:** screenshots or a video of a Roblox clan member list become an Excel sheet. Two AI requests per run (layout, then rows). An earlier sheet can be added to show changes.
- **Bills tab:** photos of power or gas bills (12 at most) become a sheet with one row per charge and a Summary tab. One AI request. The AI only copies; the sheet does the sums.
- Gemini is the default company (free key). Anthropic works. OpenAI is untested.
- Record screen was removed on 12 Nov.

## Next
- Ginger: one real run of each tab on the live site (real clan video, real bill photo), then a screenshot. Nothing since 11 Nov has been run with a real AI.
- Offered, not approved: one AI request per clan run instead of two; shorter AI replies; a results table on the page to fix misreads before download; Cloudflare preview addresses instead of pushing straight to live.

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
