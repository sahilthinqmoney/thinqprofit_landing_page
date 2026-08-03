import { useEffect, useRef, useState } from 'react'

/**
 * Art-directed crops, one per breakpoint — NOT one image scaled.
 * Each crop is composed with its negative space where the copy will land
 * (motion-brief §4: left 45% is the text-safe dead zone on desktop; on mobile
 * the dead zone moves to the top because the band drops below the copy).
 */
export interface ImageSources {
  /** ≤425px crop. */
  mobile?: string
  /** ≤768px crop. */
  tablet?: string
  /** Default crop, ≥769px. */
  desktop: string
  /** ≥1280px crop, for 4K panels. */
  wide?: string
}

export interface VideoSources {
  /** ≤768px encode — smaller, shorter, tighter crop. */
  mobile?: string
  /** VP9. Served first; browsers that can't decode fall to mp4. */
  webm?: string
  /** H.264 baseline. */
  mp4: string
}

/** Which side of the frame is lit. Put it opposite the copy. */
export type Focus = 'left' | 'right' | 'center'

interface MediaBackdropProps {
  /**
   * Required. Alt text for a real asset.
   *
   * On sections with no asset yet this string is the production brief, and it is
   * NOT rendered — see `PendingField`. It used to be, in the corner of nine
   * sections.
   */
  alt: string
  image?: ImageSources
  video?: VideoSources
  /**
   * First-frame WebP. Rendered inside <video> so it shows before playback and
   * after a decode failure, and is the *only* thing rendered under
   * prefers-reduced-motion (motion-brief §6).
   */
  poster?: string
  /** Behind the media, visible in letterbox gaps and before decode. */
  tone?: string
  /**
   * Which side of the plate is lit, for the no-asset state. Set it opposite the
   * copy: the caller is the only thing that knows which margin its words are
   * parked against.
   */
  focus?: Focus
  className?: string
}

/**
 * True at ≥769px — the width at which `ImageSources` stops serving the `tablet`
 * crop and starts serving `desktop`.
 *
 * This exists so a section can ship a video *and* the four art-directed stills,
 * which is not a nicety: docs/art-direction.md §4.2 says mobile "serve the
 * poster still, skip the video", and §2.7's dead zone moves between breakpoints
 * — on a phone the copy is full-width and top-anchored, not parked to a side. A
 * single 16:9 loop `object-cover`-ed into a 9:16 frame reserves nothing, so
 * shipping video to mobile is not a bandwidth question, it is a legibility one.
 *
 * Matched in JS rather than with two elements and a CSS media query because CSS
 * cannot stop the hidden one downloading, and the whole point below 769px is to
 * not fetch 2 MB of loop.
 */
