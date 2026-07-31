import { BLEED, zone } from '../spec.mjs'

/**
 * A10 — Scale. docs/art-direction.md §2 and §3, transcribed to numbers.
 *
 * Section heading "Order flow, labelled."; deck "Footprint, depth ladder, tape
 * and CVD on NSE and MCX; each bar marked tape, inferred or approximated."
 *
 * The subject is a **witness mark at 1:1**: one punched index mark — the datum a
 * machinist strikes to say *this is the one I measured from* — with the burr of
 * displaced metal raised round its rim, and behind it, out of focus, the shallow
 * score it references. The measurement is recorded ON the object rather than
 * asserted about it, which is what per-bar provenance looks like with no chart,
 * no ladder and no readout in frame (§2.1 bans all three; §5.2 bans anything
 * that resolves into them at 25%).
 *
 * **Magnification is the point of this plate**, and it is what separates it from
 * A8. A8 is a wide shot of a whole surface with one hairline cut in it. This is
 * one feature a few millimetres across, blown up until its machining is the
 * subject: the raised lip of the punch, the torn metal on its crest, the way the
 * light dies inside the depression. An earlier pass shot it wide and came back
 * looking like A8 with a smaller cut, which is four photographs of one idea and
 * a §5.5 reject however well any of them is lit.
 *
 * Six things below are not per-crop taste and are stated once.
 *
 *  - **The key is on camera-right, and it is a lamp.** The copy parks left
 *    (`place="left"`), so §2.7 reserves the left of every landscape frame and
 *    the light has to come from the side the subject is on. `key` is the
 *    direction *toward* the light, so that is +x. It is positional rather than
 *    directional because the subject is one large face: a source at infinity
 *    puts a single even tone on a plane and the plate then has no gradient at
 *    all, only a mark on a grey card. Inverse-square across the face is what
 *    makes it read as lit (§2.4, and core.glsl's `uKeyRange` note).
 *
 *  - **The lamp is grazing, and that is what makes the mark legible.** Every
 *    `keyPos` here sits 65°–80° off the lens axis and 10°–17° above the surface
 *    it is lighting. At that elevation the near rim of an 80° pit throws a
 *    shadow more than five mouth-diameters long, so the pit is almost entirely
 *    dark, and the only things that come back are the burr's outward flank on
 *    the lamp side and a thin lit crescent at the far inner rim. Two arcs facing
 *    opposite ways around a black ellipse *is* a punch mark; light it from the
 *    front and the same geometry renders as a grey disc.
 *
 *  - **The reserve is held by the light, not by the mask.** core.glsl attenuates
 *    radiance inside the rectangle and feathers outside it, so a low `deadFloor`
 *    under a lamp that is still bright at the boundary prints the rectangle's own
 *    shape into the frame — §2.7's "hard terminator reads as a matte line",
 *    arriving from the enforcement side. A8 shipped that failure once at
 *    `deadFloor` 0.06. Every lamp here is placed close enough to the subject that
 *    its own inverse-square falloff has reached ink by the reserve edge, and the
 *    floors then sit at 0.20–0.33 doing almost nothing. They are a backstop
 *    against one stray specular, not the mechanism.
 *
 *  - **No rim, and no second light event.** §2.4 permits one hard accent per
 *    plate; this one does not need it, because there is no silhouette in frame
 *    to separate from a background — the face fills every crop. §2.3 rule 2's
 *    second light event belongs to Onboarding and Final CTA and nowhere else, so
 *    `event` stays at its zero default. Both bright arcs are the *same* key
 *    caught by two pieces of geometry.
 *
 *  - **The punch is never on the score's axis.** On its axis it reads as a tick
 *    on a scale, which is the §5.2 reject this plate is most exposed to; the two
 *    marks are always separated by several mouth diameters across the frame. And
 *    the score is always the *far* one — up the frame where the surface recedes,
 *    or down it on the crop where the tilt is reversed — so the sharp mark is
 *    the near one and the eye settles from the datum onto the line rather than
 *    climbing off it (§2.1: lateral, orbital, radial or downward-settling).
 *
 *  - **There are no graduations, ticks or ruler edge anywhere.** One punch, one
 *    score. §5.2 rejects an evenly spaced repeated form because it resolves into
 *    bars at thumbnail size, and a machinist's surface is the most tempting
 *    place in the system to cut a scale. The shader has no loop and no modulo;
 *    the count is structural rather than a value that could be raised.
 *
 * And what is emphatically per-crop: **the magnification, where the mark sits,
 * which way the surface is turned, where the score runs and where the lamp is.**
 * Those five make these four different photographs rather than four exports
 * (§5.3) — and the wide crop turns the plate over, so its depth ramp, its light
 * and its subject all invert against desktop rather than merely sliding.
 */

