import SectionShell from '../ui/SectionShell'
import CopyText from '../ui/CopyText'
import Reveal from '../ui/Reveal'
import { honestNote, pillars } from '../../data/safety'

/**
 * §10 Safety & protection.
 *
 * `seamless`: Onboarding above is a full-bleed MediaSection, and a hairline
 * ruled across the bottom of a photograph reads as a mistake. Base tone, because
 * the mobile-app band below is a solid raised surface — two raised bands in a
 * row and the boundary between them disappears.
 *
 * ── Why this is no longer a 3×2 grid ──────────────────────────────────────
 *
 * The six pillars were rendering as six identical cells: icon, title, body,
 * repeated. That layout makes a claim the section does not believe — that
 * "every share you buy is credited to your own CDSL demat account" and "data is
 * encrypted in transit and at rest" are worth the same. They are not. The first
 * is the answer to the only question that matters here ("if you disappear, what
 * happens to my stock?"); the second is table stakes that every competitor also
 * has, and saying it loudly invites the reader to wonder why it needed saying.
 *
 * So the section is a ladder in three steps, and the type sizes carry it:
 *
 *   1. Custody — one claim, set largest, its body a step up from the rest.
 *   2. Control — the two facts that qualify custody (segregated client funds,
 *      per-debit authorisation). Serif, two columns, one step down.
 *   3. Hygiene — 2FA, encryption, the published grievance route. A quiet
 *      title/body ledger. Horizontal rows, not blocks, so the shape itself
 *      reads as secondary before a single word is measured.
 *
 * No icons. Products and Platform both dropped theirs during this pass for the
 * same reason: a glyph beside a heading is the part of a card that carries no
 * information, and once six of them line up they become the thing you see
 * instead of the six sentences. landing.md §8 fixes the icon *set* for this
 * section; it does not require the section to use one.
 *
 * ── The honest note ───────────────────────────────────────────────────────
 *
 * Previously a warning-orange left border with a "Honest note" flag. Two things
 * were wrong with that. A coloured rule thick enough to see is a callout tell —
 * the tissue-box border every admin template ships. And orange is spoken for:
 * on this page it means *unfilled placeholder* or *regulatory risk disclosure*
 * (Disclosure.tsx), so spending it here taught the reader that the section's
 * closing sentence was in the same category as `[₹X]`.
 *
 * It is instead the terminal statement of the section: a chrome hairline, a
 * large measure of air, and the sentence itself in the display serif at the
 * top of the section's type ladder — bigger than any pillar, second only to the
 * H2. The deck marks this line "keep this, do not soften it". Set at 36px on a
 * three-line measure, it is the last and largest thing read here.
 */

/** Fixed by the deck's order — see src/data/safety.ts. */
const custody = pillars[0]
const control = pillars.slice(1, 3)
const hygiene = pillars.slice(3)

/**
 * Held to 1344px, the content width of a 1440 laptop, and centred under the
 * centred heading. Past that the custody body sits a very long way from the
 * title it belongs to; the surplus goes into the column gap instead.
 */
const MEASURE = 'mx-auto w-full max-w-[84rem]'

/** Title column shared by tier 1 and tier 3, so their left edges agree. */
const ROW = 'grid gap-x-12 md:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:gap-x-20'

export default function Safety() {
  return (
    <SectionShell
      id="safety"
      seamless
      heading="Your money and your shares stay yours"
      subheading="Client assets sit where regulation says they should — not on our balance sheet."
    >
      <div className={MEASURE}>
        {/* 1 — custody. The full-strength `border-border` rule, against the
            softer hairlines below it, is the first thing that says which of
            these six facts the section is actually built around. */}
        <Reveal>
          <article className={`${ROW} gap-y-4 border-t border-border pt-8 sm:pt-10`}>
            <h3 className="display text-[clamp(1.5rem,2vw,1.875rem)] leading-[1.15] text-fg">
              {custody.title}
            </h3>
            <CopyText
              source={custody.body}
              className="max-w-[60ch] text-lg leading-relaxed text-fg-muted"
            />
          </article>
        </Reveal>

        {/* 2 — control. */}
        <Reveal delay={60}>
          <ul className="mt-12 grid gap-x-12 gap-y-9 sm:mt-14 md:grid-cols-2 lg:gap-x-20">
            {control.map((pillar) => (
              <li key={pillar.title} className="border-t border-border-soft pt-6">
                <h3 className="display text-[clamp(1.25rem,1.5vw,1.5rem)] leading-[1.2] text-fg">
                  {pillar.title}
                </h3>
                <CopyText
                  source={pillar.body}
                  className="mt-3 max-w-[56ch] text-base leading-relaxed text-fg-muted"
                />
              </li>
            ))}
          </ul>
        </Reveal>

        {/* 3 — hygiene. One reveal for all three: a stagger would make the
            quietest tier perform, and the point of it is that it doesn't. */}
        <Reveal delay={120}>
          <ul className="mt-12 sm:mt-14">
            {hygiene.map((pillar) => (
              <li key={pillar.title} className={`${ROW} gap-y-2 border-t border-border-soft py-5`}>
                <h3 className="text-base font-medium leading-snug text-fg">{pillar.title}</h3>
                <CopyText
                  source={pillar.body}
                  className="max-w-[76ch] text-base leading-relaxed text-fg-muted"
                />
              </li>
            ))}
          </ul>
        </Reveal>

        {/* The honest note — no box, no coloured border, no flag. */}
        <Reveal delay={60}>
          <div className="mt-16 sm:mt-20">
            <div className="rule-chrome h-px w-full" aria-hidden="true" />
            <CopyText
              source={honestNote}
              className="display mt-8 max-w-[22em] text-[clamp(1.5rem,2.6vw,2.25rem)] leading-[1.3] text-fg sm:mt-10"
            />
          </div>
        </Reveal>
      </div>
    </SectionShell>
  )
}
