import { useRef } from 'react'
import { gsap, initScrollTrigger, useGSAP } from '../../lib/scrollTrigger'
import SectionShell from '../ui/SectionShell'
import CopyText from '../ui/CopyText'
import ThinqMark from '../ui/ThinqMark'
import { honestNote, pillars, securityHeadline } from '../../data/security'
import {
  IconDematCube,
  IconSegregatedOrbit,
  IconMultiFactorAperture,
  IconEncryptedNode,
  IconSessionRadar,
  IconOrderTrailStack,
  IconZeroConflictDiamond,
} from '../ui/SecurityIcons'

initScrollTrigger()

const allSecurityItems = [
  {
    title: pillars[0].title,
    body: pillars[0].body,
    Icon: IconDematCube,
  },
  {
    title: pillars[1].title,
    body: pillars[1].body,
    Icon: IconSegregatedOrbit,
  },
  {
    title: pillars[2].title,
    body: pillars[2].body,
    Icon: IconMultiFactorAperture,
  },
  {
    title: pillars[3].title,
    body: pillars[3].body,
    Icon: IconEncryptedNode,
  },
  {
    title: pillars[4].title,
    body: pillars[4].body,
    Icon: IconSessionRadar,
  },
  {
    title: pillars[5].title,
    body: pillars[5].body,
    Icon: IconOrderTrailStack,
  },
  {
    title: honestNote,
    body: 'We do not take the other side of your orders or sell your trade data. Our business model is strictly transparent.',
    Icon: IconZeroConflictDiamond,
  },
]

const polarPositions = [
  { left: '50.0%', top: '7.5%' },   // 0: Top (12 o'clock)
  { left: '80.1%', top: '23.6%' },  // 1: Top-Right (1:43 o'clock)
  { left: '88.5%', top: '60.0%' },  // 2: Mid-Right (3:25 o'clock)
  { left: '66.8%', top: '89.2%' },  // 3: Bottom-Right (5:08 o'clock)
  { left: '33.2%', top: '89.2%' },  // 4: Bottom-Left (6:51 o'clock)
  { left: '11.5%', top: '60.0%' },  // 5: Mid-Left (8:34 o'clock)
  { left: '19.9%', top: '23.6%' },  // 6: Top-Left (10:17 o'clock)
]