/**
 * The object — shared by every crop, and expressed as **ratios to the punch's
 * own mouth radius** rather than in world units.
 *
 * That is the right invariant and it is a deliberate departure from A8, which
 * shares world constants across its crops. This plate's whole subject is
 * magnification: the mark is 6% of frame height on mobile and 16% on desktop,
 * because a macro rail moved between shots, not because the part changed. What
 * must not change is the part's *proportions* — how deep the pit is for its
 * mouth, how far the burr stands proud, how fine the score is beside it — and
 * those are what this table holds. A plate whose object changes shape between
 * breakpoints is §5.3's failure one level down.
 */
const MARK = {
  /**
   * **The working distance, and why it is 2.4 rather than 0.6.**
   *
   * `onFace` places marks by frame fraction, so moving the surface back and
   * scaling it up is compositionally a no-op — the render is pixel-identical.
   * What it is not a no-op for is core.glsl's occlusion, because both of its
   * samplers walk in **absolute world units**: `ambientOcclusion` probes at
   * `0.012 + 0.11·i` and `softShadow` steps `clamp(d, 0.012, 0.34)`. A feature
   * much smaller than ~0.05 world is invisible to both — the AO probes step
   * clean over it and the shadow trace strides past its walls without ever
   * sampling inside.
   *
   * At this standoff a unit of frame height is about one world unit, so the
   * desktop punch lands at 0.16 radius and 0.18 deep: the AO probes resolve
   * three samples across the pit and the grazing rim shadow gets thirty steps
   * along its floor. That shadow is the mark — a punch with no shadow in it is
   * not a punch, it is a circle, and an earlier pass of this plate proved it.
   *
   * It is also honest photography rather than a fov trick: §2.6 asks for a long
   * lens and flat perspective, and this is a genuinely long working distance.
   * The marcher's precision is scale-invariant in pixels (`s.d < 0.0006·t` grows
   * with `t` at exactly the rate world-units-per-pixel does), so the burr's
   * crest is resolved no more coarsely here than it would be at arm's length.
   */
  z: -2.4,
  /* Deep enough that the body's back face and side walls can never be reached
     through the marks, shallow enough to stay well inside `tMax`. */
  halfDepth: 0.9,

  /* Depth ÷ mouth radius. 1.15 is an included angle of 82°, where a real centre
     punch is ground (70–90°), and — more usefully — steep enough that the pit
     self-shadows over four-fifths of its floor at the ~13° elevation the key
     arrives at. Flatten it and the pit fills with light and stops being a hole. */
  punchDepth: 1.15,
  /* The rim roundover. A punch displaces metal rather than removing it, so its
     rim is a burr, not a machined lip: tighter than the score's roundover, and
     tight enough that §2.5's hairline describes the edge instead of lighting the
     face beside it. */
  punchRim: 0.085,

  /* The burr. Crest at 1.16 mouth radii sits it hard against the rim, where
     displaced metal actually goes; a section of 0.34 standing 0.105 proud makes
     a low dome whose outward flank reaches ~45° — steep enough to turn the
     grazing key into a compact arc, shallow enough that it never becomes a
     lit band. */
  burrCrest: 1.16,
  burrSection: 0.34,
  burrProud: 0.105,
  /* Offset along the surface's lateral axis, so the ring is thicker on one side.
     This is the difference between a struck mark and a lathe operation, and it
     is worth a tenth of a radius: an exactly concentric annulus reads as
     machined, and a machined annulus is one step from A11's territory. */
  burrOffset: 0.1,
  /* The radius the swell is faired into the face with. A hard union would leave
     a crease circling the mark — a second closed line, and a §2.7 edge. */
  burrFair: 0.22,

  /* The score, all ÷ mouth radius. It is *fine*: a half-height of 0.115 radii
     puts it at roughly a seventh of the punch's diameter, which is a scribed
     line beside a struck datum rather than the channel A8 cuts. It goes 0.10
     radii in — a scratch, not a pocket. A cut deep enough to have a floor is a
     cut something could sit in, and that is A8's photograph. */
  scoreHalf: 0.115,
  scoreDepth: 0.1,
  /* And its lip roundover is most of its own depth, on purpose: this is the
     out-of-focus form, and soft geometry is the only softness a one-sample
     marcher can produce. The result is a broad shallow trough with no hard edge
     anywhere — which is exactly what a scribe line looks like off the focal
     plane, and it also means the score can never contribute a hairline that
     competes with the burr. */
  scoreLip: 0.075,

  /* Blast-finish amplitude on albedo, ±4.5%. Enough that the large lit field has
     incident in it rather than being an unbroken ramp; far too coarse and too
     shallow to trip §2.7's 20-level-per-8px edge test. */
  blast: 0.09,
}

