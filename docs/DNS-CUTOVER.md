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

**7. Change only these two records at WhoGoHost:**

```
A       @     ->  <the A record IP Vercel shows>          TTL 300
CNAME   www   ->  <the project CNAME Vercel shows>        TTL 300
```

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
