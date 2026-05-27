import { cn } from '../lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'outline' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function Badge({ children, variant = 'default', size = 'md', className }: BadgeProps) {
  const variantStyles = {
    default: 'bg-[var(--tm-primary)] text-[var(--tm-on-primary)]',
    outline: 'border border-[var(--tm-border)] bg-transparent text-[var(--tm-text-strong)]',
    secondary: 'bg-[var(--tm-surface-muted)] text-[var(--tm-text)]',
    accent: 'bg-[var(--tm-accent)] text-white',
    success: 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-600 border border-amber-500/20',
    danger: 'bg-red-500/10 text-red-600 border border-red-500/20',
  }

  const sizeStyles = {
    sm: 'px-1.5 py-0.5 text-[10px]',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium leading-none',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  )
}
