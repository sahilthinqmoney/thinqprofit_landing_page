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
 * a widget. The heading is left-aligned (`centered={false}`) for the same
 * reason the grid is gone — the page had settled into centred slab after
 * centred slab.
 */

/**
 * Art direction per featured product — docs/motion-brief.md §5.1: 3–4s silent
 * seamless loops, one abstract motif each, all shot in the same ink-navy void.
 * Each string is the brief while the clip is outstanding (MediaBackdrop prints
 * it into the placeholder field) and becomes the asset's real alt text after,
 * so it describes the motif rather than naming a file.
 *
 * Lives here rather than in src/data/products.ts because it is art direction,
 * not copy, and that file is the copy deck's mirror.
 *
 * §7 is baked in: no numbers, no tickers, no chart forms, no green or red, and
 * no upward motion — the motifs rotate, orbit and interleave, never climb.
 */
const MEDIA_BRIEF: Record<string, string> = {
  'stocks-etfs':
    'Stocks and ETFs — a cluster of thin translucent navy plates suspended in a dark void, rotating slowly, each catching an indigo rim light as it turns.',
  'futures-options':
    'Futures and options — two interlocking luminous rings on offset axes turning in opposite directions, cyan filaments tracing where they intersect.',
}

/** The ink-navy void every asset in the library shares (motion-brief §5). */
const VOID = '#0F172A'

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
    <div className="mt-8 space-y-6 sm:mt-10">
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
    <li className="py-6 sm:py-7">
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
      eyebrow={productsSection.eyebrow}
      heading={productsSection.heading}
      subheading={productsSection.subheading}
      scale="lead"
      centered={false}
    >
      <Reveal>
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
        <div className="-mx-5 sm:-mx-6 lg:-mx-8 xl:-mx-12">
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
      <Reveal>
        <ul className="mt-16 divide-y divide-border-soft border-y border-border-soft sm:mt-20">
          {rest.map((product) => (
            <LedgerRow key={product.id} product={product} />
          ))}
        </ul>
      </Reveal>
    </SectionShell>
  )
}
