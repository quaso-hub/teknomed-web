import { ArrowRight, Move3d, Sparkles, ShieldCheck, CheckCircle2, Zap, Award, ChevronDown, FileText, ListChecks } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { DepthReveal, StaggerItem3D, Stagger } from '../components/Motion'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import Section from '../components/Section'
import { Badge } from '../components/ui/Badge'
import { Button, buttonVariants } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/Card'
import { useProductBySlug } from '@/lib/data-hooks'
import type { CatalogSpecGroup } from '@/types'

// 3D viewer dipause dulu - akan kembali di Phase 4 dengan canvas image-sequence
// pattern (Hyperia-style). File Product3DViewer.tsx tetap ada di
// src/components/ untuk use case interaktif lain. Lihat PLAN.md section 2.11.

/** Chapter rangka. Phase 4 akan ekspansi jadi 5 chapter pinned-sticky scrub. */
type Chapter = { id: string; label: string }
const CHAPTERS: Chapter[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'preview', label: 'Preview' },
  { id: 'coverage', label: 'Cakupan Layanan' },
  { id: 'engineering', label: 'Engineering' },
  { id: 'cta', label: 'Konsultasi' },
]

/** Collapsible card for a single catalog spec group */
function CatalogSpecGroupCard({ group, index }: { group: CatalogSpecGroup; index: number }) {
  const [open, setOpen] = useState(index < 3) // first 3 open by default
  const hasItems = group.items.length > 0

  return (
    <div className="rounded-xl border border-[var(--tm-border)] bg-[var(--tm-surface)] overflow-hidden transition-colors hover:border-[var(--tm-primary)]/40">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-center gap-3 p-4 text-left"
      >
        <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-[var(--tm-primary)]/10 text-[var(--tm-primary)]">
          <FileText className="size-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[var(--tm-text-strong)] truncate">{group.title}</p>
          {group.quantity != null && (
            <p className="text-[11px] text-[var(--tm-muted)]">
              Qty: {group.quantity}{group.unit ? ` ${group.unit}` : ''}
            </p>
          )}
        </div>
        {hasItems && (
          <ChevronDown
            className={`size-4 shrink-0 text-[var(--tm-muted)] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        )}
      </button>
      {open && hasItems && (
        <div className="border-t border-[var(--tm-border)] px-4 pb-4 pt-3">
          <div className="space-y-2">
            {group.items.map((item, i) => (
              <div key={i} className="flex gap-2 text-sm">
                {item.label ? (
                  <>
                    <span className="shrink-0 font-medium text-[var(--tm-text-strong)] min-w-[120px] max-w-[180px]">
                      {item.label}
                    </span>
                    <span className="text-[var(--tm-muted)]">{item.value}</span>
                  </>
                ) : (
                  <span className="flex items-start gap-2 text-[var(--tm-muted)]">
                    <span className="mt-1.5 size-1 shrink-0 rounded-full bg-[var(--tm-primary)]/40" />
                    {item.value}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {open && !hasItems && (
        <div className="border-t border-[var(--tm-border)] px-4 pb-4 pt-3">
          <p className="text-xs text-[var(--tm-muted)] italic">Spesifikasi terperinci tersedia dalam dokumen tender.</p>
        </div>
      )}
    </div>
  )
}

/** Sticky TOC desktop — clean vertical list */
function ChapterTOC({ activeId, onJump }: { activeId: string; onJump: (id: string) => void }) {
  return (
    <nav aria-label="Daftar isi produk" className="sticky top-24 hidden lg:block w-full">
      <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--tm-muted)]">
        Daftar Isi
      </p>
      <ul className="space-y-0.5">
        {CHAPTERS.map((ch, i) => {
          const active = ch.id === activeId
          return (
            <li key={ch.id}>
              <button
                type="button"
                onClick={() => onJump(ch.id)}
                className={[
                  'group flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition-all duration-200',
                  active
                    ? 'bg-[var(--tm-primary)]/10 font-semibold text-[var(--tm-primary)]'
                    : 'text-[var(--tm-muted)] hover:bg-[var(--tm-surface-muted)] hover:text-[var(--tm-text)]',
                ].join(' ')}
              >
                <span className={[
                  'shrink-0 font-mono text-[0.55rem] font-semibold transition-colors',
                  active ? 'text-[var(--tm-primary)]' : 'text-[var(--tm-border)] group-hover:text-[var(--tm-muted)]',
                ].join(' ')}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="whitespace-nowrap">{ch.label}</span>
                {active && (
                  <span className="ml-auto size-1.5 shrink-0 rounded-full bg-[var(--tm-primary)]" />
                )}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

/** Mobile TOC � sticky horizontal pill strip, di dalam flow normal */
function MobileChapterNav({ activeId, onJump }: { activeId: string; onJump: (id: string) => void }) {
  return (
    <nav
      aria-label="Navigasi bab produk"
      className="sticky top-14 z-[25] -mx-4 sm:-mx-6 lg:hidden flex gap-2 overflow-x-auto border-b border-[var(--tm-border)] bg-[var(--tm-page)]/95 px-4 py-2.5 backdrop-blur-md mb-6"
      style={{ scrollbarWidth: 'none' }}
    >
      {CHAPTERS.map(ch => {
        const active = ch.id === activeId
        return (
          <button
            key={ch.id}
            type="button"
            onClick={() => onJump(ch.id)}
            className={[
              'shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 whitespace-nowrap',
              active
                ? 'bg-[var(--tm-primary)] text-white shadow-sm'
                : 'bg-[var(--tm-surface-muted)] text-[var(--tm-muted)] hover:bg-[var(--tm-surface-active)] hover:text-[var(--tm-text)]',
            ].join(' ')}
          >
            {ch.label}
          </button>
        )
      })}
    </nav>
  )
}

export default function ProductDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { data: product } = useProductBySlug(slug ?? '')
  useDocumentTitle(product?.name ?? 'Produk')

  const [activeId, setActiveId] = useState<string>(CHAPTERS[0].id)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // IntersectionObserver: highlight chapter saat 30% terlihat di viewport
  useEffect(() => {
    if (!product) return
    if (observerRef.current) observerRef.current.disconnect()

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting).sort(
          (a, b) => b.intersectionRatio - a.intersectionRatio
        )
        if (visible.length > 0 && visible[0].target.id) {
          setActiveId(visible[0].target.id)
        }
      },
      { threshold: [0.2, 0.4, 0.6], rootMargin: '-20% 0px -40% 0px' }
    )

    CHAPTERS.forEach(ch => {
      const el = document.getElementById(ch.id)
      if (el) observer.observe(el)
    })
    observerRef.current = observer
    return () => observer.disconnect()
  }, [product])

  function jumpTo(id: string) {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  if (!product) {
    return (
      <Section
        eyebrow="Katalog"
        title="Produk tidak ditemukan"
        description="Slug produk tidak terdaftar dalam katalog kami."
      >
        <div className="mb-6">
          <Link to="/catalog" className="text-sm font-semibold text-[var(--tm-muted)] hover:text-[var(--tm-text-strong)] transition-colors">
            ? Kembali ke Catalog
          </Link>
        </div>
        <Card>
          <CardContent className="p-8">
            <p className="text-sm text-[var(--tm-muted)]">
              Slug: <code className="font-mono text-[var(--tm-text-strong)]">{slug}</code>
            </p>
            <Button className="mt-4" onClick={() => navigate('/catalog')}>
              Lihat Semua Produk
            </Button>
          </CardContent>
        </Card>
      </Section>
    )
  }

  return (
    <Section
      eyebrow="Katalog"
      title={product.name}
      description={product.summary ?? product.desc}
    >
      <div className="mb-6">
        <Link to="/catalog" className="text-sm font-semibold text-[var(--tm-muted)] hover:text-[var(--tm-text-strong)] transition-colors">
          ? Kembali ke Catalog
        </Link>
      </div>

      {/* Mobile chapter nav � horizontal pill strip, sticky below navbar */}
      <MobileChapterNav activeId={activeId} onJump={jumpTo} />

      <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
        {/* Left col: TOC only � clean, no MarkersRail overlap */}
        <ChapterTOC activeId={activeId} onJump={jumpTo} />

        <div ref={contentRef} className="space-y-12">
          {/* Chapter: Overview */}
          <section id="overview" className="scroll-mt-28">
            <DepthReveal>
              <div className="mb-2 flex items-center gap-2">
                <span className="font-mono text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-[var(--tm-muted)]">01 / Overview</span>
              </div>
              <h2 className="mb-3 text-2xl font-bold text-[var(--tm-text-strong)]">{product.name}</h2>
              <p className="mb-6 text-base leading-7 text-[var(--tm-muted)]">{product.summary ?? product.desc}</p>
              <div className="flex flex-wrap gap-2">
                {['Konsultasi', 'Instalasi', 'Maintenance', 'Commissioning'].map((item) => (
                  <Badge key={item} variant="outline" className="px-3 py-1">{item}</Badge>
                ))}
              </div>
            </DepthReveal>
          </section>

          {/* Chapter: Preview */}
          <section id="preview" className="scroll-mt-28">
            <DepthReveal delay={0.05}>
              <div className="mb-2 flex items-center gap-2">
                <span className="font-mono text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-[var(--tm-muted)]">02 / Preview</span>
              </div>
              <div
                className="relative overflow-hidden rounded-2xl"
                style={{ background: 'linear-gradient(135deg, var(--tm-primary) 0%, var(--tm-accent) 60%, var(--tm-footer) 100%)' }}
              >
                {product.has_3d ? (
                  <div className="relative aspect-video w-full">
                    <iframe
                      src={`https://3d.teknomed.web.id/viewer?product=${product.viewerConfig?.viewerProduct || slug}`}
                      className="absolute inset-0 w-full h-full border-0"
                      allow="fullscreen"
                      title={`3D View: ${product.name}`}
                    />
                    <a
                      href={`https://3d.teknomed.web.id/?product=${product.viewerConfig?.viewerProduct || slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute top-4 left-4 z-10 flex items-center gap-2 rounded-lg bg-black/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm hover:bg-black/80 transition-colors"
                    >
                      <Move3d className="size-3.5" />
                      Open Full App
                    </a>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4 px-8 py-16 text-center">
                    <div className="grid size-16 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur-sm">
                      <Move3d className="size-7 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70 mb-2">
                        3D Experience
                      </p>
                      <p className="text-lg font-bold text-white mb-1">Visualisasi Interaktif</p>
                      <p className="max-w-[32ch] text-sm leading-6 text-white/70">
                        Sedang disiapkan. Tim teknis dapat mengirim spesifikasi penuh via email.
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/80 backdrop-blur-sm">
                      <Sparkles className="size-3" />
                      Coming Soon
                    </div>
                  </div>
                )}
                {/* Decorative grid */}
                <div className="absolute inset-0 hero-grid opacity-10 pointer-events-none" />
              </div>
            </DepthReveal>
          </section>

          {/* Chapter: Coverage */}
          <section id="coverage" className="scroll-mt-28">
            <DepthReveal>
              <div className="mb-2 flex items-center gap-2">
                <span className="font-mono text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-[var(--tm-muted)]">03 / Cakupan</span>
              </div>
              <h3 className="mb-6 text-xl font-bold text-[var(--tm-text-strong)]">Cakupan Layanan</h3>
              <Stagger className="grid gap-3 sm:grid-cols-2">
                {(product.bullets ?? product.specs).map((b) => (
                  <StaggerItem3D key={b}>
                    <div className="flex items-start gap-3 rounded-xl border border-[var(--tm-border)] bg-[var(--tm-surface)] p-4 transition-colors hover:border-[var(--tm-primary)]">
                      <div className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-[var(--tm-primary)]/10">
                        <CheckCircle2 className="size-3.5 text-[var(--tm-primary)]" />
                      </div>
                      <p className="text-sm leading-6 text-[var(--tm-text)]">{b}</p>
                    </div>
                  </StaggerItem3D>
                ))}
              </Stagger>
            </DepthReveal>
          </section>

          {/* Chapter: Engineering */}
          <section id="engineering" className="scroll-mt-28">
            <DepthReveal>
              <div className="mb-2 flex items-center gap-2">
                <span className="font-mono text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-[var(--tm-muted)]">04 / Engineering</span>
              </div>
              <h3 className="mb-6 text-xl font-bold text-[var(--tm-text-strong)]">Engineering & Standar</h3>
              <div className="grid gap-4 sm:grid-cols-3 mb-8">
                {[
                  { icon: ShieldCheck, title: 'Standar Internasional', desc: 'HTM 02-01, NFPA 99, ISO 14644' },
                  { icon: Zap, title: 'Commissioning', desc: 'Uji fungsi & pressure test lengkap' },
                  { icon: Award, title: 'Dokumentasi', desc: 'As-built drawing & logbook maintenance' },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="rounded-xl border border-[var(--tm-border)] bg-[var(--tm-surface)] p-5">
                    <div className="mb-3 grid size-10 place-items-center rounded-lg bg-[var(--tm-primary)]/10 text-[var(--tm-primary)]">
                      <Icon className="size-5" />
                    </div>
                    <p className="text-sm font-semibold text-[var(--tm-text-strong)]">{title}</p>
                    <p className="mt-1 text-xs text-[var(--tm-muted)]">{desc}</p>
                  </div>
                ))}
              </div>

              {/* Catalog brochure specs — dynamic per product */}
              {product.catalogSpecs && product.catalogSpecs.length > 0 && (
                <div>
                  <div className="mb-4 flex items-center gap-2">
                    <ListChecks className="size-4 text-[var(--tm-primary)]" />
                    <h4 className="text-base font-bold text-[var(--tm-text-strong)]">
                      Spesifikasi Detail Katalog
                    </h4>
                    <Badge variant="outline" className="ml-auto text-[10px]">
                      {product.catalogSpecs.length} item
                    </Badge>
                  </div>
                  <Stagger className="grid gap-3 sm:grid-cols-2">
                    {product.catalogSpecs.map((group, i) => (
                      <StaggerItem3D key={group.title}>
                        <CatalogSpecGroupCard group={group} index={i} />
                      </StaggerItem3D>
                    ))}
                  </Stagger>
                </div>
              )}
            </DepthReveal>
          </section>

          {/* Chapter: CTA */}
          <section id="cta" className="scroll-mt-28">
            <DepthReveal>
              <div
                className="relative overflow-hidden rounded-2xl p-8"
                style={{ background: 'linear-gradient(135deg, var(--tm-primary) 0%, var(--tm-accent) 100%)' }}
              >
                <div className="absolute inset-0 hero-grid opacity-10 pointer-events-none" />
                <div className="relative">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="font-mono text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-white/60">05 / Konsultasi</span>
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-white">Konsultasikan Kebutuhan Anda</h3>
                  <p className="mb-6 text-sm text-white/75">
                    Tim teknis kami siap membantu dari survey awal hingga commissioning.
                  </p>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <a
                      href="mailto:teknomedindotimurpt@gmail.com?subject=Request%20Quotation"
                      className="inline-flex h-11 items-center justify-center rounded-lg px-6 text-sm font-semibold !text-white transition-all hover:-translate-y-0.5"
                      style={{ backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)' }}
                    >
                      Request Quotation <ArrowRight className="ml-2 size-4" />
                    </a>
                    <button
                      onClick={() => navigate('/contact')}
                      className="inline-flex h-11 items-center justify-center rounded-lg px-6 text-sm font-semibold !text-white/80 transition-all hover:text-white"
                      style={{ border: '1px solid rgba(255,255,255,0.2)' }}
                    >
                      Konsultasi
                    </button>
                  </div>
                </div>
              </div>
            </DepthReveal>
          </section>
        </div>
      </div>
    </Section>
  )
}
