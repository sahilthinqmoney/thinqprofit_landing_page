import { useRef } from 'react'
import { gsap, initScrollTrigger, useGSAP } from '../../lib/scrollTrigger'
import SectionShell from '../ui/SectionShell'
import CopyText from '../ui/CopyText'
import { honestNote, pillars, regulatoryProof } from '../../data/security'

initScrollTrigger()

/**
 * §5 — Security and trust.
 *
 * ── COMPOSITION: a descending ladder of three tiers ───────────────────────
 *
 * Each tier is set a full step quieter than the one above it, and the section
 * closes on its largest sentence. Nothing else on the page uses type weight as
 * its structure: §3 is a plate with copy parked left, §4 is a flat row ledger,
 * §6 is a plate with terms under it. This is the only section whose layout IS a
 * hierarchy of claims, and the only one that ends on a statement rather than on
 * a list or an action.
 *
 * The ranking is by what a stranger is actually asking, which is never "do you
 * encrypt data at rest":
 *
 *   1. Custody — where the shares are. One claim, set largest.
 *   2. Control — whose money it is while it sits there, and what stands between
 *      a stranger and a withdrawal. Two columns, one step down.
 *   3. Hygiene — encryption, session control, the order trail. A quiet
 *      title/body ledger. Horizontal rows, not blocks, so the shape itself
 *      reads as secondary before a single word is measured.
 *
 * All six are real commitments and all six are blocking items in
 * docs/go-live-checklist.md. The ladder ranks them; it does not doubt them.
 *
 * A 3×2 grid would say the six are worth the same. They are not: "every share
 * is credited to your own demat account" is the answer to the only question
 * that matters, and "data is encrypted at rest" is table stakes that every
 * competitor also has — saying it at the same volume invites the reader to
 * wonder why it needed saying.
 *
 * No icons. `Capabilities` above dropped its for the same reason: a glyph beside
 * a heading is the part of a row that carries no information, and once six line
 * up they become the thing you see instead of the six sentences.
 *
 * ── The terminal statement ────────────────────────────────────────────────
 *
 * "Your data is never sold, and your order flow is never traded against."
 *
 * It is the data-privacy commitment promoted out of the hygiene tier, because it
 * is the only claim here a competitor would find expensive to match — it is a
 * statement about the business model, not about a system. Set in `.display` at
 * the top of the section's own ladder, with a rule above it and a large measure
 * of air: bigger than any pillar, second only to the H2.
 *
 * Not `.display-quiet`. That voice is spent on the closing section's headline
 * and used once it is a change of register; used twice it is simply a second
 * display style. `FinalCta` owns it.
 *
 * ── MOTION: descending priority ───────────────────────────────────────────
 *
 * The layout is a hierarchy, so the entrance is the hierarchy being declared.
 * One timeline, one trigger — not three independent reveals — because the tiers
 * have to resolve RELATIVE to each other for the shape of the argument to be
 * legible before any of it is read. Each tier lands later and quieter than the
 * one above it, and "quieter" is measured: travel decays 10px → 8px → 5px and
 * duration 0.85s → 0.72s → 0.6s down the ladder.
 *
 * Tier 1 is the only element that gets a focus pull (a 6px blur resolving on the
 * custody h3). Blur cannot be GPU-composited, so it is spent on one short
 * heading and nowhere else — never on the two-up, never on the ledger, never on
 * the closing sentence, all of which are areas rather than lines.
 *
 * THE CLOSING SENTENCE NEVER ANIMATES ITS OPACITY. It is the most valuable
 * sentence in the section and a reader who stops scrolling mid-tween has to be
 * able to read it, so it settles 6px downward at full opacity and nothing else.
 *
 * Reduced motion: every tween lives inside `gsap.matchMedia()` under
 * `(prefers-reduced-motion: no-preference)`, so nothing is ever applied — the
 * markup has no start state to hold, the section renders composed, and flipping
 * the OS setting mid-session reverts cleanly instead of stranding a transform.
 */

/** Exponential ease-out, matching `--ease-out-expo`. Never in-out, never a spring. */
const EASE = 'power3.out'

/**
 * Fixed by the order of `pillars` in src/data/security.ts. Reordering that array
 * silently re-ranks this section, which is why the data file says so too.
 */
const custody = pillars[0]
const control = pillars.slice(1, 3)
const hygiene = pillars.slice(3)

/** Title column shared by tier 1 and tier 3, and by `Capabilities` above, so
 *  every ledger row on the page starts on the same two axes. */
const ROW = 'grid gap-x-12 md:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:gap-x-20'

