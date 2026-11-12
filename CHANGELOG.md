# Fishing Cat Data: every update

Newest first. The page itself shows only the newest 5.

## Page code moved to its own file

12 Nov 2026 (12:31 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/2999a40)

The page's code now lives in app.js, so the browser refuses any code sneaked into the page.

> [!NOTE]
> **What you'll see:** Nothing looks different

- Moved the script out of index.html into app.js; _headers no longer allows inline scripts.

## Shorter bug report help

12 Nov 2026 (12:28 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/a417f9b)

The help text under Copy bug report is shorter.

> [!NOTE]
> **What you'll see:** Settings, Log

- Shortened the bug report help text

## Less text on the Discord tab

12 Nov 2026 (12:27 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/5ecfcbf)

The Discord tab has shorter help text.

> [!NOTE]
> **What you'll see:** Discord tab

- Shortened the intro, webhook help and footer

## Simpler Discord tab

12 Nov 2026 (12:25 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/8bb1a01)

The Discord tab has fewer steps. Header picture and ping moved into More options, and the webhook help links to Discord's own guide.

> [!NOTE]
> **What you'll see:** Discord tab

- Link is step 1 with a short webhook line and Discord guide link, header picture and ping moved into More options, added a Stay safe line for support.discord.com

## Cut-off bill reply keeps what was read

12 Nov 2026 (12:22 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/089a57c)

If the AI reply stops halfway, the complete charges are kept instead of losing the whole bill run.

> [!NOTE]
> **What you'll see:** Bills tab; the Log says when it happened

- parseBills closes a cut-off reply at the last complete charge.

## Tidier Discord tab

12 Nov 2026 (12:19 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/d88006e)

The Discord link is now step 1 and its messages show right under the box. The webhook help folds away once a link is saved.

> [!NOTE]
> **What you'll see:** Discord tab

- Numbered the link as step 1, moved link messages under the box, folded the webhook help, showed the Untick note only when ticked

## Webhook help wording

12 Nov 2026 (12:17 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/0bb230c)

The webhook steps no longer have random capital letters.

> [!NOTE]
> **What you'll see:** Discord tab, under the link box

- Lowercased the step words in the webhook help

## Webhook help on the Discord tab

12 Nov 2026 (12:14 UTC) · New · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/6cf6ed8)

New people can see what a Discord webhook is and how to get one. A wrong link now says to copy it again.

> [!TIP]
> **What you'll see:** Discord tab, under the link box

- Added short webhook steps under the link box and clearer wrong-link message

## Ping box readable by screen readers

12 Nov 2026 (12:12 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/8904e69)

The Discord ping picker now has a name screen readers can say.

> [!NOTE]
> **What you'll see:** Bills or clan tab, Discord box

- Added a label to the ping picker; new readability test runs on GitHub.

## Zip bomb guard, risky-code scanner

12 Nov 2026 (10:58 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/e949de3)

A booby-trapped Excel file is refused instead of freezing the page; the update check gives up after 15 seconds.

> [!NOTE]
> **What you'll see:** Pick an earlier sheet or post an Excel file to Discord

- zipCheck before every Excel open; column loops capped at 400; version fetch timeout; tests/check.py scans for risky patterns

## Safer Discord posting, clearer grey text

12 Nov 2026 (10:51 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/2289668)

A slow upload no longer posts twice, a busy Discord gets one more try, and grey help text is easier to read.

> [!NOTE]
> **What you'll see:** Post to Discord; Light and Ocean themes

- Timeout stops instead of resending; 429 retry on the first message; long-message cut guard; darker muted colour

## Safe names in Discord posts

12 Nov 2026 (10:48 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/45186ff)

A player or bill name can no longer turn into a fake link or break the Discord message.

> [!NOTE]
> **What you'll see:** Post to Discord on either tab

- Names, roles, clan, game and bill text are escaped before posting

## No ping everyone

12 Nov 2026 (10:42 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/231ff87)

The Discord ping choice no longer has @here or @everyone, so the whole channel can't be pinged by mistake. Role pings stay.

> [!NOTE]
> **What you'll see:** Discord tab: the ping menu has Don't ping anyone and Ping a role only.

- Removed the @here and @everyone options and their code.

## Safer Discord posting

12 Nov 2026 (10:38 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/1980862)

Four Discord problems are fixed: the ping everyone choice is no longer remembered, a double tap can't post twice, a failed second message tells you the picture went but the breakdown did not (and retries once if Discord says slow down), and huge Excel files are refused.

> [!NOTE]
> **What you'll see:** Discord tab: tap Post twice quickly and only one post goes.

- Only the role ping is remembered; Post blocked while posting; one retry on Discord's slow-down; Excel files over 5 MB or 5000 rows are cut off.

## Discord post in two messages

12 Nov 2026 (07:42 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/afa5f12)

The picture comes first, right under the heading, and the written breakdown follows as a second message with less empty space.

> [!NOTE]
> **What you'll see:** Discord: message 1 is the heading and picture, message 2 is the breakdown. A ping only goes on message 1.

- Split the post in two; removed extra blank lines; long breakdowns get their own full message.

## Ping a Discord role

12 Nov 2026 (07:41 UTC) · New · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/87f0d00)

On the Discord tab you can pick Ping a role, paste your own role ID, and posts ping only that role.

> [!TIP]
> **What you'll see:** Discord tab, step 3 Ping (optional): Ping a role, with help on finding the role ID.

- Role pings use the role ID you paste (saved on this device); nobody else gets pinged.

## Green and red lines in the Discord post

12 Nov 2026 (07:40 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/7eb1f08)

Who went up shows green and who went down shows red in the Discord post.

> [!NOTE]
> **What you'll see:** Discord post: the Went up, New, Went down and Left the clan lists.

- Lists use Discord's diff colours: plus lines green, minus lines red.

## Optional ping on Discord posts

12 Nov 2026 (07:38 UTC) · New · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/43d6eec)

Pick Ping @here or Ping @everyone on the Discord tab; the default pings nobody.

> [!TIP]
> **What you'll see:** Discord tab, step 3 Ping (optional). Also fixed 'Gym Coachs' to 'Gym Coaches'.

- Added a ping choice (off by default).
- Fixed plurals in the role line.

## Discord breakdown with headers and per-person changes

12 Nov 2026 (07:38 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/43d6eec)

The Discord message has headers and lists each person's old points, new points and difference.

> [!NOTE]
> **What you'll see:** Discord post: Clan Members, What changed (Went up, Went down, New) and Points history.

- Per-person lines like Kiviix: 136,630 to 155,240 (+18,610); lists show 10 then and N more.

## Bullet points in the Discord breakdown

12 Nov 2026 (07:35 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/0db833c)

The written breakdown in the Discord post now uses short bullet points under each tab name.

> [!NOTE]
> **What you'll see:** Discord post text: bullets under Clan Members, Leaderboard and Points history.

- Turned the sentences into bullets.

## Discord post breaks down every tab

12 Nov 2026 (07:34 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/c250686)

The Discord message now reads the whole Excel file and explains Clan Members, Leaderboard and Points history in plain sentences.

> [!NOTE]
> **What you'll see:** Post a sheet to Discord: sections for each tab under the heading.

- Reads the Points history tab; message lists roles, top points, gains, drops, new and left members, clan total per run.

## Discord post breaks down the stats

12 Nov 2026 (07:30 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/0747fba)

The Discord message now shows average points, up, down, same and new counts, top gains, biggest drops and new members.

> [!NOTE]
> **What you'll see:** Post a sheet to Discord: the message under the picture has the full breakdown.

- Added a stats breakdown to the message for posted sheets (own files and just-made sheets).

## Tidier Discord message, no Excel on request

12 Nov 2026 (07:29 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/130bfa7)

The Discord message has a heading and bold numbers, and My own files now respects the Attach the Excel file tick, so you can post just the picture.

> [!NOTE]
> **What you'll see:** Discord: untick Attach the Excel file, pick your sheet, Post: only the table picture goes.

