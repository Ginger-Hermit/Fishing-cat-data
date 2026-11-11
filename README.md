# Fishing Cat Data

Turns Roblox clan screenshots or a screen recording into a ready-to-use Excel sheet: Rank, Username, Role and Points, with optional week-to-week change.

**Built entirely by Claude, an AI.** The author gave the ideas and tested it. The AI wrote all the code, this page and the notes.

**Use it:** https://fishing-cat-data.pages.dev

## How to use it

1. Pick your AI company (Anthropic, or the untested Google Gemini and OpenAI) and paste your own key.
2. Nothing to pick. The AI works out the game and clan itself.
3. Drop in screenshots of the member list, or a screen recording of you scrolling it.
4. Optional: choose last time's sheet to compare.
5. Tap **Make my sheet**. After about 20 seconds an Excel file downloads.

## What you get

- An Excel file named like `Roblox - Gym League - Loki.xlsx`.
- **Clan Members** tab: coloured ranks and roles, plus Rank, Username, Role, Points (as shown, e.g. `52.51K`) and Points (number, e.g. `52510`). The number column is a real number, so you can sort and add it.
- With a last sheet chosen: Previous Points, Change, % Change and a Trend arrow (new members show as "new"). These are formulas, so fixing a misread number updates them.
- **About this sheet** tab: what each column means.
- Anyone who appears in more than one picture is listed once.

## Features

- Screenshots (PNG, JPEG, WebP) or video (MP4, MOV, WEBM). From a video the page picks about one picture every 2 seconds, up to 12, right in your browser.
- Remembers your last sheet on this device so you don't have to pick it again (names and points only). Tap **Remove** to forget it.
- Themes (Auto, Light, Dark, Ocean, Forest, Berry) and Large text, in the Settings tab.
- Help tab with steps, tips and fixes for common errors.
- Updates tab with a plain-English log of every change.
- Developer view (link at the bottom of the first tab) with a code-changed list and a console of what the page did on the last run.

## Privacy

- Your key is only saved if you tick "Remember my key", and then only in your own browser. Untick to delete it.
- Pictures go only to the AI company you pick, straight from your browser. There is no server of our own and no tracking.
- Theme, text size and the last sheet are stored on your device only.

## Known limits

- **Google Gemini and OpenAI are not tested yet** and may not work. Only Anthropic has been tested.
- Only the Loki / Gym League profile exists so far.
- A long video skips more of the list, so keep videos short or use screenshots. Rows cut off at the top or bottom edge are skipped.
- The AI reads the names and points, so check any `?` or odd spelling by hand.
- Rate limits and other AI errors show as a general "The AI said no" message.
- Not tested with screen readers or keyboard-only use.

## For developers

- Plain static site: `index.html` (all the page's code) and `exceljs.bare.min.js` ([ExcelJS](https://github.com/exceljs/exceljs) 4.4.0, used to make and read `.xlsx`). No build step.
- The AI model is the `MODEL` constant near the top of the script. If that model is retired, change it there.
- Each change gets an entry in `UPDATE_LOG` in `index.html`.
- Hosted on Cloudflare Pages. Every push to `main` publishes automatically after about a minute.

## Disclaimer

For personal use only. Not an official Roblox, Anthropic, Google or OpenAI product. Provided as is, with no guarantees.

## Tests (for developers, optional)

`tests/excel-math.test.js` checks the sheet maths: points like "1.2M" turn into numbers, and Change, % Change, Trend and the Clan Summary box add up correctly. The page doesn't need it to run.

To run it from the repo folder:

1. `npm install exceljs@4.4.0` (test tool only, the page doesn't use it)
2. `node tests/excel-math.test.js`

It prints an error if a check fails. If LibreOffice isn't installed, the formula checks are skipped and only the points parsing is tested.

## How to read the code

You don't need to code to follow it. Start here.

**The files**
- `index.html`: the whole page. Looks, buttons and logic are all in this one file.
- `exceljs.bare.min.js`: a ready-made tool that builds the Excel file. Don't open it, it's unreadable on purpose (shrunk).
- `_headers`: the browser lock. Says the page may only talk to the AI companies.
- `version.txt`: the version number. The page compares it with its own to show the "new version" banner.
- `tests/check.py`: the auto check. It runs on every push and shouts if something is broken or unused.
- `STATUS.md` and `CLAUDE.md`: notes and rules for the AI that works on this.

**The steps, in order** (search `index.html` for these words)
1. `collectPictures`: turns your photos or video into pictures.
2. `pickProfile`: the AI reads the game, clan and layout.
3. `buildPrompt`: writes the question sent to the AI.
4. `ASKERS`: sends the pictures and question to the AI company you picked.
5. `parseRows`: turns the AI's reply into a list of members.
6. `buildWorkbook`: makes the Excel file.

**Tips**
- Lines starting with `//` are notes, not code.
- The first line of `index.html` is a plain-English note of the latest change.
- The Updates tab on the live page says in plain words what changed and links to the exact code.
- On a GitHub commit, green lines were added and red lines were removed.
