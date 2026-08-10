# Continuity Document

**Project:** BiocharAfrica
**Session:** 34acf2db
**Branch:** main
**Context Usage:** 237.1% (474,155 / 200,000 tokens)
**Timestamp:** 2026-08-10T21:16:06.252Z
**Working Directory:** /Users/mac/Documents/DevProjects/BiocharAfrica

## IMPORTANT: Resume from here

Context window is at 237.1% capacity. Auto-compact will trigger soon.
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
- [completed] Git cleaned, ignore files, committed AND pushed to origin/main
- [completed] Fix tier governor demoting capable devices; tier-aware copy
- [completed] Fix carbon core rendering black (vertexColors zeroing instanceColor)
- [completed] Fix mobile scrim hiding the shader; on-screen ?debug=perf panel
- [in_progress] Await iPhone 12 retest to confirm the mobile WebGL fix


## Recent Conversation

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

**ASSISTANT:** That black strip **is** the second WebGL scene — the 1,000-year carbon core. It's meant to be a soil core you descend through, with one band per year and every hundredth marked. It's rendering as a silhouette instead, which is the weakness I flagged.

Let me find out exactly why rather than keep guessing at it:

**ASSISTANT:** Found it, and it's precise. `vertexColors` sets three's `USE_COLOR` define, which makes the shader do:

```glsl
vColor = vec3(1.0);
#ifdef USE_COLOR
  vColor *= color;              // ← boxGeometry has NO `color` attribute
#endif
#ifdef USE_INSTANCING_COLOR
  vColor.xyz *= instanceColor;  // ← too late, already zeroed
#endif
```

A missing vertex attribute reads as `(0,0,0)`, so every instance is multiplied to black *before* `instanceColor` is applied. `vertexColors` is for a geometry colour attribute; `InstancedMesh` colour needs no flag at all.

**ASSISTANT:** That was it. The core now reads properly — stacked annual strata with the laterite century markers clearly visible as the orange bands. Let me check the top of the core, where the living topsoil green should appear:

**ASSISTANT:** That's important, and I should stop guessing at device issues I can't reproduce. Two likely causes, and I can fix one and diagnose the other properly.

First the likely culprit — I over-corrected the mobile scrim earlier when fixing legibility:

**ASSISTANT:** There it is: **94% and 86% opacity over the bottom two-thirds of the screen.** On an iPhone the shader is rendering but almost entirely painted over — indistinguishable from "no WebGL". I over-corrected when fixing legibility earlier.

**ASSISTANT:** Now let me make this diagnosable from a phone, where you can't open a console:

**ASSISTANT:** The debug panel works and renders on-screen. Let me confirm the mobile hero visually now that the scrim is fixed:

**ASSISTANT:** Structure is clearly present on mobile now, with the copy still legible. Committing and pushing all three fixes:

**ASSISTANT:** That black strip was the **1,000-year carbon core** — the second WebGL scene, meant to be a soil core you descend through with one band per year.

**The bug:** the material was declared `<meshBasicMaterial vertexColors />`. That flag sets three's `USE_COLOR` define, and the shader then runs `vColor *= color` against a `color` attribute that `boxGeometry` doesn't have. A missing vertex attribute reads as `(0,0,0)`, so every instance was multiplied to black *before* `instanceColor` was applied. `vertexColors` is for a geometry colour attribute; `InstancedMesh` colour needs no flag at all. Removing it made the strata and the laterite century markers appear immediately.

Pushed, so Vercel is redeploying.

## Your iPhone 12 report — I think I caused that too

Not a WebGL failure. When I fixed h

---
*Auto-generated at 237.1% context usage by context-threshold-tracker*
