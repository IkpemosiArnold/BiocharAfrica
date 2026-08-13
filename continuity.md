# Continuity Document

**Project:** BiocharAfrica
**Session:** 34acf2db
**Branch:** main
**Context Usage:** 409.7% (819,463 / 200,000 tokens)
**Timestamp:** 2026-08-12T18:39:03.018Z
**Working Directory:** /Users/mac/Documents/DevProjects/BiocharAfrica

## IMPORTANT: Resume from here

Context window is at 409.7% capacity. Auto-compact will trigger soon.
This document was auto-generated. Continue from the tasks and conversation below.

## Active Tasks

- [completed] DNS cutover complete: domain live, email untouched, 12/12 checks pass
- [completed] Complete the menu from the old site: Team page, Home in drawer, footer
- [completed] Stage the sack-rows photo that was culled at import; use both of management's frames uncropped
- [in_progress] Contact form: set CONTACT_TO + SMTP so enquiries actually arrive
- [pending] In a day or two: raise TTLs from 300 back to 14400
- [pending] Optional: decide whether apex or www should be canonical


## Recent Conversation

**ASSISTANT:** That's a strong image — it shows **production scale**, which nothing else on the site does. It's 775×395 though, so let me check the slots it has to fit:

**ASSISTANT:** Both slots crop to 3/2 and 4/3, but both of management's photos are ~2:1 — forcing them in would cut off the rows of sacks that make the point. Let me stage the photo and fit the frames to the material:

**ASSISTANT:** Both render uncropped, zero overlap with the hero, and rendered at essentially 1:1 (733px displayed vs 793px natural) so no upscaling. One stale caption though — that second line was written for the old training photo:

**ASSISTANT:** Live. Both of management's frames are now in the community section, uncropped.

**One correction to what I told you earlier.** Both files you dropped are **byte-identical to images already in the repo**. The bagging shot was already in use. The sack rows had been sitting in `_source/originals` since the very first import — I culled it during the initial triage and never staged it. So it was never a missing file, it was my oversight. It's now staged as `production-sacks-stacked`.

It genuinely earns its place: it's the **only photograph on the site showing output volume** rather than one farmer, which is exactly what a buyer asking "at what scale?" wants to see.

**I also had to change the frames, not just the photos.** The two slots were 3/2 and 4/3, but both photographs are roughly 2:1. D

**ASSISTANT:** Let me check what's actually in the data versus what's rendering:

**ASSISTANT:** Stop — that navigation bug is far more serious than the bios. Let me reproduce it:

**ASSISTANT:** **Reproduced, and it's severe.** After a client-side navigation to `/about`: **23 revealable elements, 0 revealed, 0 visible** — the entire page is blank text. After a reload it works.

The cause: `SmoothScroll` lives in the root layout, so its `useEffect(…, [])` runs **once**. On client-side navigation the layout persists, the observer is still watching the *old* page's unmounted elements, and the new ones never get observed — so they keep `opacity: 0` forever. Same fail-closed class as the Android bug; I only fixed the initial-mount path.

**ASSISTANT:** Fixed — every route now reveals its above-the-fold content on client-side navigation (`scrollY: 0`, 4–5 revealed each). The rest are below-fold, which is correct. Let me confirm they reveal on scroll after a navigation:

**ASSISTANT:** That's the nav auto-hiding on scroll-down (working as designed) — my test just needed to scroll up first:

**ASSISTANT:** **100% on every route via client-side navigation** — 23/23, 26/26, 10/10, 26/26, zero invisible. Shipping this now since it's live-site-breaking:

**ASSISTANT:** Verified live on a phone via the drawer — headings render on every route now. That bug is dead.

Now, your team question. Let me look at what's actually there:

**ASSISTANT:** The content is genuinely substantive — Wageningen, Lancaster, Cambridge/Stanford/MIT fellowships, ABU Zaria, Bayero, Maiduguri, with real roles and institutions. So the *data* is rich. Let me see whether the *presentation* is selling it short:

**ASSISTANT:** Now I can see it. The **content is rich; the layout is starving it.** Each member block is 285px tall for ~100px of text, the role is orphaned ~150px below the name, and the bio only uses 611px of an 856px column. Let me look at the rules:

**ASSISTANT:** Found the bug. On desktop `.member__text { display: contents }` flattens name, role and bio into the outer grid — and because the **portrait spans row 1**, row 1 inflates to 144px, so the role gets pushed ~150px below the name and a void opens under each bio.

The bios aren't thin; the layout is. Fixing it and giving the credentials the weight they deserve:

**ASSISTANT:** You were right that something was off, though the cause wasn't what either of us assumed.

## The bios were never shortened — the layout was eating them

The content is all there: **Wageningen, Lancaster, Cambridge/Stanford/MIT fellowships, ABU Zaria, Bayero, Maiduguri**, with departments, dates and prior roles.

The problem was `display: contents` on the text block. It flattened name, role and bio into the outer grid, so the **portrait occupied row 1 and inflated it to the full height of the image** — pushing each person's role ~150px below their name and opening a void under every bio. Each entry was 285px tall carrying about 100px of content. Six serious CVs read as an afterthought.

- Gap between name and role: **150px → 24px**
- Entry height: **285px → 225px**, with *more* text visibl

---
*Auto-generated at 409.7% context usage by context-threshold-tracker*
