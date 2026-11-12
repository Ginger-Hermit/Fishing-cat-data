# Fishing Cat Data: every update

Newest first. The page itself shows only the newest 5.

## Bills download fix

12 Nov 2026 (00:11 UTC) · Changed

Bills now show the check table first, and Download sheet makes the file.

**What you'll see:** Bills: after reading, the table shows and nothing downloads until you tap Download sheet.

- Fixed: the Bills sheet downloaded straight away and the Download sheet button did nothing

## Excel preview tidy

12 Nov 2026 (00:09 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/6d812b6)

The selected cell shows a clean green outline.

**What you'll see:** Tap a cell in the check table: green outline only.

- Removed the black focus ring inside preview cells

## Excel-style preview

12 Nov 2026 (00:09 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/4c3b562)

The check tables now look like the Excel sheet, so you can see what you will get.

**What you'll see:** After a read, the table has a green Excel bar, a cell box, column letters, row numbers and sheet tabs.

- Clan and Bills previews look like Excel, with the real column order and the calculated Change, % and Trend

## Check your charges first

12 Nov 2026 (00:08 UTC) · New · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/4c3b562)

After the AI reads your bills, you can fix charges and amounts in a table before the sheet is made.

**What you'll see:** Bills: tap Make my sheet, check the table (it says if the charges match the bill total), fix cells, then tap Download sheet.

- New table after reading bills: fix type, charge and amount, add or delete a charge, or Reset
- Shows whether the charges add up to the total printed on the bill

## Check your list tidy

12 Nov 2026 (00:06 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/4c3b562)

The check table is easier to read.

**What you'll see:** Roles are no longer cut off and the buttons sit on one line.

- Wider role and name cells, one-line buttons, 'needs' wording

## Check your list first

12 Nov 2026 (00:06 UTC) · New · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/d3a398e)

After the AI reads the clan list, you can fix names and points in a table before the sheet is made.

**What you'll see:** Clan sheet: tap Make my sheet, check the table (orange rows need a look), fix cells, then tap Download sheet.

- New table after reading: fix names, roles and points, add or delete rows, or Reset
- Shows if the screen member count differs from rows read
- The sheet downloads from the table when you tap Download sheet

## Roblox wording back

12 Nov 2026 (00:00 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/d3a398e)

The page says Roblox again. It works for clans in any Roblox game.

**What you'll see:** Footer and Home say any Roblox game, and files are named Roblox - game - clan.

- Put Roblox back in the wording, file names and AI instructions
- Home and Clan sheet say any Roblox game

## Clearer disclaimer

12 Nov 2026 (23:59 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/c18da4f)

The small print is easier to read.

**What you'll see:** Footer and Stay safe say: Not connected to any game company, Anthropic, Google or OpenAI.

- Reworded the not-official line

## Any game naming

12 Nov 2026 (23:58 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/7ff2ada)

The page no longer says Roblox. Files are named after the game and clan, and the notes say any game.

**What you'll see:** Make a clan sheet: the file is named like Gym League - Loki.xlsx, with no Roblox in front.

- Clan files are named game - clan, without the word Roblox
- On-screen text and the AI's instructions say any game
- Footer and Stay safe say not an official product of any game

## Easier to read

12 Nov 2026 (22:52 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/65f8ab5)

The live steps and the log are bigger and clearer.

**What you'll see:** Tap Make my sheet: the current step is bold, finished steps have a tick, and the log shows seconds since you started.

- Steps: bigger text, current step bold, ticks for finished steps
- Log: normal readable font, and seconds since the run started instead of the clock time

## Log shows live

12 Nov 2026 (22:51 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/6082274)

The log opens by itself when you tap Make my sheet and shows each step as it happens, on both tabs.

**What you'll see:** Tap Make my sheet on Clan sheet or Bills: the Log box opens under the button and fills line by line.

- Log box now appears on Bills too, and opens automatically during a run
- Each step is written to the log as it starts

## Live steps

12 Nov 2026 (22:48 UTC) · New · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/d36a289)

While a sheet is being made, the page shows each step and a timer.

**What you'll see:** Tap Make my sheet: ticks appear under the button as each step finishes, with seconds counting.

- Live steps and a timer under the button on Clan sheet and Bills

## Updates moved to GitHub

12 Nov 2026 (22:37 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/0402d7c)

The Updates tab is gone. The update history now lives on GitHub only.

**What you'll see:** The tab bar has no Updates tab. The GitHub tab links to the CHANGELOG.

- Removed the Updates tab and its list
- GitHub tab links to the update history

## Bills summary by type

12 Nov 2026 (22:37 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/2c17d4d)