function useWideViewport() {
  const [wide, setWide] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 769px)').matches,
  )

  useEffect(() => {
    const query = window.matchMedia('(min-width: 769px)')
    const sync = () => setWide(query.matches)
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  return wide
}

/**
 * The layer that sits *behind* section copy. Never a sibling that overlays the
 * text — it is pinned at `z-index: -999` inside the section's own stacking
 * context, so copy participates in normal flow and needs no z-index of its own.
 *
 * Video follows motion-brief §6: `muted playsinline loop preload="auto"` with
 * NO `autoplay` attribute. Playback is driven by IntersectionObserver so a
 * section three screens down is not decoding frames, and a backgrounded tab
 * stops entirely.
 */
export default function MediaBackdrop({
  alt,
  image,
  video,
  poster,
  // The page ground, read from the token rather than transcribed. This is what
  // shows in letterbox gaps and for the frame before the asset decodes, so any
  // other value is a visible colour flash on load — and a hand-copied hex is
  // precisely how that happens. This default was `#050505` and would have
  // stayed `#050505` while the ground warmed to `#0A0808`, leaving a 1.0202:1
  // patch of the superseded neutral ink in every letterbox gap on the page,
  // cool against a ground at OKLCH hue 17.6°. Two of the three call sites
  // already passed `var(--color-bg)` for exactly this reason; the default now
  // agrees with them and cannot drift again.
  tone = 'var(--color-bg)',
  focus = 'right',
  className = '',
}: MediaBackdropProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const wide = useWideViewport()
  /*
   * The loop plays only where its composition was art-directed to work. Below
   * 769px the `mobile` and `tablet` crops take over — different framing, not the
   * same frame letterboxed (§5.3). A section with a video and no stills still
   * gets the video everywhere, which is the honest fallback: something is better
   * than the pending plate, and the alternative is silently showing nothing.
   */
  const playsVideo = Boolean(video) && (wide || !image)

  useEffect(() => {
    const el = videoRef.current
    if (!el) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduced.matches) return

    let visible = false

    const sync = () => {
      if (visible && !document.hidden) void el.play().catch(() => {})
      else el.pause()
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        sync()
      },
      // Start decoding just before it scrolls in, so the first frame isn't a stall.
      { rootMargin: '15% 0px', threshold: 0 },
    )
    observer.observe(el)
    document.addEventListener('visibilitychange', sync)

    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', sync)
    }
    /* Re-runs when the viewport crosses 769px: the <video> is unmounted below
       that width, so the observer has a different element to attach to (or
       none at all). */
  }, [playsVideo])

  const fill = 'absolute inset-0 h-full w-full object-cover'

  return (
    <div
      aria-hidden={video || image ? undefined : 'true'}
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{ backgroundColor: tone, zIndex: -999 }}
    >
      {playsVideo && video ? (
        <video
          ref={videoRef}
          aria-label={alt}
          loop
          muted
          playsInline
          preload="auto"
          poster={poster}
          className={fill}
        >
          {video.mobile && <source media="(max-width: 768px)" src={video.mobile} type="video/mp4" />}
          {video.webm && <source src={video.webm} type="video/webm" />}
          <source src={video.mp4} type="video/mp4" />
          {poster && <img alt={alt} src={poster} className={fill} />}
        </video>
      ) : image ? (
        <picture>
          {image.wide && <source media="(min-width: 1280px)" srcSet={image.wide} />}
          {image.mobile && <source media="(max-width: 425px)" srcSet={image.mobile} />}
          {image.tablet && <source media="(max-width: 768px)" srcSet={image.tablet} />}
          <img alt={alt} src={image.desktop} className={fill} />
        </picture>
      ) : (
        <PendingField focus={focus} />
      )}
    </div>
  )
}

/**
 * The plate that stands in until a shot clip lands.
 *
 * **It no longer prints the asset brief.** It used to set the `alt` string —
 * which on these sections is a full art-direction spec — in 11px uppercase in
 * the bottom-right corner, live, on nine sections. So the closing CTA read
 * "CLOSING LOOP, 8S, SEAMLESS. A SINGLE MACHINED-ALUMINIUM FORM AT REST IN
 * NEAR-BLACK…" to every visitor. That is the production spec shipped as page
 * copy, and no other single thing on the page did more damage to the claim that
 * it was finished. A stranger deciding whether to hand this company money was
 * reading our notes to ourselves.
 *
 * The brief strings stay where they are, in the data files, for whoever shoots
 * the clips. They are documentation. They are not content.
 *
 * What replaces it is a *designed* plate rather than a placeholder — the same
 * subject every brief describes, built in CSS: a machined aluminium face in
 * near-black with one specular running the length of an edge. Three layers:
 *
 *  1. **Body.** An off-axis radial, warmest at the focus and falling to `--bg`
 *     at the frame. This is the form catching ambient light.
 *  2. **Specular.** A narrow, hard-edged band across the same axis as the
 *     brushing. This is the whole reason it reads as metal and not as a
 *     gradient: a diffuse surface has no specular, so an edge highlight is what
 *     the eye uses to decide something is machined.
 *  3. **Brushing.** Anisotropic 1px grain on one axis only. Metal is directional;
 *     isotropic noise reads as film grain, which the page already has globally.
 *
 * `focus` puts the lit side opposite the copy — the caller knows which margin
 * its words are parked against, so the plate is lit to leave that side dark
 * rather than relying on the scrim alone to claw contrast back.
 *
 * Nothing animates. The brief for every one of these is a form *at rest*, so an
 * animating layer would be simulating stillness.
 *
 * HOW MANY SECTIONS USE THIS, since the answer has changed and the old one is
 * still quoted twice above: **none**. Grepped, every live call site now passes a
 * rendered plate — Hero, Platform, Terminal, Products' two featured cards and
 * FinalCta — and Products' `undefined` branch is unreachable because both
 * featured ids are in `PLATE`. This is now a true fallback: it paints if a plate
 * id goes missing, or if a new section lands before its shoot. It is still
 * maintained to the palette for that reason, and because a fallback that has
 * quietly gone stale is worse than no fallback — but it is not what nine
 * sections are looking at, and no colour decision below should be argued as
 * though it were.
 */
