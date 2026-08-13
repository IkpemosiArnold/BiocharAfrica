"use client";

import { useState } from "react";
import { COMPANY } from "../lib/content";

type Status =
  | "idle"
  | "sending"
  | "sent"
  | "unconfigured"
  | "throttled"
  | "error";

/**
 * Enquiry form.
 *
 * Deliberate behaviour when no mail provider is wired up: the API returns 503
 * and this falls back to a prefilled mailto with everything the visitor typed.
 * The alternative, accepting the submission and returning a cheerful success
 * message while the message goes nowhere, silently loses real customers. A
 * visible fallback is better than a convincing lie.
 */
export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [mailto, setMailto] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;

    // Honeypot: bots fill every field they find. Humans never see this one.
    if (data.website) return;

    setStatus("sending");

    const body = [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      data.phone ? `Phone: ${data.phone}` : "",
      data.location ? `Location: ${data.location}` : "",
      data.hectares ? `Land: ${data.hectares}` : "",
      "",
      data.message,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      // Too many in quick succession. Not a failure worth a mailto fallback,
      // the visitor just needs to wait, so say that rather than bouncing them
      // into their mail client.
      if (res.status === 429) {
        setStatus("throttled");
        return;
      }

      if (res.status === 503) {
        setMailto(
          `mailto:${COMPANY.emails[0]}?subject=${encodeURIComponent(
            `Enquiry from ${data.name}`
          )}&body=${encodeURIComponent(body)}`
        );
        setStatus("unconfigured");
        return;
      }

      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
      form.reset();
    } catch {
      setMailto(
        `mailto:${COMPANY.emails[0]}?subject=${encodeURIComponent(
          `Enquiry from ${data.name}`
        )}&body=${encodeURIComponent(body)}`
      );
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="form form--done" role="status">
        <h2 className="form__done-title">Message received.</h2>
        <p className="measure">
          Someone will read this properly rather than send you an automated
          sequence. Expect a reply within two working days.
        </p>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate={false}>
      <div className="form__row">
        <label className="field">
          <span className="field__label">Name</span>
          <input name="name" type="text" required autoComplete="name" />
        </label>
        <label className="field">
          <span className="field__label">Email</span>
          <input name="email" type="email" required autoComplete="email" />
        </label>
      </div>

      <div className="form__row">
        <label className="field">
          <span className="field__label">
            Phone <span className="field__opt">optional</span>
          </span>
          <input name="phone" type="tel" autoComplete="tel" />
        </label>
        <label className="field">
          <span className="field__label">
            Where <span className="field__opt">state or nearest town</span>
          </span>
          <input name="location" type="text" />
        </label>
      </div>

      <label className="field">
        <span className="field__label">
          How much land <span className="field__opt">optional</span>
        </span>
        <input name="hectares" type="text" placeholder="e.g. 4 hectares of rice" />
      </label>

      <label className="field">
        <span className="field__label">What are you working with</span>
        <textarea
          name="message"
          rows={6}
          required
          placeholder="What you grow, what the soil has been doing, and what you have already tried."
        />
      </label>

      {/* Honeypot. Off-screen rather than display:none, which some bots skip. */}
      <div className="form__trap" aria-hidden="true">
        <label>
          Website
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="form__foot">
        <button className="btn btn--solid" type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending" : "Send enquiry"}
        </button>

        {status === "throttled" && (
          <p className="form__fallback" role="alert">
            That is a few messages in quick succession. Give it a minute and try
            again.
          </p>
        )}

        {(status === "unconfigured" || status === "error") && (
          <p className="form__fallback" role="alert">
            {status === "unconfigured"
              ? "Email delivery is not connected on this site yet."
              : "That did not send."}{" "}
            <a href={mailto}>
              Open this message in your mail app instead
            </a>
            , or write to {COMPANY.emails[0]}.
          </p>
        )}
      </div>
    </form>
  );
}
