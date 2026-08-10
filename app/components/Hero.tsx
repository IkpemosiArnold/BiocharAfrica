"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { estimateTier, prefersStaticScene, type Tier, TIER } from "../lib/perf";

/* Three.js and the raymarcher are ~560KB of JS that a low-tier device would
   spend longer *parsing* than downloading. Kept out of the initial bundle
   entirely and only requested once we know the device can use it. */
const PoreField = dynamic(() => import("./webgl/PoreField"), {
  ssr: false,
  loading: () => null,
});

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [tier, setTier] = useState<Tier | null>(null);
  const [isStatic, setIsStatic] = useState(false);

  useEffect(() => {
    // Resolved in an effect, not during render: navigator hints do not exist on
    // the server and guessing would cause a hydration mismatch.
    const t = estimateTier();
    setTier(t);
    setIsStatic(prefersStaticScene());

    // ?debug=perf prints exactly why this device got the tier it did. Without
    // it, "the WebGL is not showing" is undiagnosable from anywhere except the
    // affected machine, since every input is a property of that machine.
    if (new URLSearchParams(window.location.search).get("debug") === "perf") {
      import("../lib/perf").then(({ explainTier }) => {
        // eslint-disable-next-line no-console
        console.table(explainTier());
      });
    }
  }, []);

  const showWebGL = tier !== null && tier !== TIER.STILL;

  return (
    <section
      ref={sectionRef}
      className="hero"
      data-ground="#100e0b"
      data-ink="#ece7dd"
      data-ink-dim="#8d857a"
      data-rule="#2b261f"
    >
      <div className="hero__stage" aria-hidden="true">
        {showWebGL && <PoreField tier={tier} triggerRef={sectionRef} />}
        {/* Present on every tier. On tier 0 it is the entire visual; elsewhere
            it fills the frames before the shader compiles, so the hero is never
            an empty black rectangle. */}
        <div className={`hero__fallback ${showWebGL ? "is-hidden" : ""}`} />
        <div className="hero__scrim" />
      </div>

      <div className="hero__content shell">
        {/* data-reveal is what adds .is-in, which the .line-mask spans need in
            order to slide up out of their masks. Without it the headline stays
            parked below its own mask and is simply invisible. */}
        <h1 className="hero__title" data-reveal>
          <span className="line-mask">
            <span>The black</span>
          </span>
          <span className="line-mask">
            <span>
              that <em>feeds</em>
            </span>
          </span>
        </h1>

        <div className="hero__foot">
          <p className="hero__lede measure">
            Burn crop waste without letting it become smoke and what is left is
            almost pure carbon. Work that carbon into tired soil and the soil
            comes back to life, while the carbon itself stays underground for a
            thousand years.
          </p>

          <div className="hero__meta">
            <span className="eyebrow">
              {/* Same rule as PoreLede: never promise a journey into a
                  structure that this device is not rendering. */}
              <span>
                {showWebGL && !isStatic
                  ? "Scroll into the pore structure"
                  : "Scroll"}
              </span>
            </span>
            <span className="hero__arrow" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
