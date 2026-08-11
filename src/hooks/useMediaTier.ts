import { useSyncExternalStore } from 'react'
import {
  getMediaTier,
  getServerMediaTier,
  subscribeMediaTier,
  type MediaTier,
} from '../lib/mediaTier'

/**
 * Subscribes to the shared tier so a component re-renders when the network
 * answer changes. `useSyncExternalStore` is the right tool rather than an
 * effect-plus-state: the store is outside React, and this keeps every
 * subscriber reading the same value in the same render.
 *
 * The third argument is the server snapshot, and it has to be the fixed
 * no-window tier rather than `getMediaTier`. React reads it both on the server
 * and on the first client render while hydrating, so anything else would let
 * the browser's answer differ from the HTML it is adopting — which is a
 * hydration mismatch, and costs a full client re-render of the tree.
 */
export function useMediaTier(): MediaTier {
  return useSyncExternalStore(subscribeMediaTier, getMediaTier, getServerMediaTier)
}
