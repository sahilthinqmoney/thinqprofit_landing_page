/*
 * A2 — Products, featured card: Stocks & ETFs. docs/art-direction.md §3.
 *
 * "Twelve to sixteen thin machined aluminium plates, each 2–3mm, suspended
 * parallel in dark space at slightly varying depths and rotations — a card
 * index seen at an angle. Each plate catches the key on its chamfered edge
 * only; the faces stay in shadow. The stack recedes toward the lower right.
 * The top 40% of the card is empty room above the stack."
 *
 * §A2's *intent* is what the geometry has to carry: "breadth held in one hand.
 * Many discrete things, identical in kind, ordered — a catalogue, not a crowd."
 * So this is one primitive repeated on a rule rather than fourteen authored
 * objects: identical half-extents, one shared attitude, and a low-discrepancy
 * jitter of about ±2° and ±6% laid over the top so the rhythm reads as a
 * machined tolerance rather than as a pattern. Ordered, countable, and plainly
 * the same part fourteen times — which is the difference between a catalogue and
 * a crowd, and between "every NSE and BSE listing" and "a lot going on".
 *
 * The whole plate is three marks per plate, repeated: a dark top edge band, a
 * `chrome` hairline on the chamfer under it, and a mid-grey face below that.
 * Dark / bright / mid, fourteen times, stepping down and to the right. Two
 * failure modes bracket it and both have been walked into on this plate already:
 * tilt the plates toward level and the flat edge band lands on the specular peak
 * — the mark stops being a hairline, becomes a lit face, and the frame goes from
 * ~2% of pixels above OKLCH L .600 to something like 12%, failing §2.3's 3% cap
 * by a modelling decision. Leave the faces as pure single-scatter metal and the
 * opposite happens: every face is black, the frame is ink plus one hairline, and
 * the card reads as empty (README: "will pass a beautifully lit rectangle of
 * nothing"). `materialFor` below is where the second one is fixed, and it is
 * fixed with a material rather than with exposure, because exposure would lift
 * the hairline into the ceiling at the same time.
 *
 * Parameters (`uP`):
 *   0 — plate count. 8 / 12 / 14 / 16 by crop, and a real loop bound.
 *   1 — pitch: how far the run steps back per plate.
 *   2 — lateral spread: the run's total width, in frame-height units.
 *   3 — wide crop only: the second, shallower stack entering from the right.
 */

const int ID_STACK = 1;
const int ID_SECOND = 2;

/*
 * The shared attitude, and the number the whole plate turns on.
 *
 * The plates stand up and lean back ten degrees — `TILT` is measured off level,
 * so 1.396 rad is 80°, ten degrees shy of vertical. That is the "card index seen
 * at an angle": cards stood on edge in a drawer, tipped back, seen from the
 * front, each showing the top of its face and its top edge above the card in
 * front of it.
 *
 * Why that angle and not level, in the terms §2.5 uses. The key arrives from
 * `uKeyDir` ≈ (0.85, 0.38, 0.35) and the view axis is +Z, so the half-vector
 * sits 15.8° above the view axis in the YZ plane, and a surface is at the
 * specular peak when its normal points there. At `TILT` = 80° the three surfaces
 * land at:
 *
 *   top edge band   normal at 80°  — 64° off the peak, and 64° in the *narrow*
 *                                    axis of a brushed lobe is four orders of
 *                                    magnitude down. Black. It is the separator.
 *   top chamfer     sweeps 80°→−10° — crosses the peak once, 71% along. This is
 *                                    the mark: §2.5's "bright hair line that
 *                                    describes a form's geometry without
 *                                    lighting its face", once per plate.
 *   front face      normal at −10°  — 26° off, far enough that the specular is a
 *                                    sheen rather than a highlight, near enough
 *                                    that N·L is 0.28 and the face reads.
 *
 * Bring the plates toward level and the band walks onto the peak; stand them
 * fully upright and the chamfer's arc no longer contains it and there is no
 * hairline at all. The usable window is roughly 70°–85°, which is also §2.4's
 * band for the key, and not by coincidence: both are asking the same question
 * about the same angle.
 */
const float TILT = 1.396;
const float TILT_C = cos(TILT);
const float TILT_S = sin(TILT);
/** The plates' shared face normal. `materialFor` separates surfaces against it. */
const vec3 PLATE_N = vec3(0.0, TILT_C, -TILT_S);

