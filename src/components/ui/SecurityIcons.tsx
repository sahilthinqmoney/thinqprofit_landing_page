/**
 * High-precision 3D wireframe SVG icons matching Apple / linear.app architectural aesthetic.
 */

// 1. Isometric 3D Cube Vault Matrix (Securities in Demat)
export function IconDematCube({ className = "w-28 h-28" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Outer Hexagon Boundary */}
        <polygon points="60,12 104,37 104,87 60,112 16,87 16,37" className="text-white/50" />
        {/* Center Vertical & Diagonal Axes */}
        <line x1="60" y1="12" x2="60" y2="112" className="text-white/70" />
        <line x1="16" y1="37" x2="104" y2="87" className="text-white/40" />
        <line x1="104" y1="37" x2="16" y2="87" className="text-white/40" />
        {/* Top Cube Cluster */}
        <polygon points="60,12 82,24.5 60,37 38,24.5" fill="rgba(255,255,255,0.08)" className="text-white/90" />
        <polygon points="60,37 82,24.5 82,49.5 60,62" className="text-white/70" />
        <polygon points="60,37 38,24.5 38,49.5 60,62" className="text-white/70" />
        {/* Left Bottom Cube */}
        <polygon points="38,49.5 60,62 38,74.5 16,62" fill="rgba(255,255,255,0.08)" className="text-white/90" />
        <polygon points="38,74.5 60,62 60,87 38,99.5" className="text-white/70" />
        <polygon points="38,74.5 16,62 16,87 38,99.5" className="text-white/70" />
        {/* Right Bottom Cube */}
        <polygon points="82,49.5 104,62 82,74.5 60,62" fill="rgba(255,255,255,0.08)" className="text-white/90" />
        <polygon points="82,74.5 104,62 104,87 82,99.5" className="text-white/70" />
        <polygon points="82,74.5 60,62 60,87 82,99.5" className="text-white/70" />
      </g>
    </svg>
  )
}

// 2. Orbital Concentric Spheres (Client Funds Segregated)
export function IconSegregatedOrbit({ className = "w-28 h-28" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Outer sphere arc */}
        <path d="M 22,60 A 38,38 0 1,1 98,60" className="text-white/40" strokeDasharray="4 4" />
        <ellipse cx="60" cy="60" rx="44" ry="25" transform="rotate(-25 60 60)" className="text-white/80" />
        <ellipse cx="60" cy="60" rx="44" ry="25" transform="rotate(35 60 60)" className="text-white/60" />
        <ellipse cx="60" cy="60" rx="44" ry="25" transform="rotate(85 60 60)" className="text-white/40" />
        {/* Core Sphere */}
        <circle cx="60" cy="60" r="14" className="text-white" fill="rgba(255,255,255,0.12)" />
        <circle cx="60" cy="60" r="6" className="text-white" fill="currentColor" />
      </g>
    </svg>
  )
}

// 3. 2FA Segmented Aperture Iris (Two-Factor Login & Withdrawal)
export function IconMultiFactorAperture({ className = "w-28 h-28" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Outer Ring */}
        <circle cx="60" cy="60" r="48" className="text-white/35" strokeDasharray="4 4" />
        {/* Top-Right Arc */}
        <path d="M 60,18 A 42,42 0 0,1 102,60 L 85,60 A 25,25 0 0,0 60,35 Z" className="text-white/85" fill="rgba(255,255,255,0.06)" />
        {/* Bottom-Left Arc */}
        <path d="M 60,102 A 42,42 0 0,1 18,60 L 35,60 A 25,25 0 0,0 60,85 Z" className="text-white/85" fill="rgba(255,255,255,0.06)" />
        {/* Concentric Aperture Center */}
        <circle cx="60" cy="60" r="20" className="text-white/60" />
        <circle cx="60" cy="60" r="12" className="text-white" />
        <circle cx="60" cy="60" r="4" fill="currentColor" />
      </g>
    </svg>
  )
}

// 4. Encrypted Node / Interlocking Octahedron (Encrypted in transit & at rest)
export function IconEncryptedNode({ className = "w-28 h-28" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Outer Shield Rhombus */}
        <polygon points="60,12 102,60 60,108 18,60" className="text-white/45" />
        {/* Inner Octahedron Frame */}
        <polygon points="60,26 88,60 60,94 32,60" className="text-white/85" fill="rgba(255,255,255,0.05)" />
        <line x1="60" y1="12" x2="60" y2="108" className="text-white/40" />
        <line x1="18" y1="60" x2="102" y2="60" className="text-white/40" />
        {/* Center Lock Core */}
        <circle cx="60" cy="60" r="8" className="text-white" fill="currentColor" />
      </g>
    </svg>
  )
}

// 5. Multi-Session Signal Radar (Sessions end from anywhere)
export function IconSessionRadar({ className = "w-28 h-28" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="60" cy="60" r="46" className="text-white/25" strokeDasharray="4 4" />
        <circle cx="60" cy="60" r="34" className="text-white/50" />
        <circle cx="60" cy="60" r="20" className="text-white/70" />
        <circle cx="60" cy="60" r="6" className="text-white" fill="currentColor" />
        {/* Radar Nodes */}
        <circle cx="84" cy="36" r="4.5" className="text-white" fill="rgba(255,255,255,0.3)" />
        <line x1="60" y1="60" x2="84" y2="36" className="text-white/80" />
        <circle cx="34" cy="76" r="3.5" className="text-white/75" fill="rgba(255,255,255,0.3)" />
      </g>
    </svg>
  )
}

// 6. Stacked Rounded Layers (Timestamped order trail)
export function IconOrderTrailStack({ className = "w-28 h-28" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Top Capsule */}
        <g className="text-white" fill="rgba(255,255,255,0.08)">
          <path d="M 45,26 L 75,16 C 85,13 94,18 94,26 C 94,34 85,39 75,42 L 45,52 C 35,55 26,50 26,42 C 26,34 35,29 45,26 Z" />
        </g>
        {/* Middle Capsule */}
        <g className="text-white/75" fill="rgba(255,255,255,0.04)">
          <path d="M 45,48 L 75,38 C 85,35 94,40 94,48 C 94,56 85,61 75,64 L 45,74 C 35,77 26,72 26,64 C 26,56 35,51 45,48 Z" />
        </g>
        {/* Bottom Capsule */}
        <g className="text-white/50">
          <path d="M 45,70 L 75,60 C 85,57 94,62 94,70 C 94,78 85,83 75,86 L 45,96 C 35,99 26,94 26,86 C 26,78 35,73 45,70 Z" />
        </g>
      </g>
    </svg>
  )
}

// 7. Wireframe Diamond Shield (Data never sold / Order flow never traded against)
export function IconZeroConflictDiamond({ className = "w-36 h-36" }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Outer Shield Frame */}
        <polygon points="70,12 118,40 118,98 70,128 22,98 22,40" className="text-white/55" />
        {/* Inner Diamond Geometry */}
        <polygon points="70,28 102,48 102,92 70,112 38,92 38,48" className="text-white/85" fill="rgba(255,255,255,0.06)" />
        <line x1="70" y1="12" x2="70" y2="128" className="text-white/40" />
        <line x1="22" y1="40" x2="118" y2="98" className="text-white/30" />
        <line x1="118" y1="40" x2="22" y2="98" className="text-white/30" />
        {/* Center Glowing Core */}
        <circle cx="70" cy="70" r="10" className="text-white" fill="currentColor" />
      </g>
    </svg>
  )
}
