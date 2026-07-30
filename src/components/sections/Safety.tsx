import { useRef } from 'react'
import { gsap, initScrollTrigger, useGSAP } from '../../lib/scrollTrigger'
import SectionShell from '../ui/SectionShell'
import CopyText from '../ui/CopyText'
import { honestNote, pillars } from '../../data/safety'

initScrollTrigger()

/**
 * §10 Safety & protection.
 *
 * COMPOSITION — a descending ladder of three tiers, each set a full step
 * quieter than the one above it, closing on the section's largest sentence.
 * Nothing else on the page uses type weight as its structure: Onboarding above
 * is a full-bleed plate with copy parked left, MobileApp below is a flat colour
 * band cropping a device, Support later is a single elevated plate. This
 * section is the only one whose layout *is* a hierarchy of claims, and the only
 * one that ends on a statement rather than on a list, a table or an action.
 *
 * It enters high and at full rail width — a full-strength rule straight under
 * the heading block — and every tier below it is narrower in weight, not in
 * measure. The reader falls down it.
 *
 * `seamless`: Onboarding above is a full-bleed MediaSection, and a hairline
 * ruled across the bottom of a photograph reads as a mistake. Base tone, because
 * the mobile-app band below is a solid raised surface — two raised bands in a
 * row and the boundary between them disappears.
 *
 * No subheading. It read "Client assets sit where regulation says they should —
 * not on our balance sheet", which is the heading ("stay yours") and the first
 * two pillars ("held in your name", "segregated from ours") said a third time
 * before either had been read.
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
 * It is instead the terminal statement of the section: a plain `border` rule, a
 * large measure of air, and the sentence itself in the display face at the top
 * of the section's type ladder — bigger than any pillar, second only to the H2.
 * The deck marks this line "keep this, do not soften it". Set at 36px on a
 * three-line measure, it is the last and largest thing read here.
 *
 * Not `.display-serif`, tempting as it is. The serif is the page's one change
 * of register and FinalCta spends it on the closing headline; a second serif
 * moment turns "used once" into "a second display style". The wording is
 * verbatim and terminal — the deck's line, last in the section, and it stays
 * that way.
 *
 * The rule used to be `.rule-chrome`. That utility is now spent on exactly one
 * seam in the whole document (the Stats band); a brushed-metal edge that recurs
 * stops reading as precision and starts reading as a border style.
 *
 * ── Width ─────────────────────────────────────────────────────────────────
 *
 * There is no measure in this file. `SectionShell` owns the single content
 * rail, so the ladder starts on the same left edge as the H2 above it and as
 * every other section on the page. The old local `mx-auto max-w-[84rem]`
 * duplicated the rail's width *and* re-centred it, which fought the left-flush
 * heading the moment `centered` stopped defaulting to true.
 *
 * ── Motion: DESCENDING PRIORITY ───────────────────────────────────────────
 *
 * The layout is a hierarchy of claims, so the entrance is the hierarchy being
 * declared. One timeline, one trigger — not three independent reveals — because
 * the tiers have to resolve *relative to each other* for the shape of the
 * argument to be legible before any of it is read. Each tier lands later and
 * quieter than the one above it, and "quieter" is measured, not felt: the travel
 * decays 10px → 8px → 5px and the duration 0.85s → 0.72s → 0.6s down the ladder.
 *
 * Tier 1 is the only element in the section that gets a focus pull (a 6px blur
 * resolving on the custody h3). Blur cannot be GPU-composited, so it is spent on
 * one short heading and nowhere else — never on the two-up, never on the ledger,
 * never on the closing sentence, all of which are areas rather than lines.
 *
 * Tier 3 animates as a single block with no internal stagger, for the same
 * reason it is a row ledger rather than three cards: a stagger would make the
 * quietest tier perform, and the point of it is that it doesn't.
 *
 * The two full-strength `border` rules draw themselves in from the left — the
 * one that opens the ladder and the one that closes it. The soft hairlines
 * between tiers never move. That is the whole rule set: what is structural
 * draws, what is merely separating stays put.
 *
 * THE CLOSING SENTENCE NEVER ANIMATES ITS OPACITY. It is the most valuable
 * sentence on the page and a reader who stops scrolling mid-tween has to be able
 * to read it, so it settles 6px downward at full opacity and nothing else. It
 * resolves last because it is what the three tiers were leading to, but "last"
 * here is 100ms after its own rule, not a delay long enough to be caught out.
 *
 * Reduced motion: every tween lives inside `gsap.matchMedia()` under
 * `(prefers-reduced-motion: no-preference)`, so nothing is ever applied — the
 * markup has no start state to hold, the section renders composed, and flipping
 * the OS setting mid-session reverts cleanly instead of stranding a transform.
 */

