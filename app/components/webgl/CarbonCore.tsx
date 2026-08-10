"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  type Tier,
  TIER,
  dprCap,
  watchFrameRate,
  prefersStaticScene,
} from "../../lib/perf";

const YEARS = 1000;

/**
 * A thousand annual strata, rendered as a soil core.
 *
 * Biochar's headline property is permanence: carbon worked into soil stays
 * there on a millennial timescale. Abstract "1,000 years" means nothing on a
 * page. A core sample you descend through does. It is the form the claim
 * actually takes in the ground.
 *
 * One InstancedMesh, one draw call, one material, for all thousand layers.
 * Per-layer colour rides on instanceColor rather than separate materials, so
 * the whole scene costs about as much as a single box.
 */
function Core({
  tier,
  scrollRef,
  isStatic,
}: {
  tier: Tier;
  scrollRef: React.RefObject<number>;
  isStatic: boolean;
}) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const group = useRef<THREE.Group>(null);

  /* The core sits to the right of the copy on desktop. On a phone that same
     offset pushes it almost entirely off the frame, leaving a meaningless
     sliver, so it moves in to sit behind the column of text instead. */
  const { size } = useThree();
  const offsetX = size.width < 700 ? 0.6 : 3.4;

  // Lean devices draw a quarter of the strata. At the depth they recede to,
  // the difference is invisible; the fill-rate saving is not.
  const count = tier === TIER.FULL ? YEARS : Math.floor(YEARS / 4);
  const step = YEARS / count;

  const { matrices, colors } = useMemo(() => {
    const dummy = new THREE.Object3D();
    const matrices = new Float32Array(count * 16);
    const colors = new Float32Array(count * 3);

    /* ---- Deterministic value noise -------------------------------------
       Seeded hashes rather than Math.random(), so the core is identical on
       the server, on the client and on every reload. Layered at three
       frequencies to give horizons at three scales, which is what an actual
       soil profile looks like. */
    const hash = (n: number) => {
      const x = Math.sin(n * 127.1) * 43758.5453;
      return x - Math.floor(x);
    };
    const noise = (x: number) => {
      const i = Math.floor(x);
      const f = x - i;
      const u = f * f * (3 - 2 * f); // smoothstep
      return hash(i) * (1 - u) + hash(i + 1) * u;
    };
    const fbm = (x: number) =>
      noise(x) * 0.55 + noise(x * 2.3 + 11) * 0.28 + noise(x * 5.1 + 31) * 0.17;

    /* ---- Palette, all sampled from the site tokens ---------------------- */
    const living = new THREE.Color("#9bf03a"); // paddy at the surface
    const root = new THREE.Color("#3f6b2a"); // root zone
    const laterite = new THREE.Color("#b5764a"); // the red earth at Suntale
    const ochre = new THREE.Color("#c9a678"); // weathered mineral
    const ash = new THREE.Color("#8a8175"); // pale silt
    const char = new THREE.Color("#17130f"); // biochar
    const marker = new THREE.Color("#e0913f"); // century seam

    const c = new THREE.Color();
    const mineral = new THREE.Color();

    // Band thickness follows spacing, so the lean tier (a quarter of the
    // instances) renders thicker bands rather than a sparse comb.
    const spacing = 62 / count;
    const RADIUS = 2.0;

    for (let i = 0; i < count; i++) {
      const year = i * step;
      const t = i / count;

      const isCentury = Math.floor(year) % 100 === 0;

      /* ---- Silhouette: clean. ------------------------------------------
         The previous version jittered width per band as well as colour, which
         made the edge ragged and the interior flat: exactly backwards. The
         column is now a constant radius and only century markers protrude, so
         the eye reads a solid core and all the variation lives in the strata. */
      dummy.position.set(0, -t * 62, 0);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(
        isCentury ? RADIUS * 1.14 : RADIUS,
        isCentury ? spacing * 1.5 : spacing * 0.72,
        isCentury ? RADIUS * 1.14 : RADIUS
      );
      dummy.updateMatrix();
      dummy.matrix.toArray(matrices, i * 16);

      /* ---- Stratigraphy, not a gradient. -------------------------------
         The old ramp saturated at t = 0.45, so the bottom 55% of the core was
         a single flat brown. Horizons are chosen by noise instead, so there is
         readable structure at every depth you scroll past. */
      const horizon = fbm(t * 24);
      const fine = fbm(t * 96 + 3);

      if (horizon < 0.34) {
        mineral.copy(laterite).lerp(ochre, horizon / 0.34);
      } else if (horizon < 0.62) {
        mineral.copy(ochre).lerp(ash, (horizon - 0.34) / 0.28);
      } else {
        mineral.copy(ash).lerp(laterite, (horizon - 0.62) / 0.38).multiplyScalar(0.62);
      }

      /* Biochar seams. Thematically the whole point: worked into a field, char
         stays as a visible black band in the soil profile for centuries. These
         are the product, drawn in the ground. */
      const seam = fbm(t * 38 + 7);
      const charAmount = seam > 0.56 ? Math.min(1, (seam - 0.56) / 0.09) : 0;
      mineral.lerp(char, charAmount * 0.92);

      /* The living surface occupies only the top couple of percent, then hands
         over to the mineral profile. */
      if (t < 0.055) {
        const k = t / 0.055;
        c.copy(living).lerp(root, Math.min(1, k * 2.2)).lerp(mineral, k * k);
      } else {
        c.copy(mineral);
      }

      // Fine seam-to-seam lightness so adjacent bands separate.
      c.multiplyScalar(0.78 + fine * 0.44);

      // Depth darkening, applied last and gently, so the bottom of the core
      // recedes without collapsing to the single flat tone we just fixed.
      c.multiplyScalar(1 - t * 0.16);

      if (isCentury) c.lerp(marker, 0.72);

      c.toArray(colors, i * 3);
    }

    return { matrices, colors };
  }, [count, step]);

  useEffect(() => {
    if (!mesh.current) return;
    const m = new THREE.Matrix4();
    const c = new THREE.Color();
    for (let i = 0; i < count; i++) {
      m.fromArray(matrices, i * 16);
      mesh.current.setMatrixAt(i, m);
      c.fromArray(colors, i * 3);
      // setColorAt, not a hand-assigned instanceColor attribute. Assigning the
      // attribute directly after the material has already compiled means three
      // never sets its USE_INSTANCING_COLOR define, so every instance silently
      // renders in the material's base colour and the strata vanish.
      mesh.current.setColorAt(i, c);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true;
  }, [matrices, colors, count]);

  useFrame((state, delta) => {
    if (!group.current) return;

    // Reduced motion: park the core at a depth that shows both the living
    // topsoil colour and a century marker, then never move it again.
    if (isStatic) {
      group.current.position.y = 6;
      group.current.rotation.y = 0.22;
      return;
    }

    // Descend through the core as the section scrolls.
    const target = scrollRef.current * 52;
    group.current.position.y +=
      (target - group.current.position.y) * Math.min(1, delta * 4);
    group.current.rotation.y += delta * 0.035;
  });

  return (
    <group ref={group} position={[offsetX, 0, 0]} rotation={[0.07, 0, 0]}>
      <instancedMesh
        ref={mesh}
        args={[undefined, undefined, count]}
        frustumCulled={false}
      >
        {/* Discs, not cuboids. A core sample is cylindrical, and a stack of
            thin cylinders reads as one instantly. Radius 0.5 so the instance
            scale maps directly to diameter. 18 segments is plenty at this size
            and keeps the whole core at ~72k triangles in a single draw call. */}
        <cylinderGeometry args={[0.5, 0.5, 1, 18]} />
        {/* Unlit: no lights in the scene at all. Colour comes entirely from
            instanceColor, which removes every per-fragment lighting calculation
            across a thousand instances.

            Deliberately NOT vertexColors. That flag sets three's USE_COLOR
            define, and the shader then runs `vColor *= color` against a `color`
            attribute that boxGeometry does not have. A missing attribute reads
            as (0,0,0), so every instance was multiplied to black before
            instanceColor was applied, which is why this rendered as a solid
            silhouette. InstancedMesh colour needs no flag; instanceColor is
            picked up on its own. */}
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
    </group>
  );
}

