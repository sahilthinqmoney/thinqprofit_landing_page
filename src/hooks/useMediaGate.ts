import { useCallback, useEffect, useRef, useState } from 'react'
import { IN_VIEW_MARGIN, useInView } from './useInView'
import { useMediaTier } from './useMediaTier'

/**
 * How long a rung is given to arrive before the ladder stops where it is.
 *
 * The hero gets longer because it is the only media in the first viewport and
 * there is nothing else competing for the connection; everything below the fold
 * is racing the reader's scroll and is not worth a long wait.
 */
export const MEDIA_DEADLINE_MS = {
  hero: 10_000,
  belowFold: 8_000,
} as const

/**
 * How many times one element will try.
 *
 * The ladder used to allow exactly one attempt, which meant a reader whose
 * signal dipped during load kept the still for the rest of the visit even after
 * their connection recovered. It now retries — but only a few times, and only
 * when something has actually changed (the network improved, or the element
 * came back on screen). A cap is what separates "recovers from a blip" from
 * "hammers a broken asset forever".
 */
const MAX_ATTEMPTS = 3

type Status =
  /** Not on screen, or waiting for a reason to try. Nothing requested. */
  | 'waiting'
  /** In view and within the deadline: rungs above the placeholder may load. */
  | 'loading'
  /** The rung we were waiting on arrived. Final, and the deadline is off. */
  | 'settled'
  /** This attempt ran out of time or the reader scrolled away. May retry. */
  | 'paused'
  /** Attempts exhausted. The ladder holds where it is for good. */
  | 'stopped'

export interface MediaGate {
  ref: React.RefObject<HTMLDivElement | null>
  /** True while loading is permitted right now. */
  started: boolean
  /** True when nothing further will be started and no retry remains. */
  stopped: boolean
  /** Whether a video rung is permitted at this moment. Can change mid-visit. */
  videoAllowed: boolean
  /**
   * True when the reader has asked for less motion. A clip already playing is
   * left alone if the *network* dips — those bytes are already spent — but it
   * is stopped for this, because this is a request about motion itself.
   */
  motionRefused: boolean
  /** Call when the rung being waited on is on screen. Cancels the deadline. */
  settle: () => void
}

/**
 * Combines the device tier, the viewport and a deadline into one answer about
 * whether a component may keep climbing its ladder.
 *
 * An attempt ends when the deadline passes or the reader scrolls away. That is
 * a pause, not a verdict: if the connection later recovers, or the element
 * comes back on screen, one of the remaining attempts is spent. After
 * `MAX_ATTEMPTS` the ladder holds where it is and stays there.
 */
export function useMediaGate(
  deadlineMs: number,
  wantsVideo: boolean = true,
  rootMargin: string = IN_VIEW_MARGIN.video,
): MediaGate {
  // Kept watching, not one-shot: the gate needs exits (to abort) as well as
  // re-entries (to justify another attempt).
  const { ref, inView } = useInView<HTMLDivElement>(rootMargin, false)
  const tier = useMediaTier()
  const [status, setStatus] = useState<Status>('waiting')
  const attemptsRef = useRef(0)

  const statusRef = useRef<Status>(status)
  statusRef.current = status

  const settle = useCallback(() => {
    setStatus((current) => (current === 'settled' ? current : 'settled'))
  }, [])

  // Start, or restart, whenever the element is on screen and attempts remain.
  // `inView` and the tier are both in the dependency list, so a recovered
  // connection or a scroll back into view is what wakes this up again.
  useEffect(() => {
    if (!inView) return
    setStatus((current) => {
      if (current === 'settled' || current === 'stopped' || current === 'loading') return current
      if (attemptsRef.current >= MAX_ATTEMPTS) return 'stopped'
      attemptsRef.current += 1
      return 'loading'
    })
  }, [inView, tier.allowVideo])

  // Deadline: armed only while loading. Expiry pauses rather than condemns.
  useEffect(() => {
    if (status !== 'loading') return
    const timer = window.setTimeout(() => {
      if (statusRef.current !== 'loading') return
      setStatus(attemptsRef.current >= MAX_ATTEMPTS ? 'stopped' : 'paused')
    }, deadlineMs)
    return () => window.clearTimeout(timer)
  }, [status, deadlineMs])

  // Scrolling away from a half-arrived asset drops it: the bytes stop being
  // worth spending the moment they are no longer on their way to being seen.
  useEffect(() => {
    if (status !== 'loading' || inView) return
    setStatus(attemptsRef.current >= MAX_ATTEMPTS ? 'stopped' : 'paused')
  }, [status, inView])

  return {
    ref,
    started: status === 'loading' || status === 'settled',
    stopped: status === 'stopped',
    videoAllowed: tier.allowVideo && wantsVideo,
    motionRefused: tier.motionRefused,
    settle,
  }
}
