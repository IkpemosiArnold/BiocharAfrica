import type { Metadata } from "next";
import Link from "next/link";
import PageHead from "../components/PageHead";
import Photo from "../components/Photo";
import { SOLUTIONS, FEEDSTOCKS } from "../lib/content";

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "Agricultural biochar and soil products, carbon removal and climate finance, waste-to-value infrastructure, and farmer and community partnerships.",
};

/* One distinct frame per solution, so the page is carried by the work rather
   than by four identically-sized cards. */
const PLATES = [
  {
    name: "application-teal-bowl-paddy",
    alt: "A farmer broadcasting biochar into standing rice",
  },
  {
    name: "production-char-drying-rake",
    alt: "Biochar raked out to dry and cool at the production site",
  },
  {
    name: "production-sacks-stored",
    alt: "Sacks of finished biochar in storage before distribution",
  },
  {
    name: "transplanting-crew-wide",
    alt: "A crew transplanting rice seedlings into treated beds",
  },
] as const;

export default function Services() {
  return (
    <>
      <PageHead
        index="02"
        label="Solutions"
        title={
          <>
            From agricultural residues
            <br />
            <em>to regenerative value.</em>
          </>
        }
        lede="Four integrated solutions connecting agriculture, industrial innovation and climate finance. Waste biomass in at one end; better soil, carbon locked in the ground and verifiable climate value out at the other."
      />

      {SOLUTIONS.map((s, i) => (
        <section
          key={s.n}
          id={s.slug}
          className="act service-deep"
          /* Alternating grounds so four sections do not read as one long slab. */
          data-ground={i % 2 === 0 ? "#16130f" : "#1b1712"}
          data-ink="#ece7dd"
          data-ink-dim="#948b7e"
          data-rule="#332c23"
        >
          <div className="shell service-deep__inner">
            <div className="service-deep__text">
              <p className="eyebrow" data-reveal>
                <span>{s.n}</span>
                <span className="rule-dash" />
                <span>{s.title}</span>
              </p>
              <h2 className="service-deep__title" data-reveal>
                {s.lede}
              </h2>
              <p className="measure" data-reveal data-reveal-delay="90">
                {s.body}
              </p>
              {/* What each solution absorbs from the old six-item service list,
                  so a returning visitor can still find what they came for. */}
              <ul className="covers" data-reveal data-reveal-delay="150">
                {s.covers.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
            <Photo
              name={PLATES[i].name}
              alt={PLATES[i].alt}
              sizes="(max-width: 900px) 100vw, 44vw"
              className="service-deep__plate"
              ratio="4 / 3"
            />
          </div>
        </section>
      ))}

      <section
        className="act band-tight"
        data-ground="#ece7dd"
        data-ink="#16130f"
        data-ink-dim="#6b6355"
        data-rule="#cfc7b8"
      >
        <div className="shell">
          <p className="eyebrow act__eyebrow" data-reveal>
            <span>Feedstock</span>
          </p>
          <h2 className="act__title" data-reveal>
            What goes in.
          </h2>
          <ul className="feedstocks">
            {FEEDSTOCKS.map((f, i) => (
              <li key={f} data-reveal data-reveal-delay={i * 80}>
                {f}
              </li>
            ))}
          </ul>
          <p className="caption feedstocks__note" data-reveal>
            Residues that would otherwise be burned in the open field or left to
            decompose, returning their carbon to the atmosphere within a season.
          </p>
        </div>
      </section>

      <section
        className="act"
        data-ground="#141f0c"
        data-ink="#e9f0dc"
        data-ink-dim="#8a9b73"
        data-rule="#2b3a1d"
      >
        <div className="shell">
          <div className="cta" data-reveal>
            <h2 className="cta__title">
              Tell us what
              <br />
              <em>you are working with.</em>
            </h2>
            <div className="cta__actions">
              <Link href="/contact" className="btn btn--solid">
                Start a conversation
              </Link>
              <Link href="/impact" className="btn btn--ghost">
                See the evidence
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
