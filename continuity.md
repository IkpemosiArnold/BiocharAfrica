# Continuity Document

**Project:** BiocharAfrica
**Session:** 34acf2db
**Branch:** main
**Context Usage:** 427.2% (854,419 / 200,000 tokens)
**Timestamp:** 2026-08-13T07:51:25.457Z
**Working Directory:** /Users/mac/Documents/DevProjects/BiocharAfrica

## IMPORTANT: Resume from here

Context window is at 427.2% capacity. Auto-compact will trigger soon.
This document was auto-generated. Continue from the tasks and conversation below.

## Active Tasks

- [completed] Replace placeholder emails with the real info@biocharsolutions.africa
- [completed] Rewrite the /team lede; expand the CEO bio with management's text
- [completed] Publish the 41-page 2024 report as a click-to-download on /impact
- [completed] DMARC reports redirected to info@biocharsolutions.africa
- [pending] YOU: set mailbox passwords in cPanel (I must not handle credentials)
- [pending] Wire the contact form to info@biocharsolutions.africa via SMTP
- [pending] In a day or two: raise TTLs from 300 back to 14400


## Recent Conversation

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

**ASSISTANT:** cPanel has a structured DMARC editor. Updating the `rua` field:

**ASSISTANT:** The field is inside a collapsed "Optional Parameters" panel. Expanding it first:

**ASSISTANT:** Field is set but cPanel's generated record still shows the old value — AngularJS hasn't picked up the change. Let me type it properly so the model updates:

**ASSISTANT:** Still not syncing — programmatic events aren't enough for this AngularJS form. Let me use real keystrokes:

**ASSISTANT:** Let me save and check against DNS — that's the only reliable verdict. DMARC at `p=none` is report-only, so there's no risk to mail either way:

**ASSISTANT:** Worked — that `as_string` field was just a stale display, not the source of truth. The saved record:

**ASSISTANT:** Done. DMARC reports now go to a real company address:

```
v=DMARC1;p=none;sp=none;adkim=r;aspf=r;pct=100;fo=1;rf=afrf;ri=86400;
rua=mailto:info@biocharsolutions.africa
```

cPanel expanded it to its full default form on save. Every term it added is the permissive default (`p=none`, `sp=none`, relaxed alignment, 100% sampling, daily reports), so it still only **observes and reports — it cannot cause a message to be blocked.**

**Mail path verified unchanged**, and the full check is still **12 passed, 0 failures**.

One thing worth recording, which I've put in the runbook: the Zone Editor's structured DMARC form has a *"record as string"* box that **does not live-update as you edit the fields**. It kept displaying the old Gmail address right through — including after real keystrokes — and m

---
*Auto-generated at 427.2% context usage by context-threshold-tracker*
