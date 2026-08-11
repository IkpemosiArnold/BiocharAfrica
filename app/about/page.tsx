import type { Metadata } from "next";
import PageHead from "../components/PageHead";
import Photo from "../components/Photo";
import VideoPanel from "../components/VideoPanel";
import { VALUES, COMPANY, TEAM, OVERVIEW } from "../lib/content";

export const metadata: Metadata = {
  title: "About",
  description:
    "Biochar Solutions Africa Ltd turns Nigerian crop waste into stable carbon. Registered in Abuja, working in Niger State.",
};

export default function About() {
  return (
    <>
      <PageHead
        index="01"
        label="About"
        title={
          <>
            We work at the
            <br />
            <em>bottom of the supply chain.</em>
          </>
        }
        lede="Not in a laboratory and not in a policy paper. In flooded paddies in Niger State, alongside the people who will decide whether any of this is worth doing twice."
      />

      <section
        className="act band-tight"
        data-ground="#131009"
        data-ink="#ece7dd"
        data-ink-dim="#8d857a"
        data-rule="#2b261f"
      >
        <div className="shell">
          <p className="overview measure-wide" data-reveal>
            {OVERVIEW}
          </p>
          <p className="overview__sub measure-wide" data-reveal data-reveal-delay="110">
            We deploy efficient, low-emission pyrolysis systems that convert
            rice husks and straw, maize cobs and stalks and other responsibly
            sourced residues into stable, carbon-rich products. The circular
            model reduces open-field burning and uncontrolled decomposition
            while improving soil productivity, strengthening agricultural
            resilience and creating income across rural value chains.
          </p>
        </div>
      </section>

      <section
        className="act"
        data-ground="#16130f"
        data-ink="#ece7dd"
        data-ink-dim="#8d857a"
        data-rule="#2b261f"
      >
        <div className="shell grid12">
          <h2 className="act__title" data-reveal>
            The problem
            <br />
            <em>is the soil.</em>
          </h2>
          <div className="act__body" data-reveal data-reveal-delay="100">
            <p>
              Across much of West Africa the constraint on yield is not seed and
              often not even fertiliser. It is soil that has been cropped for
              decades without anything being returned to it: acidic, low in
              organic matter, unable to hold water through a dry spell or hold
              nutrients through a rain.
            </p>
            <p>
              Fertiliser applied to soil like that largely washes through. The
              farmer pays for inputs that leave the field before the crop can use
              them. Fixing the soil&apos;s ability to hold things is the
              precondition for everything else, and that is what biochar does.
            </p>
          </div>
        </div>

        <div className="shell about__plates">
          <Photo
            name="elder-pan-rice-mountains"
            alt="A farmer applying biochar from a wide pan in a rice field, hills and cloud behind"
            sizes="(max-width: 900px) 100vw, 48vw"
            className="plate"
          />
          <Photo
            name="transplanting-crew-wide"
            alt="A crew transplanting rice seedlings into a prepared paddy"
            sizes="(max-width: 900px) 100vw, 48vw"
            className="plate"
          />
        </div>
      </section>

      <section
        className="act"
        data-ground="#1b1712"
        data-ink="#ece7dd"
        data-ink-dim="#948b7e"
        data-rule="#332c23"
      >
        <div className="shell">
          <p className="eyebrow act__eyebrow" data-reveal>
            <span>What we hold to</span>
          </p>

          <ul className="values">
            {VALUES.map((v, i) => (
              <li
                className="value"
                key={v.title}
                data-reveal
                data-reveal-delay={i * 80}
              >
                <h2 className="value__title">{v.title}</h2>
                <p>{v.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        className="act"
        data-ground="#101a0e"
        data-ink="#e8eddd"
        data-ink-dim="#828d76"
        data-rule="#25301f"
      >
        <div className="shell about__training">
          <div>
            <p className="eyebrow act__eyebrow" data-reveal>
              <span>Training</span>
            </p>
            <h2 className="act__title" data-reveal>
              Capacity that
              <br />
              <em>stays behind.</em>
            </h2>
            <p className="measure" data-reveal>
              A demonstration of powered tillage at Suntale, Niger State,
              recorded on 3 August 2026. Equipment that arrives and leaves
              changes nothing. Technique that stays changes the next season and
              the one after it.
            </p>
          </div>
          <VideoPanel
            clip="training-tiller"
            caption="Powered tillage demonstration"
            place="Suntale, Niger State"
            className="about__training-clip"
          />
        </div>
      </section>

      {/* The company's strongest credential and the old site's most buried
          asset: a Wageningen soil-science PhD, and a founder who has actually
          raised climate finance. */}
      <section
        className="act"
        data-ground="#1b1712"
        data-ink="#ece7dd"
        data-ink-dim="#948b7e"
        data-rule="#332c23"
      >
        <div className="shell">
          <p className="eyebrow act__eyebrow" data-reveal>
            <span>Leadership</span>
          </p>
          <h2 className="act__title" data-reveal>
            Who is
            <br />
            <em>behind it.</em>
          </h2>

          <ul className="team">
            {TEAM.map((m, i) => (
              <li className="member" key={m.name} data-reveal data-reveal-delay={i * 90}>
                <Photo
                  name={m.photo}
                  alt={`${m.name}, ${m.role} at Biochar Solutions Africa`}
                  sizes="(max-width: 56rem) 40vw, 15rem"
                  className="member__portrait"
                  ratio="1 / 1"
                />
                <div className="member__text">
                  <h3 className="member__name">{m.name}</h3>
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
        className="act band-tight"
        data-ground="#ece7dd"
        data-ink="#16130f"
        data-ink-dim="#6b6355"
        data-rule="#cfc7b8"
      >
        <div className="shell">
          <p className="eyebrow act__eyebrow" data-reveal>
            <span>Registered office</span>
          </p>
          <h2 className="act__title" data-reveal>
            {COMPANY.legalName}
          </h2>
          <address className="about__address" data-reveal>
            {COMPANY.address}
            <br />
            {COMPANY.country}
          </address>
        </div>
      </section>
    </>
  );
}
