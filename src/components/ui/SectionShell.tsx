import type { ReactNode } from 'react'
import Container from './Container'

interface SectionShellProps {
  id: string
  eyebrow?: string
  heading: string
  subheading?: string
  children: ReactNode
  /** Slightly raised background, for alternating section rhythm. */
  tone?: 'base' | 'raised'
  /** Centre the heading block. Default true. */
  centered?: boolean
  className?: string
}

/**
 * Standard section wrapper: eyebrow, H2, subheading, then content.
 * Vertical rhythm 96/64/48px per design-system/thinqprofit/pages/landing.md §4.
 */
export default function SectionShell({
  id,
  eyebrow,
  heading,
  subheading,
  children,
  tone = 'base',
  centered = true,
  className = '',
}: SectionShellProps) {
  return (
    <section
      id={id}
      className={`scroll-mt-24 border-t border-border-soft py-12 sm:py-16 lg:py-24 ${
        tone === 'raised' ? 'bg-surface/30' : ''
      } ${className}`}
    >
      <Container>
        <div className={`max-w-2xl ${centered ? 'mx-auto text-center' : ''}`}>
          {eyebrow && (
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent-soft">
              {eyebrow}
            </p>
          )}
          <h2 className="mt-3 text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-[1.15] tracking-[-0.015em] text-fg">
            {heading}
          </h2>
          {subheading && <p className="mt-4 text-base leading-relaxed text-fg-muted">{subheading}</p>}
        </div>

        <div className="mt-10 sm:mt-14">{children}</div>
      </Container>
    </section>
  )
}
