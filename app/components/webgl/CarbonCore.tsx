"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
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

  // Lean devices draw a quarter of the strata. At the depth they recede to,
  // the difference is invisible; the fill-rate saving is not.
  const count = tier === TIER.FULL ? YEARS : Math.floor(YEARS / 4);
  const step = YEARS / count;

  const { matrices, colors } = useMemo(() => {
    const dummy = new THREE.Object3D();
    const matrices = new Float32Array(count * 16);
    const colors = new Float32Array(count * 3);

    // Values are lifted well above the section ground (#0f1a10). An earlier
    // pass used near-black for depth, which made the core disappear into the
    // page instead of standing on it.
    const topsoil = new THREE.Color("#9bf03a"); // living surface
    const deep = new THREE.Color("#4a4038"); // carbon at depth
    const marker = new THREE.Color("#d98a3c"); // laterite century bands
    const c = new THREE.Color();

    for (let i = 0; i < count; i++) {
      const year = i * step;
      const t = i / count;

      // Deterministic pseudo-random, a seeded hash, not Math.random(), so the
      // core is identical on server, client and every reload.
      const h = Math.sin(i * 12.9898) * 43758.5453;
      const jitter = h - Math.floor(h);
      const h2 = Math.sin(i * 78.233) * 12345.6789;
      const jitter2 = h2 - Math.floor(h2);

      const isCentury = Math.floor(year) % 100 === 0;

      dummy.position.set(
        (jitter - 0.5) * 0.1,
        -t * 44,
        (jitter2 - 0.5) * 0.1
      );
      dummy.rotation.set(0, jitter * 0.12, (jitter2 - 0.5) * 0.02);
      dummy.scale.set(
        isCentury ? 3.5 : 2.5 + jitter * 0.7,
        isCentury ? 0.075 : 0.022 + jitter2 * 0.018,
        isCentury ? 3.5 : 2.5 + jitter2 * 0.7
      );
      dummy.updateMatrix();
      dummy.matrix.toArray(matrices, i * 16);

      // Green only in the top few percent, the living layer, then a fast
      // fall into carbon. Century bands read as laterite seams.
      c.copy(topsoil).lerp(deep, Math.min(1, Math.pow(t * 2.2, 0.75)));
      // Seam-to-seam lightness variation. Without it each visible slice is one
      // flat tone and the core reads as a solid block rather than as strata.
      const shade = 0.72 + jitter * 0.62;
      c.multiplyScalar(shade);
      if (isCentury) c.lerp(marker, 0.6);
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
    const target = scrollRef.current * 38;
    group.current.position.y +=
      (target - group.current.position.y) * Math.min(1, delta * 4);
    group.current.rotation.y += delta * 0.035;
  });

  return (
    <group ref={group} position={[3.4, 0, 0]}>
      <instancedMesh
        ref={mesh}
        args={[undefined, undefined, count]}
        frustumCulled={false}
      >
        <boxGeometry args={[1, 1, 1]} />
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
      camera={{ position: [0, 0, 13], fov: 40 }}
    >
      <fog attach="fog" args={["#0f1a10", 14, 34]} />
      <Core tier={tier} scrollRef={scrollRef} isStatic={isStatic} />
    </Canvas>
  );
}
