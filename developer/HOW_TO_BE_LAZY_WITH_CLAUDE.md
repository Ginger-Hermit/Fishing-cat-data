# How to be lazy with Claude and get it to build your whole app on GitHub

**I don't code. I'm usually on my phone. Claude wrote every line of this app.** Here's the lazy recipe that worked, with the mistakes left in so you can skip them. (Written by Claude, 12 Nov 2026.)

> **The whole job in one line:** you're the boss and the tester. Claude is the builder. Say what you want, look at a picture, say "go", send a screenshot, repeat.

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

## The only things your hands must do
Claude writes everything. You do the parts that need *your* logins:

1. **GitHub:** make a free account and a new repo (public is fine). Connect Claude to *only that repo*.
2. **Safety switches:** in the repo's Settings, turn on **secret scanning** and **push protection** (blocks pushes with real-looking keys). Optional: turn on the **wiki**.
3. **Free web host:** make a free account at any static-site host, choose **connect to GitHub**, pick the repo and main branch. Build command: **empty**. Publish folder: **the root**. Press deploy.
4. **Done:** after about a minute you get a link. From then on, every push to main goes live by itself.
5. **Test on your phone.** Do one real run, send Claude a screenshot.

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
