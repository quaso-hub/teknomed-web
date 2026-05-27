import * as React from 'react'
import { cn } from '../../lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', type = 'button', ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tm-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--tm-page)] disabled:pointer-events-none disabled:opacity-50'

    const variants = {
      default:   'bg-[var(--tm-primary)] text-[var(--tm-on-primary)] hover:bg-[var(--tm-primary-strong)]',
      outline:   'border border-[var(--tm-border)] bg-[var(--tm-surface)] text-[var(--tm-text-strong)] hover:bg-[var(--tm-surface-muted)]',
      secondary: 'bg-[var(--tm-surface-muted)] text-[var(--tm-on-surface)] hover:bg-[var(--tm-surface-active)]',
      ghost:     'text-[var(--tm-text)] hover:bg-[var(--tm-surface-muted)]',
      link:      'text-[var(--tm-primary)] underline-offset-4 hover:underline',
    } as const

    const sizes = {
      default: 'h-10 px-4 py-2',
      sm:      'h-8 px-3 text-xs',
      lg:      'h-11 px-6',
      icon:    'size-10',
    } as const

    return (
      <button
        ref={ref}
        type={type}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'
export { Button }
export default Button
