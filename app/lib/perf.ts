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

  const memory = nav.deviceMemory ?? 4;
  const cores = nav.hardwareConcurrency ?? 4;

  // ≤2GB RAM or ≤2 cores is squarely the low-end Android bracket where a
  // raymarcher will not hold a usable frame rate at any resolution.
  if (memory <= 2 || cores <= 2) return TIER.STILL;

  if (memory <= 4 || cores <= 4 || effectiveType === "3g") return TIER.LEAN;

  // A very high DPR on a modest GPU is the classic trap: the shader runs at
  // 3x the pixel count for no perceived gain. Treat it as a downgrade signal.
  if (window.devicePixelRatio > 2.5 && cores <= 6) return TIER.LEAN;

  return TIER.FULL;
}

/**
 * Pixel ratio cap per tier. Raymarching cost scales with total pixels, so this
 * is the single most effective lever available, far more than step count.
 */
export function dprCap(tier: Tier): number {
  if (typeof window === "undefined") return 1;
  const dpr = window.devicePixelRatio || 1;
  if (tier === TIER.FULL) return Math.min(dpr, 2);
  if (tier === TIER.LEAN) return Math.min(dpr, 1); // effectively half-res on retina
  return 1;
}

/** Ray-march step budget per tier. Blue-noise dithering covers the low counts. */
export function rayStepsFor(tier: Tier): number {
  if (tier === TIER.FULL) return 64;
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
  let warmup = 8;

  const SLOW_FRAME_MS = 1000 / 45; // below ~45fps counts as struggling
  const SAMPLE_TARGET = 90;

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
        // A third of frames missing 45fps means this is not a transient stall.
        if (slow / samples > 0.34) {
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
