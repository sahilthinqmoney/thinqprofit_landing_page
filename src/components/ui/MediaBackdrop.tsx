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
  blur?: boolean
  className?: string
}

export default function MediaBackdrop({
  alt,
  image,
  video,
  poster,
  blur = false,
  className = '',
}: MediaBackdropProps) {
  return (
    <div
      aria-hidden="true"
      aria-label={alt}
      className={`absolute inset-0 overflow-hidden select-none pointer-events-none ${className}`}
      style={{ backgroundColor: '#070709', zIndex: -999 }}
    >
      {/* Video Background Layer */}
      {video && (
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={poster}
          className="absolute inset-0 h-full w-full object-cover scale-[1.08] origin-top opacity-100 transition-opacity duration-1000"
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
          className="absolute inset-0 h-full w-full object-cover scale-[1.08] origin-top opacity-100 transition-opacity duration-1000"
        />
      )}


      {/* Optional Backdrop blur layer - rendered when blur is explicitly set */}
      {blur && (
        <div className="absolute inset-0 backdrop-blur-md backdrop-saturate-150 bg-black/35 pointer-events-none" />
      )}


      {/* Smooth Left & Right Edge Dark Falloff Gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(to right, #070709 0%, rgba(7,7,9,0.4) 15%, transparent 35%, transparent 65%, rgba(7,7,9,0.4) 85%, #070709 100%)`,
        }}
      />

      {/* Subtle Ambient Radial Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(5,5,5,0.15) 100%)`,
        }}
      />
    </div>

  )
}






