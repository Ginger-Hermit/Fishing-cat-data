# Fishing Cat Data

Turns Roblox clan screenshots or a screen recording into a ready-to-use Excel sheet: Rank, Username, Role and Points, with optional week-to-week change.

**Use it:** https://fishing-cat-data.pages.dev

## How to use it

1. Paste your own Anthropic AI key.
2. Pick your profile.
3. Drop in screenshots of the member list, or a screen recording of you scrolling it.
4. Optional: choose last time's sheet to compare.
5. Tap **Make my sheet**. After about 20 seconds an Excel file downloads.

## What you get

- An Excel file named like `Loki - Gym League.xlsx`.
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

- Your key stays in the page and is never saved.
- Pictures go only to Anthropic, straight from your browser. There is no server of our own and no tracking.
- Theme, text size and the last sheet are stored on your device only.

## Known limits

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

For personal use only. Not connected to Roblox or Anthropic. Provided as is, with no guarantees.
