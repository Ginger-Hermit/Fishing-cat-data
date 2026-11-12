# Setting it up by hand: GitHub plus a free web host

Written by Claude (an AI) on 12 Nov 2026. Claude wrote all the code. These are the few things only the owner could do, because they need your own accounts and logins. Menu names change, so if a button is not where this says, look for the same words nearby. The host is kept generic on purpose: any free static-site host that deploys from GitHub works the same way.

## What you do yourself, and what Claude does
| You | Claude |
|---|---|
| Make the accounts, sign in, approve access | Writes every file |
| Press the connect and approve buttons | Pushes the code to GitHub |
| Turn on repo settings | Runs the tests, fixes failures |
| Copy your link and test it on your phone | Writes the docs and changelog |

## Part 1: GitHub (where the code lives)
1. Make a free GitHub account.
2. Make a new repository. Name it after the project. Public is fine for a page like this (see "Privacy" below), and a public repo gets GitHub's free tools.
3. Link Claude to it. In Claude, connect GitHub when asked and approve access to this one repo. Pick only the repo it needs.
4. Ask Claude to push the files. It should add `README.md`, `CLAUDE.md`, `STATUS.md` and a `LICENSE`.
5. Turn on the safety settings: in the repo, open Settings and find the security section. Switch on **secret scanning** and **push protection**. They block pushes that contain a real-looking key.
6. Optional: turn on the **wiki** (Settings, Features). Claude can fill it automatically from the files in the repo.
7. If you rename the repo or your account, old links still redirect, and pushes keep working. Tell Claude the new address so it can fix the docs.

## Part 2: Put the page on the internet (a free static host)
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

## Part 3: Test it for real
1. Open the live link on your own phone.
2. Do one real run of each tab and send Claude a screenshot.
3. Anything wrong: tell Claude, with the screenshot. Do not paste keys into the chat. If you do, delete the key and make a new one.

## Privacy (decide before you publish)
- **Your email:** GitHub can hide it. Use your private noreply address in git settings before the first push. If an early commit used your real email, ask Claude how to rewrite it, and do it before the repo is shared.
- **Your host:** the host's name often shows in the web address. Decide whether you mind.
- **Keys:** never commit a key. Never put one in a screenshot.
- **Discord links:** treat them like passwords. Anyone with one can post in your channel.

## When something breaks
- **The site did not update:** wait a minute, then hard-refresh. Then check the host's deploy page for a red error.
- **A red cross on GitHub:** a test failed. Send Claude the name of the failing check.
- **Push refused:** push protection found something that looks like a key. Remove it, then push again.
- **Nothing here fixes it:** use the Copy bug report button on the page and send Claude the text.

See also: [How to be lazy with Claude](HOW_TO_BE_LAZY_WITH_CLAUDE.md), [Security](SECURITY.md).
