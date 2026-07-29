import type { ReactNode } from 'react'

interface ContainerProps {
  children: ReactNode
  className?: string
}

/**
 * Page gutter + max width.
 *
 * Near-full-bleed: on any display up to 1760px the content is simply the
 * viewport minus its edge padding, so a 1440 laptop uses 1440 - 2×64 = 1312px
 * rather than the 1152px the old `max-w-6xl` cap allowed.
 *
 * The 1760px ceiling only engages on ultrawide displays, where truly unbounded
 * width would push body copy past a readable measure. Sections that want to
 * span the entire viewport regardless (full-bleed rules, edge-to-edge media)
 * should sit outside Container rather than widening it.
 */
export default function Container({ children, className = '' }: ContainerProps) {
  return (
    <div className={`mx-auto w-full max-w-[1760px] px-5 sm:px-6 lg:px-8 xl:px-12 ${className}`}>
      {children}
    </div>
  )
}
