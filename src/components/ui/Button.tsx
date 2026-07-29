import type { ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps {
  children: ReactNode
  href?: string
  variant?: Variant
  size?: Size
  className?: string
  type?: 'button' | 'submit'
  onClick?: () => void
  fullWidth?: boolean
  /**
   * Render a trailing glyph seated in its own well at the button's right edge.
   * Reserve it for the single primary action in a view — an arrow on every
   * control is noise, and stops meaning "this is the one".
   */
  trailing?: ReactNode
  'aria-label'?: string
}

/**
 * Primary action is gold, never green — green/red are reserved for market data.
 * The fill carries `text-on-accent` (ink), never white: white on #D4AF37 is
 * 2.10:1 and fails outright.
 * See design-system/thinqprofit/pages/landing.md §1 conflict 2.
 * min-h-11 (44px) satisfies the touch-target floor.
 */
const variants: Record<Variant, string> = {
  primary: 'bg-accent text-on-accent hover:bg-accent-hover shadow-lifted',
  secondary: 'border border-border text-fg hover:border-chrome-dim hover:bg-surface-raised',
  ghost: 'text-fg-muted hover:text-fg',
}

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm min-h-11',
  md: 'px-6 py-3 text-sm min-h-11',
  lg: 'px-7 py-3.5 text-base min-h-12',
}

/** With a trailing well, the right padding tightens so the well sits flush. */
const trailingSizes: Record<Size, string> = {
  sm: 'pl-4 pr-1.5 py-1.5 text-sm min-h-11',
  md: 'pl-6 pr-2 py-2 text-sm min-h-11',
  lg: 'pl-7 pr-2 py-2 text-base min-h-12',
}

const wellSizes: Record<Size, string> = {
  sm: 'h-8 w-8',
  md: 'h-8 w-8',
  lg: 'h-9 w-9',
}

export default function Button({
  children,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  onClick,
  fullWidth = false,
  trailing,
  'aria-label': ariaLabel,
}: ButtonProps) {
  const classes = [
    'group inline-flex cursor-pointer items-center justify-center gap-2 rounded-full font-medium',
    // Exponential ease-out on colour and transform, and a press that actually
    // gives: a control that does not move under the finger reads as an image
    // of a button. 250ms is long enough to feel weighted, short enough to
    // stay ahead of the tap.
    'transition-[background-color,border-color,color,transform,box-shadow] duration-250 ease-[var(--ease-out-soft)]',
    'active:scale-[0.98]',
    variants[variant],
    trailing ? trailingSizes[size] : sizes[size],
    fullWidth ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const content = trailing ? (
    <>
      <span>{children}</span>
      <span
        aria-hidden="true"
        className={`ml-1 grid shrink-0 place-items-center rounded-full bg-on-accent/12 transition-transform duration-250 ease-[var(--ease-out-soft)] group-hover:translate-x-0.5 group-hover:-translate-y-px ${wellSizes[size]}`}
      >
        {trailing}
      </span>
    </>
  ) : (
    children
  )

  if (href) {
    return (
      <a href={href} className={classes} aria-label={ariaLabel}>
        {content}
      </a>
    )
  }

  return (
    <button type={type} onClick={onClick} className={classes} aria-label={ariaLabel}>
      {content}
    </button>
  )
}
