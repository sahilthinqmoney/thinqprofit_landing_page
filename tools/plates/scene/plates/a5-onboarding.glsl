/*
 * A5 — Onboarding. docs/art-direction.md §3.
 *
 * "Three matte black machined blocks resting in a row on a dark surface,
 * receding to the right, each lit slightly more than the one before. The
 * lighting gradient across the three *is* the sequence — first block barely
 * emerging, third fully described by its chamfers. They sit at a common
 * baseline; the recession is lateral, into the right of the frame, never
 * upward. A soft ground shadow anchors each one. The left 56% is empty room and
 * empty floor."
 *
 * Two things in that paragraph are load-bearing and pull against each other,
 * and every number below is an answer to one of them.
 *
 * **The gradient has to be light, not material.** All three blocks are the same
 * anodised black with the same chamfer, and `materialFor` cannot tell them
 * apart — it is handed a position, not an index, precisely so that it cannot.
 * What separates them is the key, which is a *lamp* (`keyPos`/`keyRange` in the
 * section file) rather than a direction. §A5 asks for "a graduated scrim across
 * it so its intensity drops as it travels left"; a scrim is falloff, and falloff
 * needs a position — a directional key puts identical N·L on three parallel
 * faces and the section's whole idea dies. With the lamp parked just off-frame
 * right and slightly above the row, inverse-square plus the swing in N·L across
 * the row give roughly 1 : 1.6 : 3.2 on the three front faces, which is about a
 * stop between each step. That is the onboarding sequence: three steps, each
 * clearer than the last.
 *
 * **Nothing may step upward (§2.1).** A row of blocks whose tops climb
 * left-to-right is the banned read stated almost literally. So the three are
 * *identical* — same height, same width, same depth, same baseline, same
 * z — and the row runs along world X at constant depth. Blocks at a constant
 * depth and height project to exactly the same frame y, so the row's baseline
 * and its top line are both dead level by construction rather than by eye. This
 * is also why the row does not literally recede in z: a block further from a
 * level camera sits *higher* in frame, and three of them stepping toward the
 * horizon is an ascending line no matter what the depth cue says. §A5's "common
 * baseline" and its "receding to the right" are reconciled the way a
 * photographer would — the recession is the falloff, not the geometry.
 *
 * **The floor is not scenery.** §A5 is one of two plates with a ground plane,
 * and a block with no contact shadow floats and stops reading as resting. The
 * floor is the same `matAnodisedBlack` as the blocks (§A5 materials: "the
 * objects and the ground are one material and only the light separates them"),
 * so the row is legible by three things and nothing else: the tone step between
 * a front face and the floor beside it, the chamfer hairline, and the shadow
 * each block lays across the floor to its left, away from the lamp.
 *
 * **Why the blocks sit ~2.6 units behind the z = 0 plane.** Frame space (see
 * `atPlate` below) is fixed in *frame* fractions, so pushing the row back and
 * scaling it up is compositionally free — and it buys the one thing that is
 * not: chamfer scale. §2.5 holds the machined chamfer to a hairline, and a
 * 0.012-unit chamfer read at the z = 0 plane would be a 26-pixel roundover on a
 * 150-pixel block, which is a pillow, not a machined edge. At this depth the
 * same 0.012 lands at about 15 px on the desktop master: inside §2.5's
 * "bright hair line that describes a form's geometry without lighting its
 * face", and inside the 0.008–0.015 band. It is also the honest reading of
 * §2.6's long lens — the subject is far and the perspective is flat.
 *
 * Parameters (`uP`):
 *   0 — block count. Three, always: three onboarding steps.
 *   1 — second-light-event flag (desktop and wide only, §2.3 rule 2).
 *   2 — baseline, frame y (fraction up from the bottom edge).
 *   3 — third block's centre, frame x.
 *   4 — pitch between block centres, frame x.
 *   5 — block width, as a fraction of frame width.
 *   6 — block height, as a fraction of frame height.
 *   7 — block depth, as a fraction of frame height.
 *   8 — row depth, world z. Negative is further from camera.
 *   9 — extra gap opened before the third block when uP[1] is set.
 *  10 — chamfer radius, world units (§2.5: 0.008–0.015).
 */

const int ID_FLOOR = 1;
const int ID_BLOCK = 2;

/**
 * World units per unit of *frame height*, at depth z.
 *
 * `spec.mjs` solves the camera onto +Z looking down −Z with the target on the
 * z = 0 plane, so `uCamPos.z` is the camera's distance to that plane and
 * `uCamPos.xy` is the pan. `atFrame` returns NDC, whose vertical span is 1.0
 * while the z = 0 plane is `uCamPos.z / focal = 0.5` world units tall — hence
 * the 0.5. The `1 − z/uCamPos.z` term is plain similar triangles: it is what
 * lets a form be placed at a *frame percentage* while sitting anywhere in
 * depth, which is the only reason the row can be pushed back for chamfer scale
 * without every composition number in the section file having to move with it.
 */
float frameScale(float z) {
  return 0.5 * (1.0 - z / uCamPos.z);
}

/** Frame fraction (origin bottom-left, as §2.7 states dead zones) to world. */
vec3 atPlate(vec2 f, float z) {
  return vec3(uCamPos.xy + atFrame(f) * frameScale(z), z);
}

