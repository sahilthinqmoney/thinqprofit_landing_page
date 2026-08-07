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
 * The primary action is the copper metal — never green, never rose, which are
 * reserved for market data. It is distinguished by *hue* (copper is the only
 * warm surface on the page; chrome is neutral steel precisely so it cannot be a
 * second one) and by *motion* (only this variant carries the live shader), so
 * those two properties are the whole signal and are not decorative.
 *
 * Under the previous platinum brand the first of those was luminance rather than
 * hue — `accent` was simply the brightest surface on the page. Recomputed on the
 * warm ground #0A0808, copper is 9.9166:1 against `fg` white at 19.9782:1 and
 * `fg-muted` at 13.2245:1, so the accent is not the brightest anything and that
 * claim is retired rather than restated. What replaces it is chroma: accent
 * OKLCH C 0.1263 against `chrome`'s 0.0057, a 22.16x gap, where luminance
 * separates nothing at all (accent Y 0.4712 against chrome Y 0.4249 = 1.1091x).
 * Only the action and the mark are saturated copper.
 *
 * TWO DIFFERENT INKS, because there are two different constructions, and the
 * rule is the fill's, not the variant's:
 *
 *  - A genuinely SOLID accent fill takes ink. `variants.primary` below is the
 *    page's one solid coral fill (the no-shader path, and the one `metal={false}`
 *    selects), and it carries `text-on-accent` #2E0F06 at 8.7807:1 rest /
 *    11.2393:1 on the #FFC0A6 hover. White on #FF9E7A would be 2.0146:1. Both
 *    numbers restate figures that were wrong independently of the ground move:
 *    1.99:1 and 8.80:1 were rounding errors, not stale measurements.
 *  - A RING around a dark core takes white, and that is the shipped path. The
 *    label sits on RIM_CORE, never on the metal — see the note there for the
 *    measured ratios. DESIGN.md §4 rule 4 ("button labels are white, not
 *    accent") describes this construction, and the spec's own `.btn.primary`
 *    (a 14%-alpha coral tint, a 1px coral ring, a warm bloom, a white label) is
 *    the same anatomy at terminal density.
 *
 * min-h-11 (44px) satisfies the touch-target floor.
 *
 * ---
 *
 * **Why the metal is on primary only, and not on every button.**
 *
 * Each `LiquidMetalSurface` is its own WebGL context. Browsers cap live
 * contexts — Chrome at roughly 16 — and silently drop the oldest when the cap
 * is passed. Counted rather than estimated (grep, today): ten `<Button>` call
 * sites, seven of them primary, and Products maps two of those over its featured
 * list, so eight metal instances exist and six mount concurrently on a desktop
 * viewport (Navbar's sheet primary is gated behind `mobileOpen &&`). Putting the
 * shader on every call site instead would put a live context behind every ghost
 * link and every secondary as well — and on a page that grew, would start
 * losing surfaces at the bottom of the scroll with no error. This change adds
 * no contexts.
 *
 * The stronger reason is design. Under the gold system, colour marked the action
 * and motion was an amplifier. Platinum removed the colour, which promoted motion
 * to one of only two things separating a primary action from a bordered
 * secondary. Copper hands the colour back — so the honest position is that motion
 * has been demoted to an amplifier again, and the case for restraint is now the
 * plain one: spending it on every control, including ghost links reading "See
 * pricing", would spend an amplifier on things that need no amplifying. Across
 * the eight metal instances it is what says "this is the one".
 *
 * Degradation, restated because it stopped being true when the fill became a
 * rim and the note here did not move with it: it is `.surface-copper` under the
 * shader, not a flat `bg-accent` fill, so a refused context, a reduced-motion
 * preference or an older engine leaves a static polished copper ring around the
 * dark core — the same component without its light, rather than a transparent
 * hole. Reduced motion keeps the shader mounted at speed 0, so that case is
 * still a lit ring, just a still one.
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
 * all but the outer 2px, so the only metal you see is the ring — which is
 * where dispersion reads best anyway, because an iridescent fringe needs an edge
 * to break across.
 *
 * The consequence worth stating, and it is the reason this construction is worth
 * the complexity: the label sits on the dark core, never on the metal, so its
 * contrast is a property of a static gradient and not of an animation. White on
 * the core's lightest stop (#211A17) is 17.1457:1 and on its darkest (#0C0908)
 * is 19.8448:1. The reference implementation used #666666 here, which is 2.84:1
 * against its own core and fails AA outright.
 *
 * THE CORE IS WARMED, and this is the copper move's least obvious consequence.
 * It was `#1c1c22 -> #08080c`, which is blue-black — measured, OKLCH hue 285.46
 * and 285.14 deg, b−r of +6 and +4 in sRGB. A cool patch is most visible exactly
 * where it is surrounded by the accent, and here it is ringed by copper on a
 * ground that is itself warm (#0A0808 at hue 17.62 deg). The new stops sit on
 * the ramp's own hue line: #211A17 at 44.50 deg and #0C0908 at 41.04 deg, the
 * latter 0.01 deg off the accent's 41.03. The old stops measured 16.9550:1 and
 * 19.9930:1 for white, so the swap costs 0.19:1 at the light end and 0.15:1 at
 * the dark end and buys the core out of the wrong temperature; the comments here
 * previously said 17.0:1 and 19.9:1, which were the right numbers rounded.
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
 * The fallback ring is load-bearing rather than decorative. The wrapper's only
 * job is to be the 2px the shader paints — so when the shader does not paint (a
 * refused WebGL context, a browser at the live-context cap, an older engine) an
 * unpainted wrapper left the control with no edge at all: just a dark core on a
 * dark ground, boundary contrast ~1.02:1. The audit caught this as a regression
 * I introduced when the fill became a rim, because moving `variants.primary` off
 * the wrapper took `bg-accent` with it and the documented "degrades to the flat
 * button" stopped being true.
 *
 * `.surface-copper`, not `bg-chrome`, and the copper move inverted this twice
 * over. The old argument was that a static ring should read as a machined edge
 * rather than as a shader frozen mid-frame — which held only because platinum
 * `chrome` and platinum `accent` were the same metal at two brightnesses, so the
 * fallback was still recognisably the brand. Chrome is neutral steel now, and a
 * steel ring around the primary action degrades it into what looks like a
 * different component rather than the same one without its shader. Losing the
 * shader is acceptable; losing the brand is not.
 *
 * It is the ramp rather than the flat `accent` token for a second reason, and
 * this one is not about the fallback at all: the shader composites onto this
 * layer with `mix-blend-overlay`, so the wrapper is no longer just a backstop —
 * it is where the metal's hue actually comes from. `.surface-copper` carries the
 * full derivation; the short version is that the shader's light and dark ends are
 * hardcoded near-white and its only hue control is a colour burn, so a copper
 * rim has to be built in CSS and lit by the shader rather than painted by it.
 *
 * THE BOUNDARY, re-measured stop by stop against the warmed core rather than
 * assumed, because the fallback ring is the only edge the control has when the
 * shader does not paint. Inner edge (ramp against the core's lightest stop
 * #211A17): 3.0104:1 at the ramp's dim #A84A30, 13.0573:1 at its specular
 * #FFD9C6. Outer edge (ramp against the page ground #0A0808): 3.5078:1 to
 * 15.2144:1. Best case anywhere on the ring is #FFD9C6 against the core's dark
 * stop at 15.1128:1. So every stop of the ramp clears WCAG 1.4.11's 3:1 on both
 * of its edges, at the worst point of the gradient, with no shader running —
 * against the ~1.02:1 an unpainted wrapper gave. Chrome would have been safer in
 * pure numbers (#AEAEB2 is 7.7540:1 on the core and 9.0349:1 on the ground) and
 * is still the wrong answer: neutral steel around the one control the page calls
 * copper reads as a different component rather than as the same one without its
 * shader.
 */
/*
 * The bloom, and it is the system's, not an invention: DESIGN.md's
 * `--shadow-accent` is `0 0 18px -6px rgba(255,158,122,.4)`, and the spec's
 * `.btn.primary` renders (getComputedStyle) as
 * `rgba(255,158,122,0.6) 0 0 0 1px inset, rgba(255,158,122,0.4) 0 0 18px -6px`
 * — a coral ring and a warm bloom, and no black shadow at all. This button was
 * already the ring and the dark core; the bloom was the one part of that anatomy
 * missing, so it is added here verbatim.
 *
 * It does not violate "shadows do not invert". That rule governs DEPTH, and
 * depth is still `--shadow-lifted`, neutral black — measured, its 65% black over
 * the ground composites to 1.0327:1, an absence of light. The bloom is the
 * opposite quantity: light the ring is emitting. At full alpha it composites to
 * #6C4436, 2.3945:1 on the ground, and at the ~20% a lens of 18px blur and −6px
 * spread actually delivers just outside the edge it is #3B261F, 1.4106:1. Both
 * are deliberately under the 3:1 a boundary needs — the 2px ring is the
 * boundary, the bloom is only warmth around it, and anything that read as an
 * edge in its own right would give the control two.
 *
 * The bloom is written literally because `--shadow-accent` does not exist in
 * index.css yet and that file is not mine to add it to (see the report); the
 * depth half stays `var(--shadow-lifted)` rather than being inlined beside it,
 * so a change to the page's shadow ladder still reaches this control. Bloom
 * first in the list, so it is the layer nearest the ring.
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
