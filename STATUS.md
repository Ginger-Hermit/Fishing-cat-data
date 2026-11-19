# Status

Last updated: 19 Nov 2026. Page version 1.1.141 Live at fishing-cat-data.pages.dev.
`tools/release.py` keeps the version and date up to date. Keep this file under 50 lines.

## What the page does
- **Home** explains the page. **Roblox clan sheet:** screenshots or video of a clan list become an Excel sheet (two AI requests: layout, then rows). An earlier sheet adds history tabs (Leaderboard, Points history, How it's worked out), no extra AI.
- **Bills:** photos or PDFs of household bills (12 at most) become an Excel file: Summary first (sections, "Same as the bill?" check), then every charge. One AI request. The AI only copies; the sheet does the sums.
- Gemini is the default (free key). Anthropic works. OpenAI removed 14 Nov. After a read, an Excel-style table lets you fix cells before Download. Settings has Privacy (see and delete what is saved). Update history is in CHANGELOG.md only.
- The Log and "Copy bug report" are detailed: timings, sizes, AI token counts, errors.

## Next
- **Bills slow on Gemini = Google overload** (12 Nov: 503 "high demand" after 54s on gemini-3.8-flash). Built: 3 tries, and the 2nd and 3rd switch to gemini-3.7-flash then gemini-3.5-flash-lite (a missing backup model, 404, also moves on to the next). Not tested with real Gemini. If it still fails often, consider making 3.7 the default.
- **Post to Discord: built 12 Nov (clan and Bills); tab simplified 13 Nov (link first, header picture and ping shown before Post (no More options), help links to Discord's guide).** Link box sits on both tabs (not saved unless "Remember my link"; never in Log or bug report; only `discord.com/api/webhooks/...`). Clan message has a detailed what-changed summary; no AI. **Table picture built 12 Nov:** canvas picture (no AI) posted with the message and .xlsx; header artwork picked once in Settings, kept in the browser only. Clan: #, Username, Role, Points, Change with gold/silver/bronze; Bills: simple charges table. Looked at in headless Chrome only. Ginger has posted to a real Discord channel several times (14 Nov).
- **Fix first:** nothing from the 12 Nov break report (items 1 to 5 fixed). `tests/check.py` now scans for risky code patterns on every push.
- **Break test:** 17 Nov one extra Discord batch (down, hangs, junk reply, broken header picture) in `tools/attack.py`, 79/79 pass; 2nd batch: 404, 401, 403, 413, slow reply; 3rd: header picture uploads; 4th: odd links in the link box (ptb/canary/discordapp links refused on purpose). Ginger: no more break-test rounds.
- **Google Sheet sync, approved 19 Nov. Batch 1 (sign-in) built 19 Nov, v1.1.115, works with real Google (Ginger signed in, 19 Nov; Google project Default Gemini Project, external, PUBLISHED 19 Nov, privacy.html live; no longer test-only). Client ID now built into the page (v1.1.117), so anyone taps Connect Google; Sign out button always shown (v1.1.121). Old unused client secret (ends 4mzj) still to delete. Batches 2 and 3 not built. Batch 2 also adds a Connect Google button + status above Post on Clan and Bills tabs (mockup shown 19 Nov, Ginger liked it, not yet formally approved); update the wiki pages (WIKI_HOME/USING/DEV) for Google then. Break check of sign-in, AI replies, Discord link, bills/Excel done 19 Nov: clean, 79/79.** Settings > Developer > Connect Google. 3 batches: (1) sign-in, (2) make the sheet, then each read replaces it with the newest data incl. history (no earlier sheet upload or download; anything typed in the sheet is overwritten), (3) history tabs, sheet link in Discord post, typed Season points and Rank boxes. Ginger sets up Google once; give steps one at a time. Mockups were pictures only. One batch per chat. Gemini backup is now lite only (19 Nov, v1.1.112), not tried with real Gemini.
- Offered, not approved: one AI request per clan run (saves ~20s on Gemini); PDF-bill and compare-with-last-bill ideas; preview tabs for Leaderboard and Points history.

## Tested
GitHub runs `check.py`, row, bill and fuzz tests, and the page in Chrome, Firefox and Safari's engine with a pretend AI after every push. Stress results: `developer/STRESS_TEST_LOG.md`.

## Not tested
- Real Excel by eye (new clan tabs, new Bills Summary): only LibreOffice.
- A real phone by eye. The live `_headers` security header. "Remember my key" beyond one sighting.

## Known limits
- Earlier sheet must be the newest one for the same clan, or history mixes (tips on page; warns on a different clan name in the file name).
- Gemini free tier: only 20 requests a day per model (12 Nov, error 429). Every retry and every clan run (2 requests) counts. A busy-model retry or a daily-limit 429 now moves to the next backup model.
- Clan: all pictures go in one request; accuracy may drop past about 20.
- Bills: a cut-off AI reply keeps the complete charges (Log says so); the last bill may be short. Gas in m3 or CCF without printed factors is flagged, not converted. No currency conversion.
- LICENSE is all rights reserved, not checked by a lawyer.
- 12 Nov: page split into index.html, app.js, style.css; CSP allows no inline code or styles. Screens compared before/after; not seen on a real phone.
