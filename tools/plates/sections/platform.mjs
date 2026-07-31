import { BLEED, zone } from '../spec.mjs'

/**
 * A4 — docs/art-direction.md §3. One file per plate so that the six can be
 * art-directed independently; `config.mjs` only assembles them.
 *
 * Three things here are not per-crop taste, and are stated once:
 *
 *  - **The key is on camera-left.** §A4: "A single hard source from camera-left,
 *    low and almost in the plane of the glass, so it enters the chamfer rather
 *    than reflecting off the face." `key` is the direction *toward* the light,
 *    so that is −x. It also decides the whole composition, because
 *    `a4-platform.glsl` solves the slab's yaw from the key: a chamfer only
 *    catches a grazing source where its fillet's normals sweep through the
 *    half-vector. Put the light on camera-right instead and the glass body
 *    lands upper-*left*, the edge climbs toward the vanishing point rather than
 *    falling away from it (§2.1), and the copy side inherits the interest §A4
 *    says explicitly to keep off it.
 *
 *  - **`keySoft: 0.06`.** §A4: "This is the one plate where the key is hard
 *    rather than soft, because refraction needs a small source." Every other
 *    plate runs the 0.34 softbox in `DEFAULTS`. A soft source here widens the
 *    specular lobe until the band is the whole run, and a band that is the
 *    whole run is not a band.
 *
 *  - **`keyPos` / `keyRange`.** A lamp, not a source at infinity — "low and
 *    almost in the plane of the glass" is a position, and §2.4's gradient
 *    across a surface is falloff, which needs one. It does two jobs here: the
 *    run dies away either side of the band instead of blazing frame-wide, and
 *    the glass face carries a real tonal range instead of the single flat tone
 *    a directional key gives a smooth surface. Each `keyPos` is that crop's
 *    edge anchor plus `keyRange` along `key`; the anchor is the shader's own
 *    `anchorPoint()`, which reads `p[2]`/`p[3]`, so the two files move together.
 *
 * And one thing that is emphatically per-crop: **`p[2..5]` make these four
 * different photographs rather than four exports of one** (§5.3). `p[2,3]` put
 * the band where §A4's crop table puts it, `p[4]` bends the edge — a tight arc
 * on the portrait crops, where the visible run is a third of the desktop one
 * and a shallow curve would read as a straight line, against a long lateral
 * sweep on desktop and wide — and `p[5]` changes how far across the surface the
 * camera is looking, which moves the band around the chamfer and re-weights
 * surface against ground. `keyRange` differs with them: short on the portrait
 * crops so the light hugs the edge and everything above it falls away on its
 * own, long on the landscape ones where the surface has to carry tone across a
 * much wider frame.
 */
export default {
  id: 'platform',
  shader: 'a4-platform.glsl',
  frames: BLEED,
  alt: 'A macro view across the edge of dark glass, one narrow band in sharp focus and the rest falling away.',
  motion: null,
  crops: {
    /* "Glass edge runs across the bottom 20% only; everything above is smooth
       dark gradient." */
    mobile: {
      dead: zone(0, 0, 1, 0.8),
      deadFloor: 0.24,
      deadFeather: 0.16,
      exposure: 1.75,
      pan: [0.1, -0.86],
      key: [-0.93, 0.16, 0.32],
      /* Short range: the lamp sits close in, so the light dies within the
         bottom fifth and "everything above is smooth dark gradient" is the
         falloff doing it rather than a reserve crushing it. */
      keyPos: [-0.408, -0.962, 0.177],
      keyRange: 0.55,
      keySoft: 0.06,
      fov: 24,
      p: [
        0.0 /* second edge */, 0.34 /* band width */,
        0.52, 0.12 /* band at mid-width, across the bottom fifth */,
        0.45 /* tight arc — the visible run here is a third of desktop's */,
        0.42 /* most foreshortened of the four: the surface is nearly edge-on */,
      ],
    },
    /* Edge sits in the bottom-left quadrant; right half and top two-thirds
       empty (§2.7's 768px edge case again). */
    tablet: {
      dead: zone(0, 0, 1, 0.36),
      dead2: [0.42, 0, 1, 1],
      deadFloor: 0.35,
      deadFloor2: 0.35,
      deadFeather: 0.26,
      exposure: 1.75,
      pan: [-0.16, -0.44],
      key: [-0.94, 0.15, 0.3],
      /* The most conservative crop of the four (§2.7's 768px edge case): it
         clears the top band *and* the right column. The shortest range in the
         set puts the whole lit region inside the bottom-left quadrant, so both
         reserves are dark before they are reserved — which is the only way the
         "no edges in the reserve" rule survives, since a floor caps brightness
         but cannot soften a transition. */
      keyPos: [-0.736, -0.505, 0.15],
      keyRange: 0.5,
      keySoft: 0.06,
      fov: 23,
      p: [0.0, 0.3, 0.22, 0.22 /* bottom-left quadrant */, 0.75 /* hardest arc: the edge turns down and leaves frame before the copy column */, 0.5],
    },
    /* "Edge across lower-left, refraction band at ~28% width, right half
       smooth." */
    desktop: {
      dead: zone(0.44, 0.14, 1, 0.86),
      deadFloor: 0.085,
      deadFeather: 0.28,
      exposure: 1.85,
      pan: [-0.1, -0.2],
      key: [-0.95, 0.14, 0.28],
      keyPos: [-1.255, -0.173, 0.294],
      keyRange: 1.05,
      keySoft: 0.06,
      fov: 22,
      p: [0.0, 0.28, 0.29, 0.26 /* band at ~28% width */, 0.28 /* long lateral run */, 0.58],
    },
    /* "The extra width goes to the left: a second, further glass edge enters
       at the far left, out of focus. The right 56% stays as smooth as the
       desktop crop — do not use the extra room to add interest on the copy
       side." */
    wide: {
      dead: zone(0.44, 0.14, 1, 0.86),
      deadFloor: 0.085,
      deadFeather: 0.2,
      exposure: 1.85,
      pan: [-0.16, -0.18],
      key: [-0.95, 0.13, 0.28],
      /* The longest range in the set. The wide frame has the most surface to
         cover and §A4 gives its extra width to the left, so the falloff has to
         travel further before it dies. */
      keyPos: [-1.711, -0.079, 0.378],
      keyRange: 1.35,
      keySoft: 0.06,
      fov: 21,
      p: [1.0, 0.26, 0.2, 0.35 /* band further left and higher than desktop's */, 0.1 /* flattest arc of the four */, 0.7 /* least foreshortened: most surface in frame */],
    },
  },
}
