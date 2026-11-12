# Rules for Claude: Fishing Cat Data

Read this and the status at the start of every chat. Never ask Ginger for a handoff.

@STATUS.md

Web page: reads Roblox clan screenshots or video (any Roblox game) with an AI and makes an Excel sheet. Bills tab: photos of household bills become a sheet. Live: fishing-cat-data.pages.dev. Pushing to `main` deploys in about a minute.
Ginger does not code. Short, blunt answers. Plain words on screen.

## Every change to `index.html`
1. `git pull` first. Find the exact spot with grep (table below), read only those lines. Small find-and-replace edits that each match once, all in one script. Backup outside the repo.
2. Run `python3 tools/release.py --title ... --tag New|Changed --meaning ... --see ... --change ...` once. It does the version, CHANGELOG, patch note, STATUS and `tests/check.py`. Never by hand.
   After pushing, put the new commit hash on that entry as a `[code](.../commit/HASH)` link in CHANGELOG.md (release.py only fills the previous entry), then push again.
3. Touched `parseRows`, `parsePoints`, `parseBills`, `parseNum` or `kwhFor`? Also run `node tests/rows.test.js && node tests/bills.test.js && node tests/fuzz.js 7 5000`.
4. Commit, push. GitHub runs every test in three browsers; a red cross comes first. Changes outside `index.html` need no release.
5. One bug per patch unless the same cause. Say what you couldn't test.
6. Edit `STATUS.md` Next / Not tested only when they really change. Keep it under 50 lines.

## Saving tokens
- One script, one check, one push per request. No re-reading, re-testing or recapping.
- Never print whole files or long logs. Grep and cut to width.
- Use existing tools: `release.py`, `tests/*`. No new harness. Web search only if the answer isn't here.
- Mockup: a few lines or one small inline picture. Full canvas only for a whole new screen.
- Ask one short question only if a wrong guess wastes a patch. Otherwise pick the default, say which, go.
- Warn before big jobs (stress test, full review, new feature).
- Small wording or colour changes don't need the strongest model. Say so.
- Long chat? Tell Ginger to start a new one. Nothing is lost.
- Do not sleep and wait for GitHub tests after a push: say they are running; Ginger sees a red cross. Check only if she asks.
- Layout fixes: render once (LibreOffice to one small PNG), look at only the changed tab. No second render unless it looks wrong.
- Do not read screenshots twice, and do not re-check files already shown in the chat.
- Bugs: ask for the Copy bug report text first (the Log has timings, sizes, AI token counts, errors). Don't guess.

## Safety (keep)
- No `eval` / `exec`. No unknown websites: a new one needs `_headers` (CSP `connect-src`) and a line in Stay safe.
- Keep the AI safety notice and the wrong-address warning.
- Bills: the AI copies, the sheet calculates. No AI sums or conversions. No fields for name, address or account numbers.
- Never ask for the key. If one is pasted, tell Ginger to delete it now.
- Nothing leaves the PC except to the AI company she picked. No new packages (only `exceljs.bare.min.js`, loaded by `loadExcel`).

## Where things are (grep `index.html`)
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
| Tests | `tests/rows.test.js`, `bills.test.js`, `fuzz.js` (`node tests/fuzz.js 7 20000`), `excel-math.test.js` (needs `npm i exceljs@4.4.0`; add an assert for any Excel change), `browser.test.js` |
| Background | `developer/HOW_IT_WAS_BUILT.md`, `developer/STRESS_TEST_LOG.md` (read section 7 before calling a feature done) |

## Style on screen
Clean and calm. No big coloured blocks, no boxes in boxes. Buttons 1 to 3 words, one grey help line at most. No jargon. Check light, dark and big-text themes.

## Working with Ginger
- Mockups first for anything new on screen; build only what she approves.
- New big feature? First ask if the basic sheet works in a real run.
- Bad or bloated idea: say so in one line, offer a cheaper way.
- Fails twice: stop, suggest a simpler version or dropping it.
- Later, not now: split code out of `index.html` and drop `'unsafe-inline'` from the CSP. Only after real clan and bill runs work; warn first.
