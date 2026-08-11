# Continuity Document

**Project:** BiocharAfrica
**Session:** 34acf2db
**Branch:** main
**Context Usage:** 318.6% (637,143 / 200,000 tokens)
**Timestamp:** 2026-08-11T19:48:14.104Z
**Working Directory:** /Users/mac/Documents/DevProjects/BiocharAfrica

## IMPORTANT: Resume from here

Context window is at 318.6% capacity. Auto-compact will trigger soon.
This document was auto-generated. Continue from the tasks and conversation below.

## Active Tasks

- [completed] Adopt management's positioning doc: 4 solutions, impact proposition, feedstocks
- [completed] Crawl the old site properly: found /our-team with 6 people, not 2
- [completed] Add all six leaders with full bios and downloaded portraits
- [completed] Wire management's two community photographs into the community act
- [completed] Fix CTA rendering acid-green text on the acid-green slab (invisible)
- [completed] Broaden CTA copy beyond soil to match the four solutions
- [completed] Favicon and apple touch icon from the company logo
- [completed] Make the image pipeline incremental (full rebuild exceeded 10 min)
- [completed] Verify live: 5 routes, 100% reveals, no broken images, no invisible text
- [pending] Contact form still needs CONTACT_TO + a mail provider to deliver enquiries


## Recent Conversation

**ASSISTANT:** Partner section renders but the two-column grid isn't applying at 1280px. Let me check rather than guess:

**ASSISTANT:** Two real findings.

**The grid bug:** `gridTemplateColumns` came back as **seven** tracks, not two. The culprit is a rule meant only for the 12-column layout — `.act__title { grid-column: 1 / 8 }` — leaking into any grid that contains an `.act__title`, forcing seven implicit columns and pushing the body to row 2.

**And you're right about reduced motion.** Let me fix both:

**ASSISTANT:** Under emulated reduced motion it now rotates, with `transitionProperty: opacity`, `transform: none` — movement-free, so no vestibular risk. Checking the grid fix, then pushing:

**ASSISTANT:** Grid leak fixed (two tracks now, not seven) — but they're still stacked. Let me inspect the actual placement rather than infer:

**ASSISTANT:** Found it: `.act__title` carries `grid-column: 1 / -1` in its **base** rule, so the heading spans both columns in any grid it lands in. I only scoped the media-query version. Scoping the base rules too:

**ASSISTANT:** Fixed, and the 12-column layouts still span correctly (`1 / 8`). Pushing and verifying live:

**ASSISTANT:** Two issues on the live desktop build — **horizontal overflow**, which is a real defect. Let me find the culprit element:

**ASSISTANT:** 18px of overflow from three unclassed 242px anchors — that's the footer address block (two phones + one email). Long unbreakable strings in an `auto-fit` grid track. Fixing the cause and adding a guard:

**USER:** <task-notification>
<task-id>bi8by6u3c</task-id>
<tool-use-id>toolu_01EMtatvpjUXsYif3LCkNSqP</tool-use-id>
<status>stopped</status>
<summary>No completion record was found for this background shell command from the previous session. It may have been stopped (via the UI, Monitor timeout, or agent teardown — these leave no transcript marker), or it may have been running when the previous Claude Code process exited. Check the output file for partial results before assuming it completed.</summary>
</task-notification>

**ASSISTANT:** Congratulations on the approval. Before advising, let me look at the actual DNS for the domain — the answer depends entirely on what's currently there.

**ASSISTANT:** **Stop — there's a trap here that would take down their email.**

Look at the MX record: `0 biocharsolutions.africa.` The mail exchanger is the **apex domain itself**, which resolves to `131.153.147.50` — the same cPanel server as the website. And `mail.` is a CNAME pointing back at that apex.

So if you simply repoint the A record to Vercel, the MX follows it to Vercel, Vercel runs no mail server, and **all inbound email dies instantly.**

Let me gather the rest before writing the runbook:

**ASSISTANT:** Now I have the full picture, and it's worse than a simple repoint. Let me confirm Vercel's current DNS targets rather than recite them from memory:

**ASSISTANT:** Vercel's docs confirm two things that matter: the `www` CNAME target is now **project-unique** (e.g. `d1d4fc829fe7bc7c.vercel-dns-017.com`), so it must be read from your dashboard rather than copied from a blog post — and their own warning that the nameserver method requires recreating every DNS record you want to keep.

Here's the situation and the safe path:

**ASSISTANT:** Now a script so you can verify each phase instead of guessing:

**ASSISTANT:** Good news on the approval. **Bad news: the obvious way to do this would take down their email**, and you can't see why without reading the zone.

## The trap

```
MX     biocharsolutions.africa.  →  0 biocharsolutions.africa.   ← the APEX itself
A      biocharsolutions.africa.  →  131.153.147.50               ← WhoGoHost cPanel
CNAME  mail.biocharsolutions.africa. → biocharsolutions.africa.  ← follows the apex too
```

**The mail exchanger *is* the apex A record.** Change that record to Vercel and the MX follows it to Vercel, which runs no SMTP server — every inbound email bounces within minutes. And `mail.` can't save you, because it's a CNAME back to the same apex.

## Two decisions

**Don't move the app to WhoGoHost.** "Move it to the domain" means changing where the domain *points*, no

---
*Auto-generated at 318.6% context usage by context-threshold-tracker*
