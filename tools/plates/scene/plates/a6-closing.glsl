/*
 * A6 — Final CTA. docs/art-direction.md §3.
 *
 * "A single matte black monolith standing in an empty dark room, centred but
 * not symmetrical: it stands at roughly x=50% and the light comes from one
 * side, so its two visible faces are lit unequally. Its top is cropped by the
 * frame. Two machined aluminium chamfers run down its leading vertical edge,
 * catching `chrome`. The floor is implied by a shadow, not drawn by a line. The
 * centre of the frame — the object's own body — is the darkest region in the
 * image."
 *
 * The inversion is the whole plate, and it is why this one is a single number
 * away from being a black rectangle. The subject sits *inside* §2.7's copy
 * reserve — `zone(0.26, 0.16, 0.74, 0.84)` on desktop and wide — so core.glsl
 * attenuates its radiance to `deadFloor` and caps it at sRGB 54. Everything the
 * plate has left to be legible with is:
 *
 *  1. the two chamfer hairlines, which fall just *outside* that reserve and so
 *     reach the ceiling its feather allows rather than the sRGB 54 inside it —
 *     see closing.mjs's desktop crop for why they are not at §3's stated 34%
 *     and 66%, which are inside the column §A6 says they must clear — and
 *  2. the room *outside* the reserve — a lit cove on the key side, the cast
 *     shadow leaving the monolith's base, and the bounce §2.3 rule 2 permits in
 *     the lower-right falloff.
 *
 * So the monolith is not lit and does not need to be: it reads as a silhouette
 * cut out of a room that is lit. §2.3's ceiling constrains the top of the
 * range, not the middle of it, and a plate whose room sits at ink is not
 * complying with anything — it is just empty.
 *
 * Parameters (`uP`):
 *   0 — monolith scale. Its height and depth, in frame-height units; 1.0 on
 *       mobile through 1.24 on wide, the range §3's crop table implies when it
 *       moves the object from "reduced to its base" to "held at the same height
 *       but the room opens laterally".
 *   1 — frame x of the **left** chamfer. The right one mirrors it about 50%.
 *       This is the composition, stated the way §3 states it, and it is a
 *       parameter rather than a constant because the four crops want four
 *       different percentages: 0.30 mobile, 0.20 tablet, 0.21 desktop, 0.25
 *       wide. The monolith's width is derived from it, never the other way
 *       round — on desktop and wide it is what makes the object wide enough for
 *       its lit edges to clear §2.7's copy column.
 *   2 — how far back the room's wall stands, in frame-height units. Per-crop
 *       because §A6's wide frame asks for a room that "opens laterally: the
 *       falloff on both sides is given real distance", and in a rig whose only
 *       falloff is inverse-square, distance to the wall *is* the depth of the
 *       room. It is also part of what stops the wide crop being the desktop
 *       crop at 2560 (§5.3).
 */

const int ID_ROOM = 1;
const int ID_MONO = 2;

/*
 * Frame percentage to world x, measured rather than assumed.
 *
 * `atFrame()` maps a frame fraction onto the z = 0 plane on the stated
 * assumption that that plane is exactly one world unit tall. It is half that:
 * `solveCamera` puts the camera at `0.5 / tan(fov/2)` while core.glsl builds
 * its ray with `focal = 1 / tan(fov/2)` against an ndc that spans ±0.5, so the
 * effective half-angle is `atan(0.5·tan(fov/2))` and the plane comes out 0.5
 * units tall. A point placed through `atFrame()` therefore lands at twice its
 * intended offset from frame centre — an edge asked for at 34% renders at 18%.
 *
 * Halving the offset first is the correction, and it is exact only at z = 0,
 * which is why the monolith's front face — the face the chamfers belong to —
 * is pinned to that plane on every crop. Verified by measurement, not algebra —
 * sampling the rendered masters column by column, the hairlines land at:
 *
 *     mobile   31.4% / 70.0%   (asked for 30 / 70)
 *     tablet   20.0% / 79.8%   (asked for 20 / 80)
 *     desktop  21.0% / 78.8%   (asked for 21 / 79)
 *     wide     25.0% / 74.9%   (asked for 25 / 75)
 *
 * The residual few tenths of a percent are the specular sitting a little inside
 * the silhouette, which is where a highlight on a rounded edge belongs.
 */
vec2 atFrameTrue(vec2 f) {
  return atFrame(mix(vec2(0.5), f, 0.5));
}

/*
 * The room, as a studio cove: an infinite floor at y = 0 and a back wall at
 * z = −uP[2], joined by a smooth-minimum fillet.
 *
 * The fillet is the point. A floor and a wall meet in a line, and §A6 is
 * explicit that "the floor is implied by a shadow, not drawn by a line" — so
 * the junction is the cove every cyclorama has, and this plate contains no
 * horizon because the room contains none. Both surfaces cover the frame, so
 * every ray inside it terminates on something: the blacks in this plate are
 * falloff, not absence, which is the distinction §2.4's volumetrics note is
 * really about.
 *
 * Two shapes here are dictated by `softShadow` rather than by the brief, and
 * both cost a build to find.
 *
 * **The room is open — no ceiling, no side walls.** `softShadow` marches until
 * it hits something or passes t = 9, so inside a closed box every shadow ray
 * eventually finds the ceiling and returns 0. The first build of this plate was
 * a closed room and it graded to solid ink.
 *
 * **The wall is capped at ROOM_WALL_TOP.** Same cause, subtler effect: a shadow
 * ray from the near floor travels up *and back*, and against an unbounded wall
 * it lands on it a couple of units later — the shadow trace has no notion of
 * the light's distance, so it reports occlusion by a wall that is well behind
 * the lamp. That put a hard horizontal terminator across the floor. The cap is
 * at y = 1.5, roughly three times the highest point any crop can see, so it is
 * never in frame; it exists purely so those rays clear it.
 *
 * The consequence for the lighting is a constraint, not a preference, and it is
 * written down in closing.mjs: the lamp has to sit above everything the frame
 * can see, or that surface trades a real shadow for a false one.
 */
