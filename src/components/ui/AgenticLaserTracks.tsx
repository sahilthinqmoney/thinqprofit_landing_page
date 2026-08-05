import React, { useEffect, useRef } from 'react'

export interface AgenticLaserTracksProps {
  className?: string
  style?: React.CSSProperties
  trackCount?: number
  laserSpeed?: number
  accentColor?: string
  glowColor?: string
}

interface LaserPulse {
  x: number
  yIndex: number
  speed: number
  length: number
  hue: number
  headAlpha: number
  size: number
  sparks: { x: number; y: number; vx: number; vy: number; alpha: number; size: number }[]
}

interface IntersectionPulse {
  x: number
  y: number
  radius: number
  maxRadius: number
  alpha: number
}

export default function AgenticLaserTracks({
  className = '',
  style = {},
  trackCount = 8,
  laserSpeed = 1.2,
}: AgenticLaserTracksProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: -1000, y: -1000, active: false })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let animationFrameId: number

    const handleResize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect()
      const width = rect?.width || window.innerWidth || 1200
      const height = rect?.height || canvas.clientHeight || 450
      const dpr = Math.min(window.devicePixelRatio || 1, 2)

      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      }
    }

    const handleMouseLeave = () => {
      mouseRef.current.active = false
    }

    const parent = canvas.parentElement
    if (parent) {
      parent.addEventListener('mousemove', handleMouseMove)
      parent.addEventListener('mouseleave', handleMouseLeave)
    }

    // Initialize Laser Pulses
    const pulses: LaserPulse[] = []
    const intersections: IntersectionPulse[] = []

    for (let i = 0; i < 16; i++) {
      pulses.push({
        x: Math.random() * 1400 - 200,
        yIndex: Math.floor(Math.random() * trackCount),
        speed: (2.5 + Math.random() * 4.5) * laserSpeed,
        length: 120 + Math.random() * 180,
        hue: Math.random() > 0.4 ? 190 : 205,
        headAlpha: 0.85 + Math.random() * 0.15,
        size: 1.8 + Math.random() * 1.6,
        sparks: [],
      })
    }

    const render = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = canvas.width
      const h = canvas.height
      const centerY = h / 2

      ctx.clearRect(0, 0, w, h)

      // Calculate track Y coordinates
      const paddingY = 50 * dpr
      const trackSpacing = (h - paddingY * 2) / (trackCount - 1 || 1)
      const trackYs = Array.from({ length: trackCount }, (_, i) => paddingY + i * trackSpacing)

      // Vertical grid lines
      const colCount = 14
      const colSpacing = w / (colCount - 1)
      const colXs = Array.from({ length: colCount }, (_, i) => i * colSpacing)

      // 1. Draw Subtle Cybernetic Background Grid & Track Lines
      ctx.save()
      ctx.lineWidth = 1 * dpr
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)'

      // Horizontal track lines
      trackYs.forEach((y) => {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
        ctx.stroke()
      })

      // Vertical grid lines
      colXs.forEach((x) => {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, h)
        ctx.stroke()
      })

      // Grid Intersection Dots
      colXs.forEach((x) => {
        trackYs.forEach((y) => {
          ctx.beginPath()
          ctx.arc(x, y, 1.5 * dpr, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(255, 255, 255, 0.08)'
          ctx.fill()
        })
      })
      ctx.restore()

      // 2. Draw Active Intersection Expansion Rings
      ctx.save()
      ctx.globalCompositeOperation = 'lighter'
      for (let i = intersections.length - 1; i >= 0; i--) {
        const ring = intersections[i]
        ring.radius += 0.8 * dpr
        ring.alpha -= 0.025

        if (ring.alpha <= 0 || ring.radius >= ring.maxRadius) {
          intersections.splice(i, 1)
          continue
        }

        ctx.beginPath()
        ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(56, 217, 245, ${ring.alpha})`
        ctx.lineWidth = 1.2 * dpr
        ctx.stroke()
      }
      ctx.restore()

      // 3. Render High-Speed Laser Streams & Sparks (Additive Lighter)
      ctx.save()
      ctx.globalCompositeOperation = 'lighter'

      pulses.forEach((p) => {
        // Move pulse forward
        p.x += p.speed * dpr * 1.5

        const y = trackYs[p.yIndex % trackCount]
        const tailX = p.x - p.length * dpr

        // Check if passing a grid column intersection -> trigger pulse ring
        colXs.forEach((cx) => {
          if (Math.abs(p.x - cx) < p.speed * dpr * 1.5) {
            if (Math.random() < 0.35) {
              intersections.push({
                x: cx,
                y,
                radius: 2 * dpr,
                maxRadius: (12 + Math.random() * 16) * dpr,
                alpha: 0.6,
              })
            }
          }
        })

        // Generate tiny trailing sparks
        if (Math.random() < 0.4) {
          p.sparks.push({
            x: p.x - (Math.random() * 20) * dpr,
            y: y + (Math.random() - 0.5) * 6 * dpr,
            vx: (Math.random() - 0.8) * 2 * dpr,
            vy: (Math.random() - 0.5) * 1.5 * dpr,
            alpha: 0.8,
            size: (0.8 + Math.random() * 1.2) * dpr,
          })
        }

        // Draw sparks
        for (let sIdx = p.sparks.length - 1; sIdx >= 0; sIdx--) {
          const sp = p.sparks[sIdx]
          sp.x += sp.vx
          sp.y += sp.vy
          sp.alpha -= 0.04

          if (sp.alpha <= 0) {
            p.sparks.splice(sIdx, 1)
            continue
          }

          ctx.beginPath()
          ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(180, 245, 255, ${sp.alpha})`
          ctx.fill()
        }

        // Reset if pulse goes past width
        if (tailX > w + 100 * dpr) {
          p.x = -p.length * dpr - Math.random() * 300 * dpr
          p.yIndex = Math.floor(Math.random() * trackCount)
          p.speed = (2.5 + Math.random() * 4.5) * laserSpeed
        }

        // Draw Comet Laser Tail (Linear Gradient)
        const grad = ctx.createLinearGradient(tailX, y, p.x, y)
        grad.addColorStop(0, 'rgba(0, 0, 0, 0)')
        grad.addColorStop(0.3, `rgba(44, 127, 147, ${0.15 * p.headAlpha})`)
        grad.addColorStop(0.75, `rgba(56, 217, 245, ${0.65 * p.headAlpha})`)
        grad.addColorStop(1, `rgba(255, 255, 255, ${p.headAlpha})`)

        // Outer Glow Trail
        ctx.save()
        ctx.shadowBlur = 16 * dpr
        ctx.shadowColor = `rgba(56, 217, 245, ${0.8 * p.headAlpha})`
        ctx.beginPath()
        ctx.moveTo(Math.max(-50, tailX), y)
        ctx.lineTo(p.x, y)
        ctx.strokeStyle = grad
        ctx.lineWidth = p.size * 2.8 * dpr
        ctx.lineCap = 'round'
        ctx.stroke()
        ctx.restore()

        // Inner Core Trail
        ctx.beginPath()
        ctx.moveTo(Math.max(-50, tailX), y)
        ctx.lineTo(p.x, y)
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.9 * p.headAlpha})`
        ctx.lineWidth = p.size * 0.9 * dpr
        ctx.lineCap = 'round'
        ctx.stroke()

        // Laser Head Flare
        const headGrad = ctx.createRadialGradient(p.x, y, 0, p.x, y, 12 * dpr)
        headGrad.addColorStop(0, 'rgba(255, 255, 255, 1)')
        headGrad.addColorStop(0.3, `rgba(56, 217, 245, ${0.9 * p.headAlpha})`)
        headGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')

        ctx.fillStyle = headGrad
        ctx.beginPath()
        ctx.arc(p.x, y, 12 * dpr, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.restore()

      // 4. Center Atmospheric Vignette (Keeps copy 100% legible)
      ctx.save()
      const vigRadX = w * 0.45
      const vigRadY = h * 0.5
      ctx.translate(w / 2, centerY)
      ctx.scale(1, vigRadY / vigRadX)

      const vigGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, vigRadX)
      vigGrad.addColorStop(0, 'rgba(10, 10, 14, 0.72)')
      vigGrad.addColorStop(0.5, 'rgba(10, 10, 14, 0.45)')
      vigGrad.addColorStop(1, 'rgba(10, 10, 14, 0)')

      ctx.fillStyle = vigGrad
      ctx.beginPath()
      ctx.arc(0, 0, vigRadX, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      animationFrameId = requestAnimationFrame(render)
    }

    animationFrameId = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (parent) {
        parent.removeEventListener('mousemove', handleMouseMove)
        parent.removeEventListener('mouseleave', handleMouseLeave)
      }
      cancelAnimationFrame(animationFrameId)
    }
  }, [trackCount, laserSpeed])

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
