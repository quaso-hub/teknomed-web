import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

type GridProps = {
  children: ReactNode
  className?: string
}

export function ResponsiveGrid({ children, className }: GridProps) {
  return <div className={cn('grid gap-6 sm:grid-cols-2 xl:grid-cols-3', className)}>{children}</div>
}