- New message layout (heading, date line, bold totals and change).
- Picked Excel files are only attached when the tick is on; the picture is drawn from them either way.

## Discord posts can't ping anyone

12 Nov 2026 (07:27 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/3d2381b)

A name like @everyone in a sheet can no longer ping your whole Discord server.

> [!NOTE]
> **What you'll see:** Nothing visible; Discord shows the name as plain text.

- Posts now tell Discord to ignore mentions.

## One tick for the Discord link

12 Nov 2026 (07:26 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/73f759a)

Removed the Forget link button; the tick now says Save my link on this device and unticking deletes it.

> [!NOTE]
> **What you'll see:** Discord tab, under the link box.

- Hid Forget link; renamed the tick; added a one-line hint.

## Bigger Discord buttons, clear options back

12 Nov 2026 (07:23 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/be59c53)

Discord tab has bigger buttons and choices, Choose files and Choose picture buttons, and Clear, Remove and Forget link show when there is something to clear.

> [!NOTE]
> **What you'll see:** Discord tab.

- Large option cards and buttons; Clear, Remove and Forget link visible when needed; old file names no longer shown.

## Log and bug report on the Discord tab

12 Nov 2026 (07:21 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/683e11e)

The Log and Copy bug report box now also shows at the bottom of the Discord tab.

> [!NOTE]
> **What you'll see:** Bottom of the Discord tab: Log: what the page did.

- Log box follows you to the Discord tab; it opens by itself on an error.

## Simpler Discord tab, one file picker

12 Nov 2026 (07:21 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/5c66d6c)

One file box takes your Excel sheet and/or photo; fewer buttons; a wrong file gives a plain message.

> [!NOTE]
> **What you'll see:** Discord tab: link, Remember tick, What to post, one Browse box, Post to Discord.

- Merged the two pickers into one that sorts files by type; hid Send a test, Forget, Clear and Remove (Settings still clears saved data).

## What the site does, on Home

12 Nov 2026 (07:20 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/2fe8212)

Home now explains what Fishing Cat Data is, what it can do and what it can't.

> [!NOTE]
> **What you'll see:** Top of Home, above the buttons.

- Added a short intro with What it can do and What it can't do.

## Intro above the key

12 Nov 2026 (07:19 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/78882e3)

The clan and Bills tabs start with a short paragraph about what the page does, and the tip sits above the AI key box.

> [!NOTE]
> **What you'll see:** Top of the clan and Bills tabs.

- Added an intro paragraph and moved the green tip above the key box.

## Simpler Discord tab

12 Nov 2026 (07:18 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/c369598)

The Discord tab is now three steps: pick what to post, optional header picture, one Post button.

> [!NOTE]
> **What you'll see:** Discord tab: link at the top, then What to post, Header picture, Post to Discord.

- Replaced the two posting boxes with one flow and one button; errors show under the button.

## Hint at the top of the clan tab

12 Nov 2026 (07:17 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/7bb4637)

The tip about More options, Log and the Discord tab is now a coloured note at the top.

> [!NOTE]
> **What you'll see:** Top of the clan tab, in a green note.

- Moved the hint from under the bars to the top and gave it a colour.

## Even gaps and Discord hint

12 Nov 2026 (07:16 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/d57265f)

Same gap above every bar on the clan tab; the hint no longer points to Discord under an arrow.

> [!NOTE]
> **What you'll see:** Clan tab: the More options and Log bars; Discord tab: file pickers fit the screen.

- Removed two odd gap settings; shortened the empty Log; made file pickers shrink to fit.

## Discord has its own tab

12 Nov 2026 (07:14 UTC) · New · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/1c9aa43)

Posting to Discord now lives in its own Discord tab, so the sheet tabs are less crowded.

> [!TIP]
> **What you'll see:** New Discord tab between Bills and GitHub. It posts your latest clan sheet or Bills sheet.

- Moved the Discord box and Post without the AI to a Discord tab.
- Errors from posting show in the Discord tab.

## Remove stray headings

12 Nov 2026 (07:14 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/b885d54)

Took out the two headings added last update; they ended up in the wrong place.

> [!NOTE]
> **What you'll see:** Bottom of the clan tab: the headings are gone.

- Removed the Share to Discord and Problems? headings.

## Sections for Discord and Log

12 Nov 2026 (07:12 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/62e6186)

The Discord box and the Log now sit under their own small headings, split from the sheet area.

> [!NOTE]
> **What you'll see:** Bottom of the clan tab: a line and a heading above Post to Discord and above Log.

- Added two headings with a divider line (Share to Discord, Problems?).

## Clear buttons on Post without the AI

12 Nov 2026 (07:15 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/47cafb8)

Each file box now has a Clear button, so you can take a picked sheet or photo back out.

> [!NOTE]
> **What you'll see:** Post without the AI: a Clear button next to Excel sheet and Photo.

- Clear button under each file picker; it empties the pick and the green tick.

## Even spacing

12 Nov 2026 (07:08 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/da8d26a)

Gaps between the bars are the same and the empty message areas no longer leave a big gap.

> [!NOTE]
> **What you'll see:** Clan and Bills tabs: bars evenly spaced.

- Empty message and progress areas take no space; bars use one gap.

## File selected messages

12 Nov 2026 (07:07 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/cbd0e891f40ce1ee31c783e63b1155069d46f99a)

When you pick a photo or sheet to post, the page says File selected.

> [!NOTE]
> **What you'll see:** Post to Discord (optional): green tick and the file name under each picker.

- Added 'File selected: name' under the Excel sheet, Photo and Header picture pickers.

## Discord picture redesign, post without AI, collapsible sections

12 Nov 2026 (07:07 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/8601d0e)

The Discord picture matches your mockup; you can post a saved sheet and photo with no AI; the add-pictures part collapses.

> [!NOTE]
> **What you'll see:** Post to Discord (optional): Post without the AI. Clan and Bills tabs: Add screenshots / Add bills bars.

- New picture design (artwork colour background, rounded table, medals, footer). Post a saved Excel sheet and/or photo without any AI. Add screenshots and Add bills are collapsible.

## Discord: shorter message and optional Excel file

12 Nov 2026 (07:04 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/8601d0e)

Untick Attach the Excel file to post without the download; the message is shorter when a picture goes with it.

> [!NOTE]
> **What you'll see:** Post to Discord (optional) box: Attach the Excel file tick box.

- Optional Excel attachment (remembered). With the picture, the message drops the top-gains and drops lists since the picture shows Change.

## Header picture shows it is saved

12 Nov 2026 (07:03 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/0bde9c2)

After you pick a header picture, a small preview and 'Picture saved' stay in the Discord box.

> [!NOTE]
> **What you'll see:** Open Post to Discord (optional): small picture next to Remove.

- Added a thumbnail and a clear saved message, also shown when you come back later.

## Post to Discord button in the Discord box

12 Nov 2026 (07:01 UTC) · New · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/f8548b7)

The Discord box has its own Post to Discord button.

> [!TIP]
> **What you'll see:** Open Post to Discord (optional): Post to Discord, Test, Forget.

- Post button added next to Test. It posts the current list; if there is none it says Make a list first.

## Plainer video tip

12 Nov 2026 (07:00 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/2c50fb5)

The video tip reads naturally.

> [!NOTE]
> **What you'll see:** Clan tab under the screenshot box.

- Reworded the video tip again.

## Simpler video tip

12 Nov 2026 (06:59 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/7b87251)

The video tip is one short sentence.

> [!NOTE]
> **What you'll see:** Clan tab under the screenshot box.

- Reworded the video scrolling tip.

## Key note moved next to the key

12 Nov 2026 (06:58 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/44f2624)

The 'Your key is safe here' note sits under the key box, not in the middle of the page.

> [!NOTE]
> **What you'll see:** Clan tab and Bills: note under the key box.

- Moved the key safety note into the key section.

## Sheet colours back

12 Nov 2026 (06:58 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/e561115)

The gold, silver and bronze ranks and the Owner and Coach colours are back in the sheet.