/**
 * Centre of block `i`, frame x. Indexed from the right: the *third* block is
 * the anchor, because it is the one §A5 pins — "a neutral bounce on the third
 * block's shadow side ... placed at roughly x=82%" — and the bounce is a
 * screen-space term in core.glsl that cannot chase the geometry. Anchoring the
 * row on its last step keeps that face under the event on every crop; the first
 * two blocks step left from it.
 */
float blockCentre(int i) {
  /* The gap that the bounce comes off. §2.3 rule 2 calls the second light event
     "a bounce, not a source" — light that has travelled — and on this plate what
     it has travelled off is the lit floor showing through the gap between the
     second and third blocks. Opening that gap on the two crops that carry the
     event is what gives the bounce something to have come from, and it is the
     same move §A5's wide crop asks for in as many words: "spread with more air
     between them". It doubles as the reason the third block reads as *arrived*
     rather than merely as the brightest — it has stepped clear of the row. */
  float opened = uP[1] > 0.5 ? uP[9] : 0.0;
  float steps = float(2 - i);
  return uP[3] - steps * uP[4] - (i < 2 ? opened : 0.0);
}

Hit mapScene(vec3 p) {
  float z = uP[8];
  float s = frameScale(z);

  /*
   * The ground. §A5 puts the baseline at "y≈62%" — 38% up from the bottom edge,
   * which is uP[2]. Solving the plane from a frame fraction rather than from a
   * world height is what keeps the contact line where the brief puts it on all
   * four crops even though each has its own lens and its own row depth.
   *
   * The camera is level (spec.mjs cannot tilt it), so this plane's horizon sits
   * exactly at frame centre and everything on it is seen close to edge-on. That
   * is not a limitation to be fought: it is §2.6's flat, parallel,
   * product-catalogue perspective, and it is why the blocks are described by
   * their front faces and their shadows rather than by a lit top.
   */
  float baseY = uCamPos.y + (uP[2] - 0.5) * s;
  Hit hit = Hit(sdPlaneY(p, baseY), ID_FLOOR);

  /* Half extents. Width is quoted against frame *width* and height against
     frame *height*, which is how §2.7 and §3 state every other number. */
  vec3 half = vec3(
    0.5 * uP[5] * uAspect * s,
    0.5 * uP[6] * s,
    0.5 * uP[7] * s
  );

  /*
   * §2.1's ascending-line rule, enforced by construction: one `half`, one
   * `centreY`, one `z` for all three. There is no per-block height to get wrong
   * — the row can only step level.
   */
  float centreY = baseY + half.y;

  for (int i = 0; i < 3; i++) {
    if (float(i) >= uP[0]) break;
    float cx = atPlate(vec2(blockCentre(i), 0.5), z).x;
    float d = sdRoundBox(p - vec3(cx, centreY, z), half, uP[10]);
    hit = closer(hit, Hit(d, ID_BLOCK));
  }

  return hit;
}

Material materialFor(int id, vec3 p, vec3 n) {
  if (id == ID_FLOOR) {
    /*
     * "The surface they rest on is the same anodised black, so the objects and
     * the ground are one material and only the light separates them" (§A5). Only
     * the roughness is nudged up, and only because a ground plane presents a
     * grazing view to the camera over a huge area: at the stock 0.52 the lamp's
     * broad lobe returns as a sheet of sheen across the lower frame, which is a
     * lit floor rather than a dark room. 0.62 keeps the falloff doing the depth
     * work (§2.4) instead of a specular.
     */
    Material m = matAnodisedBlack();
    m.rough = 0.62;
    return m;
  }

  /*
   * One material for all three blocks — and `materialFor` is given no index, so
   * it could not treat them differently even if the composition asked. The
   * whole gradient is in the light. This is the rule the brief is most easily
   * cheated on, and the cheat is invisible in a render and obvious in a set.
   *
   * The split inside the block is between face and chamfer, and it is read off
   * the normal rather than modelled as a second SDF: a flat face has a normal
   * on an axis, so its largest component is 1; a chamfer's is about 0.707 and a
   * corner's 0.577. §A5's materials are exactly this — "anodised matte black
   * blocks with machined aluminium chamfers".
   */
  Material alu = matAluminiumBrushed(vec3(1.0, 0.0, 0.0));
  Material blk = matAnodisedBlack();

  float axis = max(max(abs(n.x), abs(n.y)), abs(n.z));
  /* Tight, and deliberately tighter on the low side than the geometry needs:
     the transition has to finish *before* the flat face, or the specular
     stops describing an edge and starts lighting a panel — which is a worse
     photograph and a §2.3 problem, because a lit panel is area and area at that
     luminance starts competing with the button. */
  float onFace = smoothstep(0.870, 0.988, axis);

  Material m;
  m.albedo = mix(alu.albedo, blk.albedo, onFace);
  /* Below the stock 0.30 for the chamfer. This is the one mark in the plate
     allowed near `chrome` (§2.2), and its job is to be a hairline: the narrower
     the lobe, the less of the chamfer's width is actually bright. */
  m.rough = mix(0.26, blk.rough, onFace);
  /* Machined, not mirrored (§2.5 bans mirror-polished chrome). Half the hero's
     anisotropy — enough that the cut reads as tooled, not so much that the
     highlight smears off a vertical edge, which is where two of each block's
     three visible chamfers run. */
  m.aniso = mix(0.45, 0.0, onFace);
  /* §2.5: grain across the frame, never up it. World X is frame-lateral here. */
  m.tangent = vec3(1.0, 0.0, 0.0);
  m.metal = mix(1.0, 0.0, onFace);
  return m;
}
