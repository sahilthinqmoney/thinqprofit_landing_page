import { CARD, CTA_PATCH, zone } from '../spec.mjs'

/**
 * A3 — docs/art-direction.md §3. One file per plate so that the six can be
 * art-directed independently; `config.mjs` only assembles them.
 *
 * Every crop below runs `keyGain` and `exposure` above the `DEFAULTS`, and that
 * is worth stating once rather than four times.
 *
 * §A3 asks for a "very grazing" key so that "the rings are described almost
 * entirely by their chamfers and the faces stay dark". Taken literally against
 * *these* materials it renders a black rectangle: `matAluminiumBrushed` carries
 * `metal = 1.0`, so `shade` gives the plate no diffuse lobe at all and every
 * value in the frame is specular. A grazing key on a metal ring lights one edge
 * and nothing else, and a frame holding only the black point and a hairline is
 * not disciplined, it is underexposed.
 *
 * §2.3 is a ceiling, not a target. It caps the plate at `chrome` L .750 and caps
 * the copy column at §2.7's `#38383c`; it says nothing about the rest of the
 * frame, and machined aluminium in an unlit room still puts most of its faces
 * well above ink. So the key direction stays where §A3 puts it — camera-left and
 * grazing, `key[2]` small — and the gain carries the ring faces up into the low
 * mid-tones instead. core.glsl's grade rolls off asymptotically onto sRGB 168, so
 * gain cannot push a highlight through the ceiling; it can only fill in the
 * bottom of the range, which is what is wanted.
 *
 * `keySoft` is above the default for the same reason. §2.4's source is a 4×6ft
 * softbox, and `shade` widens the specular lobe by the source's angular size, so
 * a larger source spreads each highlight around more of a ring's circumference.
 * That is what makes both rings legible *as rings* rather than as two bright
 * spots — and both have to be legible, or the intersection, which is the whole
 * subject of this plate, has nothing to be an intersection of.
 *
 * `rimGain` stays 0 on all four crops. §2.4 permits one hard accent and §A3 asks
 * for it "from behind-left picking the far ring's outer edge", but the pass-
 * through that rim exists to make legible is already carried here by occlusion
 * and by the near/far roughness split in the shader. A second source on top of a
 * key already running at this gain is what makes an object look lit *for* the
 * camera, which §2.4 calls the tell that separates product photography from a
 * render.
 */
export default {
  id: 'derivatives',
  shader: 'a3-derivatives.glsl',
  frames: CARD,
  alt: 'Two machined rings on offset axes intersecting in darkness, a hard highlight tracing where they cross.',
  motion: null,
  crops: {
    /* "Crop tight to the intersection only — the rings exit all four edges." */
    mobile: {
      dead: zone(0, 0, 1, 0.46),
      dead2: CTA_PATCH,
      deadFloor: 0.004,
      deadFloor2: 0.004,
      /* Lowest exposure of the four, keeping §A3's mobile crop the quietest,
         but the crop is tight enough that the two bands fill its live band —
         so the same gain reads brighter here than it does on desktop. */
      exposure: 0.32,
      keyGain: 1.15,
      keySoft: 0.62,
      pan: [0.138, -0.339],
      key: [-0.97, 0.17, 0.11],
      keyPos: [-1.05, -0.56, 0.7],
      keyRange: 1.45,
      fov: 20,
      p: [1.0 /* ring scale */, 0.0 /* far arc */],
    },
    tablet: {
      dead: zone(0, 0, 1, 0.4),
      dead2: CTA_PATCH,
      deadFloor: 0.004,
      deadFloor2: 0.004,
      exposure: 0.36,
      keyGain: 1.15,
      keySoft: 0.62,
      pan: [0.148, -0.339],
      key: [-0.97, 0.16, 0.11],
      keyPos: [-1.05, -0.54, 0.7],
      keyRange: 1.45,
      fov: 19,
      p: [1.05, 0.0],
    },
    /* "Both rings substantially in frame, intersection at 60/65." */
    desktop: {
      dead: zone(0, 0, 1, 0.34),
      dead2: CTA_PATCH,
      deadFloor: 0.004,
      deadFloor2: 0.004,
      exposure: 0.38,
      keyGain: 1.15,
      keySoft: 0.62,
      pan: [0.152, -0.353],
      key: [-0.97, 0.16, 0.1],
      keyPos: [-1.05, -0.5, 0.7],
      keyRange: 1.45,
      fov: 18,
      p: [1.1, 0.0],
    },
    /* "A third of the far ring's arc now sweeps into the right edge, giving
       the wide frame a lateral line. Still no ascending diagonal." */
    wide: {
      dead: zone(0, 0, 1, 0.34),
      dead2: CTA_PATCH,
      deadFloor: 0.004,
      deadFloor2: 0.004,
      exposure: 0.38,
      keyGain: 1.15,
      keySoft: 0.62,
      pan: [0.678, -0.337],
      key: [-0.97, 0.15, 0.1],
      keyPos: [-1.05, -0.5, 0.7],
      keyRange: 1.45,
      fov: 18,
      p: [1.12, 1.0],
    },
  },
}