The Summary tab now shows the cost of each bill type, so water, phone and internet bills show up.

**What you'll see:** Bills tab, make a sheet, open Summary: a Cost by type block sits under the main rows.

- Summary: new Cost by type block (Electricity, Gas, Water, Phone and so on) worked out by the sheet
- Bill type words are cleaned to letters only before they go in a formula

## All household bills

12 Nov 2026 (22:35 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/b9a47fe)

The Bills tab now reads any household bill, not just power and gas.

**What you'll see:** Bills tab: add a water, phone or internet bill photo. Its rows show Water, Phone and so on, with no kWh.

- Bills tab and Home button now say Bills and cover water, internet, phone, rates and insurance
- Non-energy charges get their own type and are never turned into kWh
- Sheet tab renamed from Energy bills to Bills

## Home page

12 Nov 2026 (22:29 UTC) · New · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/3909a1a)

A Home tab now opens first and explains the page for new people.

**What you'll see:** Open the page: Home shows first, with buttons to Clan sheet and Energy bills.

- New Home tab with what it does, how it works and what you need
- Tabs renamed: Games is now Clan sheet, Bills is now Energy bills

## Record screen removed

12 Nov 2026 (22:14 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/27bbc77)

The Record screen button is gone. It only worked in some PC browsers and was never tested in a real run. Record with your own device and upload the video instead.

**What you'll see:** No Record screen button on the Games tab.

- Record screen button and its pop-up window removed
- Screenshots and video upload work as before
- About 60 lines of code gone

## Clearer tab names

12 Nov 2026 (22:13 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/c2138e8)

The two tools are now called Games and Bills, which says what they are for.

**What you'll see:** The first two tabs, and a grey line under each.

- Clan sheet tab is now Games
- Energy bills tab is now Bills
- One grey line at the top of each says what it does

## Energy bills

12 Nov 2026 (21:57 UTC) · New · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/573e629)

A second tool on the page. Add photos of power or gas bills and get a sheet of every charge, with usage turned into kWh so bills from different countries can be compared.

**What you'll see:** A new Energy bills tab next to Clan sheet.

- New Energy bills tab: one row per charge, with supplier, dates, usage, unit, amount and currency
- Usage is turned into kWh by the sheet: MJ, GJ, therms, and gas in m3 or CCF using the factors printed on the bill
- Summary tab: one column per bill, numbers by formula, plus a few plain lines written by the AI
- Bills in other number styles (98,60) and other currencies are read as printed; money is never converted
- The first tab is now called Clan sheet; the key box is shared by both tabs
- Every start button stays locked while any run is going, even if you type in the key box
- Fuzz test added: 675,000 scrambled replies, 3 bugs found and fixed

## Stress test fixes

11 Nov 2026 (10:55 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/cf2af59)

A second round of attacks: 30 big screenshots at once, 5 videos at once, an AI that never answers, switching company mid-run, 50 runs in a row. The weak spots were fixed.

**What you'll see:** Big batches of screenshots work. A stuck run ends with a message instead of waiting forever.

- Screenshots are saved smaller before sending (JPEG, 2000 px at most), so 30 phone screenshots fit
- A picture that can't be opened is named before anything is sent
- Limits checked first: 100 pictures and about 18 MB per run
- A stuck AI request stops after 3 minutes with a message
- The AI company can't be changed in the middle of a run
- Keys are hidden in the Log; the Log no longer grows forever
- CSV backup: names starting with = + - @ can't act as formulas

## Harder to break

11 Nov 2026 (10:49 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/ee5c215)

The page was attacked with about 50 kinds of bad input: broken AI replies, odd keys, junk files, tampered saved settings. Everything that gave a wrong sheet or a confusing message was fixed.

**What you'll see:** Fewer failed runs, and plainer red messages when something does fail.

- Odd AI replies (extra text, nested or wrapped lists) are still read
- Names, roles and points are cleaned: no hidden characters, no huge values
- Points like 1.2.3K are flagged, not guessed; T (trillion) is understood
- If the layout step fails, the usual layout is used and the run carries on
- Plain messages for a bad key, pictures that are too big, and unreadable replies or files
- Empty files are skipped

## Faster to open

11 Nov 2026 (10:45 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/7df947d)

The big Excel part now loads only when you add pictures, so the page opens much faster. Videos are read once per run. Leftover code was removed.

**What you'll see:** No visible change. The page opens quicker, most of all on phones.

- Excel part (863 KB) loads when needed, not on every visit
- Videos are read once per run, not twice
- Old one-clan prompt removed
- One save-a-setting helper instead of three
- Repeated text and styles merged

