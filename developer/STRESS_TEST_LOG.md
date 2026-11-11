# Stress test log: how the page was broken, and what it taught us

11 November 2026. Written by Claude (an AI), which also ran the tests and made the fixes.
Page versions covered: `2026-11-11-ag` to `2026-11-11-ak`.

This is the long version, for developers and for future projects.
The short version for users is in [CHANGELOG.md](../CHANGELOG.md).

## 1. The short story

The page had only ever been tested by hand: one person, one clan, one browser, good pictures.
It worked for that. In one afternoon of deliberate abuse it turned out that:

- 5 bugs were found just by reading the code carefully.
- About 15 more weak spots were found by feeding the page bad input on purpose.
- None of them were security holes. Nearly all were "wrong sheet" or "confusing message" problems.
- Every one was cheap to fix once seen. The hard part was seeing them.

## 2. How the testing was done

Three rounds, each one going further than the last.

### Round 1: read all the code (the review)

Every function in `index.html` was read with one question: "what input makes this go wrong?"
No tools, just reading. This found the five bugs in section 3.1.

### Round 2: break test with pretend AI replies

The real page was opened in headless Chrome (Chrome with no window) and driven by a script.
Three tricks made this possible without a key and without spending anything:

1. **Fake the AI.** `window.fetch` was swapped for a function that returns whatever reply the test wants: good rows, broken rows, an error code, nothing at all.
2. **Catch the download.** The link's `click` was swapped so the finished file could be opened and its cells checked, instead of landing in a Downloads folder.
3. **Read the result off the page.** After each run the script reads the message box and checks whether it is red.

About 50 cases were run this way. Each is one line: what the AI "says", and what the page should do.

### Round 3: stress test

Same setup, but aimed at size, time and timing:

- 30 phone-sized screenshots at once (drawn in the browser to look like a member list).
- One 9000 x 9000 pixel picture.
- A corrupt picture mixed in with good ones.
- 5 videos at once. The test video was made with `ffmpeg` (a 40 second moving test pattern).
- An AI that never answers.
- Changing the AI company in the middle of a run.
- Tapping Test first and Make my sheet at the same moment.
- 50 runs in a row.
- The Excel part failing to load.
- Saved settings tampered with (script tags, nonsense values), then a reload.
- Every tab, in every theme and both text sizes, at phone widths of 360 and 320 pixels.

### Tools used

- Headless Chrome, controlled over its debugging port from a small Node script (no extra packages).
- `ffmpeg` to make test videos.
- `tests/rows.test.js` for the row-reading rules (now in the repo).
- `tests/check.py` after every change.

## 3. What broke

### 3.1 Found by reading the code

| What | What went wrong | Fix |
|---|---|---|
| Long videos | The page kept the first 24 changed pictures and stopped. The end of a long member list was silently lost. | Look at the whole video, then keep 24 spread evenly. |
| Unreadable videos | A video with no readable length or no picture made the page wait forever on "Reading...". | Reject with a plain message; give up on a stuck seek after 8 seconds. |
| Cut-off AI reply | If the reply ran out of room, the list had no closing bracket, so every row was thrown away. | Keep every complete row and warn that some may be missing. More reply room for Anthropic. |
| Unreadable names | Rows named `?` were treated as duplicates of each other, so only one survived. | `?` rows are never merged. |
| Date in the sheet | "Date Recorded" was stored in world time, so it could show yesterday or tomorrow depending on where you live. | Use the local calendar day. |

### 3.2 Found by the break test