> [!NOTE]
> **What you'll see:** Make a sheet: top 3 ranks and roles are coloured again.

- Undid the fewer-colours change.

## Fewer colours

12 Nov 2026 (06:57 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/e3cbef6)

The sheet and preview only use colour for up, down, left the clan and check this.

> [!NOTE]
> **What you'll see:** Make a sheet: no gold, silver, bronze or role colours.

- Removed rank medal colours and Owner/Coach colours from the sheet and preview; the About tab colour key lists only what is left.

## Less clutter after a read

12 Nov 2026 (06:56 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/694e7ec)

After a read there are fewer lines of small print above the preview.

> [!NOTE]
> **What you'll see:** Run a Test or a sheet: short message, one note, then the preview.

- Shorter Test OK message, shorter earlier-members note, and the 'Looking for Discord' hint hides while a preview is showing.

## Ask before opening links

12 Nov 2026 (06:54 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/08709a4)

The page asks before it opens another website.

> [!NOTE]
> **What you'll see:** Tap any link to GitHub or Google: a box says which site and asks Open it?

- All links to other websites now ask first, naming the site.

## Clearer links at the top of Home

12 Nov 2026 (06:54 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/0e226e9)

The two links at the top say where they go and use the page's link colour.

> [!NOTE]
> **What you'll see:** Top of the Home tab.

- Renamed to Guide on GitHub and Free key from Google (opens Google); bold, link colour.

## Footer links easier to see

12 Nov 2026 (06:53 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/7423f10)

Stay safe, Privacy, Legal and GitHub links are bigger and in colour.

> [!NOTE]
> **What you'll see:** Bottom of every tab.

- Footer links now use the link colour, bold, 15px with more space to tap.

## Cleaner Stay safe page

12 Nov 2026 (06:52 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/2ac2398)

The Stay safe page is one short box plus one More detail box.

> [!NOTE]
> **What you'll see:** Stay safe: six short points, and all the extra detail under More detail.

- Merged the two top boxes and the six detail boxes into one short list and a single closed More detail section.

## Link cards on the GitHub tab

12 Nov 2026 (06:51 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/1610b22)

The GitHub tab shows a small preview card for each link.

> [!NOTE]
> **What you'll see:** GitHub tab: three cards (project, guide, update history).

- Replaced the two buttons with three preview cards. No new website is contacted: the previews are written into the page.

## Tidier Stay safe page

12 Nov 2026 (06:51 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/4615b26)

The Stay safe page is easier to follow.

> [!NOTE]
> **What you'll see:** Stay safe: open one box and the others close.

- Fixed 'The 5 big ones' (it listed six), clearer intro line, and only one detail box stays open at a time.

## Fix guide button place

12 Nov 2026 (06:50 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/8f52fd8)

The Read the guide button is on the GitHub tab.

> [!NOTE]
> **What you'll see:** GitHub tab.

- Moved the Read the guide button from the Safety page to the GitHub tab.

## Easier to read grey text, simpler GitHub tab

12 Nov 2026 (06:49 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/daa25d9)

Grey help words are darker and a bit bigger. The GitHub tab is simpler.

> [!NOTE]
> **What you'll see:** Any grey help line; the GitHub tab.

- Darker grey in all themes, 12px help text now 13px, removed the fake README preview, added a Read the guide button.

## Tidier Settings

12 Nov 2026 (06:49 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/dc0af66)

Settings is split into clear boxes.

> [!NOTE]
> **What you'll see:** Settings tab: Look, Updates, Privacy, and a closed AI model box.

- Grouped Settings into boxes with bold headings; AI model is closed until opened.

## Back to a calm look

12 Nov 2026 (06:48 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/2ad8fd8)

No gradients. Flat, calm colours with a colour stripe on each bar.

> [!NOTE]
> **What you'll see:** Whole page.

- Removed all gradients and the banner. Page looks as before, with the bars keeping their colour stripe.

## No emoji in the banner

12 Nov 2026 (06:47 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/2f1742a)

The banner is just the name now.

> [!NOTE]
> **What you'll see:** Top of the page.

- Removed the cat emoji.

## What the colours mean

12 Nov 2026 (06:46 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/4c50b1c)

The Home page explains the coloured bars.

> [!NOTE]
> **What you'll see:** Home tab: What the colours mean.

- Added a short closed section listing what blue, green, purple and grey bars are for.

## One look for the whole page

12 Nov 2026 (06:46 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/001fd61)

The header, tabs and main buttons now share one colour gradient.

> [!NOTE]
> **What you'll see:** Open the page: gradient banner, pill tabs, gradient Make my sheet.

- Gradient banner and pill tabs, soft page background, rounded card, tighter spacing. Each theme has its own second colour.

## Fair baseline for same-day runs

12 Nov 2026 (06:45 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/b985f84)

A run made earlier today no longer wipes out Change, % Change and Trend.

> [!NOTE]
> **What you'll see:** Make two sheets on the same day: Previous Points shows the last earlier day, not today's first run.

- If the last sheet was made today, the page compares with the last earlier day in its history. Also applied to the remembered last sheet.

## Gradient on section bars

12 Nov 2026 (06:41 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/8f99bd6)

The section bars now fade from colour to calm.

> [!NOTE]
> **What you'll see:** Clan tab: blue, green, purple and grey bars.

- Soft colour gradient behind each section heading, same stripe colours.

## Colour stripes on section bars

12 Nov 2026 (06:41 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/b69bb92)

Each closed section has its own colour stripe.

> [!NOTE]
> **What you'll see:** Clan tab: blue key, green More options, purple Discord, grey Log.

- Added a thin colour stripe to the left of each section bar.

## Easier to read menus

12 Nov 2026 (06:40 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/1abad8d)

The closed sections now look like clear buttons.

> [!NOTE]
> **What you'll see:** Clan tab: More options, Post to Discord, Log, AI company and key.

- Bigger bold headings with a border; one grey help line in the Discord section instead of three.

## Hint for hidden options

12 Nov 2026 (06:39 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/6c8fcf1)

A short note tells people where Discord, last sheet and the Log are.

> [!NOTE]
> **What you'll see:** Roblox clan sheet tab, under Make my sheet.

- Added one grey line pointing to the small arrows; More options now says what is inside.

## Compact clan tab

12 Nov 2026 (06:39 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/de9b327)

The clan tab is shorter: key, last sheet, Discord and Log are tucked into closed sections.

> [!NOTE]
> **What you'll see:** Roblox clan sheet tab: clan name, screenshots, Make my sheet. Everything else is under small arrows.

- AI key box closes once a key is saved. Last sheet and Test first moved under More options. Discord link and header picture moved under Post to Discord (optional).

## Buttons wrap on small screens

12 Nov 2026 (06:38 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/480ddb9)

The buttons under the table no longer run off the page.

> [!NOTE]
> **What you'll see:** Make a list: Download sheet, Add row, Post to Discord, Copy message, Reset wrap to a second line if needed.

- Button row under the clan and Bills tables now wraps.

## Last sheet kept automatically

12 Nov 2026 (06:38 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/4aaf91d)

The sheet you just made becomes your last sheet, so you don't pick it again.

> [!NOTE]
> **What you'll see:** Make a sheet, then refresh or start a new list: Last sheet is already filled in.

- Download or Post to Discord keeps the new sheet (names, points, history) on this device for the next run. Not used until the next list, so this list's changes stay right.

## Remember the game name

12 Nov 2026 (06:36 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/4aaf91d)

If the AI can't tell the game, the page uses the last game it recognised instead of 'Game'.

> [!NOTE]
> **What you'll see:** Run a clan with one screenshot where the game isn't clear.

- Last recognised game is kept on this device and used when the AI gives none. Listed under Privacy.

## Ad blocker note for Discord

12 Nov 2026 (06:34 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/8d28a1f)

The page warns that ad blockers can stop Discord posts.

> [!NOTE]
> **What you'll see:** Settings under the Discord link; also the error if Discord can't be reached.

