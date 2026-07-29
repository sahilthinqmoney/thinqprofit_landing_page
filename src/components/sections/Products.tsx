import {
  Banknote,
  Boxes,
  ChartPie,
  ChevronRight,
  Gem,
  Landmark,
  Layers,
  Rocket,
  TrendingUp,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { Product } from '../../types'
import {
  featuredProductIds,
  products,
  productsSection,
  riskDisclosureIds,
} from '../../data/products'
import CopyText from '../ui/CopyText'
import Disclosure from '../ui/Disclosure'
import Reveal from '../ui/Reveal'
import SectionShell from '../ui/SectionShell'

/**
 * design-system/thinqprofit/pages/landing.md §8 — Products row, Lucide, 1.5px stroke.
 * Keys are the icon NAME strings in src/data/products.ts; values are the canonical
 * lucide components (`ChartPie`, not the deprecated `PieChart` alias).
 */
const iconMap: Record<string, LucideIcon> = {
  'trending-up': TrendingUp,
  layers: Layers,
  'pie-chart': ChartPie,
  rocket: Rocket,
  gem: Gem,
  banknote: Banknote,
  landmark: Landmark,
  boxes: Boxes,
}

/** Bullets carrying a ₹ amount or a figure get tabular numerals. */
const hasNumerals = (text: string) => /[₹\d]/.test(text)

/**
 * Bento rows: 2 feature cards, then two rows of 3. Stagger restarts per row so
 * the 60ms cascade reads left-to-right instead of trailing off. (§6 Motion.)
 */
const revealDelay = (index: number) => (index < 2 ? index : (index - 2) % 3) * 60

interface ProductCardProps {
  product: Product
  featured: boolean
  ordinal: number
}

function ProductCard({ product, featured, ordinal }: ProductCardProps) {
  const Icon = iconMap[product.icon] ?? Layers
  const isRisk = riskDisclosureIds.includes(product.id)

  return (
    <article
      aria-labelledby={`product-${product.id}`}
      className={[
        'group relative flex h-full flex-col overflow-hidden rounded-2xl p-6',
        'transition-colors duration-200',
        featured ? 'border border-border bg-surface sm:p-7' : 'border border-border-soft bg-surface/70',
        'hover:border-accent/40 hover:bg-surface-raised',
        'focus-within:border-accent/40 focus-within:bg-surface-raised',
      ].join(' ')}
    >
      {/* Hairline that marks the two lead cards. Decorative only. */}
      {featured && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-accent via-accent/30 to-transparent"
        />
      )}

      <div className="flex items-start justify-between gap-4">
        <span
          className={`grid shrink-0 place-items-center rounded-xl border border-border-soft bg-bg text-accent-soft ${
            featured ? 'h-11 w-11' : 'h-10 w-10'
          }`}
        >
          <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
        </span>
        {/* Caption role (§3): decorative index, muted — never fg-subtle. */}
        <span
          aria-hidden="true"
          className="tabular pt-1 text-xs font-medium tracking-[0.18em] text-fg-muted"
        >
          {String(ordinal).padStart(2, '0')}
        </span>
      </div>

      {/* H3 role (§3): 1.125rem / 1.4 / 600. The two lead cards get one step up. */}
      <h3
        id={`product-${product.id}`}
        className={`mt-5 font-semibold leading-[1.4] text-fg ${featured ? 'text-xl' : 'text-lg'}`}
      >
        {product.title}
      </h3>
      <CopyText source={product.body} className="mt-2.5 text-base leading-relaxed text-fg-muted" />

      <ul className="mt-5 space-y-3 border-t border-border-soft pt-5">
        {product.bullets.map((bullet) => (
          <li key={bullet} className="flex items-start gap-2.5">
            {/* Offset tracks the 16px/1.625 first line box so the dot sits on the caps. */}
            <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent-soft" />
            <CopyText
              as="span"
              source={bullet}
              className={`text-base leading-relaxed text-fg-muted ${hasNumerals(bullet) ? 'tabular' : ''}`}
            />
          </li>
        ))}
      </ul>

      {product.disclosure && (
        <Disclosure
          tone={isRisk ? 'risk' : 'note'}
          className={isRisk ? 'tabular mt-5' : 'tabular mt-5 border-t border-border-soft pt-4'}
        >
          {product.disclosure}
        </Disclosure>
      )}

      <div className="mt-auto pt-5">
        <a
          href={product.href}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-full text-sm font-medium text-accent-soft transition-colors duration-200 hover:text-fg"
        >
          {product.cta}
          <ChevronRight
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </a>
      </div>
    </article>
  )
}

export default function Products() {
  return (
    <SectionShell
      id="products"
      eyebrow={productsSection.eyebrow}
      heading={productsSection.heading}
      subheading={productsSection.subheading}
    >
      <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-6">
        {products.map((product, index) => {
          const featured = featuredProductIds.includes(product.id)

          return (
            <Reveal
              key={product.id}
              delay={revealDelay(index)}
              className={`h-full ${featured ? 'md:col-span-2 lg:col-span-3' : 'lg:col-span-2'}`}
            >
              <ProductCard product={product} featured={featured} ordinal={index + 1} />
            </Reveal>
          )
        })}
      </div>
    </SectionShell>
  )
}
