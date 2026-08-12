# Continuity Document

**Project:** BiocharAfrica
**Session:** 34acf2db
**Branch:** main
**Context Usage:** 361.7% (723,409 / 200,000 tokens)
**Timestamp:** 2026-08-11T21:28:12.762Z
**Working Directory:** /Users/mac/Documents/DevProjects/BiocharAfrica

## IMPORTANT: Resume from here

Context window is at 361.7% capacity. Auto-compact will trigger soon.
This document was auto-generated. Continue from the tasks and conversation below.

## Active Tasks

- [completed] Phase 1a: mail CNAME -> A record 131.153.147.50 (TTL 300)
- [completed] Phase 1b: MX repointed from apex to mail.biocharsolutions.africa
- [completed] Phase 1c: '+a' removed from SPF
- [completed] Phase 1d: DMARC added (p=none, report-only)
- [completed] Repoint 4 CalDAV/CardDAV SRV records off the apex
- [completed] www CNAME -> Vercel; already serving the new site over HTTPS
- [completed] Apex A TTL lowered 14400 -> 300, value untouched
- [in_progress] YOU: send a test email in AND out before the apex moves
- [pending] After 00:45 UTC (01:45 WAT): apex A -> 216.198.79.1, then verify
- [pending] Contact form needs CONTACT_TO + SMTP to deliver enquiries


## Recent Conversation

**ASSISTANT:** Now let me see the actual zone records so I can drive the edits:

**ASSISTANT:** I have the full zone — 28 records. And reading it surfaced something my DNS queries missed:

**Four CalDAV/CardDAV SRV records also target the apex** (`_caldav`, `_caldavs`, `_carddav`, `_carddavs` → `biocharsolutions.africa` on ports 2079/2080). Those are cPanel calendar and contacts sync. When the apex moves to Vercel they'll point at a host with no such ports. Lower severity than email, but same root cause, so I'll fix them in the same pass.

Starting with the safest and most important: converting `mail` from a CNAME into a real A record.

**ASSISTANT:** The Type dropdown is editable, so I can convert it in place. Changing `mail` from CNAME to A:

**ASSISTANT:** Type switched to A and it's now asking for an IPv4 address. Filling in the mail server IP and dropping the TTL to 300:

**ASSISTANT:** `mail` is now a real A record at TTL 300. Now the critical one — repointing the MX off the apex:

**ASSISTANT:** **The dangerous part is done.** MX now resolves independently of the apex:

```
MX  →  mail.biocharsolutions.africa.  (TTL 300)
mail →  A 131.153.147.50
apex →  still 131.153.147.50, untouched
```

Now the SPF, before the apex moves:

**ASSISTANT:** SPF clean. Now `www` → Vercel, which is safe immediately since it carries no mail:

**ASSISTANT:** Now lowering the apex TTL — value unchanged, so no risk, but it makes tonight's switch fast to roll back:

**ASSISTANT:** Everything landed correctly:

```
apex   300  A      131.153.147.50          (value unchanged, TTL lowered)
MX     300  MX     mail.biocharsolutions.africa.
www    300  CNAME  a63de0ba0c7e9dec.vercel-dns-017.com.
mail   300  A      131.153.147.50
SPF         no '+a'
```

Adding the DMARC record now:

**ASSISTANT:** **Milestone: `www.biocharsolutions.africa` is already serving the new site.** Vercel issued the certificate and it's live. Full check:

```
11 passed, 1 warning, 0 failures
PASS  MX decoupled from the apex
PASS  mail is an A record -> 131.153.147.50
PASS  SPF has no bare '+a'
PASS  DKIM present   PASS  DMARC present
PASS  apex is free to move: email no longer depends on it
PASS  https://www.biocharsolutions.africa serves the NEW site
```

Let me finish the four SRV records that share the same root cause:

**ASSISTANT:** The rows have stable IDs. Let me find the four SRV edit buttons precisely:

**ASSISTANT:** Predictable field IDs. Setting the target to the mail host:

**ASSISTANT:** All four SRV records moved off the apex. Final verification of the whole zone:

**ASSISTANT:** **11 passed, 0 failures.** The mail ports don't answer from this machine, but that's almost certainly the local network blocking outbound SMTP/IMAP — not conclusive either way, which is exactly why you need to send a real test.

Let me record what we did and work out precisely when the apex can move:

**ASSISTANT:** Phase 1 done — **email is now fully decoupled from the apex**, which was the whole risk. Everything below was changed live in the cPanel Zone Editor, nameservers left at WhoGoHost:

| Record | Before | After |
|---|---|---|
| `mail` | CNAME → apex | **A → 131.153.147.50** |
| **MX** | `0 biocharsolutions.africa.` | **`0 mail.biocharsolutions.africa.`** |
| SPF | `+a +mx ip4:…` | **`+a` removed** |
| `_dmarc` | didn't exist | **added, `p=none`** (report-only, blocks nothing) |
| `www` | CNAME → apex | **→ Vercel** |
| apex A | `.50`, TTL 14400 | **value untouched**, TTL → 300 |

**`www.biocharsolutions.africa` is already serving the new site over HTTPS.** Have a look.

### One thing I found by reading the zone rather than trusting my own plan

Four **CalDAV/CardDAV SRV records** were also t

---
*Auto-generated at 361.7% context usage by context-threshold-tracker*