- Added an ad blocker and privacy shield note to the Discord help line and the error message.

## Log shows Discord steps

12 Nov 2026 (06:34 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/f8e703e)

The Log and bug report now show what happened with Discord.

> [!NOTE]
> **What you'll see:** Post to Discord, then open Log.

- Log lines for: files sent and sizes, header picture used or not, Discord's answer and reason. The link is never written.

## Clear Discord error

12 Nov 2026 (06:33 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/a31cd1a)

If Discord can't be reached, the page says so in plain words.

> [!NOTE]
> **What you'll see:** Settings: Test with a bad link or ad blocker on.

- Discord network failures now show 'Could not reach Discord' and write the real reason in the Log.

## Table picture for Discord posts

12 Nov 2026 (06:31 UTC) · New · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/94abc40)

Post to Discord now also sends a picture of the table, with your header artwork on top.

> [!TIP]
> **What you'll see:** Settings: pick a header picture once. Then tap Post to Discord on a clan list or Bills.

- Page draws the table on a canvas (no AI, no package) and posts it with the message and the .xlsx. Clan: rank, name, role, points, change with gold, silver and bronze. Bills: simple charges table.

## Detailed Discord summary

12 Nov 2026 (06:25 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/950ccfc)

The Discord post and Copy message now say what changed: total change, who went up or down, top 5 gains, drops, new and missing members.

> [!NOTE]
> **What you'll see:** Copy message on a clan preview

- Longer change summary for Discord

## Discord link on the clan and bills tabs

12 Nov 2026 (06:23 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/b5889db)

The Discord link box moved from Settings to the Roblox clan sheet and Bills tabs.

> [!NOTE]
> **What you'll see:** Discord link box under the preview on both tabs

- Move Discord link box to the clan and bills tabs

## Look-alike names count as one player

12 Nov 2026 (06:22 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/63730e9)

If the AI misreads g as q (or 0/o, 1/i/l), the player is matched to their old row instead of showing up twice.

> [!NOTE]
> **What you'll see:** Leaderboard has no duplicate player

- Fold look-alike letters in name matching

## Better game name read

12 Nov 2026 (06:21 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/c9845f7)

The AI is now allowed to recognise the Roblox game from how the screen looks, so the sheet says the real game name instead of Game.

> [!NOTE]
> **What you'll see:** Sheet title shows the game name

- Looser game_name wording in the layout prompt

## Bug report hides your time zone

12 Nov 2026 (06:18 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/eec3d3e)

The bug report no longer includes your time zone. Its date is shown in UTC.

> [!NOTE]
> **What you'll see:** Copy bug report has no Pacific/Auckland line

- Remove time zone from the bug report

## Weak model only for the layout step

12 Nov 2026 (06:18 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/5b7abb2)

The smallest Gemini model now only does the quick layout step. Reading the member list and bills never use it, so lists are not left half empty.

> [!NOTE]
> **What you'll see:** Log never shows gemini-3.5-flash-lite on the list step

- Block flash-lite outside the layout step

## Post to Discord for bills

12 Nov 2026 (06:16 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/e491304)

Bills now has Post to Discord too, on tap only. It sends a short summary and the sheet.

> [!NOTE]
> **What you'll see:** Bills preview: Post to Discord

- Discord posting on Bills

## Post to Discord always shown

12 Nov 2026 (06:15 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/c6782c6)

Post to Discord now shows on every clan sheet. With no saved link it asks you to paste one.

> [!NOTE]
> **What you'll see:** Clan preview: Post to Discord

- Ask for the Discord link on the clan preview

## Discord link not saved by default

12 Nov 2026 (06:15 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/bb2a83f)

The Discord link is forgotten when you close the page unless you tick Remember my link. A Forget button clears it.

> [!NOTE]
> **What you'll see:** Settings: Remember my link and Forget

- Discord link kept in memory only by default

## Skip the busy Gemini model

12 Nov 2026 (06:13 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/a75c7d2)

After a backup model answers, the next steps start on it for 10 minutes instead of waiting on the busy one again.

> [!NOTE]
> **What you'll see:** Log says Starting on gemini-3.7-flash

- Remember the Gemini model that last answered

## Post to Discord

12 Nov 2026 (06:12 UTC) · New · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/6b2217a)

Optional Discord link in Settings. After a clan read, Post to Discord sends a short summary and the sheet. Copy message copies the summary.

> [!TIP]
> **What you'll see:** Settings has Discord link, clan preview has Post to Discord and Copy message

- Discord webhook posting, on tap only

## Slow Gemini switches model

12 Nov 2026 (06:10 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/a1a19b4)

If Google is slow, the page tries a backup model after 75s instead of waiting 3 minutes.

> [!NOTE]
> **What you'll see:** Log says Too slow. Switching

- Timeout now swaps to the backup Gemini model

## Clan history tab layout

12 Nov 2026 (06:06 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/6ac51d6)

The Points history tab shows its title and how-to-read box in full instead of cutting them off.

> [!NOTE]
> **What you'll see:** Open Points history in the clan Excel file: title complete, how-to-read box fully visible, no frozen column splitting it.

- Points history: how-to-read box and title fit the runs, only the top rows are frozen
- Bills Summary: no frozen column splitting the how-to-read box

## Bills Summary column widths

12 Nov 2026 (06:06 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/3d817d9)

The Bills Summary tab columns are wide enough to read again.

> [!NOTE]
> **What you'll see:** Open a bills sheet: Summary columns are wide, nothing is cut off and the how-to-read box shows in full.

- Summary bill columns set to 46 wide (they had dropped to the default narrow width)
- Taller how-to-read box

## Bill units from price rates

12 Nov 2026 (06:04 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/55b728d)

Bills where the AI wrote the price rate (c/unit, c/day) as the unit now still turn into kWh instead of being flagged.

> [!NOTE]
> **What you'll see:** A bill like the Genesis one no longer shows 'check: can't turn c/unit into kWh' on its usage rows.

- Units like c/unit, c/day and c/kWh are read by the part after the slash
- The AI is told to give the unit of the quantity, not the price rate

## Gemini daily limit handled

12 Nov 2026 (06:03 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/31a57cc)

When Google's free daily limit for a model is used up, the page switches to a backup model, or says plainly when it resets.

> [!NOTE]
> **What you'll see:** A 429 'per day' error now shows 'Switching to gemini-3.7-flash' in the Log, or a plain message with the reset time.

- Daily free-limit errors (429) switch to a backup Gemini model or show a clear message with the reset time

## Report on GitHub, filled in

12 Nov 2026 (06:01 UTC) · New · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/44c6db3)

After a problem, one tap opens a GitHub issue with the report already filled in.

> [!TIP]
> **What you'll see:** When something fails, the link under the Log says 'Report this error on GitHub'. Tap it: a public GitHub form opens with the title and report filled in. Nothing is sent until you press Submit there.

- Report on GitHub opens a filled-in issue form (page version, device, last 1800 characters of the Log; keys, pictures and AI replies left out)

## Safer Gemini backup models

12 Nov 2026 (05:58 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/e270dc3)

The busy-AI backups are now gemini-3.7-flash then gemini-3.5-flash-lite, and a backup that no longer exists is skipped.

> [!NOTE]
> **What you'll see:** Log shows which model each retry uses.

- Backup models changed to 3.7 flash then 3.5 flash-lite; a missing backup model moves on to the next

## Switch Gemini model when busy

12 Nov 2026 (05:55 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/82e9e37)

When Google says gemini-3.8-flash is overloaded, the retries now use older Gemini models, which are usually less busy.

> [!NOTE]
> **What you'll see:** Log shows 'Switching to gemini-3.7-flash for the next try.' after a busy error.

- Busy Gemini retries switch to gemini-3.7-flash, then gemini-3.6-flash

## Retry when the AI is busy

12 Nov 2026 (05:51 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/2f92a27)

When Google (or another AI company) says it is busy, the page waits a few seconds and tries again, up to 3 times, instead of failing at once.

