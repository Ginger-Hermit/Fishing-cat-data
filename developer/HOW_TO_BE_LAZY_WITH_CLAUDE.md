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

## Starter prompt (copy this)
*"I do not code. Build me [your idea] as a web page in a GitHub repo. First show me a mockup. Create CLAUDE.md (rules for how we work) and STATUS.md (what works, what is next, what is untested). After each change, run tests and update STATUS.md. Before anything big, warn me. Keep words plain."*
