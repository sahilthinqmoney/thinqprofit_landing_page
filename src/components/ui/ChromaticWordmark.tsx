import { wordmark } from '../../data/nav'

export default function ChromaticWordmark() {
  return (
    <div className="relative overflow-visible flex items-center justify-center pt-6 pb-12 sm:pt-10 sm:pb-16 min-h-[14vw]">
      <p
        aria-hidden="true"
        className="chromatic-text display m-0 select-none whitespace-nowrap pb-[0.45em] text-center text-[12.5vw] sm:text-[14vw] leading-[0.9]"
      >
        {wordmark}
      </p>
    </div>
  )
}





