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
    <div className="min-h-screen bg-bg text-fg">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:text-white"
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
