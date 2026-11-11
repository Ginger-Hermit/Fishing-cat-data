# Rules for Claude: Fishing Cat Data

Read this file and the status below at the start of every chat. Never ask Ginger for a handoff.

@STATUS.md

Web page that reads Roblox clan screenshots or video with an AI and makes an Excel sheet.
Live: fishing-cat-data.pages.dev. Pushing to `main` deploys in about a minute.
The owner (Ginger) does not code. Short, blunt answers. Plain words on screen.

## Every push
1. Bump the version in BOTH `version.txt` and `const BUILD` in `index.html` (format `2026-11-11-x`).
2. Add one entry at the top of `UPDATE_LOG` AND the same entry at the top of `CHANGELOG.md`. Keep only the newest 5 in `UPDATE_LOG` (delete the oldest; it stays in `CHANGELOG.md`). Entry format for `UPDATE_LOG` (plain words: title, meaning, see, changes). Include `at` (UTC time). Add `commit:` with the hash on the NEXT push, since the hash isn't known yet.
3. Replace the one-line plain-English patch note at the top of `index.html` (newest only; history is in `CHANGELOG.md`).
4. Run `python3 -I tests/check.py` once (syntax, no `eval(`/`exec(`, ids exist, no unused code). It also runs by itself on GitHub after every push. Then stop.
5. Small find-and-replace edits that match exactly once. No whole-file rewrites. Keep a backup outside the repo.
6. One bug per patch unless it has the same cause. Say what you couldn't test.
7. Update `STATUS.md` (version, next, not tested). It is loaded automatically by the line at the top.

## Safety rules (keep)
- No `eval` / `exec`. No unknown websites. A new website needs an edit to `_headers` (CSP `connect-src`) and a mention in Stay safe.
- Keep the AI safety notice and the wrong-address warning.
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
| Video stills | `function videoFrames`, `function samePic` |
| Picture shrinking and limits | `async function toPic`, `async function collectPictures`, `aiWait` |
| Record screen (PC) | `// Record screen` |
| Rows from AI reply | `function parseRows`, `function parsePoints` |
| Excel sheet | `function buildWorkbook` |
| Messages / errors | `const setMsg`, `copyerr` |
| Log box + bug report | `id="logbox"`, `const bugCopy`, `function clog` |
| Updates tab | `const UPDATE_LOG`, `function renderLog` |
| Tabs | `function showTab` |
| "New version" banner | `function checkUpdate` |
| Security headers (CSP) | `_headers` |
| Row reading test | `tests/rows.test.js` (run `node tests/rows.test.js`, no install needed) |
| Stress test write-up and lessons | `developer/STRESS_TEST_LOG.md` (read section 7 before calling a feature done) |
| Excel maths test | `tests/excel-math.test.js` (needs `npm install exceljs@4.4.0`) |

## Tested / not tested
- Tested: Anthropic, Google Gemini.
- Not tested: OpenAI, Firefox pop-up window (Chrome/Edge/Opera only), phones.

## Style on screen
Clean and calm. No big coloured blocks, no boxes in boxes. Short button names (1 to 3 words), one grey help line at most. No jargon. Check light, dark and big-text themes.

## Working with Ginger
- Plan first, then do it in as few steps as possible. Batch all requested changes in one patch.
- Grep for the exact spot and read only those lines. Don't re-read the whole file.
- If a request could mean two things, ask one short question. Bad or bloated idea: say so in one line and offer a cheaper way.
- If something fails twice, stop and suggest a simpler version or dropping it.
- Start new chats from the handoff, not by re-reading everything.
- Spend tokens wisely but smart: spend on the real cause of a bug, checks that protect the live site and sheet accuracy, and one short question when a wrong guess would waste a patch. Save on re-reading, recaps, unseen tidying and extra options. Warn Ginger before anything big.
