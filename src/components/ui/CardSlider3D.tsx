import React, { useEffect, useRef, useState } from 'react'
import type { CapabilityCard } from '../../data/capabilities'
import ProgressiveImage from './ProgressiveImage'

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
 * A horizontal loop of cards on a 3D focal curve: cards scale and lift as they
 * pass the container's centre, and fall back as they leave it.
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

  useEffect(() => {
    const container = containerRef.current
    const track = trackRef.current
    if (!container || !track) return

    let animationFrameId: number

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

        const glowAlpha = centerFactor * 0.75
        card.style.boxShadow = centerFactor > 0.08
          ? `0 ${18 * centerFactor}px ${36 * centerFactor}px rgba(0, 0, 0, ${0.4 + centerFactor * 0.3}), 0 0 ${35 * centerFactor}px rgba(8, 45, 54, ${glowAlpha}), 0 0 ${18 * centerFactor}px rgba(12, 70, 84, ${glowAlpha * 0.8})`
          : '0 8px 20px rgba(0, 0, 0, 0.4)'
      })

      animationFrameId = requestAnimationFrame(loop)
    }

    animationFrameId = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [direction])

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
      className={`relative w-full overflow-hidden py-6 sm:py-12 md:py-16 select-none touch-pan-y ${
        isDraggingState ? 'cursor-grabbing' : 'cursor-grab'
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
              className="group relative flex shrink-0 flex-col justify-between rounded-2xl border border-white/15 bg-[#09090b] p-5 sm:p-6 backdrop-blur-xl transition-shadow duration-300 ease-out overflow-hidden min-h-[380px] sm:min-h-[420px]"
              style={{
                width: cardWidth,
                willChange: 'transform, opacity',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Top edge specular highlight */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent z-10" />

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
                  <div className="relative mt-4 h-40 sm:h-48 w-full flex items-center justify-center overflow-hidden pointer-events-none">
                    <ProgressiveImage
                      fill
                      src={item.image}
                      alt={item.title}
                      width={item.imageWidth}
                      height={item.imageHeight}
                      imageClassName={`object-contain transition-transform duration-500 group-hover:scale-108 ${
                        item.image.includes('alerts') || item.image.includes('workspace') || item.image.includes('greeks') ? '' : 'mix-blend-lighten'
                      }`}
                    />
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
