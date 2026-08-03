import Container from '../ui/Container'
import { RAIL } from '../ui/SectionShell'
import { hasPlaceholder } from '../../lib/copyTokens'
import { registrations, trustLabel } from '../../data/hero'

/**
 * §4 Trust strip. Position 4 in the Trust & Authority spine (landing.md §7):
 * "are you real" is answered before "what do you cost".
 *
 * Deliberately not a SectionShell and deliberately NOT full-height — this is a
 * thin band, and its label stays small so nothing competes with the hero H1.
 * No logos: we have none, and typography is enough. Values stay in their
 * [placeholder] form until compliance supplies verified codes.
 *
 * The label is sentence case, not uppercase with 0.22em tracking. That
 * treatment was doing duty as *the* secondary type style in six different
 * sections — eyebrows, table headers, footer column heads, stat labels — which
 * made it a default rather than a decision. It is gone from all of them.
 *
 * The per-row icons are gone too. Five glyphs of equal weight beside five
 * authority names added no information the names did not already carry, and
 * repeated the icon-in-a-row pattern this pass removed everywhere else.
 *
 * Layout: stacked (label over a hairline, registrations beneath) up to lg. From
 * xl the label moves inline at the left and the five registrations take the
 * remaining width, so on a 1344–1664px container the band reads as one
 * considered horizontal rule of proof rather than five items adrift in space.
 *
 * NUMERALS — this comment used to say the exact opposite and has been rewritten,
 * not patched. It read: "No `font-mono` anywhere — only Instrument Sans and
 * Instrument Serif are loaded, so a mono utility would fall through to the OS
 * monospace stack and render the registration codes in a face that appears
 * nowhere else on the page." Both premises are now false. The page loads IBM
 * Plex Sans and IBM Plex Mono, and DESIGN.md §5 puts every numeral on the mono,
 * tabular — so the registration code is one of the four places on this page where
 * a monospaced face is the correct face, not a fallback.
 *
 * The call site does not change: `.tabular` is still the hook, and index.css now
 * resolves it to `var(--font-mono)` with `tabular-nums lining-nums`. Nothing here
 * needed a component edit, which is the point of having had the utility.
 *
 * Why the swap is free at this size: IBM Plex Sans's "0" advances 600/em at
 * `wdth` 100 and is constant across weights 300/400/600, and IBM Plex Mono's
 * advance is also exactly 600/em. A digit moving from Sans to Mono at full width
 * moves by zero, so the codes occupy the same box they did.
 *
 * Two constraints that come with it, written down rather than discovered later:
 *
 *  - The mono costs +19% on LETTERS (600/em against Plex Sans's 504.3/em
 *    lowercase). A registration code is digits and hyphens; a sentence is not.
 *    `.tabular` belongs on figures and codes and never on prose that merely
 *    contains a figure.
 *  - The mono is imported at `latin-400` only and `font-synthesis: none` is set,
 *    so a `.tabular` span under a non-400 ancestor renders 400 silently rather
 *    than synthesising a bold. This span inherits 400. That is a constraint on
 *    future use, not a defect today.
 */
export default function TrustStrip() {
  return (
    <section
      id="registrations"
      aria-labelledby="registrations-label"
      className="border-y border-border-soft"
    >
      <Container>
        {/* `SectionShell`'s rail, imported rather than transcribed — this was a
            hand-copied `w-full max-w-[84rem]`, and it silently missed the
            `mx-auto` when that was added there. Vertical padding stays local and
            deliberately below `SECTION_Y`: this band is punctuation between two
            sections, not a section. */}
        <div className={`${RAIL} py-7 sm:py-8 xl:py-9`}>
          <div className="xl:flex xl:items-center xl:gap-8 2xl:gap-12">
            <div className="flex items-center gap-4 xl:shrink-0">
              <h2
                id="registrations-label"
                className="shrink-0 text-sm text-fg-muted"
              >
                {trustLabel}
              </h2>
              {/* The rule ties the label to the items while they sit stacked.
                  From xl the items themselves sit on the label's line. */}
              <span aria-hidden="true" className="h-px flex-1 bg-border-soft xl:hidden" />
            </div>

            <ul className="mt-4 grid grid-cols-1 sm:mt-6 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-6 lg:grid-cols-5 lg:gap-x-6 xl:mt-0 xl:min-w-0 xl:flex-1">
              {registrations.map((registration) => (
                <li
                  key={registration.authority}
                  className="flex items-baseline justify-between gap-4 border-t border-border-soft py-3 sm:block sm:border-l sm:border-t-0 sm:py-0 sm:pl-4 xl:pl-5"
                >
                  <span className="min-w-0 text-[0.8125rem] font-medium leading-snug text-fg xl:text-sm">
                    {registration.authority}
                  </span>
                  {/*
                    The code renders only when it is a real code.

                    Four of the five are still `[Member code]` / `[IN-DP-XXX-XXXX]`,
                    and this band set them in plain muted grey — so unlike every
                    other placeholder on the page, which `CopyText` flags in
                    warning colour, these read as genuine registration codes that
                    happened to be illegible. Two treatments for the same thing,
                    and the more misleading one on the band that exists to be
                    believed.

                    Routing them through `CopyText` instead would be consistent
                    but wrong here: five orange bracketed tokens is what the Stats
                    band looked like before it stopped rendering unverified
                    figures. The authority name is the claim and it is true today;
                    the code is corroborating detail that either exists or does
                    not. So the name always shows and the code waits.
                  */}
                  {!hasPlaceholder(registration.value) && (
                    <span className="tabular shrink-0 text-xs leading-snug text-fg-muted sm:mt-1.5 sm:block xl:mt-2 xl:text-[0.8125rem]">
                      {registration.value}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  )
}