/**
 * Frame fraction → world, at a stated depth.
 *
 * core.glsl's `atFrame()` answers a neighbouring question and cannot be used
 * here, for three reasons that all bind on this plate:
 *
 *  1. **It ignores the pan.** A1's crops all pan (0, 0) so world and frame share
 *     an origin there. Every A2 crop pans, by a different amount, because the
 *     stack has to sit under four differently-deep reserves — so a composition
 *     written against `atFrame` lands somewhere different on each crop.
 *  2. **It ignores depth.** This stack is the one form in the set that is
 *     genuinely deep; §A2 asks for depth of field to be "the point". A plate two
 *     thirds of the way back projects both smaller *and* closer to the frame
 *     centre. Placing centres by frame fraction at their own depth is what stops
 *     the run curving back up toward the centre as it recedes — which would be
 *     §2.1's ascending line arriving through the projection rather than through
 *     the modelling, and it is invisible in the source when it happens.
 *  3. **Its units are twice the frame.** spec.mjs solves the camera distance as
 *     `0.5/tan(fov/2)` against core's `focal = 1/tan(fov/2)`, which makes the
 *     z = 0 plane half a world unit tall, not one. `atFrame(vec2(1.0, y))` is
 *     therefore 150% across the frame, not the right edge.
 *
 * So invert the camera exactly instead. `ndc = (f - 0.5) * (aspect, 1)`, and the
 * ray through it meets depth z at `cam.xy + ndc * (cam.z - z) / focal`, with
 * `focal = 2 * cam.z` by the identity above — no uniform beyond `uCamPos` is
 * needed to state it.
 */
vec3 atCrop(vec2 f, float z) {
  vec2 ndc = (f - 0.5) * vec2(uAspect, 1.0);
  return vec3(uCamPos.xy + ndc * (uCamPos.z - z) / (2.0 * uCamPos.z), z);
}

/** Perspective scale at depth z: how much of a frame a world unit covers there. */
float scaleAt(float z) {
  return uCamPos.z / (uCamPos.z - z);
}

/**
 * The highest the stack's silhouette may reach, as a frame fraction.
 *
 * §2.7's reserve is the top band, but the usable ceiling is not `uDead.y` — it is
 * where core's feather *begins*, `max(uDeadFeather, 0.12) * aspect` below it.
 * Above that line radiance is already being pulled toward the dead-zone floor,
 * and a chamfer dimmed to a fifth of itself is still a twenty-five level step
 * against ink across two pixels: §2.7's "the dead zone must contain no edges,
 * not merely no highlights", failed by a highlight that was politely attenuated
 * rather than kept out of the rectangle.
 *
 * Reading the reserve off the uniform rather than hard-coding 0.34 / 0.40 / 0.46
 * is also what keeps the four crops four compositions: mobile reserves 46% and
 * gets eight big plates in a short steep run, desktop reserves 34% and gets
 * fourteen across a long shallow one.
 */
float stackCeiling() {
  return uDead.y - max(uDeadFeather, 0.12) * uAspect - 0.012;
}

/**
 * Position along the run, eased.
 *
 * Spacing widens from 0.75× to 1.25× of mean between the far end and the near
 * one, so the plates crowd as they recede. Perspective does some of this
 * already; doing the rest in the layout is what makes fourteen plates read as a
 * receding stack at thumbnail size instead of as fourteen evenly spaced marks —
 * §5.2's "repeating vertical rhythm in a stack of plates that reads as bars".
 */
float easeAlong(float u) {
  return u * (0.75 + 0.25 * u);
}

float stackSpan() {
  return max(uP[0] - 1.0, 1.0);
}

/**
 * Depth of the run at eased position `e`. Near end just in front of z = 0, far
 * end `pitch × (count-1) × 0.42` back — about 0.9 world units on the deepest
 * crop, which at these focal lengths is a shrink to roughly three quarters over
 * the run. Enough that "many" reads as depth; flat enough to stay the 85mm §A2
 * asks for rather than becoming a corridor.
 */
float stackDepth(float e) {
  return mix(-uP[1] * stackSpan() * 0.42, 0.05, e);
}