export default function Security() {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = root.current
      if (!el) return

      /*
       * Elements are resolved here rather than passed to GSAP as selector
       * strings: `gsap.matchMedia().add()` runs its callback in its own context,
       * so selector text inside it is document-wide unless a scope is threaded
       * through by hand. Two sections doing this on one page is how a stagger
       * starts picking up a neighbour's rows.
       */
      const tier1 = el.querySelector<HTMLElement>('[data-tier="1"]')
      const openRule = el.querySelector<HTMLElement>('[data-rule="open"]')
      const claim = el.querySelector<HTMLElement>('[data-claim]')
      const control2 = gsap.utils.toArray<HTMLElement>(el.querySelectorAll('[data-tier="2"] > li'))
      const tier3 = el.querySelector<HTMLElement>('[data-tier="3"]')
      const terminal = el.querySelector<HTMLElement>('[data-terminal]')
      const closeRule = el.querySelector<HTMLElement>('[data-rule="close"]')
      // `CopyText` takes no arbitrary props, so its paragraphs are addressed by
      // position inside their tier rather than by a data attribute.
      const claimBody = tier1?.querySelector<HTMLElement>('article > p') ?? null
      const note = terminal?.querySelector<HTMLElement>('p') ?? null

      if (!tier1 || !openRule || !claim || !claimBody || !tier3) return
      if (!terminal || !closeRule || !note || control2.length === 0) return

      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        /*
         * One trigger for all three tiers, fired once, at the point tier 1 clears
         * the bottom eighth of the viewport — the same 82% the page's other
         * content entrances use, so this section does not enter on a different
         * beat from its neighbours.
         *
         * Nothing waits past ~260ms: the last tier STARTS at 0.26s, which is late
         * enough to read as third and early enough that a fast scroll never
         * catches the ladder half-built.
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
          // The structural rule grows out of the heading's left edge, so it reads
          // as connected to what is above it rather than as arriving.
          .from(openRule, { scaleX: 0, transformOrigin: 'left center', duration: 0.9 }, 0)
          .from(
            claim,
            {
              y: -10,
              opacity: 0,
              filter: 'blur(6px)',
              // Held for the tween only. A standing compositor layer per element
              // costs more than it saves on a page this long.
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
         * off-screen — the one sentence in the section that has to be watched
         * landing at the bottom of the fold.
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
     * A stranger evaluating a broker that has not launched is deciding one
     * thing: whether their money and their shares would be safe. That outranks
     * the capability summary above it, and it is why this section takes a `lead`
     * slot while §4 does not.
     *
     * `seamless`: §4 above ends in a hairline-ruled ledger, and a second rule
     * across the top of this section would read as the ledger having gained a
     * final empty row.
     */
    <SectionShell
      id="security"
      seamless
      scale="lead"
      heading="Your money sits where it should."
      subheading={regulatoryProof}
    >
      <div ref={root}>
        {/* 1 — custody. The full-strength rule, against the softer hairlines
            below it, is the first thing that says which of these six facts the
            section is actually built around. It is a `bg-*` hairline rather than
            a `border-t` because a border cannot be scaled from its left edge —
            only a box can, and the draw is what makes the rule read as growing
            out of the heading. */}
        <div data-tier="1">
          <span
            data-rule="open"
            aria-hidden="true"
            className="block h-px w-full origin-left bg-gradient-to-r from-chrome/70 via-chrome/30 to-transparent"
          />
          <article className={`${ROW} gap-y-5 pt-10 sm:pt-12`}>
            <h3
              data-claim
              className="display text-[clamp(1.5rem,2vw,1.875rem)] leading-[1.15] text-fg"
            >
              {custody.title}
            </h3>
            {/*
              `40em`, not `60ch`. `ch` is the advance of "0" and is a property of
              the face — 1ch is 0.600em in IBM Plex Sans, so a `ch` measure moved
              with the face change while the sentences themselves did not. 40em
              is the em equivalent of the 60ch this ladder was built at.
            */}
            <CopyText
              source={custody.body}
              className="max-w-[40em] text-base leading-relaxed text-fg-muted"
            />
          </article>
        </div>

        {/* 2 — control. Staggered across the two columns, 70ms apart: they are a
            pair of qualifiers, so they arrive as a pair, not as two events. */}
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
                /* 56ch × 0.666em = 37.3em — same conversion, same reason. */
                className="mt-3 max-w-[37.3em] text-base leading-relaxed text-fg-muted"
              />
            </li>
          ))}
        </ul>

        {/* 3 — hygiene. One tween for all three rows, no internal stagger: a
            stagger would make the quietest tier perform.

            Guarded because the tier is data-driven. It is non-empty today (three
            rows), but the previous build shipped a `pillars` list that shrank to
            three and left this `<ul>` rendering nothing while still paying its
            own 80px of margin — directly above the closing statement, which is
            the one place in this section where the air is supposed to mean
            something. */}
        {hygiene.length > 0 && (
          <ul data-tier="3" className="mt-16 sm:mt-20">
            {hygiene.map((pillar) => (
              <li
                key={pillar.title}
                className={`${ROW} gap-y-2 border-t border-border-soft py-6 sm:py-7`}
              >
                <h3 className="text-lg font-medium leading-snug text-fg">{pillar.title}</h3>
                <CopyText
                  source={pillar.body}
                  /* 76ch × 0.666em = 50.6em — matches `Capabilities`' rows. */
                  className="max-w-[50.6em] text-base leading-relaxed text-fg-muted"
                />
              </li>
            ))}
          </ul>
        )}

        {/* The terminal statement — no box, no coloured border, no flag. The air
            above it is deliberately larger than any gap inside the ladder: it is
            not a fourth tier, it is what the three tiers were leading to. */}
        <div data-terminal className="mt-24 sm:mt-28 lg:mt-32">
          <span
            data-rule="close"
            aria-hidden="true"
            className="block h-px w-full origin-left bg-gradient-to-r from-chrome/70 via-chrome/30 to-transparent"
          />
          <CopyText
            source={honestNote}
            className="display mt-10 max-w-[22em] text-[clamp(1.375rem,2.4vw,2rem)] leading-[1.34] text-fg sm:mt-12"
          />
        </div>
      </div>
    </SectionShell>
  )
}
