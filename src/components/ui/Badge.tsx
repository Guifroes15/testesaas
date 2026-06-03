import type { ReactNode } from 'react'

type BadgeVariant = 'green' | 'yellow' | 'red' | 'blue' | 'gray' | 'purple'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  dot?: boolean
}

const variants: Record<BadgeVariant, string> = {
  green:  'bg-green-500/15 text-green-500 border-green-500/20',
  yellow: 'bg-yellow-500/15 text-yellow-500 border-yellow-500/20',
  red:    'bg-red-500/15 text-red-500 border-red-500/20',
  blue:   'bg-blue-500/15 text-blue-500 border-blue-500/20',
  gray:   'bg-[var(--color-border)] text-[var(--color-muted)] border-transparent',
  purple: 'bg-purple-500/15 text-purple-500 border-purple-500/20',
}

const dotColors: Record<BadgeVariant, string> = {
  green:  'bg-green-500',
  yellow: 'bg-yellow-500',
  red:    'bg-red-500',
  blue:   'bg-blue-500',
  gray:   'bg-[var(--color-muted)]',
  purple: 'bg-purple-500',
}

export function Badge({ children, variant = 'gray', dot }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${variants[variant]}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  )
}
