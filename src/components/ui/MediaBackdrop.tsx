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

interface MediaBackdropProps {
  /** Required. Describes the asset; becomes alt text, or the placeholder brief. */
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
  tone = '#0b1220',
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
        <PendingField brief={alt} />
      )}
    </div>
  )
}

/**
 * Stand-in until the real clip lands. Deliberately *not* a dashed box: it fills
 * the same space, carries the same darkness, and lets the overlaid copy be
 * judged for contrast now — the whole point of motion-brief §7's last rule.
 * Dropping the real asset in changes nothing about the layout.
 */
function PendingField({ brief }: { brief: string }) {
  return (
    <div className="absolute inset-0">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(80% 70% at 72% 42%, #1e2b52 0%, #131c33 45%, #0b1220 100%)',
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(115deg, #fff 0, #fff 1px, transparent 1px, transparent 9px)',
        }}
      />
      <p className="absolute bottom-4 right-5 max-w-[22rem] text-right text-[0.6875rem] leading-snug tracking-[0.14em] text-white/25 uppercase">
        {brief}
      </p>
    </div>
  )
}
