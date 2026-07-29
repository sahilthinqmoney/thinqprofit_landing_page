import { Boxes, Building2, Landmark, ShieldCheck, Vault } from 'lucide-react'
import Container from '../ui/Container'
import { registrations, trustLabel } from '../../data/hero'

/**
 * §4 Trust strip. Position 4 in the Trust & Authority spine (landing.md §7):
 * "are you real" is answered before "what do you cost".
 *
 * Deliberately not a SectionShell — the label is a small uppercase rule, not a
 * display heading, so nothing competes with the hero H1. No logos: we have none,
 * and typography is enough. Values stay in their [placeholder] form until
 * compliance supplies verified codes.
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
        <div className="py-7 sm:py-8">
          <div className="flex items-center gap-4">
            <h2
              id="registrations-label"
              className="shrink-0 text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-fg-muted"
            >
              {trustLabel}
            </h2>
            <span aria-hidden="true" className="h-px flex-1 bg-border-soft" />
          </div>

          <ul className="mt-4 grid grid-cols-1 sm:mt-6 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-6 lg:grid-cols-5 lg:gap-x-5">
            {registrations.map((registration) => {
              const Icon = icons[registration.icon] ?? ShieldCheck

              return (
                <li
                  key={registration.authority}
                  className="flex items-baseline justify-between gap-4 border-t border-border-soft py-3 sm:block sm:border-l sm:border-t-0 sm:py-0 sm:pl-4"
                >
                  <span className="flex min-w-0 items-center gap-1.5 text-[0.8125rem] font-medium leading-snug text-fg">
                    <Icon
                      className="h-3.5 w-3.5 shrink-0 text-fg-subtle"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                    {registration.authority}
                  </span>
                  <span className="tabular shrink-0 font-mono text-xs leading-snug text-fg-muted sm:mt-1.5 sm:block">
                    {registration.value}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      </Container>
    </section>
  )
}
