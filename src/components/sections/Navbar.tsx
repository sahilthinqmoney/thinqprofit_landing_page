import { useCallback, useEffect, useRef, useState } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent, FocusEvent as ReactFocusEvent } from 'react'
import {
  Banknote,
  Bell,
  BookOpen,
  Boxes,
  Calculator,
  ChartCandlestick,
  ChartPie,
  ChevronDown,
  CirclePlay,
  Code,
  FileText,
  Filter,
  FlaskConical,
  Gem,
  GitBranch,
  Globe,
  GraduationCap,
  Landmark,
  LayoutGrid,
  Menu as MenuIcon,
  Newspaper,
  Repeat,
  Rocket,
  Scale,
  Smartphone,
  Table2,
  Timer,
  TrendingUp,
  UserPlus,
  X,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Button from '../ui/Button'
import Container from '../ui/Container'
import ThinqMark from '../ui/ThinqMark'
import { RAIL } from '../ui/SectionShell'
import {
  directLinks,
  megaMenus,
  mobileOrder,
  signupLabel,
  wordmark,
  wordmarkAlt,
} from '../../data/nav'
import type { NavMegaMenu } from '../../data/nav'
import type { MenuItem, NavItem } from '../../types'

/** Icon-name → component. Lucide only, 1.5px stroke (landing.md §8). */
const icons: Record<string, LucideIcon> = {
  Banknote,
  Bell,
  BookOpen,
  Boxes,
  Calculator,
  ChartCandlestick,
  ChartPie,
  CirclePlay,
  Code,
  FileText,
  Filter,
  FlaskConical,
  Gem,
  GitBranch,
  Globe,
  GraduationCap,
  Landmark,
  LayoutGrid,
  Newspaper,
  Repeat,
  Rocket,
  Scale,
  Smartphone,
  Table2,
  Timer,
  TrendingUp,
  UserPlus,
}

/**
 * Bar height. Shared between the flex row and each trigger `<li>` so the hover
 * strip always fills the bar and the panel's `top-full` anchor stays in step.
 * Taller from `xl` up: at a 1344–1664px content width a 64px bar reads thin.
 */
const BAR_HEIGHT = 'h-16 xl:h-20'

type MobileEntry =
  | { kind: 'menu'; key: string; menu: NavMegaMenu }
  | { kind: 'link'; key: string; link: NavItem }

/** Deck §2.6 — Products → Platform → Pricing → Learn → Support. */
const mobileEntries: MobileEntry[] = mobileOrder.flatMap((label): MobileEntry[] => {
  const menu = megaMenus.find((item) => item.label === label)
  if (menu) return [{ kind: 'menu', key: menu.id, menu }]
  const link = directLinks.find((item) => item.label === label)
  return link ? [{ kind: 'link', key: link.label, link }] : []
})

function ItemIcon({ name }: { name: string }) {
  const Icon = icons[name] ?? TrendingUp
  return <Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
}

/**
 * Hand focus to the section a fragment link points at.
 *
 * Activating a menu link closes the menu on the same click that navigates, so
 * React unmounts the focused anchor and focus falls to `<body>` — a keyboard
 * user lands nowhere and has to tab from the top of the document again. Moving
 * focus onto the target first means the anchor is no longer the active element
 * when it unmounts, and the next Tab continues from the destination.
 *
 * The `tabindex` is temporary and removed on blur: these sections belong to
 * other components and must not be left with attributes this file added.
 * `preventScroll` leaves scrolling to the browser's own fragment handling,
 * which index.css asks to be smooth.
 */
function focusFragmentTarget(href: string) {
  if (!href.startsWith('#') || href.length < 2) return
  const target = document.getElementById(href.slice(1))
  if (!target) return
  if (!target.hasAttribute('tabindex')) {
    target.setAttribute('tabindex', '-1')
    target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true })
  }
  target.focus({ preventScroll: true })
}

interface MenuLinkProps {
  item: MenuItem
  onNavigate: () => void
}

/**
 * One mega-menu row: icon + label.
 *
 * The one-line description under each label is gone — 28 of them, 189 words. A
 * description reading "Charts, volumes, order types" under a label reading
 * "Charts" tells a reader who has already found Charts what charts are. Apple,
 * Linear and Stripe do not explain their own menu items either.
 *
 * The row is a single line now, so `items-start` becomes `items-center` and the
 * icon loses its optical nudge — both existed only to align a glyph against two
 * lines of text.
 */
