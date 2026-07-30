import AnnouncementBar from './components/sections/AnnouncementBar'
import Navbar from './components/sections/Navbar'
import Hero from './components/sections/Hero'
import TrustStrip from './components/sections/TrustStrip'
import Products from './components/sections/Products'
import Platform from './components/sections/Platform'
import Pricing from './components/sections/Pricing'
import Onboarding from './components/sections/Onboarding'
import Safety from './components/sections/Safety'
import MobileApp from './components/sections/MobileApp'
import Learn from './components/sections/Learn'
import Stats from './components/sections/Stats'
import Testimonials from './components/sections/Testimonials'
import Faq from './components/sections/Faq'
import Support from './components/sections/Support'
import FinalCta from './components/sections/FinalCta'
import Footer from './components/sections/Footer'

/**
 * Section order follows design-system/thinqprofit/pages/landing.md §7
 * (Trust & Authority spine): proof at position 4, safety before the app pitch.
 *
 * Every section covers the full screen (`min-h-svh`, content vertically
 * centred) — that is the brief. `svh` rather than `vh` so mobile browser chrome
 * doesn't push a section past the fold, and `min-` rather than a fixed height so
 * content-heavy sections (Products, Pricing, Footer) grow instead of clipping.
 *
 * The two deliberate exceptions are TrustStrip and Stats, which opt out with
 * `fullHeight={false}`. Both are thin punctuation bands between sections rather
 * than sections in their own right; giving them a full screen each would put a
 * viewport of empty space around five registration codes.
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
    <div className="grain min-h-screen overflow-x-clip bg-bg text-fg">
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
        <Products />
        <Platform />
        <Pricing />
        <Onboarding />
        <Safety />
        <MobileApp />
        <Learn />
        <Stats />
        <Testimonials />
        <Faq />
        <Support />
        <FinalCta />
      </main>

      <Footer />
    </div>
  )
}
