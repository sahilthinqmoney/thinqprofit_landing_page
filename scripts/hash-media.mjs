// Content-hashes everything under dist/clips and dist/images, then rewrites the
// references to match. Runs after `vite build`, which hashes only what it
// bundles — files in public/ are copied through verbatim and keep their names.
//
// The point is the cache header: /clips/* and /images/* are served
// `immutable` for a year, which is only safe if a changed file cannot reuse a
// cached URL. With the bytes in the name, it cannot.
import { createHash } from 'node:crypto'
import { readdir, readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const ROOT = path.resolve(import.meta.dirname, '..')
const DIST = path.join(ROOT, 'dist')

/** Directories whose files get hashed, relative to dist/. */
const MEDIA_DIRS = ['clips', 'images/capabilities', 'images/hands']

/** Files whose text is scanned for references to rewrite. */
const REWRITE_EXTENSIONS = new Set(['.html', '.js', '.css', '.json'])

const HASH_LENGTH = 8

async function walk(dir) {
  const out = []
  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch {
    return out
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...(await walk(full)))
    else out.push(full)
  }
  return out
}

const renames = new Map()

for (const dir of MEDIA_DIRS) {
  const absolute = path.join(DIST, dir)
  let entries
  try {
    entries = await readdir(absolute, { withFileTypes: true })
  } catch {
    continue
  }
  for (const entry of entries) {
    if (!entry.isFile()) continue

    const extension = path.extname(entry.name)
    const base = path.basename(entry.name, extension)

    // Already hashed by a previous run in the same dist — leave it alone.
    if (new RegExp(`\\.[a-f0-9]{${HASH_LENGTH}}$`).test(base)) continue

    const file = path.join(absolute, entry.name)
    const bytes = await readFile(file)
    const hash = createHash('sha256').update(bytes).digest('hex').slice(0, HASH_LENGTH)
    const hashedName = `${base}.${hash}${extension}`

    await rename(file, path.join(absolute, hashedName))
    renames.set(`/${dir}/${entry.name}`, `/${dir}/${hashedName}`)
  }
}

if (renames.size === 0) {
  console.log('hash-media: nothing to hash')
  process.exit(0)
}

// Longest first, so /images/capabilities/x.webp is never partially matched by a
// shorter key that happens to be a prefix.
const ordered = [...renames.entries()].sort((a, b) => b[0].length - a[0].length)

let rewrittenFiles = 0
for (const file of await walk(DIST)) {
  if (!REWRITE_EXTENSIONS.has(path.extname(file))) continue
  const original = await readFile(file, 'utf8')
  let updated = original
  for (const [from, to] of ordered) updated = updated.split(from).join(to)
  if (updated !== original) {
    await writeFile(file, updated, 'utf8')
    rewrittenFiles += 1
  }
}

console.log(`hash-media: hashed ${renames.size} files, rewrote references in ${rewrittenFiles}`)
for (const [from, to] of ordered) console.log(`  ${from}  ->  ${path.basename(to)}`)
