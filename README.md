# Fishing Cat Data

Turns clan screenshots or a video from any Roblox game into a ready-to-use Excel sheet: Rank, Username, Role and Points, with optional week-to-week change. It also reads photos of household bills (power, gas, water, internet, phone and more) into a sheet.

**Built entirely by Claude, an AI.** The author gave the ideas and tested it. The AI wrote all the code, this page and the notes.

- **Use it:** https://fishing-cat-data.pages.dev
- **Wiki:** https://github.com/Ginger-Hermit/Fishing-cat-data/wiki (status, changelog, security, FAQ)
- **Update history:** [CHANGELOG.md](CHANGELOG.md)

## How to use it
> [!TIP]
> 1. Paste your own AI key. Google Gemini is picked first and has a free key: tap **How to get a free key**. The free key has a daily limit. Anthropic also works; OpenAI is untested.
> 2. Nothing to pick. The AI works out the game and clan itself.
> 3. Drop in screenshots of the member list, or a video of you scrolling it (use your device's own screen recorder). For a video, scroll the whole list slowly: about 1 second per 5 members.
> 4. Optional: choose last time's sheet to compare.
> 5. Tap **Make my sheet**. After about 20 seconds an Excel file downloads.
>
> To post to Discord, open the **Discord** tab, paste a webhook link (a private link for your channel; [Discord's guide](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks) shows how to make one), pick what to post and tap **Post to Discord**. Header picture and role ping are under **More options**.

## What you get

- An Excel file named after the game and clan (or the **Clan name** you type), like `Roblox - Gym League - Loki.xlsx`.
- **Clan Members** tab: coloured ranks and roles, plus **Rank**, **Username**, **Role**, **Points** (as shown, e.g. `52.51K`) and **Points** (number, e.g. `52510`). The number column is a real number, so you can sort and add it.
- With a last sheet chosen: **Previous Points**, **Change**, **% Change** and a **Trend** arrow (new members show as "new"). These are formulas, so fixing a misread number updates them.
- **Top 10** tab (with an earlier sheet): best 10 this month (week scores added up) and each week; past months one line each.
- **Points history** tab: one column per run with the gain under each number and a clan total. It is carried forward from the earlier sheet you choose, with no extra AI use. Earlier months fold into one column.
- A name the AI reads with one wrong letter (6+ letters) counts as the same player as before.
- **Help** tab: what each word, tab and colour means, with the maths step by step.
- Anyone who appears in more than one picture is listed once.

## Features

- Screenshots (PNG, JPEG, WebP) or video (MP4, MOV, WEBM). From a video the page looks about 4 times a second and keeps the pictures where the list moved (up to 24), right in your browser.
- Remembers your last sheet on this device so you don't have to pick it again (names and points only). Tap **Remove** to forget it.
- Themes (Auto, Light, Dark, Ocean, Forest, Berry) and **Large text**, in the **Settings** tab.
- A GitHub link on the Home tab, where this guide lives.
- **Home tab** that explains what the page does, then **Roblox clan sheet** and **Bills** tabs for the two tools.
- **Bills tab:** add photos of household bills (power, gas, water, internet, phone and more) and get a sheet with one row per charge and a **Summary** tab. Usage is turned into kWh (from MJ, therms, or gas volume using the factors printed on the bill) so bills can be compared. Money is kept in the bill's own currency. Bills are private: the whole photo goes to the AI company you pick, so only upload your own.
- **Discord tab:** posts a clan sheet, a Bills sheet or your own files to a Discord channel through a webhook link you paste: a table picture, a written breakdown, an optional Excel file and an optional role ping. No AI is used.
- The update history is in [CHANGELOG.md](CHANGELOG.md), one plain-English entry per change.
- Live steps with a timer under **Make my sheet**, and a **Log** box that opens by itself during a run on both tabs, with a **Copy bug report** button. A red **Copy error** button shows under any error.
- Optional **Clan name** box, optional **Remember my key**, and a banner when a new version is out.

## Privacy
> [!NOTE]
> - Your key is only saved if you tick **Remember my key**, and then only in your own browser. Untick to delete it.
> - Pictures go only to the AI company you pick, straight from your browser. There is no server of our own and no tracking.
> - Theme, text size and the last sheet are stored on your device only.
> - Your Discord link is only saved if you tick **Save my link on this device**. Posts go only to that link.

## Known limits
> [!WARNING]
> - **OpenAI is not tested yet** and may not work. Anthropic and Google Gemini have been tested.
> - A real run of the **Clan name** box is not tested yet.
> - A long video skips more of the list, so keep videos short or use screenshots. Rows cut off at the top or bottom edge are skipped.
> - The AI reads the names and points, so check any `?` or odd spelling by hand.
> - Rate limits and other AI errors show as a general "The AI said no" message.
> - Not tested with screen readers or keyboard-only use.

## Disclaimer
> [!CAUTION]
> For personal use only. Not an official Roblox, Anthropic, Google or OpenAI product. Provided as is, with no guarantees.

## Licence

All rights reserved. You can use the site and read the code, but not copy, re-host, change or sell it. Full terms are in [LICENSE](LICENSE).

## For developers

- Plain static site: `index.html` (what's on screen), `app.js` (all the code), `style.css` (the look) and `exceljs.bare.min.js` ([ExcelJS](https://github.com/exceljs/exceljs) 4.4.0, used to make and read `.xlsx`). No build step.
- The AI models are listed in `PROVIDERS` near the top of the script (`MODEL` is the Anthropic default). If a model is retired, change it there.
- Each change to `index.html`, `app.js` or `style.css` is released with `python3 tools/release.py`, which bumps the version and writes the changelog entry (see `CLAUDE.md`).
- `python3 tests/check.py` is the auto check. GitHub runs it after every push, along with the other tests, including `tests/browser.test.js` in Chrome, Firefox and Safari's engine.
- Every push to `main` publishes automatically after about a minute.
- [developer/HOW_TO_BE_LAZY_WITH_CLAUDE.md](developer/HOW_TO_BE_LAZY_WITH_CLAUDE.md): a copyable guide to getting Claude to do almost everything when you make an app on GitHub, including the manual setup steps, costs and Free vs Pro.
- [developer/HOW_TO_BE_LAZY_WITH_CLAUDE.md](developer/HOW_TO_BE_LAZY_WITH_CLAUDE.md): how a non-coder got Claude to build all of this, the lazy way, including what went wrong.
- [developer/HOW_IT_WAS_BUILT.md](developer/HOW_IT_WAS_BUILT.md): how the whole page was built, step by step, in plain words.
- [developer/STRESS_TEST_LOG.md](developer/STRESS_TEST_LOG.md): how the page was stress tested and broken on purpose, what was found, and lessons for future projects.
- `node tests/rows.test.js` and `node tests/bills.test.js` check how AI replies are read. `node tests/fuzz.js` throws thousands of scrambled replies at the same code. Full history of changes: [CHANGELOG.md](CHANGELOG.md).

## Tests (for developers, optional)

`tests/excel-math.test.js` checks the sheet maths: points like "1.2M" turn into numbers, and Change, % Change, Trend and the Clan Summary box add up correctly. The page doesn't need it to run.

To run it from the repo folder:

1. `npm install exceljs@4.4.0` (test tool only, the page doesn't use it)
2. `node tests/excel-math.test.js`

It prints an error if a check fails. If LibreOffice isn't installed, the formula checks are skipped and only the points parsing is tested.

**Run by GitHub automatically (free, no tokens):**
- Every push: `tests/check.py` (syntax, risky code, no inline code or styles), row, bill and fuzz tests, the page in Chrome, Firefox and Safari's engine, `tests/a11y.test.js` (readability in every theme), `tools/attack.py` (break test with a pretend Discord), and a size watch on `index.html`.
- Every push to main and weekly: CodeQL security scan (results under Security, Code scanning).
- Weekly: live-site check, written to `developer/LIVE_CHECK_LOG.md`.

## Read the code (quick guide)

**TL;DR:** the page is three files: `index.html` (words on screen), `app.js` (code), `style.css` (look). Search them for a word you see on screen. That's it.

### 1. What's in the repo (30 seconds)

| File | What it is | Open it? |
|---|---|---|
| `index.html` | The page's words and layout | Yes |
| `app.js` | All the page's code | Yes |
| `style.css` | Colours, sizes, spacing | Yes |
| `README.md` | This guide | You're here |
| `STATUS.md` | What's done, what's next | Yes |
| `tests/check.py` | Auto check, runs on every push | No |
| `tests/a11y.test.js`, `tools/attack.py` | Readability and break tests, run on every push | No |
| `developer/BUG_LOG.md`, `developer/LIVE_CHECK_LOG.md` | Bugs fixed; weekly live-site checks | Yes |
| `_headers` | Browser lock (who the page may talk to) | No |
| `exceljs.bare.min.js` | Excel maker, unreadable on purpose | Never |
| `CLAUDE.md`, `version.txt` | Rules for the AI, version number | No |

### 2. What the code does (6 steps)

1. `collectPictures`: gets your pictures
2. `pickProfile`: AI reads the game and clan
3. `buildPrompt`: writes the question
4. `ASKERS`: sends it to the AI
5. `parseRows`: turns the reply into a list
6. `buildWorkbook`: makes the Excel file

Search `app.js` for any of these names to jump straight there.

### 3. Read one line (1 minute)

```js
const nameOf = (p) => "Roblox - " + p.game + " - " + p.clan;
```

| Piece | Means |
|---|---|
| `const nameOf` | a helper called nameOf |
| `(p) =>` | give it one thing, call it p |
| `"Roblox - " + p.game + " - " + p.clan` | stick the words together |

Result: `Roblox - Gym League - Loki`. That's the Excel file name.

### 4. Cheat sheet

| You see | Read it as |
|---|---|
| `function` or `=>` | a small job |
| `const` / `let` | a labelled box |
| `if (...) {...}` | only when true |
| `await` | wait for the AI |
| `$("key")` | grab the box with that name |
| `clog(...)` | write in the Log box |
| `//` | a note, ignored |
| `{...}` / `[...]` | a group / a list |

### 5. Follow any feature (3 steps)

1. Search for the words on its button.
2. Copy its `id`, search for `$("thatid")`.
3. Follow the names it calls, one at a time.

### Stuck?

Paste the lines into any AI chat and ask: "what does this do, in plain words?"

Reading a commit on GitHub: **green = added, red = removed.**

## Want to learn this yourself?

Free places to start. Pick **one**, not all.

| Place | Good for | Link |
|---|---|---|
| freeCodeCamp | Small step-by-step lessons you type along with | https://www.freecodecamp.org |
| javascript.info | Plain-words reading, the language this page uses | https://javascript.info |
| MDN Web Docs | Look up any word you don't know | https://developer.mozilla.org |
| The Odin Project | A full free path, if you want to go far | https://www.theodinproject.com |
| CS50 (Harvard) | Video course, starts from zero | https://cs50.harvard.edu/x |

**Tips that help**
- 15 minutes a day beats 3 hours once.
- Change one small thing in a copy of the page (a button's words in `index.html`) and see what happens. You can't break the live site from your own computer.
- Stuck for more than 10 minutes? Ask an AI chat: "explain this like I'm new".
- Keep your first goal tiny: "I can read this one function".