## Lighter page

11 Nov 2026 (10:41 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/ad78132)

The page now shows the 5 newest updates. The full history moved to GitHub, with nothing removed.

**What you'll see:** A link under the Updates list: Older updates on GitHub.

- Full update history is in CHANGELOG.md on GitHub
- Updates tab shows the newest 5
- Old patch notes moved to GitHub too

## Bug hunt fixes

11 Nov 2026 (10:39 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/68cef60)

A full check of the code found five bugs. Long videos lost the end of the list, some videos made the page wait forever, a cut-off AI reply lost every row, and the sheet date could be a day out.

**What you'll see:** Long videos give fuller sheets. Bad videos show a red message instead of hanging.

- Videos: pictures are taken from the whole video, not just the start
- Videos that can't be read show an error instead of hanging
- Cut-off AI replies keep the rows that arrived, with a warning
- More room for Anthropic replies (big clans)
- Unreadable names (?) are no longer merged into one row
- Date Recorded uses your local day

## GitHub preview

11 Nov 2026 (10:36 UTC) · New · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/63e1260)

The GitHub tab shows a small preview of the guide and what it covers.

**What you'll see:** The box on the GitHub tab.

- Preview box listing the guide sections
- Full README guide restored and updated for Gemini first

## GitHub tab

11 Nov 2026 (10:35 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/01d5eb4)

The Help tab is now a GitHub tab. It has a short summary and a link. The guide is the README on GitHub.

**What you'll see:** The fourth tab, next to Settings.

- Help tab replaced by GitHub tab
- Old help sections removed
- Link opens GitHub in a new tab

## Help tab tidied

11 Nov 2026 (10:33 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/40dd524)

The Help tab now shows one guide, from README.md, with no repeated steps.

**What you'll see:** Top of the Help tab.

- Duplicate How to use steps removed
- Guide comes from README.md only

## Free key limit note and guide from README

11 Nov 2026 (10:30 UTC) · New · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/8029f61)

A grey line says the free Gemini key has a daily limit. The Help tab now shows the guide from README.md.

**What you'll see:** Under the key box, and the top of the Help tab.

- Daily limit line under the key box
- Help tab loads README.md
- README.md added as the guide

## Google Gemini first

11 Nov 2026 (10:28 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/3fb71fd)

Google Gemini is now the default company. A free key link sits under the key box.

**What you'll see:** Company list starts with Google Gemini. Link appears when Gemini is picked.

- Gemini moved to the top of the company list
- Free key link (Google AI Studio) under the key box
- Stay safe notes the link

## Old code cleared out

11 Nov 2026 (10:16 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/1fc1bbf)

Two leftover bits of old code were deleted. Nothing changes on screen.

**What you'll see:** No visible change.

- Unused profile list removed
- Unused 'Old app' label code removed

## Tidier Updates

11 Nov 2026 (10:14 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/61fb1ec)

The Updates list is shorter: small steps are merged into bigger ones, each has a tag, and counts are gone.

**What you'll see:** Fewer lines, a New / Changed / Fixed tag on each, time shows when you hover.

- Old entries merged into 9 bigger ones
- Tags: New, Changed, Fixed
- Removed the change counts and time column

## Log and Updates tab

11 Nov 2026 (10:04 UTC) · New · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/2244702)

The log is on the first tab, and Updates are grouped by day with code links.

**What you'll see:** A Log line under the buttons that opens by itself on errors. Day headings and View code changes links in Updates.

- Copy bug report is inside the Log
- Developer tab removed
- Each update links to its code on GitHub

## Google Gemini and OpenAI

11 Nov 2026 (10:03 UTC) · New · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/027f37a)

You can pick Google Gemini or OpenAI as well as Anthropic. Gemini is tested; OpenAI is not.

**What you'll see:** An AI company box above the key box. Gemini shows no warning.

- AI model (advanced) box in Settings
- Browser lock allows Google and OpenAI
- OpenAI is still untested

## Record screen and fixes

11 Nov 2026 (10:02 UTC) · New · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/5942d14)

On a PC you can record your screen in the page. A small pop-up window shows what's captured and has Stop. Not tested in a real run.

**What you'll see:** A Record screen (PC) button, a Clan name box, a big red Copy error button, and record status under the button.

- Pop-up works in Chrome, Edge and Opera only
- Skips repeated pictures, up to 30
- Videos keep up to 24 changed pictures
- Layout is read from 3 pictures, not 1
- Shorter key box and one-line footer

## Any game, no setup

11 Nov 2026 (09:47 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/d560e43)

No profile list and no Add a game. The AI reads the game, clan and columns from your pictures.

