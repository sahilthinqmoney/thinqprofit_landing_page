/**
 * The plate registry — docs/art-direction.md §3 and §4.1.
 *
 * Assembly only. Each plate's frame sizes, dead-zone rectangles and per-crop
 * composition live in its own file under `sections/`, and the vocabulary those
 * files are written in lives in `spec.mjs`. The split is not tidiness: six
 * plates get art-directed independently and often concurrently, and a single
 * table is a file six people have to take turns editing.
 */

import hero from './sections/hero.mjs'
import stocks from './sections/stocks.mjs'
import derivatives from './sections/derivatives.mjs'
import platform from './sections/platform.mjs'
import onboarding from './sections/onboarding.mjs'
import closing from './sections/closing.mjs'
import device from './sections/device.mjs'
import terminal from './sections/terminal.mjs'
import gate from './sections/gate.mjs'
import scale from './sections/scale.mjs'
import bore from './sections/bore.mjs'

export { CROPS, resolveCrop } from './spec.mjs'

export const plates = [hero, stocks, derivatives, platform, onboarding, closing, device, terminal, gate, scale, bore]

export const platesById = Object.fromEntries(plates.map((plate) => [plate.id, plate]))
