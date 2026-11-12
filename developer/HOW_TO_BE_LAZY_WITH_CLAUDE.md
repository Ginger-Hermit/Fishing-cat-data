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
