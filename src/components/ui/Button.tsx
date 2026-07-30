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
  onClick?: () => void
  fullWidth?: boolean
  /**
   * Render a trailing glyph seated in its own well at the button's right edge.
   * Reserve it for the single primary action in a view — an arrow on every
   * control is noise, and stops meaning "this is the one".
   */
  trailing?: ReactNode
  /**
   * Live liquid-metal surface instead of a flat alloy fill.
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
 * The primary action is the chromatic alloy — never green, never red, which are
 * reserved for market data. With no hue in the brand, the action is distinguished
 * by *luminance* (`accent` is the brightest surface on the page) and by *motion*
 * (only this variant carries the live shader), so those two properties are the
 * whole signal and are not decorative.
 *
 * The fill carries `text-on-accent` (ink), never white: white on #E7E9EE is
 * 1.21:1, ink is 16.78:1. Same rule the gold system had, at a different value —
 * a bright fill has never been able to hold white text.
 * See design-system/thinqprofit/pages/landing.md §1 conflict 2.
 * min-h-11 (44px) satisfies the touch-target floor.
 *
 * ---
 *
 * **Why the metal is on primary only, and not on every button.**
 *
 * Each `LiquidMetalSurface` is its own WebGL context. Browsers cap live
 * contexts — Chrome at roughly 16 — and silently drop the oldest when the cap
 * is passed, so a page that puts a shader on every `<Button>` call site (sixteen
 * of them at present) would sit at the cap and start losing surfaces at the
 * bottom of the scroll with no error. It would also cost sixteen shader programs
 * animating at once.
 *
 * The stronger reason is design, and the brand change sharpened it rather than
 * softening it. Under the gold system, colour marked the action and motion was
 * an amplifier; now that there is no brand colour, motion is one of only two
 * things separating a primary action from a bordered secondary. Spending it on
 * every control — including ghost links reading "See pricing" — would spend the
 * page's only remaining emphasis on nothing. Across the ~10 primary instances it
 * is what says "this is the one".
 *
 * The flat `bg-accent` fill stays underneath in every case, so a refused
 * context, a reduced-motion preference, or an older browser degrades to a
 * static alloy button rather than to a transparent hole.
 */
const variants: Record<Variant, string> = {
  primary: 'bg-accent text-on-accent hover:bg-accent-hover shadow-lifted',
  secondary: 'border border-border text-fg hover:border-chrome-dim hover:bg-surface-raised',
  ghost: 'text-fg-muted hover:text-fg',
}

/**
 * The metal variant is a *rim*, not a fill.
 *
 * The shader fills the outer element; a dark core sits on top of it and covers
 * all but the outer 1.5px, so the only metal you see is the ring — which is
 * where dispersion reads best anyway, because an iridescent fringe needs an edge
 * to break across.
 *
 * The consequence worth stating: the label now sits on the dark core, so it is
 * light text, not ink. White on the core's lightest stop (#1c1c22) is 17.0:1 and
 * on its darkest (#08080c) is 19.9:1. The reference implementation used #666666
 * here, which is 2.84:1 against its own core and fails AA outright.
 *
 * The core is a gradient rather than a flat fill because a ring of light around
 * a perfectly even interior reads as a sticker; a top-lit interior reads as a
 * machined part with the same light falling on it.
 */
/*
 * 2px, not 1.5. The reference sets a 2px ring on a 46px-tall control; at this
 * page's `lg` size the same absolute value reads proportionally thinner, and at
 * 1.5px the dispersion had too little width to break across.
 */
/*
 * `bg-chrome` is the fallback ring, and it is load-bearing rather than
 * decorative. The wrapper's only job is to be the 2px the shader paints — so
 * when the shader does not paint (a refused WebGL context, a browser at the
 * live-context cap, an older engine) an unpainted wrapper left the control with
 * no edge at all: just a dark core on a dark ground, boundary contrast ~1.02:1.
 * The audit caught this as a regression I introduced when the fill became a rim,
 * because moving `variants.primary` off the wrapper took `bg-accent` with it and
 * the documented "degrades to the flat button" stopped being true.
 *
 * chrome rather than accent: a static ring should read as a machined edge, not
 * as a shader frozen mid-frame.
 */
const RIM_WRAP = 'bg-chrome p-[2px] shadow-lifted'
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
    // Exponential ease-out on colour and transform, and a press that actually
    // gives: a control that does not move under the finger reads as an image
    // of a button. 250ms is long enough to feel weighted, short enough to
    // stay ahead of the tap.
    'transition-[background-color,border-color,color,transform,box-shadow] duration-250 ease-[var(--ease-out-soft)]',
    'active:scale-[0.98]',
    // On the rim variant the wrapper carries only the 1.5px ring; the padding
    // and type size move inward to the core, which is the element the label
    // actually sits in.
    withMetal ? RIM_WRAP : variants[variant],
    withMetal ? '' : sizing,
    // A flex column defaults to `stretch`. On the rim variant that stretches the
    // wrapper while the dark core inside stays content-width, turning the 2px
    // ring into wide metal slabs either side of the label — which is what it did
    // on mobile before this. Any caller that genuinely wants a full-width button
    // asks for it, and `w-full` below then applies to the core as well.
    withMetal && !fullWidth ? 'self-start' : '',
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
          but the wrapper's 1.5px padding, which is the visible ring. */}
      <LiquidMetalSurface state={pointer} blend="rim" />

      <span
        className={`relative inline-flex items-center justify-center gap-2 ${RIM_CORE} ${sizing} ${
          fullWidth ? 'w-full' : ''
        }`}
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
      <a href={href} className={classes} aria-label={ariaLabel} {...pointerHandlers}>
        {content}
      </a>
    )
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={classes}
      aria-label={ariaLabel}
      {...pointerHandlers}
    >
      {content}
    </button>
  )
}
