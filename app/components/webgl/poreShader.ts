/**
 * Biochar pore-structure volumetric renderer.
 *
 * Why this exists: biochar sequesters carbon and holds water for centuries
 * because of its micropore structure. At scale it is a coral-like labyrinth of
 * interconnected voids, and that structure is the entire reason the product
 * works. Nobody has ever seen it. So the hero flies through it.
 *
 * Why it is affordable: a layered gyroid, dot(sin(p), cos(p.zxy)), produces a
 * triply-periodic labyrinth that is genuinely pore-like from three sin/cos
 * evaluations. No geometry, no textures, no vertex work. The whole scene is one
 * fullscreen triangle: a single draw call.
 *
 * WHY FIXED-STEP VOLUMETRICS, NOT DISTANCE MARCHING
 * An earlier version sphere-traced this field and rendered as flat fog no matter
 * how the brightness was tuned. The reason: a gyroid divided by its scale is not
 * a signed distance function. Its magnitude is tiny and badly conditioned, so
 * the ray creeps forward in near-minimum steps everywhere and every pixel
 * accumulates a near-identical total. No amount of gain or falloff tuning fixes
 * that, because the failure is in the integration, not the shading.
 *
 * Fixed-step integration with front-to-back compositing fixes it properly: each
 * sample contributes in proportion to how much wall it passes through, and
 * transmittance means near walls OCCLUDE far ones. That occlusion is what makes
 * the labyrinth read as depth rather than as haze. It also makes cost exactly
 * predictable, which matters for the low tier: STEPS is the entire budget.
 */

export const poreVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

export const makePoreFragmentShader = (steps: number) => /* glsl */ `
  precision highp float;

  varying vec2 vUv;

  uniform float uTime;
  uniform float uScroll;     // 0..1 journey through the pore wall
  uniform vec2  uResolution;

  #define STEPS ${steps}

  // Interleaved gradient noise. Jittering each ray's start offset by a fraction
  // of a step turns the banding of a coarse fixed-step march into fine grain,
  // which is what makes 24 steps acceptable on a phone.
  float dither(vec2 p) {
    return fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715))));
  }

  // Two octaves of gyroid: macropores that carry water, and a finer structure
  // riding on them. Real biochar is fractal in exactly this way.
  float gyroidField(vec3 p) {
    vec3 q = p * 5.5;
    float g = dot(sin(q), cos(q.zxy));

    vec3 q2 = p * 13.1;
    g += dot(sin(q2), cos(q2.zxy)) * 0.28;

    return g;
  }

  // Density is a thin shell around a level set of the field. The level set is
  // the pore WALL; everything either side of it is open void.
  float density(vec3 p) {
    float g = gyroidField(p);
    float wall = abs(abs(g) - 0.62);
    return 1.0 - smoothstep(0.0, 0.085, wall);
  }

  void main() {
    vec2 frag = vUv * uResolution;
    vec2 uv = (frag - 0.5 * uResolution) / uResolution.y;

    // Camera pushes forward through the structure as the page scrolls.
    vec3 ro = vec3(0.0, 0.0, -1.0 + uScroll * 3.4 + uTime * 0.035);
    vec3 rd = normalize(vec3(uv, 1.25));

    // A slow roll so the volume never reads as a still image.
    float a = uTime * 0.03;
    mat2 rot = mat2(cos(a), -sin(a), sin(a), cos(a));
    rd.xy *= rot;

    // March a fixed depth regardless of tier, so the low tier renders the same
    // image more coarsely rather than a different, shallower one.
    float span = 3.1;
    float dt = span / float(STEPS);

    float t = dither(frag) * dt;
    vec3 col = vec3(0.0);
    float trans = 1.0;   // remaining transmittance, front to back

    for (int i = 0; i < STEPS; i++) {
      vec3 p = ro + rd * t;
      float dens = density(p);

      if (dens > 0.002) {
        // Optical depth of this slab.
        float alpha = dens * dt * 58.0;

        // Carbon walls, with life in the pores: rice green where the structure
        // holds moisture and microbes, laterite warmth deeper into the grain.
        vec3 tint = mix(
          vec3(0.46, 0.92, 0.20),        // rice green
          vec3(0.86, 0.44, 0.18),        // laterite
          clamp(p.z * 0.14 + 0.5, 0.0, 1.0)
        );

        // Walls closest to the camera stay dark and read as solid carbon; the
        // glow lives in the depth of the structure.
        float depthLift = smoothstep(0.08, 1.7, t);
        tint = mix(vec3(0.018, 0.020, 0.016), tint, depthLift);

        col += tint * alpha * trans;
        trans *= exp(-alpha * 2.4);

        // Fully occluded: nothing behind this can affect the pixel.
        if (trans < 0.03) break;
      }

      t += dt;
    }

    // Filmic roll-off, so wall highlights shoulder off instead of clipping flat.
    col *= 0.72;
    col = col / (1.0 + col);
    col = pow(col, vec3(0.88));

    // Warm the blacks. Soot is never neutral, and this ties the shader to the
    // graded photography and video elsewhere on the page.
    col += vec3(0.022, 0.019, 0.016);

    // Vignette, matching the one baked into the video grade.
    float vig = 1.0 - dot(uv, uv) * 0.3;
    col *= vig;

    // The intro fade is a CSS opacity transition on the canvas, not a uniform
    // here. Driving it from a uniform meant one mis-bound value could multiply
    // the entire image to zero, which is a silent and total failure.
    gl_FragColor = vec4(col, 1.0);
  }
`;
