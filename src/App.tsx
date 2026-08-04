import AnnouncementBar from './components/ui/AnnouncementBar'
import Navbar from './components/sections/Navbar'
import Hero from './components/sections/Hero'
import TrustStrip from './components/sections/TrustStrip'
import Missing from './components/sections/Missing'
import Capabilities from './components/sections/Capabilities'
import Security from './components/sections/Security'
import Offer from './components/sections/Offer'
import FinalCta from './components/sections/FinalCta'
import Footer from './components/sections/Footer'

/**
 * A waitlist page: a bar, a hero that contains the ask, four sections of
 * argument, a close that repeats the ask, and the legal footer a SEBI-registered
 * broker has to carry.
 *
 * ── The spine ─────────────────────────────────────────────────────────────
 *
 *  1. Announcement — the offer and the deadline, above everything.
 *  2. Hero — the claim, the value proposition, and the form.
 *  3. Trust strip — "are you real", answered before anything is asked for.
 *  4. Missing — the one feature, in depth, on a plate. The page's argument.
 *  5. Capabilities — everything else, one line each. A summary, shaped as one.
 *  6. Security — where the money and the shares sit. A ladder of claims.
 *  7. Offer — the terms in full, at body size, with the statutory block.
 *  8. Close — the ask again, for the reader who needed the argument first.
 *  9. Footer — registration, disclosures, SCORES.
 *
 * The order is a decision rather than a template. Proof (3) precedes argument
 * (4–5); safety (6) precedes price (7); the ask appears twice and nowhere in
 * between. A reader convinced by the bar can convert without scrolling; a reader
 * who needs all of it arrives at the same form having read the whole case.
 *
 * ── What was removed, and why it is not coming back as-is ────────────────
 *
 * Five sections went with the content rewrite: Products, Platform, Terminal,
 * MobileApp and Pricing, along with their data files. They described an
 * account-opening product with an instrument list and a rate card — a page for a
 * broker that has launched. Every rate in Pricing was an unfilled placeholder,
 * which made its own heading ("Priced plainly, in advance") the one claim it
 * could not support.
 *
 * They are in git, not in the tree. Leaving five unreferenced sections in place
 * "in case" is how a codebase acquires two descriptions of the product, and the
 * second one is always the one someone edits by mistake.
 *
 * ── Composition ──────────────────────────────────────────────────────────
 *
 * Two full-bleed plate sections (4, 7) alternate their copy side — left, then
 * right — and the close (8) is centred. DESIGN.md §5.5 rejects two neighbours
 * sharing a composition, because if two sections put their subject in the same
 * place the scroll flattens. The flat sections (5, 6) sit between them, which is
 * what keeps four consecutive full-bleed frames from happening.
 */
export default function App() {
  return (
    /*
     * `grain` lays a fixed, pointer-events-none noise field over the whole
     * document at ~4% opacity. A page this dark is mostly one flat ink value,
     * and flat ink at scale reads as absence rather than as a surface; the grain
     * gives it something to be. Fixed rather than in flow so it never repaints
     * with a scrolling layer.
     *
     * `overflow-x-clip`, not `hidden`: clip contains horizontal overflow without
     * making this element a scroll container, so `position: sticky` and
     * ScrollTrigger's pinning still work against the document scroller.
     *
     * `bg-bg` alone. It read `bg-[#050505] bg-bg`, which set the background
     * twice — harmless only while the token happens to equal that hex, and
     * silently wrong the moment `--color-bg` moves. The token is the single
     * source; an arbitrary value beside it is a second one.
     */
    <div className="grain min-h-screen overflow-x-clip bg-bg text-fg">
      {/*
        The skip link is one of the page's two genuinely SOLID accent fills (the
        other is `Button`'s primary variant), and that is why it takes ink rather
        than white: `on-accent` #050505 on `accent` #E7E9EE measures 16.78:1.

        It targets `#main`, which now sits below the announcement bar and the nav
        — so a keyboard user skips the bar as well as the navigation, which is
        the point of it.
      */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:text-on-accent"
      >
        Skip to content
      </a>

      <AnnouncementBar />
      <Navbar />

      <main id="main">
        <Hero />
        <TrustStrip />
        <Missing />
        <Capabilities />
        <Security />
        <Offer />
        <FinalCta />
      </main>

      <Footer />
    </div>
  )
}
