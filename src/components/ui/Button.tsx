import { useRef, useState } from 'react'
import type { MouseEvent, ReactNode } from 'react'
import LiquidMetalSurface from './LiquidMetalSurface'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps {
  children: ReactNode
  href?: string
  variant?: Variant
  size?: Size
  className?: string
  type?: 'button' | 'submit'
  onClick?: (e?: MouseEvent<HTMLElement>) => void
  disabled?: boolean

  fullWidth?: boolean
  /**
   * Render a trailing glyph seated in its own well at the button's right edge.
   * Reserve it for the single primary action in a view — an arrow on every
   * control is noise, and stops meaning "this is the one".
   */
  trailing?: ReactNode
  /**
   * Live liquid-metal rim instead of a flat accent fill.
   *
   * Defaults on for `primary` and unavailable elsewhere — see the note below on
   * why this is not on every control. Pass `metal={false}` to opt a primary
   * action out (a form submit inside a panel, say, where a moving surface would
   * pull focus off the field it belongs to).
   */
  metal?: boolean
  'aria-label'?: string
}

/**
 * The page's one action control.
 *
 * The primary variant is the brand metal — never green or rose, which are
 * reserved for market data. It is marked by MOTION (only this variant carries
 * the live shader) and by its metal rim. Both are signal, not decoration.
 *
 * Two constructions, and the ink follows the FILL rather than the variant:
 *
 *  - A solid accent fill takes dark ink. That is `variants.primary` below — the
 *    no-shader path, which `metal={false}` selects — carrying `text-on-accent`
 *    at 8.78:1.
 *  - A RING around a dark core takes white, and this is the shipped path. The
 *    label sits on RIM_CORE, never on the metal, so its contrast is a property
 *    of a static gradient rather than of an animation.
 *
 * `min-h-11` (44px) satisfies the touch-target floor at every size.
 *
 * The shader is on primary only for a hard reason as well as a design one: each
 * `LiquidMetalSurface` is its own WebGL context, browsers cap live contexts
 * (Chrome at roughly 16) and silently drop the oldest past the cap. Putting one
 * behind every ghost link would start losing surfaces down the page with no
 * error.
 *
 * It degrades to a still ring, not a hole: the wrapper is `.surface-copper`
 * underneath the shader, so a refused context or an older engine leaves a static
 * polished copper edge. Reduced motion keeps the shader mounted at speed 0 —
 * that case is a lit ring, just a still one.
 */
const variants: Record<Variant, string> = {
  primary: 'bg-accent text-on-accent hover:bg-accent-hover shadow-lifted',
  secondary: 'border border-border text-fg hover:border-chrome-dim hover:bg-surface-raised',
  ghost: 'text-fg-muted hover:text-fg',
}

/**
 * The metal variant's two layers.
 *
 * RIM_WRAP is the outer element the shader paints; RIM_CORE sits on top and
 * covers all but the outer 2px, so the only metal you see is the ring. That is
 * where dispersion reads best anyway — an iridescent fringe needs an edge to
 * break across — and it puts the label on a static gradient rather than on a
 * moving surface.
 *
 * Two things here are load-bearing:
 *
 *  - The wrapper's `.surface-copper` is the fallback edge AND the hue source.
 *    The shader composites onto it with `mix-blend-overlay` and its own light
 *    and dark ends are hardcoded near-white, so the copper is built in CSS and
 *    lit by the shader rather than painted by it. Without the ramp, an unpainted
 *    wrapper leaves a dark core on a dark ground at ~1.02:1 — no edge at all.
 *    Every stop of the ramp clears WCAG 1.4.11's 3:1 on both of its edges with
 *    no shader running.
 *  - 2px, not 1.5. Below 2px the dispersion has too little width to break
 *    across.
 *
 * The core is a gradient rather than a flat fill because a ring of light around
 * an even interior reads as a sticker, where a top-lit interior reads as a
 * machined part catching the same light.
 *
 * NOTE: the bloom below is grey (rgba(231,233,238,...)) and the core stops are
 * blue-black. Both predate the copper retheme and are the last two cool values
 * on the control — see "Known discrepancy" in the README.
 */
const RIM_WRAP =
  'surface-copper p-[2px] shadow-[0_0_18px_-6px_rgba(231,233,238,0.35),var(--shadow-lifted)]'
