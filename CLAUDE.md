# Rules for Claude: Fishing Cat Data

Read this file and the status below at the start of every chat. Never ask Ginger for a handoff.

@STATUS.md

Web page that reads Roblox clan screenshots or video (any Roblox game) with an AI and makes an Excel sheet. It also has a Bills tab that reads photos of household bills (power, gas, water, phone and more).
Live: fishing-cat-data.pages.dev. Pushing to `main` deploys in about a minute.
The owner (Ginger) does not code. Short, blunt answers. Plain words on screen.

## Every change to `index.html`
1. Make the edit with small find-and-replace steps that each match exactly once. No whole-file rewrites. Keep a backup outside the repo.
2. Run `python3 tools/release.py --title ... --tag New|Changed --meaning ... --see ... --change ... --change ...` once. It bumps the version, writes the CHANGELOG entry, the patch note and STATUS, and runs `tests/check.py`. Do not do any of that by hand.
3. If you touched the reading code (`parseRows`, `parsePoints`, `parseBills`, `parseNum`, `kwhFor`), also run `node tests/rows.test.js && node tests/bills.test.js && node tests/fuzz.js 7 5000`.
4. Commit and push. GitHub then runs every test in three browsers. A red cross means fix it before anything else.
5. One bug per patch unless it has the same cause. Say what you couldn't test.
6. Changes that don't touch `index.html` (tests, docs, rules) need no version or log entry.
7. Update the Next / Not tested lists in `STATUS.md` only when they really change, and keep that file short.

## Saving tokens (read this, it matters to Ginger)
Lessons from the 11 to 12 Nov session, where most waste came from the same few habits.
- **Pull first.** `git pull` before reading or writing anything. A stale copy cost a rebuilt feature and an overwritten README.
- **Look before you write a file.** Check if it exists and what is in it.
- **One command, many edits.** Put all edits for a change in one script and one tool call, then one check, then one push.
- **Use the tools that already exist:** `tools/release.py` for release paperwork, `tests/browser.test.js` for browser runs (set `BROWSERS=chromium` and `CHROME_PATH` to run it locally), `tests/fuzz.js` for bad-input testing. Do not write a new harness.
- **Keep tool output small.** Grep for the exact spot and print only those lines, cut to a sensible width. Never print the whole file or a long log.
- **Search the web only when the answer is not already here**, with one focused query. Search results are very large.
- **Mockups:** for a quick look, describe it in a few lines or draw one small inline picture. Use a full design canvas only when Ginger asks for a mockup of a whole new screen.
- **Ask one short question when a wrong guess would waste a patch.** Otherwise pick the sensible default, say which, and go. Do not ask "go?" twice.
- **Do not repeat work:** no re-reading files you just edited, no re-running a passed test, no recap of what was already said.
- **Big jobs:** warn Ginger before a stress test, a full review or a new feature. Those are worth the tokens only before a release or after a real bug.
- **Right model for the job:** small wording, colour or tab changes do not need the strongest model. Say so if Ginger is using it for those.
- **Long chats cost more per message.** When a chat gets long, tell Ginger to start a new one. Nothing is lost: this file and `STATUS.md` load by themselves.
- **Short replies.** Answer first, then stop. No options list unless asked.

## Safety rules (keep)
- No `eval` / `exec`. No unknown websites. A new website needs an edit to `_headers` (CSP `connect-src`) and a mention in Stay safe.
- Keep the AI safety notice and the wrong-address warning.
- Energy bills: the AI copies, the sheet calculates. Never let the AI do sums or conversions. Never add fields for the customer's name, address or account numbers.
- Never ask for the key. If a key is pasted, tell Ginger to delete it now.
- Nothing leaves the PC except to the AI company she picked.
- No new packages. The page uses only `exceljs.bare.min.js` (loaded on demand by `function loadExcel`).

## Where things are (search for these in `index.html`)
| What | Search for |
|---|---|
| AI companies and models | `const PROVIDERS`, `const ASKERS` |
| Prompts | `function buildPrompt`, `SETUP_PROMPT` |
| Auto game/clan/layout read | `async function pickProfile` |
| Clan name box | `clanbox` |
| Energy bills | `BILL_PROMPT`, `function parseBills`, `function parseNum`, `function kwhFor`, `KWH_RULES`, `function buildBillBook`, `billtab` |
| Run lock and button states | `let running`, `function refresh` |
| Video stills | `function videoFrames`, `function samePic` |
| Picture shrinking and limits | `async function toPic`, `async function collectPictures`, `aiWait` |
| Rows from AI reply | `function parseRows`, `function parsePoints` |
| Excel sheet | `function buildWorkbook` |
| Messages / errors | `const setMsg`, `copyerr` |
| Check-your-list tables (Excel look) | `function xlTable`, `function pvDraw`, `function bpDraw`, `function pvDownload`, `function bpDownload` |
| Privacy section in Settings | `function renderSaved`, `function wipe` |
| Log box + bug report | `id="logbox"`, `const bugCopy`, `function clog` |
| Release paperwork (version, logs, patch note) | `tools/release.py` |
| Tabs | `function showTab` |
| "New version" banner | `function checkUpdate` |
| Security headers (CSP) | `_headers` |
| Row reading test | `tests/rows.test.js` (run `node tests/rows.test.js`, no install needed) |
| Bill reading test | `tests/bills.test.js` (run `node tests/bills.test.js`) |
| Fuzz test | `tests/fuzz.js` (run `node tests/fuzz.js 7 20000`; run it after any change to the reading code) |
| How the whole page was built, step by step | `developer/HOW_IT_WAS_BUILT.md` |
| Stress test write-up and lessons | `developer/STRESS_TEST_LOG.md` (read section 7 before calling a feature done) |
| Three-browser test | `tests/browser.test.js` (Chrome, Firefox, Safari engine with a pretend AI; runs on GitHub after every push, see the Actions tab) |
| Excel maths test | `tests/excel-math.test.js` (needs `npm install exceljs@4.4.0`) |

## Tested / not tested
- Tested: Anthropic, Google Gemini.
- Not tested: OpenAI, real AI runs since 11 Nov, a real phone by eye.

## Style on screen
Clean and calm. No big coloured blocks, no boxes in boxes. Short button names (1 to 3 words), one grey help line at most. No jargon. Check light, dark and big-text themes.

## Working with Ginger
- Mockups first for anything new on screen; build only what she approves.
- New big feature? First ask whether the basic sheet works in a real run yet.
- Bad or bloated idea: say so in one line and offer a cheaper way.
- If something fails twice, stop and suggest a simpler version or dropping it.
- Never ask Ginger for a handoff. This file and `STATUS.md` are the handoff.