const float ROOM_WALL_TOP = 1.5;
const float ROOM_COVE = 0.55;

float sdCove(vec3 p) {
  float floorD = p.y;
  float wallD = max(p.z + max(uP[2], 0.6), p.y - ROOM_WALL_TOP);
  float h = clamp(0.5 + 0.5 * (wallD - floorD) / ROOM_COVE, 0.0, 1.0);
  return mix(wallD, floorD, h) - ROOM_COVE * h * (1.0 - h);
}

Hit mapScene(vec3 p) {
  /*
   * The loop, when the wide crop renders as motion.
   *
   * §2.3 rule 3, and it binds harder here than on A1: this plate sits under the
   * page's last primary action, and that button idles perpetually and speeds up
   * under the pointer. So the monolith settles 50mm away from camera and yaws by
   * half a degree, and that is the whole of it. Measured on the rendered loop,
   * the left hairline travels from 25.0% of frame to 25.7% and back — thirteen
   * pixels at 1920, over four seconds — while its value eases from 56 to 52.
   * That is the same order as A1's 12mm drift and far below the threshold where
   * anything reads as moving; what the eye gets is the light on the edge
   * settling, not the edge going anywhere.
   *
   * It is deliberately *not* the creep A1 uses. There the highlight travels
   * along a chamfer that runs most of the frame; here the rounded edge is 27
   * pixels of arc at 2560, so a rotation large enough to walk the specular
   * across it visibly would be large enough to swing the silhouette off the
   * frame percentages the whole plate is built on. A mark that cannot creep
   * without breaking the composition should modulate instead of travel.
   *
   * Nothing crosses the frame, and it comes to rest: frames 48 and 144 are
   * bit-identical, which is `loopSettle()`'s hold. The seam is seamless in the
   * only sense that matters — f0191→f0000 differs by exactly as many pixels as
   * f0000→f0001 (0.003% of frame, on the hairline's sub-pixel edge), so the
   * wrap is indistinguishable from any other frame step (§4.2).
   */
  float settle = loopSettle();

  float room = sdCove(p);

  /*
   * Half-width straight off the crop's named chamfer percentage. Nothing else
   * in the plate is allowed to set it: if this number is wrong the frame is a
   * black rectangle, and every other dimension is derived from it so the object
   * stays proportionate when the percentage changes between crops.
   */
  float halfWidth = -atFrameTrue(vec2(uP[1], 0.5)).x;
  float halfDepth = halfWidth * 1.25;
  /* Tall enough to leave frame on every crop — §A6: "its top is cropped by the
     frame". A monolith with a visible top is a plinth. */
  float height = 0.62 * uP[0];

  /*
   * Standing on the floor at y = 0, front face on z = 0. Both are load-bearing:
   * the floor plane is where the cast shadow starts, and the front face is the
   * plane `atFrameTrue` is exact on.
   */
  vec3 q = p - vec3(0.0, height * 0.5, -halfDepth - settle * 0.050);
  q = rotY(settle * 0.0090) * q;

  /*
   * The chamfer radius is the most load-bearing number after the width — §2.5
   * calls the machined chamfer "a bright hair line that describes a form's
   * geometry without lighting its face", and it stops being a hairline the
   * moment this widens. At 0.0055 × scale it is a shade under 1% of frame width
   * on every crop, of which the specular occupies roughly a third.
   */
  float mono = sdRoundBox(q, vec3(halfWidth, height * 0.5, halfDepth), 0.0055 * uP[0]);

  return closer(Hit(room, ID_ROOM), Hit(mono, ID_MONO));
}

Material materialFor(int id, vec3 p, vec3 n) {
  /* §A6 materials: "anodised matte black monolith, aluminium chamfers,
     anodised floor". The room and the subject are the same material, so only
     the light separates them — the same instruction §A5 gets, and the reason
     the falloff has to do real work. */
  Material m = matAnodisedBlack();
  if (id == ID_ROOM) {
    /*
     * The room is rougher than the object made of the same anodising. It has to
     * be: the floor is seen at a grazing angle across the whole bottom of the
     * frame, and at that incidence even a 0.52 lobe returns a Fresnel-lifted
     * sheen that renders as a hard horizontal band — a floor "drawn by a line",
     * which is the one thing §A6 says the floor must not be. Widening the lobe
     * spreads that band over the full depth of the room, where it becomes the
     * falloff it should have been.
     */
    m.rough = 0.82;
    return m;
  }

  /*
   * The chamfer, keyed on how far the normal has turned off the front face.
   * The front face is at |n.z| ≈ 1 and the rounded vertical edges swing away
   * from it fast, so one smoothstep separates the aluminium from the anodising
   * without a second SDF — a1-hero does the same thing for the same reason.
   */
  float edge = 1.0 - smoothstep(0.30, 0.86, abs(n.z));

  /*
   * Bead-blasted rather than brushed, deliberately. §2.5 fixes the grain
   * direction — "run it across the frame, not up it" — and an anisotropic lobe
   * stretched along world x smears a *vertical* hairline sideways into a lit
   * band, which is the failure the chamfer radius is chosen to avoid. Running
   * the grain up the edge instead would keep the hairline crisp and would be an
   * ascending line at texture scale. So: isotropic, and tight.
   */
  m.albedo = mix(m.albedo, 0.58, edge);
  m.rough = mix(m.rough, 0.08, edge);
  m.metal = edge;
  return m;
}
