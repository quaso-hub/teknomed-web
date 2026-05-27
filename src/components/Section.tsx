import type { ReactNode } from 'react'
import { FadeLine, Reveal } from './Motion'

type SectionProps = {
  eyebrow?: string
  title?: string
  description?: string
  children: ReactNode
  className?: string
}

export default function Section({ eyebrow, title, description, children, className }: SectionProps) {
  const hasHeader = eyebrow || title || description

  return (
    <section className={`mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20 cv-auto ${className ?? ''}`.trim()}>
      {hasHeader && (
        <Reveal className="mx-auto max-w-3xl">
          {eyebrow ? (
            <p className="font-mono text-xs font-medium uppercase tracking-[0.22em] text-[var(--tm-muted)]">
              {eyebrow}
            </p>
          ) : null}
          {title ? (
            <h2 className="mt-3 font-serif text-balance text-3xl font-bold tracking-tight text-[var(--tm-text-strong)] sm:text-4xl">
              {title}
            </h2>
          ) : null}
          {description ? (
            <p className="mt-4 text-base leading-7 text-[var(--tm-muted)] sm:text-lg">{description}</p>
          ) : null}
          <FadeLine className="mt-8" />
        </Reveal>
      )}
      <div className={hasHeader ? 'mt-10' : ''}>{children}</div>
    </section>
  )
}
