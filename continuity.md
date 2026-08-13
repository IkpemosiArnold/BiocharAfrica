# Continuity Document

**Project:** BiocharAfrica
**Session:** 34acf2db
**Branch:** main
**Context Usage:** 420.0% (839,991 / 200,000 tokens)
**Timestamp:** 2026-08-13T06:42:56.608Z
**Working Directory:** /Users/mac/Documents/DevProjects/BiocharAfrica

## IMPORTANT: Resume from here

Context window is at 420.0% capacity. Auto-compact will trigger soon.
This document was auto-generated. Continue from the tasks and conversation below.

## Active Tasks

- [completed] Replace placeholder emails with the real info@biocharsolutions.africa
- [completed] Rewrite the /team lede so it says something about the team
- [completed] Replace Al Amin's bio with management's expanded version, title Dr.
- [completed] Publish the 41-page 2024 report as a click-to-download on /impact
- [in_progress] Update the DMARC rua address off the old Gmail to info@
- [pending] YOU: set mailbox passwords in cPanel (I must not handle credentials)
- [pending] Wire the contact form to info@biocharsolutions.africa via SMTP
- [pending] In a day or two: raise TTLs from 300 back to 14400


## Recent Conversation

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

**ASSISTANT:** Several things there. Let me check what I'm working with:

**ASSISTANT:** Confirmed, and the email issue is the urgent one: the site is publishing **`biocharsolutionsafrica@gmail.com`** and **`info@bsafrica.com`** — a Gmail address and an address on a *different domain*. Neither exists in your mailbox list. I took those from the old site and letterhead; management is right that they're placeholders.

**ASSISTANT:** Corrected — those now appear only in comments. Now management's expanded CEO bio, which is multi-paragraph, so the data model needs to hold paragraphs:

**ASSISTANT:** Now updating both renderers for the paragraph arrays, and rewriting the team lede management flagged:

**ASSISTANT:** Now the report. 6.6MB is a lot on a Nigerian mobile plan, so it must be click-to-download, never auto-loaded:

**ASSISTANT:** No thumbnail available, which is fine — a typographic card suits the site better. Building it with the file size shown up front, so nobody on mobile data is ambushed by 6.6MB:

**ASSISTANT:** All four verified. Shipping:

**ASSISTANT:** All live. Four things done, and one I can't do.

## The email issue was the serious one

The site was publishing **`biocharsolutionsafrica@gmail.com`** and **`info@bsafrica.com`**. Neither exists — the first is a personal Gmail, the second is on a *different domain*. I took both from the old site and letterhead and never checked them against the mail server. **Anyone who wrote to those addresses reached nobody.**

Against your actual cPanel list, the site now publishes **`info@biocharsolutions.africa`** and nothing else. Verified live.

## The other three

**CEO bio** — used verbatim, now three paragraphs (bios became paragraph arrays across all six). Two corrections applied: management says he *holds* the PhD and calls him Dr. Al-Amin, where the old site said "doctoral researcher", so the

---
*Auto-generated at 420.0% context usage by context-threshold-tracker*
