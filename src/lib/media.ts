import type { ImageSources, VideoSources } from '../components/ui/MediaBackdrop'

/**
 * The bridge between the plate renderer and the page.
 *
 * `tools/plates/` renders one plate per briefed section (docs/art-direction.md
 * §3) and `encode.mjs` writes the results to a fixed layout under
 * `public/media/<plate>/`:
 *
 *   <plate>-mobile.webp   ≤425px crop
 *   <plate>-tablet.webp   ≤768px crop
 *   <plate>-desktop.webp  the default crop
 *   <plate>-wide.webp     ≥1280px crop
 *   <plate>.webm / .mp4   the loop, on the two plates that have one
 *   <plate>-poster.webp   that loop's first frame
 *
 * Sections used to spell those paths out inline. Eight sections × four crops is
 * thirty-two string literals for a naming scheme owned by a build script in a
 * different language — one rename there and the page 404s in four places per
 * section, silently, because a missing <source> just falls through to the next
 * one. Deriving them from the plate id means the convention is stated once, in
 * the same file as the comment explaining it.
 *
 * Not a `<link rel=preload>` list and not lazy: `MediaBackdrop` already handles
 * decode order — `<picture>` picks exactly one crop per viewport, and video is
 * driven by IntersectionObserver so a plate three screens down is not decoding.
 */

/** Plates with a still crop set. The union is the guard: a typo is a type error. */
export type PlateId =
  | 'hero'
  | 'stocks'
  | 'derivatives'
  | 'platform'
  | 'onboarding'
  | 'closing'
  | 'device'
  | 'terminal'
  | 'gate'
  | 'scale'
  | 'bore'

const base = (plate: PlateId) => `/media/${plate}/${plate}`

/**
 * The four art-directed crops for a plate.
 *
 * All four are always emitted, so all four are always referenced — an absent
 * `wide` would silently serve the desktop crop on a 4K panel, which is exactly
 * the "four exports of one render" failure §5.3 exists to prevent, arriving
 * through the back door of the markup instead of the renderer.
 */
export function plateImage(plate: PlateId): ImageSources {
  const src = base(plate)
  return {
    mobile: `${src}-mobile.webp`,
    tablet: `${src}-tablet.webp`,
    desktop: `${src}-desktop.webp`,
    wide: `${src}-wide.webp`,
  }
}

/**
 * The loop, for the two plates that have one (hero and closing — §4.2 permits
 * motion on exactly those). WebM first: the VP9 encode is roughly an eighth of
 * the H.264 one, and the mp4 exists for the browsers that cannot decode it.
 *
 * No `mobile` entry. The renderer emits one loop per plate, from one crop, so
 * claiming a phone-specific encode here would point at a file that is not
 * built. `MediaBackdrop` gates the loop to ≥769px anyway and falls to the
 * `mobile`/`tablet` stills below that, which is §4.2's rule — a 16:9 frame
 * cropped to 9:16 reserves nothing.
 */
export function plateVideo(plate: PlateId): VideoSources {
  const src = base(plate)
  return { webm: `${src}.webm`, mp4: `${src}.mp4` }
}

/** First frame of the loop. Shown before playback, and the ONLY thing shown
 *  under `prefers-reduced-motion` (motion-brief §6). */
export const platePoster = (plate: PlateId) => `${base(plate)}-poster.webp`
