import { featuredProductIds, products, productsSection } from '../../data/products'
import Button from '../ui/Button'
import MediaCard, { MediaCardRail } from '../ui/MediaCard'
import Reveal from '../ui/Reveal'
import SectionShell from '../ui/SectionShell'
import { plateImage, type PlateId } from '../../lib/media'

/**
 * §5 Products — the half-width-cards module.
 *
 * Deliberately asymmetric, and the asymmetry is the design: the two segments
 * that carry the business (Stocks & ETFs, F&O) get full-height media cards
 * with their copy sitting *on* the art, and the two behind them get a hairline
 * ledger of quiet rows. An earlier version rendered all of them as bordered
 * boxes with icon tiles and ordinals, which said every product matters exactly
 * the same amount — a bento grid standing in for a point of view.
 *
 * The list itself is four long now, down from seven; src/data/products.ts
 * records what went and why.
 *
 * No icon-in-a-box anywhere here. On a media card an icon tile competes with
 * the art it is sitting on; on a ledger row it inflates a one-line fact into
 * a widget. The heading is left-aligned — `SectionShell` defaults that way now,
 * for the same reason the grid is gone: the page had settled into centred slab
 * after centred slab.
 */

/**
 * Art direction per featured product. Each string is the brief while the asset
 * is outstanding, and becomes the asset's real alt text after, so it describes
 * the subject rather than naming a file. It is NOT rendered — `MediaBackdrop`
 * used to print it into the corner of the placeholder, which shipped our
 * production notes to the reader; it now draws a designed plate instead. Both are docs/art-direction.md §A2/§A3 "alt text to ship",
 * verbatim — that file supersedes motion-brief §5's colour direction.
 *
 * Lives here rather than in src/data/products.ts because it is art direction,
 * not copy, and that file is the copy deck's mirror.
 *
 * The previous briefs asked for translucent navy plates under an indigo rim
 * light and cyan filaments at the intersection. That was written for a palette
 * with hue in it. Hue is now reserved entirely for meaning — gain, loss,
 * warning — so a commissioned clip carrying indigo or cyan would put the only
 * coloured light on the page next to a legally required derivatives warning and
 * mean nothing by it. Machined aluminium in an unlit room says the same thing
 * about breadth and interlock, and says it in the material the brand is now
 * made of: depth built from a grazing key on a chamfer, never from one form
 * being a different colour from its neighbour.
 *
 * motion-brief §7 still holds: no numbers, no tickers, no chart forms, nothing
 * green or red, and no upward motion — these are level, lateral and static.
 */
const MEDIA_BRIEF: Record<string, string> = {
  'stocks-etfs':
    'Thin machined aluminium plates suspended in darkness, each catching a narrow band of light along its edge.',
  'futures-options':
    'Two machined rings on offset axes intersecting in darkness, a hard highlight tracing where they cross.',
}

/**
 * Which rendered plate carries which product — A2 and A3, rendered by
 * `tools/plates` from docs/art-direction.md §3. Two entries, because §5 gives
 * two products a media card and the other six a ledger row.
 *
 * The four crops behind each id are four *compositions*, not four exports —
 * §5.3 is explicit that reframing one render to four aspect ratios defeats the
 * mechanism, because the dead zone moves between breakpoints and a crop cannot
 * move a highlight that is already inside it. On a phone `MediaCard`'s title
 * wraps to two lines in a 335px card, so the reserve grows from the top 34% to
 * the top 46% and the artwork is composed for it rather than cropped to it.
 * The paths themselves are derived in `src/lib/media.ts`, which owns the
 * renderer's naming convention.
 *
 * The product ids come from the copy deck and the plate ids from
 * docs/art-direction.md §A2/§A3, and they do not match — `stocks-etfs` is
 * plate `stocks`, `futures-options` is plate `derivatives`. This map is where
 * that mismatch is stated once, rather than being resolved by whoever is
 * editing a section file at the time. A product with no plate falls through to
 * `MediaBackdrop`'s designed field, which is the correct behaviour for the six
 * ledger products: they are deliberately not shot (§3 "not briefed here").
 */
const PLATE: Record<string, PlateId> = {
  'stocks-etfs': 'stocks',
  'futures-options': 'derivatives',
}

/**
 * The letterbox ground behind every plate in the library. It is the page's own
 * ink, read from the token rather than transcribed: the hardcoded `#0B0B0D` it
 * replaces is blue-black, and it flashed as a tinted rectangle in the gap
 * before decode (docs/art-direction.md §4.2). A plate is graded to bottom out
 * on the ground so its frame edge dissolves into the page; that only works if
 * the two are the same value, which a second hex cannot guarantee.
 */
const VOID = 'var(--color-bg)'

export default function Products() {
  const featured = products.filter((product) => featuredProductIds.includes(product.id))

  return (
    <SectionShell
      id="products"
      heading={productsSection.heading}
      subheading={productsSection.subheading}
      scale="lead"
    >
      <Reveal variant="scale">
        {/*
          The rail has to reach the viewport edge. The half-visible next card
          IS the affordance that says "this scrolls"; inside Container's gutter
          it reads as an inset carousel and loses the bleed entirely.

          Container exposes no escape hatch, so cancel its gutter with a
          matching negative margin. The scale below is Container's own
          (px-5 sm:px-6 lg:px-8 xl:px-12) and has to be kept in step with it.

          Deliberately NOT `w-screen` / `100vw`: those measure the viewport
          *including* the scrollbar, so on any desktop with a classic scrollbar
          the row overhangs by ~15px and drops a horizontal scrollbar onto the
          whole document. Cancelling the gutter gives an exact viewport-width
          row up to Container's 1760px cap, and beyond that the rail stays
          aligned with the heading — which is the right answer on an ultrawide
          anyway. MediaCardRail re-applies its own inner gutter, so the cards
          still breathe at the edges.
        */}
        <div className="mx-[calc(50%-50vw)] w-screen max-w-[100vw]">
          <MediaCardRail>
            {featured.map((product) => (
              <MediaCard
                key={product.id}
                title={product.title}
                body={product.body}
                media={{
                  alt: MEDIA_BRIEF[product.id] ?? product.title,
                  tone: VOID,
                  image: PLATE[product.id] ? plateImage(PLATE[product.id]) : undefined,
                }}
                action={
                  <Button href={product.href} variant="primary" size="md">
                    {product.cta}
                  </Button>
                }
              />
            ))}
          </MediaCardRail>
        </div>
      </Reveal>

      {/*
        Removed on request: `FeaturedFinePrint` (the F&O disclosure under the
        cards) and the ledger of remaining products — Mutual Funds, IPO and the
        rest, each with its own disclosure line.

        The section is now the heading, the deck and the two featured cards, and
        nothing else.

        FLAG FOR COMPLIANCE, recorded here because a comment outlives a
        conversation. Three mandated lines went with those blocks and are not
        stated anywhere else on the page:
          - the SEBI F&O loss warning, which has to accompany any derivatives
            offer, and the two cards still offer derivatives;
          - the mutual-fund market-risk line;
          - the Baskets research-analyst registration.
        `FeaturedFinePrint`, `LedgerRow` and `hasDisclosure` were DELETED rather
        than left unreferenced — this project builds with `noUnusedLocals`, so
        dead components fail `tsc -b`. They are recoverable from git history at
        the commit before this one. Every disclosure string itself still lives in
        src/data/products.ts, untouched.
      */}
    </SectionShell>
  )
}
