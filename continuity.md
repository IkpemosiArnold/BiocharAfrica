# Continuity Document

**Project:** BiocharAfrica
**Session:** 34acf2db
**Branch:** main
**Context Usage:** 387.4% (774,700 / 200,000 tokens)
**Timestamp:** 2026-08-12T12:26:13.172Z
**Working Directory:** /Users/mac/Documents/DevProjects/BiocharAfrica

## IMPORTANT: Resume from here

Context window is at 387.4% capacity. Auto-compact will trigger soon.
This document was auto-generated. Continue from the tasks and conversation below.

## Active Tasks

- [completed] DNS cutover complete: domain live, email untouched, 12/12 checks pass
- [completed] Complete the menu from the old site: add Team page, Home in drawer, footer
- [completed] Stop the hero and community act sharing the same two photographs
- [in_progress] NEED FROM YOU: the sack-rows photo file (not in repo); bagging shot at better than 794x386
- [pending] Contact form: set CONTACT_TO + SMTP so enquiries actually arrive
- [pending] In a day or two: raise TTLs from 300 back to 14400
- [pending] Optional: decide whether apex or www should be canonical


## Recent Conversation

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

**ASSISTANT:** Two clear items. Let me start by pulling the old site's actual menu — it's still on the cPanel server, so I can reach it by IP with a Host header:

**ASSISTANT:** TLS handshake fails against the old server directly. Let me check what I captured earlier in the session, and fall back to the archive:

**ASSISTANT:** Archive is blocked. The old site is WordPress, so let me try its REST API and sitemap directly on the old server:

**ASSISTANT:** The sandbox can't reach the old server over HTTPS. But I captured screenshots of the old site earlier in the session — let me read the menu straight off those:

**ASSISTANT:** The old menu is right there: **Home · About · Services · Team · Contact** (footer confirms: Home, About Us, Our Services, Our Team, Contact Us).

So the gap is **Team** — I built the six leaders into `/about`, but the old site gave them their own page, and they're the strongest credibility asset here. Let me check the photo duplication management flagged:

**ASSISTANT:** Confirmed — `community-gathering-wide` and `community-women-training` appear in **both** the hero slideshow and the community section. Management is right.

Let me check whether I already have the first replacement they sent:

**ASSISTANT:** That's exactly the first photo they sent — I have it as `production-bagging-crew`, though only at **794×386**, which is small for a feature slot. The second (rows of sacks) I don't have at all.

Let me do the menu work now, which is fully actionable, and swap the community photos to the closest matches I hold:

**ASSISTANT:** Now the dedicated Team page the old site had:

**ASSISTANT:** Now the community photo swap management asked for, plus the strip styling:

**ASSISTANT:** Build passes with 11 routes now. Let me verify the new page and the edited `/about` before this goes to a live company site:

**ASSISTANT:** `/about` teaser works, `/team` has all six with no broken images, and the nav reads **About · Services · Team · Impact**. Pushing:

**ASSISTANT:** Both items done and live. All six routes return 200 on the real domain, and the DNS checker still reads **12 passed, 0 failures**.

## The menu

The old site's menu was **Home · About · Services · Team · Contact** — I read it off the screenshots I'd captured earlier, since the sandbox can't open HTTPS to the old server and web.archive.org is blocked.

**Team was missing entirely.** I'd buried the six leaders inside `/about`. They now have their own page, which is also where they belong on merit — six named people with checkable credentials (Lancaster PhD, Cambridge/Stanford/MIT fellowships) is the strongest credibility asset the company has, and a carbon buyer will go looking for it. `/about` keeps a face strip and a "Meet the team" link rather than a duplicate roster. Home added to the mo

---
*Auto-generated at 387.4% context usage by context-threshold-tracker*
