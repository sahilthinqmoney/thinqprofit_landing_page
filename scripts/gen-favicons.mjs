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
 * Why these tiles are square, and must stay square.
 *
 * They were rounded, which reads better on a tab strip — a hard square is the
 * one shape no platform draws by itself. But a rounded tile means transparent
 * corners, and **Safari composites a favicon's transparency onto WHITE** rather
 * than onto the tab. At 16px, four white corners around a dark tile read as a
 * white border, which is exactly what a reader reported seeing. Chrome
 * composites onto the tab background instead, so the same file looks correct
 * there and wrong in Safari.
 *
 * There is no version of this that keeps both: any pixel we leave transparent
 * is a pixel Safari paints white. Fully opaque is the only shape that is right
 * in every browser, so the corners go and the tile is square everywhere —
 * which is also what apple-touch-icon and the android pair already needed,
 * since those platforms apply their own mask.
 */
/**
 * PNG outputs. `ico` marks the sizes that also go into favicon.ico.
 *
 * All square and fully opaque — see the note above on Safari. iOS and Android
 * launchers apply their own mask to apple-touch-icon and the android pair, so
 * a square tile is the input those platforms ask for anyway.
 */
const TARGETS = [
  { file: 'favicon-16x16.png', size: 16, ico: true },
  { file: 'favicon-32x32.png', size: 32, ico: true },
  { file: 'favicon-48x48.png', size: 48, ico: true },
  { file: 'apple-touch-icon.png', size: 180 },
  { file: 'android-chrome-192x192.png', size: 192 },
  { file: 'android-chrome-512x512.png', size: 512 },
]

/** One tile: the mark, centred at MARK_SCALE, on an opaque ground. */
async function tile(svg, size) {
  const inner = Math.round(size * MARK_SCALE)
  // Rasterise from the SVG at the final size rather than downscaling one big
  // bitmap: at 16px the ring is barely two pixels thick and a resample turns it
  // to grey mush.
  const mark = await sharp(svg, { density: 384 })
    .resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer()

  return sharp({
    create: { width: size, height: size, channels: 4, background: GROUND },
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
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="512" height="512">
  <rect width="24" height="24" fill="#050505" />
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
  const data = await tile(svg, target.size)
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
