/**
 * Device-tier governor.
 *
 * This site is for a Nigerian agribusiness. A meaningful share of its audience
 * is on mid-range Android over metered mobile data, where Three.js costs more to
 * *parse* than to download. So capability is decided before anything heavy is
 * imported, and the expensive paths are opt-in rather than opt-out.
 *
 * Two-phase, and deliberately asymmetric:
 *   1. A synchronous heuristic from navigator hints, available before first
 *      paint, so the correct experience renders immediately with no flash.
 *   2. A live frame-time probe that can only ever DOWNGRADE. Upgrading mid-scroll
 *      would swap a static poster for a shader in front of the user, which reads
 *      as a glitch. Being wrong in the cautious direction is invisible.
 */

export type Tier = 0 | 1 | 2;

export const TIER = {
  /** Still: no WebGL. Graded posters, opacity/transform only. */
  STILL: 0,
  /** Lean: WebGL at half resolution, short ray loops, no post-processing. */
  LEAN: 1,
  /** Full: everything, at device pixel ratio capped to 2. */
  FULL: 2,
} as const;

type NavigatorWithHints = Navigator & {
  deviceMemory?: number;
  connection?: {
    saveData?: boolean;
    effectiveType?: string;
  };
};

/** True when a ?tier= override is pinning the tier for inspection. */
export function isTierForced(): boolean {
  if (typeof window === "undefined") return false;
  const t = new URLSearchParams(window.location.search).get("tier");
  return t === "0" || t === "1" || t === "2";
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Synchronous tier estimate. Runs before paint; must not touch the DOM or
 * allocate a WebGL context (context creation alone is ~10ms on weak hardware).
 */
export function estimateTier(): Tier {
  if (typeof window === "undefined") return TIER.STILL;

  // QA override: ?tier=0|1|2. The whole point of this module is that most
  // devices never see the expensive path, which also makes that path hard to
  // review: on a normal laptop you only ever get tier 2, and in headless
  // Chromium (which reports 2 cores) only ever tier 0. This makes each tier
  // reachable on demand. Read-only and opt-in, so it cannot affect real users.
  const forced = new URLSearchParams(window.location.search).get("tier");
  if (forced === "0" || forced === "1" || forced === "2") {
    return Number(forced) as Tier;
  }

  // An explicit accessibility or data-saving preference outranks any hardware
  // signal. The user has told us what they want; hardware capability is moot.
  if (prefersReducedMotion()) return TIER.STILL;

  const nav = navigator as NavigatorWithHints;

  if (nav.connection?.saveData) return TIER.STILL;

  const effectiveType = nav.connection?.effectiveType ?? "";
  if (effectiveType === "slow-2g" || effectiveType === "2g") return TIER.STILL;

  // navigator.deviceMemory is Chromium-only. Defaulting it to a number and then
  // testing that number downgraded EVERY Safari and Firefox visitor, however
  // powerful their machine, because the default tripped the same threshold as a
  // genuinely weak device. A missing signal means "unknown", not "bad", so it is
  // left undefined and simply not used as evidence.
  const memory = nav.deviceMemory;
  const cores = nav.hardwareConcurrency ?? 8;

  const weakMemory = memory !== undefined && memory <= 2;
  const modestMemory = memory !== undefined && memory <= 3;

  // ≤2GB RAM or ≤2 cores is squarely the low-end Android bracket where a
  // raymarcher will not hold a usable frame rate at any resolution.
  if (weakMemory || cores <= 2) return TIER.STILL;

  if (modestMemory || cores <= 4 || effectiveType === "3g") return TIER.LEAN;

  // Everything from roughly an iPhone 11 / Snapdragon 730 era device upward gets
  // the full scene. An earlier version demoted any high-DPR device with ≤6 cores,
  // which caught every modern iPhone despite those chips being comfortably able
  // to run this shader.
  //
  // The safety net is better than the guess: resolution is capped (dprCap) and
  // the step count is lowered on touch (rayStepsFor), and if a device still
  // cannot hold frame rate then watchFrameRate demotes it within about a second.
  // Measuring beats predicting, so we start optimistic and let evidence correct.
  return TIER.FULL;
}

/** Coarse pointer, i.e. a phone or tablet rather than a desktop. */
function isTouch(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: coarse)").matches;
}

/**
 * Pixel ratio cap per tier. Raymarching cost scales with total pixels, so this
 * is the single most effective lever available, far more than step count.
 *
 * FULL caps at 1.75 rather than 2. At DPR 2 on a Retina display this shader runs
 * over roughly 3 million pixels per frame, which was heavy enough to trip the
 * frame-rate governor on capable laptops and get them demoted to the flat
 * fallback. 1.75 is about 23% less work and, on a soft volumetric image with no
 * hard edges, is not distinguishable from 2.
 */