| Attack | What went wrong | Fix |
|---|---|---|
| Reply with extra text containing `[1]` | Read, but with a false "cut short" warning. | Smarter fallback: only warn when no `]` follows the last row. |
| List inside a list | "No member rows found". | Flatten nested lists. |
| Points like `1.2.3K` | Guessed as 1,200. A wrong number with no warning is the worst kind of bug. | Stricter pattern; anything odd becomes a `?` to check. |
| Rank `1e99` or `-1` | Became rank 199 or 1. | Rank must be a whole number from 1 to 99,999, or it is left blank. |
| Name that is not text (a number, a list, `true`) | Went into the sheet as a number, a blob or TRUE. | Text and numbers become text; anything else drops the row. |
| 40,000-letter name, hidden control characters | Could make a file Excel refuses to open. | Clean and cap every value (`tidy`). |
| Layout step returns rubbish | The whole run failed, sometimes showing a raw programming error. | Fall back to the usual layout and carry on. |
| Layout says the clan name is a list or object | File named `[object Object]`. | Only real text is accepted. |
| AI answers with a web page instead of data | Raw error: `Unexpected token <`. | "The AI sent back something unreadable." |
| AI answers with nothing | Raw error about `null`. | Same plain message. |
| Error 400 (picture too big) | "Check the key", which is wrong. | "The AI turned the pictures down. They may be too big or too many." |
| Key with a stray space or non-English letter | "Check your internet", which is wrong. | Checked before sending, with its own message. |
| Empty file | Sent to the AI anyway. | Skipped. |
| Garbage "last sheet" file | Raw zip-file error. | "That file could not be read." |

### 3.3 Found by the stress test

| Attack | What went wrong | Fix |
|---|---|---|
| 30 big PNG screenshots | Nothing checked the total size. Real phone screenshots could go past what the AI accepts, after a long upload. | Every picture is re-saved as JPEG, 2000 px at most on the long side. |
| Corrupt picture | Sent as is; the AI's refusal did not say which file. | Each picture is opened first; the bad one is named. |
| 5 videos (120 pictures) | All sent in one request. | Limits: 100 pictures and about 18 MB, checked before any AI request is made. |
| AI never answers | The page waited forever with its buttons greyed out. | Requests give up after 3 minutes with a message. |
| Changing company mid-run | The second half of the run would go to the newly picked company, with the first company's key. | The company list is locked during a run. |
| Key repeated inside an AI error message | It would show in the on-screen Log. | Keys are masked in the Log, not only in the bug report. |
| Many runs | The Log grew without end. | Capped. |
| CSV backup with a name like `=HYPERLINK(...)` | Excel would treat it as a live formula. | A leading `'` makes it plain text. |

### 3.4 What held up with no changes

- **Script injection.** Names, roles, clan names, file names and tampered saved settings containing `<script>` or `<img onerror>` never ran. Reason: the page puts text on screen with `textContent`, never by building HTML from outside text.
- **Formulas in the Excel file.** `=HYPERLINK(...)` as a name is stored as text.
- **Error codes** 401, 404, 429, 500 and "no internet" already had clear messages.
- **Double taps.** Buttons are disabled during a run.
- **2,000-member clan.** Built correctly.
- **Phone widths.** No sideways scrolling in 70 combinations of tab, theme and text size.
- **Tampered saved settings.** Bad values are ignored and defaults used.

## 4. What could not be tested

Be honest about the gaps:

- **Real AI calls.** Every AI reply in these tests was pretend. Whether re-saving pictures as JPEG changes how well a real AI reads them is unknown.
- **Record screen.** Screen capture is blocked in the test browser. The code path for "cancelled or blocked" works; the recording itself was not exercised.
- **Firefox and Safari.** Only Chrome was used.
- **A real phone.** Widths were simulated. Nobody looked at it by eye.
- **Real Roblox pictures.** Test pictures were drawn to look similar.

## 5. Lessons for future projects

### 5.1 Anything that comes from outside is hostile until checked

"Outside" means: the AI's reply, the user's files, saved settings, the network.
The AI is the big one. It was treated as a careful colleague who always returns tidy data.
It should be treated as a stranger who usually returns tidy data.

Rule: **one function cleans each outside value, and nothing else touches it raw.**
Here that is `tidy` (text), `parsePoints` (numbers), `parseRows` (the list), `clean` (names for files).

### 5.2 A wrong answer is worse than no answer

`1.2.3K` becoming 1,200 looked like success. The user would never know.
When unsure, flag it (`?`) and say so in the result message. Never guess silently.

### 5.3 Every wait needs a way out

