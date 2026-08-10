import type { Metadata } from "next";
import Link from "next/link";
import PageHead from "../components/PageHead";
import Photo from "../components/Photo";
import { FIELD_SITES } from "../lib/content";

export const metadata: Metadata = {
  title: "Impact",
  description:
    "What biochar does to Nigerian soil, what is measured, and where the work has actually been done. Three GPS-logged sites in Niger State.",
};

export default function Impact() {
  return (
    <>
      <PageHead
        index="03"
        label="Impact"
        title={
          <>
            Claims we can show you
            <br />
            <em>the coordinates for.</em>
          </>
        }
        lede="Carbon marketing is full of round numbers nobody can trace. This page separates what is a property of biochar, what the company has observed in its own fields, and what is still being measured."
      />

      {/* Mechanism: settled science, stated plainly. */}
      <section
        className="act"
        data-ground="#16130f"
        data-ink="#ece7dd"
        data-ink-dim="#8d857a"
        data-rule="#2b261f"
      >
        <div className="shell">
          <p className="eyebrow act__eyebrow" data-reveal>
            <span>What is true of biochar</span>
          </p>

          <ul className="claims">
            <li className="claim" data-reveal>
              <h2 className="claim__title">It stays put</h2>
              <p>
                Pyrolysis rearranges plant carbon into aromatic structures that
                soil microbes cannot readily break down. Carbon added as biochar
                persists on a scale of centuries to a millennium, rather than the
                single season that compost or crop residue gives you.
              </p>
            </li>
            <li className="claim" data-reveal data-reveal-delay="90">
              <h2 className="claim__title">It holds water</h2>
              <p>
                The pore network takes up water during rain and releases it back
                to roots through dry spells. In rain-fed systems that buffer is
                often the difference between a crop that finishes and one that
                does not.
              </p>
            </li>
            <li className="claim" data-reveal data-reveal-delay="180">
              <h2 className="claim__title">It buffers acidity</h2>
              <p>
                Biochar is typically alkaline and raises pH in acidic soils,
                which is the specific condition limiting yield across large areas
                of the region we work in.
              </p>
            </li>
          </ul>
        </div>
      </section>

      {/* Company-stated observation, attributed as such rather than presented
          as an independently verified result. */}
      <section
        className="act"
        data-ground="#101a0e"
        data-ink="#e8eddd"
        data-ink-dim="#828d76"
        data-rule="#25301f"
      >
        <div className="shell grid12">
          <p className="eyebrow act__eyebrow" data-reveal>
            <span>What we have observed</span>
          </p>
          <h2 className="act__title" data-reveal>
            Up to
            <br />
            <em>25% more yield.</em>
          </h2>
          <div className="act__body" data-reveal data-reveal-delay="90">
            <p>
              This is the company&apos;s own field experience, most pronounced in
              degraded and acidic soils where conventional inputs return the
              least. It is stated as an observation from our own plots, not as a
              controlled trial result, and we would rather say so than round it
              up and call it science.
            </p>
            <p>
              Independent trial data is the next thing this page should carry.
              Until it does, the honest evidence is where the work happened.
            </p>
          </div>
        </div>
      </section>

      {/* The verifiable part: real GPS stamps from the field team's phones. */}
      <section
        className="act"
        data-ground="#ece7dd"
        data-ink="#16130f"
        data-ink-dim="#6b6355"
        data-rule="#cfc7b8"
      >
        <div className="shell">
          <p className="eyebrow act__eyebrow" data-reveal>
            <span>Where the work was done</span>
          </p>
          <h2 className="act__title" data-reveal>
            Three sites,
            <br />
            <em>one morning.</em>
          </h2>
          <p className="measure-wide log__lede" data-reveal>
            Niger State, 3 August 2026. The coordinate stamps are the field
            team&apos;s, burned in by the camera at the moment of capture.
          </p>

          <ol className="log">
            {FIELD_SITES.map((site, i) => (
              <li
                className="log__row"
                key={site.place}
                data-reveal
                data-reveal-delay={i * 110}
              >
                <div className="log__index tabular">0{i + 1}</div>
                <div className="log__shot">
                  <Photo
                    name={site.photo}
                    alt={`Field record from ${site.place}, ${site.state}: ${site.note}`}
                    sizes="(max-width: 780px) 100vw, 42vw"
                  />
                </div>
                <dl className="log__meta">
                  <div>
                    <dt>Site</dt>
                    <dd className="log__place">{site.place}</dd>
                  </div>
                  <div>
                    <dt>Coordinates</dt>
                    <dd className="tabular">
                      {site.lat.toFixed(6)}°N
                      <br />
                      {site.lon.toFixed(6)}°E
                    </dd>
                  </div>
                  <div>
                    <dt>Altitude</dt>
                    <dd className="tabular">{site.altitude}</dd>
                  </div>
                  <div>
                    <dt>Recorded</dt>
                    <dd className="tabular">03.08.2026 · {site.time}</dd>
                  </div>
                  <div className="log__note">
                    <dt>Activity</dt>
                    <dd>{site.note}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ol>
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
              Bring us
              <br />
              <em>a difficult field.</em>
            </h2>
            <div className="cta__actions">
              <Link href="/contact" className="btn btn--solid">
                Start a conversation
              </Link>
              <Link href="/services" className="btn btn--ghost">
                What we do
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
