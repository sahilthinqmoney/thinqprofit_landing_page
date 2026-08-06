import AnnouncementBar from './components/ui/AnnouncementBar'
import Navbar from './components/sections/Navbar'
import Hero from './components/sections/Hero'
import Missing from './components/sections/Missing'
import SectionTwo from './components/sections/SectionTwo'
import Capabilities from './components/sections/Capabilities'
import Security from './components/sections/Security'
import FinalCta from './components/sections/FinalCta'
import Footer from './components/sections/Footer'

/**
 * A waitlist page: a bar, a hero that contains the ask, four sections of
 * argument, a close that repeats the ask, and the legal footer a SEBI-registered
 * broker has to carry.
 */
export default function App() {
  return (
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
        <Missing />
        <SectionTwo />
        <Capabilities />
        <Security />
        <FinalCta />
      </main>

      <Footer />
    </div>
  )
}

