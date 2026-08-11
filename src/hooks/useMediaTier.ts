import { useSyncExternalStore } from 'react'
import { getMediaTier, subscribeMediaTier, type MediaTier } from '../lib/mediaTier'

/**
 * Subscribes to the shared tier so a component re-renders when the network
 * answer changes. `useSyncExternalStore` is the right tool rather than an
 * effect-plus-state: the store is outside React, and this keeps every
 * subscriber reading the same value in the same render.
 */
export function useMediaTier(): MediaTier {
  return useSyncExternalStore(subscribeMediaTier, getMediaTier, getMediaTier)
}
