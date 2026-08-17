import React, { useEffect, useRef, useState } from 'react'
import type { CapabilityCard } from '../../data/capabilities'

interface CardSlider3DProps {
  /** The cards to show, in order. */
  items: CapabilityCard[]
  /** Width of each card, e.g. "16em". */
  cardWidth?: string
  className?: string
  /** Which way the loop drifts when it is not being dragged. */
  direction?: 'right' | 'left'
}

/**
 * A horizontal loop of cards on a 3D focal curve: cards scale, lift and resolve
 * from grey to their own colour as they pass the container's centre, and fall
 * back as they leave it.
 *
 * The track holds three copies of `items` so the wrap is seamless — the offset
 * resets by exactly one set width, which is invisible because the neighbouring
 * copy is already drawn there. Drag takes over from the drift and hands back
 * with decaying momentum.
 */
export default function CardSlider3D({
  items,
  cardWidth = '16.5em',
  className = '',
  direction = 'right',
}: CardSlider3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  const [isDraggingState, setIsDraggingState] = useState(false)

  // Drag & Motion state refs
  const isDragging = useRef(false)
  const startX = useRef(0)
  const startOffset = useRef(0)
  const currentOffset = useRef(0)
  const velocity = useRef(0)
  const lastX = useRef(0)
  const lastTime = useRef(0)

  // Repeat items 3 times for seamless infinite looping
  const triplicatedItems = [...items, ...items, ...items]

  /*
   * Whether the rail is close enough to be worth loading pictures for.
   *
   * `loading="lazy"` is not enough on its own here. It is a hint with a
   * browser-chosen threshold, and Chromium's is generous — measured, this
   * section sits 697px below the fold on a phone and Chromium fetched three
   * card images 84ms into the first paint without any scrolling. WebKit's
   * threshold is tighter and withheld them, which is why this looked fixed
   * from one engine only.
   *
   * An observer sets the distance explicitly, so both engines agree. The
   * pictures are the whole reason this matters: the rail triplicates its items
   * for the infinite loop, so fifteen elements hang off five files, and on a
   * phone they were decoding while Safari was still carrying the hero's video.
   *
   * Starts false on both sides of hydration and is only ever turned on by an
   * effect, so the prerendered markup and the browser's first pass agree.
   */
  const [nearViewport, setNearViewport] = useState(false)
  useEffect(() => {
    const element = containerRef.current
    if (!element) return
    // No IntersectionObserver: show the pictures rather than withhold them
    // forever. A missing API should not cost the reader the content.
    if (typeof IntersectionObserver === 'undefined') {
      setNearViewport(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        setNearViewport(true)
        observer.disconnect()
      },
      { rootMargin: '300px' },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const container = containerRef.current
    const track = trackRef.current
    if (!container || !track) return

    /*
     * Only animate while the rail is actually on screen.
     *
     * This loop measures fifteen cards and writes transform, opacity, z-index,
     * box-shadow and a filter on each, every frame, for as long as the page is
     * open — including the whole time the reader is up in the hero and this is
     * nowhere near the viewport. On a phone that is continuous main-thread and
     * compositor work competing with video decode, and mobile Safari kills a
     * web process that will not leave it alone.
     *
     * `nearViewport` already gates the pictures; the same signal stops the
     * frames. Position is held in refs, so the rail resumes exactly where it
     * left off rather than jumping.
     */
    if (!nearViewport) return

    let animationFrameId: number

    /*
     * The picture inside each card, looked up once. This loop runs every frame
     * for fifteen cards, and the image is mounted late by the media gate — so
     * only a found element is cached, and the lookup keeps retrying until then.
     */
    const pictures = new WeakMap<HTMLElement, HTMLImageElement>()

    // Base auto scroll speed in px per frame
    const baseSpeed = direction === 'right' ? 0.75 : -0.75

    const loop = () => {
      const oneSetWidth = track.scrollWidth / 3

      if (oneSetWidth > 0) {
        if (!isDragging.current) {
          // Apply decaying momentum velocity after drag release
          velocity.current *= 0.92
          if (Math.abs(velocity.current) < 0.05) velocity.current = 0

          currentOffset.current += baseSpeed + velocity.current

          // Infinite seamless wrap
          if (currentOffset.current > 0) {
            currentOffset.current -= oneSetWidth
          } else if (currentOffset.current < -oneSetWidth) {
            currentOffset.current += oneSetWidth
          }
        }

        // Apply 1D horizontal transform to track
        track.style.transform = `translate3d(${currentOffset.current}px, 0px, 0px)`
      }

      // Calculate 3D focal perspective & depth for each card
      const containerRect = container.getBoundingClientRect()
      const containerCenter = containerRect.left + containerRect.width / 2

      const isMobile = containerRect.width < 640
      const focalRadius = isMobile
        ? Math.min(containerRect.width * 0.45, 300)
        : Math.min(containerRect.width * 0.28, 360)

      const cardElements = track.querySelectorAll<HTMLDivElement>('[data-slider-card]')

      cardElements.forEach((card) => {
        const cardRect = card.getBoundingClientRect()
        const cardCenter = cardRect.left + cardRect.width / 2

        const distFromCenter = Math.abs(cardCenter - containerCenter)

        let centerFactor = 0
        if (distFromCenter < focalRadius) {
          const norm = distFromCenter / focalRadius
          centerFactor = Math.pow(Math.cos(norm * (Math.PI / 2)), isMobile ? 1.6 : 2.6)
        }

        const baseScale = isMobile ? 0.92 : 0.86
        const baseOpacity = isMobile ? 0.82 : 0.65
        const scale = baseScale + centerFactor * (1 - baseScale)
        const opacity = baseOpacity + centerFactor * (1 - baseOpacity)
        const translateZ = centerFactor * (isMobile ? 35 : 80)
        const zIndex = Math.round(centerFactor * 100)

        card.style.transform = `perspective(1200px) translateZ(${translateZ}px) scale(${scale})`
        card.style.opacity = `${opacity}`
        card.style.zIndex = `${zIndex}`

        /*
         * The picture resolves as the card reaches the centre: fully desaturated
         * at the edge of the focal radius, its own colour at the middle, a touch
         * brighter and haloed as it arrives.
         *
         * `grayscale` comes first in the filter list on purpose. Filters apply
         * left to right, so desaturating before the drop-shadow leaves the cyan
         * halo its colour; the other order would drain it to grey along with the
         * artwork.
         *
         * Set on the `<img>` and not on its wrapper, deliberately: the glow
         * flare is a sibling behind the image inside that same wrapper, so
         * filtering the wrapper would desaturate and dim the flare too — the
         * halo would fade out exactly as the card left the centre, which is the
         * opposite of what it is for.
         *
         * Written only when it actually changes: this runs every frame for
         * fifteen cards, and a redundant style write is a redundant repaint.
         */
        let picture = pictures.get(card)
        if (!picture) {
          const found = card.querySelector<HTMLImageElement>('[data-slider-media] img')
          if (found) {
            pictures.set(card, found)
            picture = found
          }
        }
        if (picture) {
          const grey = (1 - centerFactor).toFixed(2)
          const lift = (0.95 + centerFactor * 0.15).toFixed(2)
          const glowRadius = Math.round(centerFactor * 16)
          const glowAlpha = (centerFactor * 0.45).toFixed(2)
          const filter = `grayscale(${grey}) brightness(${lift}) drop-shadow(0px 2px ${glowRadius}px rgba(56, 189, 248, ${glowAlpha}))`
          if (picture.dataset.focus !== filter) {
            picture.style.filter = filter
            picture.dataset.focus = filter
          }
        }

        /*
         * Dynamic inside bottom border glow animation as card reaches center
         */
        const bottomGlow = card.querySelector<HTMLDivElement>('[data-bottom-inner-glow]')
        const bottomLine = card.querySelector<HTMLDivElement>('[data-bottom-glow-line]')
        if (bottomGlow && bottomLine) {
          const glowOp = (Math.pow(centerFactor, 1.3) * 0.95).toFixed(2)
          if (bottomGlow.dataset.glowOp !== glowOp) {
            bottomGlow.style.opacity = glowOp
            bottomLine.style.opacity = glowOp
            bottomGlow.dataset.glowOp = glowOp
          }
        }

        card.style.boxShadow = centerFactor > 0.08
          ? `0 ${18 * centerFactor}px ${36 * centerFactor}px rgba(0, 0, 0, ${0.4 + centerFactor * 0.3})`
          : '0 8px 20px rgba(0, 0, 0, 0.4)'
      })

      animationFrameId = requestAnimationFrame(loop)
    }

    animationFrameId = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [direction, nearViewport])

  // Drag Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true
    setIsDraggingState(true)
    startX.current = e.clientX
    startOffset.current = currentOffset.current
    lastX.current = e.clientX
    lastTime.current = performance.now()
    velocity.current = 0
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return
    const diff = e.clientX - startX.current
    currentOffset.current = startOffset.current + diff

    // Calculate instantaneous swipe velocity
    const now = performance.now()
    const dt = now - lastTime.current
    if (dt > 10) {
      velocity.current = (e.clientX - lastX.current) * (16 / dt)
      lastX.current = e.clientX
      lastTime.current = now
    }

    // Keep offset within bounds
    const track = trackRef.current
    if (track) {
      const oneSetWidth = track.scrollWidth / 3
      if (oneSetWidth > 0) {
        if (currentOffset.current > 0) {
          currentOffset.current -= oneSetWidth
          startX.current += oneSetWidth
        } else if (currentOffset.current < -oneSetWidth) {
          currentOffset.current += oneSetWidth
          startX.current -= oneSetWidth
        }
      }
    }
  }

  const handlePointerUp = () => {
    if (isDragging.current) {
      isDragging.current = false
      setIsDraggingState(false)
    }
  }


  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`relative w-full overflow-hidden py-6 sm:py-12 md:py-16 select-none touch-pan-y ${isDraggingState ? 'cursor-grabbing' : 'cursor-grab'
        } ${className}`}
      style={{ perspective: '1200px' }}
    >
      {/* Edge gradient fade masks for seamless full-width immersion */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-40 w-4 sm:w-24 md:w-40 bg-gradient-to-r from-bg via-bg/80 to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-40 w-4 sm:w-24 md:w-40 bg-gradient-to-l from-bg via-bg/80 to-transparent" />

      {/* Infinite Interactive Track */}
      <div
        ref={trackRef}
        className="flex w-max items-center gap-5 sm:gap-10 md:gap-12 pointer-events-auto"
      >
        {triplicatedItems.map((item, idx) => {
          const Icon = item.icon
          return (
            <div
              key={`${item.id}-${idx}`}
              data-slider-card
              className="group relative flex shrink-0 flex-col justify-between rounded-2xl bg-[#09090b] p-5 sm:p-6 backdrop-blur-xl transition-shadow duration-300 ease-out overflow-hidden min-h-[380px] sm:min-h-[420px]"
              style={{
                width: cardWidth,
                willChange: 'transform, opacity',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Inner border overlay layer */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/20 group-hover:ring-white/40 transition-all duration-300 z-20" />

              {/* Top edge specular highlight */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent z-10" />

              {/* Bottom gradient fade overlay */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 rounded-b-2xl bg-gradient-to-t from-black via-black/70 to-transparent z-[5]" />

              {/* Inside Bottom Border Glow (inside bottom edge only) */}
              <div
                data-bottom-inner-glow
                className="pointer-events-none absolute inset-x-0 bottom-0 h-20 rounded-b-2xl transition-opacity duration-300 z-15"
                style={{
                  background: 'linear-gradient(to top, rgba(0, 207, 255, 0.35) 0%, rgba(0, 207, 255, 0.12) 45%, rgba(0, 0, 0, 0) 100%)',
                  opacity: 0,
                }}
              />
              <div
                data-bottom-glow-line
                className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] rounded-b-2xl bg-gradient-to-r from-transparent via-cyan-400 to-transparent transition-opacity duration-300 z-20"
                style={{
                  opacity: 0,
                  boxShadow: '0 0 12px rgba(0, 207, 255, 0.8)',
                }}
              />

              {/* Bottom edge specular highlight */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />

              <div className="flex flex-col justify-between h-full">
                {/* Header row: Badge + Icon */}
                <div className="flex items-center justify-between relative z-10">
                  {Icon ? (
                    <Icon className="h-5 w-5 text-chrome group-hover:text-fg transition-colors" strokeWidth={1.75} />
                  ) : null}

                  {item.badge ? (
                    <span className="text-[10px] font-semibold tracking-wider text-fg-muted uppercase">
                      {item.badge}
                    </span>
                  ) : null}
                </div>

                {/* Seamless Integrated 3D Feature Asset */}
                {item.image ? (
                  <div
                    data-slider-media
                    /* Fixed height, so the box holds its place whether or not
                       the picture inside it has been loaded yet. Nothing moves
                       when the observer opens the gate. */
                    className="relative mt-4 -mx-5 sm:-mx-6 w-[calc(100%+2.5rem)] sm:w-[calc(100%+3rem)] h-44 sm:h-52 flex items-center justify-center overflow-visible pointer-events-none px-2"
                  >
                    {nearViewport ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      width={item.imageWidth}
                      height={item.imageHeight}
                      /*
                       * Lazy, and it matters more here than the usual byte
                       * saving suggests. The rail triplicates its items for the
                       * infinite loop, so this renders fifteen <img> elements
                       * for five pictures, all of them far below the fold on a
                       * phone. Eager made every one of them fetch and decode
                       * during the first paint — measured on an iOS profile,
                       * the page held 19 MB of decoded bitmaps — while mobile
                       * Safari was already carrying the hero's video buffers.
                       * A tab past its memory ceiling is killed and reloaded,
                       * which is what a reader sees as the page "glitching".
                       */
                      loading="lazy"
                      decoding="async"
                      className="max-h-full w-full object-contain transition-transform duration-500 group-hover:scale-105 relative z-10"
                    />
                    ) : null}
                  </div>
                ) : null}

                <div>
                  {/* Card Title */}
                  <h3 className="mt-4 text-base sm:text-lg font-semibold tracking-tight text-fg text-balance relative z-10">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-fg-muted relative z-10">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
