import type { ReactNode } from 'react'
import MediaBackdrop from './MediaBackdrop'
import type { ImageSources, VideoSources } from './MediaBackdrop'

interface MediaCardProps {
  title: string
  body: string
  action?: ReactNode
  media: {
    alt: string
    image?: ImageSources
    video?: VideoSources
    poster?: string
    tone?: string
  }
  /** Softens the plate under the copy block only, leaving the lower art clean. */
  scrim?: number
  className?: string
}

/**
 * A tall card whose art fills the whole card and whose copy sits on top of it —
 * the counterpart to `MediaSection` at card scale.
 *
 * Height is viewport-relative, not a fixed pixel ladder. At 560/640/760px the
 * two cards alone made the Products section 2314px against an 812px viewport —
 * nearly three screens for one section. `clamp(360px, 52vh, 520px)` keeps the art
 * generous on a tall display and lets the section fit a laptop.
 *
 * Deliberately not the `rounded-2xl border p-6` box used everywhere else on the
 * page: the art *is* the card. Copy is pinned to the top, the CTA to the
 * bottom, and the vertical gap between them is whatever the card height leaves
 * over, so the artwork reads through the middle.
 */
export default function MediaCard({
  title,
  body,
  action,
  media,
  scrim = 0.7,
  className = '',
}: MediaCardProps) {
  return (
    /*
      The edge is `border-soft`, not `border-white/20`.

      A raw white alpha was defensible while the ground was neutral #050505 — it
      composited to a neutral grey on a neutral page. On the warm ground it
      composites to #3B3939: 1.7412:1, OKLCH chroma 0.0028 at hue 17.3 deg,
      i.e. a near-neutral edge cut into a warm surface. `border-soft` #251D1A is
      1.2076:1 at chroma 0.0138 and hue 41.6 deg, which is the warm axis the rest
      of the page's structure sits on.

      That is a deliberate drop from 1.74:1 to 1.21:1. The edge is not carrying
      information — the card is identified by its art and its copy, not by its
      outline — so it is a seam, and a seam that reads as a cool line on warm ink
      is worse than a quieter one that reads as the same material. The rule the
      brief keeps is "structure is carried by neutral white lifts": a 1px inset
      HIGHLIGHT stays white, because a lift is not a line. This is a line.
    */
    <article
      className={`relative isolate flex h-[clamp(360px,52vh,520px)] shrink-0 snap-center flex-col justify-between overflow-hidden rounded-[20px] border border-accent/30 hover:border-accent/60 shadow-[0_0_25px_rgba(255,158,122,0.12)] transition-all duration-300 ${className}`}
    >
      <MediaBackdrop {...media} />

      {/* Copper chromatic top specular edge highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent z-10"
      />

      {scrim > 0 && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-2/3"
          style={{
            zIndex: -1,
            backgroundImage: `linear-gradient(to bottom, rgba(10,8,8,${scrim}) 0%, rgba(10,8,8,${(scrim * 0.55).toFixed(3)}) 45%, rgba(10,8,8,0) 100%)`,
          }}
        />
      )}

      {/* 30em, not 24: at 24 the body set four words to a line inside a 670px
          card, which reads as a column squeezed into a space that was never
          short of room. */}
      <div className="max-w-[30em] p-8 sm:p-10 lg:p-12">
        {/* Display rank, but capped at ~0.6× the section title it sits under.
            At `clamp(2rem,2.8vw,2.75rem)` this rendered 32px against a Products
            heading of 36 — 0.89× in the same face, same 600 weight, same white,
            so a card title and the section title read as the same rank and the
            section had no apparent heading at all. */}
        <h3 className="display m-0 text-[clamp(1.5rem,2.2vw,2rem)] leading-[1.18] text-fg">
          {title}
        </h3>
        {/* `fg-muted`, not `white/70`. The card sits on a media plate, so a white
            alpha's real contrast depends on the asset behind it and cannot be
            signed off; the token is both brighter and plate-independent. It is
            now 13.2245:1 on the ground (13.08:1 was the old measurement against
            #050505), and warm-composited — chroma 0.0078 at hue 48.6 deg, so it
            reads as ink rather than as grey against a copper-lit page. */}
        <p className="mt-3 text-base leading-relaxed text-fg-muted">{body}</p>
      </div>

      {action && <div className="p-8 pt-0 sm:p-10 sm:pt-0 lg:p-12 lg:pt-0">{action}</div>}
    </article>
  )
}

/**
 * Rail for `MediaCard`s. A snap-scrolling row below 1280px — cards this tall
 * cannot stack usefully on a phone — and a plain flex row above it.
 */
export function MediaCardRail({ children }: { children: ReactNode }) {
  return (
    // The gutter is `max(page gutter, distance from the viewport edge to the
    // 84rem rail)`. Below ~1440px the rail is narrower than the viewport, the
    // max picks the ordinary gutter, and the row bleeds — which is the point,
    // because the half-visible next card is what says "this scrolls". Above it
    // the max picks `50vw - 42rem` (42rem being half the rail), so the first
    // card's left edge lands exactly on the section heading's.
    //
    // Without this the row keeps a flat 32px gutter while the heading above it
    // sits at 288px on a 1920px display, and the section reads as two unrelated
    // left edges.
    <div className="rail flex snap-x snap-proximity gap-4 overflow-x-auto px-[max(1.25rem,calc(50vw-42rem))] pb-2 [scrollbar-width:none] sm:px-[max(1.5rem,calc(50vw-42rem))] lg:gap-6 lg:px-[max(2rem,calc(50vw-42rem))] xl:overflow-visible xl:px-[max(3rem,calc(50vw-42rem))] [&>*]:w-[86vw] xl:[&>*]:w-auto xl:[&>*]:flex-1">
      {children}
    </div>
  )
}
