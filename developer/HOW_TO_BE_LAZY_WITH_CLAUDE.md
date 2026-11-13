# How to be lazy with Claude and get it to build your whole app on GitHub

**I don't code. I'm usually on my phone. Claude wrote every line of this app.** Here's the lazy recipe that worked, with the mistakes left in so you can skip them. (Written by Claude, 12 Nov 2026.)

> **The whole job in one line:** you're the boss and the tester. Claude is the builder. Say what you want, look at a picture, say "go", send a screenshot, repeat.

## The story: how this app really got built
It started with a boring chore. A Roblox clan leader scrolls the member list and types every player's points into a sheet by hand. The idea: take screenshots, let an AI read them, get an Excel sheet.

- **Day 1 (11 Nov):** a first working page that read screenshots into a sheet. Then came the first stress test: fake AI replies, bad pictures, weird numbers. About 20 weak spots turned up, all fixed. None were security holes; they were "wrong sheet" and "confusing message" problems.
- **The first host showed a popup,** so the page moved to a different free host, deployed straight from GitHub. The fix took one chat.
- **The AI bill worry:** the owner didn't want to spend their own credit, so the page switched to a free Google AI key. It worked first time.
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

The full story is below.

## The full story

Written 12 Nov 2026 by Claude (an AI). The owner does not code, was usually on a phone, and did not write or read a single line of the page. Everything here was built by chatting. This is the honest recipe, including the parts that went wrong.

### The short version
1. Say what you want in plain words. Say what annoys you.
2. Look at a picture of it before it is built.
3. Say "go". Look at a screenshot of the result. Say what is wrong.
4. Make the AI write down the rules so you never explain twice.
5. Make the AI try to break its own work.

That is the whole job. You are the boss and the tester. The AI is the builder.

### What the owner actually did (the lazy parts)
- **Talked like a person.** "This looks awful", "so many buttons", "make it simpler", "I want it like this" plus a screenshot. No technical words needed.
- **Sent screenshots instead of describing.** A picture of the problem beats a paragraph. Sometimes the screenshot showed a mistake the AI could not see (a stale file name, a button too small to tap).
- **Said "go" or "no".** Mockups first. Only what was approved was built.
- **Never asked for a handoff.** The project has a rules file (`CLAUDE.md`) and a status file (`STATUS.md`). A new chat reads them on its own, so the owner never had to paste anything or re-explain.
- **Ran the real thing** on the live site and sent a screenshot. The AI cannot hold a real phone or a real Discord channel, so that part stayed human.

### What made it work (copy these)
- **One rules file.** Short rules the AI must follow every time: plain words, mockups first, one bug per fix, ask before big jobs. When the owner said "do it this way" twice, it went into the file.
- **One status file.** What the page does, what is next, what was never tested. Honest "not tested" lists stop the AI from claiming more than it knows.
- **One release script.** It bumps the version, writes the changelog entry and runs the checks, so no step gets forgotten.
- **Automatic tests.** Every push runs the checks in three browsers. A red cross means stop.
- **Save the tokens.** The AI was told to grep for the exact spot instead of reading everything, send only changed files, and warn before anything big. The owner watched the usage meter and planned the big jobs for after a reset.
- **Stress tests on purpose.** The AI attacked its own work with fake replies, bad files and hostile names, then wrote down what broke and what it learned (`STRESS_TEST_LOG.md`).
- **A plan for next time.** When time ran low, the AI wrote a break-and-security report instead of rushing fixes.

### Things that went wrong (so you can skip them)
- **A wrong guess costs a whole patch.** "Cosmetic?" and "another one for Discord?" were unclear, so the AI built the wrong thing twice. One short question beats a wrong build.
- **Too much information.** The first Discord post and the first Discord tab were crowded. The owner said "too much info" and "so many buttons" and each time the answer was fewer things, not more options.
- **Silent bugs.** Headings landed in the wrong place because other code moves boxes around. A hidden button stayed hidden. A version counter repeated a name. All found by looking, not by guessing.
- **The AI can sound surer than it is.** Always ask: what did you not test? Real AI calls, real Discord posts, real Excel and a real phone stayed "not tested" until the owner ran them.
- **Security is not automatic.** A player named like a link could have faked a link in the Discord post. The AI only found that when asked to think like an attacker.

### How to start your own
1. Pick one small job ("turn screenshots into a spreadsheet").
2. Ask for a mockup, not code. Change it until you like it.
3. Ask the AI to create a rules file and a status file in the project.
4. Build one tab or screen at a time. Test each on your own device.
5. Ask it to try to break the thing, and to list what it could not test.
6. Keep the first version boring. Add features only after the basic one works in real life.

### The honest summary
Lazy does not mean careless. The owner did very little typing but a lot of deciding: what to build, what is too much, what looks wrong, and what to test for real. The AI did all the code, the tests and the paperwork. That split is what made it fast.

See also: [How it was built](HOW_IT_WAS_BUILT.md) for the step-by-step process, and [Stress test log](STRESS_TEST_LOG.md) for how it was broken on purpose.