const RIM_CORE =
  'overflow-hidden rounded-full bg-[linear-gradient(180deg,#1c1c22_0%,#08080c_100%)] text-fg transition-shadow duration-250 ease-[var(--ease-out-soft)] group-active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.45)]'

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
  disabled = false,
  fullWidth = false,
  trailing,
  metal,
  'aria-label': ariaLabel,
}: ButtonProps) {
  const [pointer, setPointer] = useState<'rest' | 'hover' | 'press'>('rest')
  /**
   * Click ripples, keyed by an incrementing id rather than by index so React
   * does not reuse a DOM node mid-animation and restart it.
   */
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([])
  const rippleId = useRef(0)

  const withMetal = variant === 'primary' && metal !== false

  /**
   * Spawns a ripple at the pointer and retires it after the animation.
   *
   * Skipped entirely under reduced motion — a burst expanding from the click is
   * exactly the kind of unrequested movement that preference exists to stop, and
   * the press-in shadow already confirms the tap.
   */
  const spawnRipple = (event: { clientX: number; clientY: number; currentTarget: unknown }) => {
    if (!withMetal) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const host = event.currentTarget as HTMLElement | null
    if (!host?.getBoundingClientRect) return

    const rect = host.getBoundingClientRect()
    const id = rippleId.current++
    setRipples((prev) => [...prev, { x: event.clientX - rect.left, y: event.clientY - rect.top, id }])
    window.setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id))
    }, 600)
  }

  const sizing = trailing ? trailingSizes[size] : sizes[size]

  const classes = [
    'group relative isolate inline-flex cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full font-medium',
    '[webkit-mask-image:-webkit-radial-gradient(white,black)] [mask-image:-webkit-radial-gradient(white,black)] [clip-path:inset(0_round_9999px)] transform-gpu',
    // Exponential ease-out on colour and transform, and a press that actually
    // gives: a control that does not move under the finger reads as an image
    // of a button. 250ms is long enough to feel weighted, short enough to
    // stay ahead of the tap.
    'transition-[background-color,border-color,color,transform,box-shadow] duration-250 ease-[var(--ease-out-soft)]',
    'active:scale-[0.98]',
    // On the rim variant the wrapper carries only the 2px ring; the padding
    // and type size move inward to the core, which is the element the label
    // actually sits in.
    withMetal ? RIM_WRAP : variants[variant],
    withMetal ? '' : sizing,
    // A flex column defaults to `stretch`. On the rim variant that stretches the
    // wrapper while the dark core inside stays content-width, turning the 2px
    // ring into wide metal slabs either side of the label — which is what it did
    // on mobile before this. Any caller that genuinely wants a full-width button
    // asks for it, and `w-full` below then applies to the core as well.
    withMetal && !fullWidth && !className.includes('w-full') ? 'self-start' : '',
    fullWidth ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  /**
   * Pointer state only drives the shader's speed, so it is wired on the metal
   * variant alone — the flat variants get their hover from CSS, which does not
   * need a React render to change colour.
   */
  const pointerHandlers = withMetal
    ? {
        onMouseEnter: () => setPointer('hover'),
        onMouseLeave: () => {
          setPointer('rest')
          // Without this a pointer that leaves mid-press strands the shader at
          // 2.2x forever, because no mouseup ever arrives on this element.
          setRipples([])
        },
        onMouseDown: (event: MouseEvent<HTMLElement>) => {
          setPointer('press')
          spawnRipple(event)
        },
        onMouseUp: () => setPointer('hover'),
        // Keyboard activation should read the same as a click. Without this the
        // shader never responds for anyone navigating by Tab.
        onFocus: () => setPointer('hover'),
        onBlur: () => setPointer('rest'),
      }
    : {}

  const label = trailing ? (
    <>
      <span>{children}</span>
      <span
        aria-hidden="true"
        className={`ml-1 grid shrink-0 place-items-center rounded-full transition-transform duration-250 ease-[var(--ease-out-soft)] group-hover:translate-x-0.5 group-hover:-translate-y-px ${
          // Ink at 12% is invisible on the dark core, so the rim variant tints
          // its well with the foreground instead.
          withMetal ? 'bg-fg/10' : 'bg-on-accent/12'
        } ${wellSizes[size]}`}
      >
        {trailing}
      </span>
    </>
  ) : (
    children
  )

  const content = withMetal ? (
    <>
      {/* Full-strength metal, filling the wrapper. The core below covers all
          but the wrapper's 2px padding, which is the visible ring. */}
      <LiquidMetalSurface state={pointer} blend="rim" />

      <span
        className={`relative inline-flex items-center justify-center gap-2 ${RIM_CORE} ${sizing} w-full flex-1`}
      >

        {label}
        {ripples.map((r) => (
          <span
            key={r.id}
            aria-hidden="true"
            className="pointer-events-none absolute h-5 w-5 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.42)_0%,rgba(255,255,255,0)_70%)] [animation:button-ripple_600ms_var(--ease-out-expo)_forwards]"
            style={{ left: r.x, top: r.y }}
          />
        ))}
      </span>
    </>
  ) : (
    <span className="relative inline-flex items-center gap-2">{label}</span>
  )

  if (href) {
    return (
      <a href={href} onClick={onClick} className={classes} aria-label={ariaLabel} {...pointerHandlers}>
        {content}
      </a>
    )
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${classes} ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
      aria-label={ariaLabel}
      {...pointerHandlers}
    >
      {content}
    </button>
  )
}
