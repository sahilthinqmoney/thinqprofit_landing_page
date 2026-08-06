import { useState, useEffect } from 'react'
import { wordmark } from '../../data/nav'

export default function ChromaticWordmark() {
  const [currentText, setCurrentText] = useState('Coming Soon!')
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentText((prev) => (prev === 'Coming Soon!' ? wordmark : 'Coming Soon!'))
        setIsAnimating(false)
      }, 400)
    }, 3200)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative overflow-visible flex items-center justify-center pt-6 pb-12 sm:pt-10 sm:pb-16 min-h-[14vw]">
      {/* 100% GPU Hardware Accelerated Smooth Transition (Zero Layout Reflow Jitter) */}
      <p
        aria-hidden="true"
        className={`chromatic-text display m-0 select-none whitespace-nowrap pb-[0.45em] text-center text-[12.5vw] sm:text-[14vw] leading-[0.9] will-change-transform transition-all duration-500 ease-in-out ${
          isAnimating
            ? 'opacity-0 scale-95 -translate-y-2'
            : 'opacity-100 scale-100 translate-y-0'
        }`}
      >
        {currentText}
      </p>
    </div>
  )
}





