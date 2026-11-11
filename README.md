# Fishing Cat Data

Turns Roblox clan screenshots or a screen recording into a ready-to-use Excel sheet: Rank, Username, Role and Points, with optional week-to-week change.

**Built entirely by Claude, an AI.** The author gave the ideas and tested it. The AI wrote all the code, this page and the notes.

**Use it:** https://fishing-cat-data.pages.dev

## How to use it

1. Pick your AI company (Anthropic or Google Gemini; OpenAI is untested) and paste your own key.
2. Nothing to pick. The AI works out the game and clan itself.
3. Drop in screenshots of the member list, a video, or tap **Record screen** on a PC and scroll the list.
4. Optional: choose last time's sheet to compare.
5. Tap **Make my sheet**. After about 20 seconds an Excel file downloads.

## What you get

- An Excel file named after the game and clan (or the Clan name you type), like `Roblox - Gym League - Loki.xlsx`.
- **Clan Members** tab: coloured ranks and roles, plus Rank, Username, Role, Points (as shown, e.g. `52.51K`) and Points (number, e.g. `52510`). The number column is a real number, so you can sort and add it.
- With a last sheet chosen: Previous Points, Change, % Change and a Trend arrow (new members show as "new"). These are formulas, so fixing a misread number updates them.
- **About this sheet** tab: what each column means.
- Anyone who appears in more than one picture is listed once.

## Features

- Screenshots (PNG, JPEG, WebP) or video (MP4, MOV, WEBM). From a video or a screen recording the page keeps the pictures that changed (up to 24 from a video, 30 from a recording), right in your browser. Record screen works in Chrome, Edge and Opera on a PC only.
- Remembers your last sheet on this device so you don't have to pick it again (names and points only). Tap **Remove** to forget it.
- Themes (Auto, Light, Dark, Ocean, Forest, Berry) and Large text, in the Settings tab.
- Help tab with steps, tips and fixes for common errors.
- Updates tab with a plain-English log of every change.
- A Log box on the first tab that opens by itself on errors, with a Copy bug report button. A red Copy error button shows under any error.
- Optional Clan name box, optional Remember my key, and a banner when a new version is out.

## Privacy

- Your key is only saved if you tick "Remember my key", and then only in your own browser. Untick to delete it.
- Pictures go only to the AI company you pick, straight from your browser. There is no server of our own and no tracking.
- Theme, text size and the last sheet are stored on your device only.

## Known limits

- **OpenAI is not tested yet** and may not work. Anthropic and Google Gemini have been tested.
- Real runs of Record screen and the Clan name box are not tested yet. Phone layout was never checked.
- A long video skips more of the list, so keep videos short or use screenshots. Rows cut off at the top or bottom edge are skipped.
- The AI reads the names and points, so check any `?` or odd spelling by hand.
- Rate limits and other AI errors show as a general "The AI said no" message.
- Not tested with screen readers or keyboard-only use.

## For developers

- Plain static site: `index.html` (all the page's code) and `exceljs.bare.min.js` ([ExcelJS](https://github.com/exceljs/exceljs) 4.4.0, used to make and read `.xlsx`). No build step.
- The AI models are listed in `PROVIDERS` near the top of the script (`MODEL` is the Anthropic default). If a model is retired, change it there.
- Each change gets an entry in `UPDATE_LOG` in `index.html`.
- `python3 tests/check.py` is the auto check. It also runs on GitHub after every push.
- Hosted on Cloudflare Pages. Every push to `main` publishes automatically after about a minute.

## Disclaimer

For personal use only. Not an official Roblox, Anthropic, Google or OpenAI product. Provided as is, with no guarantees.

## Tests (for developers, optional)

`tests/excel-math.test.js` checks the sheet maths: points like "1.2M" turn into numbers, and Change, % Change, Trend and the Clan Summary box add up correctly. The page doesn't need it to run.

To run it from the repo folder:

1. `npm install exceljs@4.4.0` (test tool only, the page doesn't use it)
2. `node tests/excel-math.test.js`

It prints an error if a check fails. If LibreOffice isn't installed, the formula checks are skipped and only the points parsing is tested.

## Read the code (quick guide)

**TL;DR:** the whole page is one file, `index.html`. Search it for a word you see on screen. That's it.

### 1. What's in the repo (30 seconds)

| File | What it is | Open it? |
|---|---|---|
| `index.html` | The whole page | Yes |
| `README.md` | This guide | You're here |
| `STATUS.md` | What's done, what's next | Yes |
| `tests/check.py` | Auto check, runs on every push | No |
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

Search `index.html` for any of these names to jump straight there.

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
- Change one small thing in a copy of `index.html` (a button's words) and see what happens. You can't break the live site from your own computer.
- Stuck for more than 10 minutes? Ask an AI chat: "explain this like I'm new".
- Keep your first goal tiny: "I can read this one function".
