/**
 * Codemap — turns the source tree into an Obsidian graph.
 *
 * Obsidian's graph view only ever draws Markdown notes joined by wikilinks; a
 * `.tsx` file cannot be a node in it, whatever plugins are installed. So this
 * writes one note per source file into `docs/codemap/`, and turns each of that
 * file's relative imports into a `[[wikilink]]`. The result is a graph whose
 * edges are the real import edges of the app — App at the centre, the section
 * components around it, `ui/` and `data/` as the two clusters everything
 * reaches into.
 *
 * The notes are derived, not authored: every one carries `generated: true` and
 * is rewritten wholesale on each run. Edit the source, re-run, don't hand-edit
 * the notes.
 *
 *   node tools/codemap/build.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync, statSync } from 'node:fs'
import { join, relative, dirname, resolve, extname, basename } from 'node:path'

const ROOT = resolve(import.meta.dirname, '../..')
const OUT = join(ROOT, 'docs/codemap')

/**
 * Directories worth mapping. Everything else is build output or vendored.
 * Listed optimistically — `tools/plates` only exists on the branches that carry
 * the plate renderer, and a missing root is skipped rather than fatal.
 */
const ROOTS = ['src', 'tools/plates']
const CODE = new Set(['.ts', '.tsx', '.mjs', '.js', '.jsx', '.css', '.glsl'])

/** Extensions an import may omit, in the order a bundler would try them. */
const RESOLVE_ORDER = ['', '.tsx', '.ts', '.mjs', '.js', '.jsx', '.css', '/index.tsx', '/index.ts']

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) walk(full, acc)
    else if (CODE.has(extname(entry))) acc.push(full)
  }
  return acc
}

/** A note's name has to be unique across the flat folder, so it carries its path. */
const noteName = (file) => relative(ROOT, file).replace(/[/\\]/g, '·')

/** `../ui/Button` from a file in `sections/` → the absolute path it means. */
function resolveImport(fromFile, spec) {
  if (!spec.startsWith('.')) return null
  const base = resolve(dirname(fromFile), spec)
  for (const suffix of RESOLVE_ORDER) {
    const candidate = base + suffix
    try {
      if (statSync(candidate).isFile()) return candidate
    } catch {
      /* next candidate */
    }
  }
  return null
}

const IMPORT_RE = /(?:^|\n)\s*(?:import[\s\S]*?from|export[\s\S]*?from|import)\s*['"]([^'"]+)['"]/g

const files = ROOTS.flatMap((r) => {
  const dir = join(ROOT, r)
  try {
    return statSync(dir).isDirectory() ? walk(dir) : []
  } catch {
    return []
  }
})
const known = new Set(files)

rmSync(OUT, { recursive: true, force: true })
mkdirSync(OUT, { recursive: true })

const edges = new Map() // file → [imported files]
const externals = new Map() // package name → count

for (const file of files) {
  const src = readFileSync(file, 'utf8')
  const local = []
  const packages = []
  for (const [, spec] of src.matchAll(IMPORT_RE)) {
    if (spec.startsWith('.')) {
      const target = resolveImport(file, spec)
      if (target && known.has(target)) local.push(target)
    } else {
      const pkg = spec.startsWith('@') ? spec.split('/').slice(0, 2).join('/') : spec.split('/')[0]
      packages.push(pkg)
      externals.set(pkg, (externals.get(pkg) ?? 0) + 1)
    }
  }
  edges.set(file, { local: [...new Set(local)], packages: [...new Set(packages)] })
}

/** Reverse the edges once so each note can list who imports it. */
const importers = new Map()
for (const [file, { local }] of edges) {
  for (const target of local) {
    if (!importers.has(target)) importers.set(target, [])
    importers.get(target).push(file)
  }
}

const layerOf = (rel) => {
  if (rel.startsWith('src/components/sections/')) return 'section'
  if (rel.startsWith('src/components/ui/')) return 'ui'
  if (rel.startsWith('src/components/lightswind/')) return 'vendor-ui'
  if (rel.startsWith('src/data/')) return 'data'
  if (rel.startsWith('src/lib/')) return 'lib'
  if (rel.startsWith('tools/')) return 'tool'
  return 'app'
}

for (const file of files) {
  const rel = relative(ROOT, file)
  const { local, packages } = edges.get(file)
  const src = readFileSync(file, 'utf8')
  const lines = src.split('\n').length
  const inbound = importers.get(file) ?? []

  const body = [
    '---',
    `source: "${rel}"`,
    `layer: ${layerOf(rel)}`,
    `lines: ${lines}`,
    'generated: true',
    '---',
    '',
    `# ${basename(rel)}`,
    '',
    `\`${rel}\` · ${lines} lines · [open](${'../../' + rel})`,
    '',
    '## Imports',
    '',
    local.length ? local.map((t) => `- [[${noteName(t)}|${relative(ROOT, t)}]]`).join('\n') : '_None in this repo._',
    '',
    packages.length ? `**Packages:** ${packages.map((p) => `\`${p}\``).join(', ')}\n` : null,
    '## Imported by',
    '',
    inbound.length ? inbound.map((t) => `- [[${noteName(t)}|${relative(ROOT, t)}]]`).join('\n') : '_Nothing — an entry point or a leaf._',
    '',
  ]
    .filter((l) => l !== null)
    .join('\n')

  writeFileSync(join(OUT, `${noteName(file)}.md`), body)
}

/** An index note, so the map has a door rather than 34 loose nodes. */
const byLayer = new Map()
for (const file of files) {
  const layer = layerOf(relative(ROOT, file))
  if (!byLayer.has(layer)) byLayer.set(layer, [])
  byLayer.get(layer).push(file)
}

const index = [
  '---',
  'generated: true',
  '---',
  '',
  '# Codemap',
  '',
  `${files.length} source files, generated by \`node tools/codemap/build.mjs\`. Each note links to what it`,
  'imports, so the graph view draws the real import graph. Regenerate after moving files.',
  '',
  ...[...byLayer.entries()]
    .sort()
    .flatMap(([layer, list]) => [
      `## ${layer}`,
      '',
      ...list.map((f) => `- [[${noteName(f)}|${relative(ROOT, f)}]]`),
      '',
    ]),
  '## Most-used packages',
  '',
  ...[...externals.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([pkg, n]) => `- \`${pkg}\` — ${n} files`),
  '',
].join('\n')

writeFileSync(join(OUT, 'Codemap.md'), index)

console.log(`codemap: ${files.length} notes + index → docs/codemap/`)
