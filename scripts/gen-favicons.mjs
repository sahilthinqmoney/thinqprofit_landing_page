// Generates every favicon — .ico, PNGs and the SVG — from one source:
// scripts/assets/thinq-mark.svg.
//
// ── Why the icons are an opaque tile and not a transparent mark ────────────
//
// The mark is pure white — measured, the ink was 255/255 luminance over an 80%
// transparent field. On a dark tab strip that reads beautifully. On a LIGHT tab
// strip, which is the default in Chrome, Safari and Firefox, it is white on
// white: the tab shows nothing at all, and a reader who sees nothing concludes
// the favicon never updated. That was the bug.
//
// So the brand ground is baked in. #050505 is `--color-bg` from src/index.css
// and the same value as the document's `theme-color`, so the tab, the address
// bar and the page agree. A dark tile with a white mark is legible on every tab
// strip in either theme, which a transparent mark cannot be.
//
// Apple additionally requires an opaque apple-touch-icon — iOS applies its own
// mask and composites transparency onto black, so a transparent one is a
// guess about the result rather than a decision.
//
// Run: npm run favicons
import sharp from 'sharp'
import { Buffer } from 'node:buffer'
import { readFile, writeFile, rm } from 'node:fs/promises'
import path from 'node:path'

const PUBLIC = path.resolve(import.meta.dirname, '../public')

// The bare mark, white on transparency. It lives OUTSIDE public/ because it must
// never be served: white on transparency is invisible on a light tab strip, and
// while it sat at public/favicon.svg any browser that preferred an SVG favicon —
// Chrome and Firefox both do — was handed the invisible one no matter how good
// the PNGs were. public/favicon.svg is now generated, opaque, and safe to link.
const SOURCE = path.resolve(import.meta.dirname, 'assets/thinq-mark.svg')

/** `--color-bg`. Must track src/index.css and the `theme-color` meta. */
const GROUND = { r: 5, g: 5, b: 5, alpha: 1 }

/**
 * Fraction of the tile the mark occupies.
 *
 * The mark nearly fills its own 24-unit viewBox, so rendered edge to edge it
 * touches the tile's sides and reads as a crop rather than a logo. 0.78 leaves
 * an even margin at every size.
 */
const MARK_SCALE = 0.78

/**
 * Corner radius, as a fraction of the tile.
 *
 * A hard square tile is the one shape no platform draws by itself, so it reads
 * as a sharp-cornered sticker sitting on top of the tab strip rather than an
 * icon. 0.1875 lands on whole pixels at every size that needs it — 3px at 16,
 * 6px at 32, 9px at 48 — so the curve is rasterised rather than resampled and
 * stays clean at the size that matters most.
 */
const CORNER_RADIUS = 0.1875

/**
 * PNG outputs. `ico` marks the sizes that also go into favicon.ico.
 *
 * `round` is deliberately only on the icons WE are responsible for drawing.
 * iOS masks apple-touch-icon with its own superellipse and Android launchers
 * mask the android-chrome pair, both against whatever is underneath: rounding
 * those here would cut our corners off inside theirs, leaving four dark notches
 * where the two curves disagree. Square is not an oversight in those three, it
 * is the input the platform asks for.
 */
const TARGETS = [
  { file: 'favicon-16x16.png', size: 16, ico: true, round: true },
  { file: 'favicon-32x32.png', size: 32, ico: true, round: true },
  { file: 'favicon-48x48.png', size: 48, ico: true, round: true },
  { file: 'apple-touch-icon.png', size: 180 },
  { file: 'android-chrome-192x192.png', size: 192 },
  { file: 'android-chrome-512x512.png', size: 512 },
]

/** A white rounded-rect the size of the tile, used as an alpha stencil. */
function cornerMask(size) {
  const r = size * CORNER_RADIUS
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">` +
      `<rect width="${size}" height="${size}" rx="${r}" ry="${r}" fill="#fff"/>` +
      `</svg>`,
  )
}

