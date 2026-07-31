/*
 * A1 — Hero. docs/art-direction.md §3.
 *
 * "A single large bead-blasted aluminium form entering from the right edge and
 * curving out of the frame — read as a section of something much larger,
 * cropped, not as an object placed in the middle of a room. Its leading chamfer
 * runs a chrome hairline from upper-right down toward frame centre, then dies.
 * The left of the frame is empty room. No horizon, no floor line, no visible
 * set. The form's mass sits in the right 40%; nothing structural crosses
 * x=60%."
 *
 * One primitive, deliberately. §A1 asks for a *section of something much
 * larger*, and the moment a second form appears in frame the read flips from
 * "cropped machine" to "object on a set" — which is the bank's-annual-report
 * failure §5.5 ends on. The ring's centre is parked off the right edge on every
 * crop so only its leading arc is ever in frame.
 *
 * Parameters (`uP`):
 *   0 — major radius, in frame-height units.
 *   1 — centre, frame x. Above 1.0 the centre is off-frame right.
 *   2 — centre, frame y.
 *   3 — the wide crop's second matte black plane, entering bottom-right.
 */

const int ID_FORM = 1;
const int ID_PLANE = 2;

Hit mapScene(vec3 p) {
  /*
   * The loop, when this crop renders as motion.
   *
   * The form eases back along the view axis and rolls a fraction of a degree,
   * then holds — `loopSettle` is 0 at both ends of `uT` and 1 across the middle,
   * so the loop is seamless *and* comes to rest. What the viewer reads is not
   * the form moving; it is the chamfer's catch creeping a little way along an
   * edge that was already there, and the falloff behind it opening slightly.
   *
   * §2.3 rule 3 is why it is shaped this way rather than as a drift. The primary
   * action idles perpetually and is identified by doing so — with no hue in the
   * brand, motion is half of what says *press this*. A plate that also never
   * stops moving takes that signal back. So this settles, and the mark that
   * travels furthest is the dim end of the falloff, not the specular.
   */
  float settle = loopSettle();

  vec3 centre = vec3(atFrame(vec2(uP[1], uP[2])), -0.30 - settle * 0.17);

  /* rotX brings the ring's axis onto Z, so it faces the camera and its arc
     reads as a curve across the frame rather than as an ellipse on a table. */
  vec3 q = rotX(1.5707963) * (p - centre);

  /* Raked a few degrees so the leading chamfer descends to the left. §2.1 bans
     an *ascending* dominant line; a descending one is what it asks for. */
  q = rotY(-0.24 + settle * 0.030) * q;

  /*
   * A broad, shallow band — 0.20 deep against 0.88 radially — not a tube. Two
   * things follow, and both are §A1's read rather than a modelling preference.
   *
   * The flat face gives the key a surface to rake across, so the gradient runs
   * "from `chrome` at the top of the curve to ink at the bottom" in camera
   * rather than being graded in. And the 0.016 chamfer where that face meets
   * the band's edge is what carries the specular: §2.5 calls the machined
   * chamfer "a bright hair line that describes a form's geometry without
   * lighting its face", which is exactly the mark §A1 asks to run from
   * upper-right down toward frame centre.
   *
   * The chamfer radius is the load-bearing number in the whole plate. Widen it
   * and the highlight stops describing an edge and starts lighting a face,
   * which is both a worse photograph and a §2.3 problem — a lit face is area,
   * and area at that luminance starts competing with the button.
   */
  float form = sdRingSlab(q, uP[0], vec2(0.10, 0.44), 0.016);

  Hit hit = Hit(form, ID_FORM);

  if (uP[3] > 0.5) {
    /*
     * Wide crop only: "a second matte black plane enters from the bottom-right
     * corner to give the wider frame something to hold." Anodised, so it
     * carries one faint edge and nothing else — the extra width is composed
     * room, not a second subject (§A1 crops, §5.3).
     */
    vec3 r = rotZ(-0.30) * (p - vec3(atFrame(vec2(0.86, -0.14)), 0.42));
    float plane = sdRoundBox(r, vec3(0.95, 0.035, 0.5), 0.014);
    hit = closer(hit, Hit(plane, ID_PLANE));
  }

  return hit;
}

Material materialFor(int id, vec3 p, vec3 n) {
  if (id == ID_PLANE) return matAnodisedBlack();

  /*
   * Brushed, with the grain running across the frame on world X — §2.5 makes
   * the direction a rule, not a preference: grain running up the frame is an
   * ascending line at texture scale, and at thumbnail size the texture is the
   * first thing that reads.
   */
  Material m = matAluminiumBrushed(vec3(1.0, 0.0, 0.0));

  /*
   * The face is bead-blasted and the chamfer is not. Blending on how far the
   * normal has turned off the ring axis separates them without a second SDF:
   * the chamfer's normals swing away fast, so it picks up the tighter lobe that
   * keeps it a hairline instead of widening into a lit band.
   */
  float onFace = smoothstep(0.55, 0.95, abs(dot(n, vec3(0.0, 0.0, 1.0))));
  m.rough = mix(0.16, 0.46, onFace);
  m.aniso = mix(0.88, 0.34, onFace);
  m.albedo = mix(0.62, 0.50, onFace);
  return m;
}
