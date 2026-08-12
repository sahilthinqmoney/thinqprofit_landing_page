// Generates every favicon — .ico, PNGs and the SVG — from one source:
// scripts/assets/thinq-mark.svg.
//
// ── Ground: transparent in the tab, opaque on a home screen ────────────────
//
// The tab icons are the bare mark on transparency. That is a deliberate choice
// with a known cost, so the cost is written down rather than rediscovered:
//
//   - The mark is a silver-to-white gradient. On a dark tab strip it reads
//     beautifully. On a LIGHT tab strip — the default in Chrome, Safari and
//     Firefox — only the #a0a0a5 and #b0b0b5 stops carry, so the ring reads as
//     partial rather than solid.
//   - Safari composites favicon transparency onto WHITE rather than onto the
//     tab, so in Safari specifically the light-strip case above is the only
//     case: it is white ground there even in dark mode.
//
// This was previously an opaque #050505 tile for exactly those reasons. It is
// transparent now because the plate around the mark was the more visible
// problem of the two. If the tab icon ever looks washed out on a light strip,
// this is why, and the fix is a darker mark — not a plate behind it.
//
// The launcher icons stay OPAQUE #050505 (= `--color-bg` in src/index.css and
// the document's `theme-color`). iOS applies its own mask and composites
// transparency onto black, and Android launchers mask too, so a transparent
// icon there produces a black plate we did not choose instead of one we did.
//
// Run: npm run favicons
import sharp from 'sharp'
import { Buffer } from 'node:buffer'
import { readFile, writeFile, rm } from 'node:fs/promises'
import path from 'node:path'

const PUBLIC = path.resolve(import.meta.dirname, '../public')

// The bare mark, at its drawn size on transparency. It lives OUTSIDE public/
// because it must never be served directly: it carries 1.85 units of dead space
// on every side of its viewBox, so a browser handed this file draws a mark two
// thirds the size of the one every other icon shows. public/favicon.svg is
// generated from it, cropped and scaled to match the PNGs.
const SOURCE = path.resolve(import.meta.dirname, 'assets/thinq-mark.svg')

/** `--color-bg`. Must track src/index.css and the `theme-color` meta. */
const BRAND_GROUND = { r: 5, g: 5, b: 5, alpha: 1 }

/** No ground at all — the tab icons composite onto whatever the browser draws. */
const NO_GROUND = { r: 0, g: 0, b: 0, alpha: 0 }

/**
 * Fraction of the tile the mark occupies.
 *
 * Nearly all of it, and that took two corrections. The mark was drawn at 0.78
 * of the tile, but its own artwork carries padding too — the ring and both dots
 * occupy 1.85 to 22.25 inside a 0-24 viewBox — so the two margins compounded
 * and the ink ended up covering 12.5% of the icon inside a bounding box 66%
 * wide. At 16px on Safari's light tab strip that does not read as a logo, it
 * reads as a dark plate with something small floating in it, which is what a
 * reader described as a border around the icon.
 *
 * TIGHT_VIEWBOX crops the artwork's own padding first, so this figure is the
 * only margin that applies rather than the second of two.
 */
const MARK_SCALE = 0.92

/**
 * The mark's true content bounds inside its 0-24 viewBox.
 *
 * Ring: cx/cy 8.8, r 5.8, stroke 2.3 -> 1.85 to 15.75. Dots: 14.35 to 18.05 and
 * 19.75 to 22.25. So the content spans 1.85 to 22.25 on both axes, and the
 * viewBox has 1.85 units of dead space on every side. Rasterising the file as
 * drawn bakes that padding into every icon.
 */
const TIGHT_VIEWBOX = '1.85 1.85 20.4 20.4'

/**
 * PNG outputs. `ico` marks the sizes that also go into favicon.ico.
 *
 * The launcher icons keep the brand ground and stay square: iOS and Android
 * apply their own mask and their own composite, so an opaque square tile is
 * the input those platforms actually ask for. The tab icons have no ground —
 * see the note at the top of this file for what that costs on a light strip.
 */
const TARGETS = [
  { file: 'favicon-16x16.png', size: 16, ico: true, ground: NO_GROUND },
  { file: 'favicon-32x32.png', size: 32, ico: true, ground: NO_GROUND },
  { file: 'favicon-48x48.png', size: 48, ico: true, ground: NO_GROUND },
  { file: 'apple-touch-icon.png', size: 180, ground: BRAND_GROUND },
  { file: 'android-chrome-192x192.png', size: 192, ground: BRAND_GROUND },
  { file: 'android-chrome-512x512.png', size: 512, ground: BRAND_GROUND },
]

/** One tile: the mark, centred at MARK_SCALE, on the given ground. */
async function tile(svg, size, ground) {
  const inner = Math.round(size * MARK_SCALE)
  // Rasterise from the SVG at the final size rather than downscaling one big
  // bitmap: at 16px the ring is barely two pixels thick and a resample turns it
  // to grey mush.
  const cropped = Buffer.from(
    svg.toString().replace(/viewBox="[^"]*"/, `viewBox="${TIGHT_VIEWBOX}"`),
  )
  const mark = await sharp(cropped, { density: 384 })
    .resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer()

  return sharp({
    create: { width: size, height: size, channels: 4, background: ground },
  })
    .composite([{ input: mark, gravity: 'center' }])
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
 * The shipped SVG: the same composition as the raster tab icons, as a vector.
 *
 * Chrome and Firefox prefer `type="image/svg+xml"` when it is offered, so this
 * is what those two actually draw, and it has to match favicon-32x32.png
 * exactly or the icon changes identity between browsers. No ground rect: the
 * mark is scaled to MARK_SCALE inside a transparent 24x24 box, which is what
 * `tile()` now builds for 16/32/48.
 */
function tileSvg(markSvg) {
  const inner = markSvg
    .toString()
    .replace(/^[\s\S]*?<svg[^>]*>/, '')
    .replace(/<\/svg>\s*$/, '')
    .trim()
  // Same two corrections as the rasters: crop to the artwork's own bounds, then
  // scale that to MARK_SCALE of the tile — so the vector and the PNGs agree.
  const [vx, vy, vw] = TIGHT_VIEWBOX.split(' ').map(Number)
  const scale = (MARK_SCALE * 24) / vw
  const pad = (24 - vw * scale) / 2
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="512" height="512">
  <g transform="translate(${(pad - vx * scale).toFixed(3)} ${(pad - vy * scale).toFixed(3)}) scale(${scale.toFixed(4)})">
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
  const data = await tile(svg, target.size, target.ground)
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
console.log('favicons: favicon.svg                  (transparent mark, vector)')
