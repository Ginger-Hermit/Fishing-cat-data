# How to be lazy with Claude and get it to build your whole app on GitHub

**I don't code. I'm usually on my phone. Claude wrote every line of this app.** Here's the lazy recipe that worked, with the mistakes left in so you can skip them. (Written by Claude, 12 Nov 2026.)

> **The whole job in one line:** you're the boss and the tester. Claude is the builder. Say what you want, look at a picture, say "go", send a screenshot, repeat.

## The story: how this app really got built
It started with a boring chore. A Roblox clan leader scrolls the member list and types every player's points into a sheet by hand. The idea: take screenshots, let an AI read them, get an Excel sheet.

- **Day 1 (11 Nov):** a first working page that read screenshots into a sheet. Then came the first stress test: fake AI replies, bad pictures, weird numbers. About 20 weak spots turned up, all fixed. None were security holes; they were "wrong sheet" and "confusing message" problems.
- **The first host showed a popup,** so the page moved to a different free host, deployed straight from GitHub. The fix took one chat.
- **The AI bill worry:** the owner didn't want to spend her own credit, so the page switched to a free Google AI key. It worked first time.
- **Day 2 (12 Nov):** a Bills tab (photos of bills become a sheet), a Home page, a calmer look after "this looks tacky" (no gradients, no emoji), and an Excel file that keeps history week to week.
- **Then Discord:** post the result to a channel with a picture of the table and the Loki poster on top. The first version was crowded ("too much info", "so many buttons", "this seems hard to use"), so it was cut down three times, then split into its own tab.
- **Last:** a breakdown message with green and red lines, an optional role ping, a break-and-security report, and these guides.

The pattern every time: **owner says what's wrong, Claude shows a picture, owner says go, Claude builds, owner sends a screenshot.** About 100 small rounds of that, mostly from a phone.

## The 8 lazy moves

| # | Do this | Why it's lazy |
|---|---|---|
| 1 | **Ask for a mockup, not code.** Say "go" only when you like the picture. | Changing a picture is free. Changing finished code isn't. |
| 2 | **Make Claude write its own rules file.** *"Create CLAUDE.md with rules for working with me: plain words, mockups first, one bug per fix, warn before big jobs. Read it every chat."* | Say "do it this way" twice and it goes in the file. You never explain twice. |
| 3 | **Add a status file.** *"Create STATUS.md: what works, what's next, what is NOT tested."* | New chat? It reads the file. No handoffs, ever. |
| 4 | **Let Claude do the paperwork.** A release script (version, changelog, checks) plus GitHub tests on every push. | Your only job is spotting a red cross. |
| 5 | **Feedback = screenshots.** "Looks awful" plus a picture is enough. Say "too much info" and it simplifies. | No typing paragraphs. |
| 6 | **Make it attack itself.** *"Try to break this like a hostile user. List what you could NOT test."* | Found a hole where a player name could fake a link in Discord. |
| 7 | **Save tokens.** Search for the exact spot, send only changed files, warn before big jobs. | Pro limits are real. Plan big jobs for after your reset. |
| 8 | **Be the tester.** Claude can't hold your phone or post in your real Discord. | You run it for real, send a screenshot. That's the job. |

## Copy this starter prompt
> *"I do not code. Build me [your idea] as a web page in a GitHub repo. First show me a mockup. Create CLAUDE.md (rules for how we work) and STATUS.md (what works, what's next, what's untested). After each change run tests and update STATUS.md. Warn me before anything big. Keep words plain."*

## The only things your hands must do (and how long they take)
Claude writes everything. You do the parts that need *your* logins. Times are my estimates for a first time, not measured. The owner's real time wasn't recorded.

| Step | What you do | About |
|---|---|---|
| 1 | Make a free GitHub account | 5 min |
| 2 | Make a new repo (public is fine), connect Claude to *only that repo* | 5 min |
| 3 | Turn on **secret scanning** and **push protection** in the repo's Settings (blocks pushes with real-looking keys). Optional: turn on the **wiki** | 3 min |
| 4 | Make a free account at any static-site host | 5 min |
| 5 | In the host: **connect to GitHub**, pick the repo and main branch. Build command **empty**, publish folder **the root**. Deploy | 5 to 10 min |
| 6 | Wait for the first deploy, open the link on your phone | 2 min |
| 7 | One real run, send Claude a screenshot | 5 to 10 min |

**Total: roughly 30 to 45 minutes, once.** After that there is nothing to set up. Claude pushes, the host sees it, and the site updates by itself in about a minute. The hardest part is the sign-in and permission screens, not anything technical. If you get stuck on one, screenshot it and ask Claude.

**Privacy first:** hide your email (use GitHub's private noreply address before the first push). Your host's name may show in your web address. Never commit a key. Treat Discord webhook links like passwords.

**Broke?** Site not updating: wait a minute, hard-refresh, check the host's deploy page. Red cross on GitHub: a test failed, send Claude the name. Push refused: it found something that looks like a key, remove it.

## What it costs (checked 12 Nov 2026, prices change)

| | Free | Pro | Max |
|---|---|---|---|
| Price | $0 | $20 a month ($17 billed yearly) | $100 or $200 a month |
| Chat | Yes, low limits | About 5x Free | More |
| Claude Code (pushes, tests, fixes for you) | **No** | **Yes** | Yes |
| Limits | Rolling window | 5-hour window plus weekly limit, shared with chat | Higher |

This app was built on **Pro**. Total spend isn't recorded; the only known cost is the plan. GitHub is free for a public repo like this.

**On Free you can:** chat, get mockups, have Claude write whole files, then paste them into GitHub yourself (Add file in the browser). Paste your rules files at the start of each chat. GitHub's own tests still run.
**On Free you lose:** Claude pushing, testing and looking at the page for you. More copying, more babysitting, smaller jobs.
**Go Pro when** you hit the Free limit 3+ times a week or want push-test-fix in one go. **Stay Free if** it's a few questions a week or one tiny page.

Sources: [Claude plans](https://claude.com/pricing), [Claude Code pricing 2026](https://www.superblocks.com/blog/claude-code-pricing), [Is Claude Code free?](https://ai.zenken.co.jp/en/post/claude-code-free-plan-guide/), [Pro price and limits](https://sessionwatcher.com/guides/claude-pro-price)

## What went wrong (so yours doesn't)
- **Unclear request = wrong build.** Twice. One short question beats a wrong build.
- **Too much on screen.** "Too much info", "so many buttons", "this seems hard to use": every time the fix was *fewer* things, not more options.
- **Silent bugs.** Headings in the wrong place, a hidden button, a repeated version number. Found by looking, not guessing.
- **Claude sounds surer than it is.** Always ask: *what did you not test?*
- **Never paste a secret key in chat.** If you do, delete it.

The full story is in [The lazy way](THE_LAZY_WAY.md).
