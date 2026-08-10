import Link from "next/link";
import Hero from "./components/Hero";
import Permanence from "./components/Permanence";
import GroundShift from "./components/GroundShift";
import Photo from "./components/Photo";
import VideoPanel from "./components/VideoPanel";
import { FIELD_SITES, SERVICES } from "./lib/content";

/**
 * Home, seven acts, and the page's ground colour migrates from carbon black to
 * acid paddy green across them. The background is the argument: black becomes
 * green, sky-carbon becomes ground-carbon. Each <section> declares its palette
 * via data-ground / data-ink; GroundShift interpolates between them.
 */
export default function Home() {
  return (
    <>
      <GroundShift />
      <Hero />

      {/* ── Act II, what it actually is ─────────────────────────────────── */}
      <section
        className="act act--definition"
        data-ground="#16130f"
        data-ink="#ece7dd"
        data-ink-dim="#8d857a"
        data-rule="#2b261f"
      >
        <div className="shell grid12">
          <p className="eyebrow act__eyebrow" data-reveal>
            <span>01</span>
            <span className="rule-dash" />
            <span>What it is</span>
          </p>

          <h2 className="act__title" data-reveal>
            Not ash.
            <br />
            Charcoal that will
            <br />
            <em>never burn again.</em>
          </h2>

          <div className="act__body" data-reveal data-reveal-delay="100">
            <p>
              Heat plant matter to around 500°C with almost no oxygen and it
              cannot catch fire. Instead it breaks down. This is pyrolysis: it
              drives off water and volatile gases and leaves behind a black,
              brittle skeleton of almost pure carbon.
            </p>
            <p>
              Rice husk, corn cob, wood residue: waste that is normally burned in
              the open field or left to rot, releasing its carbon back into the
              air within a season. Pyrolysed instead, that same carbon becomes
              something a farmer can carry into a paddy in a plastic bowl.
            </p>
          </div>
        </div>

        <div className="shell definition__plates">
          <Photo
            name="production-char-drying-rake"
            alt="Freshly pyrolysed biochar raked out to dry on sheeting at the production site"
            sizes="(max-width: 900px) 100vw, 58vw"
            className="plate plate--wide"
          />
          <div className="definition__aside">
            <Photo
              name="production-bagging-crew"
              alt="Workers bagging finished biochar from a heap"
              sizes="(max-width: 900px) 100vw, 34vw"
              className="plate"
            />
            <p className="caption">
              Char raked to cool and dry, then bagged. From here it moves to the
              field by road.
            </p>
          </div>
        </div>
      </section>

      {/* ── Act III, the pore structure, which the hero flew through ─────── */}
      <section
        className="act act--pore"
        data-ground="#1b1712"
        data-ink="#ece7dd"
        data-ink-dim="#948b7e"
        data-rule="#332c23"
      >
        <div className="shell">
          <p className="eyebrow act__eyebrow" data-reveal>
            <span>02</span>
            <span className="rule-dash" />
            <span>Why it works</span>
          </p>

          <h2 className="pore__title" data-reveal>
            One gram.
            <br />
            Hundreds of square metres
            <br />
            <em>of surface.</em>
          </h2>

          <div className="pore__grid">
            <p className="measure" data-reveal>
              What you flew through at the top of this page is the reason biochar
              works. Pyrolysis leaves behind the plant&apos;s own vascular
              architecture as a labyrinth of interconnected voids. Macropores
              wide enough to hold water. Micropores fine enough to lock carbon
              away from the microbes that would otherwise consume it.
            </p>
            <div className="pore__facts">
              <div className="fact" data-reveal>
                <span className="fact__k tabular">Holds</span>
                <p>
                  Water in the pore network, released slowly back to roots
                  through dry spells.
                </p>
              </div>
              <div className="fact" data-reveal data-reveal-delay="90">
                <span className="fact__k tabular">Houses</span>
                <p>
                  Soil microbes, sheltered inside the structure where they build
                  nutrient cycling.
                </p>
              </div>
              <div className="fact" data-reveal data-reveal-delay="180">
                <span className="fact__k tabular">Buffers</span>
                <p>
                  Acidity, which matters enormously in the degraded, acidic
                  soils common across the region.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="shell pore__plate">
          <Photo
            name="wm-char-bed-hand"
            alt="A hand pressed into a bed of drying biochar, showing the coarse porous granules"
            sizes="(max-width: 900px) 100vw, 90vw"
            className="plate"
          />
        </div>
      </section>

      {/* ── Act IV, into the ground. The green begins here. ──────────────── */}
      <section
        className="act act--field"
        data-ground="#101a0e"
        data-ink="#e8eddd"
        data-ink-dim="#828d76"
        data-rule="#25301f"
      >
        <div className="shell">
          <p className="eyebrow act__eyebrow" data-reveal>
            <span>03</span>
            <span className="rule-dash" />
            <span>Into the ground</span>
          </p>

          <h2 className="act__title field__title" data-reveal>
            Broadcast by hand,
            <br />
            <em>bowl by bowl.</em>
          </h2>

          <p className="measure-wide field__lede" data-reveal>
            No machinery, no proprietary applicator. Char is carried into the
            paddy in whatever will hold it: a basin, a bucket, a cooking bowl.
            It is scattered by the people who farm the plot. This is what
            adoption actually looks like.
          </p>
        </div>

        <div className="field__reel">
          <VideoPanel
            clip="broadcast-braids"
            caption="Broadcasting char between rows"
            place="9.032°N 5.796°E"
          />
          <VideoPanel
            clip="broadcast-strawhat"
            caption="Working a treated bed"
            place="Niger State"
          />
          <VideoPanel
            clip="broadcast-headwrap"
            caption="Application into standing rice"
            place="Niger State"
          />
          <VideoPanel
            clip="broadcast-mountains"
            caption="Late-afternoon application"
            place="Niger State"
          />
        </div>

        <div className="shell field__pair">
          <Photo
            name="portrait-farmer-blue-bucket"
            alt="A farmer standing in a rice field holding a blue bucket of biochar, hills behind her"
            sizes="(max-width: 900px) 100vw, 46vw"
            className="plate"
          />
          <div className="field__pair-text">
            <p data-reveal>
              Biochar is not a fertiliser and does not behave like one. It is a
              soil amendment: it improves what the soil can hold and how it holds
              it, so that water and nutrients already present stop washing
              straight through.
            </p>
            <p data-reveal data-reveal-delay="120">
              The company&apos;s stated field experience is a yield improvement
              of up to 25%, most pronounced in the degraded and acidic soils
              where conventional inputs give the least return.
            </p>
          </div>
        </div>
      </section>

      {/* ── Act V, permanence (WebGL soil core) ──────────────────────────── */}
      <Permanence />

      {/* ── Act VI, the ground flips to paper. Evidence. ─────────────────── */}
      <section
        className="act act--log"
        data-ground="#ece7dd"
        data-ink="#16130f"
        data-ink-dim="#6b6355"
        data-rule="#cfc7b8"
      >
        <div className="shell">
          <p className="eyebrow act__eyebrow" data-reveal>
            <span>05</span>
            <span className="rule-dash" />
            <span>Field log</span>
          </p>

          <h2 className="act__title" data-reveal>
            Every application,
            <br />
            <em>logged where it happened.</em>
          </h2>

          <p className="measure-wide log__lede" data-reveal>
            These frames are unretouched, straight from the field team&apos;s
            phones. The coordinate stamps are theirs, not ours. Three sites in
            Niger State, all recorded on 3 August 2026.
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

      {/* ── Act VII. The migration lands: deep paddy green.
           An earlier version flooded this whole section with the acid green.
           At full-viewport scale that colour is punishing to read on and reads
           as an unfinished placeholder, so the acid is now spent in one place
           only: the CTA slab below, where it has maximum effect. ───────────── */}
      <section
        className="act act--services"
        data-ground="#141f0c"
        data-ink="#e9f0dc"
        data-ink-dim="#8a9b73"
        data-rule="#2b3a1d"
      >
        <div className="shell">
          <p className="eyebrow act__eyebrow" data-reveal>
            <span>06</span>
            <span className="rule-dash" />
            <span>What we do</span>
          </p>

          <h2 className="act__title services__title" data-reveal>
            Six ways in.
          </h2>

          <ul className="services">
            {SERVICES.map((s, i) => (
              <li
                className="service"
                key={s.n}
                data-reveal
                data-reveal-delay={i * 70}
              >
                <span className="service__n tabular">{s.n}</span>
                <h3 className="service__title">{s.title}</h3>
                <p className="service__lede">{s.lede}</p>
                <p className="service__body">{s.body}</p>
              </li>
            ))}
          </ul>

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
              <Link href="/services" className="btn btn--ghost">
                Read the detail
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
