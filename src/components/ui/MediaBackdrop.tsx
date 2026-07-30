import { useEffect, useRef } from 'react'

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
  // The page background, not a blue-black. This is what shows in letterbox
  // gaps and for the frame before the asset decodes, so any other value is a
  // visible colour flash on load.
  tone = '#050505',
  focus = 'right',
  className = '',
}: MediaBackdropProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

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
  }, [])

  const fill = 'absolute inset-0 h-full w-full object-cover'

  return (
    <div
      aria-hidden={video || image ? undefined : 'true'}
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{ backgroundColor: tone, zIndex: -999 }}
    >
      {video ? (
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
 * Nothing animates. Nine sections use this, and nine animating layers to
 * simulate stillness is the wrong trade — the brief for every one of these is a
 * form *at rest*.
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
      {/* 1 — body. Neutral by rule: colour on this page means gain, loss or
          warning, so the plate carries luminance only. (It was a saturated
          indigo ramp two palettes ago, which lit four sections in a brand
          colour that no longer exists.) */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(74% 78% at ${lit}% 38%, #1d1d22 0%, #14141a 38%, #0a0a0d 72%, #050505 100%)`,
        }}
      />

      {/* 2 — specular. Tight stops, not a soft ramp: the transition from lit to
          unlit on metal happens over a couple of pixels, and widening it is what
          makes CSS "metal" look like plastic. Kept under 0.1 alpha — this sits
          behind live copy on every section that uses it. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(115deg, transparent 34%, rgba(255,255,255,0.045) 45%, rgba(255,255,255,0.085) 49.5%, rgba(255,255,255,0.02) 52%, transparent 60%)',
        }}
      />

      {/* 3 — brushing, on the specular's axis. 0.045, down from 0.06: at the old
          value the 1px lines were individually resolvable at 1x and read as a
          hatch pattern laid over the page rather than as a finish on a surface. */}
      <div
        className="absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(115deg, #fff 0, #fff 1px, transparent 1px, transparent 7px)',
        }}
      />

      {/* Edge falloff, so the plate does not meet the section boundary as a
          visible seam against the flat page either side of it. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 120% at 50% 50%, transparent 52%, rgba(5,5,5,0.55) 100%)',
        }}
      />
    </div>
  )
}
