import CopyText from '../ui/CopyText'
import Disclosure from '../ui/Disclosure'
import Reveal from '../ui/Reveal'
import SectionShell from '../ui/SectionShell'
import { testimonials, testimonialDisclaimer } from '../../data/social'
import type { Testimonial } from '../../types'

/**
 * §12 Testimonials.
 *
 * COMPOSITION — one voice pulled large across an almost-empty screen, with the
 * other two running beneath a single full-rail rule as a quiet two-up footer.
 * A T, and the only T on the page.
 *
 * The previous pass split this 7/5 into two columns with a vertical rule down
 * the middle and the supporting quotes stacked on hairlines in the right one.
 * That was a good layout in isolation and the wrong one *here*, because FAQ
 * comes next and FAQ is also a left-flush heading over a multi-column body of
 * hairline-separated text items. Two consecutive sections were reading as the
 * same object at different densities. So this one drops the column rule, drops
 * the internal hairlines and keeps exactly one line in the whole section — the
 * heavy rule that separates the pulled voice from the two under it.
 *
 * Sparse on purpose. Every other section in this stretch fills its screen: the
 * stat band is five figures on one baseline, FAQ is twelve rows in two columns,
 * Support is a loaded plate. This one is a sentence and a rule, and the air
 * around it is the whole difference between "a customer said this" and "a
 * testimonial section was required".
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
 *    so nothing is drawn as a control — and `.card`/`.card-lift` stay off this
 *    section for the same reason: a lift is a response to a target, and there
 *    is no target here to respond.
 *  - the local `MEASURE` constant. `SectionShell` owns the one content rail
 *    (84rem) and the heading's reading measure; a section that redeclares its
 *    own width is how the page came to have six of them.
 *  - the accented em dash. It was the section's "one accent gesture", but an
 *    attribution mark is not an action. With no hue left in the brand, `accent`
 *    is defined purely as the brightest surface on the page, so putting it on
 *    three dashes across an almost-empty screen would make punctuation the
 *    highest-luminance thing in the section — louder than the quote it credits
 *    and competing with the actual buttons elsewhere. `chrome` sits one step
 *    down in luminance for exactly this, and it is what the dash gets now.
 *
 * ── MOTION: the T assembles in order of authority ──────────────────────────
 *
 * One idea, three beats, once. The pulled voice resolves **first and alone** out
 * of a 6px blur; the crossbar then draws itself left-to-right out from under it
 * while that settle is still finishing; the two subordinate quotes follow. The
 * section builds itself in the order it wants to be read, which is the whole
 * argument of the layout — one voice, a line, then corroboration. No other
 * section on this page has a hierarchy to spend an entrance on.
 *
 * Three things this deliberately does not do:
 *
 *  - **The blur is on the blockquote and nothing else.** `filter` cannot be
 *    GPU-composited, so it is scoped to the one display-scale text block, the
 *    same allowance the headings get. The subordinates and the rule are
 *    transform and opacity only.
 *  - **It scales from `left top`, not from the centre.** A centre-origin settle
 *    walks a left-flush block sideways for the length of the tween, and the
 *    page's single left edge is the one thing that must not move. Growing from
 *    the anchor also echoes the hero, where the headline widens into place.
 *  - **Nothing rises and nothing repeats.** Beats settle downward from −10px on
 *    `power3.out`, and the timeline is `play none none none`, so scrolling back
 *    up to re-read a quote does not re-stage it.
 *
 * COMPLIANCE — unchanged and non-negotiable:
 *  - every `[Name]`, `[City]` and `[YEAR]` is still an unfilled deck value and
 *    still routes through `CopyText`, so it renders visibly flagged. No name,
 *    city, year, rating or outcome is invented anywhere in this file.
 *  - attributions wrap rather than truncate — "Ramakrishnan Venkataraman,
 *    Thiruvananthapuram" must not be silently ellipsised once real, consented
 *    quotes land.
 *  - `testimonialDisclaimer` is required under the block. It stays live text at
 *    `fg-muted` (13.08:1), left-aligned with the rest of the section, never baked
 *    into an image and never behind a blur.
 *  - the disclaimer and all three attributions are outside the timeline
 *    entirely. Every `[Name]`, `[City]` and `[YEAR]` is an unfilled value and the
 *    disclaimer is required copy, so none of them may sit inside an entrance
 *    that starts at `opacity: 0` — they are legible at frame zero and at every
 *    frame after it. Only the quote text, which carries no placeholder and no
 *    regulatory obligation, is allowed to resolve.
 */

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
        emphasis === 'lead' ? 'mt-8 text-base lg:mt-10' : 'mt-5 text-sm'
      }`}
    >
      {/* Chrome, not accent. The em dash is the mark that does the attributing —
          structural punctuation, not an action, and the accent tier on this page
          means only the second of those. */}
      <span aria-hidden="true" className="text-chrome-dim">
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
    <SectionShell id="testimonials" heading="What people actually say" tone="raised">
      {/* ---------------- The pulled voice ---------------- */}
      <Reveal variant="settle">
        <figure>
          {/*
           * Display scale, held a step under the H2's cap (2.25 vs 2.5rem) at
           * every point of the clamp — a blockquote larger than the heading
           * above it reads as a mistake, and the two must not converge at the
           * narrow end either. `[text-indent:-0.42em]` hangs the opening mark
           * into the gutter so the first line optically aligns with the lines
           * under it; the hang is always smaller than the container's own
           * padding, so nothing clips at any width. `max-w-[19em]` holds the
           * measure near 38 characters as the type scales, which is what keeps
           * this reading as a pull quote rather than as a paragraph.
           */}
          <CopyText
            as="blockquote"
            source={quoted(lead.quote)}
            className="display max-w-[19em] text-[clamp(1.625rem,2.6vw,2.25rem)] leading-[1.26] text-fg [text-indent:-0.42em]"
          />
          <Attribution testimonial={lead} emphasis="lead" />
        </figure>
      </Reveal>

      {/* ---------------- The two under it ---------------- */}
      {/* The section's only rule, and it runs the whole rail. It is the crossbar
          of the T: everything above it is one voice, everything below it is the
          corroboration. `border-border` rather than `border-border-soft`,
          because with no other line in the section there is nothing for a
          hairline to be quieter *than*. */}
      {rest.length > 0 && (
        <Reveal variant="settle" delay={80}>
          <div className="mt-20 border-t border-border pt-12 sm:mt-24 sm:pt-14">
            {/* Two, side by side, and subordinate — not a grid standing in for
                a point of view. They sit at body scale under a quote set twice
                their size, so the pair reads as corroboration rather than as
                two more equal cells. No borders, no surfaces: the gutter does
                the separating. */}
            {/*
              Two columns only when there are two things to put in them.
              The list was cut from three testimonials to two, which leaves one
              quote here — and a single item in a fixed `md:grid-cols-2` sat in
              the left column with the right half of the rail empty, so the
              section read as though a second quote had failed to load. The
              column count follows the data.
            */}
            <ul
              className={`grid gap-y-12 md:gap-x-14 xl:gap-x-24 ${
                rest.length > 1 ? 'md:grid-cols-2' : ''
              }`}
            >
              {rest.map((testimonial) => (
                <li key={testimonial.id} className="min-w-0">
                  <figure>
                    <CopyText
                      as="blockquote"
                      source={quoted(testimonial.quote)}
                      className="max-w-[44ch] text-base leading-relaxed text-fg lg:text-lg"
                    />
                    <Attribution testimonial={testimonial} />
                  </figure>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      )}

      {/* Required under the block — SEBI advertising rules. Live text at
          `fg-muted` (13.08:1), never behind a blur, never baked into an image.
          It carries no rule of its own: a second line here would put the
          section back to looking ruled, and the size drop plus the air already
          say this is the section's footnote rather than a fourth quote. */}
      <div className="mt-16 sm:mt-20">
        <Disclosure className="max-w-[68ch]">{testimonialDisclaimer}</Disclosure>
      </div>
    </SectionShell>
  )
}
