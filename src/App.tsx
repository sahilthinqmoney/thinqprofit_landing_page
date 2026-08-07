import Navbar from './components/sections/Navbar'
import Hero from './components/sections/Hero'
import TheGap from './components/sections/TheGap'
import AgenticHands from './components/sections/AgenticHands'
import Capabilities from './components/sections/Capabilities'
import Footer from './components/sections/Footer'

/**
 * A waitlist page, in the order a visitor meets it:
 *
 *   Navbar        the mark, and the ask once the hero scrolls away
 *   Hero          the ask itself — headline, offer, phone field
 *   TheGap        the problem, in two timestamps
 *   AgenticHands  what is coming next
 *   Capabilities  the rest of the terminal, one card each
 *   Footer        the legal block a SEBI-registered broker has to carry
 */
export default function App() {
  return (
    <div className="grain relative min-h-screen overflow-x-clip bg-bg text-fg">
      <AmbientBackground />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:text-on-accent"
      >
        Skip to content
      </a>

      <Navbar />

      <main id="main" className="relative z-10">
        <Hero />
        <TheGap />
        <AgenticHands />
        <Capabilities />
      </main>

      <Footer />
    </div>
  )
}

/**
 * Two teal glows bleeding in from the left, fixed behind the whole page so the
 * scroll moves over one continuous field rather than through a series of
 * separately-lit bands.
 */
function AmbientBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div
        className="absolute -left-[20%] top-0 h-[140vh] w-[85vw] max-w-[1100px] opacity-45 blur-[130px]"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(8, 45, 54, 0.7) 0%, rgba(8, 45, 54, 0.3) 50%, transparent 80%)',
        }}
      />
      <div
        className="absolute -left-[15%] top-[50%] h-[130vh] w-[75vw] max-w-[950px] opacity-35 blur-[140px]"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(8, 45, 54, 0.6) 0%, rgba(8, 45, 54, 0.2) 55%, transparent 85%)',
        }}
      />
    </div>
  )
}
