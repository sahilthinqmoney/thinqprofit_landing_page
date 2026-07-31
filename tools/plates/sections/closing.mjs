import { BLEED, zone } from '../spec.mjs'

/**
 * A6 — docs/art-direction.md §3. One file per plate so that the six can be
 * art-directed independently; `config.mjs` only assembles them.
 *
 * Three things in here are not defaults and are not taste, so they are stated
 * once at the top rather than four times below.
 *
 * **The key is a lamp, not a direction.** §A6 asks for "the wall falloff behind
 * it" and for a floor the light "dies into" toward the lower right. Both are
 * distance falloff, and a directional key cannot produce either — it lights
 * every point of a flat plane identically, which is how an empty room ends up
 * reading as a flat card. `keyPos` + `keyRange` (see core.glsl's uKeyRange
 * note) is what gives this plate a room instead of a backdrop. `key` is kept
 * pointing the same way as the lamp because it is still the fallback direction
 * and core.glsl's haze term reads it.
 *
 * **The lamp has to sit above everything the frame can see.** `softShadow` has
 * no notion of how far away the light is — it marches until it hits geometry or
 * passes t = 9 — so any surface higher than the lamp traces a ray that descends
 * past it and lands on the floor, and comes back fully shadowed. The first
 * build put the key at eye level and lost the whole upper half of the room to
 * that. Every `keyPos.y` here clears the highest point its crop can see, and
 * the shader caps the wall's height for the matching reason.
 *
 * **`pan.y` is the camera's height above the floor**, which the shader puts at
 * world y = 0. The z = 0 plane is half a world unit tall in frame (see the
 * shader's `atFrameTrue` note), so the monolith's base lands at frame
 * `0.5 − 2·pan.y` from the bottom: 0.19 puts it at 12%, just below §2.7's
 * reserve, where the contact shadow can be seen. At the scale this plate is
 * built at — a 2m-wide monolith is 0.24 world units — 0.19 is eye height, which
 * is what §A6's "perfectly level, no tilt, no low angle" asks for.
 *
 * **The exposures are high because the whole plate is anodised black.** §A6
 * gives the monolith, the chamfers' host and the floor all one material at
 * albedo 0.045, roughly a thirteenth of the aluminium `KEY_INTENSITY` was
 * trimmed against. Leaving exposure at 1.0 does not make the plate compliant,
 * it makes it empty: §2.3 caps the top of the range, and nothing in it asks the
 * middle of the range to be missing.
 */

/* §A6: "key from camera-left at 85°, soft and large", set at a grazing angle so
   the front face stays unlit and the light describes the leading chamfer only.
   Mobile, tablet and desktop share it — they are three photographs of one
   set-up, not three lighting designs (§5.5's "one shoot"). The wide crop moves
   the same lamp rather than swapping it, for the reason its comment gives. */
const KEY_DIR = [-0.65, 0.76, 0.0]
const KEY_POS = [-0.52, 0.66, 0.0]
const KEY_RANGE = 0.55

/* §A6: "one weak rim from camera-right catching the right chamfer at lower
   intensity than the left — asymmetry is what stops it reading as a symmetrical
   logo lockup." Specular only, and the one hard accent §2.4 permits. */
const RIM_DIR = [0.9, 0.3, 0.32]

