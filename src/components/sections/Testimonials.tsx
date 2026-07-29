import { Quote } from 'lucide-react'
import SectionShell from '../ui/SectionShell'
import Reveal from '../ui/Reveal'
import Disclosure from '../ui/Disclosure'
import CopyText from '../ui/CopyText'
import { testimonials, testimonialDisclaimer } from '../../data/social'
import type { Testimonial } from '../../types'

/**
 * §12 Testimonials.
 *
 * The copy deck flags all three quotes as placeholders pending real, consented
 * customers — they are rendered exactly as written, through `CopyText`, so the
 * unfilled `[Name]`, `[City]` and `[YEAR]` values read as unfilled and nothing
 * implies they have been verified. `testimonialDisclaimer` is required and must
 * not be removed.
 *
 * Attributions wrap rather than truncate: a real Indian name plus city can run
 * long ("Ramakrishnan Venkataraman, Thiruvananthapuram") and must not be
 * silently ellipsised once compliance fills these in.
 *
 * No hover-lift on the cards (deliberate override of MASTER.md): border and
 * surface shift only.
 *
 * Scale: the quote is the whole point of the section, so it carries the type —
 * 16px on a phone up to 20px from xl, with card padding growing 24 → 48px to
 * match. On the wide container the cards run ~430–530px, which keeps the quote
 * at a 29–43ch measure; a wider grid or a fixed cap is not what this section
 * needed, the type was simply too small to hold a full-height section.
 */

/** First letter of the attributed name, used for the avatar slot until real photos land. */
function initialOf(name: string): string {
  const letter = name.replace(/[^A-Za-z0-9]/g, '').charAt(0)
  return letter ? letter.toUpperCase() : '—'
}

interface TestimonialCardProps {
  testimonial: Testimonial
}

function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const { quote, name, city, meta } = testimonial

  return (
    <figure className="flex h-full flex-col rounded-2xl border border-border bg-surface p-6 transition-colors duration-200 hover:border-accent/40 hover:bg-surface-raised lg:p-8 xl:p-10 2xl:p-12">
      <Quote
        className="h-5 w-5 shrink-0 text-accent-soft/60 lg:h-6 lg:w-6 xl:h-7 xl:w-7"
        strokeWidth={1.5}
        aria-hidden="true"
      />

      <CopyText
        as="blockquote"
        source={quote}
        className="mt-5 mb-8 text-base leading-relaxed text-fg lg:mt-6 lg:mb-10 lg:text-lg xl:mb-12 xl:text-xl"
      />

      <figcaption className="mt-auto flex items-center gap-3 border-t border-border-soft pt-5 lg:gap-4 lg:pt-6 xl:pt-8">
        <span
          aria-hidden="true"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border bg-surface-raised text-sm font-medium text-fg-muted lg:h-11 lg:w-11 xl:h-12 xl:w-12 xl:text-base"
        >
          {initialOf(name)}
        </span>
        <div className="min-w-0">
          <CopyText source={`${name}, ${city}`} className="text-sm font-medium text-fg lg:text-base" />
          <CopyText source={meta} className="mt-0.5 text-xs text-fg-muted lg:mt-1 lg:text-sm" />
        </div>
      </figcaption>
    </figure>
  )
}

export default function Testimonials() {
  return (
    <SectionShell id="testimonials" heading="What people actually say" tone="raised">
      {/* Single column stays capped at a readable card width until the 3-up
          grid takes over at md, so a 700px tablet does not get one 84ch quote. */}
      <div className="mx-auto grid max-w-xl gap-5 md:max-w-none md:grid-cols-3 lg:gap-6 xl:gap-8 2xl:gap-10">
        {testimonials.map((testimonial, index) => (
          <Reveal key={testimonial.id} delay={Math.min(index, 3) * 60} className="h-full">
            <TestimonialCard testimonial={testimonial} />
          </Reveal>
        ))}
      </div>

      {/* Required under the block — SEBI advertising rules. Live text, 4.5:1. */}
      <div className="mt-12 border-t border-border-soft pt-8 lg:mt-16 lg:pt-10">
        <Disclosure className="mx-auto max-w-2xl text-center">{testimonialDisclaimer}</Disclosure>
      </div>
    </SectionShell>
  )
}