**What you'll see:** Just upload and tap Make my sheet. Works for any Roblox game with a clan.

- Profile box removed
- One small extra AI read before the sheet
- Warns if fewer members were read than the screen shows

## Help when things go wrong

11 Nov 2026 (09:46 UTC) · New · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/1057102)

Errors say what is wrong, and one tap copies a report you can send.

**What you'll see:** A red Copy error to send button under any red message. Specific messages for a bad key, no credit, or a busy AI.

- Keys are removed from the copy
- Warns about ? rows and ranks out of order
- Keyboard and screen-reader labels

## Banner and Remember my key

11 Nov 2026 (09:25 UTC) · New · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/0846db5)

The page says when there is a new version, and you can tick a box to keep your key.

**What you'll see:** A small banner with Refresh, a Settings switch for auto refresh, and a Remember my key tick box (off by default).

- Checks every 5 minutes
- Key is saved only in this browser
- Not for shared computers

## Safety and info pages

11 Nov 2026 (08:48 UTC) · New · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/648cdb5)

Safety locks, a Stay safe guide, Privacy and Legal pages, and a tidy footer. The page says plainly that Claude wrote it.

**What you'll see:** A Your key is safe here card, a footer on every page, a Clear button for picked files, a red warning on a wrong address.

- Browser only allowed to talk to the AI companies
- 20 file limit
- Key box asks password managers not to save it
- Not an official Roblox or Anthropic product

## Excel sheet

11 Nov 2026 (08:56 UTC) · New · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/76c0d3a)

You get a nice Excel file, and an earlier sheet can be chosen to show who went up or down.

**What you'll see:** Striped rows, filter, green and red Change cells, Season Info and Summary boxes. A green Last sheet box.

- Points are real numbers (52.51K becomes 52510)
- Previous Points, Change, % Change and Trend
- Last sheet is remembered on this device

## First web version

11 Nov 2026 (07:51 UTC) · New · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/8331ea8)

The first version of the page: screenshots, one game, Anthropic only. Video support was added the same day.

**What you'll see:** Drop screenshots or a video and get a sheet.

- Screenshots, Loki profile, Anthropic only
- Video: MP4, MOV, WEBM, up to 12 frames
- Same AI instructions as the desktop app, repeated names removed

## Old patch notes (from the top of index.html)

Review fixes: long videos are read to the end, broken videos no longer hang, cut-off AI replies keep their rows, date is your local day. GitHub tab shows a preview of what is on GitHub; full README guide restored. Help tab replaced by a GitHub tab (short summary, link, guide is the README). Help tab tidied: the duplicate How to use steps are gone, the guide comes from README.md. Free key daily-limit line, and the Help tab loads the guide from README.md. Google Gemini is now the first choice, with a free key link. Removed two unused bits of old code (no visible change). Updates list tidied: 9 merged entries, New/Changed tags, no counts, time on hover. Updates days are collapsible; today open, older days closed. Updates grouped by day with times and View code changes links. Log moved to the main tab (opens on errors); Developer tab removed. Gemini marked as tested. Clan name box; video/record keep changed pictures only; layout read from 3 pictures; bigger Copy error button; shorter key box and footer; removed history and duplicate lists. Record screen hint says to pick Roblox or Entire Screen. Record screen shows a small always-on-top window (live preview, picture count, Stop) on Chrome/Edge/Opera. Phone tip for screen recording. Record screen button (PC): grabs a still every 2 seconds, no video saved. Profile list removed; always auto-detect. Copy error to send button under red messages. Removed Add a game; new Any clan profile where the AI reads game, clan and columns from your first picture. Add a game is now Upload photo or video; the AI fills in clan, game, ranks and extra column, and the manual boxes sit under Edit by hand. Test read button (1 picture, no download). Add a game can read one screenshot and fill in the columns by itself. Add a game keeps the ranks and extra column boxes always reachable under "Change details". Profiles and files are named Roblox - Game - Clan. Add a game form simplified to clan name plus a game picker. Add a game wording made plainer, Saved notice, ready-made Anime Fighting Simulator button. Help and Stay safe pages brought up to date (Add a game, Remember my key, updates, bug report). Visible "Add a game" link under Profile. Heads-up before and after an automatic refresh. Add-a-game profiles (any Roblox clan screen), member count check. "New version ready" banner and an auto-refresh setting (checks version.txt on this site). Copy bug report button (Developer view) and Report a bug link. Optional "Remember my key on this device" tick box. Excel sheet restyled (change totals say "returning") to match the desktop version (banding, borders, filter, green/red change cells, Season Info and Summary boxes).