Two "wait forever" bugs were found (videos, AI requests). Both had the same cause:
waiting for something to happen, with no plan for it never happening.
Rule: **every wait gets a time limit and a message.**

### 5.4 Check limits before spending the user's time or money

The page used to upload everything and let the AI refuse.
Now it checks count and size first, before the first request.
Rule: **fail early, fail cheap, and say exactly which thing is the problem.**

### 5.5 Error messages are part of the product

Three messages blamed the wrong thing (key, internet). A wrong hint is worse than no hint,
because the user goes and "fixes" something that was fine.
Rule: **each message names the real cause, in plain words, with one thing to try.**
Raw programming errors never reach the screen; they go in the Log (`plain`).

### 5.6 Optional steps must not be able to kill the main job

The layout step is a nicety. Its failure used to stop the whole run.
Rule: **if a step only improves the result, its failure falls back to a default.**

### 5.7 Lock what must not change while work is in progress

Buttons were locked during a run; the company list was not.
Rule: **list everything the run depends on and freeze all of it.**

### 5.8 Do not make up facts in records

Earlier update entries had invented times. They were corrected from the real commit times.
Rule: **times, versions and hashes are read from the system, never typed from memory.**

### 5.9 Read before you overwrite

A 155-line README written in another session was replaced with a 20-line one, by a session that did not look first. It was restored from history.
Rule: **look at what is there, and pull the latest version, before writing a file.**

## 6. What should have been done at the beginning

If this project were started again tomorrow, in this order:

1. **Write the cleaning functions first.** Before any feature, decide what a valid name, rank and points value look like, and write the function that enforces it. Everything else is built on clean data.
2. **Write five "bad reply" tests on day one.** Empty, cut off, extra text, wrong types, hostile text. They take ten minutes and would have caught half of section 3.2.
3. **Build the fake-AI test harness early.** Testing with a real key is slow, costs money, and never produces the weird replies. A fake lets you test the 1-in-1000 reply any time.
4. **Give every network call a timeout from the first line.**
5. **Decide the size limits up front.** How many pictures, how many megabytes, how long a video. Write them down as named numbers at the top of the code.
6. **Shrink pictures before sending, from the start.** It is cheaper for the user and avoids a whole family of "too big" failures.
7. **Keep one changelog file from the first commit.** The history grew inside the page until it was a tenth of the file.
8. **Keep a "not tested" list from the first commit, and keep it honest.** `STATUS.md` did this well. It is the reason these gaps could be found quickly.
9. **Load big parts only when needed.** The 863 KB Excel part loaded on every visit for no reason.
10. **Add the licence on day one.**

## 7. A checklist to copy into the next project

Before calling any feature done, try each of these against it:

- [ ] Empty input
- [ ] Huge input (10 times the most you expect)
- [ ] Wrong type (a number where text should be, a list where one thing should be)
- [ ] Hostile text (`<script>`, `=FORMULA()`, 40,000 letters, hidden characters, emoji)
- [ ] The reply is cut off half way
- [ ] The reply never comes
- [ ] The reply is an error page
- [ ] The user taps twice, or taps something else mid-way
- [ ] The user changes a setting mid-way
- [ ] Saved settings contain rubbish
- [ ] A part of the page fails to load
- [ ] A phone-width screen, largest text size
- [ ] The same action 50 times in a row
- [ ] For each failure above: is the message true, plain, and does it say what to try?

## 8. Where the fixes live in the code

Search `index.html` for these names:

| Topic | Name |
|---|---|
| Cleaning one value | `const tidy` |
| Reading the AI's list | `function parseRows` |
| Reading points | `function parsePoints` |
| Shrinking pictures | `async function toPic` |
| Limits and one-time reading | `async function collectPictures`, `picCache` |
| Time limit | `aiWait`, `async function postJson` |
| Plain words for page faults | `const plain` |
| Layout fallback, key check | `async function pickProfile` |
| Video stills | `function videoFrames` |
| Key masking in the Log | `function clog` |
| CSV safety | `function toCsv` |
