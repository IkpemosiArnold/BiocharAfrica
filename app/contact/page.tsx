import type { Metadata } from "next";
import PageHead from "../components/PageHead";
import ContactForm from "../components/ContactForm";
import { COMPANY, PARTNER_AUDIENCES } from "../lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Biochar Solutions Africa Ltd, 27 Ali Baba Crescent, Jabi, Abuja, Nigeria.",
};

export default function Contact() {
  return (
    <>
      <PageHead
        index="04"
        label="Contact"
        title={
          <>
            Tell us about
            <br />
            <em>your soil.</em>
          </>
        }
        lede="Whether you farm, aggregate, process, regulate, research or finance. What you work with, roughly what scale, and what the soil has been doing lately is enough for a first useful conversation."
      />

      <section
        className="act"
        data-ground="#16130f"
        data-ink="#ece7dd"
        data-ink-dim="#8d857a"
        data-rule="#2b261f"
      >
        <div className="shell contact">
          <ContactForm />

          <aside className="contact__aside">
            <div className="contact__block" data-reveal>
              <h2 className="eyebrow">
                <span>Office</span>
              </h2>
              <address>
                {COMPANY.address}
                <br />
                {COMPANY.country}
              </address>
            </div>

            <div className="contact__block" data-reveal data-reveal-delay="80">
              <h2 className="eyebrow">
                <span>Phone</span>
              </h2>
              <p>
                {COMPANY.phones.map((p) => (
                  <a key={p} href={`tel:${p.replace(/\s/g, "")}`}>
                    {p}
                  </a>
                ))}
              </p>
            </div>

            <div className="contact__block" data-reveal data-reveal-delay="160">
              <h2 className="eyebrow">
                <span>Email</span>
              </h2>
              <p>
                {COMPANY.emails.map((e) => (
                  <a key={e} href={`mailto:${e}`}>
                    {e}
                  </a>
                ))}
              </p>
            </div>

            {/* Management's document names exactly who it wants to hear from.
                Saying so up front qualifies the enquiry before it is written. */}
            <div className="contact__block" data-reveal data-reveal-delay="240">
              <h2 className="eyebrow">
                <span>We work with</span>
              </h2>
              <ul className="audiences">
                {PARTNER_AUDIENCES.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </div>

            <div className="contact__block" data-reveal data-reveal-delay="320">
              <h2 className="eyebrow">
                <span>Fields</span>
              </h2>
              <p className="tabular contact__coords">
                Bida 9.077°N 6.014°E
                <br />
                Jima 9.032°N 5.796°E
                <br />
                Suntale 9.032°N 5.796°E
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
