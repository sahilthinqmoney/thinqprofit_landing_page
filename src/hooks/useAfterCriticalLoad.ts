import { useEffect, useState } from 'react'

/**
 * True once the page has finished its critical load and the main thread is idle.
 *
 * This exists to keep heavy media off the critical path. The hero's HLS ladder
 * is ~3.5 MB — 92% of the page's entire transfer — and it used to begin the
 * moment the gate saw the hero in view, which is at hydration. Nothing about
 * the first viewport waits on it: the poster is preloaded, prerendered and
 * already painted by then, and the clip cross-fades in over it whenever it
 * arrives. So those bytes were competing with the load rather than following it.
 *
 * `load` alone is not enough — it fires before hydration has finished its work
 * on a slow device — so an idle callback follows it, capped by a timeout so a
 * permanently busy main thread cannot withhold the clip forever.
 *
 * The signal is module-level, not per-hook: every gate on the page resolves off
 * one set of listeners, and a component mounting after the moment has passed
 * gets `true` immediately rather than waiting for a `load` that already fired.
 */

let reached = false
const waiting = new Set<() => void>()
let scheduled = false

function markReached() {
  if (reached) return
  reached = true
  for (const notify of waiting) notify()
  waiting.clear()
}

function scheduleOnce() {
  if (scheduled || reached || typeof window === 'undefined') return
  scheduled = true

  const afterIdle = () => {
    /*
     * `typeof ... === 'function'` rather than an `in` check. The DOM lib types
     * declare requestIdleCallback as always present on Window, so `in` narrows
     * the fallback branch to `never` and the build rejects it — while the API
     * is genuinely absent on older Safari, which is exactly who the fallback is
     * for. Testing the value sidesteps the lie in the type without pretending
     * the method is there.
     */
    if (typeof window.requestIdleCallback === 'function') {
      // The timeout is the guarantee: on a main thread that never goes idle the
      // clip still arrives, just late.
      window.requestIdleCallback(markReached, { timeout: 2_000 })
    } else {
      window.setTimeout(markReached, 200)
    }
  }

  if (document.readyState === 'complete') afterIdle()
  else window.addEventListener('load', afterIdle, { once: true })
}

export function useAfterCriticalLoad(): boolean {
  /*
   * Starts false on every render path including the browser's first, so the
   * tree matches the prerendered HTML. That HTML contains no <video> — the gate
   * has never permitted one on a first render — so this changes when the clip
   * is requested, not whether the markup agrees at hydration.
   */
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (reached) {
      setReady(true)
      return
    }
    const notify = () => setReady(true)
    waiting.add(notify)
    scheduleOnce()
    return () => {
      waiting.delete(notify)
    }
  }, [])

  return ready
}
