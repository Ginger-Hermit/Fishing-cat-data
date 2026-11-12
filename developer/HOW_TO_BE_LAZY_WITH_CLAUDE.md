# How to be lazy with Claude and get it to do almost everything when making an app on GitHub

Written by Claude (an AI) on 12 Nov 2026, from how Fishing Cat Data was built. The owner does not code and was usually on a phone. Claude wrote every line. This is the lazy method that worked, written so you can copy it. The story of this project is in [The lazy way](THE_LAZY_WAY.md).

## 1. Start with a mockup, not code
Say what you want in plain words and ask for a picture of it. Change the picture until you like it, then say "go". Fixing a picture is cheap. Fixing finished code is not.

## 2. Make Claude write its own rules file
Prompt: *"Create a CLAUDE.md in the repo with rules for working with me: plain words, mockups first, one bug per fix, warn before big jobs. Add a rule to read it at the start of every chat."*
When you say "do it this way" twice, tell it to add that to the file. You will never explain anything twice.

## 3. Add a status file
Prompt: *"Create STATUS.md: what works, what's next, what is NOT tested. Update it after every change."*
A new chat reads it and picks up where the last one stopped, so you never need a handoff. The "not tested" list stops Claude from claiming more than it knows.

## 4. Let Claude do the paperwork
- Ask for a release script that bumps the version, writes the changelog entry and runs the checks.
- Ask for GitHub Actions that run the tests on every push.
- Then a red cross on GitHub is your only job: you do not read the code, you only notice red.

## 5. Use screenshots as your whole feedback loop
"This looks awful" plus a screenshot is enough. Say "too much info" or "so many buttons" and ask for simpler, not more options. Screenshots also catch things Claude cannot see (a stale file name, a button too small to tap).

## 6. Make it attack its own work
Prompt: *"Try to break this like a hostile user would. Use fake replies, bad files and weird names. Then list what you could NOT test."*
In this project that found a hole where a player name could fake a link in a Discord post.

## 7. Save tokens
Tell it to search for the exact spot instead of reading every file, to send only changed files, and to warn you before big jobs. Plan the big jobs for just after your usage reset.

## 8. Be the tester
Claude cannot hold your phone or post in your real Discord. Run the real thing yourself and send a screenshot. That is your main job.

## The manual steps: GitHub plus a free web host
Claude wrote all the code. These are the few things only you can do, because they need your own accounts and logins. Menu names change, so look for the same words nearby. The host is kept generic: any free static-site host that deploys from GitHub works the same way.

### What you do yourself, and what Claude does

| You | Claude |
|---|---|
| Make the accounts, sign in, approve access | Writes every file |
| Press the connect and approve buttons | Pushes the code to GitHub |
| Turn on repo settings | Runs the tests, fixes failures |
| Copy your link and test it on your phone | Writes the docs and changelog |

#### Part 1: GitHub (where the code lives)
1. Make a free GitHub account.
2. Make a new repository. Name it after the project. Public is fine for a page like this (see "Privacy" below), and a public repo gets GitHub's free tools.
3. Link Claude to it. In Claude, connect GitHub when asked and approve access to this one repo. Pick only the repo it needs.
4. Ask Claude to push the files. It should add `README.md`, `CLAUDE.md`, `STATUS.md` and a `LICENSE`.
5. Turn on the safety settings: in the repo, open Settings and find the security section. Switch on **secret scanning** and **push protection**. They block pushes that contain a real-looking key.
6. Optional: turn on the **wiki** (Settings, Features). Claude can fill it automatically from the files in the repo.
7. If you rename the repo or your account, old links still redirect, and pushes keep working. Tell Claude the new address so it can fix the docs.

#### Part 2: Put the page on the internet (a free static host)
The page is one `index.html` file plus a few small files, with no server and no build step. Any free static host can serve it.
1. Make a free account at the host you choose.
2. In its dashboard, create a new site and choose **connect to GitHub** (sometimes called "import a repository").
3. Sign in to GitHub when asked and allow the host to see **only this repo**.
4. Pick the repo and the main branch.
5. Settings it asks for:
   - **Build command:** leave empty (nothing to build).
   - **Publish folder:** the root of the repo (`/`, or leave blank).
   - **Framework:** none.
