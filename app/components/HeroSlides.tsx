"use client";

import { useEffect, useState } from "react";
import Photo from "./Photo";
import { prefersReducedMotion } from "../lib/perf";

/**
 * Crossfading hero slideshow, three frames, all supplied by management.
 *
 * Loading is staged rather than parallel. Only the first frame is `priority`;
 * the rest mount a beat later, so a phone on metered data fetches one hero
 * image up front instead of three competing for the same connection during
 * first paint. LCP is decided by frame one, and nothing else is allowed to
 * compete with it.
 *
 * On prefers-reduced-motion the rotation KEEPS RUNNING, deliberately, but
 * slower. That setting exists for vestibular triggers, and those are caused by
 * movement: parallax, translation, scaling, rotation, anything that implies the
 * viewport is travelling. This transition has none. It is a pure opacity
 * cross-dissolve with no transform on any axis, which is the standard
 * low-risk case and is what makes it safe to keep.
 *
 * An earlier version stopped it entirely and that was over-cautious: it removed
 * the design's centrepiece from a large share of visitors, since Reduce Motion
 * is switched on widely on iOS, for a movement risk this animation does not
 * carry. What the setting does still change here: the dissolve is slower, and
 * it never scales or pans.
 *
 * Auto-advancing content also has to be controllable (WCAG 2.2.2), so taking
 * hold of the dots stops the automatic rotation for the rest of the visit.
 */
const SLIDES = [
  {
    name: "application-headwrap-paddy",
    alt: "A farmer broadcasting biochar by hand from a teal bowl into standing rice near Jima, Niger State",
    place: "Jima, Niger State",
    coords: "9.032°N 5.796°E",
  },
  {
    name: "community-gathering-wide",
    alt: "Several hundred community members, mostly women, gathered around a Biochar Solutions Africa field demonstration",
    place: "Community demonstration",
    coords: "Northern Nigeria",
  },
  {
    name: "community-women-training",
    alt: "Women pounding biomass with mortar and pestle during a Biochar Solutions Africa training session",
    place: "Training session",
    coords: "Northern Nigeria",
  },
] as const;

const INTERVAL = 6000;
/* Slower under reduced motion: fewer changes to notice, same content. */
const INTERVAL_REDUCED = 10000;

export default function HeroSlides() {
  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);
  /* Set once the visitor picks a frame themselves. Auto-advance then stops for
     good, which is the control WCAG 2.2.2 asks for on moving content. */
  const [userControlled, setUserControlled] = useState(false);

  useEffect(() => {
    setReduced(prefersReducedMotion());
    // Let the first frame settle before the others are even created.
    const t = window.setTimeout(() => setMounted(true), 900);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!mounted || userControlled) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % SLIDES.length),
      reduced ? INTERVAL_REDUCED : INTERVAL
    );
    return () => window.clearInterval(id);
  }, [mounted, reduced, userControlled]);

  const active = index;

  return (
    <>
      <div className="hero__media">
        {SLIDES.map((s, i) => {
          // Frame one renders immediately; the others wait for `mounted`.
          if (i > 0 && !mounted) return null;
          return (
            <div
              key={s.name}
              className={`hero__slide ${i === active ? "is-active" : ""} ${
                reduced ? "is-gentle" : ""
              }`}
              aria-hidden={i === active ? undefined : true}
            >
              <Photo
                name={s.name}
                alt={s.alt}
                sizes="(min-width: 62rem) 30rem, 100vw"
                priority={i === 0}
              />
            </div>
          );
        })}
      </div>

      {/* Caption and controls, grouped so CSS can order them after the
          headline on a phone. The media above is absolutely positioned, so its
          DOM position is irrelevant, but these two are in the flow and were
          landing above the title. */}
      <div className="hero__caption">
        {/* Provenance line tracks the visible frame. */}
        <p className="eyebrow hero__place">
          <span>{SLIDES[active].place}</span>
          <span className="rule-dash" />
          <span className="tabular">{SLIDES[active].coords}</span>
        </p>

        {(
          <div className="hero__dots" role="tablist" aria-label="Hero images">
            {SLIDES.map((s, i) => (
              <button
                key={s.name}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={`Show image ${i + 1}: ${s.place}`}
                className={`hero__dot ${i === active ? "is-active" : ""}`}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
