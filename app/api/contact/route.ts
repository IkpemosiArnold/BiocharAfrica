import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

/**
 * Enquiry endpoint. Delivers over SMTP to the company's own cPanel mailbox.
 *
 * WHY cPANEL SMTP AND NOT A SENDING SERVICE
 * The domain already runs its own mail server, the mailbox that should receive
 * these already exists, and SPF and DKIM are already published for that server.
 * Adding Resend or Postmark would mean a second vendor, a second bill, and new
 * SPF entries to authorise a sender the company does not otherwise use. There is
 * nothing to gain here.
 *
 * WHY THE From ADDRESS IS OURS AND NOT THE VISITOR'S
 * The obvious thing is to set From to whoever filled in the form, so replies
 * work. It is also the thing that gets the mail junked. The domain publishes
 * SPF, DKIM and now DMARC; a message claiming to be From gmail.com but sent by
 * this server fails alignment on both, and DMARC exists precisely to catch that.
 * So From is always the domain address, and the visitor goes in Reply-To, which
 * every mail client honours when you hit reply.
 *
 * Runs on the Node runtime, not Edge: SMTP needs raw TCP sockets, which the Edge
 * runtime does not provide.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* Crude per-instance throttle. Serverless means this is not shared between
   instances and resets on cold start, so it is not real rate limiting. It is
   only here to stop one bored person emptying a form into the mailbox a hundred
   times in a minute. Anything stronger belongs in front of the app. */
const recent = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 4;

function overRate(ip: string) {
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  recent.set(ip, hits);
  if (recent.size > 500) recent.clear(); // bound the memory, bluntly
  return hits.length > MAX_PER_WINDOW;
}

function esc(s: string) {
  return s.replace(/[<>&]/g, (c) =>
    c === "<" ? "&lt;" : c === ">" ? "&gt;" : "&amp;"
  );
}

export async function POST(request: Request) {
  let data: Record<string, unknown>;

  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  // Honeypot. Bots fill every field; a filled "website" is not a person.
  // Return 200 so the bot believes it succeeded and does not retry.
  if (typeof data.website === "string" && data.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (overRate(ip)) {
    return NextResponse.json(
      { error: "Too many messages just now. Please try again shortly." },
      { status: 429 }
    );
  }

  const name = String(data.name ?? "").trim();
  const email = String(data.email ?? "").trim();
  const message = String(data.message ?? "").trim();
  const phone = String(data.phone ?? "").trim();
  const location = String(data.location ?? "").trim();
  const hectares = String(data.hectares ?? "").trim();

  const errors: string[] = [];
  if (name.length < 2) errors.push("name");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.push("email");
  if (message.length < 10) errors.push("message");

  if (errors.length) {
    return NextResponse.json(
      { error: "Some fields need attention.", fields: errors },
      { status: 422 }
    );
  }

  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    CONTACT_TO,
    CONTACT_FROM,
  } = process.env;

  /* Unconfigured still fails loudly. The client falls back to a prefilled
     mailto, so the enquiry survives; returning 200 here would look tidier and
     lose it. */
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !CONTACT_TO) {
    return NextResponse.json(
      { error: "Mail delivery is not configured on this deployment." },
      { status: 503 }
    );
  }

  const port = Number(SMTP_PORT ?? 465);

  const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    // 465 is implicit TLS; 587 starts plaintext and upgrades via STARTTLS.
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    // cPanel boxes are frequently behind a shared certificate that does not
    // match the mail hostname. Refusing to send on that basis would break
    // delivery for a certificate mismatch on a connection that is still
    // encrypted, so require TLS but do not demand a matching name.
    requireTLS: true,
    tls: { rejectUnauthorized: false },
    connectionTimeout: 12_000,
    greetingTimeout: 12_000,
    socketTimeout: 20_000,
  });

  const lines = [
    `Name:     ${name}`,
    `Email:    ${email}`,
    phone ? `Phone:    ${phone}` : null,
    location ? `Location: ${location}` : null,
    hectares ? `Land:     ${hectares}` : null,
    "",
    message,
    "",
    "---",
    "Sent from the enquiry form at biocharsolutions.africa",
  ].filter(Boolean);

  try {
    await transport.sendMail({
      to: CONTACT_TO,
      // Always ours, so SPF, DKIM and DMARC all align. See the note above.
      from: `"Biochar Solutions Africa" <${CONTACT_FROM ?? SMTP_USER}>`,
      // Hitting reply in any mail client goes to the person who wrote in.
      replyTo: `"${name}" <${email}>`,
      subject: `Enquiry from ${name}${location ? ` (${location})` : ""}`,
      text: lines.join("\n"),
      html: `<pre style="font:14px/1.5 ui-monospace,monospace;white-space:pre-wrap">${esc(
        lines.join("\n")
      )}</pre>`,
    });
  } catch (err) {
    // Log for the platform, but never leak SMTP internals to the browser.
    console.error("contact: SMTP send failed", err);
    return NextResponse.json(
      { error: "Could not send the message." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
