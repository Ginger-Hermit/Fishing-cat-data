# Rules for Claude: Fishing Cat Data

Read this and the status at the start of every chat. Never ask Ginger for a handoff.
Also at the start: check the latest GitHub Actions results on `main` (Check, CodeQL). Mention a problem in one line; say nothing if all is fine. Ginger doesn't read email.

@STATUS.md

Web page: reads Roblox clan screenshots or video (any Roblox game) with an AI and makes an Excel sheet. Bills tab: photos of household bills become a sheet. Live: fishing-cat-data.pages.dev. Pushing to `main` goes live only after every Check test passes (about 5 minutes): `golive.yml` moves the `live` branch, which Cloudflare publishes. Red cross = not live.

## Every change to `index.html` (page) or `app.js` (all the code)
1. `git pull` first. Find the exact spot with grep (table below), read only those lines. Small find-and-replace edits that each match once, all in one script. Backup outside the repo.
2. Run `python3 tools/release.py --title ... --tag New|Changed|Fixed|Removed --meaning ... --see ... --change ...` once. It does the version, CHANGELOG, patch note, STATUS and `tests/check.py`. Never by hand.
   The tag and GitHub Release are made automatically (`.github/workflows/release.yml`). CHANGELOG.md uses Keep a Changelog: `--tag New|Changed|Fixed|Removed`, title and meaning become one short line.
3. Touched `parseRows`, `parsePoints`, `parseBills`, `parseNum` or `kwhFor`? Also run `node tests/rows.test.js && node tests/bills.test.js && node tests/fuzz.js 7 5000`.
4. Commit, push to `main` without asking (Ginger said so, 13 Nov). GitHub runs every test in three browsers; a red cross comes first. Changes outside `index.html` and `app.js` need no release.
5. One bug per patch unless the same cause. Say what you couldn't test.
   Fixed a bug? Add one line to `developer/BUG_LOG.md` (date, what broke, cause, fix, commit).
6. Edit `STATUS.md` Next / Not tested only when they really change. Keep it under 50 lines.

## Saving tokens
- One script, one check, one push per request. No re-reading, re-testing or recapping.
- Never print whole files or long logs. Grep and cut to width.
- Use existing tools: `release.py`, `tests/*`. No new harness. Web search only if the answer isn't here.
- Mockup: a few lines or one small inline picture. Full canvas only for a whole new screen.
- Small wording or colour changes don't need the strongest model. Say so.
- Long chat? Tell Ginger to start a new one. Nothing is lost.
- GitHub runs are free; only chat costs tokens. Add free GitHub checks without asking.
- Do not sleep and wait for GitHub tests after a push: say they are running; Ginger sees a red cross. Check only if Ginger asks.
- Layout fixes: render once (LibreOffice to one small PNG), look at only the changed tab. No second render unless it looks wrong.
- Do not read screenshots twice, and do not re-check files already shown in the chat.
- Bugs: ask for the Copy bug report text first (the Log has timings, sizes, AI token counts, errors). Don't guess.

## Safety (keep)
- No `eval` / `exec`. No unknown websites: a new one needs `_headers` (CSP `connect-src`) and a line in Stay safe.
- Keep the AI safety notice and the wrong-address warning.
- Bills: the AI copies, the sheet calculates. No AI sums or conversions. No fields for name, address or account numbers.
- Nothing leaves the PC except to the AI company Ginger picked. No new packages (only `exceljs.bare.min.js`, loaded by `loadExcel`).

## Where things are (grep `app.js`; screen text and layout are in `index.html`)
| What | Search |
|---|---|
| AI companies, models, requests | `const PROVIDERS`, `const ASKERS`, `function postJson` |
| Prompts, auto game/clan read | `function buildPrompt`, `SETUP_PROMPT`, `pickProfile` |
| Pictures, video stills | `toPic`, `collectPictures`, `videoFrames`, `samePic` (must notice small changes) |
| Rows from AI reply | `parseRows`, `parsePoints` |
| Clan Excel (`readPrevious` to end of `buildWorkbook`) | `buildWorkbook`, history: `readHistory`, `mergeHist`, `fixNames` |
| Bills | `BILL_PROMPT`, `parseBills`, `parseNum`, `kwhFor`, `KWH_RULES`, `buildBillBook` |
| Check-your-list tables | `xlTable`, `pvDraw`, `bpDraw`, `pvDownload`, `bpDownload` |
| Run lock, tabs, messages | `let running`, `refresh`, `showTab`, `setMsg`, `copyerr` |
| Log, bug report | `clog`, `bugCopy`, `envInfo`, `aiStats` |
| Privacy section | `renderSaved`, `wipe` |
| New-version banner, headers | `checkUpdate`, `_headers` |
| Tests (`check.py` also scans for risky patterns; a safe false alarm goes in its SAFE list) | `tests/rows.test.js`, `bills.test.js`, `fuzz.js` (`node tests/fuzz.js 7 20000`), `excel-math.test.js` (needs `npm i exceljs@4.4.0`; add an assert for any Excel change), `browser.test.js`, `tools/attack.py` (break test with a pretend Discord, about 8 s; narrow with `post`, `ping`, `excel`, `secrets`, `names` or `role`; add a check there for each new Discord bug) |
| Background | `developer/HOW_IT_WAS_BUILT.md`, `developer/STRESS_TEST_LOG.md` (read section 7 before calling a feature done) |

## Working with Ginger
- Split batch 1 done 12 Nov: code in `app.js`, CSP `script-src 'self'` (no inline code allowed; never add `<script>` code or `on...=` to `index.html`). Batch 2 done 12 Nov: styles in `style.css`, CSP `style-src 'self'`; never add `style="..."` or `<style>` to `index.html` (start-up display uses `data-d`).
