# The prompts Ginger really used

Ginger doesn't code. Every line of this app was written by Claude, an AI, from short messages like these, often typed on a phone. This page is the real thing: what she said, when, and what it caused. Spelling is fixed. A few swear words are starred.

Counts are **minimums**, from what could be found in her saved chats (9 Nov to 12 Nov 2026). Nothing older survives.

## How often she said the same thing

| She kept saying | Times (at least) | Examples |
|---|---|---|
| Make it simpler, or remove it | 21 | "just remove the whole profile thingy lol" · "So many buttons" |
| It looks ugly, awful, boring or weird | 14 | "These are UGLY, update again please too!!!" · "Borning!" |
| Show me a mockup first | 13 | "Got a mock up?" · "In a discord mock up photo" |
| Hand off, new chat, chat too long | 12 | "hand off now" · "This convo too long" |
| Save my tokens | 8 | "use tokens wisely" · "already at 16% for weekly!!!" |
| Giving repo access again | 7 | "permission granted" · "You have access to my github" |

About 75 repeats. Most happened because a new chat started blank. It asked for the files again and forgot "mockup first". What fixed it: `CLAUDE.md` and `STATUS.md` in the repo, which every new chat loads by itself (11 to 12 Nov).

## Her prompts, by what they did

### Simplify
| Date | She said | What happened |
|---|---|---|
| 9 Nov | "Can we redo the owner sh*t and make it simpler, I keep losing it" | A password replaced the key file. |
| 9 Nov | "F*ck it this is too annoying, lets do how it was before" | All owner signing was removed. Fingerprint only. |
| 10 Nov | "Ugh this is annoying, can we make it simpler" | Updates now finish by themselves. |
| 10 Nov | "just remove the whole profile thingy lol" | Profiles were hidden. |
| 10 Nov | "Yeah just all of it and start over" | Tabs, profile row and buttons all removed. |
| 10 Nov | "how much of this is bloat lol" | About half the Developer tools were flagged. |
| 11 Nov | "I don't see a point in this, it should be upload photo/video and it fills it in" | The set-up form was dropped. The AI works out the game and layout. |
| 12 Nov | "So many buttons. Couldn't we simplify it?" | The Discord box was cut to four steps. |

### Looks
| Date | She said | What happened |
|---|---|---|
| 9 Nov | "This needs updating too, too old looking" | View code redesigned. |
| 9 Nov | "This mega ugly." | Update log regrouped by day. |
| 9 Nov | "Bit much on the eyes" | Themes became small preview cards. |
| 10 Nov | "Dude look and compare. Look how weird the spacings are between the two!" | Both screens got the same width and spacing. |
| 12 Nov | "Isn't this weird lol" | Remember and Forget became one tick box. |
| 12 Nov | "Does that even look okay to understand though? looks like a bunch of sh*tty numbers" | The Discord post got headings and green and red lines. |
| 12 Nov | "Borning!" | The lazy guide got a story. |

### Fix it, don't ask
| Date | She said | What happened |
|---|---|---|
| 10 Nov | "Refresh and clear button don't work lol" | Both fixed. |
| 11 Nov | "fixy dumbo" | Claude had asked permission for a fix she'd already asked for. |
| 12 Nov | "do it f*cker" | Said when Claude asked before writing a note. It did it. |
| 12 Nov | "Ugh I meant in a discord paragraph" | A short correction, not a long re-explain. |

## Her shorthand (a glossary Claude was given)

| She says | Claude reads it as |
|---|---|
| lol | Not angry. "This is a bit silly, please fix." |
| Jeez | You took too long. Just do it. |
| Patch please | Stop asking questions and build it. |
| thingy | Whatever that part is called. |
| bloat | Features nobody uses. Cut them. |
| Use tokens wisely | Be quick and short. |
| No I meant... | You got it wrong. Here's what I pictured. |
| Cool | Approved. Next thing. |

## What worked best
- A screenshot plus one line beat any long description.
- "I want the result to be..." beat "fix the thing".
- Asking for a mockup before building saved the most rebuilds.
- Short swearing was a clear signal to simplify, not to explain.
