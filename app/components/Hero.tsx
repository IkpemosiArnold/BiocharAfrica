"use client";

import HeroSlides from "./HeroSlides";

/**
 * Welcome page.
 *
 * Headline and kicker are management's own words, given verbatim: the company
 * name over the closing line of their positioning document. An earlier draft
 * ran "Richer soil, every season", which they replaced.
 *
 * The company name returns here as a kicker. It was removed from this position
 * earlier in the build as weak sub-heading furniture, and that was right at the
 * time, but management has since asked for exactly this lockup, and a name set
 * against its own tagline is a different thing from a stray location line.
 *
 * Three frames rotate behind it, all supplied by management. See HeroSlides for
 * why they load in stages and why the rotation stops under reduced motion.
 */
export default function Hero() {
  return (
    <section
      className="hero"
      data-ground="#0e0c09"
      data-ink="#f2ede3"
      data-ink-dim="#9a9082"
      data-rule="#2b261f"
    >
      <div className="hero__scrim" aria-hidden="true" />

      <div className="shell hero__inner">
        <HeroSlides />

        <div className="hero__content">
          <p className="hero__kicker eyebrow" data-reveal>
            <span>Biochar Solutions Africa</span>
          </p>

          <h1 className="hero__title" data-reveal data-reveal-delay="80">
            <span className="line-mask">
              <span>Carbon solutions</span>
            </span>
            <span className="line-mask">
              <span>rooted in</span>
            </span>
            <span className="line-mask">
              <span>
                <em>African soil.</em>
              </span>
            </span>
          </h1>

          <p className="hero__lede measure" data-reveal data-reveal-delay="160">
            Regenerating African soils. Removing carbon. Creating rural
            prosperity.
          </p>

          <div className="hero__meta" data-reveal data-reveal-delay="240">
            <span className="hero__arrow" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
