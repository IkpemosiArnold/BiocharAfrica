# Continuity Document

**Project:** BiocharAfrica
**Session:** 34acf2db
**Branch:** main
**Context Usage:** 224.7% (449,395 / 200,000 tokens)
**Timestamp:** 2026-08-10T21:06:17.584Z
**Working Directory:** /Users/mac/Documents/DevProjects/BiocharAfrica

## IMPORTANT: Resume from here

Context window is at 224.7% capacity. Auto-compact will trigger soon.
This document was auto-generated. Continue from the tasks and conversation below.

## Active Tasks

- [completed] Asset pipeline: graded video transcodes + responsive AVIF/WebP + LQIP
- [completed] Design system + perf governor + scroll spine + ground migration
- [completed] WebGL scene 1: volumetric biochar pore-structure hero
- [completed] Swap display face off Instrument Serif; strip serif-italic emphasis
- [completed] Remove every em dash from copy and comments
- [completed] Contain acid green to a CTA slab; fix nav blend, footer oblique, CTA contrast
- [completed] Mobile QA at 390px: hero legibility, video reel, field log, CTA
- [completed] Interior pages: about, services, impact, contact + form endpoint
- [completed] Guarantee no internal notes are browser-reachable
- [completed] Git tree cleaned, ignore files, committed (not pushed)
- [completed] Fix tier governor demoting capable devices; tier-aware copy; ?debug=perf
- [pending] Carbon-core scene still reads as a dark silhouette, needs art direction
- [pending] Mobile check of interior pages at 390px


## Recent Conversation

**ASSISTANT:** Two real bugs there: `instanceColor` is assigned after the material compiled (so three never sets the `USE_INSTANCING_COLOR` define and the colours are ignored), and the fog is swallowing the column. Fixing both:

**ASSISTANT:** Direct answer: **no, `?tier=2` should not be needed.** It's only a QA override I added so I could inspect each tier. On a real device `estimateTier()` decides automatically.

But your question exposed a genuine bug. Let me show you:

**ASSISTANT:** There it is, line 76 + 83: `deviceMemory ?? 4`, then `memory <= 4 → LEAN`. **`deviceMemory` is Chromium-only** — so every Safari and Firefox visitor falls back to `4` and gets silently downgraded to LEAN no matter how powerful their machine is. A reviewer on a Mac in Safari would never see the full shader.

**ASSISTANT:** The table is right now: Safari and Firefox on capable machines get FULL (they were being downgraded before), phones get LEAN, weak Android and Data-Saver get STILL. Checking the carbon core fix:

**ASSISTANT:** Still not reading — and I can see why: at 1000 bands over 26 units the strata are sub-pixel, and the colour gradient's green end sits off-screen, so you only ever see the dark middle. Making the bands physically resolvable and giving them per-band variation:

**ASSISTANT:** Both points are right, and the first is a genuine correctness bug — "what you flew through" is nonsense to someone who saw a static gradient. Fixing the thresholds and making the copy tier-aware:

**ASSISTANT:** Now the tier-aware copy so the text never references something the visitor didn't see:

**ASSISTANT:** That's a critical report, and I should stop guessing at the cause. Two likely culprits, both mine:

**`watchFrameRate` is almost certainly demoting you.** A 64-step raymarch at DPR 2 on a Retina display is ~3M pixels × 64 steps; if a third of frames miss 45fps it silently drops FULL → LEAN → STILL a second after load. You'd see the shader appear, then vanish.

Let me make it self-diagnosing instead of me speculating:

**ASSISTANT:** Let me verify the no-query-param path actually works, by spoofing a MacBook-class device before page scripts run:

**ASSISTANT:** Confirmed fixed. With **no query param** on a MacBook-class profile: canvas present, survived 6 seconds without demotion, render ratio 1.75 (2520×1575), and the tier-aware copy correctly says *"What you flew through…"*. So the culprit was the frame-rate governor demoting capable hardware, exactly as suspected.

**ASSISTANT:** Fair on both counts. More tolerance was the wrong fix — if it still demotes, the shader is genuinely too expensive and I should make it cheaper rather than raise the bar for calling it broken.

The dominant cost is pixels, and this image is soft volumetric — it gains nothing from Retina:

**ASSISTANT:** **331.8M → 105.1M samples per frame on desktop, a 68% cut.** Let me measure whether it actually holds now, over a long enough window that the governor would have fired:

**ASSISTANT:** Canvas survived the full 20 seconds with no demotion (28fps here is software-rendered SwiftShader in headless — real GPU will be far higher). But there's a new console error I should check before pushing:

**ASSISTANT:** That error is from my own test harness re-defining an already-patched property, not from the site. 

Committing and pushing, as you asked:

**ASSISTANT:** Pushed to `origin/main` — Vercel will redeploy automatically.

## Where it stands

**The site.** Five routes (`/`, `/about`, `/services`, `/impact`, `/contact`), all statically prerendered. The home page runs seven acts whose ground colour migrates from carbon black through paper white to deep paddy green, because that migration *is* the argument: biochar moves carbon out of the sky and into soil, and black becomes green.

**Your assets, honestly handled.** 19 photos → 152 AVIF/WebP derivatives with inlined blur placeholders. Six clips denoised, graded and re-encoded (26MB → 14MB; phones get 300–870KB versions, lazily). I dropped WebM entirely after measuring it encoding *3–4× larger* than H.264 on grainy phone footage, and moved film grain out of the codec into a shared CSS layer where it

---
*Auto-generated at 224.7% context usage by context-threshold-tracker*
