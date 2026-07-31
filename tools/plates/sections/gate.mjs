import { BLEED, zone } from '../spec.mjs'

/**
 * A9 — Gate. docs/art-direction.md §3, backing the section headed "Every
 * sentence is gated." One file per plate so that each can be art-directed
 * independently; `config.mjs` only assembles them.
 *
 * Six things here are not per-crop taste and are stated once.
 *
 *  - **This plate is the TIGHT MECHANISM of the set, and it is lit in the
 *    opposite polarity to a8.** a8 (terminal) is the wide shot — a graduated
 *    flat face with one dark cut in it. Here the field is ink and the only
 *    bright marks are the lit opening and the two machined mouths either side
 *    of it, at a distance where the mouth spans ~17% of frame height. §5.5 asks
 *    whether any two plates share a composition; the answer has to be no at
 *    thumbnail size, and it is polarity and scale rather than fov that gets it
 *    there.
 *
 *  - **The key is a lamp, it sits on the slot's centre line, and it is barely
 *    off the jaw faces.** `key` is the direction *toward* the light, so its x is
 *    negative on the three crops where the copy parks right. It is given a
 *    `keyPos`/`keyRange` rather than left directional because §2.4's "gradient
 *    across the surface" is falloff and falloff needs a position (core.glsl's
 *    `uKeyRange` note). What makes it read as light *out of the opening* rather
 *    than as a lamp aimed at a plate is `dz`: at 0.008–0.012 world in front of
 *    the faces the flat outer faces are grazed at 2°–5° and stay in ink, while
 *    the ramps — tilted 20°–22° toward the slot — take the whole of it.
 *
 *  - **The lamp is placed by frame fraction, not by hand.** `lampAt()` below
 *    does the frame→world solve, so the composition numbers in each crop read as
 *    percentages the way §3 states every other composition in the document. Four
 *    crops with four lenses have four different world-per-frame scales, and a
 *    hand-typed world coordinate is a number nobody can check against the brief.
 *    Only `dy` and `dz` are world offsets, because they are measured against the
 *    object (the slot line and the jaw face) rather than against the frame.
 *
 *  - **The reserve is held by the light and by the blade, not by the mask.**
 *    a8's header records the failure: `deadFloor` at 0.06 is a 94% attenuation,
 *    and with the lamp still bright at the boundary the rectangle printed its
 *    own shape into the frame — §2.7's "a hard terminator reads as a matte line"
 *    arriving from the enforcement side. Here the lamp sits 25%–35% of the frame
 *    width from the reserve edge with nothing but inverse-square between, *and*
 *    the blade stands proud of the faces between the two, so everything from the
 *    blade to the reserve is in its shadow. `deadFloor` then sits at 0.22–0.32
 *    doing almost nothing, which is the only way a reserve stops being visible
 *    as a rectangle.
 *
 *  - **No rim, and no second light event.** §2.4 permits one hard accent per
 *    plate; this one does not need it. There is no silhouette in frame to
 *    separate from a background — the jaws fill it — so a rim would be an edge
 *    drawn for the camera, which is the tell §2.4 warns separates a render from
 *    a photograph. §2.3 rule 2's second light event belongs to Onboarding and
 *    Final CTA and to nothing else, so `event` stays at its zero default.
 *
 *  - **The object does not change size between crops.** Everything in `GATE`
 *    below is a world constant shared by all four: one slot, one pair of ramps,
 *    one blade, one seat. A plate whose subject changes size between breakpoints
 *    is four objects photographed once each rather than one object photographed
 *    four times (§5.3).
 *
 * And what is emphatically per-crop: **where the slot sits, which side of the
 * frame the light enters from, which side of the slot line the lamp sits on,
 * where the blade has stopped, and the lens.** The lamp is *above* the slot on
 * desktop and tablet and *below* it on mobile and wide, which swaps which of the
 * two mouths carries the band; and on mobile it crosses to the right of frame
 * entirely, so the energy runs the other way across the picture. A change of fov
 * alone cannot do either, and §5.3's signature correlation is measured against
 * the desktop crop.
 */

/**
 * Frame fraction → world, for a crop's lens.
 *
 * `spec.mjs` solves the camera onto +Z at `0.5 / tan(fov/2)` looking down −Z,
 * and core.glsl's `atFrame` maps a frame fraction into a space whose vertical
 * span is 1.0 while the z = 0 plane is only half a world unit tall — the
 * discrepancy documented at length on `atFrame` and mirrored in `a9-gate.glsl`'s
 * `FRAME_H`. This is the same arithmetic, in JS, so a lamp can be stated where
 * the brief states everything else: as a percentage across the frame.
 */
const worldPerFrameHeight = (fov, z) => 0.5 * (1 - z / (0.5 / Math.tan((fov * Math.PI) / 360)))

/**
 * The object. Shared by every crop — see the note above.
 *
 * There is no jaw width or height here, and that is deliberate: the shader sizes
 * both jaws off the frame so neither has a silhouette on any aspect. A world
 * constant that covers 16:9 is three times what 9:16 needs, and one that fits
 * 9:16 leaves an edge in shot on 16:9 — a composition failure no gate can see.
 */
