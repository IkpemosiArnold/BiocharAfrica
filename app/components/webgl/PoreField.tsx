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
  rayStepsFor,
  watchFrameRate,
} from "../../lib/perf";
import { poreVertexShader, makePoreFragmentShader } from "./poreShader";

function PorePlane({ tier, scrollRef }: { tier: Tier; scrollRef: React.RefObject<number> }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const { size, viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
    }),
    []
  );

  const fragmentShader = useMemo(
    () => makePoreFragmentShader(rayStepsFor(tier)),
    [tier]
  );

  useEffect(() => {
    uniforms.uResolution.value.set(
      size.width * viewport.dpr,
      size.height * viewport.dpr
    );
  }, [size, viewport.dpr, uniforms]);

  useFrame((_, delta) => {
    if (!material.current) return;
    // Clamp delta: after a tab-switch the first delta can be seconds long and
    // would jump the camera deep into the volume.
    uniforms.uTime.value += Math.min(delta, 0.05);
    // Ease toward the scroll target so shader motion keeps Lenis' inertia
    // instead of tracking raw scroll position in hard steps.
    uniforms.uScroll.value +=
      (scrollRef.current - uniforms.uScroll.value) * 0.075;
  });

  return (
    <mesh frustumCulled={false}>
      {/* One fullscreen triangle, not a quad: no diagonal seam, fewer verts,
          and the fragment shader does all the work anyway. */}
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3]}
        />
        <bufferAttribute
          attach="attributes-uv"
          args={[new Float32Array([0, 0, 2, 0, 0, 2]), 2]}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        vertexShader={poreVertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function PoreField({
  tier: initialTier,
  triggerRef,
}: {
  tier: Tier;
  triggerRef: React.RefObject<HTMLElement | null>;
}) {
  const [tier, setTier] = useState<Tier>(initialTier);
  const [visible, setVisible] = useState(true);
  const scrollRef = useRef(0);

  /* Drive the camera from scroll progress over the hero. scrub, never pin
     pinning recalculates against a viewport height that Android changes
     mid-gesture as the URL bar collapses. */
  useEffect(() => {
    if (!triggerRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const st = ScrollTrigger.create({
      trigger: triggerRef.current,
      start: "top top",
      end: "bottom top",
      onUpdate: (self) => {
        scrollRef.current = self.progress;
      },
    });
    return () => st.kill();
  }, [triggerRef]);

  /* Stop rendering entirely once the hero leaves the screen. A raymarcher
     burning GPU behind three screens of content is pure battery cost. */
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

  /* Downgrade if the device cannot hold frame rate. Never upgrades. */
  useEffect(() => {
    return watchFrameRate(tier, (next) => setTier(next));
  }, [tier]);

  if (tier === TIER.STILL) return null;

  return (
    <Canvas
      className="pore-canvas"
      frameloop={visible ? "always" : "never"}
      dpr={dprCap(tier)}
      gl={{
        antialias: false, // meaningless for a fullscreen fragment shader
        powerPreference: tier === TIER.FULL ? "high-performance" : "default",
        alpha: false,
        stencil: false,
        depth: false,
      }}
      // Fixed camera; the shader owns its own ray origin.
      camera={{ position: [0, 0, 1] }}
    >
      <PorePlane tier={tier} scrollRef={scrollRef} />
    </Canvas>
  );
}