/** One tile: the mark, centred at MARK_SCALE, on an opaque ground. */
async function tile(svg, size, { round = false } = {}) {
  const inner = Math.round(size * MARK_SCALE)
  // Rasterise from the SVG at the final size rather than downscaling one big
  // bitmap: at 16px the ring is barely two pixels thick and a resample turns it
  // to grey mush.
  const mark = await sharp(svg, { density: 384 })
    .resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer()

  // `dest-in` keeps the ground only where the stencil is opaque, so it has to
  // run after the mark is already down — it clips the finished tile, not the
  // background it was composited onto.
  const layers = [{ input: mark, gravity: 'center' }]
  if (round) layers.push({ input: cornerMask(size), blend: 'dest-in' })

  return sharp({
    create: { width: size, height: size, channels: 4, background: GROUND },
  })
    .composite(layers)
    .png({ compressionLevel: 9 })
    .toBuffer()
}

/**
 * Packs PNGs into an .ico.
 *
 * Written by hand because sharp cannot emit ICO and this needs no dependency:
 * the format is a 6-byte header, a 16-byte directory entry per image, then the
 * payloads. PNG payloads are valid in ICO and every browser that still asks for
 * favicon.ico understands them.
 */
function ico(images) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0) // reserved
  header.writeUInt16LE(1, 2) // type: icon
  header.writeUInt16LE(images.length, 4)

  let offset = 6 + images.length * 16
  const entries = images.map(({ size, data }) => {
    const entry = Buffer.alloc(16)
    entry.writeUInt8(size >= 256 ? 0 : size, 0) // width, 0 means 256
    entry.writeUInt8(size >= 256 ? 0 : size, 1) // height
    entry.writeUInt8(0, 2) // palette size
    entry.writeUInt8(0, 3) // reserved
    entry.writeUInt16LE(1, 4) // colour planes
    entry.writeUInt16LE(32, 6) // bits per pixel
    entry.writeUInt32LE(data.length, 8)
    entry.writeUInt32LE(offset, 12)
    offset += data.length
    return entry
  })

  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)])
}

const svg = await readFile(SOURCE)

/**
 * The shipped SVG: the same tile as the rasters, as a vector.
 *
 * Chrome and Firefox prefer `type="image/svg+xml"` when it is offered, so this
 * is what those two actually draw — it has to carry the ground itself. The mark
 * is nested at MARK_SCALE inside a full-bleed ground rect, which is the exact
 * composition `tile()` builds for the PNGs, so every browser gets one design.
 */
function tileSvg(markSvg) {
  const inner = markSvg
    .toString()
    .replace(/^[\s\S]*?<svg[^>]*>/, '')
    .replace(/<\/svg>\s*$/, '')
    .trim()
  const pad = ((1 - MARK_SCALE) / 2) * 24
  const scale = MARK_SCALE
  // Rounded to match the PNGs. This is the copy Chrome and Firefox actually
  // draw, so if it stayed square those two would show the sharp tile and only
  // Safari and the .ico fallback would get the corners.
  const radius = (24 * CORNER_RADIUS).toFixed(2)
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="512" height="512">
  <rect width="24" height="24" rx="${radius}" ry="${radius}" fill="#050505" />
  <g transform="translate(${pad.toFixed(3)} ${pad.toFixed(3)}) scale(${scale})">
${inner
  .split('\n')
  .map((line) => (line.trim() ? '    ' + line.trim() : line))
  .join('\n')}
  </g>
</svg>
`
}

const forIco = []

for (const target of TARGETS) {
  const data = await tile(svg, target.size, target)
  await writeFile(path.join(PUBLIC, target.file), data)
  if (target.ico) forIco.push({ size: target.size, data })
  console.log(`favicons: ${target.file.padEnd(28)} ${String(data.length).padStart(6)} bytes`)
}

await writeFile(path.join(PUBLIC, 'favicon.ico'), ico(forIco))
console.log(`favicons: favicon.ico                  ${ico(forIco).length} bytes (16/32/48)`)

// The generator dumped its whole output directory into public/ as well. Every
// file in it is a byte-identical duplicate of one at the root, and public/ ships
// verbatim, so it was a second copy of the icon set on the CDN.
await rm(path.join(PUBLIC, 'favicon_io-2'), { recursive: true, force: true })

await writeFile(path.join(PUBLIC, 'favicon.svg'), tileSvg(svg))
console.log('favicons: favicon.svg                  (opaque tile, vector)')
