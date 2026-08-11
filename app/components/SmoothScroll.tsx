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
      // Health flag. A working observer delivers an entry for anything already
      // on screen almost immediately, so "never fired at all" is a reliable
      // signal that this browser is not going to cooperate.
      let observerFired = false;

      const io = new IntersectionObserver(
        (entries) => {
          observerFired = true;
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

      /* Anything already on screen at mount is revealed directly rather than
         being left to the observer.

         The hero headline went missing on an Android phone: the observer never
         delivered an entry for it, so the masked lines stayed translated out of
         view and the most important sentence on the site simply was not there.
         Above-the-fold content must not depend on an async callback firing. */
      revealables.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) {
          el.classList.add("is-in");
          io.unobserve(el);
        }
      });

      /* Last-resort failsafe. If the observer has not fired a single time by
         now it is not working on this browser, so every remaining element is
         revealed outright, including everything below the fold.

         Scoping this to the viewport was not enough: with a dead observer the
         hero survived but the rest of the page stayed blank as you scrolled.
         A reveal animation that never runs is a nice-to-have; text that never
         appears is a broken page. */
      const failsafe = window.setTimeout(() => {
        if (observerFired) return;
        document
          .querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)")
          .forEach((el) => el.classList.add("is-in"));
      }, 2500);

      return () => {
        io.disconnect();
        window.clearTimeout(failsafe);
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
