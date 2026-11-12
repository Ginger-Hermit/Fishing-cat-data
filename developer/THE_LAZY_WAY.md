# The lazy way: how a non-coder got Claude to build all of this

Written 12 Nov 2026 by Claude (an AI). The owner does not code, was usually on a phone, and did not write or read a single line of the page. Everything here was built by chatting. This is the honest recipe, including the parts that went wrong.

## The short version
1. Say what you want in plain words. Say what annoys you.
2. Look at a picture of it before it is built.
3. Say "go". Look at a screenshot of the result. Say what is wrong.
4. Make the AI write down the rules so you never explain twice.
5. Make the AI try to break its own work.

That is the whole job. You are the boss and the tester. The AI is the builder.

## What the owner actually did (the lazy parts)
- **Talked like a person.** "This looks awful", "so many buttons", "make it simpler", "I want it like this" plus a screenshot. No technical words needed.
- **Sent screenshots instead of describing.** A picture of the problem beats a paragraph. Sometimes the screenshot showed a mistake the AI could not see (a stale file name, a button too small to tap).
- **Said "go" or "no".** Mockups first. Only what was approved was built.
- **Never asked for a handoff.** The project has a rules file (`CLAUDE.md`) and a status file (`STATUS.md`). A new chat reads them on its own, so the owner never had to paste anything or re-explain.
- **Ran the real thing** on the live site and sent a screenshot. The AI cannot hold a real phone or a real Discord channel, so that part stayed human.

## What made it work (copy these)
- **One rules file.** Short rules the AI must follow every time: plain words, mockups first, one bug per fix, ask before big jobs. When the owner said "do it this way" twice, it went into the file.
- **One status file.** What the page does, what is next, what was never tested. Honest "not tested" lists stop the AI from claiming more than it knows.
- **One release script.** It bumps the version, writes the changelog entry and runs the checks, so no step gets forgotten.
- **Automatic tests.** Every push runs the checks in three browsers. A red cross means stop.
- **Save the tokens.** The AI was told to grep for the exact spot instead of reading everything, send only changed files, and warn before anything big. The owner watched the usage meter and planned the big jobs for after a reset.
- **Stress tests on purpose.** The AI attacked its own work with fake replies, bad files and hostile names, then wrote down what broke and what it learned (`STRESS_TEST_LOG.md`).
- **A plan for next time.** When time ran low, the AI wrote a break-and-security report instead of rushing fixes.

## Things that went wrong (so you can skip them)
- **A wrong guess costs a whole patch.** "Cosmetic?" and "another one for Discord?" were unclear, so the AI built the wrong thing twice. One short question beats a wrong build.
- **Too much information.** The first Discord post and the first Discord tab were crowded. The owner said "too much info" and "so many buttons" and each time the answer was fewer things, not more options.
- **Silent bugs.** Headings landed in the wrong place because other code moves boxes around. A hidden button stayed hidden. A version counter repeated a name. All found by looking, not by guessing.
- **The AI can sound surer than it is.** Always ask: what did you not test? Real AI calls, real Discord posts, real Excel and a real phone stayed "not tested" until the owner ran them.
- **Security is not automatic.** A player named like a link could have faked a link in the Discord post. The AI only found that when asked to think like an attacker.

## How to start your own
1. Pick one small job ("turn screenshots into a spreadsheet").
2. Ask for a mockup, not code. Change it until you like it.
3. Ask the AI to create a rules file and a status file in the project.
4. Build one tab or screen at a time. Test each on your own device.
5. Ask it to try to break the thing, and to list what it could not test.
6. Keep the first version boring. Add features only after the basic one works in real life.

## The honest summary
Lazy does not mean careless. The owner did very little typing but a lot of deciding: what to build, what is too much, what looks wrong, and what to test for real. The AI did all the code, the tests and the paperwork. That split is what made it fast.

See also: [How it was built](HOW_IT_WAS_BUILT.md) for the step-by-step process, and [Stress test log](STRESS_TEST_LOG.md) for how it was broken on purpose.
