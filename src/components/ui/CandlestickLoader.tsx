import { useEffect, useState } from 'react'

interface CandleData {
  open: number
  high: number
  low: number
  close: number
}

// Realistic 14-candle market sequence simulating a bullish consolidation & breakout
const MARKET_CANDLES: CandleData[] = [
  { open: 42, high: 46, low: 40, close: 45 },
  { open: 45, high: 48, low: 43, close: 44 }, // red
  { open: 44, high: 50, low: 42, close: 49 }, // green
  { open: 49, high: 52, low: 47, close: 48 }, // red
  { open: 48, high: 55, low: 46, close: 54 }, // green
  { open: 54, high: 58, low: 52, close: 53 }, // red
  { open: 53, high: 62, low: 51, close: 60 }, // green
  { open: 60, high: 64, low: 58, close: 63 }, // green
  { open: 63, high: 65, low: 59, close: 61 }, // red
  { open: 61, high: 70, low: 60, close: 68 }, // green
  { open: 68, high: 74, low: 66, close: 73 }, // green
  { open: 73, high: 76, low: 71, close: 72 }, // red
  { open: 72, high: 82, low: 70, close: 80 }, // green
  { open: 80, high: 88, low: 78, close: 86 }, // green
]

export default function CandlestickLoader() {
  const [visibleCount, setVisibleCount] = useState(1)
  const [dotsCount, setDotsCount] = useState(1)

  // Progressively reveal candles left-to-right
  useEffect(() => {
    const totalCandles = MARKET_CANDLES.length
    const interval = setInterval(() => {
      setVisibleCount((prev) => {
        if (prev < totalCandles) {
          return prev + 1
        }
        return prev
      })
    }, 110) // ~1.5s to draw all candles

    return () => clearInterval(interval)
  }, [])

  // Animated 3-dot indicator for "Verifying..."
  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDotsCount((prev) => (prev % 3) + 1)
    }, 400)

    return () => clearInterval(dotsInterval)
  }, [])

  // Dynamic calculations for SVG drawing area
  const svgWidth = 340
  const svgHeight = 130
  const minPrice = 35
  const maxPrice = 92
  const priceRange = maxPrice - minPrice

  const candleWidth = 14
  const candleGap = 22
  const paddingLeft = 20

  const getY = (price: number) => {
    return svgHeight - ((price - minPrice) / priceRange) * (svgHeight - 20) - 10
  }

  const latestIndex = visibleCount - 1
  const latestCandle = MARKET_CANDLES[latestIndex]
  const scanX = paddingLeft + latestIndex * candleGap + candleWidth / 2

  return (
    <div className="flex flex-col items-center justify-center py-2 w-full animate-in fade-in zoom-in-95 duration-300">
      {/* Verification Loading Status Header */}
      <div className="text-center space-y-1 mb-4">
        <div className="inline-flex items-center justify-center gap-1 text-base sm:text-lg font-bold tracking-tight text-white font-display">
          <span>Verifying</span>
          <span className="font-mono text-white/90 w-4 text-left">
            {'.'.repeat(dotsCount)}
          </span>
        </div>
        <p className="text-xs text-white/50 tracking-wide font-sans">
          Securing your session
        </p>
      </div>

      {/* Dynamic Candlestick SVG - Directly inside OTP box without secondary inner container */}
      <div className="relative w-full max-w-[340px] h-[135px] overflow-visible my-2">
        {/* Background Grid Lines */}
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between opacity-15">
          <div className="w-full border-b border-dashed border-white/40 flex justify-between items-center text-[9px] font-mono text-white/60">
            <span>85.00</span>
            <span>PRO</span>
          </div>
          <div className="w-full border-b border-dashed border-white/40 flex justify-between items-center text-[9px] font-mono text-white/60">
            <span>60.00</span>
            <span>VOL: HIGH</span>
          </div>
          <div className="w-full border-b border-dashed border-white/40 flex justify-between items-center text-[9px] font-mono text-white/60">
            <span>40.00</span>
            <span>LIVE DATA</span>
          </div>
        </div>

        {/* Dynamic Candlestick SVG */}
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full relative z-10 overflow-visible"
        >
          <defs>
            {/* Soft Emerald Glow Filter for Active Bullish Candle */}
            <filter id="emeraldGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            {/* Soft Rose Glow Filter for Active Bearish Candle */}
            <filter id="roseGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            {/* Scanning Beam Gradient */}
            <linearGradient id="scanBeam" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.4)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>

          {/* Render Candles up to visibleCount */}
          {MARKET_CANDLES.slice(0, visibleCount).map((c, i) => {
            const isBullish = c.close >= c.open
            const x = paddingLeft + i * candleGap
            const isLatest = i === visibleCount - 1

            const highY = getY(c.high)
            const lowY = getY(c.low)
            const openY = getY(c.open)
            const closeY = getY(c.close)

            const bodyTop = Math.min(openY, closeY)
            const bodyHeight = Math.max(Math.abs(closeY - openY), 2)

            const colorClass = isBullish ? '#10b981' : '#f43f5e'
            const strokeColor = isBullish ? 'rgba(16, 185, 129, 0.85)' : 'rgba(244, 63, 94, 0.85)'

            return (
              <g
                key={i}
                className="transition-all duration-200 animate-in fade-in"
                style={{ opacity: isLatest ? 1 : 0.85 }}
              >
                {/* Wick Shadow Line */}
                <line
                  x1={x + candleWidth / 2}
                  y1={highY}
                  x2={x + candleWidth / 2}
                  y2={lowY}
                  stroke={strokeColor}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />

                {/* Candle Body Rect */}
                <rect
                  x={x}
                  y={bodyTop}
                  width={candleWidth}
                  height={bodyHeight}
                  rx={2}
                  fill={colorClass}
                  filter={isLatest ? (isBullish ? 'url(#emeraldGlow)' : 'url(#roseGlow)') : undefined}
                  className={isLatest ? 'animate-pulse' : ''}
                />
              </g>
            )
          })}

          {/* Moving Laser Scan / Progress Line across the chart */}
          {visibleCount > 0 && (
            <g className="transition-all duration-150 ease-out">
              <line
                x1={scanX}
                y1={0}
                x2={scanX}
                y2={svgHeight}
                stroke="url(#scanBeam)"
                strokeWidth="1.5"
              />
              <circle
                cx={scanX}
                cy={getY(latestCandle.close)}
                r="3"
                fill="#ffffff"
                className="animate-ping opacity-75"
              />
              <circle
                cx={scanX}
                cy={getY(latestCandle.close)}
                r="2"
                fill="#ffffff"
              />
            </g>
          )}
        </svg>
      </div>
    </div>
  )
}
