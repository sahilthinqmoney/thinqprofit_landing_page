import { useState, useEffect, useRef } from 'react'

interface SplitFlapTextProps {
  words: string[]
  flipDuration?: number
  stagger?: number
  cycleDelay?: number
  charset?: string
  flipsPerChar?: number
  tileColor?: string
  textColor?: string
  tileRadius?: number
  gap?: number
  fontSize?: number
  loop?: boolean
  padTo?: number
  className?: string
}

const ALPHANUMERIC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789! '

export default function SplitFlapText({
  words,
  stagger = 0.06,
  cycleDelay = 2400,
  charset = ALPHANUMERIC,
  flipsPerChar = 6,
  tileColor = '#0c0e12',
  textColor = '#f8fafc',
  tileRadius = 8,
  gap = 6,
  fontSize = 48,
  loop = true,
  padTo,
  className = '',
}: SplitFlapTextProps) {
  const [wordIndex, setWordIndex] = useState(0)
  const maxLen = padTo || Math.max(...words.map((w) => w.length))
  
  const currentWord = words[wordIndex] || ''
  const paddedWord = currentWord.padEnd(maxLen, ' ').toUpperCase()

  const [displayedChars, setDisplayedChars] = useState<string[]>(
    words[0] ? words[0].padEnd(maxLen, ' ').toUpperCase().split('') : Array(maxLen).fill(' ')
  )
  const [flippingIndices, setFlippingIndices] = useState<boolean[]>(Array(maxLen).fill(false))

  const isInitial = useRef(true)

  useEffect(() => {
    if (isInitial.current) {
      isInitial.current = false
      return
    }

    const targetChars = paddedWord.split('')
    const newFlipping = Array(maxLen).fill(true)
    setFlippingIndices(newFlipping)

    targetChars.forEach((char, charIdx) => {
      let flipsCount = 0
      const charSetArr = charset.split('')

      const interval = setInterval(() => {
        flipsCount++
        if (flipsCount >= flipsPerChar) {
          clearInterval(interval)
          setDisplayedChars((prev) => {
            const next = [...prev]
            next[charIdx] = char
            return next
          })
          setFlippingIndices((prev) => {
            const next = [...prev]
            next[charIdx] = false
            return next
          })
        } else {
          const randomChar = charSetArr[Math.floor(Math.random() * charSetArr.length)]
          setDisplayedChars((prev) => {
            const next = [...prev]
            next[charIdx] = randomChar
            return next
          })
        }
      }, 50 + charIdx * (stagger * 1000))
    })
  }, [wordIndex, paddedWord, maxLen, charset, flipsPerChar, stagger])

  useEffect(() => {
    if (!loop && wordIndex >= words.length - 1) return

    const timer = setTimeout(() => {
      setWordIndex((prev) => (prev + 1) % words.length)
    }, cycleDelay)

    return () => clearTimeout(timer)
  }, [wordIndex, words.length, cycleDelay, loop])

  return (
    <div
      className={`inline-flex items-center justify-center select-none ${className}`}
      style={{ gap: `${gap}px` }}
    >
      {displayedChars.map((char, i) => (
        <div
          key={i}
          className="relative flex items-center justify-center font-mono font-bold uppercase shadow-2xl transition-transform duration-150"
          style={{
            width: `${fontSize * 0.85}px`,
            height: `${fontSize * 1.25}px`,
            backgroundColor: tileColor,
            color: textColor,
            borderRadius: `${tileRadius}px`,
            fontSize: `${fontSize}px`,
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 4px 14px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)',
          }}
        >
          {/* Top-to-bottom split line */}
          <div className="absolute inset-x-0 top-1/2 h-[1px] bg-black/60 z-20 pointer-events-none" />

          {/* Character */}
          <span className={`z-10 leading-none ${flippingIndices[i] ? 'opacity-90' : ''}`}>
            {char === ' ' ? '\u00A0' : char}
          </span>
        </div>
      ))}
    </div>
  )
}
