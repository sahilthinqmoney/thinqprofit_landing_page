import React, { useEffect, useRef } from 'react'

export interface StrandsProps {
  colors?: string[]
  count?: number
  speed?: number
  amplitude?: number
  waviness?: number
  thickness?: number
  glow?: number
  taper?: number
  spread?: number
  intensity?: number
  saturation?: number
  opacity?: number
  scale?: number
  glass?: boolean
  refraction?: number
  dispersion?: number
  glassSize?: number
  hueShift?: number
  className?: string
  style?: React.CSSProperties
}

function hexToRGB(hex: string): { r: number; g: number; b: number } {
  let c = hex.replace('#', '')
  if (c.length === 3) c = c.split('').map((x) => x + x).join('')
  const num = parseInt(c, 16) || 0
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  }
}

function adjustColor(
  rgb: { r: number; g: number; b: number },
  saturationMult = 1,
  hueShiftDeg = 0
): { r: number; g: number; b: number } {
  let { r, g, b } = rgb
  let rNorm = r / 255,
    gNorm = g / 255,
    bNorm = b / 255
  let max = Math.max(rNorm, gNorm, bNorm),
    min = Math.min(rNorm, gNorm, bNorm)
  let h = 0,
    s = 0,
    l = (max + min) / 2

  if (max !== min) {
    let d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0)
        break
      case gNorm:
        h = (bNorm - rNorm) / d + 2
        break
      case bNorm:
        h = (rNorm - gNorm) / d + 4
        break
    }
    h /= 6
  }

  h = (h + hueShiftDeg / 360) % 1
  if (h < 0) h += 1
  s = Math.min(1, Math.max(0, s * saturationMult))

  if (s === 0) {
    r = g = b = Math.round(l * 255)
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    const hue2rgb = (t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }
    r = Math.round(hue2rgb(h + 1 / 3) * 255)
    g = Math.round(hue2rgb(h) * 255)
    b = Math.round(hue2rgb(h - 1 / 3) * 255)
  }
  return { r, g, b }
}