function PendingField({ focus = 'right' }: { focus?: Focus }) {
  /*
   * Hotspot and specular both key off `focus`. The specular is deliberately not
   * centred on the hotspot: on a real machined edge the bright line sits at the
   * form's boundary and the ambient falloff sits on its face, so offsetting the
   * two is what separates "a lit object" from "a glow".
   */
  const lit = focus === 'left' ? 28 : focus === 'center' ? 50 : 72

  return (
    <div className="absolute inset-0">
      {/* 1 — body. An off-axis radial from a lit face down to the page ground.
          It used to be a COOL ramp — #1d1d22 → #14141a → #0a0a0d → #050505,
          blue-black at every stop (b−r = 5, 6, 3, 0; OKLCH hue 285.6°, 285.2°,
          285.6°) — and the ground it fell to is now warm, at hue 17.6°. A
          285.6° ramp on that ground is not "neutral"; it is a cool patch cut
          into warm ink, which is the exact defect `--color-surface` was re-hung
          at chroma 0.011 to avoid.

          Re-solved rather than re-picked, by the same method every surface
          token moved by: each stop holds the ratio it had ON ITS OWN GROUND.
          Old, on #050505 — 1.2142 / 1.1110 / 1.0308 / 1.0000. New, on #0A0808 —
          1.2179 / 1.1087 / 1.0315 / 1.0000. The shape is held to 0.3%, so the
          falloff reads identically; only its hue moved.

          The three lit stops sit at ONE hue, 44.5° ± 0.1° (44.54 / 44.45 /
          44.53), which is `--color-surface-raised`'s 44.47°. One hue at three
          luminances is a face lit at one colour temperature; three hues would
          be three materials. Chromas run 0.0123 / 0.0129 / 0.0137 — inside the
          palette's warm neutral axis (surface 0.0110 → border 0.0165), and the
          highest of them is 10.8% of the accent's 0.1263.

          Stop 1 lands 1.0086:1 off `--color-border-soft` #251D1A and is one
          point of green and one of blue away from it in hex. It is NOT that
          token: border-soft is a line, this is a lit surface, and collapsing
          the two would make every plate's brightest point a hairline value. The
          proximity is a coincidence of the ladder, recorded here so the next
          reader does not "correct" it into the token.

          The final stop is `var(--color-bg)` and not a fourth hex, because it
          is the only stop that has to be EXACTLY the ground — and a fourth hex
          is how this ramp got stranded on #050505 in the first place.

          The rule this replaces: the old note said the plate was "neutral by
          rule: colour on this page means gain, loss or warning". That rule is
          dead — the brand is copper and is the most saturated thing on the
          page. What survives is the narrower one that replaced it: only the
          ACTION is saturated copper. At chroma 0.0137 this plate is warmth, not
          colour. (It was a saturated indigo ramp two palettes ago, which lit
          four sections in a brand colour that no longer exists — that is the
          failure the chroma ceiling above keeps it clear of.) */}
      {/* 1 — body. Warm copper-tinted radial background catching ambient light. */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(74% 78% at ${lit}% 38%, #2A1F1B 0%, #1E1613 38%, #140E0C 72%, var(--color-bg) 100%)`,
        }}
      />

      {/* Ambient copper chromatic glow orb */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-70"
        style={{
          background: `radial-gradient(55% 55% at ${lit}% 40%, rgba(255, 158, 122, 0.16) 0%, rgba(168, 74, 48, 0.08) 50%, transparent 85%)`,
        }}
      />

      {/* 2 — specular. Copper chromatic specular line. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(115deg, transparent 30%, rgba(255, 255, 255, 0.15) 45%, rgba(231, 233, 238, 0.25) 49.5%, rgba(140, 140, 144, 0.18) 53%, transparent 68%)',
        }}
      />

      {/* 3 — brushing, on the specular's axis. */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(115deg, #e7e9ee 0, #e7e9ee 1px, transparent 1px, transparent 7px)',
        }}
      />

      {/* Edge falloff */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(120% 120% at 50% 50%, transparent 48%, color-mix(in oklab, var(--color-bg) 60%, transparent) 100%)',
        }}
      />
    </div>
  )
}