/**
 * Assembles `uP` from the shared object and the six per-crop composition
 * numbers. Written as a function rather than four hand-typed arrays because a
 * twenty-slot positional array is exactly the shape that drifts: the crops
 * differ in six values and nothing else, and that should be visible at a glance.
 */
const params = ({ tilt, punchX, punchY, radius, scoreY, scoreCap, dof }) => [
  MARK.z,
  tilt,
  MARK.halfDepth,
  punchX,
  punchY,
  radius,
  MARK.punchDepth,
  MARK.punchRim,
  MARK.burrCrest,
  MARK.burrSection,
  MARK.burrProud,
  MARK.burrOffset,
  MARK.burrFair,
  scoreY,
  scoreCap,
  MARK.scoreHalf,
  MARK.scoreDepth,
  MARK.scoreLip,
  dof,
  MARK.blast,
]

/**
 * Lamp placement in the same frame fractions §2.7 and §3 state everything else
 * in, converted to the world position `keyPos` wants.
 *
 * This exists because a hand-typed world triple is unreadable and unarguable
 * with: "world x 0.77" says nothing about whether the light is off-frame, and
 * whether it is off-frame is the entire question — a lamp inside the frame puts
 * §2.4's forbidden "hotspot in the middle of the surface" on it, and a lamp too
 * far outside it flattens the falloff the reserve depends on. Written as
 * `[1.05, 0.34]` it is obvious that the source sits just past the right edge and
 * a third of the way up, which is what the composition note says it does.
 *
 * The arithmetic is `spec.mjs`'s `solveCamera` and core.glsl's frame space, in
 * one place: camera distance is `0.5 / tan(fov/2)`, and a unit of frame height
 * at depth z is `0.5 · (1 − z/distance)`.
 */
const lamp = (fov, aspect, [fx, fy], z) => {
  const distance = 0.5 / Math.tan((fov * Math.PI) / 360)
  const scale = 0.5 * (1 - z / distance)
  return [(fx - 0.5) * aspect * scale, (fy - 0.5) * scale, z]
}

const RATIO = {
  mobile: BLEED.mobile[0] / BLEED.mobile[1],
  tablet: BLEED.tablet[0] / BLEED.tablet[1],
  desktop: BLEED.desktop[0] / BLEED.desktop[1],
  wide: BLEED.wide[0] / BLEED.wide[1],
}

