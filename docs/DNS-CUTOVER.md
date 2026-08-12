# Cutover: pointing biocharsolutions.africa at the new site

Goal: the live domain serves the new site, and **email keeps working throughout**.

---

## Read this first: the trap

The current DNS has email and the website on the **same host**, wired through the
same record:

```
MX      biocharsolutions.africa.  ->  0 biocharsolutions.africa.   <-- the APEX itself
A       biocharsolutions.africa.  ->  131.153.147.50               <-- WhoGoHost cPanel
CNAME   mail.biocharsolutions.africa. -> biocharsolutions.africa.  <-- follows the apex too
CNAME   www.biocharsolutions.africa.  -> biocharsolutions.africa.
```

The mail exchanger **is the apex record**. So the obvious move, "just change the A
record to Vercel", does this:

1. apex A becomes a Vercel IP
2. MX still says `biocharsolutions.africa.`, which now resolves to Vercel
3. Vercel runs no SMTP server
4. **every inbound email bounces, immediately**

`mail.` is a CNAME to the apex, so it follows the apex and cannot save you.

The fix is to give email its own address that does not depend on the apex,
**before** the website moves. That is Phase 1 below, and it must be finished and
verified before Phase 2 starts.

---

## Two decisions, and why

### Do NOT move the app onto WhoGoHost

This is a Next.js 16 application: server-rendered pages, a live API route at
`/api/contact`, and per-request rendering. WhoGoHost shared cPanel is
PHP/Apache with no Node server runtime, so it cannot run it. Exporting a static
build would drop the contact endpoint and the server rendering.

**Keep the app on Vercel. Point the domain at it.** "Moving to the domain" means
changing where the domain points, not where the code lives.

### Do NOT switch nameservers to Vercel

Tempting, and it is the one change that breaks everything at once. Vercel's own
documentation warns: *"If you are verifying your domain by changing nameservers,
you will need to add any DNS records to Vercel that you wish to keep from your
previous DNS provider."*

That means MX, SPF, DKIM, `webmail`, `cpanel` and `autodiscover` would all have
to be recreated by hand, and anything missed is a silent outage.

**Leave the nameservers at WhoGoHost** (`nsa/nsb.whogohost.com`) and edit
individual records. Email records are then never touched by the website change.

---

## Phase 0 — lower TTLs, then wait

Every record is currently on a 4 hour TTL (14400s). That is also how long a
mistake would take to undo. Before changing anything else, set the TTL to **300**
on these records only:

| Record | Name |
|---|---|
| A | `biocharsolutions.africa` (apex) |
| CNAME | `www` |
| MX | apex |
| CNAME | `mail` |

**Then wait 4 hours** so the old 4 hour TTL has expired everywhere. Skipping this
wait is the difference between a 5 minute rollback and a 4 hour outage.

---

## Phase 1 — give email its own address (website untouched)

Nothing here affects the website. Do it, verify it, and only then continue.

**1. Turn `mail` into a real A record.** It is currently a CNAME to the apex.

```
DELETE   CNAME  mail   ->  biocharsolutions.africa.
CREATE   A      mail   ->  131.153.147.50        TTL 300
```

**2. Point the MX at that hostname instead of the apex.**

```
WAS   MX  @  ->  0 biocharsolutions.africa.
NOW   MX  @  ->  0 mail.biocharsolutions.africa.     TTL 300
```

**3. Fix SPF.** The current record contains `+a`, which authorises whatever IP the
apex A record points to. After Phase 2 that is Vercel, which would authorise
Vercel's infrastructure to send mail as this domain and is simply wrong. The real
server is already covered explicitly by `+ip4:131.153.147.50`.

```
WAS   v=spf1 +a +mx +ip4:131.153.147.50 include:spf.antispamcloud.com include:spf.host-ww.net +include:relay.mailchannels.net ~all
NOW   v=spf1 +mx +ip4:131.153.147.50 include:spf.antispamcloud.com include:spf.host-ww.net +include:relay.mailchannels.net ~all
```

