# Continuity Document

**Project:** BiocharAfrica
**Session:** 34acf2db
**Branch:** main
**Context Usage:** 370.8% (741,556 / 200,000 tokens)
**Timestamp:** 2026-08-12T06:15:49.069Z
**Working Directory:** /Users/mac/Documents/DevProjects/BiocharAfrica

## IMPORTANT: Resume from here

Context window is at 370.8% capacity. Auto-compact will trigger soon.
This document was auto-generated. Continue from the tasks and conversation below.

## Active Tasks

- [completed] Phase 1: decouple email from the apex (mail A, MX, SPF, DMARC, 4x SRV)
- [completed] Phase 2: apex A -> 216.198.79.1, www CNAME -> Vercel
- [completed] Verify: 12 passed, 0 failures; email unchanged through the switch
- [in_progress] Contact form: set CONTACT_TO + SMTP so enquiries actually arrive
- [pending] In a day or two: raise TTLs from 300 back to 14400
- [pending] Optional: decide whether apex or www should be canonical


## Recent Conversation

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

**ASSISTANT:** Let me check where we stand before recommending anything:

**ASSISTANT:** Window expired 5 hours ago, and the zone is stable overnight. But time arithmetic isn't proof — let me confirm the new MX has actually propagated to public resolvers worldwide:

**ASSISTANT:** Real proof, not arithmetic: **all five public resolvers** now return the new MX at TTL 300. The old apex-pointing MX is fully flushed worldwide, and `www` is live with the new site.

**The apex is safe to move.** That's the last step.

One gate before I flip it:

**ASSISTANT:** Email confirmed working. Moving the apex — let me check the session is still alive:

**ASSISTANT:** Session alive, apex confirmed at `131.153.147.50` with TTL 300. Flipping it:

**ASSISTANT:** Apex has moved and email is untouched. The `308` is a redirect, not an error — let me confirm where it goes and that TLS is valid:

**ASSISTANT:** **Cutover complete.** The full chain works:

```
http://biocharsolutions.africa   → 308 → https
https://biocharsolutions.africa  → 308 → https://www.biocharsolutions.africa/
                                        → 200, server: Vercel
                                        → "Biochar Solutions Africa: carbon solutions rooted in African soil"
```

HTTPS negotiated fine on the bare domain (HTTP/2 response proves the certificate is valid — the empty `openssl` output is this sandbox, not the site). Let me teach the checker that this redirect is success, not a warning:

**ASSISTANT:** **Done. The site is live on the real domain.**

I moved the apex only after proving the old MX had genuinely flushed — querying five public resolvers (Google, Cloudflare, Quad9, OpenDNS, Verisign) rather than trusting the four-hour clock. All returned the new MX. Then:

```
A  @  131.153.147.50  →  216.198.79.1     propagated in ~15s
```

```
http://biocharsolutions.africa   → 308 → https
https://biocharsolutions.africa  → 308 → https://www.biocharsolutions.africa/
                                       → 200, server: Vercel
```

**`./scripts/check-dns.sh` → 12 passed, 0 warnings, 0 failures.** Email verified unchanged right through the switch: MX still `mail.biocharsolutions.africa` → `131.153.147.50`.

I also fixed the checker itself — it was flagging the apex's `308` as a warning, but t

---
*Auto-generated at 370.8% context usage by context-threshold-tracker*
