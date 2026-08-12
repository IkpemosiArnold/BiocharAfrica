import type { Metadata } from "next";
import Link from "next/link";
import PageHead from "../components/PageHead";
import Photo from "../components/Photo";
import { TEAM } from "../lib/content";

export const metadata: Metadata = {
  title: "Team",
  description:
    "The people behind Biochar Solutions Africa: soil science, pyrolysis engineering, carbon markets and rural development, led from Abuja.",
};

/**
 * Team gets its own page because the old site gave it one, management asked for
 * the menu to be completed from that site, and it is the strongest credibility
 * asset the company has. Six named people with checkable credentials does more
 * for a carbon buyer than any claim on the impact page.
 */
export default function Team() {
  return (
    <>
      <PageHead
        index="05"
        label="Team"
        title={
          <>
            Who is
            <br />
            <em>behind it.</em>
          </>
        }
        lede="Soil science, pyrolysis engineering, carbon markets and rural development. Most carbon projects in this region are assembled by intermediaries; this one is run by the people whose names are on it."
      />

      <section
        className="act"
        data-ground="#16130f"
        data-ink="#ece7dd"
        data-ink-dim="#8d857a"
        data-rule="#2b261f"
      >
        <div className="shell">
          <ul className="team">
            {TEAM.map((m, i) => (
              <li
                className="member"
                key={m.name}
                data-reveal
                data-reveal-delay={i * 90}
              >
                <Photo
                  name={m.photo}
                  alt={`${m.name}, ${m.role}`}
                  sizes="(max-width: 56rem) 40vw, 18rem"
                  className="member__portrait"
                  ratio="1 / 1"
                />
                <div className="member__text">
                  <h2 className="member__name">{m.name}</h2>
                  <p className="member__role eyebrow">
                    <span>{m.role}</span>
                  </p>
                  <p className="member__bio">{m.bio}</p>
                </div>
              </li>
            ))}
          </ul>
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
              Talk to
              <br />
              <em>the people doing it.</em>
            </h2>
            <div className="cta__actions">
              <Link href="/contact" className="btn btn--solid">
                Start a conversation
              </Link>
              <Link href="/about" className="btn btn--ghost">
                About the company
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
