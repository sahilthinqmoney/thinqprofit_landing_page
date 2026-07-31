/*
 * A9 — Gate. docs/art-direction.md §3, backing the section headed
 * "Every sentence is gated."
 *
 * "Two heavy machined aluminium jaws face each other with a narrow slot between
 * them. A third form — a blade — crosses that slot, part way, held at rest. Not
 * open, not shut. The light is behind the slot: the only bright mark in the
 * frame is the thin line escaping the gap the blade has not yet closed, plus
 * the machined hairlines that escaping light rakes across the two jaw mouths."
 *
 * The reading the section needs is *something is allowed through, and something
 * is stopped* — a compliance gate with no interface anywhere near it. Seven
 * constraints shape every number below, and each is a rule from the document or
 * a property of `core.glsl` rather than a preference.
 *
 * **This plate must not be A8 with the tones inverted.** A8 (terminal) is a
 * WIDE shot: one flat face filling the frame, softly graduated, with a single
 * *dark* lateral cut in it. Four plates all speaking that language would be the
 * same photograph four times. So this one is a TIGHT MECHANISM and its polarity
 * is the opposite: the field is ink, the jaw faces are barely described, and the
 * only bright marks are a *lit* slot and the two mouth hairlines either side of
 * it. Where a8's subject is a dark line on a lit plane, this one is a lit line
 * in a dark plate. At thumbnail size that is a different image, not a crop of
 * the same one.
 *
 * **The mouth is a V, and that is what stops the plate reading as a lit wall.**
 * The previous attempt gave both jaws flat faces perpendicular to the lens and
 * put the lamp in front of one of them; a lamp facing a flat plane produces a
 * disc, and the render came back as a soft glowing blob against a hard L-shaped
 * edge — a lit wall corner, not a mechanism. §2.4 is explicit that an aluminium
 * face must read "as a gradient *across* the surface rather than a hotspot in
 * the middle of it", and the fix is geometric rather than photometric: each jaw
 * carries a machined ramp descending into the slot, so every lit pixel in the
 * frame sits on a surface that is *tilted toward the opening*. The brightness
 * then decreases monotonically with distance from the slot, by construction —
 * there is no interior maximum for a blob to form at, because the flat outer
 * faces are nearly parallel to the light and take almost nothing. Remove the
 * jaws and the image does not survive: the bright band *is* the ramp.
 *
 * **The slot is a hairline, not a track.** `a8-terminal.glsl`'s header records
 * this failure in full: at a half-height of 0.018 world its channel read as a
 * *slider* — fabricated UI arriving through geometry rather than through pixels,
 * and §2.1 does not exempt geometry. The slot here is 0.008 world at the jaw
 * plane, about 2.6% of frame height on every crop, and the throat behind it is
 * `matAnodisedBlack` so what shows through the gap is a dim glow rather than a
 * blaze. Anything that makes the opening tall enough to look *filled* has
 * reintroduced the failure.
 *
 * **Two forms, one intersection, and no way to add a third.** The slot runs
 * along world X; the blade crosses it along world Y. There is no parameter here
 * that could produce a second slot or a second blade — the count is structural,
 * not a value left unset. §5.2 rejects "a repeating rhythm that resolves into
 * bars at 25% zoom", and a gate with three blades in it is a bar chart.
 *
 * **The jaws have no silhouette.** Both are sized off the frame with a 3×
 * overscan and centred on it, so no edge of either is ever in shot on any
 * aspect. §1 asks for depth built entirely from light, and a8 lost two render
 * cycles to a slab with finite width — first as a vertical terminator splitting
 * the frame, then as its far edge walking back into shot on the widest crop.
 * The aspect ratio varies by more than 3× across the four crops; a world
 * constant that clears 16:9 is three times what 9:16 needs. Every extent below
 * is derived from `frameHalf`, never from a world constant.
 *
 * **The key is a lamp, and it stands a hair in FRONT of the jaw faces even
 * though the brief says the light is behind the slot.** That is not a softening
 * of the brief; it is the only way `core.glsl` can render it. `softShadow`
 * marches to t = 9 regardless of how far the lamp actually is, so any geometry
 * on the *far* side of the light still occludes: a lamp placed inside the slot
 * would have every ray to it continue past it into the opposite jaw and return
 * zero, and the whole frame would go black. With the lamp in free space in front
 * of the mouth, every shadow ray that clears the surface it started on carries
 * on forward into nothing — the only thing left that can cast is the blade,
 * which is exactly the one shadow this composition wants. The photographic read
 * survives intact because the lamp sits *on the slot's centre line*, below the
 * upper ramp and above the lower one: both ramps are lit from the opening, the
 * throat behind the slot is lit through it, and the flat faces (normal +z, lamp
 * ~0.01 world off their own plane) are grazed at a few degrees and stay in ink.
 * §2.4's "70°–85° off the lens axis" is measured, not asserted: at working
 * distance the lamp is 84°–88° off axis.
 *
 * **Nothing ascends.** The slot is a level line along world X and the blade is a
 * level plate along world Y; neither takes an angle from any parameter (§2.1).
 * The blade enters from the top and comes to rest with its edge in the opening,
 * so what movement the frame implies is a descent that has already stopped —
 * §2.1's "downward-settling", which is the permitted direction. The plate's
 * dominant line is the slot, and it is lateral.
 *
 * Parameters (`uP`):
 *   0 — jaw plane, world z. Negative is further from camera.
 *   1 — slot axis, frame y.
 *   2 — slot half-height, world.
 *   3 — jaw half-depth, world z.
 *   4 — upper jaw's ramp width, world y.
 *   5 — upper jaw's ramp drop, world z (width : drop is the rake angle).
 *   6 — lower jaw's ramp width, world y.
 *   7 — lower jaw's ramp drop, world z.
 *   8 — machined radius left on the break and mouth edges — the hairline width.
 *   9 — how far the upper jaw stands proud of the lower, world z.
 *  10 — blade's leading edge, frame x.
 *  11 — blade width, world.
 *  12 — blade seat: the fraction of the slot still open beneath its edge.
 *  13 — blade stand-off in front of the upper jaw face, world z.
 *  14 — blade half-thickness, world z.
 *  15 — blade edge radius, world.
 *  16 — throat set-back behind the jaws' back face, world z.
 */