/** Exponential ease-out, matching `--ease-out-expo`. Never in-out, never a spring. */
const EASE = 'power3.out'

/** Fixed by the deck's order — see src/data/safety.ts. */
const custody = pillars[0]
const control = pillars.slice(1, 3)
const hygiene = pillars.slice(3)

/** Title column shared by tier 1 and tier 3, so their left edges agree. */
const ROW = 'grid gap-x-12 md:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:gap-x-20'

export default function Safety() {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = root.current
      if (!el) return

      /*
       * Elements are resolved here rather than passed to GSAP as selector
       * strings: `gsap.matchMedia().add()` runs its callback in its own context,
       * so selector text inside it is document-wide unless a scope is threaded
       * through by hand. Two sections doing this on the same page is how a
       * stagger starts picking up a neighbour's rows.
       */
      const tier1 = el.querySelector<HTMLElement>('[data-tier="1"]')
      const openRule = el.querySelector<HTMLElement>('[data-rule="open"]')
      const claim = el.querySelector<HTMLElement>('[data-claim]')
      const control2 = gsap.utils.toArray<HTMLElement>(el.querySelectorAll('[data-tier="2"] > li'))
      const tier3 = el.querySelector<HTMLElement>('[data-tier="3"]')
      const terminal = el.querySelector<HTMLElement>('[data-terminal]')
      const closeRule = el.querySelector<HTMLElement>('[data-rule="close"]')
      // `CopyText` takes no arbitrary props, so its paragraphs are addressed by
      // position inside their tier rather than by a data attribute on the
      // component. Both tiers hold exactly one.
      const claimBody = tier1?.querySelector<HTMLElement>('article > p') ?? null
      const note = terminal?.querySelector<HTMLElement>('p') ?? null

      if (!tier1 || !openRule || !claim || !claimBody || !tier3) return
      if (!terminal || !closeRule || !note || control2.length === 0) return

      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        /*
         * The ladder. One trigger for all three tiers, fired once, at the point
         * tier 1 clears the bottom eighth of the viewport — the same 82% the
         * page's other content entrances use, so this section does not enter on
         * a different beat from its neighbours.
         *
         * Nothing waits past ~260ms: the last tier *starts* at 0.26s, which is
         * late enough to be read as third and early enough that a fast scroll
         * never catches the ladder half-built.
         */
        const ladder = gsap.timeline({
          defaults: { ease: EASE },
          scrollTrigger: {
            trigger: tier1,
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        })

        ladder
          // The structural rule grows out of the heading's left edge, so it
          // reads as connected to what is above it rather than as arriving.
          .from(openRule, { scaleX: 0, transformOrigin: 'left center', duration: 0.9 }, 0)
          .from(
            claim,
            {
              y: -10,
              opacity: 0,
              filter: 'blur(6px)',
              // Held for the tween only. A standing compositor layer per
              // element costs more than it saves on a page this long.
              willChange: 'transform, filter, opacity',
              duration: 0.85,
            },
            0,
          )
          .from(claimBody, { y: -10, opacity: 0, duration: 0.85 }, 0.06)
          .from(control2, { y: -8, opacity: 0, duration: 0.72, stagger: 0.07 }, 0.14)
          .from(tier3, { y: -5, opacity: 0, duration: 0.6 }, 0.26)

        /*
         * The terminal statement, on its own trigger. It sits ~200px below the
         * ladder, so hanging it off the ladder's timeline would have resolved it
         * off-screen — the one sentence in the section that has to be *watched*
         * landing at the bottom of the fold.
         *
         * `start: 'top 88%'` and no opacity: the sentence is legible from frame
         * zero, 6px above its resting position, and settles down into it.
         */
        const closing = gsap.timeline({
          defaults: { ease: EASE },
          scrollTrigger: {
            trigger: terminal,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        })

        closing
          .from(closeRule, { scaleX: 0, transformOrigin: 'left center', duration: 0.9 }, 0)
          .from(note, { y: -6, duration: 0.9 }, 0.1)
      })

      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    /*
     * `lead`, not the default `standard`.
     *
     * The three `lead` slots were assigned as "what you trade, what it costs,
     * how you open an account" — the sections a visitor arrives looking for.
     * That reasoning is about *navigation*, and it under-ranks the section that
     * carries the actual argument for handing this company money. A stranger
     * evaluating a broker is deciding one thing: whether their shares and cash
     * are safe. Custody outranks the product tour.
     */
    <SectionShell id="safety" seamless scale="lead" heading="Your money and your shares stay yours">
      <div ref={root}>
        {/* 1 — custody. The full-strength rule, against the softer hairlines
            below it, is the first thing that says which of these six facts the
            section is actually built around. It is a `bg-border` hairline rather
            than a `border-t` because a border cannot be scaled from its left
            edge — only a box can, and the draw is what makes the rule read as
            growing out of the heading. Measurements are unchanged: 1px, then the
            same `pt-10`. */}
        <div data-tier="1">
          <span
            data-rule="open"
            aria-hidden="true"
            className="block h-px w-full origin-left bg-border"
          />
          <article className={`${ROW} gap-y-5 pt-10 sm:pt-12`}>
            <h3
              data-claim
              className="display text-[clamp(1.5rem,2vw,1.875rem)] leading-[1.15] text-fg"
            >
              {custody.title}
            </h3>
            <CopyText
              source={custody.body}
              className="max-w-[60ch] text-lg leading-relaxed text-fg-muted"
            />
          </article>
        </div>

        {/* 2 — control. Staggered across the two columns, 70ms apart: they are
            a pair of qualifiers, so they arrive as a pair, not as two events. */}
        <ul
          data-tier="2"
          className="mt-16 grid gap-x-12 gap-y-12 sm:mt-20 md:grid-cols-2 lg:gap-x-20"
        >
          {control.map((pillar) => (
            <li key={pillar.title} className="border-t border-border-soft pt-7">
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

        {/* 3 — hygiene. One tween for all three rows, no internal stagger: a
            stagger would make the quietest tier perform, and the point of it is
            that it doesn't. */}
        {/*
          Guarded, because the tier is data-driven and the data shrank. The
          pillar list was cut from six to three, which made `pillars.slice(3)`
          empty — and an empty `<ul>` still carries its own `mt-16 sm:mt-20`, so
          the section was paying 80px of margin for a tier with nothing in it.
          That gap sat directly above the closing statement, which is the one
          place on this page where the air is supposed to mean something.
        */}
        {hygiene.length > 0 && (
        <ul data-tier="3" className="mt-16 sm:mt-20">
          {hygiene.map((pillar) => (
            <li
              key={pillar.title}
              className={`${ROW} gap-y-2 border-t border-border-soft py-6 sm:py-7`}
            >
              <h3 className="text-base font-medium leading-snug text-fg">{pillar.title}</h3>
              <CopyText
                source={pillar.body}
                className="max-w-[76ch] text-base leading-relaxed text-fg-muted"
              />
            </li>
          ))}
        </ul>
        )}

        {/* The honest note — no box, no coloured border, no flag. The air above
            it is deliberately larger than any gap inside the ladder: it is not a
            fourth tier, it is what the three tiers were leading to.

            The sentence is verbatim and its opacity is never touched. */}
        <div data-terminal className="mt-24 sm:mt-28 lg:mt-32">
          <span
            data-rule="close"
            aria-hidden="true"
            className="block h-px w-full origin-left bg-border"
          />
          <CopyText
            source={honestNote}
            className="display mt-10 max-w-[22em] text-[clamp(1.5rem,2.6vw,2.25rem)] leading-[1.3] text-fg sm:mt-12"
          />
        </div>
      </div>
    </SectionShell>
  )
}
