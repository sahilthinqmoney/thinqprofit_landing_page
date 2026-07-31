import { BLEED, zone } from '../spec.mjs'

/**
 * A8 — docs/art-direction.md §3. One file per plate so that each can be
 * art-directed independently; `config.mjs` only assembles them.
 *
 * Four things here are not per-crop taste and are stated once:
 *
 *  - **The key is on camera-right, and it is a lamp.** The copy parks left
 *    (`place="left"`), so §2.7 reserves the left of every frame and the light has
 *    to come from the side the subject is on. `key` is the direction *toward* the
 *    light, so that is +x. It is given a `keyPos`/`keyRange` rather than left
 *    directional because the subject is one large flat face: a source at infinity
 *    puts a single even tone on a plane and the plate then has no gradient at
 *    all, only a silhouette. Inverse-square across the face is what makes it read
 *    as lit (§2.4, and core.glsl's `uKeyRange` note).
 *
 *  - **No rim, and no second light event.** §2.4 permits one hard accent per
 *    plate; this one does not need it. The slab separates from the room because
 *    its own face carries fifteen to forty levels above `#050505` across the lit
 *    third of the frame, not because an edge was drawn behind it — and a second
 *    accent on the unlit side is the tell that separates a render from a
 *    photograph. §2.3 rule 2's second event belongs to Onboarding and Final CTA
 *    and is off here (`event` defaults to zero).
 *
 *  - **The dead zone's feather is what kills the channel, not its cap.**
 *    `rectInside` in core.glsl feathers *outside* the reserve rectangle, so on
 *    desktop the region from x=0.56 to x=0.72 is progressively attenuated. The
 *    channel's cap is placed just past the boundary in every crop so that the cut
 *    fades out over that span instead of ending at a visible terminator. §2.7
 *    asks for a falloff spanning ≥12% of frame width *and* for a reserve with no
 *    edges in it; this is one mechanism satisfying both.
 *
 *  - **The tool's crown is flush with the face.** `uP[5] = uP[8] × 2` would put
 *    it exactly at the surface; the values below sit a hair under, so it reads as
 *    seated in the cut. Anything proud of the face takes its own specular and
 *    stops being the silhouette the composition needs.
 *
 * And what is emphatically per-crop: **the channel's height, where the cut dies,
 * where the tool sits and `fov` make these four different photographs rather than
 * four exports** (§5.3). All four move between breakpoints, and they move in the direction §2.7's table
 * requires — the reserve is a left column on the two landscape crops, a top band
 * on mobile, and both at once on tablet.
 *
 * World-unit parameters (`uP[4..6]`, `uP[8..13]`) are shared across the four on
 * purpose. They are the *object* — one slab, one cutter, one tool — and a plate
 * whose subject changes size between breakpoints is four objects photographed
 * once each rather than one object photographed four times.
 */

/**
 * The object. Shared by every crop — see the note above.
 *
 * There is no slab width or height here, and that is deliberate: the shader sizes
 * the slab off the frame so it has no silhouette on any aspect. A world constant
 * that covers 16:9 is three times what 9:16 needs, and one that fits 9:16 leaves
 * an edge in shot on 16:9 — which is a composition failure no gate can see.
 */
const SLAB = {
  z: -0.6,
  channelHalfHeight: 0.0095,
  channelHalfDepth: 0.013,
  /* §2.5's hairline. 0.007 world ≈ 14px on the desktop master, read at this
     depth — inside the band a5-onboarding cites for a machined chamfer. */
  chamfer: 0.0055,
  toolRadius: 0.0068,
  halfDepth: 0.22,
  sectionRadius: 0.004,
}

/**
 * Assembles `uP` from the shared object and the three per-crop composition
 * numbers. Written as a function rather than four hand-typed arrays because an
 * eleven-slot positional array is exactly the shape that drifts: the crops differ
 * in three values and nothing else, and that should be visible at a glance.
 */