const int ID_JAW = 1;
const int ID_BLADE = 2;
const int ID_THROAT = 3;

/**
 * One frame height is **half** a world unit, not one.
 *
 * core.glsl's `atFrame` documents the z = 0 plane as one world unit tall and it
 * is not — `solveCamera` puts the camera at `0.5 / tan(fov/2)` against a focal
 * of `1 / tan(fov/2)`, so a ray reaches z = 0 at s = 0.5 and the visible plane
 * spans ±0.25. The discrepancy is documented at length on `atFrame` and
 * deliberately left unfixed there, because correcting it rescales every shipped
 * plate at once. This plate names the factor rather than folding it into its
 * numbers, the way `a5-onboarding.glsl` and `a8-terminal.glsl` do — the
 * composition is stated in frame percentages and it has to mean them.
 */
const float FRAME_H = 0.5;

/**
 * World units per unit of frame height, at depth z. Plain similar triangles:
 * `uCamPos.z` is the camera's distance to the z = 0 plane, so a form at z sits
 * `1 − z/uCamPos.z` further away and covers that much more world per pixel.
 *
 * This is what lets the gate be pushed back for hairline scale without every
 * composition number in the section file moving with it: §2.5 holds the
 * machined edge to a hairline, and a fixed world radius read at the z = 0 plane
 * would be a roundover you could see the shape of rather than a line.
 */
float frameScale(float z) {
  return FRAME_H * (1.0 - z / uCamPos.z);
}

/** Frame fraction (origin bottom-left, as §2.7 states dead zones) to world. */
vec3 atPlate(vec2 f, float z) {
  return vec3(uCamPos.xy + atFrame(f) * frameScale(z), z);
}

/**
 * Half the frame in world units at depth z, with a 3× overscan.
 *
 * `frameScale` returns one *full* frame height, so `vec2(h * uAspect, h)` is
 * already twice the half-extent; the extra 1.5 takes the overscan to 3×. Enough
 * that no depth offset or lens change in any future crop can bring a jaw edge
 * back into shot — the failure a8 hit twice, which no gate in §5.3 or §5.4 can
 * see.
 */
vec2 frameHalf(float z) {
  float h = frameScale(z);
  return vec2(h * uAspect, h) * 1.5;
}

/**
 * Smooth intersection — iq's smax, with `k` as the machined radius left on the
 * edge.
 *
 * Used rather than `max(a, b)` for the same reason a8 uses `opSmoothSub`: a real
 * ramp cut into a plate leaves a roundover where the cutter's corner ran, and
 * that roundover *is* the specular hairline §2.5 calls "the single most useful
 * mark in the whole vocabulary". A hard boolean gives a mathematically sharp
 * corner, which the marcher resolves as a one-pixel bright artefact that moves
 * with the sampling grid — thin and bright is not the same thing as a machined
 * edge, and it fails §2.7's 20-level-per-8px step test as aliasing rather than
 * as composition.
 *
 * One `k` serves both edges of each ramp deliberately: the break where the ramp
 * leaves the flat face, and the mouth where it turns down into the slot wall are
 * the same tool leaving the same radius, and giving them different values would
 * be modelling two parts rather than one machined jaw.
 */
