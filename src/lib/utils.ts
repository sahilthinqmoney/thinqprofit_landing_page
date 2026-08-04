import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/*
 * The class merger every shadcn-registry component imports as `@/lib/utils`.
 * `clsx` resolves the conditionals; `twMerge` resolves the conflicts, so a
 * component's own `px-4` loses to a caller's `px-6` instead of both landing and
 * letting source order decide.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
