export interface ImageSources {
  mobile?: string
  tablet?: string
  desktop: string
  wide?: string
}

export interface VideoSources {
  mobile?: string
  webm?: string
  mp4: string
}

export type Focus = 'left' | 'right' | 'center'

interface MediaBackdropProps {
  alt: string
  image?: ImageSources | string
  video?: VideoSources | string
  poster?: string
  tone?: string
  focus?: Focus
  className?: string
}

export default function MediaBackdrop({
  alt,
  image,
  video,
  poster,
  tone = 'var(--color-bg)',
  focus = 'center',
  className = '',
}: MediaBackdropProps) {
  const litX = focus === 'left' ? 25 : focus === 'center' ? 50 : 75

  return (
    <div
      aria-hidden="true"
      aria-label={alt}
      className={`absolute inset-0 overflow-hidden select-none pointer-events-none ${className}`}
      style={{ backgroundColor: tone, zIndex: -999 }}
    >
      {/* Video Background Layer */}
      {video && (
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={poster}
          className="absolute inset-0 h-full w-full object-cover opacity-60 transition-opacity duration-1000"
        >
          {typeof video === 'string' ? (
            <source src={video} type="video/mp4" />
          ) : (
            <>
              {video.webm && <source src={video.webm} type="video/webm" />}
              {video.mp4 && <source src={video.mp4} type="video/mp4" />}
            </>
          )}
        </video>
      )}

      {/* Image Background Layer */}
      {image && !video && (
        <img
          src={typeof image === 'string' ? image : image.desktop}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover opacity-60 transition-opacity duration-1000"
        />
      )}

      {/* Primary Theme Ambient Mesh Fallback */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(72% 78% at ${litX}% 40%, color-mix(in srgb, var(--color-accent) 22%, var(--color-surface)) 0%, color-mix(in srgb, var(--color-surface) 50%, var(--color-bg)) 55%, var(--color-bg) 100%)`,
          opacity: video || image ? 0.15 : 1,
        }}
      />

      {/* Secondary Chromatic Glow Orb */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: `radial-gradient(55% 55% at ${litX}% 42%, color-mix(in srgb, var(--color-chrome) 14%, transparent) 0%, color-mix(in srgb, var(--color-accent-soft) 8%, transparent) 55%, transparent 85%)`,
        }}
      />

      {/* Edge Falloff Vignette for Seamless Text Readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, rgba(5,5,5,0.1) 0%, rgba(5,5,5,0.45) 70%, rgba(5,5,5,0.75) 100%)`,
        }}
      />
    </div>
  )
}