float opSmoothIntersect(float a, float b, float k) {
  float h = clamp(0.5 - 0.5 * (a - b) / k, 0.0, 1.0);
  return mix(a, b, h) + k * h * (1.0 - h);
}

Hit mapScene(vec3 p) {
  float z = uP[0];
  float halfDepth = uP[3];
  float slotHalf = uP[2];
  float stepZ = uP[9];
  vec2 ext = frameHalf(z);

  /* The slot's centre line. Only its y is used — the slot runs the full width
     of the (overscanned) jaws, so it has no end in frame on either side and
     cannot terminate at a cap the way a8's channel does. What extinguishes it
     toward the reserve is the lamp's falloff, the blade's shadow and the
     reserve's own feather, which is §2.7's "the falloff into the dead zone is
     gradual" and its "no edges in the reserve" satisfied by one mechanism
     rather than three. */
  vec3 axis = atPlate(vec2(0.5, uP[1]), z);
  float faceZ = z + halfDepth;

  /*
   * The lower jaw. A box whose top face lands exactly on the slot's lower lip
   * and whose every other face is off-frame, intersected with a plane that
   * rakes the last `uP[6]` of it down into the opening by `uP[7]`.
   *
   * The plane's outward normal is (0, drop, width) normalised — perpendicular
   * to the ramp's own direction (0, width, −drop) by construction, so the rake
   * angle is stated as a rise over a run rather than as an angle nobody can
   * check against a drawing.
   */
  float loMouth = axis.y - slotHalf;
  float lo = sdBox(p - vec3(axis.x, loMouth - ext.y, z), vec3(ext.x, ext.y, halfDepth));
  lo = opSmoothIntersect(
    lo,
    dot(p - vec3(axis.x, loMouth - uP[6], faceZ), normalize(vec3(0.0, uP[7], uP[6]))),
    uP[8]
  );

  /*
   * The upper jaw, standing `uP[9]` proud of the lower one and raked by a
   * different amount over a different width.
   *
   * The step and the asymmetry are the whole reason this reads as *two* jaws
   * rather than as one plate with a groove milled in it. A symmetric mouth is a
   * moulding; two parts that do not match are a mechanism, and the section's
   * claim — one thing passes, another is stopped — needs the frame to contain
   * parts. It is also §2.4's asymmetry rule arriving through geometry: the two
   * ramps present different angles to the same lamp, so one carries the band
   * and the other carries only its mouth hairline, which is what stops the
   * composition mirroring about the slot.
   */
  float hiMouth = axis.y + slotHalf;
  float hiFace = faceZ + stepZ;
  float hi = sdBox(p - vec3(axis.x, hiMouth + ext.y, z + stepZ), vec3(ext.x, ext.y, halfDepth));
  hi = opSmoothIntersect(
    hi,
    dot(p - vec3(axis.x, hiMouth + uP[4], hiFace), normalize(vec3(0.0, -uP[5], uP[4]))),
    uP[8]
  );

  Hit hit = Hit(min(lo, hi), ID_JAW);

  /*
   * The throat — the passage behind the slot, and what the light actually
   * escapes off. It is not decoration and it is not a third form: without it a
   * ray through the opening returns nothing, and "nothing" is a hole punched
   * through the plate onto the page. §5.4 wants the black point reached inside
   * the frame, which is a graded surface, not a region that never had one.
   *
   * It is anodised black and set back far enough that only the strip directly
   * behind the opening catches the lamp. That strip, hard-bounded above and
   * below by the two lips, is the "thin line of light escaping the gap" — and
   * it is bounded by geometry rather than by falloff, which is the difference
   * between a line and a smudge.
   */
  float throatZ = z - halfDepth - uP[16];
  vec2 throatExt = frameHalf(throatZ);
  float throat = sdBox(p - vec3(axis.x, axis.y, throatZ - 0.3), vec3(throatExt, 0.3));
  hit = closer(hit, Hit(throat, ID_THROAT));

  /*
   * The blade, standing proud of the upper jaw's face and caught part-way down
   * across the opening.
   *
   * Anchored by its **leading edge in frame x** and given its width in *world*
   * units — the same split a8 makes between where a form sits (frame) and how
   * big it is (world). Anchoring both ends in frame would make the blade a
   * different object on every crop; placing it wholly in world would let it
   * drift out of the composition when the aspect changes by 3×.
   *
   * Its foot sits `uP[12]` of the slot's height up from the lower lip: 0 would
   * be shut, 1 would be clear of the opening. It is neither, and it does not
   * move between crops — one blade, at one position, photographed four times.
   * The residual opening beneath it is the gap the section's copy turns on;
   * the blade's own body is what halts the line of light where it crosses.
   *
   * It runs off the top of frame rather than ending in a visible top edge,
   * because a blade with a finite top is a rectangle floating on a face, and a
   * rectangle floating on a face is a panel (§2.1).
   */
  float bladeZ = hiFace + uP[13] + uP[14];
  float leading = atPlate(vec2(uP[10], 0.5), bladeZ).x;
  float bladeHalfW = 0.5 * uP[11];
  float bladeFoot = axis.y - slotHalf + uP[12] * 2.0 * slotHalf;
  float bladeHalfH = frameHalf(bladeZ).y;
  float blade = sdRoundBox(
    p - vec3(leading + bladeHalfW, bladeFoot + bladeHalfH, bladeZ),
    vec3(bladeHalfW, bladeHalfH, uP[14]),
    uP[15]
  );

  return closer(hit, Hit(blade, ID_BLADE));
}

