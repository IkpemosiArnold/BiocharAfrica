"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "../lib/perf";

/**
 * Scroll spine for the whole site: Lenis for feel, GSAP ScrollTrigger for
 * choreography, and a global IntersectionObserver for the cheap reveals.
 *
 * Deliberately DESKTOP-ONLY smoothing. On Android and iOS the URL bar resizes
 * the viewport mid-scroll, which desynchronises any hijacked scroll position and
 * makes ScrollTrigger's cached measurements wrong. Native touch scrolling is
 * also simply better than anything we could fake. So touch keeps the platform
 * scroller and only gets the trigger-based animation.
 */
export default function SmoothScroll() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const reduced = prefersReducedMotion();
    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    let lenis: Lenis | null = null;
    let tickerFn: ((time: number) => void) | null = null;

    if (!reduced && !isTouch) {
      lenis = new Lenis({
        lerp: 0.095,
        wheelMultiplier: 0.9,
        smoothWheel: true,
      });

      lenis.on("scroll", ScrollTrigger.update);

      tickerFn = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(tickerFn);
      // GSAP's lag smoothing fights Lenis' own interpolation and produces a
      // rubber-banding feel after any main-thread stall.
      gsap.ticker.lagSmoothing(0);
    }

    /* --- Reveals -----------------------------------------------------------
       A single shared observer rather than a ScrollTrigger per element. There
       are well over a hundred revealable nodes across the site; a hundred
       ScrollTriggers all recalculating on resize is a real cost on mobile,
       whereas one IntersectionObserver is essentially free. */
    const revealables = document.querySelectorAll<HTMLElement>("[data-reveal]");

    if (reduced) {
      revealables.forEach((el) => el.classList.add("is-in"));
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target as HTMLElement;
            const delay = Number(el.dataset.revealDelay ?? 0);
            if (delay) {
              window.setTimeout(() => el.classList.add("is-in"), delay);
            } else {
              el.classList.add("is-in");
            }
            io.unobserve(el);
          });
        },
        // Fire a little before the element is fully on screen so the motion has
        // finished by the time it reaches comfortable reading position.
        { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
      );
      revealables.forEach((el) => io.observe(el));

      return () => {
        io.disconnect();
        if (tickerFn) gsap.ticker.remove(tickerFn);
        lenis?.destroy();
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    }

    return () => {
      if (tickerFn) gsap.ticker.remove(tickerFn);
      lenis?.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return null;
}