> [!NOTE]
> **What you'll see:** A busy AI now shows 'The AI is busy... Trying again' in the Log and usually works on the second try.

- Automatic retries (3 tries) on busy-AI errors (500, 502, 503, 504) and dropped connections

## Stop Gemini bills running away

12 Nov 2026 (05:49 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/d863d8c)

Bill reads to Google Gemini now have a size cap and ask for JSON only, so a stuck reply can't run for minutes.

> [!NOTE]
> **What you'll see:** Make a bills sheet with Gemini: it should answer in well under a minute, or stop with a clear message.

- Gemini bill requests capped at 8192 tokens and set to JSON-only

## Console shows errors

12 Nov 2026 (05:46 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/d64a74f)

The Log now catches and shows page errors, blocked requests, failed loads and browser warnings, with errors in red.

> [!NOTE]
> **What you'll see:** Any error or failure appears in red in the black Log, and the Log opens by itself when one happens.

- Page errors, security-rule blocks, failed file loads and console errors and warnings are recorded
- Errors red, warnings amber, Log opens on an error

## Black Log box

12 Nov 2026 (05:46 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/c5ea7c4)

The Log now looks like a live console: dark, easy-to-read text that scrolls to the newest line.

> [!NOTE]
> **What you'll see:** Run a sheet and watch the Log: black box, newest line always visible, drag the corner to make it taller.

- Log box is dark with monospace text, scrolls to the newest line, can be resized

## Much more detailed Log

12 Nov 2026 (05:41 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/f26e58c)

The Log and bug report now record timings, sizes, AI token counts and error details so slow or failed runs can be diagnosed.

> [!NOTE]
> **What you'll see:** Run a bill or clan sheet, then Copy bug report: it now has a device block, photo sizes, what was sent, how long the AI took and how many tokens it used.

- Log shows photo sizes, request size, AI settings, HTTP status, AI token counts and tokens a second
- Failed runs log the full error reply and the code location
- Bug report starts with page version, model, screen, connection and device

## Clearer bills sheet

12 Nov 2026 (05:37 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/c96fc6d)

The bills Excel file now opens on a Summary that a new person can follow.

> [!NOTE]
> **What you'll see:** Make a bills sheet and open it: Summary is the first tab, in sections (About the bill, Does it add up?, Energy used, Cost by type, In plain words).

- Summary is now the first tab, in labelled sections
- New row 'Same as the bill?' says Yes or No: check the charges
- Cost by type moved up above the AI's words
- Plainer column names on the Bills tab

## Tidier safety and privacy lists

12 Nov 2026 (05:35 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/5f27f5c)

The tick lists on Stay safe and Privacy now read as normal sentences.

> [!NOTE]
> **What you'll see:** Open Stay safe and Privacy: ticks on the left, each sentence in one block, bold words and links inline.

- Fixed bold words and links breaking out of the tick lists
- Privacy list now uses the same tick style as Stay safe, with a ! on the two warnings

## Stay safe page reassures, Bills gets Test first

12 Nov 2026 (05:31 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/cac3fc3)

Stay safe now says plainly what happens to your pictures and key, and the Bills tab has a Test button like the clan tab.

> [!NOTE]
> **What you'll see:** Stay safe: a panel at the top with ticks. Bills tab: a Test first button under Make my sheet.

- Stay safe: panel saying pictures go straight to the AI company, there is no server of ours, nothing is tracked
- Stay safe and Help sections use the same small arrows as Home
- Bills: Test first (one photo, no file) fills the preview
- Sample photos removed from the GitHub guide

## Home tidy-up

12 Nov 2026 (05:28 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/0f6c071)

The Home page no longer repeats the footer, the section arrows match the page and the tab row stays on one line.

> [!NOTE]
> **What you'll see:** Open Home: one tidy row of tabs, a small arrow on each section, no repeated footer line.

- Removed the repeated 'built by Claude' line on Home
- Section headings use a small arrow instead of the browser's black triangle
- Tab row scrolls sideways instead of wrapping

## Bills sheet simpler, Home steps line up

12 Nov 2026 (05:27 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/2b437c5)

The bills sheet shows fewer columns and plainer words, and the numbered steps on Home no longer break into columns.

> [!NOTE]
> **What you'll see:** Home: the steps read as sentences. Bills sheet: fewer columns, and the Summary names each note.

- Home steps keep links and bold words in the sentence
- Bills tab hides the repeated and printed columns (still there, unhide to see)
- Bill column says Bill 1, Bill 2
- Summary: plainer row names and a name for each plain-words note

## Home page colours

12 Nov 2026 (05:24 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/cbd527f)

The Home page now uses the theme colour for headings, steps and the safety box.

> [!NOTE]
> **What you'll see:** Open Home in any theme: section headings have a coloured bar, the steps are numbered circles and the safety part is tinted.

- Coloured section headings and numbered steps on Home
- Safety section tinted, follows the chosen theme

## Home sections fold up, links at the top

12 Nov 2026 (05:23 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/7a53a58)

The Home page sections now open and close, with a link to the full guide and the free key at the top.

> [!NOTE]
> **What you'll see:** Open the page: tap a heading on Home to open or close it.

- Home sections collapse (How to use it open by default)
- Links to the GitHub guide and the free key sit at the top

## Home page carries a short version of the guide

12 Nov 2026 (05:22 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/a3d009e)

The Home page now has a shortened copy of the README: how to use it, what you get, safety and limits.

> [!NOTE]
> **What you'll see:** Open the page: Home lists the steps, what is in the sheet, safety and good to know.

- Home: how to use it, what you get, is it safe, good to know, link to the full guide

## Bills sheet: colours, how to read, tidy layout

12 Nov 2026 (05:21 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/ffefa4c)

The bills Excel file now has colours and explains itself at the top of both tabs.

> [!NOTE]
> **What you'll see:** Make a bills sheet: each bill has its own row colour, green means worked out by the sheet, and a How to read strip sits at the top.

- How to read strip with a colour key on Bills and Summary
- Rows shaded per bill, plain column names, printed vs number columns marked
- Summary: green for worked-out rows, blue notes, wider columns

## New Home page for newcomers

12 Nov 2026 (05:18 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/b2d4d19)

The Home page now explains the page in plain words for people who have never seen it.

> [!NOTE]
> **What you'll see:** Open the page: Home says what it does, what you need, what you get and whether it is safe.

- Home rewritten in plain words
- New sample picture: the Leaderboard tab

## Bills: PDFs

12 Nov 2026 (05:17 UTC) · New · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/55cb71f)

The Bills tab now takes PDF bills as well as photos.

> [!TIP]
> **What you'll see:** Bills tab: tap the box, choose a PDF bill, then Make my sheet.

- PDF bills accepted (up to 8 MB each) with Gemini or Anthropic; OpenAI says it can't read PDFs

## Roblox clan preview

12 Nov 2026 (05:15 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/f46863b)

The clan preview is now titled Roblox clan preview.

> [!NOTE]
> **What you'll see:** Read a clan: the table under the message says Roblox clan preview.

- Preview title and messages say Roblox clan preview

## Wording catches up

12 Nov 2026 (05:15 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/8538575)

Privacy text now says past runs are saved with the last sheet.

> [!NOTE]
> **What you'll see:** Settings, Privacy: the last sheet line mentions past runs.

- Privacy wording covers the saved history

## Test read shows the preview

12 Nov 2026 (05:11 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/1ee8c75)

Test read now shows the Check your list table, not just three names.

> [!NOTE]
> **What you'll see:** Add a picture, tap Test read: the list appears under the message.

- Test read fills the Check your list table from the first picture

## Video: scrolling list no longer thrown away

12 Nov 2026 (05:09 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/7864975)

A video that scrolls the member list now keeps the pictures where the list moved.

> [!NOTE]
> **What you'll see:** Upload a short scrolling video of the clan list: the Log should say more than 1 picture was sent and all members are read.

- Picture comparison now notices small changes, so scrolled frames are no longer dropped as repeats

## Preview matches the sheet

