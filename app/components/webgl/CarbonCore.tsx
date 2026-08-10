"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type Tier, TIER, dprCap, watchFrameRate } from "../../lib/perf";

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
}: {
  tier: Tier;
  scrollRef: React.RefObject<number>;
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

    const topsoil = new THREE.Color("#7ed321"); // living surface
    const deep = new THREE.Color("#141210"); // carbon at depth
    const marker = new THREE.Color("#c9752f"); // laterite century bands
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
        (jitter - 0.5) * 0.14,
        -t * 46,
        (jitter2 - 0.5) * 0.14
      );
      dummy.rotation.set(0, jitter * 0.12, (jitter2 - 0.5) * 0.02);
      dummy.scale.set(
        isCentury ? 7.2 : 5.4 + jitter * 1.4,
        isCentury ? 0.06 : 0.018 + jitter2 * 0.016,
        isCentury ? 7.2 : 5.4 + jitter2 * 1.4
      );
      dummy.updateMatrix();
      dummy.matrix.toArray(matrices, i * 16);

      // Green only in the top few percent, the living layer, then a fast
      // fall into carbon. Century bands read as laterite seams.
      c.copy(topsoil).lerp(deep, Math.min(1, Math.pow(t * 3.4, 0.7)));
      if (isCentury) c.lerp(marker, 0.55);
      c.toArray(colors, i * 3);
    }

    return { matrices, colors };
  }, [count, step]);

  useEffect(() => {
    if (!mesh.current) return;
    const m = new THREE.Matrix4();
    for (let i = 0; i < count; i++) {
      m.fromArray(matrices, i * 16);
      mesh.current.setMatrixAt(i, m);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
    mesh.current.instanceColor = new THREE.InstancedBufferAttribute(colors, 3);
  }, [matrices, colors, count]);

  useFrame((state, delta) => {
    if (!group.current) return;
    // Descend through the core as the section scrolls.
    const target = scrollRef.current * 40;
    group.current.position.y +=
      (target - group.current.position.y) * Math.min(1, delta * 4);
    group.current.rotation.y += delta * 0.035;
  });

  return (
    <group ref={group}>
      <instancedMesh
        ref={mesh}
        args={[undefined, undefined, count]}
        frustumCulled={false}
      >
        <boxGeometry args={[1, 1, 1]} />
        {/* Unlit: no lights in the scene at all. Colour comes entirely from
            instanceColor, which removes every per-fragment lighting calculation
            across a thousand instances. */}
        <meshBasicMaterial vertexColors toneMapped={false} />
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
  const scrollRef = useRef(0);

  useEffect(() => {
    if (!triggerRef.current) return;
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
  }, [triggerRef]);

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

  useEffect(() => watchFrameRate(tier, setTier), [tier]);

  if (tier === TIER.STILL) return null;

  return (
    <Canvas
      className="core-canvas"
      frameloop={visible ? "always" : "never"}
      dpr={dprCap(tier)}
      gl={{ antialias: tier === TIER.FULL, alpha: true, stencil: false }}
      camera={{ position: [0, 3, 13], fov: 42 }}
    >
      <fog attach="fog" args={["#141210", 12, 44]} />
      <Core tier={tier} scrollRef={scrollRef} />
    </Canvas>
  );
}
