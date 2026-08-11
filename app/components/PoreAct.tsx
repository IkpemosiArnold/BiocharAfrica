"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { estimateTier, prefersStaticScene, type Tier, TIER } from "../lib/perf";

const PoreField = dynamic(() => import("./webgl/PoreField"), {
  ssr: false,
  loading: () => null,
});

/**
 * Act III, why biochar works, with the pore-structure volume behind it.
 *
 * The shader used to be the hero. It made a poor welcome page: an abstract dark
 * texture says nothing about what the company does, and management was right
 * that a first impression should be the work itself. Here it finally sits
 * against the copy that explains it, so the visual and the argument arrive
 * together instead of three screens apart.
 */
export default function PoreAct({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const [tier, setTier] = useState<Tier | null>(null);
  const [isStatic, setIsStatic] = useState(false);

  useEffect(() => {
    setTier(estimateTier());
    setIsStatic(prefersStaticScene());
  }, []);

  const showWebGL = tier !== null && tier !== TIER.STILL;

  return (
    <section
      ref={ref}
      className="act act--pore"
      data-ground="#1b1712"
      data-ink="#ece7dd"
      data-ink-dim="#948b7e"
      data-rule="#332c23"
    >
      <div className="pore__stage" aria-hidden="true">
        {showWebGL && <PoreField tier={tier} triggerRef={ref} />}
        {/* Present on every tier, and the whole visual on tier 0. */}
        <div className={`pore__fallback ${showWebGL ? "is-hidden" : ""}`} />
        <div className="pore__veil" />
      </div>

      <div className="pore__body">{children}</div>

      <p className="pore__legend eyebrow">
        <span>
          {isStatic || !showWebGL
            ? "Biochar pore structure, modelled"
            : "Biochar pore structure, modelled in real time"}
        </span>
      </p>
    </section>
  );
}
