import Navbar from './components/sections/Navbar'
import Hero from './components/sections/Hero'
import Missing from './components/sections/Missing'
import SectionTwo from './components/sections/SectionTwo'
import Capabilities from './components/sections/Capabilities'
import Footer from './components/sections/Footer'

/**
 * A waitlist page: a bar, a hero that contains the ask, four sections of
 * argument, a close that repeats the ask, and the legal footer a SEBI-registered
 * broker has to carry.
 */
export default function App() {
  return (
    <div className="grain relative min-h-screen overflow-x-clip bg-bg text-fg">
      {/* Universal smooth #082d36 ambient background gradient coming from the left side */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        {/* Top-left ambient glow */}
        <div
          className="absolute -left-[20%] top-0 h-[140vh] w-[85vw] max-w-[1100px] opacity-45 blur-[130px]"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(8, 45, 54, 0.7) 0%, rgba(8, 45, 54, 0.3) 50%, transparent 80%)',
          }}
        />
        {/* Mid-lower left ambient glow */}
        <div
          className="absolute -left-[15%] top-[50%] h-[130vh] w-[75vw] max-w-[950px] opacity-35 blur-[140px]"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(8, 45, 54, 0.6) 0%, rgba(8, 45, 54, 0.2) 55%, transparent 85%)',
          }}
        />
      </div>

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:text-on-accent"
      >
        Skip to content
      </a>

      <Navbar />

      <main id="main" className="relative z-10">
        <Hero />
        <Missing />
        <SectionTwo />
        <Capabilities />
      </main>

      <Footer />
    </div>
  )
}