12 Nov 2026 (05:08 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/7cbd1fa)

The Check your list preview now treats a misread name as the same player, and says who is missing.

> [!NOTE]
> **What you'll see:** Run a clan read with an earlier sheet and look at Check your list.

- Preview uses the same name matching as the Excel file
- A line shows how many earlier members are not in this list

## Video: take more pictures of a short scroll

12 Nov 2026 (05:07 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/2893086)

A quick scroll through the member list no longer skips members.

> [!NOTE]
> **What you'll see:** Upload a short scrolling video of the clan list: every member should be read.

- Video pictures taken 4 a second (was 1), at least 8; repeats still dropped

## Faster Gemini reads

12 Nov 2026 (05:05 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/da894dc)

Gemini now uses light thinking for every read, not just the first step.

> [!NOTE]
> **What you'll see:** Run a clan read and check the Log for how many seconds the AI took.

- Gemini asked for light thinking on the member read and on bills

## About and How it's worked out: colours and formatting

12 Nov 2026 (05:04 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/bdf0357)

The two text tabs now match the rest of the sheet.

> [!NOTE]
> **What you'll see:** Download a clan sheet and open About this sheet and How it's worked out.

- Navy headers, boxed shaded rows, wrapped text
- About has a colour key: green, red, gold, silver, bronze, grey

## Misread names count as the same player

12 Nov 2026 (05:03 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/0776a6a)

If the AI reads a name with one wrong letter, the player is no longer split in two.

> [!NOTE]
> **What you'll see:** Run a clan with an earlier sheet: a player the AI spelled slightly differently keeps their history.

- A name that differs by one letter (6+ letters) from a missing earlier name is matched to it

## Video recording tip

12 Nov 2026 (05:02 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/7317b50)

The clan tab now says how long to record.

> [!NOTE]
> **What you'll see:** Open the Clan sheet tab: a grey line under the upload box.

- Tip: scroll the whole list slowly, about 1 second per 5 members

## Leaderboard and Points history: colours and a How to read line

12 Nov 2026 (04:58 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/fc8ee3b)

The two history tabs now look like the main sheet and explain themselves at the top.

> [!NOTE]
> **What you'll see:** Download a clan sheet and open the Leaderboard and Points history tabs.

- How to read line with a colour key at the top of both tabs
- Gold, silver, bronze for the top 3, green and red for gains, grey for players who left
- Boxes, shaded rows and a marked Clan total row on Points history

## Clan Members tab first, history fixes

12 Nov 2026 (04:54 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/7db9458)

The clan sheet opens on Clan Members again, and history now starts from your earlier sheet.

> [!NOTE]
> **What you'll see:** Download a clan sheet with an earlier sheet chosen: Clan Members is the first tab and the Leaderboard shows points gained.

- Clan Members is the first tab, Leaderboard second
- An earlier sheet with no history now becomes the first history column
- Leaderboard numbers show in phone previews
- Earlier months fold into one column
- Empty Season Info box removed, shorter About tab

## Clan history in the Excel file

12 Nov 2026 (04:51 UTC) · New · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/a4436ab)

The clan sheet now keeps history instead of only showing the last change.

> [!TIP]
> **What you'll see:** Download a clan sheet: there are new Leaderboard, Points history and How it's worked out tabs. Choose last week's sheet as the earlier sheet and the history carries on.

- Leaderboard tab ranked by points gained, with best run and average per day
- Points history tab with one column per run and a clan total
- How it's worked out tab with plain-words examples
- No extra AI use: old numbers come from the earlier sheet

## Faster first step

12 Nov 2026 (04:27 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/efa5bd2)

The first step no longer holds up the run.

> [!NOTE]
> **What you'll see:** Working out the game now gives up after 20 seconds and carries on.

- First step asks Gemini for light thinking
- First step waits 20 seconds at most, then uses the usual layout

## Sample on Home

12 Nov 2026 (04:25 UTC) · New · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/43fddac)

Home now shows a sample of the sheet you get.

> [!TIP]
> **What you'll see:** Home tab, under the two buttons: What you get.

- Sample sheet picture on the Home tab

## Home button renamed

12 Nov 2026 (04:23 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/220c166)

The Home button now says Make a Roblox clan sheet.

> [!NOTE]
> **What you'll see:** The big button on Home.

- Home button says Make a Roblox clan sheet

## Tab renamed again

12 Nov 2026 (04:22 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/3091d72)

The tab is now called Roblox clan sheet.

> [!NOTE]
> **What you'll see:** The second tab at the top.

- Roblox clans tab renamed to Roblox clan sheet

## Tab renamed

12 Nov 2026 (04:21 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/5825692)

The Clan sheet tab is now called Roblox clans.

> [!NOTE]
> **What you'll see:** The second tab at the top.

- Clan sheet tab renamed to Roblox clans

## Log shows AI wait

12 Nov 2026 (04:18 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/0ae1e2c)

The Log now shows what is slow.

> [!NOTE]
> **What you'll see:** Log lines: size sent, still waiting every 10s, time to answer.

- Log shows size sent and a wait counter

## Security fixes

12 Nov 2026 (00:35 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/c92e4c4)

Closed holes found in a break test.

> [!NOTE]
> **What you'll see:** Nothing visible; the page is just safer.

- A huge junk AI reply can no longer freeze the page
- Your key is now hidden everywhere in the Log and bug report
- Odd model names and tab-started sheet cells are blocked

## Hosting wording

12 Nov 2026 (00:20 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/b9c8580)

The privacy note no longer names the web host.

> [!NOTE]
> **What you'll see:** Privacy page: says the page is hosted on a normal website host.

- Reworded the hosting line in the privacy page

## Privacy settings

12 Nov 2026 (00:14 UTC) · New · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/899f9ae)

Settings now shows what is saved on your device and lets you delete it or stop saving your last sheet.

> [!TIP]
> **What you'll see:** Settings tab: a Privacy section lists what is saved, with Forget my key and Delete everything saved.

- New Privacy section in Settings: what is saved, a Remember my last sheet switch, Forget my key, Delete everything saved
- Delete buttons need a second tap, and nothing is sent anywhere

## Bills download fix

12 Nov 2026 (00:11 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/f370a93)

Bills now show the check table first, and Download sheet makes the file.

> [!NOTE]
> **What you'll see:** Bills: after reading, the table shows and nothing downloads until you tap Download sheet.

- Fixed: the Bills sheet downloaded straight away and the Download sheet button did nothing

## Excel preview tidy

12 Nov 2026 (00:09 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/6d812b6)

The selected cell shows a clean green outline.

> [!NOTE]
> **What you'll see:** Tap a cell in the check table: green outline only.

- Removed the black focus ring inside preview cells

## Excel-style preview

12 Nov 2026 (00:09 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/4c3b562)

The check tables now look like the Excel sheet, so you can see what you will get.

> [!NOTE]
> **What you'll see:** After a read, the table has a green Excel bar, a cell box, column letters, row numbers and sheet tabs.

- Clan and Bills previews look like Excel, with the real column order and the calculated Change, % and Trend

## Check your charges first

12 Nov 2026 (00:08 UTC) · New · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/4c3b562)

After the AI reads your bills, you can fix charges and amounts in a table before the sheet is made.

> [!TIP]
> **What you'll see:** Bills: tap Make my sheet, check the table (it says if the charges match the bill total), fix cells, then tap Download sheet.

- New table after reading bills: fix type, charge and amount, add or delete a charge, or Reset
- Shows whether the charges add up to the total printed on the bill

## Check your list tidy

12 Nov 2026 (00:06 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/4c3b562)

The check table is easier to read.

> [!NOTE]
> **What you'll see:** Roles are no longer cut off and the buttons sit on one line.

- Wider role and name cells, one-line buttons, 'needs' wording

## Check your list first

12 Nov 2026 (00:06 UTC) · New · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/d3a398e)

After the AI reads the clan list, you can fix names and points in a table before the sheet is made.

