import type { ElementType } from 'react'
import { tokenizeCopy } from '../../lib/copyTokens'

interface CopyTextProps {
  source: string
  className?: string
  /** Defaults to `p`; pass `span`/`dd`/`li` when the parent is already a block. */
  as?: ElementType
}

/**
 * Renders a copy-deck string, flagging any `[PLACEHOLDER]` in warning colour so
 * an unfilled value can never be mistaken for finished copy. Also handles
 * `**bold**` and `[label](href)`. See src/lib/copyTokens.ts for the grammar.
 *
 * Every section renders deck strings through this, so a placeholder looks the
 * same wherever it lands on the page.
 *
 * Two colour choices are load-bearing:
 *
 *  - The placeholder's dotted underline is not decoration. Warning amber is the
 *    accent copper's nearest neighbour in the palette (30.76 deg of hue), so the
 *    underline is what keeps a bracketed token distinct from an inline link.
 *  - Inline links use `accent-soft`, which sits at 13.22:1 against body copy's
 *    13.22:1 — parity. A link is separated from its sentence by hue alone, by
 *    design. A dimmed copper was tried and rejected: it put every inline link
 *    1.87x below the luminance of its own prose.
 *
 * Placeholders carry `tabular` because most of them resolve to figures.
 */
export default function CopyText({ source, className = '', as: Tag = 'p' }: CopyTextProps) {
  return (
    <Tag className={`break-words ${className}`}>
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
