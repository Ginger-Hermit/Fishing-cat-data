# Security

Plain facts about what Fishing Cat Data does with your data.

> [!NOTE]
> **In short**
> - Pictures go only to the AI company you pick.
> - No server of our own, no tracking, no ads.
> - Your key stays in your browser, and only if you tick **Remember my key**.

## What leaves your device
- Your pictures or video stills go to **one AI company only: the one you pick** (Anthropic or Google Gemini), under that company's terms.
- Your AI key goes to that same company so it can do the read. It goes nowhere else.
- Nothing else is sent. The page also asks its own site for `version.txt` to see if a newer version exists.

## What the page is allowed to contact
The page's security header (`_headers`) only allows connections to:
- the site itself
- api.anthropic.com
- generativelanguage.googleapis.com
- discord.com (only for Post to Discord, to the link you paste; posts ping only the role you pick, never @everyone)

Anything else is blocked by the browser. A new website needs an edit to `_headers` and a mention in the on-page safety text.

## Your key
- Saved only if you tick **Remember my key**. Otherwise closing or refreshing the tab clears it.
- It stays in your own browser. Settings has a Privacy section to see and delete what is saved.
- Never paste it anywhere but the key box.

## Bills
- The AI only copies what it reads. The sheet does the sums and conversions.
- There are no fields for a customer's name, address or account number.

## Code rules
- No `eval` or `exec`.
- No packages except `exceljs.bare.min.js`, loaded only when needed.
- Other security header rules: no framing, no referrer sent, camera, microphone and location blocked.
- No inline code or styles: the page's code is only in `app.js` and its look only in `style.css`, so code or styles sneaked into the page are refused by the browser.
- Checked on GitHub: CodeQL security scan (every push and weekly), break test `tools/attack.py` and readability test after every push, live-site check weekly (`developer/LIVE_CHECK_LOG.md`).

## Real page or copy
The only official address is **https://fishing-cat-data.pages.dev**. A copy could be changed to steal keys. The page shows a red warning and locks the key box if opened from another address, but copies can remove that, so check the address yourself.

## Repo protections
Secret scanning and push protection are on for the repo, so GitHub blocks pushes that contain a real-looking key.

## Found a problem?
Open an issue at https://github.com/Ginger-Hermit/Fishing-cat-data/issues. Do not include your key.