/**
 * World → plate space.
 *
 * Component-wise rather than three `mat3` builds and two multiplies, and
 * small-angle for the jitter rather than `sin`/`cos`, because this runs once per
 * plate per march step — some thousands of times per pixel — and every jitter
 * angle is under 0.15 rad by construction, where `cos θ ≈ 1 − θ²/2` is good to
 * five decimals. The base tilt keeps its exact constants and is folded in
 * through the angle-sum identity.
 *
 * Roll and yaw are §A2's "slightly varying rotations". Yaw is the useful one: it
 * swings a plate's chamfer into or out of the key's own axis by a few degrees,
 * so each plate catches a slightly different amount of the same light. That is
 * §A2's strip box — "each plate edge picks up a discrete highlight and the
 * intervals between them read as rhythm" — produced by the geometry, because
 * §2.4 allows exactly one source and no second one to vary.
 */
vec3 toPlate(vec3 q, float roll, float dtilt, float yaw) {
  float ca = 1.0 - 0.5 * dtilt * dtilt;
  float cx = TILT_C * ca - TILT_S * dtilt;
  float sx = TILT_S * ca + TILT_C * dtilt;
  float cz = 1.0 - 0.5 * roll * roll, sz = roll;
  float cy = 1.0 - 0.5 * yaw * yaw, sy = yaw;
  q.xy = vec2(cz * q.x + sz * q.y, cz * q.y - sz * q.x);
  q.yz = vec2(cx * q.y - sx * q.z, sx * q.y + cx * q.z);
  q.xz = vec2(cy * q.x - sy * q.z, sy * q.x + cy * q.z);
  return q;
}

/**
 * One plate, bowed.
 *
 * The bow is a two-instruction crown across the plate's width, about five
 * degrees of normal from centre to end, and it is doing three jobs that no other
 * part of this file can do:
 *
 *  - **It gives the face a gradient.** §2.4 wants "a gradient across the surface
 *    rather than a hotspot in the middle of it". A directional key on a flat
 *    face gives one flat tone and nothing else (core.glsl's `uKeyRange` note
 *    makes the same point from the lighting side). A plate that is not perfectly
 *    flat has a gradient in camera, which is also what a real 2mm plate does.
 *  - **It makes the hairline live on part of the edge and die.** A dead-straight
 *    chamfer under a directional key lights uniformly end to end, which reads as
 *    a drawn line rather than as light. The crown walks the normal along the
 *    edge, so the highlight peaks somewhere along each plate and falls away —
 *    §A1's "runs a chrome hairline ... then dies", applied per plate.
 *  - **It breaks the ladder.** Fourteen dead-parallel straight lines is §5.2's
 *    "repeating vertical rhythm ... that reads as bars"; fourteen slightly
 *    crowned ones, each peaking in a different place, is a stack of parts.
 *
 * It distorts the field by a factor of at most 1.004, which the march absorbs.
 */
float plate(vec3 q, vec3 half3, float chamfer, float bow) {
  q.y += bow * (q.x * q.x - half3.x * half3.x * 0.5);
  return sdRoundBox(q, half3, chamfer);
}

