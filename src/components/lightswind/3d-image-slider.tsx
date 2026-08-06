import React, { useEffect, useRef } from 'react'
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
    image: '/images/capabilities/compass.png',
  },
  {
    id: 2,
    title: 'Option Chain Builder',
    description: 'Build multi-leg structures by tapping bids & asks, previewing complete payoff curves before execution.',
    icon: Layers,
    badge: 'Options F&O',
    image: '/images/capabilities/option_chain.png',
  },
  {
    id: 3,
    title: 'Greeks, in Plain English',
    description: 'Delta, theta and vega translated into real-time plain English sentences about P&L drivers.',
    icon: Languages,
    badge: 'Risk Engine',
    image: '/images/capabilities/greeks_prism.png',
  },
  {
    id: 4,
    title: 'Low-Latency Execution',
    description: 'Orders routed in milliseconds to minimize slippage between what you see and what you get.',
    icon: Zap,
    badge: 'Ultra Fast',
    image: '/images/capabilities/low_latency.png',
  },
  {
    id: 5,
    title: 'Your Workspace',
    description: 'Customizable widget grid, symbol group linking, second monitor pop-outs, and zero-install accessibility.',
    icon: LayoutGrid,
    badge: 'Multi-Monitor',
    image: '/images/capabilities/workspace.jpg',
  },
  {
    id: 6,
    title: 'Alerts That Hold',
    description: 'Set a condition once and it keeps watching market triggers, whether or not your browser tab is open.',
    icon: Bell,
    badge: 'Cloud Alerts',
    image: '/images/capabilities/alerts.png',
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
  cardWidth = '16.5em',
  items = DEFAULT_CARDS,
  className = '',
  direction = 'right',
}: ImageSlider3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

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

      // Smooth focal radius for fluid 3D scale & depth transition
      const focalRadius = Math.min(containerRect.width * 0.28, 360)

      const cardElements = track.querySelectorAll<HTMLDivElement>('[data-slider-card]')

      cardElements.forEach((card) => {
        const cardRect = card.getBoundingClientRect()
        const cardCenter = cardRect.left + cardRect.width / 2

        // Distance from exact viewport center
        const distFromCenter = Math.abs(cardCenter - containerCenter)

        // Smooth continuous cosine curve for fluid motion
        let centerFactor = 0
        if (distFromCenter < focalRadius) {
          const norm = distFromCenter / focalRadius
          centerFactor = Math.pow(Math.cos(norm * (Math.PI / 2)), 2.6)
        }

        // Fluid 3D scale, opacity, and Z-elevation
        const scale = 0.86 + centerFactor * 0.32
        const opacity = 0.65 + centerFactor * 0.35
        const translateZ = centerFactor * 80
        const zIndex = Math.round(centerFactor * 100)

        card.style.transform = `perspective(1200px) translateZ(${translateZ}px) scale(${scale})`
        card.style.opacity = `${opacity}`
        card.style.zIndex = `${zIndex}`

        // Rich ocean cyan (#082d36) ambient glow for active focal card
        const glowAlpha = centerFactor * 0.75
        card.style.boxShadow = centerFactor > 0.08
          ? `0 ${18 * centerFactor}px ${36 * centerFactor}px rgba(0, 0, 0, ${0.4 + centerFactor * 0.3}), 0 0 ${35 * centerFactor}px rgba(8, 45, 54, ${glowAlpha}), 0 0 ${18 * centerFactor}px rgba(12, 70, 84, ${glowAlpha * 0.8})`
          : '0 8px 20px rgba(0, 0, 0, 0.4)'

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
      className={`relative w-full overflow-hidden py-12 sm:py-16 select-none ${className}`}
      style={{ perspective: '1200px' }}
    >
      {/* Edge gradient fade masks for seamless full-width immersion */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-40 w-20 sm:w-40 bg-gradient-to-r from-bg via-bg/85 to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-40 w-20 sm:w-40 bg-gradient-to-l from-bg via-bg/85 to-transparent" />

      {/* Infinite Scrolling Track (Continuously runs WITHOUT pausing on hover) */}
      <div
        ref={trackRef}
        className="flex w-max items-center gap-8 sm:gap-10 md:gap-12 transition-transform"

        style={{
          animationName: direction === 'right' ? 'marquee-right' : 'marquee-left',
          animationDuration: `${duration}s`,
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
          animationPlayState: 'running', // Continuous animation on hover
        }}
      >
        {triplicatedItems.map((item, idx) => {
          const Icon = item.icon
          return (
            <div
              key={`${item.id}-${idx}`}
              data-slider-card
              className="group relative flex shrink-0 flex-col justify-between rounded-2xl border border-white/15 bg-[#09090b] p-4 sm:p-5 backdrop-blur-xl transition-all duration-300 ease-out overflow-hidden"
              style={{
                width: cardWidth,
                willChange: 'transform, opacity',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Subtle top edge specular steel light highlight */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent z-10" />

              <div>
                {/* Header row: Badge + Icon */}
                <div className="flex items-center justify-between relative z-10">
                  {Icon ? (
                    <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-chrome group-hover:border-white/30 group-hover:text-fg transition-colors">
                      <Icon className="h-4 w-4" strokeWidth={1.75} />
                    </div>
                  ) : null}

                  {item.badge ? (
                    <span className="rounded-full border border-border-soft bg-surface/80 px-2.5 py-0.5 text-[9px] font-semibold tracking-wider text-fg-muted uppercase backdrop-blur-md">
                      {item.badge}
                    </span>
                  ) : null}
                </div>

                {/* Seamless Integrated 3D Feature Asset */}
                {item.image ? (
                  <div className="relative mt-3 h-36 w-full flex items-center justify-center overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-contain mix-blend-lighten transition-transform duration-500 group-hover:scale-108"
                    />
                  </div>
                ) : null}


                {/* Card Title */}
                <h3 className="mt-3.5 text-base font-semibold tracking-tight text-fg text-balance relative z-10">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="mt-1.5 text-xs leading-relaxed text-fg-muted relative z-10">
                  {item.description}
                </p>
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
    <div className="w-full h-[600px] flex items-center justify-center bg-black rounded-xl overflow-hidden relative">
      <ImageSlider3D duration={36} cardWidth="16em" />
    </div>
  )
}
