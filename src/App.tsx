import Navbar from './components/sections/Navbar'
import Hero from './components/sections/Hero'
import TrustStrip from './components/sections/TrustStrip'
import Products from './components/sections/Products'
import Platform from './components/sections/Platform'
import Terminal from './components/sections/Terminal'
import Safety from './components/sections/Safety'
import FinalCta from './components/sections/FinalCta'
import Footer from './components/sections/Footer'

/**
 * Seven sections and a footer, in the Trust & Authority order of
 * design-system/thinqprofit/pages/landing.md §7 — proof before price, safety
 * before the app pitch.
 *
 * The page was fourteen sections. It is seven, and the cut was the point: a
 * broker page earns trust by saying less with more certainty, so each remaining
 * section states one thing and stops. What went, and why:
 *
 *  - Announcement bar — a dismissable strip above the nav, carrying copy nobody
 *    arrived for. The header is now the nav alone (see `--header-stack`).
 *  - Onboarding — a full viewport of "how to open an account" ahead of any
 *    reason to want one. The account-opening CTAs point at the closing section
 *    instead, which is the one place on the page that asks for the decision.
 *  - Learn, Testimonials, FAQ, Support — four consecutive sections of secondary
 *    material.
 *
 *    NOTE: this previously read "support channels and the escalation ladder
 *    render in full in the footer". That is no longer true. The footer's
 *    statutory blocks — registration & entity details, statutory disclosures,
 *    Attention Investors and the grievance escalation ladder — were removed on
 *    request in the same pass, so the escalation route is not currently stated
 *    anywhere on the page. Flagged, not fixed: see the note in Footer.tsx.
 *  - Stats — five figures, none of them yet verifiable, so the band rendered
 *    nothing at all.
 *  - Pricing — removed on request. Every rate in both tables was an unfilled
 *    `[₹X per executed order]`-style placeholder, so the section's own heading
 *    ("Priced plainly, in advance") was the one claim on the page the section
 *    could not support. Products still names what can be traded; nothing on the
 *    page now states what it costs. `Pricing.tsx` and `src/data/pricing.ts` are
 *    left in place, unreferenced, with the rate card and the statutory
 *    pass-through line intact.
 *
 * Every section covers the full screen (`min-h-svh`, content vertically
 * centred). `svh` rather than `vh` so mobile browser chrome doesn't push a
 * section past the fold, and `min-` rather than a fixed height so the two
 * content-heavy sections (Products, Footer) grow instead of clipping.
 *
 * TrustStrip is the one deliberate exception: a thin band of registrations
 * between the hero and the first section, not a section in its own right.
 */
export default function App() {
  return (
    /*
     * `grain` lays a fixed, pointer-events-none noise field over the whole
     * document at ~4% opacity. A page this dark is mostly one flat ink value,
     * and flat ink at scale reads as absence rather than as a surface; the
     * grain gives it something to be. Fixed rather than in flow so it never
     * repaints with a scrolling layer.
     */
    /*
     * `overflow-x-clip`, not `hidden`: clip contains horizontal overflow without
     * making this element a scroll container, so `position: sticky` and
     * ScrollTrigger's pinning still work against the document scroller. A
     * full-bleed section that miscalculates its gutter can then no longer add
     * horizontal scroll to the whole page — which is what 140px of overflow was
     * doing before this.
     */
    <div className="grain min-h-screen overflow-x-clip bg-[#050505] bg-bg text-fg">
      {/*
        The skip link is one of the page's two genuinely SOLID accent fills (the
        other is `Button`'s primary variant), and that is why it takes ink rather
        than white.

        `on-accent` #050505 on `accent` #E7E9EE measures 16.78:1. A solid fill takes dark ink text.
      */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:text-on-accent"
      >
        Skip to content
      </a>

      <Navbar />

      <main id="main">
        <Hero />
        <TrustStrip />
        <Products />
        <Platform />
        <Terminal />
        <Safety />
        <FinalCta />
      </main>

      <Footer />
    </div>
  )
}