const GATE = {
  /* Far enough back that the mouth roundover reads as a machined hairline
     rather than as a roundover you can see the shape of (§2.5), and close
     enough that the lamp can stand in front of the faces without leaving the
     frame's world. */
  z: -0.5,
  /* §A8's hard-won number, taken lower. 0.008 world is ~2.6% of frame height on
     every crop — legibly a gap between two parts, and well under the height at
     which a lateral opening starts reading as a slider (§2.1's fabricated UI,
     reached through geometry rather than through pixels). */
  slotHalf: 0.008,
  /* Heavy. The jaws read as *plate* rather than as sheet because the ramp only
     eats the front 40% of their thickness and there is a squared-off wall below
     it for the blade's shadow to fall down. */
  halfDepth: 0.05,
  /*
   * The two ramps, as a width across the frame and a drop into it. 0.052 : 0.020
   * is 21° and 0.033 : 0.014 is 23° — both far enough off the lens axis that the
   * lamp (which stands 0.008–0.012 world off the face plane) rakes them
   * properly, and both shallow enough that the mouth still reads as a machined
   * relief in a heavy plate rather than as a chamfered pipe end.
   *
   * They are deliberately unequal. §2.4 wants a key that describes a form
   * asymmetrically, and a mouth symmetric about its own slot is a moulding: the
   * wider, shallower upper ramp carries a broad band and the narrower, steeper
   * lower one carries little more than its mouth hairline, so the two jaws read
   * as two parts. The pair spans 0.101 world with the slot — about 17% of frame
   * height on every crop, which is the "tight mechanism" distance.
   */
  rampUpper: 0.052,
  dropUpper: 0.02,
  rampLower: 0.033,
  dropLower: 0.014,
  /* §2.5's hairline: about a third of the slot's half-height, so the break and
     the mouth are machined roundovers and the flat surfaces still meet them.
     Widen it and the specular stops describing an edge and starts lighting a
     face — "the most load-bearing number in the system" (README on
     `sdRingSlab`). */
  lipRadius: 0.0028,
  /* The upper jaw stands proud of the lower. Small — 0.009 world is under a
     fifth of the jaw's own depth — but it is what puts a real step at the slot
     and stops the mouth reading as one milled groove. */
  step: 0.009,
  /* ~7.5% of the desktop frame's width, and deliberately quoted in world rather
     than in frame: it is the same blade on the 9:16 crop, where it covers 19%. */
  bladeWidth: 0.07,
  /* Mid-travel. A third of the opening still clear beneath its edge — not open,
     not shut, and identical on all four crops because it is one blade caught
     once. */
  bladeSeat: 0.3,
  bladeStandOff: 0.005,
  bladeHalfThickness: 0.007,
  bladeRadius: 0.0025,
  /* Set back far enough that only the strip directly behind the opening takes
     the lamp. Closer and the whole passage lights up and the slot fills in;
     further and there is nothing behind the gap for the light to come off. */
  throatGap: 0.018,
}

/**
 * A lamp at frame x, offset `dy` from the slot line and `dz` in front of the
 * upper jaw's face — the frontmost surface in the scene apart from the blade.
 *
 * `dz` is measured against the *upper* face rather than the lower on purpose:
 * it is the clearance that decides whether the lamp is in free space, and the
 * upper jaw is the one standing proud. Both offsets are world rather than frame
 * because they are measured against the object, and the object is the same size
 * on all four crops.
 */
const lampAt = ({ fov, aspect, slotY, x, dy, dz }) => {
  const s = worldPerFrameHeight(fov, GATE.z)
  return [
    (x - 0.5) * aspect * s,
    (slotY - 0.5) * s + dy,
    GATE.z + GATE.halfDepth + GATE.step + dz,
  ]
}

/**
 * Assembles `uP` from the shared object and the two per-crop composition
 * numbers. A function rather than four hand-typed arrays because a
 * seventeen-slot positional array is exactly the shape that drifts: the crops
 * differ in two values and nothing else, and that should be visible at a glance.
 */
const params = ({ slotY, bladeAt }) => [
  GATE.z,
  slotY,
  GATE.slotHalf,
  GATE.halfDepth,
  GATE.rampUpper,
  GATE.dropUpper,
  GATE.rampLower,
  GATE.dropLower,
  GATE.lipRadius,
  GATE.step,
  bladeAt,
  GATE.bladeWidth,
  GATE.bladeSeat,
  GATE.bladeStandOff,
  GATE.bladeHalfThickness,
  GATE.bladeRadius,
  GATE.throatGap,
]

