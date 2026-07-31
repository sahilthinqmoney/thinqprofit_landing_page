import { BLEED, zone } from '../spec.mjs'

/**
 * A5 — docs/art-direction.md §3. One file per plate so that the six can be
 * art-directed independently; `config.mjs` only assembles them.
 */
export default {
  id: 'onboarding',
  shader: 'a5-onboarding.glsl',
  frames: BLEED,
  alt: 'Three matte black blocks resting in a row on a dark surface, each lit a little more than the one before.',
  motion: null,
  crops: {
    /* "Blocks sit in the bottom 15%, cropped by the bottom edge, reading as a
       row continuing off-frame. Everything above is ink." */
    mobile: {
      dead: zone(0, 0, 1, 0.85),
      deadFloor: 0.016,
      exposure: 0.72,
      haze: 0.34,
      pan: [0.35, -1.15],
      key: [-0.78, 0.5, 0.38],
      fov: 24,
      p: [3 /* blocks */, 0.0 /* bounce */],
    },
    /* "Blocks in the bottom-right quadrant, only two fully in frame." */
    tablet: {
      dead: zone(0, 0, 1, 0.42),
      dead2: [0, 0, 0.62, 1],
      deadFloor: 0.02,
      deadFloor2: 0.024,
      exposure: 0.9,
      pan: [0.6, -0.6],
      key: [-0.8, 0.48, 0.36],
      fov: 24,
      p: [3, 0.0],
    },
    /* "Three blocks across the right 44%, baseline at y≈62%." One of the two
       plates permitted a second light event (§2.3 rule 2): a neutral bounce
       on the third block's shadow side at x≈82%, capped at L .600, well clear
       of the metal CTA at x≈12%. */
    desktop: {
      dead: zone(0, 0.1, 0.56, 0.9),
      deadFloor: 0.024,
      exposure: 1.0,
      pan: [0.5, -0.3],
      key: [-0.82, 0.46, 0.35],
      fov: 22,
      event: [0.82, 0.42, 0.085, 0.115],
      p: [3, 1.0],
    },
    /* "Three blocks held at the same size, spread with more air between them.
       The left 56% gains room, not content." */
    wide: {
      dead: zone(0, 0.1, 0.56, 0.9),
      deadFloor: 0.024,
      exposure: 1.0,
      pan: [0.58, -0.28],
      key: [-0.82, 0.45, 0.35],
      fov: 21,
      event: [0.84, 0.4, 0.08, 0.11],
      p: [3, 1.0],
    },
  },
}
