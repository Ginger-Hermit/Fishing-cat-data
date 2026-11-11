# Status (update on every push)

Last updated: 12 Nov 2026. Page version 2026-11-12-a. Live at fishing-cat-data.pages.dev.

## How it works now
Upload photos or a video (or tap Record screen on a PC). The AI reads the game, clan and layout from up to 3 of the pictures, then reads the member rows, and the page makes the Excel sheet. There is no profile list or Add a game any more. The optional Clan name box sets the file name. Gemini and Anthropic work.

Second tool, Energy bills tab (new 12 Nov): photos of power or gas bills go to the AI in one request with `BILL_PROMPT`. The AI only copies what is printed; `parseBills`, `parseNum` and `kwhFor` clean it and the sheet does the sums. Output is `Energy bills - ....xlsx` with a first tab (one row per charge) and a Summary tab (one column per bill, formulas, plus AI notes). Photos only, 12 at most, no PDFs. The key box (`keybox`) is shared by both tabs. `running` locks every start button during any run.

## Next
- Check on GitHub (Actions tab) that the auto check ran green after the first push.
- Ginger tests a real run: Record screen, pick the Roblox window or Entire Screen, scroll the list, tap Make my sheet, then send a screenshot.
- Optional: auto-save the new sheet as the next Last sheet.

## Known problems / not tested
- Not tested in a real run: Clan name box, skipping repeated pictures (video and Record screen), reading layout from 3 pictures, Log box opening on errors, collapsible days in Updates, new tags and hover time (checked for syntax only, not looked at on screen).
- Record screen pop-up window works only in Chrome, Edge and Opera. Firefox just shows messages on the page. Phones can't record in the page at all (they use the phone's own recorder).
- 11 Nov review (version ag): video reading was tested in headless Chrome with a made-up 40 second video (24 pictures kept, spread over the whole video; broken and sound-only videos show an error). Row reading has unit tests run by hand. Not tested with a real key or a real Roblox video.
- 11 Nov stress test (version ak): 30 pretend phone screenshots, a 9000 px picture, a corrupt picture, 5 videos at once, an AI that never answers, switching company mid-run, 50 runs in a row, CSV fallback: all pass in headless Chrome. Uploaded pictures are now re-saved as JPEG, 2000 px at most (`toPic`); limits are 100 pictures and about 18 MB per run (`collectPictures`); AI requests time out after 3 minutes (`aiWait`). Record screen could NOT be tested here (screen capture is blocked in the test browser).
- Still one request for all pictures: accuracy may drop with 20+ pictures. Small batches would help but use more requests on the free Gemini key. Whether re-saving as JPEG changes how well the AI reads real screenshots is not tested.
- LICENSE added (all rights reserved, plain words, ExcelJS MIT notice kept). Not checked by a lawyer. Owner is named as Ginger-Hermit.
- Energy bills (version 2026-11-12-a): NOT tested with a real AI or a real bill photo. Tested with pretend replies modelled on official sample bills from NZ, Australia, UK, US and Germany: kWh, MJ, m3 with factors, therms and decimal commas all gave the right numbers after a LibreOffice recalculation. Known limits: a cut-off AI reply loses the whole bill run (no partial rescue like the clan sheet); gas in m3 or CCF without printed factors is flagged, not converted; no PDFs; no currency conversion; no compare-with-last-bill yet; dates are kept as printed text.
- 12 Nov fuzz and matrix test: `node tests/fuzz.js` ran 675,000 checks over 5 seeds (0 failures after 3 fixes); 135 button x company x reply runs all passed; 120 Excel files, 23,259 cells, 0 formula errors; 160 phone views, no sideways scrolling. Numbers are in developer/STRESS_TEST_LOG.md section 9.
- GitHub now runs every test after each push: check.py, row tests, bill tests, fuzz (5,000 cases) and `tests/browser.test.js` in Chrome, Firefox and WebKit (Safari's engine) with a pretend AI. Record screen and real AI calls are still not covered.
- OpenAI is untested.
- Phone layout: checked in headless Chrome at 360 and 320 px wide, all tabs, all themes, both text sizes: no sideways scrolling. Not looked at by eye on a real phone.
- 11 Nov break test (version aj): about 50 bad-input cases run in headless Chrome with pretend AI replies (broken replies, hostile names, HTTP errors, junk files, tampered saved settings, all three reply shapes). No script injection found. Fixes are in `parseRows`, `tidy`, `postJson`, `pickProfile`, `plain`. Not covered: real AI calls, Record screen, Firefox, Safari. Label text contrast measured about 4.2 to 1 in Light and Ocean (target 4.5), not changed.
- The live security header (CSP in `_headers`) was never checked on the real site.
- "Remember my key" was seen ticked in a Firefox video but not otherwise checked.
- The Help tab is now a GitHub tab; the guide is README.md. Stay safe is plain text and must be updated by hand.
- Updates: the page shows the newest 5 entries; the full history is in CHANGELOG.md. Newest entry (Energy bills) has no `commit:` yet. The Excel part (exceljs) now loads on demand through `loadExcel`. Add it on the next push.
- Fingerprint: not recorded.

## Ideas Ginger has not approved
- Link or short help for "how do I get an AI key" on the main page.
- Hide Test first behind a small link. Collapse the Last sheet box until needed.