export default {
  id: 'gate',
  shader: 'a9-gate.glsl',
  frames: BLEED,
  alt: 'Two heavy machined jaws facing each other across a narrow slot, one blade halted part-way down it, a thin line of light escaping the gap.',
  motion: null,
  crops: {
    /*
     * "Copy is top-anchored and full width — there is no dead side." The reserve
     * is the top 85%, so the whole mouth sits in a shallow band along the bottom
     * edge and reads as a mechanism continuing off-frame. The quietest of the
     * four by some distance.
     *
     * This is also the crop that inverts the set's lateral energy: the lamp
     * crosses to x = 0.70 and the blade sits *left* of it at 0.32, so the light
     * enters from the right and the shadow runs left — the mirror of the three
     * landscape crops, which is a change §5.3's signature can see and a change
     * of fov is not.
     */
    mobile: {
      dead: zone(0, 0, 1, 0.85),
      deadFloor: 0.12,
      deadFeather: 0.16,
      exposure: 0.72,
      fov: 26,
      key: [0.62, -0.28, 0.73],
      /* Below the slot line, which swaps the band onto the *upper* ramp — the
         one facing down toward the bottom of frame — so what little is lit here
         settles downward rather than climbing into the reserve (§2.1). */
      keyPos: lampAt({ fov: 26, aspect: 900 / 1600, slotY: 0.062, x: 0.7, dy: -0.006, dz: 0.009 }),
      /* The closest lamp in the set. The lit band is 12% of a 9:16 frame, so the
         falloff has the least distance of any crop in which to reach ink. */
      keyRange: 0.055,
      p: params({ slotY: 0.062, bladeAt: 0.32 }),
    },
    /*
     * The most conservative crop of the four (§2.7's 768px edge case): at
     * exactly 768px the tablet image is served while the copy is already parked
     * to its side, so it has to clear the top band *and* the right column. Both
     * reserves are declared, and the gate is pushed into the bottom-left
     * quadrant so it is dark in both before either is applied — a floor caps
     * brightness but cannot soften a transition.
     *
     * This crop's frame is only 0.45 world units wide, so inverse-square alone
     * cannot take the light from the lamp at x = 0.13 to ink by the reserve at
     * x = 0.44 — there is barely a doubling of distance in it. What does the
     * work is the blade, whose leading edge sits at 0.29 and whose shadow covers
     * everything between it and the boundary. That is the reserve held by the
     * subject rather than by the mask.
     */
    tablet: {
      dead: zone(0, 0, 1, 0.36),
      dead2: [0.44, 0, 1, 1],
      deadFloor: 0.24,
      deadFloor2: 0.24,
      deadFeather: 0.18,
      exposure: 0.60,
      fov: 24,
      key: [-0.6, 0.34, 0.72],
      keyPos: lampAt({ fov: 24, aspect: 1200 / 1600, slotY: 0.235, x: 0.13, dy: 0.006, dz: 0.01 }),
      keyRange: 0.06,
      p: params({ slotY: 0.235, bladeAt: 0.29 }),
    },
    /*
     * The reference composition. The slot runs laterally at y ≈ 45%, the lamp
     * sits on its centre line at x ≈ 10% and a hair above it, and the blade has
     * come down across the opening with its leading edge at x ≈ 30% — so the
     * line of light runs in from the left falloff, peaks under the lamp, and
     * halts where the blade crosses. Nothing structural is lit past x ≈ 38%.
     */
    desktop: {
      dead: zone(0.44, 0.14, 1, 0.86),
      deadFloor: 0.3,
      deadFeather: 0.17,
      exposure: 0.8,
      fov: 22,
      key: [-0.62, 0.3, 0.72],
      keyPos: lampAt({ fov: 22, aspect: 1920 / 1280, slotY: 0.45, x: 0.1, dy: 0.006, dz: 0.011 }),
      keyRange: 0.07,
      p: params({ slotY: 0.45, bladeAt: 0.3 }),
    },
    /*
     * Not the desktop crop with more room. The slot moves to the **upper**
     * third and the lamp drops **below** its centre line, so the frame's energy
     * inverts: the band moves onto the upper ramp, the mouth's brightest mark
     * now faces down, and what light survives settles toward the lower half
     * instead of sitting level with it. a8's wide crop kept desktop's
     * arrangement and §5.3 caught it — signatures correlated at 0.949, "a scale,
     * not a crop".
     *
     * The extra width is room, not content: the blade moves right with the
     * reserve rather than a second form arriving to fill the frame, and the
     * longer lens (20° ≈ 135mm) flattens the two jaws further, which is what
     * keeps a wider plate from reading as a receding plane.
     */
    wide: {
      dead: zone(0.44, 0.14, 1, 0.86),
      deadFloor: 0.32,
      deadFeather: 0.26,
      exposure: 0.68,
      fov: 20,
      key: [-0.58, -0.36, 0.73],
      keyPos: lampAt({ fov: 20, aspect: 2560 / 1440, slotY: 0.655, x: 0.19, dy: -0.006, dz: 0.011 }),
      /* The longest range in the set: the widest frame has the most mouth to
         cover, so the falloff has to travel further before it dies. */
      keyRange: 0.085,
      p: params({ slotY: 0.655, bladeAt: 0.33 }),
    },
  },
}