Hit mapScene(vec3 p) {
  /*
   * A2 is a still on every crop (`motion: null` in sections/stocks.mjs), so
   * `loopSettle()` is not consulted. If it is ever cut as a loop, the move is
   * the stack settling *down* the run by a fraction of one pitch — lateral and
   * downward-settling per §2.1, coming to rest inside the loop per §2.3 rule 3,
   * and never a highlight travelling along an edge.
   */

  float span = stackSpan();

  /*
   * Plate dimensions. Width tracks the frame so the same 42% of it is covered on
   * a 0.60 aspect and a 1.08 one; height and thickness do not, because a plate is
   * a plate. 0.21 × 0.17 × 0.011 world — thirty-one times as wide as it is thick,
   * which is the ratio that decides whether the thing reads as a *plate* or as a
   * block. The first pass ran 0.015 thick and the plates came back as slabs: the
   * edge band and its two chamfers took a tenth of the exposed strip, so the mark
   * along the top read as a lit face rather than as §2.5's hairline.
   */
  float hw = 0.115 * uAspect;
  float hd = 0.070;
  float ht = 0.0055;
  float chamfer = 0.80 * ht;
  float reach = length(vec2(hw * 1.06, hd)) + ht;

  /*
   * The run, in frame fractions.
   *
   * Vertically it is anchored by each plate's **top edge**, not by its centre,
   * and that is the difference between a stack and a staircase. The top edge is
   * where the chamfer is, so it is the only line in the plate the eye actually
   * tracks; anchoring it means the fourteen hairlines descend on a stated rule
   * while the plates themselves are free to be as tall as they need to be and to
   * run off the bottom of the card. Anchoring centres instead lets the plate
   * height push the marks around, and the first pass did exactly that — the run
   * plunged, and everything above the near end was empty frame.
   *
   * The drop is 62% of the room under the reserve, so the far plate's top sits
   * on the ceiling and the near plate's top around a fifth of the way up. What
   * fills the rest is the plates: a third of the frame tall each, so the near end
   * is cropped by the bottom edge and the whole lower half of the card carries
   * material rather than a diagonal with a void over it.
   *
   * Laterally the run spans `uP[2]` frame-heights centred at 0.52 — 84% of the
   * width on mobile, 110% on wide — and with the plates themselves 42% wide on
   * top of that, both ends are cropped by the frame on every crop.
   *
   * 0.52 rather than 0.50: §A2 wants the desktop stack "anchored
   * bottom-centre-right" with "the bottom-left corner deliberately dark for the
   * CTA". The run descends left to right, so its left end is its *high* end and
   * the bottom-left corner is empty by construction; the 2% nudge takes the
   * lower half of the run clear of the CTA patch's feather as well as the patch.
   */
  float extent = uP[2] / uAspect;
  float fxA = 0.52 - extent * 0.5;
  float fxB = 0.52 + extent * 0.5;
  float ceiling = stackCeiling();
  float drop = 0.56 * (ceiling - 0.02);

  float best = 1e5;

  for (int i = 0; i < 16; i++) {
    /* §A2's plate count is a real bound, not a maximum: 8 / 12 / 14 / 16. */
    if (float(i) >= uP[0]) break;

    float fi = float(i);
    float e = easeAlong(fi / span);

    /*
     * Three decorrelated low-discrepancy sequences, from the fractional parts of
     * three irrationals. An order of magnitude cheaper than `hash21` and — the
     * reason it is worth caring — *evenly spread* rather than random, so sixteen
     * plates get sixteen visibly different tolerances instead of a clump and a
     * gap. Machined parts vary within a band. They are not noisy.
     */
    float r1 = fract(fi * 0.7548777);
    float r2 = fract(fi * 0.5698403);
    float r3 = fract(fi * 0.3819660);

    /* "at slightly varying depths" — a third of a pitch, either way. */
    float z = stackDepth(e) + (r1 - 0.5) * uP[1] * 0.30;

    /*
     * Index 0 is the *far* plate and sits highest; the last is nearest and
     * lowest. That is the reverse of the depth order §A2's "recedes toward the
     * lower right" first suggests, and it is deliberate. The frame diagonal is
     * identical either way — upper-left to lower-right, descending in reading
     * order, which is what §2.1 is actually about — but the occlusion is not.
     * Nearer-and-lower means each plate is overlapped from below, so what
     * survives of it is its *top* edge, which is the edge the chamfer and the
     * key are on. Nearer-and-higher buries exactly that edge and leaves fourteen
     * dark undersides.
     */
    vec3 centre = atCrop(
      vec2(mix(fxA, fxB, e), ceiling - drop * e - 2.0 * hd * TILT_S * scaleAt(z)),
      z
    );

    /*
     * Bounding-sphere reject. A plate's true distance is never less than this,
     * so skipping when it already exceeds the running minimum cannot change the
     * result — and it takes the common case from sixteen rounded boxes per march
     * step to two or three. This renders at 2× supersample up to 1700×1580;
     * without it the plate is minutes a crop rather than seconds.
     */
    if (length(p - centre) - reach > best) continue;

    vec3 q = toPlate(
      p - centre,
      (r2 - 0.5) * 0.048,        /* roll: ±1.4°, so the edges are not parallel */
      (r1 - 0.5) * 0.055,        /* tilt: ±1.6° about the shared 80° */
      (r3 - 0.5) * 0.240         /* yaw:  ±7°, the strip box's rhythm */
    );

    /* §2.5's machined chamfer at 80% of the half-thickness: a real cut with a
       flat band left between the two arcs, not a bullnose. Widening it widens
       the lit portion of the arc with it — the highlight stops describing the
       edge and starts lighting it. */
    best = min(best, plate(q, vec3(hw * (0.94 + 0.12 * r2), ht, hd), chamfer, 0.42));
  }

  Hit hit = Hit(best, ID_STACK);

  if (uP[3] > 0.5) {
    /*
     * Wide crop only: "a second, shallower stack entering from the right edge to
     * fill the extra width. Bottom-left stays clear."
     *
     * Shallower in both senses — five plates against sixteen, and a twelfth of
     * the frame of descent against a third of it. It sits about a world unit
     * behind the main run's far end, which is the number that decides whether it
     * reads as *distance* or as a second row of the same thing: at z ≈ −1.95 the
     * perspective brings it in at 54% of the near plates' size, and the depth
     * falloff and defocus in `materialFor` take it to roughly 40% of their
     * reflectance and to the roughness clamp. Placed one crop-tuning pass closer
     * than this it came back the same size and value as its neighbours and read
     * as a fault in the main run rather than as something behind it.
     *
     * That is §5.3's test for a wide crop: the extra frame has to be room or a
     * second form, never a scaled subject or stretched emptiness.
     */
    float second = 1e5;

    for (int i = 0; i < 6; i++) {
      if (i >= 5) break;

      float fi = float(i);
      float u = fi / 4.0;
      float r1 = fract(fi * 0.7548777);
      float r2 = fract(fi * 0.5698403);

      float z = mix(-1.95, -1.65, u) + (r1 - 0.5) * 0.09;
      /* Tops anchored, as in the main run, so the two stacks descend on the same
         rule and the second one reads as parallel rather than as tipped. */
      vec3 centre = atCrop(
        vec2(mix(0.84, 1.32, u), mix(0.44, 0.36, u) - 2.0 * hd * TILT_S * scaleAt(z)),
        z
      );

      if (length(p - centre) - reach > second) continue;

      vec3 q = toPlate(p - centre, (r2 - 0.5) * 0.048, (r1 - 0.5) * 0.055,
                       (r1 - 0.5) * 0.240);
      second = min(second, plate(q, vec3(hw * 0.90, ht, hd), chamfer, 0.42));
    }

    hit = closer(hit, Hit(second, ID_SECOND));
  }

  return hit;
}

