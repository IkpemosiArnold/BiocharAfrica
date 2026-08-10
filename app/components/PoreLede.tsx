"use client";

import { useEffect, useState } from "react";
import { estimateTier, TIER } from "../lib/perf";

/**
 * Tier-aware opening sentence for the pore section.
 *
 * The original copy read "What you flew through at the top of this page...",
 * which is simply untrue for anyone on the still tier: they saw a static
 * gradient, flew through nothing, and the sentence reads as broken. Copy that
 * refers to a visual must know whether that visual actually rendered.
 *
 * The neutral variant is the server-rendered default, so there is no hydration
 * mismatch and no flash. It is also written to stand on its own rather than
 * being an apology for missing content, so a phone on the still tier reads a
 * sentence that was written for it, not a degraded one.
 */
export default function PoreLede() {
  const [sawScene, setSawScene] = useState(false);

  useEffect(() => {
    setSawScene(estimateTier() !== TIER.STILL);
  }, []);

  return (
    <p className="measure" data-reveal>
      {sawScene
        ? "What you flew through at the top of this page is the reason biochar works."
        : "Magnified far enough, a single grain of biochar is the reason it works."}{" "}
      Pyrolysis leaves behind the plant&apos;s own vascular architecture as a
      labyrinth of interconnected voids. Macropores wide enough to hold water.
      Micropores fine enough to lock carbon away from the microbes that would
      otherwise consume it.
    </p>
  );
}
