# How Fishing Cat Data was built, step by step

Written 12 Nov 2026. The owner (Ginger) does not code. Claude, an AI, wrote every line. This file explains the process in plain words, so anyone can see how an AI-built page goes from an idea to a tested release.

## 1. The idea

A Roblox clan leader scrolls a member list and types the points into a sheet by hand. The page should do that from screenshots or a video: an AI reads the pictures, and the page makes an Excel sheet. Later, the same page also reads photos of household bills.

Rules set from the start, and kept:
- One web page (`index.html`), no server, no accounts, no new packages.
- The AI copies what it sees. The sheet does the sums.
- Nothing leaves the person's device except the pictures going to the AI company they picked.

## 2. The loop used for every change

1. **Ginger says what they want** in plain words, often from a phone.
2. **Mockup first** for anything new on screen: a quick picture, then Ginger approves or changes it. Nothing is built until it is approved.
3. **Small edits.** Each edit is a find-and-replace that must match exactly one place. A backup of `index.html` is kept outside the repo first. No whole-file rewrites.
4. **One release command**: `python3 tools/release.py ...` raises the version, writes the CHANGELOG entry, updates STATUS.md and runs `tests/check.py`.
5. **Tests** (see section 5).
6. **Commit and push to `main`.** The host publishes it in about a minute.
7. **GitHub runs everything again** in Chrome, Firefox and Safari's engine. A red cross means fix it before anything else.
8. **Ginger tries it** and sends a screenshot. That drives the next change.

## 3. Timeline

### 11 Nov 2026: from nothing to a working tool
- First web page: upload clan screenshots, the AI reads them, an Excel sheet downloads.
- Settings tab (themes, text size), Help, Stay safe, Privacy and Legal pages.
- Excel sheet: real-number points, an optional "last sheet" to show change, % change and a trend arrow.
- More AI companies: Google Gemini (free key, now the default) and OpenAI, next to Anthropic.
- "Add a game" profiles were tried, then replaced by letting the AI work out the game and clan layout itself (two AI requests per run).
- Safety: wrong-address warning, file limits, a connection limit, key kept out of logs.
- Update banner, version check, and an optional "remember my key" box (off by default).
- A Log box and a "Copy bug report" button, so errors can be pasted back to Claude.
- `CLAUDE.md` and `STATUS.md` added, so every new chat starts with the rules and the status by itself.
- `tests/check.py`, the row and fuzz tests, and the Excel maths test.
- A stress test (see `STRESS_TEST_LOG.md`) that broke the page on purpose and fixed what it found.
- LICENSE added (all rights reserved).

### 12 Nov 2026: bills, tidy-up, and trust
- **Bills tab:** photos of power or gas bills become a sheet with one row per charge and a Summary tab. The AI copies, and the sheet converts units to kWh using formulas.
- **Record screen** removed (screenshots or a video do the same job).
- **Home tab** for new people. Tabs renamed Clan sheet and Bills.
- **All household bills** (water, internet, phone, rates, insurance), not just power and gas. Non-energy charges get their own type and are never turned into kWh. The Summary gained a "Cost by type" block. Tested with a pretend reply shaped like a real phone bill.
- **Updates tab removed.** The history lives in `CHANGELOG.md` on GitHub.
- **Live steps and a live log** while a sheet is being made, with a timer.
- **Check your list / Check your charges:** after the AI reads, a table in an Excel look lets you fix names, points and amounts before downloading. It flags unreadable rows, compares the screen's member count with the rows read, and checks that bill charges add up to the printed total.
- **Privacy section in Settings:** shows what is saved on the device, can stop saving the last sheet, forget the key, or delete everything. Delete buttons need a second tap.
- **Break-it tests** added to the browser test (section 6).

### Where the build stands (version 2026-11-12-t)
All checks pass on GitHub: the code check, row and bill tests, fuzz (5,000 cases) and 81 browser checks in Chrome, Firefox and Safari's engine. Passing with pretend AI replies is not the same as working on real pictures, so the first real run is still next.

## 4. Decisions worth knowing