Material materialFor(int id, vec3 p, vec3 n) {
  /*
   * "Machined aluminium plates with a linear brush grain running left-to-right
   * across the frame (never up)." §2.5 makes the direction a rule rather than a
   * preference, and on this plate it is load-bearing optically as well: the key
   * is 69° off the view axis *in X*, so the only thing putting a highlight on an
   * edge that runs along X is the anisotropic lobe stretched along X. Swap the
   * tangent for world Y and the hairlines go out — the grain is not a texture
   * laid over the lighting here, it is the reason there is any.
   */
  Material m = matAluminiumBrushed(vec3(1.0, 0.0, 0.0));

  /*
   * Face against chamfer, separated on the normal's world Y.
   *
   * Every plate shares one attitude to within two degrees, so the surfaces sort
   * cleanly: the front face sits at n.y ≈ −0.17, the specular peak on the
   * chamfer at n.y = +0.27, the top edge band at +0.98. Sorting on n.y rather
   * than on the angle to `PLATE_N` matters because the per-plate *yaw* rotates
   * about world Y and so leaves n.y untouched, while it moves the angle to
   * `PLATE_N` by the full seven degrees — a threshold written the other way
   * puts chamfer roughness on the outer thirds of every yawed face, which reads
   * as a dirty plate.
   */
  float onFace = 1.0 - smoothstep(-0.02, 0.16, n.y);

  /*
   * The metal split, and the reason the faces are visible at all.
   *
   * `matAluminiumBrushed` is `metal = 1`, and a metal in this model has no
   * diffuse lobe: `shade()` computes `albedo * (1 - metal)`. A face 26° off the
   * specular peak therefore returns almost nothing, and the honest consequence
   * of shipping that is a black card with one hairline in it — lit correctly,
   * legible as nothing, and worse than the placeholder it replaces.
   *
   * Real bead-blasted aluminium is not black at 26° off, because the light that
   * a rough conductor scatters between its own microfacets comes back out
   * diffusely. Single-scatter GGX drops that energy on the floor. Putting the
   * faces at `metal = 0.20` is the standard cheap restitution of it, and it buys
   * exactly what §2.5 promises of the material — "matte, diffuse, holds a soft
   * gradient beautifully" — at around sRGB 70 to 90 across a face, well under
   * §2.3's L .600 band and 90 levels under the ceiling.
   *
   * The chamfer stays at `metal = 1`. Its F0 is what makes the hairline bright,
   * and dropping it there would take the one mark in the plate that is supposed
   * to reach `chrome` down with the faces. Splitting the two is the whole point:
   * the faces need range, the chamfer needs a ceiling, and they are different
   * surfaces of the same part.
   */
  m.metal = mix(1.0, 0.20, onFace);
  /*
   * The chamfer's 0.44 is a WebP number, not a look, and it is worth stating
   * because it looks like a tolerance and is not. At 0.28 the hairline's core
   * ran two pixels wide in the master and climbed from ink to sRGB 167 across
   * them; §4.1 ships this at `cwebp -q 80 -sharp_yuv`, and an edge that steep
   * rings. `qa.mjs` measured the consequences on the *shipped* file rather than
   * on the master and rejected two of them: a luminance overshoot to OKLCH L
   * .764 where the master peaked at .731, and a shadow-to-highlight hue split of
   * 124° on an image whose every source pixel is at chroma 0.000 — chroma
   * subsampling inventing hue out of a two-pixel cliff.
   *
   * Widening the lobe spreads the same energy over four or five pixels instead.
   * The peak drops a handful of levels, the encoder has a gradient to work with,
   * and the mark is still a hairline — fourteen of them at ~0.3% of frame height
   * each, which is why only half a percent of the frame sits above L .600
   * against §2.3's 3% cap.
   */
  m.rough = mix(0.50, 0.56, onFace);
  /*
   * Anisotropy splits with them, and not only for the lobe shape. `shade()`
   * perturbs the normal along the brush by `0.020 * aniso`, and on a surface seen
   * at a grazing angle that perturbation lands on the silhouette — at 0.38 the
   * plates' lower edges came back visibly fringed, which reads as a render fault
   * rather than as brushing. The chamfer keeps 0.88 because that is where the
   * grain is doing its real work: stretching the lobe along X is the only reason
   * an edge that runs along X catches a key 69° off in X at all.
   */
  m.aniso = mix(0.88, 0.20, onFace);
  m.albedo = mix(0.62, 0.66, onFace);

  /*
   * §A2's depth of field: "Focus falls on the third and fourth plates. The
   * nearest and furthest go soft. This is the plate where shallow depth of field
   * is the point — it is what makes 'many' read as depth rather than as
   * pattern."
   *
   * There is no aperture here — core.glsl marches one pinhole ray per sample —
   * so this is the honest approximation and not the thing itself: roughness
   * rises with distance from the focal plane, which spreads each chamfer's
   * highlight and drops its peak at the same time. A defocused hairline and a
   * rougher hairline are the same two pixels of falloff. What it cannot
   * reproduce is a genuinely out-of-focus *silhouette* — the plate edges stay
   * geometrically sharp, they only stop being bright.
   *
   * The focal plane is the third plate back from the near end, per the brief.
   */
  float focus = stackDepth(easeAlong((stackSpan() - 3.5) / stackSpan()));
  float defocus = abs(p.z - focus);

  /* The second stack is a further unit back again and is never in focus. */
  if (id == ID_SECOND) defocus += 0.20;

  m.rough = clamp(m.rough + defocus * 0.50, 0.03, 0.94);

  /*
   * Distance falloff, standing in for the strip box.
   *
   * §A2's key is "narrow — a strip box", which is a source close to the subject
   * and therefore one with real falloff across a stack a world unit deep. The
   * crop's key is directional (`uKeyRange = 0` — a positional lamp here would
   * have to be re-solved per crop against four different pans, and gets the
   * grazing angle wrong the moment it is close enough to fall off), and a source
   * at infinity has no falloff at all. Without this the far plates arrive at the
   * same value as the near ones and the run flattens into a grille.
   *
   * It only needs to touch `albedo`, because the two lobes fall off by different
   * mechanisms: the faces are diffuse and dim with reflectance, while the
   * chamfers are pure specular and are already dimming through the defocus
   * roughness above — a fivefold drop in peak `D` across the run, which is the
   * far hairlines going quiet on their own.
   *
   * Compositionally this is what makes the top of the stack dissolve before it
   * reaches the copy — §A2's "the room above the stack falls to ink within the
   * top quarter of the frame" — in camera, rather than by attenuation inside the
   * reserve, which §2.7 counts as an edge.
   */
  m.albedo *= 1.0 / (1.0 + 0.80 * max(0.0, focus - p.z));

  return m;
}
