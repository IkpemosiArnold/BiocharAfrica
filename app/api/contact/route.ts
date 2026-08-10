import { NextResponse } from "next/server";

/**
 * Enquiry endpoint.
 *
 * No mail provider is wired up yet, and rather than pretend otherwise this
 * returns 503 so the client can fall back to a prefilled mailto. Accepting the
 * POST and returning 200 would look better and lose real enquiries silently.
 *
 * To finish this: set CONTACT_TO and add a provider call where marked. Any of
 * Resend, Postmark or SES is a few lines; the validation below is already done.
 */
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

  const name = String(data.name ?? "").trim();
  const email = String(data.email ?? "").trim();
  const message = String(data.message ?? "").trim();

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

  const to = process.env.CONTACT_TO;
  if (!to) {
    return NextResponse.json(
      { error: "Mail delivery is not configured on this deployment." },
      { status: 503 }
    );
  }

  // TODO: send via provider here, using `to` and the validated fields above.
  // Until that exists, treat a configured CONTACT_TO without a provider as a
  // deployment mistake rather than silently dropping the enquiry.
  return NextResponse.json(
    { error: "Mail delivery is not configured on this deployment." },
    { status: 503 }
  );
}