export default function Strands({
  colors = ['#717171', '#082d36', '#2c7f93'],
  count = 8,
  speed = 0.1,
  amplitude = 1,
  waviness = 1.9,
  thickness = 0.7,
  glow = 1.7,
  taper = 3.7,
  spread = 1,
  intensity = 0.35,
  saturation = 1.2,
  opacity = 1,
  scale = 2.6,
  glass = false,
  refraction = 1,
  dispersion = 4,
  glassSize = 0.68,
  hueShift = 0,
  className = '',
  style = {},
}: StrandsProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let animationFrameId: number
    let startTime = performance.now()

    const basePalette = colors.map((hex) => {
      const rgb = hexToRGB(hex)
      return adjustColor(rgb, saturation, hueShift)
    })

    const handleResize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect()
      const width = rect?.width || window.innerWidth || 1200
      const height = rect?.height || canvas.clientHeight || 400
      const dpr = Math.min(window.devicePixelRatio || 1, 2)

      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    const render = (now: number) => {
      const elapsed = (now - startTime) * 0.001
      const time = elapsed * speed * 6

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = canvas.width
      const h = canvas.height

      ctx.clearRect(0, 0, w, h)

      if (opacity <= 0 || intensity <= 0) {
        animationFrameId = requestAnimationFrame(render)
        return
      }

      ctx.save()

      const centerY = h / 2
      const numPoints = 180
      const startX = -w * 0.05
      const endX = w * 1.05
      const totalSpan = endX - startX
      const dx = totalSpan / (numPoints - 1)

      // Shortened wave height and spread height for a sleek horizontal profile
      const waveHeight = amplitude * 32 * scale * dpr
      const spreadHeight = spread * 16 * scale * dpr
      const spatialFreq = (waviness * Math.PI * 2) / w

      // 1. Enhanced Ambient Radial Background Glow
      const bgGlowRadX = w * 0.55
      const bgGlowRadY = h * 0.45
      const primaryColor = basePalette[basePalette.length - 1] || { r: 44, g: 127, b: 147 }

      ctx.save()
      ctx.translate(w / 2, centerY)
      ctx.scale(1, bgGlowRadY / bgGlowRadX)
      const bgGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, bgGlowRadX)
      bgGrad.addColorStop(
        0,
        `rgba(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}, ${0.35 * intensity * opacity})`
      )
      bgGrad.addColorStop(
        0.45,
        `rgba(${primaryColor.r * 0.4}, ${primaryColor.g * 0.8}, ${primaryColor.b}, ${0.15 * intensity * opacity})`
      )
      bgGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')

      ctx.fillStyle = bgGrad
      ctx.beginPath()
      ctx.arc(0, 0, bgGlowRadX, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      // 2. Render Strands with Additive Blending & Increased Glow
      ctx.globalCompositeOperation = 'lighter'

      // Effective glow boost multiplier
      const glowFactor = Math.max(1, glow * 1.8)

      for (let i = 0; i < count; i++) {
        const color = basePalette[i % basePalette.length]
        const strandNormIndex = (i - (count - 1) / 2) / (count / 2 || 1)
        const strandOffset = strandNormIndex * spreadHeight
        const phaseShift = i * 0.6 + (i * Math.PI) / count

        // Calculate strand curve points spanning full width
        const points: { x: number; y: number }[] = []
        for (let pt = 0; pt < numPoints; pt++) {
          const x = startX + pt * dx
          const normX = pt / (numPoints - 1)

          // Pinched envelope at left/right edges
          const envelope = Math.pow(Math.sin(normX * Math.PI), Math.max(0.1, taper))

          // Fluid wave harmonics
          const w1 = Math.sin(x * spatialFreq + time + phaseShift)
          const w2 = Math.cos(x * spatialFreq * 0.65 - time * 0.8 + phaseShift * 1.5) * 0.38
          const w3 = Math.sin(x * spatialFreq * 1.4 + time * 0.5 - phaseShift) * 0.22

          const displacement = (strandOffset + (w1 + w2 + w3) * waveHeight) * envelope
          const y = centerY + displacement

          points.push({ x, y })
        }

        // Pass 1: Extra Wide Ethereal Bloom Halo (Increased Glow)
        ctx.save()
        ctx.beginPath()
        points.forEach((p, idx) => {
          if (idx === 0) ctx.moveTo(p.x, p.y)
          else ctx.lineTo(p.x, p.y)
        })

        ctx.shadowBlur = glowFactor * 35 * dpr
        ctx.shadowColor = `rgba(${color.r}, ${color.g}, ${color.b}, ${1.0 * intensity * opacity})`
        ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${0.5 * intensity * opacity})`
        ctx.lineWidth = thickness * 14 * dpr
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.stroke()
        ctx.restore()

        // Pass 2: Medium Glow Pass
        ctx.save()
        ctx.beginPath()
        points.forEach((p, idx) => {
          if (idx === 0) ctx.moveTo(p.x, p.y)
          else ctx.lineTo(p.x, p.y)
        })

        ctx.shadowBlur = glowFactor * 16 * dpr
        ctx.shadowColor = `rgba(255, 255, 255, ${0.9 * intensity * opacity})`
        ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${0.9 * intensity * opacity})`
        ctx.lineWidth = thickness * 5 * dpr
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.stroke()
        ctx.restore()

        // Pass 3: Ultra-bright Pure White Center Core Line
        ctx.save()
        ctx.beginPath()
        points.forEach((p, idx) => {
          if (idx === 0) ctx.moveTo(p.x, p.y)
          else ctx.lineTo(p.x, p.y)
        })

        ctx.shadowBlur = glowFactor * 6 * dpr
        ctx.shadowColor = `rgba(255, 255, 255, 1)`
        ctx.strokeStyle = `rgba(255, 255, 255, ${Math.min(1, 1.0 * intensity * opacity)})`
        ctx.lineWidth = thickness * 1.8 * dpr
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.stroke()
        ctx.restore()
      }

      // 3. Optional Glass Sphere Effect
      if (glass) {
        ctx.restore()
        ctx.save()

        const radius = (Math.min(w, h) * glassSize) / 2
        const cx = w / 2
        const cy = h / 2

        const glassGrad = ctx.createRadialGradient(
          cx - radius * 0.35,
          cy - radius * 0.35,
          radius * 0.05,
          cx,
          cy,
          radius
        )
        glassGrad.addColorStop(0, 'rgba(255, 255, 255, 0.25)')
        glassGrad.addColorStop(0.6, 'rgba(255, 255, 255, 0.03)')
        glassGrad.addColorStop(0.95, 'rgba(255, 255, 255, 0.12)')
        glassGrad.addColorStop(1, `rgba(255, 255, 255, ${0.4 * refraction})`)

        ctx.beginPath()
        ctx.arc(cx, cy, radius, 0, Math.PI * 2)
        ctx.fillStyle = glassGrad
        ctx.fill()

        ctx.strokeStyle = `rgba(255, 255, 255, ${0.35 * refraction})`
        ctx.lineWidth = 2 * dpr
        ctx.stroke()
      }

      ctx.restore()

      animationFrameId = requestAnimationFrame(render)
    }

    animationFrameId = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [
    colors,
    count,
    speed,
    amplitude,
    waviness,
    thickness,
    glow,
    taper,
    spread,
    intensity,
    saturation,
    opacity,
    scale,
    glass,
    refraction,
    dispersion,
    glassSize,
    hueShift,
  ])

  return (
    <canvas
      ref={canvasRef}
      className={`block w-full h-full ${className}`}
      style={{
        pointerEvents: 'none',
        ...style,
      }}
    />
  )
}