> [!TIP]
> **What you'll see:** Clan sheet: tap Make my sheet, check the table (orange rows need a look), fix cells, then tap Download sheet.

- New table after reading: fix names, roles and points, add or delete rows, or Reset
- Shows if the screen member count differs from rows read
- The sheet downloads from the table when you tap Download sheet

## Roblox wording back

12 Nov 2026 (00:00 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/d3a398e)

The page says Roblox again. It works for clans in any Roblox game.

> [!NOTE]
> **What you'll see:** Footer and Home say any Roblox game, and files are named Roblox - game - clan.

- Put Roblox back in the wording, file names and AI instructions
- Home and Clan sheet say any Roblox game

## Clearer disclaimer

12 Nov 2026 (23:59 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/c18da4f)

The small print is easier to read.

> [!NOTE]
> **What you'll see:** Footer and Stay safe say: Not connected to any game company, Anthropic, Google or OpenAI.

- Reworded the not-official line

## Any game naming

12 Nov 2026 (23:58 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/7ff2ada)

The page no longer says Roblox. Files are named after the game and clan, and the notes say any game.

> [!NOTE]
> **What you'll see:** Make a clan sheet: the file is named like Gym League - Loki.xlsx, with no Roblox in front.

- Clan files are named game - clan, without the word Roblox
- On-screen text and the AI's instructions say any game
- Footer and Stay safe say not an official product of any game

## Easier to read

12 Nov 2026 (22:52 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/65f8ab5)

The live steps and the log are bigger and clearer.

> [!NOTE]
> **What you'll see:** Tap Make my sheet: the current step is bold, finished steps have a tick, and the log shows seconds since you started.

- Steps: bigger text, current step bold, ticks for finished steps
- Log: normal readable font, and seconds since the run started instead of the clock time

## Log shows live

12 Nov 2026 (22:51 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/6082274)

The log opens by itself when you tap Make my sheet and shows each step as it happens, on both tabs.

> [!NOTE]
> **What you'll see:** Tap Make my sheet on Clan sheet or Bills: the Log box opens under the button and fills line by line.

- Log box now appears on Bills too, and opens automatically during a run
- Each step is written to the log as it starts

## Live steps

12 Nov 2026 (22:48 UTC) · New · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/d36a289)

While a sheet is being made, the page shows each step and a timer.

> [!TIP]
> **What you'll see:** Tap Make my sheet: ticks appear under the button as each step finishes, with seconds counting.

- Live steps and a timer under the button on Clan sheet and Bills

## Updates moved to GitHub

12 Nov 2026 (22:37 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/0402d7c)

The Updates tab is gone. The update history now lives on GitHub only.

> [!NOTE]
> **What you'll see:** The tab bar has no Updates tab. The GitHub tab links to the CHANGELOG.

- Removed the Updates tab and its list
- GitHub tab links to the update history

## Bills summary by type

12 Nov 2026 (22:37 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/2c17d4d)

The Summary tab now shows the cost of each bill type, so water, phone and internet bills show up.

> [!NOTE]
> **What you'll see:** Bills tab, make a sheet, open Summary: a Cost by type block sits under the main rows.

- Summary: new Cost by type block (Electricity, Gas, Water, Phone and so on) worked out by the sheet
- Bill type words are cleaned to letters only before they go in a formula

## All household bills

12 Nov 2026 (22:35 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/b9a47fe)

The Bills tab now reads any household bill, not just power and gas.

> [!NOTE]
> **What you'll see:** Bills tab: add a water, phone or internet bill photo. Its rows show Water, Phone and so on, with no kWh.

- Bills tab and Home button now say Bills and cover water, internet, phone, rates and insurance
- Non-energy charges get their own type and are never turned into kWh
- Sheet tab renamed from Energy bills to Bills

## Home page

12 Nov 2026 (22:29 UTC) · New · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/3909a1a)

A Home tab now opens first and explains the page for new people.

> [!TIP]
> **What you'll see:** Open the page: Home shows first, with buttons to Clan sheet and Energy bills.

- New Home tab with what it does, how it works and what you need
- Tabs renamed: Games is now Clan sheet, Bills is now Energy bills

## Record screen removed

12 Nov 2026 (22:14 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/27bbc77)

The Record screen button is gone. It only worked in some PC browsers and was never tested in a real run. Record with your own device and upload the video instead.

> [!NOTE]
> **What you'll see:** No Record screen button on the Games tab.

- Record screen button and its pop-up window removed
- Screenshots and video upload work as before
- About 60 lines of code gone

## Clearer tab names

12 Nov 2026 (22:13 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/c2138e8)

The two tools are now called Games and Bills, which says what they are for.

> [!NOTE]
> **What you'll see:** The first two tabs, and a grey line under each.

- Clan sheet tab is now Games
- Energy bills tab is now Bills
- One grey line at the top of each says what it does

## Energy bills

12 Nov 2026 (21:57 UTC) · New · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/573e629)

A second tool on the page. Add photos of power or gas bills and get a sheet of every charge, with usage turned into kWh so bills from different countries can be compared.

> [!TIP]
> **What you'll see:** A new Energy bills tab next to Clan sheet.

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

> [!NOTE]
> **What you'll see:** Big batches of screenshots work. A stuck run ends with a message instead of waiting forever.

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

> [!NOTE]
> **What you'll see:** Fewer failed runs, and plainer red messages when something does fail.

- Odd AI replies (extra text, nested or wrapped lists) are still read
- Names, roles and points are cleaned: no hidden characters, no huge values
- Points like 1.2.3K are flagged, not guessed; T (trillion) is understood
- If the layout step fails, the usual layout is used and the run carries on
- Plain messages for a bad key, pictures that are too big, and unreadable replies or files
- Empty files are skipped

## Faster to open

11 Nov 2026 (10:45 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/7df947d)

The big Excel part now loads only when you add pictures, so the page opens much faster. Videos are read once per run. Leftover code was removed.

> [!NOTE]
> **What you'll see:** No visible change. The page opens quicker, most of all on phones.

- Excel part (863 KB) loads when needed, not on every visit
- Videos are read once per run, not twice
- Old one-clan prompt removed
- One save-a-setting helper instead of three
- Repeated text and styles merged

## Lighter page

11 Nov 2026 (10:41 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/ad78132)

The page now shows the 5 newest updates. The full history moved to GitHub, with nothing removed.

> [!NOTE]
> **What you'll see:** A link under the Updates list: Older updates on GitHub.

- Full update history is in CHANGELOG.md on GitHub
- Updates tab shows the newest 5
- Old patch notes moved to GitHub too

## Bug hunt fixes

11 Nov 2026 (10:39 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/68cef60)

A full check of the code found five bugs. Long videos lost the end of the list, some videos made the page wait forever, a cut-off AI reply lost every row, and the sheet date could be a day out.

> [!NOTE]
> **What you'll see:** Long videos give fuller sheets. Bad videos show a red message instead of hanging.

- Videos: pictures are taken from the whole video, not just the start
- Videos that can't be read show an error instead of hanging
- Cut-off AI replies keep the rows that arrived, with a warning
- More room for Anthropic replies (big clans)
- Unreadable names (?) are no longer merged into one row
- Date Recorded uses your local day

## GitHub preview

11 Nov 2026 (10:36 UTC) · New · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/63e1260)

The GitHub tab shows a small preview of the guide and what it covers.

> [!TIP]
> **What you'll see:** The box on the GitHub tab.

- Preview box listing the guide sections
- Full README guide restored and updated for Gemini first

## GitHub tab

11 Nov 2026 (10:35 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/01d5eb4)

The Help tab is now a GitHub tab. It has a short summary and a link. The guide is the README on GitHub.

> [!NOTE]
> **What you'll see:** The fourth tab, next to Settings.

- Help tab replaced by GitHub tab
- Old help sections removed
- Link opens GitHub in a new tab

## Help tab tidied

11 Nov 2026 (10:33 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/40dd524)

The Help tab now shows one guide, from README.md, with no repeated steps.

