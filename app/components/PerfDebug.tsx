"use client";

import { useEffect, useState } from "react";

/**
 * On-screen tier readout, shown only when ?debug=perf is in the URL.
 *
 * This is rendered rather than logged because the devices that actually have
 * tier problems are phones, and there is no practical way to read a console on
 * an iPhone. Printing to console was useless exactly where it was needed. A
 * visible panel can be screenshotted and sent, which turns "the WebGL is not
 * showing" into a specific, answerable report.
 */
export default function PerfDebug() {
  const [info, setInfo] = useState<Record<string, unknown> | null>(null);
  const [webgl, setWebgl] = useState<string>("checking");

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("debug") !== "perf") {
      return;
    }

    import("../lib/perf").then(({ explainTier }) => setInfo(explainTier()));

    // Prove the device can actually create a context, separately from whether
    // our heuristic decided to use one. These are different failures and were
    // previously indistinguishable from the outside.
    try {
      const c = document.createElement("canvas");
      const gl = (c.getContext("webgl2") ||
        c.getContext("webgl")) as WebGLRenderingContext | null;
      if (!gl) {
        setWebgl("unavailable");
      } else {
        const dbg = gl.getExtension("WEBGL_debug_renderer_info");
        setWebgl(
          dbg
            ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL))
            : "available"
        );
      }
    } catch {
      setWebgl("threw on creation");
    }
  }, []);

  if (!info) return null;

  const rows: [string, unknown][] = [
    ["tier", info.tierName],
    ["webgl", webgl],
    ["canvas on page", document.querySelectorAll("canvas").length],
    ["reduced motion", info.prefersReducedMotion],
    ["save data", info.saveData],
    ["connection", info.effectiveType],
    ["cores", info.hardwareConcurrency],
    ["memory", info.deviceMemory],
    ["dpr", info.devicePixelRatio],
    ["render ratio", info.renderPixelRatio],
    ["ray steps", info.raySteps],
    ["touch", info.touch],
    ["forced by url", info.forcedByUrl],
  ];

  return (
    <div className="perfdebug" role="status">
      <strong>perf debug</strong>
      <dl>
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{String(v)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
