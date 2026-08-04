import { useCallback, useRef } from 'react'
import type { ElementType, ReactNode } from 'react'

/**
 * A card that carries a highlight under the pointer.
 *
 * ── Why this exists rather than a CSS-only hover ──────────────────────────
 *
 * A flat `:hover` state tells the reader the card is interactive. It does not
 * tell them anything about the surface. This page's world is brushed metal lit
 * from one side, and the one thing a lit metal surface does that a painted one
 * cannot is move its highlight when you move relative to it. Tracking the
 * pointer is that behaviour, and it is the cheapest possible version of it —
 * one radial gradient whose centre follows the cursor.
 *
 * It is the page's only pointer-driven effect, which is the whole reason it
 * reads as material rather than as a trick. Applied to every hoverable thing it
 * would be a hover style; applied to the card surfaces alone it is what those
 * surfaces are made of.
 *
 * ── The performance shape ─────────────────────────────────────────────────
 *
 * The handler writes two CSS custom properties and nothing else. No React state,
 * so a pointer moving across a six-card grid triggers zero re-renders — the
 * naive version of this component sets state on every `pointermove` and
 * re-renders the whole section sixty times a second.
 *
 * The highlight is a separate absolutely-positioned layer, so what changes each
 * frame is one element's background-position, not the card's own paint. The
 * card's text is never in the repaint.
 *
 * Writes are coalesced into a rAF: `pointermove` can fire faster than the
 * compositor consumes it, and setting a custom property per event does work the
 * frame will throw away.
 *
 * ── Touch ────────────────────────────────────────────────────────────────
 *
 * `pointermove` fires for touch too, which would flash the highlight under a
 * finger mid-scroll. The handler ignores any non-mouse pointer: there is no
 * hover on a touchscreen, so there is nothing for the effect to express.
 */

interface SpotlightCardProps {
  children: ReactNode
  /** Defaults to `div`; pass `li`/`article` when the parent is a list. */
  as?: ElementType
  className?: string
}

export default function SpotlightCard({
  children,
  as: Tag = 'div',
  className = '',
}: SpotlightCardProps) {
  const ref = useRef<HTMLElement>(null)
  const frame = useRef(0)

  const onPointerMove = useCallback((event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse') return

    const el = ref.current
    if (!el) return

    // `clientX/Y` read here, in the event, rather than inside the rAF — the
    // event object is pooled-adjacent and its coordinates are the ones that were
    // true when it fired, not one frame later.
    const { clientX, clientY } = event

    if (frame.current) return
    frame.current = requestAnimationFrame(() => {
      frame.current = 0
      const rect = el.getBoundingClientRect()
      el.style.setProperty('--mx', `${clientX - rect.left}px`)
      el.style.setProperty('--my', `${clientY - rect.top}px`)
    })
  }, [])

  const onPointerEnter = useCallback((event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse') return
    ref.current?.style.setProperty('--spot', '1')
  }, [])

  const onPointerLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    if (frame.current) {
      cancelAnimationFrame(frame.current)
      frame.current = 0
    }
    // Only the opacity is released. The last position is kept, so re-entering
    // from the same edge does not snap the highlight across the card first.
    el.style.setProperty('--spot', '0')
  }, [])

  return (
    <Tag
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      className={`glass-card glass-card-hover group relative flex flex-col overflow-hidden ${className}`}
    >
      <span aria-hidden="true" className="spotlight" />
      {/*
        The content sits above the highlight layer. `relative` alone is enough —
        both are in the same stacking context and this one comes later.

        `flex-1` so a card given a `min-h` passes that height through to its
        content: without it the wrapper is content-sized, and a child asking for
        `h-full` resolves against a box that is shorter than the card. That is
        what makes `mt-auto` on a card body work at all.
      */}
      <div className="relative flex flex-1 flex-col">{children}</div>
    </Tag>
  )
}
