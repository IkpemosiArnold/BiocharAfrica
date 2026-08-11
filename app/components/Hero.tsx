"use client";

import Photo from "./Photo";

/**
 * Welcome page.
 *
 * Led by the photograph management chose: a farmer broadcasting biochar by hand
 * into standing rice at Jima. It carries the whole proposition in one frame,
 * black carbon going into green field, which is what the site is about, and it
 * says "African agriculture, now, real people" faster than any abstraction can.
 *
 * The layout changes shape rather than stretching the image. The source is
 * 810x1080, so:
 *   phone   - full bleed. 390pt at DPR 3 is 1170px against an 810px source,
 *             which the grade and grain carry comfortably.
 *   desktop - a bounded portrait panel beside the type, roughly 480pt wide.
 *             Full bleed on a 1440pt Retina display would be a 3.5x upscale and
 *             would look exactly like what it is.
 * One <Photo> element, repositioned by CSS, so only one file is ever fetched.
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
        <figure className="hero__media">
          <Photo
            name="application-headwrap-paddy"
            alt="A farmer broadcasting biochar by hand from a teal bowl into standing rice near Jima, Niger State"
            sizes="(min-width: 62rem) 30rem, 100vw"
            priority
          />
        </figure>

        <div className="hero__content">
          <h1 className="hero__title" data-reveal>
            <span className="line-mask">
              <span>Richer soil,</span>
            </span>
            <span className="line-mask">
              <span>
                <em>every season.</em>
              </span>
            </span>
          </h1>

          <p className="hero__lede measure" data-reveal data-reveal-delay="120">
            Burn crop waste without letting it become smoke and what is left is
            almost pure carbon. Work that carbon into tired soil and the soil
            comes back to life, while the carbon itself stays underground for a
            thousand years.
          </p>

          <div className="hero__meta" data-reveal data-reveal-delay="220">
            <span className="eyebrow">
              <span>Jima, Niger State</span>
              <span className="rule-dash" />
              <span className="tabular">9.032°N 5.796°E</span>
            </span>
            <span className="hero__arrow" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