> [!NOTE]
> **What you'll see:** Top of the Help tab.

- Duplicate How to use steps removed
- Guide comes from README.md only

## Free key limit note and guide from README

11 Nov 2026 (10:30 UTC) · New · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/8029f61)

A grey line says the free Gemini key has a daily limit. The Help tab now shows the guide from README.md.

> [!TIP]
> **What you'll see:** Under the key box, and the top of the Help tab.

- Daily limit line under the key box
- Help tab loads README.md
- README.md added as the guide

## Google Gemini first

11 Nov 2026 (10:28 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/3fb71fd)

Google Gemini is now the default company. A free key link sits under the key box.

> [!NOTE]
> **What you'll see:** Company list starts with Google Gemini. Link appears when Gemini is picked.

- Gemini moved to the top of the company list
- Free key link (Google AI Studio) under the key box
- Stay safe notes the link

## Old code cleared out

11 Nov 2026 (10:16 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/1fc1bbf)

Two leftover bits of old code were deleted. Nothing changes on screen.

> [!NOTE]
> **What you'll see:** No visible change.

- Unused profile list removed
- Unused 'Old app' label code removed

## Tidier Updates

11 Nov 2026 (10:14 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/61fb1ec)

The Updates list is shorter: small steps are merged into bigger ones, each has a tag, and counts are gone.

> [!NOTE]
> **What you'll see:** Fewer lines, a New / Changed / Fixed tag on each, time shows when you hover.

- Old entries merged into 9 bigger ones
- Tags: New, Changed, Fixed
- Removed the change counts and time column

## Log and Updates tab

11 Nov 2026 (10:04 UTC) · New · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/2244702)

The log is on the first tab, and Updates are grouped by day with code links.

> [!TIP]
> **What you'll see:** A Log line under the buttons that opens by itself on errors. Day headings and View code changes links in Updates.

- Copy bug report is inside the Log
- Developer tab removed
- Each update links to its code on GitHub

## Google Gemini and OpenAI

11 Nov 2026 (10:03 UTC) · New · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/027f37a)

You can pick Google Gemini or OpenAI as well as Anthropic. Gemini is tested; OpenAI is not.

> [!TIP]
> **What you'll see:** An AI company box above the key box. Gemini shows no warning.

- AI model (advanced) box in Settings
- Browser lock allows Google and OpenAI
- OpenAI is still untested

## Record screen and fixes

11 Nov 2026 (10:02 UTC) · New · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/5942d14)

On a PC you can record your screen in the page. A small pop-up window shows what's captured and has Stop. Not tested in a real run.

> [!TIP]
> **What you'll see:** A Record screen (PC) button, a Clan name box, a big red Copy error button, and record status under the button.

- Pop-up works in Chrome, Edge and Opera only
- Skips repeated pictures, up to 30
- Videos keep up to 24 changed pictures
- Layout is read from 3 pictures, not 1
- Shorter key box and one-line footer

## Any game, no setup

11 Nov 2026 (09:47 UTC) · Changed · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/d560e43)

No profile list and no Add a game. The AI reads the game, clan and columns from your pictures.

> [!NOTE]
> **What you'll see:** Just upload and tap Make my sheet. Works for any Roblox game with a clan.

- Profile box removed
- One small extra AI read before the sheet
- Warns if fewer members were read than the screen shows

## Help when things go wrong

11 Nov 2026 (09:46 UTC) · New · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/1057102)

Errors say what is wrong, and one tap copies a report you can send.

> [!TIP]
> **What you'll see:** A red Copy error to send button under any red message. Specific messages for a bad key, no credit, or a busy AI.

- Keys are removed from the copy
- Warns about ? rows and ranks out of order
- Keyboard and screen-reader labels

## Banner and Remember my key

11 Nov 2026 (09:25 UTC) · New · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/0846db5)

The page says when there is a new version, and you can tick a box to keep your key.

> [!TIP]
> **What you'll see:** A small banner with Refresh, a Settings switch for auto refresh, and a Remember my key tick box (off by default).

- Checks every 5 minutes
- Key is saved only in this browser
- Not for shared computers

## Safety and info pages

11 Nov 2026 (08:48 UTC) · New · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/648cdb5)

Safety locks, a Stay safe guide, Privacy and Legal pages, and a tidy footer. The page says plainly that Claude wrote it.

> [!TIP]
> **What you'll see:** A Your key is safe here card, a footer on every page, a Clear button for picked files, a red warning on a wrong address.

- Browser only allowed to talk to the AI companies
- 20 file limit
- Key box asks password managers not to save it
- Not an official Roblox or Anthropic product

## Excel sheet

11 Nov 2026 (08:56 UTC) · New · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/76c0d3a)

You get a nice Excel file, and an earlier sheet can be chosen to show who went up or down.

> [!TIP]
> **What you'll see:** Striped rows, filter, green and red Change cells, Season Info and Summary boxes. A green Last sheet box.

- Points are real numbers (52.51K becomes 52510)
- Previous Points, Change, % Change and Trend
- Last sheet is remembered on this device

## First web version

11 Nov 2026 (07:51 UTC) · New · [code](https://github.com/Ginger-Hermit/Fishing-cat-data/commit/8331ea8)

The first version of the page: screenshots, one game, Anthropic only. Video support was added the same day.

> [!TIP]
> **What you'll see:** Drop screenshots or a video and get a sheet.

- Screenshots, Loki profile, Anthropic only
- Video: MP4, MOV, WEBM, up to 12 frames
- Same AI instructions as the desktop app, repeated names removed

## Old patch notes (from the top of index.html)

- Review fixes: long videos are read to the end, broken videos no longer hang, cut-off AI replies keep their rows, date is your local day.
- GitHub tab shows a preview of what is on GitHub; full README guide restored.
- Help tab replaced by a GitHub tab (short summary, link, guide is the README).
- Help tab tidied: the duplicate How to use steps are gone, the guide comes from README.md.
- Free key daily-limit line, and the Help tab loads the guide from README.md.
- Google Gemini is now the first choice, with a free key link.
- Removed two unused bits of old code (no visible change).
- Updates list tidied: 9 merged entries, New/Changed tags, no counts, time on hover.
- Updates days are collapsible; today open, older days closed.
- Updates grouped by day with times and View code changes links.
- Log moved to the main tab (opens on errors); Developer tab removed.
- Gemini marked as tested.
- Clan name box; video/record keep changed pictures only; layout read from 3 pictures; bigger Copy error button; shorter key box and footer; removed history and duplicate lists.
- Record screen hint says to pick Roblox or Entire Screen.
- Record screen shows a small always-on-top window (live preview, picture count, Stop) on Chrome/Edge/Opera.
- Phone tip for screen recording.
- Record screen button (PC): grabs a still every 2 seconds, no video saved.
- Profile list removed; always auto-detect.
- Copy error to send button under red messages.
- Removed Add a game; new Any clan profile where the AI reads game, clan and columns from your first picture.
- Add a game is now Upload photo or video; the AI fills in clan, game, ranks and extra column, and the manual boxes sit under Edit by hand.
- Test read button (1 picture, no download).
- Add a game can read one screenshot and fill in the columns by itself.
- Add a game keeps the ranks and extra column boxes always reachable under "Change details".
- Profiles and files are named Roblox - Game - Clan.
- Add a game form simplified to clan name plus a game picker.
- Add a game wording made plainer, Saved notice, ready-made Anime Fighting Simulator button.
- Help and Stay safe pages brought up to date (Add a game, Remember my key, updates, bug report).
- Visible "Add a game" link under Profile.
- Heads-up before and after an automatic refresh.
- Add-a-game profiles (any Roblox clan screen), member count check. "New version ready" banner and an auto-refresh setting (checks version.txt on this site).
- Copy bug report button (Developer view) and Report a bug link.
- Optional "Remember my key on this device" tick box.
- Excel sheet restyled (change totals say "returning") to match the desktop version (banding, borders, filter, green/red change cells, Season Info and Summary boxes).