`+mx` now resolves to `mail.` which is the correct server, so it still passes.

**4. VERIFY BEFORE CONTINUING.** Wait ~10 minutes, then:

```bash
./scripts/check-dns.sh          # expects: MX -> mail.…, mail is an A record
```

Then do the real test, which DNS cannot prove for you:

- send an email **to** an address on the domain from an outside account (Gmail)
- send an email **from** that address to an outside account
- open webmail and confirm the mailbox is intact

**Do not start Phase 2 until both directions work.** If anything is wrong, revert
the MX to `0 biocharsolutions.africa.` and you are back where you started.

---

## Phase 2 — point the website at Vercel

**5. Add the domain in Vercel.** Project → Settings → Domains → Add. Add both
`biocharsolutions.africa` and `www.biocharsolutions.africa`.

**6. Copy the values Vercel shows you.** Use the dashboard values, not values from
any guide including this one. The `www` CNAME target is now **unique per project**
(it looks like `d1d4fc829fe7bc7c.vercel-dns-017.com`), so a generic value copied
from an old tutorial will fail.

**7. Change only these two records at WhoGoHost.** Values read from this
project's Vercel dashboard on 11 Aug 2026:

```
A       @     ->  216.198.79.1                            TTL 300
CNAME   www   ->  a63de0ba0c7e9dec.vercel-dns-017.com.    TTL 300
```

`216.198.79.1` is Vercel's current recommended IP; the legacy `76.76.21.21` and
`cname.vercel-dns.com` still work but should not be used for a new setup. The
CNAME target is unique to this project and will not work for any other.

**The `www` CNAME is safe to set immediately.** It carries no mail, so it does
not have to wait for the MX TTL. Only the apex must wait.

**8. Wait for the certificate.** Vercel issues TLS automatically once DNS
resolves, usually a few minutes. The dashboard will say **Valid Configuration**.

---

## Phase 3 — verify, then restore TTLs

```bash
./scripts/check-dns.sh
```

Check by hand:

- `https://biocharsolutions.africa` serves the new site, valid padlock
- `https://www.biocharsolutions.africa` also works
- send one more email in **and** out
- `webmail.biocharsolutions.africa` and `cpanel.biocharsolutions.africa` still load

Once stable for a day or two, put the TTLs back to 14400.

---

## Rollback

If the site is wrong, only the website records need reverting:

```
A       @     ->  131.153.147.50
CNAME   www   ->  biocharsolutions.africa.
```

At TTL 300 that is live in about five minutes. Email is unaffected either way,
because after Phase 1 it no longer depends on the apex.

---

## Records to leave completely alone

These are already independent of the apex and must not be edited:

| Record | Name | Value |
|---|---|---|
| A | `webmail` | 131.153.147.50 |
| A | `cpanel` | 131.153.147.50 |
| A | `autodiscover` | 131.153.147.50 |
| TXT | `default._domainkey` | the DKIM public key |

---

## Two things worth doing while you are in there

**There is no DMARC record.** SPF and DKIM are both configured, but without DMARC
nothing tells receiving servers what to do when they fail. Add:

```
TXT  _dmarc  ->  v=DMARC1; p=none; rua=mailto:biocharsolutionsafrica@gmail.com
```

`p=none` only reports, it never blocks mail, so it is safe to add immediately.
Tighten to `quarantine` later once the reports look clean.

**The contact form still cannot deliver.** `app/api/contact/route.ts` returns 503
until `CONTACT_TO` and a mail provider are set. Now that the mail server is
confirmed reachable at `mail.biocharsolutions.africa`, the cPanel mailbox can send
the form over SMTP. Set the environment variables in Vercel, not in the repo.

---

## Keep paying for the cPanel account

Obvious once said, easy to forget: the website moves off that server but **the
mailboxes stay on it**. Cancelling the WhoGoHost hosting to "save money now that
the site is on Vercel" deletes the email.

---

# EXECUTION LOG

## 11 Aug 2026, 20:30–21:20 UTC — Phase 1 complete, done live in cPanel Zone Editor