export default function CarbonCore({
  tier: initialTier,
  triggerRef,
}: {
  tier: Tier;
  triggerRef: React.RefObject<HTMLElement | null>;
}) {
  const [tier, setTier] = useState<Tier>(initialTier);
  const [visible, setVisible] = useState(false);
  const [isStatic, setIsStatic] = useState(false);
  const scrollRef = useRef(0);

  useEffect(() => setIsStatic(prefersStaticScene()), []);

  useEffect(() => {
    if (!triggerRef.current || isStatic) return;
    gsap.registerPlugin(ScrollTrigger);
    const st = ScrollTrigger.create({
      trigger: triggerRef.current,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        scrollRef.current = self.progress;
      },
    });
    return () => st.kill();
  }, [triggerRef, isStatic]);

  useEffect(() => {
    const el = triggerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [triggerRef]);

  useEffect(() => {
    if (isStatic) return;
    return watchFrameRate(tier, setTier);
  }, [tier, isStatic]);

  if (tier === TIER.STILL) return null;

  return (
    <Canvas
      className="core-canvas"
      frameloop={isStatic ? "demand" : visible ? "always" : "never"}
      dpr={dprCap(tier)}
      gl={{ antialias: tier === TIER.FULL, alpha: true, stencil: false }}
      camera={{ position: [0, 1.2, 13.5], fov: 40 }}
    >
      <fog attach="fog" args={["#0f1a10", 11, 30]} />
      <Core tier={tier} scrollRef={scrollRef} isStatic={isStatic} />
    </Canvas>
  );
}