Material materialFor(int id, vec3 p, vec3 n) {
  if (id == ID_BLADE) {
    /*
     * §2.5's structural material. The blade is the one form in frame that is
     * *not* aluminium, and that is what makes it read as a separate part caught
     * across the opening rather than as a raised boss on the same casting. It is
     * legible by its silhouette against the lit mouth and by the shadow it
     * throws along the slot, and by nothing else — anodised black is `metal` 0
     * at albedo .045, so it takes almost no highlight of its own even standing
     * proud of the face and nearest the lamp. §2.3's ceiling is never the
     * binding constraint on it; the composition is.
     */
    return matAnodisedBlack();
  }

  if (id == ID_THROAT) {
    /*
     * The same anodised black, rougher. The throat is seen only through an
     * opening about 2.6% of frame height tall, and at the stock 0.52 the light
     * that does reach it comes back as a sheet of sheen filling the gap — a lit
     * slot, which reads as a backlit panel rather than as a passage. 0.80
     * spreads that energy into a dim glow and leaves the two mouth hairlines
     * carrying the brightest marks, which is §2.4's "one key, everything else is
     * subtraction" and §2.3's reason for wanting the specular on a machined edge
     * rather than on an area.
     */
    Material m = matAnodisedBlack();
    m.rough = 0.80;
    return m;
  }

  /*
   * §2.5's "default surface for large faces": bead-blasted, matte, holds a soft
   * gradient. Isotropic on purpose. §2.5 permits a brushed grain and requires it
   * to run across the frame rather than up it — but a lateral grain running
   * parallel to a lateral slot is a second lateral line, and two parallel lines
   * is the rhythm §5.2 rejects arriving through texture instead of through
   * geometry. a8 makes the same call for the same reason.
   */
  Material m = matAluminiumBlasted();

  /*
   * Three surfaces, told apart by normal rather than by position, so the split
   * cannot drift when the slot moves between crops:
   *
   *   `face` — the flat outer faces, normal on +z. Nearly parallel to the key;
   *            they are the ink the composition sits in.
   *   `wall` — the slot's inner walls, normal on ±y. The one plane the key
   *            cannot reach at this rake.
   *   `rake` — everything else: the two ramps and the roundovers at their break
   *            and mouth edges. This is where every bright mark in the plate
   *            lives.
   */
  float face = smoothstep(0.960, 0.9992, abs(n.z));
  float wall = smoothstep(0.880, 0.9990, abs(n.y));
  float rake = clamp(1.0 - max(face, wall), 0.0, 1.0);

  /*
   * The ramp is not blasted to the same degree as the face. Its normals sweep
   * through the mirror direction within the width of the roundovers at either
   * end, so a tighter lobe there is what keeps the mouth catch a hairline
   * instead of letting it spread onto the flat face beside it.
   *
   * 0.30 rather than a8's 0.21 is the one number here tuned against a render
   * rather than derived: this plate's lamp is near-field by necessity — the
   * mouth hairline only exists if the light is close to the face plane and
   * nearly over the slot — and a tight lobe under a near-field lamp returns a
   * circular pool, which is §2.4's "hotspot in the middle of it" and the exact
   * failure of the previous attempt. 0.30 spreads the same energy along the
   * ramp instead of concentrating it at one x.
   */
  m.rough = mix(0.46, 0.30, rake);

  /*
   * The slot's inner walls are darker than the mouth around them. Not a light
   * trick — a cut into a blasted surface exposes a finer finish, and these two
   * planes are the ones the key rakes at nearly 90°. It is what gives the
   * throat's dim strip something to be brighter than, so the opening reads as a
   * passage with a light behind it rather than as a groove.
   */
  m.albedo = mix(m.albedo, m.albedo * 0.50, wall);

  return m;
}
