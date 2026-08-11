"use client";

import { useEffect, useState } from "react";
import { estimateTier, TIER, prefersStaticScene } from "../lib/perf";

/**
 * Tier-aware opening sentence for the pore section.
 *
 * Copy that points at a visual has to know two things: whether that visual
 * rendered at all, and where it actually is. This sentence has been wrong twice
 * for the second reason. It began as "what you flew through at the top of this
 * page", which was untrue for anyone on the still tier, and then stayed wrong
 * after the volume moved out of the hero and into this very section. It now
 * points at the thing directly behind it.
 *
 * The neutral variant is the server-rendered default, so there is no hydration
 * mismatch and no flash. It is also written to stand on its own rather than
 * being an apology for missing content, so a phone on the still tier reads a
 * sentence that was written for it, not a degraded one.
 */
export default function PoreLede() {
  const [sawScene, setSawScene] = useState(false);

  useEffect(() => {
    // "Flew through" requires the animated camera. Someone on reduced motion
    // sees the structure as a still image, so they get the neutral sentence.
    setSawScene(estimateTier() !== TIER.STILL && !prefersStaticScene());
  }, []);

  return (
    <p className="measure" data-reveal>
      {sawScene
        ? "The structure behind this text is the reason biochar works."
        : "Magnified far enough, a single grain of biochar is the reason it works."}{" "}
      Pyrolysis leaves behind the plant&apos;s own vascular architecture as a
      labyrinth of interconnected voids. Macropores wide enough to hold water.
      Micropores fine enough to lock carbon away from the microbes that would
      otherwise consume it.
    </p>
  );
}
