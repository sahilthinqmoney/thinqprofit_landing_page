import { BLEED, zone } from '../spec.mjs'

/**
 * A1 — docs/art-direction.md §3. One file per plate so that the six can be
 * art-directed independently; `config.mjs` only assembles them.
 *
 * **Reconstructed.** The original of this file was lost when the working tree
 * was cleaned mid-session; every number below is re-derived from §A1's crop
 * table, §2.7's dead-zone spec and §4.2's motion targets rather than recalled,
 * and `a1-hero.glsl`'s `uP` contract is quoted in the parameter comments. If it
 * differs from the original it should differ toward the document.
 *
 * `uP` (from the shader's header):
 *   0 — major radius, in frame-height units.
 *   1 — centre, frame x. Above 1.0 the centre is off-frame right.
 *   2 — centre, frame y.
 *   3 — the wide crop's second matte black plane, entering bottom-right.
 */
export default {
  id: 'hero',
  shader: 'a1-hero.glsl',
  frames: BLEED,
  /** §A1 "alt text to ship", verbatim. Mirrors `hero.mediaAlt`. */
  alt: 'A large brushed aluminium form curving out of darkness, lit along one edge by a single soft light.',
  /**
   * The page's opening image and the first of the two plates that ship as
   * motion (§4.2): 8s, 24fps, seamless, served at 1280×720, rendered from the
   * `wide` composition because that is the crop the loop is served at (≥769px;
   * below that `MediaBackdrop` falls to the stills).
   */
  motion: { crop: 'wide', seconds: 8, fps: 24, out: [1280, 720] },
  crops: {
    /*
     * "Copy is centred *and* full width here — there is no dead side. Reduce to
     * almost nothing: an ink field with a single soft neutral gradient in the
     * bottom-right corner, peaking below #2b2b31, and a barely-there lift at the
     * very top edge. This crop is deliberately the quietest of the four."
     *
     * So the reserve is the whole frame bar the bottom corner, the exposure is
     * the lowest of the four, and the form is pushed almost entirely out of
     * frame — only the far shoulder of the curve remains.
     */
    mobile: {
      dead: zone(0, 0, 1, 0.82),
      deadFloor: 0.014,
      exposure: 0.62,
      haze: 0.3,
      pan: [0.18, 0.32],
      key: [0.8, 0.34, 0.34],
      fov: 24,
      p: [0.94, 1.34, -0.28, 0.0],
    },
    /*
     * "Must clear both the top band and the left side. Form pushed hard right
     * and down; only its upper-left curve is in frame, occupying the right 30%
     * below y=55%." Two reserves, which is why this is §2.7's most conservative
     * crop: the top band and the left column both have to hold.
     */
    tablet: {
      dead: zone(0, 0, 1, 0.45),
      dead2: [0, 0, 0.6, 1],
      deadFloor: 0.018,
      deadFloor2: 0.02,
      exposure: 0.84,
      pan: [0.16, 0.2],
      key: [0.82, 0.36, 0.34],
      fov: 23,
      p: [1.0, 1.2, -0.18, 0.0],
    },
    /*
     * The reference composition: "form in the right 40%, chamfer running
     * down-left, empty left". Dead zone is §A1's stated reserve — x 0–56%,
     * y 12–80% — the largest on the page, because the H1 runs to ~900px of type
     * across three lines with a subheadline, two buttons and a support line
     * under it.
     */
    desktop: {
      dead: zone(0, 0.12, 0.56, 0.8),
      deadFloor: 0.022,
      exposure: 1.0,
      pan: [0.0, 0.0],
      key: [0.86, 0.4, 0.3],
      fov: 22,
      p: [0.88, 1.12, -0.06, 0.0],
    },
    /*
     * "Same form, pulled back — more room, form now occupies the right 32%, and
     * a second matte black plane enters from the bottom-right corner to give the
     * wider frame something to hold. Do not simply letterbox the desktop crop."
     * `p[3]` switches that plane on; it exists on this crop and no other.
     */
    wide: {
      dead: zone(0, 0.12, 0.56, 0.8),
      deadFloor: 0.022,
      exposure: 1.0,
      pan: [0.04, 0.0],
      key: [0.86, 0.4, 0.3],
      fov: 21,
      p: [0.82, 1.16, -0.04, 1.0],
    },
  },
}
