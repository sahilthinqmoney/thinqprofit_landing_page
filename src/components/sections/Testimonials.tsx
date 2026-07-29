import CopyText from '../ui/CopyText'
import Disclosure from '../ui/Disclosure'
import Reveal from '../ui/Reveal'
import SectionShell from '../ui/SectionShell'
import { testimonials, testimonialDisclaimer } from '../../data/social'
import type { Testimonial } from '../../types'

/**
 * §12 Testimonials.
 *
 * Rebuilt as an editorial spread rather than three equal cards. The 3-up grid
 * was the most generic social-proof layout available: it gave three quotes the
 * same weight, the same box and the same picture of a quotation mark, which told
 * a reader nothing except that a testimonial section was required. Here one
 * quote is pulled and set in the serif at display scale, and the other two run
 * as compact attributed lines in the right column — the layout itself says which
 * one is worth stopping for.
 *
 * What went, and why:
 *  - the `Quote` glyph. A quotation set in a serif with real typographic marks
 *    (U+201C / U+201D, hung left on the pull quote) is already legible as a
 *    quotation. The icon was a picture of punctuation sitting next to punctuation.
 *  - the initial-letter avatar circles. There are no customers yet; a circle
 *    holding the first letter of `[Name]` is placeholder chrome dressed as a
 *    person, and it survived only because avatars are what testimonial cards
 *    have. The em dash does the attributing, which is what an em dash is for.
 *  - the card borders, surfaces and hover states. Nothing here is interactive,
 *    so nothing is drawn as a control.
 *
 * COMPLIANCE — unchanged and non-negotiable:
 *  - every `[Name]`, `[City]` and `[YEAR]` is still an unfilled deck value and
 *    still routes through `CopyText`, so it renders visibly flagged. No name,
 *    city, year, rating or outcome is invented anywhere in this file.
 *  - attributions wrap rather than truncate — "Ramakrishnan Venkataraman,
 *    Thiruvananthapuram" must not be silently ellipsised once real, consented
 *    quotes land.
 *  - `testimonialDisclaimer` is required under the block. It stays live text at
 *    `fg-muted` (8.07:1), left-aligned with the rest of the section, never baked
 *    into an image and never behind a blur.
 */

/**
 * Left-aligned measure shared by the quote block and the disclaimer, so both
 * hang off the same edge as the H2. Not centred: on an ultrawide display a
 * centred block would drift out from under a left-aligned heading.
 */
const MEASURE = 'w-full max-w-[84rem]'

/** Real typographic marks, applied at render so the deck string stays untouched. */
function quoted(text: string): string {
  return `“${text}”`
}

interface AttributionProps {
  testimonial: Testimonial
  /** The pulled quote carries its attribution one step larger. */
  emphasis?: 'lead' | 'compact'
}

function Attribution({ testimonial, emphasis = 'compact' }: AttributionProps) {
  const { name, city, meta } = testimonial

  return (
    <figcaption
      className={`flex flex-wrap items-baseline gap-x-2 gap-y-1 ${
        emphasis === 'lead' ? 'mt-7 text-base lg:mt-8' : 'mt-4 text-sm'
      }`}
    >
      {/* The section's one accent gesture. Gold on the mark that does the
          attributing, not on a border or a badge. */}
      <span aria-hidden="true" className="text-accent">
        &mdash;
      </span>
      <CopyText as="span" source={`${name}, ${city}`} className="text-fg" />
      <span aria-hidden="true" className="text-fg-muted">
        &middot;
      </span>
      <CopyText as="span" source={meta} className="text-fg-muted" />
    </figcaption>
  )
}

export default function Testimonials() {
  const [lead, ...rest] = testimonials
  if (!lead) return null

  return (
    <SectionShell id="testimonials" heading="What people actually say" tone="raised" centered={false}>
      <div className={`grid gap-y-12 lg:grid-cols-12 lg:gap-x-10 xl:gap-x-16 ${MEASURE}`}>
        {/* ---------------- The pulled quote ---------------- */}
        <Reveal className="min-w-0 lg:col-span-7">
          <figure>
            {/*
             * Display scale, but deliberately a step under the H2's cap (2.125
             * vs 2.5rem) — a blockquote larger than the heading above it reads
             * as a mistake. `[text-indent:-0.42em]` hangs the opening mark into
             * the gutter so the first line optically aligns with the lines under
             * it; the hang is always smaller than the container's own padding,
             * so nothing clips at any width. `max-w-[19em]` holds the measure
             * near 38 characters as the type scales.
             */}
            <CopyText
              as="blockquote"
              source={quoted(lead.quote)}
              className="display max-w-[19em] text-[clamp(1.5rem,2.5vw,2.125rem)] leading-[1.28] text-fg [text-indent:-0.42em]"
            />
            <Attribution testimonial={lead} emphasis="lead" />
          </figure>
        </Reveal>

        {/* ---------------- The supporting quotes ---------------- */}
        {rest.length > 0 && (
          <Reveal delay={80} className="min-w-0 lg:col-span-5">
            {/* A rule between the columns from lg, and above the stack when it
                collapses underneath — the divider follows the layout rather
                than being drawn twice. */}
            <ul className="border-t border-border-soft pt-10 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10 xl:pl-14">
              {rest.map((testimonial, index) => (
                <li
                  key={testimonial.id}
                  className={index > 0 ? 'mt-8 border-t border-border-soft pt-8 lg:mt-10 lg:pt-10' : ''}
                >
                  <figure>
                    <CopyText
                      as="blockquote"
                      source={quoted(testimonial.quote)}
                      className="max-w-[46ch] text-base leading-relaxed text-fg lg:text-lg"
                    />
                    <Attribution testimonial={testimonial} />
                  </figure>
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </div>

      {/* Required under the block — SEBI advertising rules. Live text, 8.07:1. */}
      <div className={`mt-14 border-t border-border-soft pt-6 lg:mt-20 ${MEASURE}`}>
        <Disclosure className="max-w-[68ch]">{testimonialDisclaimer}</Disclosure>
      </div>
    </SectionShell>
  )
}
