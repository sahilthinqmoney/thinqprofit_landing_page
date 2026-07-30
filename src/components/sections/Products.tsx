import type { Product } from '../../types'
import {
  featuredProductIds,
  products,
  productsSection,
  riskDisclosureIds,
} from '../../data/products'
import Button from '../ui/Button'
import CopyText from '../ui/CopyText'
import Disclosure from '../ui/Disclosure'
import MediaCard, { MediaCardRail } from '../ui/MediaCard'
import Reveal from '../ui/Reveal'
import SectionShell from '../ui/SectionShell'

/**
 * §5 Products — the half-width-cards module.
 *
 * Deliberately asymmetric, and the asymmetry is the design: the two segments
 * that carry the business (Stocks & ETFs, F&O) get full-height media cards
 * with their copy sitting *on* the art, and the other six get a hairline
 * ledger of quiet rows. The previous version rendered all eight as bordered
 * boxes with icon tiles and 01–08 ordinals, which said every product matters
 * exactly the same amount — a bento grid standing in for a point of view.
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
 * The letterbox ground behind every plate in the library. It is the page's own
 * ink, read from the token rather than transcribed: the hardcoded `#0B0B0D` it
 * replaces is blue-black, and it flashed as a tinted rectangle in the gap
 * before decode (docs/art-direction.md §4.2). A plate is graded to bottom out
 * on the ground so its frame edge dissolves into the page; that only works if
 * the two are the same value, which a second hex cannot guarantee.
 */
const VOID = 'var(--color-bg)'

type WithDisclosure = Product & { disclosure: string }

const hasDisclosure = (product: Product): product is WithDisclosure =>
  Boolean(product.disclosure)

/**
 * Fine print for the two media cards.
 *
 * The F&O derivatives warning is legally required and has to be live text at
 * 4.5:1 (copy deck §20, landing.md §9). It therefore renders here, on the page
 * background, rather than inside the MediaCard: type over a video plate has no
 * guaranteed contrast ratio, and the card's scrim is precisely the "behind a
 * blur or glass" treatment disclosures are forbidden to sit in. The product
 * name labels each one so the association survives the move out of the card.
 */
function FeaturedFinePrint({ items }: { items: WithDisclosure[] }) {
  if (items.length === 0) return null

  return (
    <div className="mt-10 space-y-8 sm:mt-12">
      {items.map((product) => (
        <div key={product.id} className="max-w-[68ch]">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-fg-muted">
            {product.title}
          </p>
          <Disclosure
            tone={riskDisclosureIds.includes(product.id) ? 'risk' : 'note'}
            className="tabular mt-2"
          >
            {product.disclosure}
          </Disclosure>
        </div>
      ))}
    </div>
  )
}

/**
 * One ledger row: name — description — link. No card, no border box, no
 * ordinal, no bullet dots. The hairlines between rows are the only structure,
 * which is what lets six of these read as a list of facts instead of six more
 * objects competing with the two cards above.
 */
function LedgerRow({ product }: { product: Product }) {
  return (
    <li className="py-7 sm:py-8">
      {/* The link is stretched across this box so the whole row is a target —
          but only this box. The disclosure below sits outside it and stays
          selectable, which live regulatory text has to be. */}
      <div className="group relative grid items-baseline gap-x-10 gap-y-2 md:grid-cols-[minmax(0,14rem)_minmax(0,1fr)_auto]">
        <h3 className="text-lg font-medium leading-snug text-fg sm:text-xl">{product.title}</h3>

        <CopyText source={product.body} className="text-base leading-relaxed text-fg-muted" />

        <a
          href={product.href}
          className="inline-flex min-h-11 items-center gap-1.5 self-center text-sm font-medium text-accent-soft transition-colors duration-200 after:absolute after:inset-0 hover:text-fg md:justify-self-end"
        >
          {product.cta}
          <span
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          >
            &rarr;
          </span>
        </a>
      </div>

      {product.disclosure && (
        <Disclosure tone="note" className="tabular mt-3 max-w-[68ch]">
          {product.disclosure}
        </Disclosure>
      )}
    </li>
  )
}

export default function Products() {
  const featured = products.filter((product) => featuredProductIds.includes(product.id))
  const rest = products.filter((product) => !featuredProductIds.includes(product.id))

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
                media={{ alt: MEDIA_BRIEF[product.id] ?? product.title, tone: VOID }}
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

      <FeaturedFinePrint items={featured.filter(hasDisclosure)} />

      {/* The quiet half. One reveal for the whole ledger rather than six
          staggered ones — a cascade would make the rows perform, and the point
          of them is that they don't. */}
      <Reveal variant="scale">
        <ul className="mt-20 divide-y divide-border-soft border-y border-border-soft sm:mt-24">
          {rest.map((product) => (
            <LedgerRow key={product.id} product={product} />
          ))}
        </ul>
      </Reveal>
    </SectionShell>
  )
}
