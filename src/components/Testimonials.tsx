import { Quote } from 'lucide-react'
import { Stagger, StaggerItem3D } from './Motion'
import { Card, CardContent } from './ui/Card'
import { TESTIMONIALS } from '../data/testimonials'

/**
 * Testimonials section - EatNaked pattern (social proof for B2B contractor).
 * Staggered cards with quote, name, role, company, project context.
 */
export function Testimonials() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20 cv-auto">
      <div className="mx-auto max-w-3xl">
        <p className="font-mono text-xs font-medium uppercase tracking-[0.22em] text-[var(--tm-muted)]">
          Testimoni Klien
        </p>
        <h2 className="mt-3 font-serif text-balance text-3xl font-bold tracking-tight text-[var(--tm-text-strong)] sm:text-4xl">
          Dipercaya fasilitas kesehatan di Indonesia Timur
        </h2>
        <p className="mt-4 text-base leading-7 text-[var(--tm-muted)] sm:text-lg">
          Bukti nyata dari mitra yang telah merasakan kualitas pengerjaan dan
          after-sales support tim Teknomed.
        </p>
      </div>

      <Stagger className="mt-10 grid gap-4 sm:grid-cols-2" stagger={0.1}>
        {TESTIMONIALS.map((t) => (
          <StaggerItem3D key={t.id}>
            <Card className="h-full">
              <CardContent className="flex h-full flex-col gap-4 p-6">
                <div
                  className="grid size-10 shrink-0 place-items-center rounded-lg"
                  style={{
                    background: 'color-mix(in srgb, var(--tm-primary) 10%, transparent)',
                    color: 'var(--tm-primary)',
                  }}
                >
                  <Quote className="size-5" />
                </div>

                <blockquote className="flex-1 text-sm leading-6 text-[var(--tm-text)]">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                <div className="mt-auto border-t border-[var(--tm-border)] pt-4">
                  <p className="font-semibold text-[var(--tm-text-strong)]">{t.name}</p>
                  <p className="text-xs text-[var(--tm-muted)]">
                    {t.role} &middot; {t.company}
                  </p>
                  <p className="mt-1.5 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-[var(--tm-muted)]">
                    {t.projectContext}
                  </p>
                </div>
              </CardContent>
            </Card>
          </StaggerItem3D>
        ))}
      </Stagger>
    </section>
  )
}
