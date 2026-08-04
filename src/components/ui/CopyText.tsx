import type { ElementType, HTMLAttributes } from 'react'
import { tokenizeCopy } from '../../lib/copyTokens'

interface CopyTextProps extends HTMLAttributes<HTMLElement> {
  source: string
  className?: string
  /** Defaults to `p`; pass `span`/`dd`/`li` when the parent is already a block. */
  as?: ElementType
}

/**
 * Renders a copy-deck string with its `[PLACEHOLDERS]` visible and flagged in
 * warning colour, so an unfilled value can never be mistaken for finished copy.
 *
 * Every section renders deck strings through this, so a placeholder looks the
 * same wherever it appears on the page.
 *
 * ── The two colours this component spends ─────────────────────────────────
 *
 * `text-warning` #E8A13C on the placeholder, 9.1275:1 on the ground and 8.6746:1
 * on `surface`. It is the accent's closest chromatic neighbour at 30.76 deg of
 * hue (the accent is 41.03 deg, warning 71.79 deg), which is why the dotted
 * underline is load-bearing rather than decorative: a bracketed token has to be
 * distinguishable from an inline link and from the accent at a glance, and hue
 * alone is doing less work here than anywhere else on the page. Note for anyone
 * checking the old numbers — index.css used to claim the outgoing #f97316 sat
 * "between copper and red"; measured, #f97316 is 47.60 deg, i.e. 6.57 deg off
 * the accent. The amber moved AWAY from the accent, not between things.
 *
 * `text-accent-soft` #FDC6B2 on an inline link, 13.2208:1 against surrounding
 * body copy at 13.2245:1 — parity to 0.004. That is the token's whole design: a
 * link is separated from the sentence containing it by HUE (40.91 deg, 0.12 deg
 * off the accent) at 54.6% of the accent's chroma, and by nothing else. A dimmed
 * copper was measured and rejected at #C9927E / 7.5121:1, which would put every
 * inline link 1.87x below the luminance of its own prose.
 *
 * ── Numerals ──────────────────────────────────────────────────────────────
 *
 * Placeholders carry `tabular` because most resolve to figures, and `.tabular`
 * is now IBM Plex Mono (DESIGN.md §5). Of the four `.tabular` call sites in
 * source this is the widest-reaching, and on the page as it currently renders it
 * is the only one that emits more than a single element: `Pricing.tsx` is
 * unmounted and `TrustStrip`'s code is suppressed while its values are
 * placeholders, so the rendered set is 2 placeholders from here plus the © year.
 * It is also the only call site that can wrap letters as well as digits —
 * `[₹X or Y% per executed order, whichever is lower]` is mostly
 * prose inside brackets, and the mono sets lowercase 19% wider (600/em against
 * Plex Sans's 504.3/em). It is kept anyway: the whole point of the treatment is
 * that an unfilled token should not blend into the sentence, and a face change
 * is one more axis saying so. Digits themselves move by zero — both faces
 * advance "0" at 600/em.
 */
/*
 * `...rest` exists for ONE reason and it is worth naming, because "spread the
 * props" is otherwise the kind of change that gets added by reflex and grows a
 * component's surface for nothing.
 *
 * `Security`'s ladder animation resolves its targets by `data-*` hook, and two of
 * those targets — tier 1's body and the terminal statement — are rendered by this
 * component. Without a passthrough the attribute is silently dropped: no error,
 * no warning, the element renders correctly, and the only symptom is that
 * `querySelector('[data-note]')` returns null, the guard bails, and the ENTIRE
 * section's entrance never runs. A prop that vanishes quietly is worse than one
 * that throws.
 */
export default function CopyText({
  source,
  className = '',
  as: Tag = 'p',
  ...rest
}: CopyTextProps) {
  return (
    <Tag {...rest} className={`break-words ${className}`}>
      {tokenizeCopy(source).map((token, i) => {
        if (token.kind === 'placeholder') {
          return (
            <span
              key={i}
              className="tabular text-warning underline decoration-warning/40 decoration-dotted underline-offset-4"
            >
              [{token.value}]
            </span>
          )
        }
        if (token.kind === 'strong') {
          return (
            <strong key={i} className="font-semibold text-fg">
              {token.value}
            </strong>
          )
        }
        if (token.kind === 'link') {
          return (
            <a
              key={i}
              href={token.href}
              className="rounded text-accent-soft underline underline-offset-4 transition-colors duration-200 hover:text-fg"
            >
              {token.value}
            </a>
          )
        }
        return <span key={i}>{token.value}</span>
      })}
    </Tag>
  )
}
