# Continuity Document

**Project:** BiocharAfrica
**Session:** 34acf2db
**Branch:** main
**Context Usage:** 247.4% (494,760 / 200,000 tokens)
**Timestamp:** 2026-08-10T21:25:53.756Z
**Working Directory:** /Users/mac/Documents/DevProjects/BiocharAfrica

## IMPORTANT: Resume from here

Context window is at 247.4% capacity. Auto-compact will trigger soon.
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
- [completed] Reduced motion now renders a static scene instead of removing it
- [pending] Carbon core mid-section still uniform brown; needs art-direction pass
- [pending] Contact form needs CONTACT_TO + a mail provider to deliver enquiries


## Recent Conversation

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

---
*Auto-generated at 247.4% context usage by context-threshold-tracker*