6. Press deploy. After about a minute you get a link. Open it on your phone.
7. From now on every push to the main branch deploys by itself. Claude pushes, you wait about a minute, then refresh. That is the whole release process.
8. Optional: the file `_headers` in the repo sets security rules on hosts that read it. Claude keeps it up to date. Check the host's page for your link with a "security headers" checker once.

#### Part 3: Test it for real
1. Open the live link on your own phone.
2. Do one real run of each tab and send Claude a screenshot.
3. Anything wrong: tell Claude, with the screenshot. Do not paste keys into the chat. If you do, delete the key and make a new one.

### Privacy (decide before you publish)
- **Your email:** GitHub can hide it. Use your private noreply address in git settings before the first push. If an early commit used your real email, ask Claude how to rewrite it, and do it before the repo is shared.
- **Your host:** the host's name often shows in the web address. Decide whether you mind.
- **Keys:** never commit a key. Never put one in a screenshot.
- **Discord links:** treat them like passwords. Anyone with one can post in your channel.

### When something breaks
- **The site did not update:** wait a minute, then hard-refresh. Then check the host's deploy page for a red error.
- **A red cross on GitHub:** a test failed. Send Claude the name of the failing check.
- **Push refused:** push protection found something that looks like a key. Remove it, then push again.
- **Nothing here fixes it:** use the Copy bug report button on the page and send Claude the text.

## What went wrong
- Unclear requests got the wrong thing built twice. One short question beats a wrong build.
- Never paste secret keys into a chat. If you do, delete the key.
- Claude can sound surer than it is. Always ask what it did not test.

## What it costs, and what Free can and can't do
Prices checked 12 Nov 2026 from public plan pages and can change. Check claude.com/pricing before you buy.

| | Free | Pro | Max |
|---|---|---|---|
| Price | $0 | $20 a month, or $17 a month billed yearly ($200 up front) | $100 (5x Pro usage) or $200 (20x Pro usage) a month |
| Claude chat (web, phone, desktop) | Yes, low limits | Yes, about 5x the usage of Free | More |
| Claude Code (writes files, runs tests, pushes to GitHub for you) | **No** | **Yes** | Yes |
| Limits | A rolling window of a few hours | A 5-hour window plus a weekly limit, shared by chat and Claude Code | Same idea, higher |

This project was built on **Pro**. Total spend on this app is not recorded; the only known cost is the Pro plan. GitHub itself is free for a public repo like this one (check GitHub's current terms for limits).

**What you can do on Free:**
- Chat with Claude, ask for mockups, and have it write whole files. Free also has web search, file creation and code running in chat, per one plan guide.
- Paste the file into GitHub yourself: open the repo in the browser, tap Add file, then paste or upload. No coding needed, but you do the copying.
- Keep your rules by pasting `CLAUDE.md` and `STATUS.md` at the start of each chat (Free has no way to read them on its own).
- GitHub's own automatic tests still run after each push, because they run on GitHub, not in Claude.

**What you lose on Free:**
- Claude can't push for you, run the tests itself or open the page in a browser to look at it. You do all the copying and checking.
- Fewer messages, so big jobs get cut off sooner. Plan one small job per window.
- No Claude Code, so none of the "it did everything while I watched" parts of this guide.

**When Pro pays for itself:** you hit the Free limit three or more times a week, or you want Claude to push, test and fix in one go. **When to stay Free:** a few questions a week, or one tiny page you'll never change.

**Pro limits are real.** A 5-hour window and a weekly limit are shared by chat and Claude Code, so a long coding session uses the same pool. That's why the token-saving habits above matter.

Sources: [Claude plans](https://claude.com/pricing), [Claude Code pricing 2026](https://www.superblocks.com/blog/claude-code-pricing), [Is Claude Code free?](https://ai.zenken.co.jp/en/post/claude-code-free-plan-guide/), [Claude Pro price and limits](https://sessionwatcher.com/guides/claude-pro-price), [Claude Pro guide](https://claudemarket.ai/blog/claude-pro)

## Starter prompt (copy this)
*"I do not code. Build me [your idea] as a web page in a GitHub repo. First show me a mockup. Create CLAUDE.md (rules for how we work) and STATUS.md (what works, what is next, what is untested). After each change, run tests and update STATUS.md. Before anything big, warn me. Keep words plain."*
