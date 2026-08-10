"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "../lib/perf";

/**
 * The site's central device: the page's ground colour migrates from carbon
 * black to living paddy green as you read, because that is literally what
 * biochar does: it moves carbon out of the sky and into soil, and the soil
 * comes alive. The background is the argument.
 *
 * Any element carrying data-ground / data-ink declares the palette for its
 * stretch of the page. Because --ground and friends are registered via
 * @property in globals.css, the browser interpolates them as real colours in
 * OKLab, so the transition is continuous rather than stepping between sections.
 *
 * Uses `scrub` with no `pin`. Pinning is the single most common cause of broken
 * scroll maths on Android, where the collapsing URL bar changes viewport height
 * mid-gesture and invalidates every cached measurement.
 */
export default function GroundShift() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const zones = gsap.utils.toArray<HTMLElement>("[data-ground]");
    if (zones.length === 0) return;

    const root = document.documentElement;

    const apply = (el: HTMLElement) => {
      const ground = el.dataset.ground!;
      const ink = el.dataset.ink ?? "#ece7dd";
      const inkDim = el.dataset.inkDim ?? "#8d857a";
      const rule = el.dataset.rule ?? "#322c24";

      // Also drive the browser chrome so the phone's status bar matches the
      // section. Without this the top of the screen stays black while the page
      // turns green, which is exactly the kind of seam that reads as unfinished.
      const meta = document.querySelector<HTMLMetaElement>(
        'meta[name="theme-color"]'
      );
      if (meta) meta.content = ground;

      if (prefersReducedMotion()) {
        root.style.setProperty("--ground", ground);
        root.style.setProperty("--ink", ink);
        root.style.setProperty("--ink-dim", inkDim);
        root.style.setProperty("--rule", rule);
        return;
      }

      gsap.to(root, {
        "--ground": ground,
        "--ink": ink,
        "--ink-dim": inkDim,
        "--rule": rule,
        duration: 0.85,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    const triggers = zones.map((el, i) =>
      ScrollTrigger.create({
        trigger: el,
        // Hand over when the incoming section owns the upper third of the
        // viewport, the eye is already reading it by then.
        start: "top 38%",
        end: "bottom 38%",
        onEnter: () => apply(el),
        onEnterBack: () => apply(el),
        // The first zone has nothing above it to hand back to.
        onLeaveBack: i === 0 ? undefined : () => {},
      })
    );

    apply(zones[0]);

    return () => triggers.forEach((t) => t.kill());
  }, []);

  return null;
}
