# Continuity Document

**Project:** BiocharAfrica
**Session:** 34acf2db
**Branch:** main
**Context Usage:** 304.0% (608,000 / 200,000 tokens)
**Timestamp:** 2026-08-11T05:55:03.558Z
**Working Directory:** /Users/mac/Documents/DevProjects/BiocharAfrica

## IMPORTANT: Resume from here

Context window is at 304.0% capacity. Auto-compact will trigger soon.
This document was auto-generated. Continue from the tasks and conversation below.

## Active Tasks

- [completed] Photograph-led welcome page using management's chosen image
- [completed] Headline changed to plain commercial: Richer soil, every season
- [completed] Move pore shader from hero to Act III where the copy explains it
- [completed] Rebalance photography: 4 repeated frames → 10 distinct, 1 char-on-sand on home
- [completed] Fix H1 invisible on Android: reveals now fail open, not closed
- [completed] Fix capitals clipped by the line mask (no ascender headroom)
- [completed] Fix hero grid row placement stranding the headline below the fold
- [completed] Fix hydration mismatch from the pre-paint js class
- [completed] Verify live deployment: all 5 routes, 100% reveals, no broken images
- [pending] Contact form still needs CONTACT_TO + a mail provider to deliver enquiries


## Recent Conversation

**ASSISTANT:** Layout bug: the photo is in row 1 but the text got pushed to row 2. Classic grid auto-placement — I placed the figure in column 2 first, so the cursor had already passed column 1 when the text came along:

**ASSISTANT:** Two of those errors are my own test harness. The third is real and mine: **a hydration mismatch on `<html>`** — my pre-paint script adds the `js` class before React hydrates, so server and client classNames differ. That's the standard case for `suppressHydrationWarning`:

**ASSISTANT:** Desktop hero works now. Let me answer your question with a test rather than a guess — I'll **break `IntersectionObserver` entirely** and see what disappears:

**ASSISTANT:** With the observer fully dead: the H1 and lede now survive (that's the fix working). **But only 6 of 37 elements** — everything below the fold would still be blank on a device where the observer misbehaves. Still fail-closed. Let me make it detect a broken observer and bail out entirely:

**ASSISTANT:** Good catch — that's real clipping, and it's my bug. `.line-mask` has `overflow: hidden`, and I added padding to protect **descenders** but not ascenders. With `line-height: 0.82`, the capitals overflow the top of the line box and get sliced:

**ASSISTANT:** Full round tops on the S and O now — the overshoot is no longer sliced. Let me verify mobile and the new Act III, then push:

**ASSISTANT:** That's the welcome page management asked for. Let me run the browser-support audit you asked about, then ship it:

**ASSISTANT:** Will do. Committing and pushing now, then I'll verify the live deployment:

**ASSISTANT:** Pushed. Waiting for Vercel to pick it up:

**ASSISTANT:** Live in 15s. Now verifying the deployed site properly:

**ASSISTANT:** Every route on the **live deployment**: 200, **100% of reveals fired** (37/37 on home, nothing left hidden), zero broken images, both WebGL scenes mounting. Final visual check of the live site:

**ASSISTANT:** Two real issues on the live Act III:

1. **The copy is now wrong.** "What you flew through at the top of this page" — the shader is no longer at the top; it's directly behind that sentence. I broke that when I moved it.
2. The mobile veil is so heavy the structure is barely visible.

**ASSISTANT:** My verification was wrong, not necessarily the deploy. `PoreLede` is a client component that renders the *neutral* sentence on the server — the tier-aware line only appears after hydration, so it will never be in the raw HTML. Checking the actual bundles instead:

**ASSISTANT:** The CSS proves the deploy **is** live — `pore__veil` already carries the new `0.5` opacity. My polling loop was just grepping for a post-hydration string. Confirming in a real browser:

**ASSISTANT:** Deployed and verified live at **biochar-africa.vercel.app**.

## Verified on the deployment, not locally

All five routes: **200**, **100% of reveals fired** (37/37 on home, 16/16, 22/22, 17/17, 7/7 — nothing left hidden after a full scroll), **zero broken images**, both WebGL scenes mounting.

## Why the headline vanished on his phone

The `IntersectionObserver` never delivered an entry for it, so the masked lines stayed translated out of view. But the trigger matters less than this: **the design failed closed.** The CSS hid the text and relied on JavaScript to bring it back, so any hiccup in that path deleted the most important sentence on the site. Three changes so it can't recur:

- Hidden states are now scoped to a `.js` class set by an inline script **before first paint** — no script

---
*Auto-generated at 304.0% context usage by context-threshold-tracker*