export default function Security() {
  const root = useRef<HTMLDivElement>(null)
  const orbitContainerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = root.current
      if (!el) return

      const items = gsap.utils.toArray<HTMLElement>(el.querySelectorAll('[data-feature-item]'))
      const logoMark = el.querySelector<HTMLElement>('[data-logo-mark]')
      const cyanChan = el.querySelector<HTMLElement>('[data-chromatic-cyan]')
      const redChan = el.querySelector<HTMLElement>('[data-chromatic-red]')
      const textLeft = el.querySelector<HTMLElement>('[data-logo-text-left]')
      const textRight = el.querySelector<HTMLElement>('[data-logo-text-right]')
      const orbitWrapper = orbitContainerRef.current

      if (items.length === 0 || !logoMark || !textLeft || !textRight || !orbitWrapper) return

      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        })

        // Phase 1: Logo shutter zoom in + Chromatic Aberration RGB glitch split effect
        tl.fromTo(
          logoMark,
          { scale: 0, opacity: 0 },
          { scale: 1.45, opacity: 1, duration: 0.5, ease: 'power2.out' },
        )

        if (cyanChan && redChan) {
          tl.fromTo(
            [cyanChan, redChan],
            { opacity: 0.95, x: (i) => (i === 0 ? -7 : 7) },
            { opacity: 0, x: 0, duration: 0.45, ease: 'power3.out' },
            '-=0.25',
          )
        }

        tl.to(
          logoMark,
          { scale: 1, duration: 0.35, ease: 'power3.out' },
          '-=0.35',
        )

        // Phase 1b: Thin and Trust text slide out to merge with Logo Mark as "Thin[Q] Trust"
        tl.to(
          [textLeft, textRight],
          {
            opacity: 1,
            x: 0,
            duration: 0.45,
            stagger: 0.05,
            ease: 'power2.out',
          },
          '-=0.15',
        )

        // Phase 2: Instant feature circles burst out from behind logo to polar positions
        tl.fromTo(
          items,
          { scale: 0.15, opacity: 0, left: '50%', top: '50%' },
          {
            scale: 1,
            opacity: 1,
            duration: 0.9,
            stagger: 0.08,
            ease: 'back.out(1.25)',
            left: (index) => polarPositions[index].left,
            top: (index) => polarPositions[index].top,
          },
          '-=0.2', // Triggers as Thin[Q] Trust settles
        )

        // Phase 3: Continuous 360-degree polar orbit revolution around Thin[Q] Trust
        const orbitObj = { angle: 0 }
        tl.to(orbitObj, {
          angle: Math.PI * 2,
          duration: 50,
          repeat: -1,
          ease: 'none',
          onUpdate: () => {
            const currentAngle = orbitObj.angle
            items.forEach((item, i) => {
              const baseAngle = (i * 2 * Math.PI) / 7 - Math.PI / 2
              const totalAngle = baseAngle + currentAngle
              const leftVal = 50 + 38.5 * Math.cos(totalAngle)
              const topVal = 50 + 42.5 * Math.sin(totalAngle)

              gsap.set(item, {
                left: `${leftVal}%`,
                top: `${topVal}%`,
              })
            })
          },
        })
      })

      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <SectionShell
      id="security"
      seamless
      scale="lead"
      heading={securityHeadline}
      subheading="SEBI-registered broker and member of NSE & BSE. Your funds settle to your bank, securities to your demat, and client funds are strictly segregated."
    >
      <div ref={root} className="py-16 lg:py-24 overflow-hidden">
        {/* Desktop 7-Node Radial Orbital System - Expanded Radius */}
        <div className="hidden lg:relative lg:block lg:h-[1100px] lg:w-[1360px] lg:mx-auto">
          {/* 1. CENTER BRAND LOGO LOCKUP: Thin[Q] Trust */}
          <div
            data-logo-center
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center group"
          >
            {/* Left Text: Thin */}
            <span
              data-logo-text-left
              className="font-display text-4xl lg:text-5xl font-bold tracking-tight text-fg opacity-0 -translate-x-6 whitespace-nowrap leading-none"
            >
              Thin
            </span>

            {/* Center Mark with Chromatic Aberration Effect - Aligned precisely with x-height */}
            <div
              data-logo-mark
              className="relative flex items-center justify-center shrink-0 mx-0.5 translate-y-[12px] transition-transform duration-500 group-hover:scale-105"
            >
              {/* Cyan Chromatic Split Channel */}
              <div data-chromatic-cyan className="absolute inset-0 flex items-center justify-center text-cyan-400 opacity-0 pointer-events-none mix-blend-screen">
                <ThinqMark size={68} tone="steel" className="filter drop-shadow-none" />
              </div>

              {/* Rose Chromatic Split Channel */}
              <div data-chromatic-red className="absolute inset-0 flex items-center justify-center text-rose-500 opacity-0 pointer-events-none mix-blend-screen">
                <ThinqMark size={68} tone="steel" className="filter drop-shadow-none" />
              </div>

              {/* Primary Metallic Vector Mark acting as 'q' */}
              <ThinqMark size={68} tone="copper" />
            </div>

            {/* Right Text: Trust */}
            <span
              data-logo-text-right
              className="font-display text-4xl lg:text-5xl font-bold tracking-tight text-fg opacity-0 translate-x-6 whitespace-nowrap leading-none ml-2"
            >
              Trust
            </span>
          </div>

          {/* 2. REVOLVING ORBIT CONTAINER (7 Satellite Nodes with Fixed Width w-[320px]) */}
          <div ref={orbitContainerRef} className="absolute inset-0 z-10 pointer-events-none">
            {allSecurityItems.map((item, i) => {
              const Icon = item.Icon
              const pos = polarPositions[i]
              return (
                <div
                  key={item.title}
                  data-feature-item
                  className="absolute flex flex-col items-center text-center group w-[320px] shrink-0 -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                  style={{ left: pos.left, top: pos.top }}
                >
                  {/* Circular Glass Badge */}
                  <div className="mb-4 flex h-28 w-28 sm:h-32 sm:w-32 items-center justify-center rounded-full border border-white/15 bg-surface/85 p-5 backdrop-blur-xl shadow-2xl transition-all duration-500 group-hover:border-white/40 group-hover:bg-surface/95 group-hover:scale-105">
                    <Icon className="h-20 w-20 sm:h-22 sm:w-22 text-white/90 transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <h3 className="text-base sm:text-lg font-display font-semibold text-fg leading-snug w-full px-2">{item.title}</h3>
                  {/* Subtitle text revealed smoothly on hover */}
                  <div className="opacity-0 max-h-0 overflow-hidden transition-all duration-300 ease-out group-hover:opacity-100 group-hover:max-h-36 group-hover:mt-2 pointer-events-none group-hover:pointer-events-auto w-full px-2">
                    <CopyText source={item.body} className="text-xs sm:text-sm text-fg-muted leading-relaxed" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Responsive Layout for Mobile & Tablet (< lg) */}
        <div className="block lg:hidden max-w-5xl mx-auto space-y-16 px-4 sm:px-6">
          {/* Mobile Center Logo Lockup */}
          <div data-logo-center className="py-8 flex items-center justify-center text-center group my-4">
            <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-fg leading-none">
              Thin
            </span>
            <div className="flex items-center justify-center shrink-0 mx-0.5 translate-y-[2px]">
              <ThinqMark size={48} tone="copper" />
            </div>
            <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-fg leading-none ml-1.5">
              Trust
            </span>
          </div>

          <div className="grid gap-x-10 gap-y-16 sm:grid-cols-2">
            {allSecurityItems.map((item) => {
              const Icon = item.Icon
              return (
                <div key={item.title} data-feature-item className="flex flex-col items-center text-center group">
                  <div className="mb-5 flex h-28 w-28 items-center justify-center rounded-full border border-white/15 bg-surface/75 p-5 backdrop-blur-xl shadow-xl">
                    <Icon className="h-20 w-20 text-white/90" />
                  </div>
                  <h3 className="text-lg font-display font-semibold text-fg text-balance">{item.title}</h3>
                  {/* Subtitle text revealed on hover */}
                  <div className="opacity-0 max-h-0 overflow-hidden transition-all duration-300 ease-out group-hover:opacity-100 group-hover:max-h-36 group-hover:mt-2.5 pointer-events-none group-hover:pointer-events-auto">
                    <CopyText source={item.body} className="text-sm text-fg-muted max-w-[21em]" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </SectionShell>
  )
}
