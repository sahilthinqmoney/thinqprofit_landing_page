import React, { useEffect, useRef, useState } from 'react'
import { Bell, Compass, Languages, Layers, LayoutGrid, Zap } from 'lucide-react'

export interface SliderCardItem {
  id: string | number
  title: string
  description: string
  icon?: React.ElementType
  badge?: string
  image?: string
}

const DEFAULT_CARDS: SliderCardItem[] = [
  {
    id: 1,
    title: 'Position Compass',
    description: 'Tracks whether open positions are moving with or against the market, not just whether they are up.',
    icon: Compass,
    badge: 'AI Analytics',
  },
  {
    id: 2,
    title: 'Option Chain Builder',
    description: 'Build multi-leg structures by tapping bids & asks, previewing complete payoff curves before execution.',
    icon: Layers,
    badge: 'Options F&O',
  },
  {
    id: 3,
    title: 'Greeks, in Plain English',
    description: 'Delta, theta and vega translated into real-time plain English sentences about P&L drivers.',
    icon: Languages,
    badge: 'Risk Engine',
  },
  {
    id: 4,
    title: 'Low-Latency Execution',
    description: 'Orders routed in milliseconds to minimize slippage between what you see and what you get.',
    icon: Zap,
    badge: 'Ultra Fast',
  },
  {
    id: 5,
    title: 'Your Workspace',
    description: 'Customizable widget grid, symbol group linking, second monitor pop-outs, and zero-install accessibility.',
    icon: LayoutGrid,
    badge: 'Multi-Monitor',
  },
  {
    id: 6,
    title: 'Alerts That Hold',
    description: 'Set a condition once and it keeps watching market triggers, whether or not your browser tab is open.',
    icon: Bell,
    badge: 'Cloud Alerts',
  },
]

interface ImageSlider3DProps {
  /** Speed of the continuous loop in seconds */
  duration?: number
  /** Width of each card element, e.g. "16em" or "20rem" */
  cardWidth?: string
  /** Custom list of cards to display */
  items?: SliderCardItem[]
  /** Custom container class */
  className?: string
  /** Auto-scroll direction: 'right' | 'left' (defaults to 'right') */
  direction?: 'right' | 'left'
}

export default function ImageSlider3D({
  duration = 38,
  cardWidth = '18em',
  items = DEFAULT_CARDS,
  className = '',
  direction = 'right',
}: ImageSlider3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  // Repeat items 3 times for seamless infinite looping
  const triplicatedItems = [...items, ...items, ...items]

  useEffect(() => {
    const container = containerRef.current
    const track = trackRef.current
    if (!container || !track) return

    let animationFrameId: number

    const updateCardTransforms = () => {
      const containerRect = container.getBoundingClientRect()
      const containerCenter = containerRect.left + containerRect.width / 2
      const radius = containerRect.width * 0.42

      const cardElements = track.querySelectorAll<HTMLDivElement>('[data-slider-card]')

      cardElements.forEach((card) => {
        const cardRect = card.getBoundingClientRect()
        const cardCenter = cardRect.left + cardRect.width / 2

        // Distance from horizontal center
        const distFromCenter = Math.abs(cardCenter - containerCenter)

        // Smooth cosine bell-curve factor (1.0 at center, smoothly tapering to 0 at radius)
        let centerFactor = 0
        if (distFromCenter < radius) {
          const norm = distFromCenter / radius
          // Smooth cosine curve for ultra-fluid easing
          centerFactor = Math.pow(Math.cos(norm * (Math.PI / 2)), 1.4)
        }

        // Calculate 3D pop up scale & depth elevation:
        // Middle card pops up smoothly to ~1.28x scale, higher z-index & glow
        const scale = 0.85 + centerFactor * 0.43 // Ranges from 0.85 up to 1.28
        const opacity = 0.55 + centerFactor * 0.45 // Ranges from 0.55 up to 1.0
        const translateZ = centerFactor * 80 // 3D depth pop out up to 80px
        const zIndex = Math.round(centerFactor * 100)
        const shadowAlpha = centerFactor * 0.5

        card.style.transform = `perspective(1200px) translateZ(${translateZ}px) scale(${scale})`
        card.style.opacity = `${opacity}`
        card.style.zIndex = `${zIndex}`
        card.style.boxShadow = `0 ${24 * centerFactor}px ${48 * centerFactor}px rgba(0, 0, 0, ${0.4 + shadowAlpha}), 0 0 ${35 * centerFactor}px rgba(255, 180, 140, ${shadowAlpha * 0.45})`
      })

      animationFrameId = requestAnimationFrame(updateCardTransforms)
    }

    animationFrameId = requestAnimationFrame(updateCardTransforms)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative w-full overflow-hidden py-16 sm:py-20 select-none ${className}`}
      style={{ perspective: '1200px' }}
    >
      {/* Edge gradient fade masks for seamless full-width immersion */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-40 w-20 sm:w-40 bg-gradient-to-r from-bg via-bg/85 to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-40 w-20 sm:w-40 bg-gradient-to-l from-bg via-bg/85 to-transparent" />

      {/* Infinite Scrolling Track (Moving in RIGHT direction with increased card spacing) */}
      <div
        ref={trackRef}
        className="flex w-max items-center gap-12 sm:gap-16 md:gap-20 transition-transform"
        style={{
          animationName: direction === 'right' ? 'marquee-right' : 'marquee-left',
          animationDuration: `${duration}s`,
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
          animationPlayState: isHovered ? 'paused' : 'running',
        }}
      >
        {triplicatedItems.map((item, idx) => {
          const Icon = item.icon
          return (
            <div
              key={`${item.id}-${idx}`}
              data-slider-card
              className="group relative flex shrink-0 flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-7 sm:p-8 backdrop-blur-xl transition-all duration-300 ease-out"
              style={{
                width: cardWidth,
                willChange: 'transform, opacity',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Subtle top edge specular light highlight */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

              <div>
                {/* Header row: Badge + Icon */}
                <div className="flex items-center justify-between">
                  {Icon ? (
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-chrome group-hover:border-white/20 group-hover:text-fg transition-colors">
                      <Icon className="h-5 w-5" strokeWidth={1.75} />
                    </div>
                  ) : null}

                  {item.badge ? (
                    <span className="rounded-full border border-border-soft bg-surface/60 px-3 py-1 text-[10px] font-semibold tracking-wider text-fg-muted uppercase backdrop-blur-md">
                      {item.badge}
                    </span>
                  ) : null}
                </div>

                {/* Card Title */}
                <h3 className="mt-6 text-lg font-semibold tracking-tight text-fg text-balance">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-fg-muted">
                  {item.description}
                </p>
              </div>

              {/* Card Footer indicator */}
              <div className="mt-7 flex items-center justify-between border-t border-white/5 pt-3.5 text-xs font-medium text-fg-subtle group-hover:text-accent-soft transition-colors">
                <span>Explore Feature</span>
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Embedded Animation Styles */}
      <style>{`
        @keyframes marquee-right {
          0% {
            transform: translateX(-33.333%);
          }
          100% {
            transform: translateX(0%);
          }
        }
        @keyframes marquee-left {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
      `}</style>
    </div>
  )
}

export function ThreeDImageSliderDemo() {
  return (
    <div className="w-full h-[600px] flex items-center justify-center bg-[#fff3ed] dark:bg-black rounded-xl overflow-hidden relative">
      <ImageSlider3D duration={36} cardWidth="16em" />
    </div>
  )
}
