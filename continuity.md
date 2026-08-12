# Continuity Document

**Project:** BiocharAfrica
**Session:** 34acf2db
**Branch:** main
**Context Usage:** 395.3% (790,529 / 200,000 tokens)
**Timestamp:** 2026-08-12T12:55:56.752Z
**Working Directory:** /Users/mac/Documents/DevProjects/BiocharAfrica

## IMPORTANT: Resume from here

Context window is at 395.3% capacity. Auto-compact will trigger soon.
This document was auto-generated. Continue from the tasks and conversation below.

## Active Tasks

- [completed] DNS cutover complete: domain live, email untouched, 12/12 checks pass
- [completed] Complete the menu from the old site: Team page, Home in drawer, footer
- [completed] Stage the sack-rows photo that was culled at import; use both of management's frames uncropped
- [in_progress] Contact form: set CONTACT_TO + SMTP so enquiries actually arrive
- [pending] In a day or two: raise TTLs from 300 back to 14400
- [pending] Optional: decide whether apex or www should be canonical


## Recent Conversation

**ASSISTANT:** The old menu is right there: **Home · About · Services · Team · Contact** (footer confirms: Home, About Us, Our Services, Our Team, Contact Us).

So the gap is **Team** — I built the six leaders into `/about`, but the old site gave them their own page, and they're the strongest credibility asset here. Let me check the photo duplication management flagged:

**ASSISTANT:** Confirmed — `community-gathering-wide` and `community-women-training` appear in **both** the hero slideshow and the community section. Management is right.

Let me check whether I already have the first replacement they sent:

**ASSISTANT:** That's exactly the first photo they sent — I have it as `production-bagging-crew`, though only at **794×386**, which is small for a feature slot. The second (rows of sacks) I don't have at all.

Let me do the menu work now, which is fully actionable, and swap the community photos to the closest matches I hold:

**ASSISTANT:** Now the dedicated Team page the old site had:

**ASSISTANT:** Now the community photo swap management asked for, plus the strip styling:

**ASSISTANT:** Build passes with 11 routes now. Let me verify the new page and the edited `/about` before this goes to a live company site:

**ASSISTANT:** `/about` teaser works, `/team` has all six with no broken images, and the nav reads **About · Services · Team · Impact**. Pushing:

**ASSISTANT:** Both items done and live. All six routes return 200 on the real domain, and the DNS checker still reads **12 passed, 0 failures**.

## The menu

The old site's menu was **Home · About · Services · Team · Contact** — I read it off the screenshots I'd captured earlier, since the sandbox can't open HTTPS to the old server and web.archive.org is blocked.

**Team was missing entirely.** I'd buried the six leaders inside `/about`. They now have their own page, which is also where they belong on merit — six named people with checkable credentials (Lancaster PhD, Cambridge/Stanford/MIT fellowships) is the strongest credibility asset the company has, and a carbon buyer will go looking for it. `/about` keeps a face strip and a "Meet the team" link rather than a duplicate roster. Home added to the mo

**ASSISTANT:** Found them — two files dropped into `_source/originals/`, timestamped to match management's 07:27 messages. Let me check what resolution we actually got:

**ASSISTANT:** Both are small. Let me check whether these are actually new files or re-sends of what I already have:

**ASSISTANT:** Both are **byte-identical to files I already had.** The bagging shot is `production-bagging-crew`, already in use. And the sacks photo has been sitting in `_source/originals` since day one — I culled it during the initial triage and never staged it. That's my miss, not a missing file.

Let me look at it:

**ASSISTANT:** That's a strong image — it shows **production scale**, which nothing else on the site does. It's 775×395 though, so let me check the slots it has to fit:

**ASSISTANT:** Both slots crop to 3/2 and 4/3, but both of management's photos are ~2:1 — forcing them in would cut off the rows of sacks that make the point. Let me stage the photo and fit the frames to the material:

**ASSISTANT:** Both render uncropped, zero overlap with the hero, and rendered at essentially 1:1 (733px displayed vs 793px natural) so no upscaling. One stale caption though — that second line was written for the old training photo:

**ASSISTANT:** Live. Both of management's frames are now in the community section, uncropped.

**One correction to what I told you earlier.** Both files you dropped are **byte-identical to images already in the repo**. The bagging shot was already in use. The sack rows had been sitting in `_source/originals` since the very first import — I culled it during the initial triage and never staged it. So it was never a missing file, it was my oversight. It's now staged as `production-sacks-stacked`.

It genuinely earns its place: it's the **only photograph on the site showing output volume** rather than one farmer, which is exactly what a buyer asking "at what scale?" wants to see.

**I also had to change the frames, not just the photos.** The two slots were 3/2 and 4/3, but both photographs are roughly 2:1. D

---
*Auto-generated at 395.3% context usage by context-threshold-tracker*
