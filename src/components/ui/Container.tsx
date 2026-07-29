import type { ReactNode } from 'react'

interface ContainerProps {
  children: ReactNode
  className?: string
}

/** Page gutter + max width. 1152px per design-system/thinqprofit/pages/landing.md §4. */
export default function Container({ children, className = '' }: ContainerProps) {
  return <div className={`mx-auto w-full max-w-6xl px-6 ${className}`}>{children}</div>
}
