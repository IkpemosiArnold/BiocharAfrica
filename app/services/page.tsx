import type { Metadata } from "next";
import Link from "next/link";
import PageHead from "../components/PageHead";
import Photo from "../components/Photo";
import { SERVICES } from "../lib/content";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Biochar production, application, R&D, consulting, briquettes and training, from feedstock to field across Nigeria.",
};

const ANCHORS = [
  "production",
  "application",
  "research",
  "consulting",
  "briquettes",
  "training",
];

/* One distinct frame per service, so the page is carried by the work rather
   than by six identically-sized cards, and deliberately only two from the
   char-on-sand production set. An earlier version leaned on those repeatedly,
   which made the site look like it had four photographs. */
const PLATES = [
  { name: "production-char-drying-rake", alt: "Biochar raked out to dry at the production site" },
  { name: "application-teal-bowl-paddy", alt: "A farmer broadcasting biochar into standing rice" },
  { name: "strawhat-portrait-char", alt: "A farmer in a wide straw hat holding a bowl of biochar in a green field" },
  { name: "paddy-tilling-wide", alt: "A prepared paddy being worked before planting" },
  { name: "production-sacks-stored", alt: "Sacks of finished biochar in storage" },
  { name: "transplanting-crew-wide", alt: "A crew transplanting rice into treated beds" },
] as const;

export default function Services() {
  return (
    <>
      <PageHead
        index="02"
        label="Services"
        title={
          <>
            From feedstock
            <br />
            <em>to field.</em>
          </>
        }
        lede="Six services that connect into one supply chain: waste biomass in at one end, carbon in the ground and a better harvest out at the other."
      />

      {SERVICES.map((s, i) => (
        <section
          key={s.n}
          id={ANCHORS[i]}
          className="act service-deep"
          /* Alternating grounds so six sections do not read as one long slab. */
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
        className="act"
        data-ground="#141f0c"
        data-ink="#e9f0dc"
        data-ink-dim="#8a9b73"
        data-rule="#2b3a1d"
      >
        <div className="shell">
          <div className="cta" data-reveal>
            <h2 className="cta__title">
              Tell us about
              <br />
              <em>your soil.</em>
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
