import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent, MotionValue } from 'framer-motion'
import Container from '../ui/Container'
import { capabilitiesIntro } from '../../data/capabilities'
import ImageSlider3D, { DEFAULT_CARDS } from '../lightswind/3d-image-slider'
import type { SliderCardItem } from '../lightswind/3d-image-slider'

function StackedCardMobile({
  item,
  index,
  total,
  scrollYProgress,
}: {
  item: SliderCardItem
  index: number
  total: number
  scrollYProgress: MotionValue<number>
}) {
  const step = 1 / total

  const start = Math.max(0, index * step - 0.05)
  const end = Math.min(1, index * step + 0.15)
  const nextStart = Math.max(0, (index + 1) * step - 0.05)
  const nextEnd = Math.min(1, (index + 1) * step + 0.15)

  const y = useTransform(
    scrollYProgress,
    index === 0
      ? [0, nextStart, nextEnd]
      : index === total - 1
      ? [start, end, 1]
      : [start, end, nextStart, nextEnd],
    index === 0
      ? [0, 0, -14]
      : index === total - 1
      ? [320, 0, 0]
      : [320, 0, 0, -14]
  )

  const opacity = useTransform(
    scrollYProgress,
    index === 0
      ? [0, nextStart, nextEnd]
      : index === total - 1
      ? [start, end, 1]
      : [start, end, nextStart, nextEnd],
    index === 0
      ? [1, 1, 0.4]
      : index === total - 1
      ? [0, 1, 1]
      : [0, 1, 1, 0.4]
  )

  const scale = useTransform(
    scrollYProgress,
    index === 0
      ? [0, nextStart, nextEnd]
      : index === total - 1
      ? [start, end, 1]
      : [start, end, nextStart, nextEnd],
    index === 0
      ? [1, 1, 0.93]
      : index === total - 1
      ? [0.93, 1, 1]
      : [0.93, 1, 1, 0.93]
  )

  const Icon = item.icon
  const zIndex = (index + 1) * 10

  return (
    <motion.div
      style={{
        y,
        opacity,
        scale,
        zIndex,
      }}
      className="absolute inset-x-0 mx-auto flex items-center justify-center p-3"
    >
      <div className="w-full max-w-[350px] rounded-3xl border border-white/15 bg-[#09090b]/98 p-6 backdrop-blur-2xl shadow-[0_25px_65px_rgba(0,0,0,0.98),0_0_50px_rgba(8,45,54,0.45)] overflow-hidden min-h-[460px] flex flex-col justify-between">
        {/* Top specular light line */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />

        <div className="flex flex-col justify-between h-full py-1">
          {/* Header row: Badge + Icon */}
          <div className="flex items-center justify-between relative z-10">
            {Icon ? (
              <Icon className="h-5.5 w-5.5 text-chrome" strokeWidth={1.75} />
            ) : (
              <div />
            )}

            {item.badge ? (
              <span className="text-[10px] font-semibold tracking-widest text-fg-muted uppercase">
                {item.badge}
              </span>
            ) : null}
          </div>

          {/* 3D Feature Graphic Asset */}
          {item.image ? (
            <div className="relative my-4 h-56 w-full flex items-center justify-center overflow-hidden pointer-events-none">
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-contain mix-blend-lighten scale-105"
              />
            </div>
          ) : null}

          <div>
            <h3 className="mt-2 text-xl font-semibold tracking-tight text-fg">
              {item.title}
            </h3>
            <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-fg-muted">
              {item.description}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Capabilities() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const index = Math.min(
      DEFAULT_CARDS.length - 1,
      Math.max(0, Math.floor(latest * DEFAULT_CARDS.length))
    )
    if (index !== activeIndex) {
      setActiveIndex(index)
    }
  })

  return (
    <section id="capabilities" className="relative w-full isolate">
      {/* =================================================================== */}
      {/* DESKTOP VIEW (md:block): Restored Interactive 3D Card Slider        */}
      {/* =================================================================== */}
      <div className="hidden md:block py-16 lg:py-24">
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

        {/* 3D Image Slider covering full width */}
        <div className="-mx-4 sm:-mx-8 lg:-mx-16 xl:-mx-24 overflow-visible py-8">
          <ImageSlider3D duration={32} cardWidth="16.5em" direction="right" />
        </div>
      </div>

      {/* =================================================================== */}
      {/* MOBILE VIEW (md:hidden): Pinned Card Stacking Scroll Track          */}
      {/* =================================================================== */}
      <div className="block md:hidden">
        <div ref={containerRef} className="relative h-[300vh] w-full">
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

            {/* Mobile Cards Stack Container */}
            <div className="relative flex-1 w-full max-w-4xl mx-auto flex items-center justify-center p-3 my-auto min-h-[470px]">
              {DEFAULT_CARDS.map((item, index) => (
                <StackedCardMobile
                  key={item.id}
                  item={item}
                  index={index}
                  total={DEFAULT_CARDS.length}
                  scrollYProgress={scrollYProgress}
                />
              ))}
            </div>

            {/* Bottom Progress Step Indicators */}
            <div className="flex items-center justify-center gap-2 pb-2 z-50">
              {DEFAULT_CARDS.map((card, idx) => (
                <div
                  key={card.id}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === activeIndex
                      ? 'w-7 bg-white opacity-100'
                      : 'w-2 bg-white/30 opacity-40'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
