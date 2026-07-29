import { Film, ImageIcon, Play, Smartphone } from 'lucide-react'

type MediaKind = 'image' | 'video' | 'gif' | 'screen'

interface MediaPlaceholderProps {
  kind: MediaKind
  /** What the real asset will be. Doubles as the accessible label. */
  label: string
  /** Tailwind aspect ratio class, e.g. "aspect-video". */
  aspect?: string
  /** Copy-deck alt text for the eventual asset — carried through so it isn't lost. */
  alt?: string
  className?: string
}

const kindMeta: Record<MediaKind, { Icon: typeof ImageIcon; tag: string }> = {
  image: { Icon: ImageIcon, tag: 'IMAGE' },
  video: { Icon: Play, tag: 'VIDEO' },
  gif: { Icon: Film, tag: 'GIF' },
  screen: { Icon: Smartphone, tag: 'APP SCREEN' },
}

/**
 * Stands in for imagery until real assets land. Reserves layout space so nothing
 * shifts when the asset is dropped in (CLS budget — quick-reference §3).
 * Self-contained: no network request, no external host.
 */
export default function MediaPlaceholder({
  kind,
  label,
  aspect = 'aspect-video',
  alt,
  className = '',
}: MediaPlaceholderProps) {
  const { Icon, tag } = kindMeta[kind]

  return (
    <div
      role="img"
      aria-label={alt ?? label}
      className={`relative grid ${aspect} w-full place-items-center overflow-hidden rounded-2xl border border-dashed border-border bg-surface/60 ${className}`}
    >
      {/* Diagonal hatch so the box reads as "not final" at a glance. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 text-fg opacity-[0.07]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 1px, transparent 12px)',
        }}
      />

      <div className="relative flex flex-col items-center gap-2 px-6 text-center">
        <Icon className="h-6 w-6 text-fg-muted" strokeWidth={1.5} aria-hidden="true" />
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-fg-muted">
          {tag} placeholder
        </span>
        <span className="max-w-xs text-xs leading-relaxed text-fg-muted">{label}</span>
      </div>
    </div>
  )
}
