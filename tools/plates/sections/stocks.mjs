import { CARD, CTA_PATCH, zone } from '../spec.mjs'

/**
 * A2 — docs/art-direction.md §3. One file per plate so that the six can be
 * art-directed independently; `config.mjs` only assembles them.
 *
 * Three things are set here rather than inherited from `DEFAULTS`, and all three
 * are §A2 quotations rather than taste:
 *
 *  - **`keySoft: 0.3`.** The default 0.34 is spec.mjs's 4×6ft softbox. §A2 does
 *    not ask for one: *"Key from camera-left at 75°, narrow — a strip box, so
 *    each plate edge picks up a discrete highlight and the intervals between
 *    them read as rhythm."* A strip box is the narrow source in that sentence,
 *    and `keySoft` widens the specular lobe by 0.30 of itself in `shade()`, so
 *    softening past this point is what turns fourteen discrete highlights into
 *    one continuous sheen. The rhythm the brief asks for is a property of the
 *    source's size.
 *  - **`keyGain: 1.25`.** One value across all four crops, because it is one
 *    lamp on one set: §5.5's system read asks whether the six plates look like
 *    one shoot, and a gain that moves per crop is four shoots. The per-crop trim
 *    is `exposure`, below.
 *  - **The key stays at camera-*right*,** where §A2 says camera-left. This is
 *    the one deliberate departure in the file and it follows from §2.7 rather
 *    than from preference. Both of this card's reserves are up and to the left —
 *    a full-width top band for the title, plus the bottom-left CTA patch — so a
 *    key from camera-left aims its brightest falloff across exactly the two
 *    rectangles that have to hold under `#38383c`, and its darkest across the
 *    empty lower right. Mirroring costs nothing (the brush grain runs on world X
 *    either way, so the anisotropy is symmetric) and buys the composition: the
 *    stack is brightest at the bottom right and the room falls to ink up and to
 *    the left, which is where §A2 wants the falloff anyway — *"the room above
 *    the stack falls to ink within the top quarter of the frame"*.
 */
export default {
  id: 'stocks',
  shader: 'a2-stocks.glsl',
  frames: CARD,
  alt: 'Thin machined aluminium plates suspended in darkness, each catching a narrow band of light along its edge.',
  motion: null,
  crops: {
    /* "Stack compressed to 8 plates, occupying only the bottom 45%." */
    mobile: {
      dead: zone(0, 0, 1, 0.46),
      dead2: CTA_PATCH,
      deadFloor: 0.02,
      deadFloor2: 0.02,
      /* Lifted from 0.9. The deepest reserve of the four leaves the least frame
         lit, and eight plates at this count are the largest in the set, so the
         crop was carrying the least light on the most surface. */
      exposure: 1.06,
      keySoft: 0.3,
      keyGain: 1.25,
      pan: [0.05, -0.62],
      key: [0.82, 0.42, 0.38],
      fov: 24,
      p: [8 /* count */, 0.155 /* pitch */, 0.5 /* spread */],
    },
    /* "12 plates, stack centred low. Top 40% empty." */
    tablet: {
      dead: zone(0, 0, 1, 0.4),
      dead2: CTA_PATCH,
      deadFloor: 0.022,
      deadFloor2: 0.022,
      /* Lifted from 0.95, with mobile, so the four crops sit within a tenth of
         a stop of each other — §5.5's "same room, same key, same black point". */
      exposure: 1.12,
      keySoft: 0.3,
      keyGain: 1.25,
      pan: [0.0, -0.38],
      key: [0.84, 0.4, 0.36],
      fov: 24,
      p: [12, 0.15, 0.72],
    },
    /* "14 plates spread laterally, stack anchored bottom-centre-right." */
    desktop: {
      dead: zone(0, 0, 1, 0.34),
      dead2: CTA_PATCH,
      deadFloor: 0.024,
      deadFloor2: 0.02,
      /* The reference crop; everything else is trimmed against it. Lifted from
         1.0 to bring the plate faces into the 60–95 sRGB band where machined
         aluminium in a dark room actually sits. The ceiling is unaffected —
         core's rolloff is asymptotic, so exposure moves the mid-tones and the
         chamfer hairline stays pinned just under sRGB 168 (§2.3). */
      exposure: 1.22,
      keySoft: 0.3,
      keyGain: 1.25,
      pan: [0.14, -0.3],
      key: [0.85, 0.38, 0.35],
      fov: 25,
      p: [14, 0.145, 0.95],
    },
    /* "16 plates, wider spread, a second shallower stack entering from the
       right edge to fill the extra width. Bottom-left stays clear." */
    wide: {
      dead: zone(0, 0, 1, 0.34),
      dead2: CTA_PATCH,
      deadFloor: 0.024,
      deadFloor2: 0.02,
      /* Matches desktop: same reserve, same framing. The second stack takes its
         falloff from being a world unit further back, in the shader, rather than
         from a crop-level lift. */
      exposure: 1.22,
      keySoft: 0.3,
      keyGain: 1.25,
      pan: [0.2, -0.28],
      key: [0.86, 0.37, 0.34],
      fov: 25,
      p: [16, 0.14, 1.18, 1.0 /* second stack */],
    },
  },
}
