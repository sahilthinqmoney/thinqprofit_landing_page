import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

/**
 * Single place that registers the GSAP plugins and — more importantly — refreshes
 * ScrollTrigger once the page has stopped changing height.
 *
 * ScrollTrigger resolves `start: 'top 88%'` into absolute pixel offsets the moment
 * a trigger is created, and does not re-measure on its own. This page changes
 * height substantially *after* first paint, for three reasons:
 *
 *  1. **Webfonts.** Archivo and Instrument Sans load async. Until they swap in,
 *     every headline is measured in the fallback metrics — and the display type
 *     runs to 104px, so the error is tens of pixels per heading and compounds down
 *     a fourteen-section page.
 *  2. **`min-h-svh` sections.** Their resolved height depends on the visual
 *     viewport, which on mobile settles only after browser chrome does.
 *  3. **The canvases.** HeroCanvas and SignalCanvas size themselves to their
 *     parent on mount.
 *
 * Without a refresh, triggers computed against the pre-font layout never fire, and
 * the tween sits permanently at its from-state: the symptom is a heading stuck at
 * 45% opacity behind a 7px blur, which is exactly what shipped before this module
 * existed.
 */

let registered = false

export function initScrollTrigger() {
  if (registered) return
  registered = true

  gsap.registerPlugin(ScrollTrigger, useGSAP)

  if (typeof document === 'undefined') return

  // Fonts are the big one, and `document.fonts.ready` is the only reliable signal
  // for it. Guarded because the API is absent in some older engines.
  if (document.fonts?.ready) {
    void document.fonts.ready.then(() => ScrollTrigger.refresh())
  }

  /*
   * A second refresh after the first frames have settled, for the canvas and
   * `svh` cases that `fonts.ready` does not cover. Two rAFs plus a short timeout
   * rather than a long single timeout: it lands as early as it safely can, and a
   * refresh is cheap compared with being wrong for the rest of the session.
   */
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      window.setTimeout(() => ScrollTrigger.refresh(), 240)
    })
  })

  // Late-loading media changes document height too, and ScrollTrigger's own
  // resize handling does not see an image finishing decode.
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true })
}

export { gsap, ScrollTrigger, useGSAP }
