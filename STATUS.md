# Status (update on every push)

Last updated: 11 Nov 2026. Page version 2026-11-11-ad. Live at fishing-cat-data.pages.dev.

## How it works now
Upload photos or a video (or tap Record screen on a PC). The AI reads the game, clan and layout from up to 3 of the pictures, then reads the member rows, and the page makes the Excel sheet. There is no profile list or Add a game any more. The optional Clan name box sets the file name. Gemini and Anthropic work.

## Next
- Check on GitHub (Actions tab) that the auto check ran green after the first push.
- Ginger tests a real run: Record screen, pick the Roblox window or Entire Screen, scroll the list, tap Make my sheet, then send a screenshot.
- Optional: auto-save the new sheet as the next Last sheet.

## Known problems / not tested
- Not tested in a real run: Clan name box, skipping repeated pictures (video and Record screen), reading layout from 3 pictures, Log box opening on errors, collapsible days in Updates, new tags and hover time (checked for syntax only, not looked at on screen).
- Record screen pop-up window works only in Chrome, Edge and Opera. Firefox just shows messages on the page. Phones can't record in the page at all (they use the phone's own recorder).
- OpenAI is untested.
- Phone screen layout was never checked.
- The live security header (CSP in `_headers`) was never checked on the real site.
- "Remember my key" was seen ticked in a Firefox video but not otherwise checked.
- Help and Stay safe are plain text and must be updated by hand when features change.
- Updates log is merged into 11 entries with New/Changed tags. Newest entry (Old code cleared out) has no `commit:` yet. Add it on the next push.
- Fingerprint: not recorded.

## Ideas Ginger has not approved
- Link or short help for "how do I get an AI key" on the main page.
- Hide Test first behind a small link. Collapse the Last sheet box until needed.
