import MediaSection from '../ui/MediaSection'
import { plateImage } from '../../lib/media'
import { offer } from '../../data/offer'

/**
 * §6 — "What the list gets". The offer, with its terms attached.
 *
 * ── Why the terms are the same size as the claim ─────────────────────────
 *
 * Everything below the headline renders at body size or one step under it, and
 * nothing in this section is set smaller than 13px. That is the entire design
 * decision here, and it is worth stating plainly because the default for this
 * kind of section is the opposite: a large claim, a CTA, and the conditions in
 * grey 11px type under a "T&Cs apply" link.
 *
 * A page offering six months of free brokerage to strangers has one credibility
 * problem — the reader is waiting to find the catch. Setting the terms at body
 * size, in the same section, above the fold of that section, is the only way to
 * answer that which does not depend on being believed.
 *
 * ── The statutory block is a `risk` disclosure, and that is deliberate ────
 *
 * `Disclosure` is not used here; the block is built inline instead, because the
 * component's `risk` tone renders at 12px inside a warning-tinted box with an
 * icon — correct for a market-risk line appended to a section, wrong for the
 * primary content of one. What matters about the statutory paragraph is that it
 * is READ, and a warning box is a shape readers have learned to skip.
 *
 * It gets a rule, a heading and body-size type instead: the treatment of a
 * subsection, not of a footnote.
 *
 * ── Plate ────────────────────────────────────────────────────────────────
 *
 * `scale`, copy parked right, scrim core at 74%. §3 above parks left, so the two
 * plate sections on the page alternate — DESIGN.md §5.5 rejects two neighbours
 * sharing a composition, because if two sections put their subject in the same
 * place the scroll flattens.
 *
 * Still, not motion: §4.2 permits a loop on the hero and the closing plate only.
 */
export default function Offer() {
  return (
    <MediaSection
      id="offer"
      className="isolate"
      height="tall"
      place="right"
      anchor="center"
      /*
       * 0.88, matching §3. This section carries the most text of any full-bleed
       * band on the page — a deck, three terms and a statutory paragraph — so
       * the dark area has to hold for the full height of the copy column rather
       * than falling off under a headline and a sentence.
       */
      scrim={0.88}
      scrimAt="74% 50%"
      measure="12em"
      headline={offer.heading}
      body={offer.summary}
      media={{
        alt: 'A machined aluminium mechanism at rest in near-black, lit from one side.',
        image: plateImage(offer.plate),
      }}
    >
      {/*
        The three terms. A plain list with hairlines, not bullets and not chips.

        Bullets would put a glyph in front of each line for no information, and
        the bordered check-chip row — the shape this section would have taken in
        a template — spends three pieces of chrome saying "these are features"
        about three sentences that are actually conditions.
      */}
      <ul className="mt-10 max-w-[38em] border-t border-border-soft">
        {offer.terms.map((term) => (
          <li
            key={term}
            className="border-b border-border-soft py-4 text-base leading-relaxed text-fg-muted"
          >
            {term}
          </li>
        ))}
      </ul>

      {/*
        The statutory block. Its own heading, its own rule, body-size type.

        `chrome` on the rule rather than `border`: it is the same full-strength
        gradient hairline `Security` uses to open and close its ladder, and it
        marks this as a structural division of the section rather than another
        list separator. There are exactly two of those weights of rule on the
        page and both mean "a new part of the argument starts here".

        Not `accent`, which is what this was written as and what `Safety` used
        before it. In the platinum palette `--color-accent` is #2c2f38 — a dark
        metal meant to be a FILL under white text — so an `accent/60` hairline
        composites to roughly #1c1d21 on the ground, 1.19:1, and the rule simply
        does not render. `chrome` #a9aeb8 at 70% is the machined edge this was
        always describing, and it is visible.
      */}
      <div className="mt-12 max-w-[38em]">
        <span
          aria-hidden="true"
          className="block h-px w-full bg-gradient-to-r from-chrome/70 via-chrome/30 to-transparent"
        />
        <h3 className="display mt-6 text-[clamp(1.25rem,1.6vw,1.5rem)] leading-[1.2] text-fg">
          {offer.statutoryHeading}
        </h3>
        <p className="mt-3 text-base leading-relaxed text-fg-muted">{offer.statutory}</p>
        {/*
          The proof line, set in `fg` rather than `fg-muted`. It is the sentence
          that turns a disclosure into something the reader can check for
          themselves, which makes it the most useful line in the block and the
          one that should not recede.
        */}
        <p className="mt-3 text-base leading-relaxed text-fg">{offer.statutoryProof}</p>
      </div>
    </MediaSection>
  )
}