export default {
  id: 'scale',
  shader: 'a10-scale.glsl',
  frames: BLEED,
  alt: 'A punched index mark struck into machined aluminium, the burr around its rim catching a single low light, with a shallow scribed line out of focus behind it.',
  motion: null,
  crops: {
    /*
     * MOBILE — 900×1600. Copy is top-anchored and full width below 768px
     * (§2.7's most-missed fact), so the reserve is the top 85% and there is no
     * dead *side* at all. The subject is the bottom band and nothing else: the
     * mark sits low and just clipped by the bottom edge, which is what a macro
     * frame looks like when there is only a sixth of it left to work in.
     *
     * The lamp is the closest in the set and the lowest, so the pool of light is
     * a shallow wedge along the bottom that has died before it can climb into
     * the reserve — everything above y=15% here.
     *
     * The score is placed at the reserve boundary on purpose and is a *whisper*
     * on this crop: the feather extinguishes it over the span it would otherwise
     * be legible across. That is correct for a frame whose reserve is 85% of it,
     * and it matches what A8's mobile crop does with its channel — the quietest
     * of the four by a distance, carrying one mark and one gradient.
     */
    mobile: {
      dead: zone(0, 0, 1, 0.85),
      deadFloor: 0.08,
      deadFeather: 0.24,
      exposure: 0.62,
      /* 26° ≈ 85mm, the wide end of §2.6's band. The narrowest frame gets the
         shortest lens so the band along the bottom has some width in it. */
      fov: 26,
      key: [0.94, 0.24, 0.24],
      keyPos: lamp(26, RATIO.mobile, [1.02, 0.2], -2.2),
      keyRange: 0.34,
      p: params({
        tilt: 26,
        punchX: 0.58,
        punchY: 0.058,
        radius: 0.062,
        scoreY: 0.104,
        scoreCap: 0.14,
        dof: 0.13,
      }),
    },
    /*
     * TABLET — 1200×1600. The most conservative crop of the four (§2.7's 768px
     * edge case): at exactly 768px the tablet image is served while the copy is
     * already parked to its side, so it has to clear the top band *and* the left
     * column. Both reserves are declared, and the mark is pushed into the
     * bottom-right quadrant so it is dark in both before either is applied — a
     * floor caps brightness but cannot soften a transition.
     *
     * The feather is 0.26 rather than A8's 0.34 here for a reason specific to a
     * macro subject: on a 3:4 frame a 0.34 feather reaches x=0.76, which is past
     * the middle of the mark, and a reserve that fades across the subject clamps
     * one side of it at a lower ceiling than the other. 0.26 stops at x=0.68,
     * which is outside the burr's lit flank and only touches the pit's shadow
     * side — where there is nothing to clamp.
     */
    tablet: {
      dead: zone(0, 0, 1, 0.36),
      dead2: [0, 0, 0.42, 1],
      deadFloor: 0.2,
      deadFloor2: 0.2,
      deadFeather: 0.26,
      exposure: 1.25,
      fov: 24,
      key: [0.95, -0.18, 0.26],
      keyPos: lamp(24, RATIO.tablet, [1.06, 0.14], -2.24),
      keyRange: 0.4,
      p: params({
        tilt: 26,
        punchX: 0.745,
        punchY: 0.215,
        radius: 0.105,
        scoreY: 0.42,
        scoreCap: 0.5,
        dof: 0.14,
      }),
    },
    /*
     * DESKTOP — 1920×1280. The reference composition, and the largest the mark
     * gets: a mouth 0.175 of frame height across, so the whole feature with its
     * burr spans nearly half the frame's height. Reserve is the left column
     * (x 0–56%, y 12–80%), and the mark sits clear of it in the lower right at
     * (0.795, 0.40) — far enough right that the feather only reaches the pit's
     * shadow side.
     *
     * The surface is turned 26° so the top of the frame recedes: the mark is on
     * the focal plane, and the score at y=0.665 is ~0.12 world further away,
     * which at `dof` 0.15 is most of a stop of defocus. The score's own cap sits
     * at x=0.70, just past the reserve boundary, so the feather extinguishes it
     * rather than a terminator ending it (§2.7 asks for a ≥12% falloff *and* a
     * reserve with no edges; this is one mechanism satisfying both).
     *
     * Lamp just off the right edge at [1.05, 0.34] and 0.17 in front of the face
     * — 70° off the lens axis, 13° above the surface. Energy: a wedge entering
     * bottom-right and dying to ink before x=0.35. `exposure` 1.6 is where the
     * burr's crest lands near `chrome` without the lit field crossing L .600 over
     * more than 3% of frame (§2.3).
     */
    desktop: {
      dead: zone(0, 0.12, 0.56, 0.8),
      deadFloor: 0.33,
      deadFeather: 0.26,
      exposure: 1.24,
      /* 22° ≈ 100mm, the middle of §2.6's band and the set's default. */
      fov: 22,
      key: [0.93, -0.15, 0.33],
      keyPos: lamp(22, RATIO.desktop, [1.05, 0.34], -2.23),
      keyRange: 0.4,
      p: params({
        tilt: 26,
        punchX: 0.795,
        punchY: 0.4,
        radius: 0.175,
        scoreY: 0.665,
        scoreCap: 0.7,
        dof: 0.15,
      }),
    },
    /*
     * WIDE — 2560×1440. **Not the desktop crop with more room.** §5.3 rejects a
     * set whose 32×32 luminance signatures correlate above ~0.93, and changing
     * `fov` alone will not move a signature — A8 shipped that mistake once and
     * measured 0.949. So the plate is *turned over*: `tilt` goes to −26, which
     * puts the near edge of the surface at the top of the frame instead of the
     * bottom and inverts the depth ramp with it. Everything follows from that
     * one sign.
     *
     *  - The mark, which must sit on the near part of the surface, moves from
     *    y=0.40 to y=0.585 — from the lower third to the upper.
     *  - The score, which must be the far one, moves from above the mark to
     *    below it, at y=0.30.
     *  - The lamp crosses the frame's midline with them, from y=0.34 to y=0.52,
     *    because the surface now faces slightly downward and a light left high
     *    would graze it at 4° and light nothing.
     *
     * The bright lobe therefore moves from the lower right of the frame to the
     * upper right and the empty room moves the other way, which is a different
     * photograph rather than a rescale. The extra width goes to the left as
     * room, not content (§A1's wide crop, in as many words).
     *
     * 20° ≈ 135mm: the longest lens in the set flattens the receding face
     * further, which is what keeps a tilted surface reading as a plate rather
     * than as a tabletop (§2.6).
     */
    wide: {
      dead: zone(0, 0.12, 0.56, 0.8),
      deadFloor: 0.31,
      deadFeather: 0.24,
      exposure: 1.2,
      fov: 20,
      key: [0.96, 0.13, 0.26],
      keyPos: lamp(20, RATIO.wide, [1.06, 0.52], -2.24),
      keyRange: 0.42,
      p: params({
        tilt: -26,
        punchX: 0.83,
        punchY: 0.585,
        radius: 0.14,
        scoreY: 0.3,
        scoreCap: 0.68,
        dof: 0.15,
      }),
    },
  },
}
