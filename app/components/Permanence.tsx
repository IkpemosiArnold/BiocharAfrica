"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { estimateTier, type Tier, TIER } from "../lib/perf";

const CarbonCore = dynamic(() => import("./webgl/CarbonCore"), {
  ssr: false,
  loading: () => null,
});

/** Act V, permanence, rendered as a soil core you descend through. */
export default function Permanence() {
  const ref = useRef<HTMLElement>(null);
  const [tier, setTier] = useState<Tier | null>(null);

  useEffect(() => setTier(estimateTier()), []);

  return (
    <section
      ref={ref}
      className="act permanence"
      data-ground="#0f1a10"
      data-ink="#e6ecdd"
      data-ink-dim="#7d8a74"
      data-rule="#243024"
    >
      <div className="permanence__stage" aria-hidden="true">
        {tier !== null && tier !== TIER.STILL && (
          <CarbonCore tier={tier} triggerRef={ref} />
        )}
      </div>

      <div className="shell permanence__content">
        <p className="eyebrow" data-reveal>
          <span>05</span>
          <span className="rule-dash" />
          <span>How long it stays</span>
        </p>

        <h2 className="permanence__figure" data-reveal>
          <span className="tabular">1,000</span>
          <span className="permanence__unit">years</span>
        </h2>

        <div className="permanence__cols">
          <p className="measure" data-reveal>
            Compost gives soil a good year and is gone. Biochar is different:
            pyrolysis rearranges the carbon into aromatic rings that soil
            microbes cannot easily take apart. What goes into the ground is still
            there, still holding water and nutrients, on a timescale measured in
            centuries.
          </p>
          <p className="measure" data-reveal data-reveal-delay="120">
            That permanence is the whole basis of the carbon claim. Carbon
            captured by a rice plant this season would return to the atmosphere
            within a year or two if the husk were simply burned or left to rot.
            Turned to char and worked into the field, it stops moving.
          </p>
        </div>

        <p className="permanence__caption eyebrow" data-reveal>
          <span>Each band, one year. Every hundredth marked</span>
        </p>
      </div>
    </section>
  );
}
