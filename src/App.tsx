import { useState, useEffect } from 'react'
import Navbar from './components/sections/Navbar'
import Hero from './components/sections/Hero'
import TheGap from './components/sections/TheGap'
import AgenticHands from './components/sections/AgenticHands'
import Capabilities from './components/sections/Capabilities'
import Footer from './components/sections/Footer'
import TermsPage from './components/pages/TermsPage'

export default function App() {
  const [route, setRoute] = useState('home')

  useEffect(() => {
    const handleLocationChange = () => {
      if (typeof window !== 'undefined') {
        if (window.location.pathname === '/terms' || window.location.hash === '#terms') {
          setRoute('terms')
        } else {
          setRoute('home')
        }
      }
    }

    handleLocationChange()
    window.addEventListener('popstate', handleLocationChange)
    window.addEventListener('hashchange', handleLocationChange)
    return () => {
      window.removeEventListener('popstate', handleLocationChange)
      window.removeEventListener('hashchange', handleLocationChange)
    }
  }, [])

  if (route === 'terms') {
    return <TermsPage />
  }

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
        <Capabilities />
        <AgenticHands />
      </main>

      <Footer />
    </div>
  )
}

/**
 * Two teal glows bleeding in from the left, fixed behind the whole page so the
 * scroll moves over one continuous field rather than through a series of
 * separately-lit bands.
 *
 * ── Why there is no blur filter here ───────────────────────────────────────
 *
 * These carried `blur(130px)` and `blur(140px)`, and that was the cause of the
 * white screens and mid-scroll glitching on iOS.
 *
 * A `filter` puts an element on its own composited layer, and a Gaussian blur
 * expands that layer's backing store by roughly three times the radius on every
 * side so the falloff has somewhere to land. Measured on the reported devices:
 *
 *   390x844 @DPR3   332x1182 css  ->  3336 x 5886 device px   74.9 MB
 *   414x896 @DPR3   352x1254 css  ->  3396 x 6102 device px   79.0 MB
 *
 * Both dimensions run past 4096px, the maximum texture size on many iOS GPUs.
 * A filtered layer cannot be tiled the way a plain one can — the filter needs
 * its whole source — so past that limit WebKit cannot allocate the backing
 * store and drops the layer. These are `position: fixed`, which iOS
 * re-composites continuously while the page scrolls, so the failure surfaces
 * as scrolling rather than at load: a glitch, then blank or white content.
 *
 * It also explains why only SOME devices were affected. At 375x667 on DPR 2 the
 * same elements come out 2198x3428 — under the limit, and fine.
 *
 * The blur was doing almost nothing anyway. Its subject is a radial-gradient
 * that already fades to `transparent`, which is smooth by construction; blurring
 * it bought a slightly wider falloff at the price of a 75 MB layer. The stops
 * below carry that falloff directly, so the glow looks the same and no filter,
 * no extra layer and no texture limit are involved.
 */
function AmbientBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div
        className="absolute -left-[20%] top-0 h-[140vh] w-[85vw] max-w-[1100px] opacity-45"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(8, 45, 54, 0.476) 0%, rgba(8, 45, 54, 0.286) 34%, rgba(8, 45, 54, 0.122) 62%, transparent 88%)',
        }}
      />
      <div
        className="absolute -left-[15%] top-[50%] h-[130vh] w-[75vw] max-w-[950px] opacity-35"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(8, 45, 54, 0.408) 0%, rgba(8, 45, 54, 0.231) 36%, rgba(8, 45, 54, 0.088) 66%, transparent 92%)',
        }}
      />
    </div>
  )
}