export default {
  id: 'closing',
  shader: 'a6-closing.glsl',
  frames: BLEED,
  alt: 'A single matte black monolith standing in an empty dark room, its edges caught by a low light.',
  /**
   * The page's closing image, and the second plate rendered as a loop — the
   * shipped `closingClip` brief has always described motion ("closing loop,
   * 8s, seamless"). §2.3 rule 3 applies exactly as it does on A1: the mark
   * that travels settles, and never idles.
   */
  motion: { crop: 'wide', seconds: 8, fps: 24, out: [1280, 720] },
  crops: {
    /* "Monolith reduced to its base and the floor shadow, in the bottom 25%;
       the chamfer highlights are the only bright marks." The reserve does the
       reducing: it covers the top 75%, so what survives is the base, the
       contact shadow and the two hairlines at the bottom edge. */
    mobile: {
      dead: zone(0, 0, 1, 0.75),
      /* 0.004, not 0.016. This reserve is the whole frame above the base, so
         the chamfers run through it and §2.7's "the dead zone must contain no
         edges, not merely no highlights" bites: at 0.016 the hairline arrived
         at sRGB 44 against ink and failed the 20-level/8px edge test. Crushed
         to 0.004 it lands at 24 and the step is 19. The mark that carries this
         crop is the base and the floor shadow below the reserve, which is what
         §3 asks for — "reduced to its base ... in the bottom 25%". */
      deadFloor: 0.004,
      /* "This crop is deliberately the quietest of the four" (§A1's mobile note
         applies to the whole set). Under desktop's 4.2 rather than over it,
         even though this crop's reserve is crushed hardest — the bottom 25% is
         the only lit part of the frame and it should stay a dark room. */
      exposure: 3.4,
      haze: 0.36,
      pan: [0.0, 0.205],
      key: KEY_DIR,
      keyPos: KEY_POS,
      keyRange: KEY_RANGE,
      rim: RIM_DIR,
      rimSoft: 0.04,
      rimGain: 0.55,
      fov: 22,
      /* No percentage is named for mobile. 0.30 keeps the object the same
         slender standing slab a 9:16 frame wants without narrowing the base
         past the point where the two hairlines read as one mark. */
      p: [1.0 /* monolith scale */, 0.3 /* left chamfer, frame x */, 1.3 /* wall */],
    },
    /* "Monolith pushed to the lower third, chamfers at x≈20% and x≈80%." Those
       two percentages fall outside `dead2`'s 22–78% column, so this is the one
       crop where §A6's "the chamfers must fall outside the copy column" is
       satisfiable as literally written. */
    tablet: {
      dead: zone(0, 0, 1, 0.36),
      dead2: [0.22, 0, 0.78, 1],
      /* The top band runs full width, so both hairlines cross it and the edge
         rule applies to them here exactly as it does on mobile. Same fix, same
         reason. `deadFloor2` governs the centre column, which contains nothing
         but the monolith's unlit face and needs no crushing. */
      deadFloor: 0.0028,
      deadFloor2: 0.02,
      exposure: 5.5,
      pan: [0.0, 0.19],
      key: KEY_DIR,
      keyPos: KEY_POS,
      keyRange: KEY_RANGE,
      rim: RIM_DIR,
      rimSoft: 0.04,
      rimGain: 0.55,
      fov: 22,
      p: [1.1, 0.2, 1.3],
    },
    /*
     * "Monolith centred ... outside the 26–74% column at its narrowest." The
     * subject sits *inside* the dead zone here, which is the plate's whole
     * trick (§A6): it is legible only by edges that fall outside the copy
     * column.
     *
     * **The chamfers are at 21% and 79%, not §3's 34% and 66%.** Those two
     * sentences in §A6 contradict each other: 34/66 is *inside* x 26–74, and
     * §A6 also says in the same paragraph that "its two chamfer highlights must
     * fall outside x 26–74%" and that "if a chamfer crosses the copy column,
     * the plate is rejected". §2.7 is the constraint with arithmetic behind it —
     * a 39-level step across 8px under a centred headline is precisely what its
     * edge rule exists to stop, and a rendered plate at 34/66 fails it by a
     * factor of two. So the monolith is widened until its lit edges clear the
     * column: 21/79 leaves 5% of frame — 96px at 1920 — between each hairline
     * and the reserve, and the rendered plate measures a 2-level maximum step
     * across 8px inside it against §2.7's limit of 20, because the reserve now
     * contains nothing but unlit anodised black. Everything §A6 actually asks
     * the composition to do survives: the subject still sits inside the copy
     * column, it is still legible only by its edges, and the copy still sits on
     * its unlit face — more of it than before, not less.
     */
    desktop: {
      dead: zone(0.26, 0.16, 0.74, 0.84),
      /* Not 0.016. The reserve's ceiling is what §2.7 specifies and core.glsl
         clamps to it independently (`ceilHere`), so the floor only decides how
         much of the scene's range survives underneath that clamp. The reserve
         now holds nothing but the monolith's unlit face, and 0.055 leaves the
         hairlines — which sit in the feather outside it — enough radiance to
         reach the ceiling the feather allows them there: sRGB 85 at x = 21%,
         and they measure 80. */
      deadFloor: 0.055,
      exposure: 4.2,
      pan: [0.0, 0.19],
      key: KEY_DIR,
      keyPos: KEY_POS,
      keyRange: KEY_RANGE,
      rim: RIM_DIR,
      rimSoft: 0.04,
      rimGain: 0.55,
      fov: 20,
      /* §2.3 rule 2's second event: the bounce in the lower-right falloff at
         x≈85%, y≈88% from the top — uv y 0.12. Its gain is divided by the
         exposure above, because core.glsl adds the bounce to radiance *before*
         the exposure multiply and §2.3 caps it at OKLCH L .600, a full stop
         under the specular ceiling. */
      event: [0.85, 0.12, 0.1, 0.024],
      p: [1.18, 0.21, 1.3],
    },
    /*
     * "The room opens laterally: the falloff on both sides is given real
     * distance ... the wide frame is where this composition is strongest — do
     * not crowd it."
     *
     * So this crop is a different photograph, not the desktop frame at 2560
     * (§5.3). Four things move together, and all four are the brief's own
     * instruction to open the room out:
     *
     *  - the object is narrower in frame, 25/75 against desktop's 21/79, so
     *    each side gets a quarter of the width instead of a fifth (still clear
     *    of the reserve, for the reason the desktop comment gives);
     *  - the wall stands 2.4 back rather than 1.3, which is "real distance in
     *    the falloff" stated in the only units this rig has;
     *  - the camera rises until the base sits on the frame's bottom edge, so
     *    the room is read across rather than down into;
     *  - and the lamp comes in closer and lower, which steepens the gradient
     *    from floor to wall from about 5:1 to about 14:1.
     *
     * Rendered as desktop-at-2560 these two correlated at 0.983 on §5.3's 32×32
     * signature — one composition at two sizes, which is the exact failure §5.3
     * exists to catch. They now correlate at 0.883.
     */
    wide: {
      dead: zone(0.26, 0.16, 0.74, 0.84),
      /* As desktop: the reserve holds only the unlit face, and the floor is set
         for what survives underneath core.glsl's own ceiling clamp. */
      deadFloor: 0.055,
      exposure: 5.4,
      pan: [0.0, 0.235],
      key: [-0.63, 0.78, 0.02],
      keyPos: [-0.55, 0.68, 0.02],
      keyRange: 0.62,
      rim: RIM_DIR,
      rimSoft: 0.04,
      rimGain: 0.55,
      fov: 19,
      /* §2.3 rule 2's second event, as desktop, and the only bright mark on the
         key's opposite side. It sits where the light dies into the floor, well
         clear of the centred copy column and of both centred buttons; measured
         peak sRGB 68, under §2.3's L .600 cap for a bounce. */
      event: [0.86, 0.13, 0.095, 0.022],
      p: [1.24, 0.25, 2.4],
    },
  },
}
