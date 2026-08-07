import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import Container from '../ui/Container'
import CardSlider3D from '../ui/CardSlider3D'
import { capabilitiesIntro, capabilityCards } from '../../data/capabilities'
import type { CapabilityCard } from '../../data/capabilities'

/**
 * §4 — the rest of the terminal.
 *
 * Two presentations of one deck, chosen by viewport rather than by breakpoint
 * classes on a single tree, because they are genuinely different interactions:
 *
 *   desktop  a 3D loop that drifts and can be dragged (`CardSlider3D`)
 *   mobile   a pinned scroll track where cards stack and hand over
 *
 * The mobile track is 300vh of scroll driving a sticky viewport. Card N's
 * entrance and exit are both derived from its index, so adding a card to
 * `capabilityCards` needs no change here.
 */
export default function Capabilities() {
  return (
    <section id="capabilities" className="relative w-full isolate">
      <div className="hidden md:block py-16 lg:py-24">
        <DesktopSlider />
      </div>
      <div className="block md:hidden">
        <MobileStack />
      </div>
    </section>
  )
}

/** Deck, then a full-bleed loop that overflows the page gutters on purpose. */
function DesktopSlider() {
  return (
    <>
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="display-lead font-display text-4xl lg:text-5xl font-bold tracking-tight text-fg">
            {capabilitiesIntro.heading}
          </h2>
          <p className="mt-3 text-base lg:text-lg text-fg-muted max-w-xl mx-auto leading-relaxed">
            {capabilitiesIntro.subheading}
          </p>
        </div>
      </Container>

      <div className="-mx-4 sm:-mx-8 lg:-mx-16 xl:-mx-24 overflow-visible py-8">
        <CardSlider3D items={capabilityCards} cardWidth="16.5em" direction="right" />
      </div>
    </>
  )
}

function MobileStack() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  })

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    const last = capabilityCards.length - 1
    const index = Math.min(last, Math.max(0, Math.floor(progress * capabilityCards.length)))
    if (index !== activeIndex) setActiveIndex(index)
  })

  return (
    <div ref={trackRef} className="relative h-[300vh] w-full">
      <div className="sticky top-0 flex h-screen w-full flex-col justify-between overflow-hidden pt-16 pb-5">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="display-lead font-display text-2xl font-bold tracking-tight text-fg">
              {capabilitiesIntro.heading}
            </h2>
            <p className="mt-1.5 text-xs text-fg-muted max-w-xl mx-auto leading-relaxed">
              {capabilitiesIntro.subheading}
            </p>
          </div>
        </Container>

        <div className="relative flex-1 w-full max-w-4xl mx-auto flex items-center justify-center p-3 my-auto min-h-[470px]">
          {capabilityCards.map((card, index) => (
            <StackedCard
              key={card.id}
              card={card}
              index={index}
              total={capabilityCards.length}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>

        <StepIndicators total={capabilityCards.length} activeIndex={activeIndex} />
      </div>
    </div>
  )
}

/**
 * One card in the mobile stack.
 *
 * Each card owns a slice of the track's 0→1 progress. It rises into place over
 * its own slice, holds, then dims and sinks slightly as the next card covers
 * it. The first card starts already in place and the last one never leaves, so
 * both ends of the track are still rather than half-animated — which is why the
 * keyframe list is shorter at the edges than in the middle.
 */
function StackedCard({
  card,
  index,
  total,
  scrollYProgress,
}: {
  card: CapabilityCard
  index: number
  total: number
  scrollYProgress: MotionValue<number>
}) {
  const step = 1 / total
  const enterStart = Math.max(0, index * step - 0.05)
  const enterEnd = Math.min(1, index * step + 0.15)
  const exitStart = Math.max(0, (index + 1) * step - 0.05)
  const exitEnd = Math.min(1, (index + 1) * step + 0.15)

  const isFirst = index === 0
  const isLast = index === total - 1

  /* The progress stops this card animates across, and the value it holds at
     each one. `pick` keeps the three transforms below reading the same stops. */
  const stops = isFirst
    ? [0, exitStart, exitEnd]
    : isLast
    ? [enterStart, enterEnd, 1]
    : [enterStart, enterEnd, exitStart, exitEnd]

  const pick = (entering: number, held: number, leaving: number) =>
    isFirst ? [held, held, leaving] : isLast ? [entering, held, held] : [entering, held, held, leaving]

  const y = useTransform(scrollYProgress, stops, pick(320, 0, -14))
  const opacity = useTransform(scrollYProgress, stops, pick(0, 1, 0.4))
  const scale = useTransform(scrollYProgress, stops, pick(0.93, 1, 0.93))

  const Icon = card.icon

  return (
    <motion.div
      style={{ y, opacity, scale, zIndex: (index + 1) * 10 }}
      className="absolute inset-x-0 mx-auto flex items-center justify-center p-3"
    >
      <div className="w-full max-w-[350px] rounded-3xl border border-white/15 bg-[#09090b]/98 p-6 backdrop-blur-2xl shadow-[0_25px_65px_rgba(0,0,0,0.98),0_0_50px_rgba(8,45,54,0.45)] overflow-hidden min-h-[460px] flex flex-col justify-between">
        {/* Specular hairline along the top edge. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />

        <div className="flex flex-col justify-between h-full py-1">
          <div className="flex items-center justify-between relative z-10">
            <Icon className="h-5.5 w-5.5 text-chrome" strokeWidth={1.75} />
            <span className="text-[10px] font-semibold tracking-widest text-fg-muted uppercase">
              {card.badge}
            </span>
          </div>

          <div className="relative my-4 h-56 w-full flex items-center justify-center overflow-hidden pointer-events-none">
            <img
              src={card.image}
              alt={card.title}
              className="h-full w-full object-contain mix-blend-lighten scale-105"
            />
          </div>

          <div>
            <h3 className="mt-2 text-xl font-semibold tracking-tight text-fg">{card.title}</h3>
            <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-fg-muted">
              {card.description}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/** The dashes under the mobile stack — one per card, the active one widened. */
function StepIndicators({ total, activeIndex }: { total: number; activeIndex: number }) {
  return (
    <div className="flex items-center justify-center gap-2 pb-2 z-50">
      {Array.from({ length: total }, (_, index) => (
        <div
          key={index}
          className={`h-2 rounded-full transition-all duration-300 ${
            index === activeIndex ? 'w-7 bg-white opacity-100' : 'w-2 bg-white/30 opacity-40'
          }`}
        />
      ))}
    </div>
  )
}