export function dprCap(tier: Tier): number {
  if (typeof window === "undefined") return 1;
  const dpr = window.devicePixelRatio || 1;
  if (tier === TIER.FULL) return Math.min(dpr, 1.75);
  if (tier === TIER.LEAN) return Math.min(dpr, 1); // effectively half-res on retina
  return 1;
}

/**
 * Why the current device landed on the tier it did.
 *
 * This exists because "the WebGL is not showing" is otherwise almost impossible
 * to diagnose from the outside: every input is a property of the visitor's
 * machine. Append ?debug=perf to any URL to print the decision to the console.
 */
export function explainTier(): Record<string, unknown> {
  if (typeof window === "undefined") return {};
  const nav = navigator as NavigatorWithHints;
  const tier = estimateTier();
  return {
    tier,
    tierName: ["STILL (no WebGL)", "LEAN", "FULL"][tier],
    forcedByUrl: isTierForced(),
    prefersReducedMotion: prefersReducedMotion(),
    saveData: nav.connection?.saveData ?? false,
    effectiveType: nav.connection?.effectiveType ?? "unknown",
    deviceMemory: nav.deviceMemory ?? "unreported (Safari/Firefox)",
    hardwareConcurrency: nav.hardwareConcurrency ?? "unreported",
    devicePixelRatio: window.devicePixelRatio,
    touch: window.matchMedia("(pointer: coarse)").matches,
    renderPixelRatio: dprCap(tier),
    raySteps: rayStepsFor(tier),
  };
}

/**
 * Ray-march step budget per tier. Dithering of the ray start offset covers the
 * low counts, so these read as grain rather than as banding.
 *
 * A phone on FULL renders the same scene as a desktop, just with a shorter loop.
 * 40 versus 64 steps is not perceptible on a 6in screen, but it is roughly a
 * third less fragment work, which is what lets an iPhone 11 class device hold
 * the full experience instead of being demoted to the flat fallback.
 */
export function rayStepsFor(tier: Tier): number {
  if (tier === TIER.FULL) return isTouch() ? 40 : 64;
  if (tier === TIER.LEAN) return 24;
  return 0;
}

/**
 * Watch real frame times and downgrade if the device is not keeping up.
 * Samples over a short window, ignoring the first few frames (shader compile
 * and texture upload land there and would produce a false negative).
 *
 * Returns a cleanup function.
 */
export function watchFrameRate(
  current: Tier,
  onDowngrade: (next: Tier) => void
): () => void {
  if (current === TIER.STILL) return () => {};
  // An explicit ?tier= override means someone is deliberately inspecting that
  // tier. Auto-downgrading out from under them defeats the purpose, and in a
  // software renderer (headless CI, a VM) it would unmount the scene instantly.
  if (isTierForced()) return () => {};

  let raf = 0;
  let last = performance.now();
  let samples = 0;
  let slow = 0;
  // Shader compile, first texture upload and font swap all land in the opening
  // frames. Judging a device on those is how a capable laptop gets demoted.
  let warmup = 45;

  // Deliberately tolerant. An earlier version demoted at 45fps over 90 frames,
  // which fired on perfectly good hardware roughly a second after load: the
  // scene appeared and then vanished, which is far worse than a scene that runs
  // at 40fps. 30fps is the real threshold for "this is not working", and it has
  // to be sustained over several seconds before we act.
  const SLOW_FRAME_MS = 1000 / 30;
  const SAMPLE_TARGET = 240;
  const SLOW_RATIO = 0.6;

  const tick = () => {
    const now = performance.now();
    const delta = now - last;
    last = now;

    if (warmup > 0) {
      warmup -= 1;
    } else {
      samples += 1;
      // Ignore single huge spikes from tab-switching or GC pauses.
      if (delta > SLOW_FRAME_MS && delta < 400) slow += 1;

      if (samples >= SAMPLE_TARGET) {
        if (slow / samples > SLOW_RATIO) {
          // Step down one tier and stop watching. Falling all the way to a
          // static image while someone is looking at it reads as a crash;
          // one quiet step down does not.
          onDowngrade(current === TIER.FULL ? TIER.LEAN : TIER.STILL);
          return;
        }
        samples = 0;
        slow = 0;
      }
    }
    raf = requestAnimationFrame(tick);
  };

  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}
