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
import {
  directLinks,
  loginLabel,
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

/** One mega-menu row: icon + label + one-line description (deck §2.3–2.5). */
function MenuLink({ item, onNavigate }: MenuLinkProps) {
  return (
    <a
      href={item.href}
      onClick={() => {
        focusFragmentTarget(item.href)
        onNavigate()
      }}
      className="group flex min-h-11 items-start gap-3 rounded-xl px-3 py-2.5 transition-colors duration-200 hover:bg-surface-raised focus-visible:bg-surface-raised"
    >
      {/* Hover lights the well as brushed metal, not as an action. `accent` on a
          menu row would put the page's action value on twenty-odd links; chrome
          is the token for a machined edge and stays clear of that. */}
      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-border-soft bg-bg/60 text-fg-muted transition-colors duration-200 group-hover:border-chrome/40 group-hover:text-chrome">
        <ItemIcon name={item.icon} />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-medium text-fg">{item.label}</span>
        {/* Deck §20 — nav descriptions are one line, ~48 chars, and truncate below that. */}
        <span className="mt-0.5 block truncate text-xs leading-snug text-fg-muted">
          {item.description}
        </span>
      </span>
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
          <div
            className="relative"
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
                  className="flex shrink-0 items-center gap-2 rounded-full py-2 pr-2 transition-opacity duration-200 hover:opacity-90"
                >
                  {/* The mark is `chrome`, not `accent`, and that is the whole
                      point of the luminance gap between them.

                      An accent-filled tile would be the brightest object in the
                      bar — brighter than the signup CTA sitting two controls to
                      its right, which is the one element on the page that is
                      meant to be. With no hue left in the system, luminance and
                      motion are the *only* signals separating a mark from an
                      action, so the mark takes the step down: chrome carries a
                      little over half the light of the alloy and none of the
                      shader.

                      The glyph is ink, never white. Every surface in this family
                      is too bright to hold white type — white is 1.2:1 on the
                      alloy and ~2.1:1 on chrome; ink is 9.16:1 here. */}
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-chrome xl:h-9 xl:w-9">
                    <TrendingUp
                      className="h-4 w-4 text-bg xl:h-5 xl:w-5"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </span>
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
                                    + the row's own px-3, at both scales. */}
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

              {/* Desktop actions. gap-2 from lg up so the two 44px targets keep
                  the 8px separation the touch-target rule asks for; 4px at md,
                  where the bar is at its tightest and the pointer is a mouse. */}
              <div
                className="hidden shrink-0 items-center gap-1 md:flex lg:gap-2"
                onPointerEnter={hoverOpen(null)}
              >
                <Button href="#" variant="ghost" size="sm" className="xl:px-5">
                  {loginLabel}
                </Button>
                <Button
                  href="#onboarding"
                  variant="primary"
                  size="sm"
                  className="xl:px-5"
                >
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
              {/* Same mark, same reasoning as the desktop bar: chrome tile, ink
                  glyph. The sheet's own primary action sits in the footer of
                  this panel, so the gap still has to hold. */}
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-chrome">
                <TrendingUp className="h-4 w-4 text-bg" strokeWidth={1.5} aria-hidden="true" />
              </span>
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
            <div className="flex flex-col gap-3">
              <Button href="#" variant="secondary" size="md" fullWidth>
                {loginLabel}
              </Button>
              <Button href="#onboarding" variant="primary" size="md" fullWidth>
                {signupLabel}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