- **Mockups first** stopped the build of things Ginger did not want. Several screens were drawn and rejected before any code was written (a four-screen wizard, a one-screen form, a table, then the Excel-look table that was finally built).
- **Wording mistake, fixed:** the page was briefly changed to say "any game" after Ginger asked for other clan games. Ginger meant any Roblox game. It was put back the same day. Lesson: ask one short question when a wording change could mean two things.
- **Errors do not report themselves.** The page cannot send errors anywhere, by design. A red "Copy error to send" button copies a report (keys removed) that the user pastes into a chat or a GitHub issue.
- **Hosting and privacy.** The page is plain files on a normal web host. The host can see that someone opened the site and which files they asked for (and the page asks for `version.txt` every 5 minutes), as any web host can. It never receives the key, pictures, bills or sheets, because those go straight from the browser to the AI company the person picked. How long the host keeps its own logs was not checked.
- **People control what is saved.** Settings has a Privacy section: it lists what is stored on the device (never the values), stops saving the last sheet, forgets the key, or deletes everything. Delete buttons need a second tap.
- **The AI never does sums.** Anything numeric is a formula in the sheet or a plain calculation in the page, so a misread is visible and checkable.
- **The wiki: the AI said no, Ginger said yes, and Ginger was right.** Claude called a wiki padding and suggested leaving it off. Ginger wanted one anyway. It was built as about 20 pages made automatically from the repo docs, with a real front page, a grouped page list, section front pages and sample screenshots. It turned out useful. Lesson: an AI's "not worth it" is a guess about cost, not a fact. If the owner wants something and the cost is small, build it, and make it cheap to keep up to date by generating it from one source instead of pasting.

## 5. Tools and tests

| Tool | What it does |
|---|---|
| `tools/release.py` | Version, CHANGELOG, STATUS and patch note in one command |
| `tests/check.py` | Syntax, no `eval`, ids, unused code, safety text still present |
| `tests/rows.test.js`, `tests/bills.test.js` | Reading names, points, units and bill replies, including a Spark-shaped phone bill |
| `tests/fuzz.js` | Thousands of random bad replies; none may crash the page |
| `tests/excel-math.test.js` | The sheet's formulas give the right numbers |
| `tests/browser.test.js` | Opens the real page in Chrome, Firefox and Safari's engine with a pretend AI |
| `.github/workflows/check.yml` | Runs all of the above on every push |

## 6. What the break-it tests found

A test that tries to break things earns its keep. On 12 Nov it caught a real bug in work done that same day: the Bills tab downloaded the sheet immediately, skipping the new check table, and the Download sheet button did nothing. The cause was one edit landing in the wrong place of two similar-looking code blocks. A test was added so that nothing downloads until Download sheet is tapped.

Other cases now covered: hostile text (like `<img onerror>`) in names and bills never runs; 3,000-character names; unreadable numbers; empty lists give a plain message and no file; 200 added rows still download; typing in a cell reaches the data; the privacy buttons really clear what they say.

An earlier lesson from 11 Nov: working from a stale copy overwrote a README and rebuilt a feature. The fix is a rule: `git pull` before anything else.

## 7. Honest limits

- Nothing has been run with a real AI since 11 Nov. Every test uses pretend replies, so reading accuracy on real clan videos and real bills is not proven. The first real run is next.
- A real phone has not been checked by eye. Widths were simulated.
- OpenAI is untested. The live security header (`_headers`) is untested.
- Bills are photos only, no PDFs. The Bills preview shows 6 of the sheet's 15 columns, and the Summary tab is not previewed.

## 8. Next steps
1. One real clan video and one real bill photo on the live site, with a screenshot of the result.
2. Then, from the offered list: one AI request per clan run instead of two, PDF bills, and compare with the last bill.

## 9. If you build something like this with an AI

1. Write the rules down in a file the AI reads at the start of every chat (`CLAUDE.md`), and keep a short status file next to it.
2. Draw it before building it.
3. Keep edits small and exact, with a backup.
4. Automate the paperwork (`release.py`) so it is never forgotten.
5. Test with pretend AI replies for everything you can, and with the real thing before you trust the numbers.
6. Make the tests try to break it, not just prove it works.
7. Start a fresh chat when one gets long. The rules and status files carry the memory.
8. Do not let the AI talk you out of something you want just because it says it is not worth it. Ask for the cheapest way to do it, then judge the result yourself. The wiki here was first called padding and ended up being one of the most useful parts.