Zone is edited at **cPanel → Zone Editor** on `cpanel.biocharsolutions.africa`
(server `wghp3.wghservers.com`). Nameservers left at WhoGoHost throughout.

| Record | Before | After |
|---|---|---|
| `mail` | CNAME → apex | **A → 131.153.147.50**, TTL 300 |
| MX | `0 biocharsolutions.africa.` | **`0 mail.biocharsolutions.africa.`**, TTL 300 |
| SPF | `v=spf1 +a +mx ip4:…` | **`+a` removed**, rest unchanged |
| `_dmarc` | did not exist | **`v=DMARC1; p=none; rua=…; fo=1`** |
| `www` | CNAME → apex | **CNAME → `a63de0ba0c7e9dec.vercel-dns-017.com.`**, TTL 300 |
| apex A | `131.153.147.50` TTL 14400 | value **unchanged**, TTL lowered to 300 |
| `_caldav._tcp` SRV | target apex | target `mail.biocharsolutions.africa` |
| `_caldavs._tcp` SRV | target apex | target `mail.biocharsolutions.africa` |
| `_carddav._tcp` SRV | target apex | target `mail.biocharsolutions.africa` |
| `_carddavs._tcp` SRV | target apex | target `mail.biocharsolutions.africa` |

The four SRV records were **not** in the original plan. They were found by
reading the actual zone rather than by querying the records we expected to
exist: cPanel publishes CalDAV/CardDAV autodiscovery on ports 2079/2080 and had
pointed all four at the apex. They would have followed it to Vercel and quietly
broken calendar and contacts sync. Same root cause as the MX, so fixed in the
same pass.

`_autodiscover._tcp` correctly targets `cpanelemaildiscovery.cpanel.net` and was
left alone.

**Result: nothing in the zone depends on the apex A record any more except the
website itself.** Verified: `./scripts/check-dns.sh` → 11 passed, 0 failures.

`www.biocharsolutions.africa` already serves the new site over HTTPS.

## Remaining: the apex

**Do not move the apex before 2026-08-12 00:45 UTC (01:45 WAT).**

The MX was changed at 20:45 UTC while carrying a 14400s TTL. Any resolver that
cached the OLD MX before that moment still believes the mail exchanger is the
apex, for up to four hours. Move the apex inside that window and those resolvers
deliver mail to Vercel.

After that time:

```
A   @   ->  216.198.79.1     (TTL already 300)
```

Then `./scripts/check-dns.sh` and confirm the site loads on the bare domain.

Rollback is `A @ -> 131.153.147.50`, live in ~5 minutes at TTL 300.

## 12 Aug 2026, 06:05 UTC — Phase 2 complete. Cutover done.

Waited out the old MX TTL before touching the apex, and confirmed it had actually
flushed rather than trusting the clock: all five public resolvers (Google,
Cloudflare, Quad9, OpenDNS, Verisign) were returning the new MX at TTL 300.

```
A   @   131.153.147.50   ->   216.198.79.1
```

Propagated to 8.8.8.8 in ~15 seconds. Live chain:

```
http://biocharsolutions.africa   -> 308 -> https
https://biocharsolutions.africa  -> 308 -> https://www.biocharsolutions.africa/
                                        -> 200, server: Vercel
```

`./scripts/check-dns.sh` -> **12 passed, 0 warnings, 0 failures.**

Email verified unchanged through the switch: MX still
`0 mail.biocharsolutions.africa.` -> `131.153.147.50`.

### Note: the site is canonically on www

Vercel issues a 308 from the apex to `www`, which is its default and its
recommendation. Both hostnames work and both are HTTPS. If management would
rather the bare domain be canonical, that is a setting in Vercel (Project ->
Domains -> set the apex as primary), not a DNS change.

### Still open

- **TTLs are at 300.** Leave them for a day or two in case a rollback is needed,
  then raise back to 14400 to reduce lookup load.
- **The contact form cannot deliver.** `CONTACT_TO` and an SMTP provider still
  need setting in Vercel's environment variables.