const params = ({ channelY, channelCap, toolCap }) => [
  SLAB.z,
  channelY,
  channelCap,
  SLAB.channelHalfHeight,
  SLAB.channelHalfDepth,
  SLAB.chamfer,
  toolCap,
  SLAB.toolRadius,
  SLAB.halfDepth,
  SLAB.sectionRadius,
]

export default {
  id: 'terminal',
  shader: 'a8-terminal.glsl',
  frames: BLEED,
  alt: 'A machined aluminium slab cut by a single deep channel, one dark tool resting in it.',
  motion: null,
  crops: {
    /*
     * "Copy is top-anchored and full width — there is no dead side. The slab sits
     * in the bottom 15%, cropped by the bottom edge, reading as a surface
     * continuing off-frame." The quietest of the four by some distance: the
     * reserve is almost the whole frame, so what is left is one lit band along
     * the bottom and the cut running out of it.
     */
    mobile: {
      dead: zone(0, 0, 1, 0.85),
      deadFloor: 0.09,
      deadFeather: 0.2,
      exposure: 0.95,
      fov: 26,
      key: [0.66, 0.62, 0.42],
      /* Closest lamp in the set, and the only one below the frame's midline. The
         lit region is a shallow band along the bottom, so the light has to die
         within it rather than travel up into the reserve — which on this crop is
         everything above y=15%. */
      keyPos: [0.17, -0.33, -0.24],
      keyRange: 0.22,
      p: params({ channelY: 0.068, channelCap: 0.2, toolCap: 0.34 }),
    },
    /*
     * The most conservative crop of the four (§2.7's 768px edge case): at exactly
     * 768px the tablet image is served while the copy is already parked to its
     * side, so it has to clear the top band *and* the left column. Both reserves
     * are declared, and the subject is pushed into the bottom-right quadrant so
     * it is dark in both before either is applied — a floor caps brightness but
     * cannot soften a transition.
     */
    tablet: {
      dead: zone(0, 0, 1, 0.36),
      dead2: [0, 0, 0.42, 1],
      deadFloor: 0.2,
      deadFloor2: 0.2,
      deadFeather: 0.34,
      exposure: 0.92,
      fov: 24,
      key: [0.78, -0.45, 0.4],
      keyPos: [0.3, -0.28, -0.235],
      keyRange: 0.24,
      p: params({ channelY: 0.16, channelCap: 0.6, toolCap: 0.72 }),
    },
    /*
     * The reference composition. "Slab entering from the right edge, one channel
     * running right-to-left and dying before frame centre, tool resting in it at
     * roughly x=78%. Nothing structural crosses x=60%."
     */
    desktop: {
      dead: zone(0, 0.12, 0.56, 0.8),
      deadFloor: 0.34,
      deadFeather: 0.3,
      exposure: 1.82,
      fov: 22,
      key: [0.82, 0.45, 0.32],
      keyPos: [0.74, 0.2, -0.25],
      keyRange: 0.5,
      p: params({ channelY: 0.29, channelCap: 0.655, toolCap: 0.75 }),
    },
    /*
     * "The extra width goes to the left. Do not use the extra room to add
     * interest on the copy side." So the slab moves further right rather than
     * scaling up, the cut drops and lengthens, and the tool moves out with it —
     * the wide frame gains room, not content. A longer lens (20° ≈ 135mm) flattens
     * the face further, which is what keeps a wider slab from reading as a
     * receding plane.
     */
    wide: {
      dead: zone(0, 0.12, 0.56, 0.8),
      deadFloor: 0.32,
      deadFeather: 0.28,
      exposure: 2.05,
      fov: 20,
      key: [0.84, -0.4, 0.3],
      /* The longest range in the set: the widest frame has the most face to
         cover, so the falloff has to travel further before it dies. */
      keyPos: [0.96, -0.26, -0.25],
      keyRange: 0.62,
      p: params({ channelY: 0.63, channelCap: 0.7, toolCap: 0.79 }),
    },
  },
}
