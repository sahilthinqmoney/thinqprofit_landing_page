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
  'aria-label'?: string
}

/**
 * Primary action is indigo, never green — green/red are reserved for market data.
 * See design-system/thinqprofit/pages/landing.md §1 conflict 2.
 * min-h-11 (44px) satisfies the touch-target floor.
 */
const variants: Record<Variant, string> = {
  primary: 'bg-accent text-white hover:bg-accent-hover',
  secondary:
    'border border-border text-fg hover:border-fg-muted hover:bg-surface-raised',
  ghost: 'text-fg-muted hover:text-fg',
}

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm min-h-11',
  md: 'px-6 py-3 text-sm min-h-11',
  lg: 'px-7 py-3.5 text-base min-h-12',
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
  'aria-label': ariaLabel,
}: ButtonProps) {
  const classes = [
    'inline-flex cursor-pointer items-center justify-center gap-2 rounded-full font-medium',
    'transition-colors duration-200',
    variants[variant],
    sizes[size],
    fullWidth ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  if (href) {
    return (
      <a href={href} className={classes} aria-label={ariaLabel}>
        {children}
      </a>
    )
  }

  return (
    <button type={type} onClick={onClick} className={classes} aria-label={ariaLabel}>
      {children}
    </button>
  )
}
