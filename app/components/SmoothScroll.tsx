"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "../lib/perf";

/**
 * Scroll spine for the whole site: Lenis for feel, GSAP ScrollTrigger for
 * choreography, and a shared IntersectionObserver for the cheap reveals.
 *
 * Deliberately DESKTOP-ONLY smoothing. On Android and iOS the URL bar resizes
 * the viewport mid-scroll, which desynchronises any hijacked scroll position and
 * makes ScrollTrigger's cached measurements wrong. Native touch scrolling is
 * also simply better than anything we could fake.
 *
 * TWO SEPARATE EFFECTS, AND THE SPLIT MATTERS.
 *
 * This component lives in the root layout, which persists across client-side
 * navigation. An earlier version wired the reveals in a mount-once effect, so
 * after any in-site link the observer was still watching the previous page's
 * unmounted nodes while every element on the new page sat at opacity 0 forever.
 * The result was a blank page until the visitor hit reload, which is as close to
 * broken as a site can be while still returning 200.
 *
 * So: the scroll engine is created once, because tearing Lenis down and
 * rebuilding it per route would stutter; the reveals are re-wired on every
 * pathname change, because they are per-page state.
 */
export default function SmoothScroll() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  /* ---- 1. Scroll engine. Once for the lifetime of the app. ---------------- */
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (prefersReducedMotion()) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const lenis = new Lenis({
      lerp: 0.095,
      wheelMultiplier: 0.9,
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    // GSAP's lag smoothing fights Lenis' own interpolation and produces a
    // rubber-banding feel after any main-thread stall.
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  /* ---- 2. Reveals. Re-wired on every route change. ----------------------- */
  useEffect(() => {
    // A new document starts at the top. Lenis keeps its own scroll position, so
    // without this a route change can land mid-page on a shorter route.
    lenisRef.current?.scrollTo(0, { immediate: true });

    // Measurements from the previous route are meaningless now.
    ScrollTrigger.refresh();

    const revealables =
      document.querySelectorAll<HTMLElement>("[data-reveal]");

    if (prefersReducedMotion()) {
      revealables.forEach((el) => el.classList.add("is-in"));
      return;
    }

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

    /* Anything already on screen is revealed directly rather than waiting on an
       async callback. The hero headline once went missing on an Android phone
       because the observer never delivered an entry for it. */
    revealables.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        el.classList.add("is-in");
        io.unobserve(el);
      }
    });

    /* If the observer has not fired at all by now it is not working here, so
       reveal everything including below the fold. A reveal animation that never
       runs is a nice-to-have; text that never appears is a broken page. */
    const failsafe = window.setTimeout(() => {
      if (observerFired) return;
      document
        .querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)")
        .forEach((el) => el.classList.add("is-in"));
    }, 2500);

    return () => {
      io.disconnect();
      window.clearTimeout(failsafe);
    };
  }, [pathname]);

  return null;
}
