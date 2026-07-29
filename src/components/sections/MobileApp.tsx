import { BellRing, LayoutGrid, ScanFace, Smartphone, Star, WifiOff } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Button from '../ui/Button'
import Container from '../ui/Container'
import CopyText from '../ui/CopyText'
import MediaPlaceholder from '../ui/MediaPlaceholder'
import Reveal from '../ui/Reveal'
import { appCopy, appFeatures } from '../../data/app'

/**
 * §9 Mobile app.
 *
 * The one section where the App-Store treatment is allowed
 * (design-system/thinqprofit/pages/landing.md §1, conflict 3): device frame,
 * store badges and a scan-to-install block. Everywhere else the page runs the
 * Trust & Authority spine.
 *
 * Store CTAs are secondary — the page has exactly one primary action, and it
 * isn't "download an app".
 */
interface MobileAppProps {
  id?: string
}

const featureIcons: Record<string, LucideIcon> = {
  'scan-face': ScanFace,
  'layout-grid': LayoutGrid,
  'bell-ring': BellRing,
  'wifi-off': WifiOff,
}

export default function MobileApp({ id = 'mobile-app' }: MobileAppProps) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-border-soft py-12 sm:py-16 lg:py-24">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* ---------------------------------------------------------------- */}
          {/* Copy column                                                      */}
          {/* ---------------------------------------------------------------- */}
          <div>
            <Reveal>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent-soft">
                {appCopy.eyebrow}
              </p>
              <h2 className="mt-3 text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-[1.15] tracking-[-0.015em] text-fg">
                {appCopy.heading}
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-fg-muted">
                {appCopy.body}
              </p>
            </Reveal>

            <Reveal delay={60}>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {appFeatures.map((feature) => {
                  const Icon = featureIcons[feature.icon] ?? Smartphone
                  return (
                    <li
                      key={feature.label}
                      className="flex items-start gap-3 rounded-xl border border-border-soft bg-surface/50 px-4 py-3"
                    >
                      <Icon
                        className="mt-0.5 h-5 w-5 shrink-0 text-accent-soft"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                      <span className="text-base leading-relaxed text-fg-muted">{feature.label}</span>
                    </li>
                  )
                })}
              </ul>
            </Reveal>

            {/* Text-only store CTAs. lucide ships no brand marks — its `Apple`
                glyph is a piece of fruit, not the Apple Inc. wordmark — and
                Footer.tsx makes the same call for the social row. The deck's
                labels name both stores unambiguously without a badge. */}
            <Reveal delay={120}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {appCopy.storeCtas.map((cta) => (
                  <Button key={cta.label} href={cta.href} variant="secondary">
                    {cta.label}
                  </Button>
                ))}
              </div>
            </Reveal>

            {/* Scan-to-install + store ratings. The bracketed values are
                unfilled placeholders from the copy deck — do not substitute a
                number that hasn't been pulled from the live store listing. */}
            <Reveal delay={180}>
              <div className="mt-6 flex flex-col items-start gap-4 rounded-2xl border border-border-soft bg-surface/40 p-4 sm:flex-row sm:items-center sm:gap-5">
                {/* Sized by a wrapper, not a `w-*` on the placeholder itself —
                    MediaPlaceholder carries `w-full`, and two width utilities on
                    one element resolve by stylesheet order, not source order. */}
                <div className="w-32 shrink-0 sm:w-36">
                  <MediaPlaceholder
                    kind="image"
                    aspect="aspect-square"
                    label="QR code to the ThinqProfit app listing"
                    alt="QR code that opens the ThinqProfit app listing"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-base font-medium leading-relaxed text-fg">{appCopy.qrLine}</p>
                  <div className="mt-2 flex items-start gap-2 text-sm leading-relaxed text-fg-muted">
                    <Star className="mt-1 h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                    <CopyText source={appCopy.ratingLine} className="min-w-0 flex-1" />
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* Device frame                                                     */}
          {/* ---------------------------------------------------------------- */}
          <Reveal delay={60}>
            <div className="relative mx-auto w-full max-w-[300px]">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-6 inset-y-12 rounded-full bg-accent/10 blur-3xl"
              />
              <div className="relative rounded-[1.75rem] border border-border bg-surface p-2.5 shadow-2xl">
                <div aria-hidden="true" className="mx-auto mb-2 h-1 w-12 rounded-full bg-border" />
                <MediaPlaceholder
                  kind="screen"
                  aspect="aspect-[9/17]"
                  label="ThinqProfit app — watchlist, order ticket and positions"
                  alt="ThinqProfit app showing a watchlist with an open order ticket"
                />
                <div aria-hidden="true" className="mx-auto mt-2 h-1 w-20 rounded-full bg-border" />
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