function MenuLink({ item, onNavigate }: MenuLinkProps) {
  return (
    <a
      href={item.href}
      onClick={() => {
        focusFragmentTarget(item.href)
        onNavigate()
      }}
      className="group flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 transition-colors duration-200 hover:bg-surface-raised focus-visible:bg-surface-raised"
    >
      {/* Hover lights the well as neutral steel, not as an action. `accent` on a
          menu row would put the page's action value on twenty-odd links, which
          §4 rule 1 forbids outright — the accent means "you can act on this", and
          it is now the most saturated thing on the page rather than the
          brightest, so spending it here would be louder than it used to be, not
          quieter. `chrome` is the token for a machined edge. Measured, the 40%
          edge composites to #524F4F on the panel's `surface` fill, 2.3418:1 — a
          lift the eye catches on a row it is already pointing at, well under the
          3:1 a boundary carrying information would need. */}
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-border-soft bg-bg/60 text-fg-muted transition-colors duration-200 group-hover:border-chrome/40 group-hover:text-chrome">
        <ItemIcon name={item.icon} />
      </span>
      <span className="min-w-0 truncate text-sm font-medium text-fg">{item.label}</span>
    </a>
  )
}

/**
 * Copy deck §2. Sticky nav below the announcement bar — both live in normal
 * flow, so no content hides behind a fixed element and dismissing the
 * announcement simply lifts the nav.
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)

  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const panelRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const hamburgerRef = useRef<HTMLButtonElement>(null)
  const sheetCloseRef = useRef<HTMLButtonElement>(null)
  const sheetRef = useRef<HTMLDivElement>(null)
  /**
   * Intent flag, not a lifecycle flag: only a deliberate dismiss (Escape or the
   * sheet's close button) should send focus back to the hamburger. A mount —
   * including StrictMode's double setup/cleanup — must never move focus.
   */
  const restoreFocus = useRef(false)

  /* Border + blur only once the page has moved (~12px). */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Lock body scroll while the mobile sheet is open; restore on close. */
  useEffect(() => {
    if (!mobileOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [mobileOpen])

  /* Move focus into the sheet on open, back to the hamburger on a deliberate close. */
  useEffect(() => {
    if (mobileOpen) {
      sheetCloseRef.current?.focus()
    } else if (restoreFocus.current) {
      restoreFocus.current = false
      hamburgerRef.current?.focus()
    }
  }, [mobileOpen])

  /* Escape closes the sheet. */
  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      restoreFocus.current = true
      setMobileOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [mobileOpen])

  /* Escape also closes a mega-menu opened by hover, where focus never entered
     the trigger or the panel and their local handlers can never fire. */
  useEffect(() => {
    if (!openMenu) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenMenu(null)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [openMenu])

  /* The sheet is mobile-only — drop it if the viewport grows past the breakpoint. */
  useEffect(() => {
    const query = window.matchMedia('(min-width: 768px)')
    const onChange = () => {
      if (query.matches) setMobileOpen(false)
    }
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  const closeMenu = useCallback((menuId: string, refocus: boolean) => {
    setOpenMenu(null)
    if (refocus) triggerRefs.current[menuId]?.focus()
  }, [])

  const menuItemsOf = (menuId: string) =>
    Array.from(panelRefs.current[menuId]?.querySelectorAll<HTMLAnchorElement>('a[href]') ?? [])

  const onTriggerKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>, menuId: string) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      closeMenu(menuId, true)
      return
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setOpenMenu(menuId)
      // Panel mounts on the next commit; focus the first row after paint.
      requestAnimationFrame(() => menuItemsOf(menuId)[0]?.focus())
    }
  }

  const onPanelKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>, menuId: string) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      closeMenu(menuId, true)
      return
    }
    const items = menuItemsOf(menuId)
    if (items.length === 0) return
    const current = items.indexOf(document.activeElement as HTMLAnchorElement)

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      items[(current + 1) % items.length]?.focus()
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      items[(current - 1 + items.length) % items.length]?.focus()
    } else if (event.key === 'Home') {
      event.preventDefault()
      items[0]?.focus()
    } else if (event.key === 'End') {
      event.preventDefault()
      items[items.length - 1]?.focus()
    }
  }

  /* Tabbing out of the nav closes whatever is open. */
  const onNavBlur = (event: ReactFocusEvent<HTMLDivElement>) => {
    if (!openMenu) return
    const next = event.relatedTarget as Node | null
    if (!next || !event.currentTarget.contains(next)) setOpenMenu(null)
  }

  /**
   * Mouse-driven close, guarded.
   *
   * A menu opened with Enter must survive the pointer merely crossing the nav
   * on its way somewhere else. If focus is still on the open trigger or inside
   * its panel the keyboard owns the menu, and a stray `mouseleave` or a hover
   * over a neighbouring link has no business dismissing it.
   */
  const closeMenuOnHover = useCallback(() => {
    setOpenMenu((current) => {
      if (!current) return current
      const active = document.activeElement
      const keyboardOwnsIt =
        active !== null &&
        (triggerRefs.current[current] === active || panelRefs.current[current]?.contains(active))
      return keyboardOwnsIt ? current : null
    })
  }, [])

  const hoverOpen = (menuId: string | null) => (event: { pointerType: string }) => {
    if (event.pointerType !== 'mouse') return
    // Hovering another trigger is deliberate intent on a nav control, so it
    // still switches; only the incidental closes are guarded.
    if (menuId === null) closeMenuOnHover()
    else setOpenMenu(menuId)
  }

  /**
   * Focus trap for the mobile sheet. `inert` on the header covers the nav, but
   * the skip link, <main> and <footer> stay tabbable behind the overlay, so Tab
   * would otherwise walk into content the dialog is covering. Wrap at both ends
   * and pull stray focus back in.
   */
  const onSheetKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab') return
    const sheet = sheetRef.current
    if (!sheet) return

    const focusables = Array.from(
      sheet.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ),
    )
    if (focusables.length === 0) return

    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    const index = focusables.indexOf(document.activeElement as HTMLElement)

    // -1 covers the dialog itself holding focus after a click on empty space.
    if (index === -1) {
      event.preventDefault()
      ;(event.shiftKey ? last : first).focus()
    } else if (event.shiftKey && index === 0) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && index === focusables.length - 1) {
      event.preventDefault()
      first.focus()
    }
  }

  return (
    <>
      {/* transition-colors does not cover backdrop-filter, so the blur popped in
          while the background and border cross-faded. Name the properties. */}
      <header
        inert={mobileOpen}
        className={`sticky top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-200 ${
          scrolled
            ? 'border-border-soft bg-bg/85 backdrop-blur-xl'
            : 'border-border-soft/0 bg-bg/0'
        }`}
      >
        <Container>
          {/* The nav sits on `SectionShell`'s rail, not on Container's full
              1760px. Once the sections centre at 84rem, a nav that keeps
              running to the Container edge puts the wordmark ~200px left of
              every heading beneath it on a wide display — the page would have
              two left edges and two centres. The rail is what makes the
              wordmark, every section title and the footer share one axis. */}
          <div
            className={`relative ${RAIL}`}
            onMouseLeave={closeMenuOnHover}
            onBlur={onNavBlur}
          >
            <div className={`flex ${BAR_HEIGHT} items-center justify-between gap-2`}>
              {/* Wordmark and the primary links travel together as one left
                  cluster. Left as three `justify-between` groups, a 1664px bar
                  strands the links mid-air with ~450px of nothing on either
                  side; anchored to the wordmark they still read as one
                  navigation object and the whole void collects on the right,
                  where the actions terminate it. */}
              <div className="flex min-w-0 items-center gap-2 lg:gap-6 xl:gap-10">
                {/* §2.1 wordmark — mark to the left of the text lockup */}
                <a
                  href="#main"
                  aria-label={wordmarkAlt}
                  onPointerEnter={hoverOpen(null)}
                  /* `lockup` is the hover target for the mark's thinking
                     animation — see index.css. It sits on the anchor rather than
                     on the mark so the pointer triggers it from anywhere on the
                     link, including the word: mark and name are one thing to
                     click, and a mark that only answers a pointer that finds a
                     24px circle reads as broken rather than as restrained. */
                  className="lockup flex shrink-0 items-center gap-2.5 rounded-full py-2 pr-2 transition-opacity duration-200 hover:opacity-90"
                >
                  {/* The mark is `chrome`, not `accent` — and the reason is no
                      longer the luminance gap, which no longer exists.

                      That was the platinum argument: alloy 16.78:1 against
                      chrome 9.16:1, so an accent tile would have been the
                      brightest object in the bar and the mark took a step down.
                      Copper deletes it. Measured, accent #FF9E7A has relative
                      luminance 0.4712 and chrome #AEAEB2 has 0.4249 — a ratio of
                      1.1091x, and 1.0976:1 taken as a contrast pair. There is no
                      step. Two surfaces of the same brightness cannot be told
                      apart by brightness.

                      What separates them now is CHROMA, and it is the wider
                      channel of the two the platinum palette had: OKLCH chroma
                      0.1263 on the accent against 0.0057 on chrome, a gap of
                      22.16x, plus 245.23 deg of hue between them (41.03 deg
                      against 286.26 deg). The rule the page enforces is "only
                      the action is saturated copper" — so a mark beside live
                      controls is neutral steel, which is DESIGN.md §4 verbatim:
                      "cool mark against warm interface... the cool/warm split is
                      what keeps the mark legible against coral chrome instead of
                      dissolving into it." §23 splits it by context and this is
                      the case it sends to chrome; the footer wordmark is the
                      other case, and that one IS copper.

                      ── THE TILE AND THE GLYPH ARE BOTH GONE ────────────────

                      What sat here was a `chrome` rounded tile containing
                      lucide's `TrendingUp`. Two separate problems, and the first
                      one is not a taste question.

                      **A rising arrow is a returns claim.** The spec's product
                      constraints forbid it in as many words — "Forbidden: bulls,
                      rockets, arrows, ascending candles, coins. They imply
                      assured returns." This page carries a SEBI market-risk
                      disclosure in the hero rail one scroll below, and the mark
                      above it was drawing a line going up. That is the single
                      most regulated implication on an Indian broker page, and it
                      was in the logo.

                      **The tile was scaffolding for a glyph, not a mark.** A
                      stock interface icon needs a container to read as a logo;
                      it has no silhouette of its own, and 6,010 other products
                      ship the identical path data. The real mark needs no tile
                      and gets none — the spec renders it bare, and a ring with a
                      trail is already a shape.

                      Tone is steel, and that is the spec's rule rather than a
                      preference: a mark's tone is a function of the GROUND, not
                      of the accent, "because an accent means you can act on this,
                      and a logotype is not actionable". §07 carves out coral for
                      brand surfaces where the accent leads — that case is the
                      footer wordmark, not this bar, which has the copper CTA two
                      controls to its right and cannot afford a second copper
                      object competing with it.

                      The chroma numbers above are why steel still reads: 0.0057
                      against the accent's 0.1263 is a 22.16x gap doing the work
                      luminance no longer can. */}
                  {/* 28 in a 64px bar and 34 in an 80px one — 0.4375 and 0.425
                      of the bar, which is the spec's own proportion (21–22 in a
                      48px bar = 0.4375) rather than an eyeballed size. It shipped
                      at 24/28 first, i.e. 0.375 and 0.350, which is 14–20% under.

                      The proportion matters more here than it would for a filled
                      glyph, because of what this mark is: an outline ring plus
                      two dots at r 1.85 and r 1.25. It carries far less ink per
                      unit area than a solid shape, so at 0.375 beside a 15–18px
                      wordmark at weight 600 the mark read optically lighter than
                      the word it is supposed to lead — and a lockup whose mark is
                      quieter than its wordmark reads as an afterthought.

                      `small` at both sizes: it thickens the ring from 2 to 2.3
                      units, which renders 2.68px at 28 and 3.26px at 34. That is
                      what holds the ring's weight against the wordmark. */}
                  <ThinqMark
                    size={28}
                    tone="steel"
                    small
                    className="shrink-0 xl:h-[34px] xl:w-[34px]"
                  />
                  <span className="text-[0.9375rem] font-semibold tracking-tight text-fg lg:text-base xl:text-lg">
                    {wordmark}
                  </span>
                </a>

                {/* Desktop nav */}
                <nav aria-label="Primary" className="hidden md:block">
                  <ul className="flex items-center lg:gap-1 xl:gap-2">
                    {megaMenus.map((menu) => {
                      const isOpen = openMenu === menu.id
                      const panelId = `nav-panel-${menu.id}`
                      // Local const so the narrowing survives into the click handler.
                      const footer = menu.footer
                      return (
                        <li
                          key={menu.id}
                          className={`flex ${BAR_HEIGHT} items-center ${
                            menu.wide ? 'static' : 'relative'
                          }`}
                          onPointerEnter={hoverOpen(menu.id)}
                        >
                          <button
                            type="button"
                            ref={(node) => {
                              triggerRefs.current[menu.id] = node
                            }}
                            aria-expanded={isOpen}
                            aria-controls={isOpen ? panelId : undefined}
                            onClick={() => setOpenMenu(isOpen ? null : menu.id)}
                            onKeyDown={(event) => onTriggerKeyDown(event, menu.id)}
                            className={`inline-flex min-h-11 cursor-pointer items-center gap-1 rounded-full px-1.5 text-[0.8125rem] font-medium transition-colors duration-200 lg:px-3 lg:text-sm xl:px-4 xl:text-[0.9375rem] ${
                              isOpen ? 'text-fg' : 'text-fg-muted hover:text-fg'
                            }`}
                          >
                            {menu.label}
                            <ChevronDown
                              className={`h-3.5 w-3.5 transition-transform duration-200 ${
                                isOpen ? 'rotate-180' : ''
                              }`}
                              strokeWidth={1.5}
                              aria-hidden="true"
                            />
                          </button>

                          {isOpen && (
                            /* The wide panel stretches with the container, but
                               only up to a point: three columns of short links
                               spread across 1664px read as an empty shelf. The
                               cap keeps ~365px per column — wide enough that
                               the longest description clears its `truncate`,
                               narrow enough that the panel still looks like a
                               menu rather than a section. */
                            <div
                              id={panelId}
                              ref={(node) => {
                                panelRefs.current[menu.id] = node
                              }}
                              onKeyDown={(event) => onPanelKeyDown(event, menu.id)}
                              className={`absolute top-full pt-3 ${
                                menu.wide
                                  ? 'left-0 w-full max-w-[1200px]'
                                  : 'left-0 w-80 max-w-[calc(100vw-3rem)] xl:w-96'
                              }`}
                            >
                              <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl">
                                <div
                                  className={`grid gap-x-6 gap-y-5 p-4 xl:gap-x-8 xl:p-5 ${
                                    menu.wide ? 'md:grid-cols-3' : ''
                                  }`}
                                >
                                  {menu.columns.map((column) => (
                                    <div key={column.heading || menu.id}>
                                      {column.heading && (
                                        <p className="mb-1 px-3 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-fg-muted">
                                          {column.heading}
                                        </p>
                                      )}
                                      <ul>
                                        {column.items.map((item) => (
                                          <li key={item.label}>
                                            <MenuLink
                                              item={item}
                                              onNavigate={() => setOpenMenu(null)}
                                            />
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  ))}
                                </div>

                                {/* px matches the row text inset: panel padding
                                    + the row's own px-3, at both scales.

                                    The inline link is `accent-soft`, and that
                                    token now separates a link from its sentence
                                    by HUE ALONE — which is the thing copper
                                    bought and platinum could not do. Measured on
                                    this exact plate (bg/40 over surface =
                                    #110C0B): the link is 12.8527:1 and the
                                    sentence around it is 12.8562:1. Parity to
                                    0.004, so nothing recedes or jumps; the only
                                    difference is 40.91 deg of hue at 54.6% of
                                    the accent's chroma. Its 40% underline
                                    composites to #6F564E, 2.8828:1 against the
                                    plate — a decoration, not a rule. */}
                                {footer && (
                                  <p className="flex flex-wrap items-center gap-x-1.5 border-t border-border-soft bg-bg/40 px-7 py-3 text-xs text-fg-muted xl:px-8">
                                    <span>{footer.text}</span>
                                    <a
                                      href={footer.href}
                                      onClick={() => {
                                        focusFragmentTarget(footer.href)
                                        setOpenMenu(null)
                                      }}
                                      className="font-medium text-accent-soft underline decoration-accent-soft/40 underline-offset-4 transition-colors duration-200 hover:text-fg hover:decoration-fg/60"
                                    >
                                      {footer.linkLabel}
                                    </a>
                                    {footer.trailing && <span>{footer.trailing}</span>}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </li>
                      )
                    })}

                    {directLinks.map((link) => (
                      <li key={link.label} className={`flex ${BAR_HEIGHT} items-center`}>
                        <a
                          href={link.href}
                          onPointerEnter={hoverOpen(null)}
                          className="inline-flex min-h-11 items-center rounded-full px-1.5 text-[0.8125rem] font-medium text-fg-muted transition-colors duration-200 hover:text-fg lg:px-3 lg:text-sm xl:px-4 xl:text-[0.9375rem]"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>

              {/*
                Desktop actions. gap-2 everywhere, not `gap-1 lg:gap-2`, and the
                4px it replaces is the only contrast FAIL the audit found on the
                shipped page.

                `:focus-visible` is `outline: 2px` at `outline-offset: 2px`, so a
                focus ring occupies the band 2–4px outside its control — exactly
                the 4px `gap-1` left between these two. At md the ring on `Log in`
                therefore ended flush against the copper rim of the primary beside
                it and had nothing to read against: measured on the rendered page
                at 768px, the pixel immediately outside the ring is #F8D2A8 (the
                rim's specular) and the ring #FFC0A6 against it is 1.1074:1, where
                WCAG 1.4.11 asks 3:1 of a focus indicator. At ≥1024, where the gap
                was already 8px, the same ring measures 11.3274:1 — so the ring was
                fine at every width except the one where the two controls were
                closest, which is the width where it matters most.

                8px is 4px of page ground either side of the ring, and the touch-
                target rule wanted it anyway. It costs 4px of bar width at md,
                which the bar has: measured at 768 the cluster ends 24px short of
                the rail's right edge and the nav links end 200px+ short on the
                left, so nothing reflows.

                The alternative — shrinking `outline-offset` to 1px — was rejected:
                it leaves 1px of ground between ring and rim, which is a hairline
                of separation rather than a legible one, and it would have moved a
                value §40 fixes for the whole system to solve a local layout
                collision.
              */}
              <div
                className="hidden shrink-0 items-center gap-2 md:flex"
                onPointerEnter={hoverOpen(null)}
              >
                {/* The `Log in` ghost button is gone, and the 8px gap argument
                    above is now moot rather than wrong — there is no second
                    control beside the primary for its focus ring to collide
                    with. The note stays because the collision returns the moment
                    anything is put back here.

                    Why it went: there is nothing to log in to. The product has
                    not opened, which is the premise of the entire page, and a
                    `Log in` control beside `Join the waitlist` invites a reader
                    to try an account they cannot have. It was pointing at `#`. */}
                {/* The waitlist path is the closing section, which is the one
                    place on the page that asks for the decision with the whole
                    argument behind it. The hero's own form is above this button,
                    so scrolling up to it would be the wrong direction. */}
                {/* No `xl:px-5` here, and that is a correction rather than an
                    omission. `className` lands on the OUTER element, which on a
                    metal primary is `RIM_WRAP` — the wrapper whose entire job is
                    to be the 2px the shader paints. Measured at xl the override
                    resolved to `padding: 2px 20px`, so the ring rendered 20px
                    wide down both sides while every other primary on the page
                    stayed at 2px: a bright copper slab in the nav against a
                    hairline rim in the hero, from one utility class.

                    The ghost login above keeps `xl:px-5` because it has no rim —
                    there its padding IS the control's padding. On the rim
                    variant the size prop already carries the core's padding
                    inward, which is where a wider button has to come from. */}
                <Button href="#final-cta" variant="primary" size="sm">
                  {signupLabel}
                </Button>
              </div>

              {/* Mobile trigger. Open-only: the header is inert while the sheet
                  is up, so this button is unreachable then and a "Close menu"
                  label would be a state the user can never observe. The sheet
                  carries its own close button. */}
              <button
                type="button"
                ref={hamburgerRef}
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                aria-expanded={mobileOpen}
                className="-mr-2 grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-full text-fg transition-colors duration-200 hover:bg-surface-raised md:hidden"
              >
                <MenuIcon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
              </button>
            </div>
          </div>
        </Container>
      </header>

      {/* Mobile sheet — rendered outside the header so the header's backdrop
          filter never becomes its containing block. */}
      {mobileOpen && (
        <div
          ref={sheetRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          /* -1 so a click on empty sheet space parks focus here rather than on
             <body>, keeping the next Tab inside the trap. */
          tabIndex={-1}
          onKeyDown={onSheetKeyDown}
          className="fixed inset-0 z-[60] flex flex-col bg-bg md:hidden"
        >
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-border-soft px-6">
            <span className="flex items-center gap-2">
              {/* Same mark, same tone, same reasoning as the desktop bar. The
                  sheet's own primary action sits in the footer of this panel, so
                  the separation still has to hold — and here it is carried
                  entirely by chroma (0.0057 against the accent's 0.1263),
                  because the two metals are within 1.0976:1 of each other in
                  luminance.

                  No `lockup` class: this is a static header inside an open
                  sheet, not a link, so there is nothing to hover and no reason
                  to animate. */}
              <ThinqMark size={24} tone="steel" small className="shrink-0" />
              <span className="text-[0.9375rem] font-semibold tracking-tight text-fg">
                {wordmark}
              </span>
            </span>
            <button
              type="button"
              ref={sheetCloseRef}
              onClick={() => {
                restoreFocus.current = true
                setMobileOpen(false)
              }}
              aria-label="Close menu"
              className="-mr-2 grid h-11 w-11 cursor-pointer place-items-center rounded-full text-fg transition-colors duration-200 hover:bg-surface-raised"
            >
              <X className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain px-6">
            <ul className="divide-y divide-border-soft">
              {mobileEntries.map((entry) => {
                if (entry.kind === 'link') {
                  return (
                    <li key={entry.key}>
                      <a
                        href={entry.link.href}
                        onClick={() => {
                          focusFragmentTarget(entry.link.href)
                          setMobileOpen(false)
                        }}
                        className="flex min-h-14 items-center py-4 text-base font-medium text-fg"
                      >
                        {entry.link.label}
                      </a>
                    </li>
                  )
                }

                const { menu } = entry
                const expanded = openAccordion === menu.id
                // Local const so the narrowing survives into the click handler.
                const sheetFooter = menu.footer
                return (
                  <li key={entry.key}>
                    <button
                      type="button"
                      onClick={() => setOpenAccordion(expanded ? null : menu.id)}
                      aria-expanded={expanded}
                      aria-controls={expanded ? `sheet-${menu.id}` : undefined}
                      aria-label={`${expanded ? 'Collapse' : 'Expand'} ${menu.label}`}
                      className="flex min-h-14 w-full cursor-pointer items-center justify-between gap-3 py-4 text-left text-base font-medium text-fg"
                    >
                      {menu.label}
                      <ChevronDown
                        className={`h-5 w-5 text-fg-muted transition-transform duration-200 ${
                          expanded ? 'rotate-180' : ''
                        }`}
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                    </button>

                    {expanded && (
                      <div id={`sheet-${menu.id}`} className="pb-4">
                        {menu.columns.map((column) => (
                          <div key={column.heading || menu.id} className="mb-2 last:mb-0">
                            {column.heading && (
                              <p className="px-3 pb-1 pt-2 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-fg-muted">
                                {column.heading}
                              </p>
                            )}
                            <ul>
                              {column.items.map((item) => (
                                <li key={item.label}>
                                  <MenuLink
                                    item={item}
                                    onNavigate={() => setMobileOpen(false)}
                                  />
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}

                        {sheetFooter && (
                          <p className="mt-1 flex flex-wrap items-center gap-x-1.5 rounded-xl border border-border-soft bg-surface/60 px-3 py-3 text-xs text-fg-muted">
                            <span>{sheetFooter.text}</span>
                            <a
                              href={sheetFooter.href}
                              onClick={() => {
                                focusFragmentTarget(sheetFooter.href)
                                setMobileOpen(false)
                              }}
                              className="font-medium text-accent-soft underline decoration-accent-soft/40 underline-offset-4"
                            >
                              {sheetFooter.linkLabel}
                            </a>
                            {sheetFooter.trailing && <span>{sheetFooter.trailing}</span>}
                          </p>
                        )}
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="shrink-0 border-t border-border-soft bg-surface/40 px-6 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
            {/* One action, matching the desktop bar. The secondary `Log in`
                button that stood above it is gone for the reason recorded
                there: there is nothing to log in to yet. */}
            <div className="flex flex-col gap-3">
              <Button href="#final-cta" variant="primary" size="md" fullWidth>
                {signupLabel}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
