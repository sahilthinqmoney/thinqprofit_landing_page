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
    <figure className="flex h-full flex-col rounded-2xl border border-border bg-surface p-6 transition-colors duration-200 hover:border-accent/40 hover:bg-surface-raised sm:p-7">
      <Quote className="h-5 w-5 shrink-0 text-accent-soft/60" strokeWidth={1.5} aria-hidden="true" />

      <CopyText
        as="blockquote"
        source={quote}
        className="mt-5 mb-7 text-base leading-relaxed text-fg"
      />

      <figcaption className="mt-auto flex items-center gap-3 border-t border-border-soft pt-5">
        <span
          aria-hidden="true"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border bg-surface-raised text-sm font-medium text-fg-muted"
        >
          {initialOf(name)}
        </span>
        <div className="min-w-0">
          <CopyText source={`${name}, ${city}`} className="text-sm font-medium text-fg" />
          <CopyText source={meta} className="mt-0.5 text-xs text-fg-muted" />
        </div>
      </figcaption>
    </figure>
  )
}

export default function Testimonials() {
  return (
    <SectionShell id="testimonials" heading="What people actually say" tone="raised">
      <div className="grid gap-5 md:grid-cols-3 md:gap-6">
        {testimonials.map((testimonial, index) => (
          <Reveal key={testimonial.id} delay={Math.min(index, 3) * 60} className="h-full">
            <TestimonialCard testimonial={testimonial} />
          </Reveal>
        ))}
      </div>

      {/* Required under the block — SEBI advertising rules. Live text, 4.5:1. */}
      <div className="mt-10 border-t border-border-soft pt-6">
        <Disclosure className="mx-auto max-w-2xl text-center">{testimonialDisclaimer}</Disclosure>
      </div>
    </SectionShell>
  )
}
