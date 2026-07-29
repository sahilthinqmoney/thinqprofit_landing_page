import { Boxes, Building2, Landmark, ShieldCheck, Vault } from 'lucide-react'
import Container from '../ui/Container'
import { registrations, trustLabel } from '../../data/hero'

/**
 * §4 Trust strip. Position 4 in the Trust & Authority spine (landing.md §7):
 * "are you real" is answered before "what do you cost".
 *
 * Deliberately not a SectionShell and deliberately NOT full-height — this is a
 * thin band, and the label is a small uppercase rule rather than a display
 * heading, so nothing competes with the hero H1. No logos: we have none, and
 * typography is enough. Values stay in their [placeholder] form until compliance
 * supplies verified codes.
 *
 * Layout: stacked (label over a hairline, registrations beneath) up to lg. From
 * xl the label moves inline at the left and the five registrations take the
 * remaining width, so on a 1344–1664px container the band reads as one
 * considered horizontal rule of proof rather than five items adrift in space.
 *
 * No `font-mono` anywhere — Inter is the only face loaded, so a mono utility
 * would fall through to the OS monospace stack and render the registration
 * codes in a different typeface from every other glyph on the page. `.tabular`
 * gives the fixed-advance digits; tracking and weight do the distinguishing.
 */
const icons: Record<string, typeof ShieldCheck> = {
  'shield-check': ShieldCheck,
  landmark: Landmark,
  'building-2': Building2,
  boxes: Boxes,
  vault: Vault,
}

export default function TrustStrip() {
  return (
    <section
      id="registrations"
      aria-labelledby="registrations-label"
      className="border-y border-border-soft"
    >
      <Container>
        <div className="py-7 sm:py-8 xl:py-9">
          <div className="xl:flex xl:items-center xl:gap-8 2xl:gap-12">
            <div className="flex items-center gap-4 xl:shrink-0">
              <h2
                id="registrations-label"
                className="shrink-0 text-xs font-medium uppercase tracking-[0.22em] text-fg-muted"
              >
                {trustLabel}
              </h2>
              {/* The rule ties the label to the items while they sit stacked.
                  From xl the items themselves sit on the label's line. */}
              <span aria-hidden="true" className="h-px flex-1 bg-border-soft xl:hidden" />
            </div>

            <ul className="mt-4 grid grid-cols-1 sm:mt-6 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-6 lg:grid-cols-5 lg:gap-x-6 xl:mt-0 xl:min-w-0 xl:flex-1">
              {registrations.map((registration) => {
                const Icon = icons[registration.icon] ?? ShieldCheck

                return (
                  <li
                    key={registration.authority}
                    className="flex items-baseline justify-between gap-4 border-t border-border-soft py-3 sm:block sm:border-l sm:border-t-0 sm:py-0 sm:pl-4 xl:pl-5"
                  >
                    <span className="flex min-w-0 items-center gap-1.5 text-[0.8125rem] font-medium leading-snug text-fg xl:gap-2 xl:text-sm">
                      <Icon
                        className="h-3.5 w-3.5 shrink-0 text-fg-muted xl:h-4 xl:w-4"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                      {registration.authority}
                    </span>
                    <span className="tabular shrink-0 text-xs font-medium leading-snug tracking-wide text-fg-muted sm:mt-1.5 sm:block xl:mt-2 xl:text-[0.8125rem]">
                      {registration.value}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  )
}
