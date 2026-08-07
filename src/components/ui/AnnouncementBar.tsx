import { useState, useEffect } from 'react'
import Container from './Container'
import { RAIL } from './SectionShell'
import { announcement } from '../../data/waitlist'

/**
 * §1 — the announcement bar.
 */
export default function AnnouncementBar() {
  const [scrolled, setScrolled] = useState(false)


  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    /* Docked Announcement Bar (Appears ONLY on scroll at top-0, showing ONLY the offer text) */
    <div
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 transform border-b border-white/15 bg-bg/90 backdrop-blur-2xl shadow-lg ${
        scrolled ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      <Container>
        <div className={`flex h-[var(--announce-h)] items-center justify-center ${RAIL}`}>
          <p className="text-center text-xs font-semibold tracking-wide text-fg drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">
            {announcement.offer}
          </p>
        </div>
      </Container>
    </div>
  )
}


