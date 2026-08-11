# Continuity Document

**Project:** BiocharAfrica
**Session:** 34acf2db
**Branch:** main
**Context Usage:** 264.4% (528,835 / 200,000 tokens)
**Timestamp:** 2026-08-10T21:39:03.272Z
**Working Directory:** /Users/mac/Documents/DevProjects/BiocharAfrica

## IMPORTANT: Resume from here

Context window is at 264.4% capacity. Auto-compact will trigger soon.
This document was auto-generated. Continue from the tasks and conversation below.

## Active Tasks

- [completed] Asset pipeline: graded video transcodes + responsive AVIF/WebP + LQIP
- [completed] Design system + perf governor + scroll spine + ground migration
- [completed] WebGL scene 1: volumetric biochar pore-structure hero
- [completed] Swap display face off Instrument Serif; strip serif-italic emphasis
- [completed] Remove every em dash from copy and comments
- [completed] Contain acid green to a CTA slab; fix nav, footer, CTA contrast
- [completed] Interior pages: about, services, impact, contact + form endpoint
- [completed] Guarantee no internal notes are browser-reachable
- [completed] Git cleaned, ignore files, committed and pushed to origin/main
- [completed] Fix carbon core rendering black (vertexColors zeroing instanceColor)
- [completed] Fix mobile scrim hiding the shader; on-screen ?debug=perf panel
- [completed] Reduced motion renders a static scene instead of removing it
- [completed] Art-direct the carbon core: stratigraphy, char seams, cylinders, masking
- [pending] Contact form needs CONTACT_TO + a mail provider to deliver enquiries


## Recent Conversation

**ASSISTANT:** That's the answer, and it's unambiguous: **`reduced motion: true`, `webgl: Apple GPU`.** Your iPhone is fully capable — WebGL creates a context fine. It's the iOS **Reduce Motion** accessibility setting, and my code treats that as "render nothing."

That's my logic being wrong, not your phone. `prefers-reduced-motion` means *"I'm sensitive to motion"* — vestibular triggers, motion sickness. It does not mean *"don't show me images."* I conflated the two and stripped the entire artwork when the correct response is to remove the **movement** and keep the picture.

This matters at scale: Reduce Motion is very commonly switched on by iPhone users, because it also kills the iOS parallax/zoom effects. So I was serving a blank hero to a large share of your mobile audience.

The right fix is a stat

**ASSISTANT:** Now let me verify with reduced motion actually emulated, which is the exact condition on your phone:

**ASSISTANT:** Exactly right: **tier FULL** (was STILL), canvas present, and frames byte-identical after 1.5s — the artwork renders, the motion doesn't. Let me look at it:

**ASSISTANT:** Structure renders on reduced-motion mobile. One flaw though — the panel reports `canvas on page: 0` when a canvas is clearly present; it reads the count before the canvas mounts. Since you're relying on this panel, it needs to be accurate:

**ASSISTANT:** Your debug panel gave the definitive answer, and it was my logic, not your phone.

**`reduced motion: true`, `webgl: Apple GPU`.** The iPhone could render it perfectly — `estimateTier()` returned `STILL` the instant it saw `prefers-reduced-motion`, before looking at any hardware.

That was wrong. `prefers-reduced-motion` means *"I'm sensitive to motion"* — vestibular triggers, motion sickness. It doesn't mean *"don't show me images."* I treated one as the other and deleted the entire artwork. And it matters more on iOS than anywhere else: Reduce Motion is switched on by a large share of iPhone users **because it also disables the system parallax and zoom effects**, so I was serving a blank hero to a lot of perfectly capable phones — very likely including people at the management review.

*

**ASSISTANT:** Good. Let me diagnose what's actually wrong with it before rewriting, because there are two distinct problems.

**ASSISTANT:** Confirmed — two distinct problems, and one is a plain bug:

**1. The gradient clips.** Line 89: `Math.pow(t * 2.2, 0.75)` saturates at `t = 0.45`, so **the bottom 55% of the core is exactly one colour** (`#4a4038`), varied only by random lightness. That's the uniform brown.

**2. The silhouette and the interior are inverted.** Width varies randomly per band *and* colour varies — so the edge is ragged and the inside is flat. Good art direction is the opposite: clean silhouette, rich interior.

Rewriting it as an actual soil profile, where the black bands are the biochar:

**ASSISTANT:** Now the form itself — a stack of boxes doesn't read as a core sample, and looking at it dead-on gives no dimensionality:

**ASSISTANT:** Let me look at it:

**ASSISTANT:** Now it reads as a genuine core — cylindrical, with the laterite century ring clearly marked. Three things still off: it's too wide and dominates, the horizons are too low-frequency so it reads as a soft gradient rather than strata, and the ends are visible instead of running past the frame.

**ASSISTANT:** Real stratigraphy now — pale ash, a black char seam, the laterite century ring, ochre below. But the column still cuts off hard at ~550px. That's not the core ending; it's the **section boundary** clipping the canvas. Fixing that so it reads as endless:

**ASSISTANT:** Fading properly at the edges now, and the strata read: dark char seam, laterite century ring, pale ash, warm ochre. Let me check it doesn't break on mobile, where the core sits off-centre at x=3.4:

**ASSISTANT:** On mobile the core is pushed almost entirely off the right edge — the `x: 3.4` offset that works on desktop doesn't on a 390px viewport. Making it responsive:

**ASSISTANT:** Mobile now sits the core behind the copy at reduced opacity with the century ring reading through, and the text stays legible. Committing and pushing:

**ASSISTANT:** Done and pushed. The carbon core is now a soil profile rather than a dark column.

**Two problems, and one was a plain bug I'd missed.** The colour ramp `lerp(deep, pow(t * 2.2, 0.75))` reaches 1 at `t = 0.45`, so the bottom **55% of the core was literally a single colour**, varied only by random lightness. That was the "uniform brown" — not a taste issue, a clipped function. Horizons are now chosen by layered value noise, so there's readable structure at every depth you scroll past.

The second was compositional: width was jittered per band *and* colour was jittered, giving a ragged edge around a flat middle. That's backwards. Constant radius now, with only century markers protruding — **clean silhouette, rich interior**.

Then the art direction proper:

- **Discs, not cuboids.** A core s

---
*Auto-generated at 264.4% context usage by context-threshold-tracker*
