/**
 * Whether this device gets moving pictures — re-answered as conditions change.
 *
 * This used to be decided once per page load and held for good. It now watches
 * the connection and upgrades when the network genuinely recovers, so a reader
 * who loads the page on a weak signal and then walks back into WiFi gets the
 * clip instead of being held on the still until they reload.
 *
 * Two guards keep that from becoming the churn the original rule was avoiding:
 *
 *  - **Upgrades must hold.** A better connection has to survive
 *    `UPGRADE_SETTLE_MS` before it counts, so a two-second lift between two
 *    tunnels does not start a download that is about to be cut off.
 *  - **Upgrades are rationed.** `useMediaGate` caps how many times any one
 *    element will act on this, so a flapping signal cannot loop a clip through
 *    load-and-abort forever.
 *
 * Downgrades are not debounced: losing the network, or the reader turning on
 * Save-Data or Reduce Motion, takes effect at once.
 */

interface NetworkInformationLike {
  saveData?: boolean
  effectiveType?: string
  addEventListener?: (type: string, listener: () => void) => void
  removeEventListener?: (type: string, listener: () => void) => void
}

/** Connections on which a multi-megabyte clip is not worth the reader's data. */
const REFUSED_EFFECTIVE_TYPES: ReadonlySet<string> = new Set(['slow-2g', '2g', '3g'])

/** Below this, decoding video competes with rendering the page. In gigabytes. */
const MIN_DEVICE_MEMORY_GB = 2

/** How long a better connection must last before it is believed. */
const UPGRADE_SETTLE_MS = 2_000

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

export interface MediaTier {
  /** False means every ladder stops at its still, until this says otherwise. */
  allowVideo: boolean
  /** Which rule decided it. */
  reason: string
  /**
   * True only when motion itself was refused, rather than bandwidth. A clip
   * already downloaded and playing is left alone when the network dips — the
   * bytes are spent, and stopping it would help nobody — but it IS stopped when
   * the reader asks for less motion, because that is a request about motion.
   */
  motionRefused: boolean
}

function connection(): NetworkInformationLike | undefined {
  if (typeof navigator === 'undefined') return undefined
  return (navigator as Navigator & { connection?: NetworkInformationLike }).connection
}

function computeTier(): MediaTier {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return { allowVideo: false, reason: 'no-window', motionRefused: false }
  }

  if (window.matchMedia?.(REDUCED_MOTION_QUERY).matches) {
    return { allowVideo: false, reason: 'reduced-motion', motionRefused: true }
  }

  const link = connection()

  if (link?.saveData) {
    return { allowVideo: false, reason: 'save-data', motionRefused: false }
  }

  const effectiveType = link?.effectiveType
  if (effectiveType && REFUSED_EFFECTIVE_TYPES.has(effectiveType)) {
    return { allowVideo: false, reason: `effective-type:${effectiveType}`, motionRefused: false }
  }

  const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory
  if (typeof deviceMemory === 'number' && deviceMemory <= MIN_DEVICE_MEMORY_GB) {
    return { allowVideo: false, reason: `device-memory:${deviceMemory}`, motionRefused: false }
  }

  return {
    allowVideo: true,
    reason: link ? 'capable' : 'capable-no-connection-api',
    motionRefused: false,
  }
}

let current: MediaTier = computeTier()
const listeners = new Set<() => void>()
let pendingUpgrade: number | undefined

function same(a: MediaTier, b: MediaTier): boolean {
  return a.allowVideo === b.allowVideo && a.reason === b.reason
}

function commit(next: MediaTier): void {
  if (same(current, next)) return
  current = next
  for (const listener of listeners) listener()
}

function reevaluate(): void {
  const next = computeTier()
  if (same(current, next)) return

  if (!next.allowVideo) {
    // Losing ground is applied immediately: there is no upside to waiting.
    if (pendingUpgrade !== undefined) {
      window.clearTimeout(pendingUpgrade)
      pendingUpgrade = undefined
    }
    commit(next)
    return
  }

  // Gaining ground has to prove it is not a blip.
  if (pendingUpgrade !== undefined) window.clearTimeout(pendingUpgrade)
  pendingUpgrade = window.setTimeout(() => {
    pendingUpgrade = undefined
    const confirmed = computeTier()
    if (confirmed.allowVideo) commit(confirmed)
  }, UPGRADE_SETTLE_MS)
}

if (typeof window !== 'undefined') {
  connection()?.addEventListener?.('change', reevaluate)
  // Reduce Motion can be switched on mid-visit; honour it when it is.
  window.matchMedia?.(REDUCED_MOTION_QUERY).addEventListener?.('change', reevaluate)
  // Coming back from offline does not always fire a `connection` change.
  window.addEventListener('online', reevaluate)
}

export function getMediaTier(): MediaTier {
  return current
}

export function subscribeMediaTier(onChange: () => void): () => void {
  listeners.add(onChange)
  return () => {
    listeners.delete(onChange)
  }
}
