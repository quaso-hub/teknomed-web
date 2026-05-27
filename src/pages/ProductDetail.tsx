import { ArrowRight, Move3d, Sparkles, ShieldCheck, Layers3, Phone } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Reveal } from '../components/Motion'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import Section from '../components/Section'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'

// 3D viewer dipause dulu - akan kembali di Phase 4 dengan canvas image-sequence
// pattern (Hyperia-style). File Product3DViewer.tsx tetap ada di
// src/components/ untuk use case interaktif lain. Lihat PLAN.md section 2.11.

type Product = {
  slug: string
  name: string
  summary: string
  bullets: string[]
}

const PRODUCTS: Product[] = [
  {
    slug: 'mgps',
    name: 'Medical Gas Pipeline System (MGPS)',
    summary: 'Solusi perencanaan dan instalasi jaringan gas medis untuk fasilitas kesehatan.',
    bullets: [
      'Perencanaan jalur pipa dan titik outlet sesuai standar',
      'Instalasi sistem distribusi gas medis (O2, N2O, Vacuum, dll)',
      'Pengujian kebocoran dan commissioning',
      'Maintenance berkala dan after-sales support',
    ],
  },
  {
    slug: 'mot',
    name: 'Modular Operating Theatre (MOT)',
    summary: 'Ruang operasi modular yang dapat dikustomisasi sesuai standar dan kebutuhan.',
    bullets: [
      'Panel modular dinding dan plafon dengan finishing anti-bakteri',
      'Integrasi HVAC, electrical, dan sistem pendukung',
      'Pintu hermetik dan sistem kontrol tekanan',
      'Maintenance dan after-sales support',
    ],
  },
  {
    slug: 'hvac-cleanroom',
    name: 'HVAC & Cleanroom',
    summary: 'Sistem tata udara untuk kenyamanan, kontrol temperatur, dan kebersihan ruangan.',
    bullets: [
      'Perencanaan load dan kebutuhan airflow',
      'Instalasi AHU, ducting, dan diffuser',
      'Balancing dan testing sesuai standar',
      'Sistem filtrasi HEPA untuk cleanroom',
    ],
  },
  {
    slug: 'electrical-mechanical',
    name: 'Electrical & Mechanical',
    summary: 'Pekerjaan mekanikal dan elektrikal untuk proyek rumah sakit dan klinik.',
    bullets: [
      'Instalasi panel listrik dan distribusi daya',
      'Sistem grounding dan proteksi petir',
      'Instalasi pompa, plumbing, dan fire protection',
      'Koordinasi MEP terintegrasi',
    ],
  },
  {
    slug: 'radiology-chiller',
    name: 'Radiology Room Chiller',
    summary: 'Sistem pendinginan khusus untuk ruang radiologi.',
    bullets: [
      'Chiller dedicated untuk peralatan radiologi',
      'Kontrol temperatur presisi',
      'Monitoring dan alarm system',
      'Maintenance preventif berkala',
    ],
  },
  {
    slug: 'consumables-spareparts',
    name: 'Consumables & Spare Parts',
    summary: 'Pengadaan consumable dan spare part peralatan medis.',
    bullets: [
      'Filter HEPA dan pre-filter',
      'Spare part AHU dan ducting',
      'Komponen gas medis (valve, regulator, outlet)',
      'Consumable maintenance rutin',
    ],
  },
]

/** Chapter rangka. Phase 4 akan ekspansi jadi 5 chapter pinned-sticky scrub. */
type Chapter = { id: string; label: string }
const CHAPTERS: Chapter[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'preview', label: 'Preview' },
  { id: 'coverage', label: 'Cakupan Layanan' },
  { id: 'engineering', label: 'Engineering' },
  { id: 'cta', label: 'Konsultasi' },
]

/** Sticky TOC dengan IntersectionObserver untuk highlight section aktif. */
function ChapterTOC({ activeId, onJump }: { activeId: string; onJump: (id: string) => void }) {
  return (
    <nav aria-label="Daftar isi produk" className="sticky top-24 hidden lg:block">
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--tm-muted)]">
        Daftar Isi
      </p>
      <ul className="space-y-1">
        {CHAPTERS.map(ch => {
          const active = ch.id === activeId
          return (
            <li key={ch.id}>
              <button
                type="button"
                onClick={() => onJump(ch.id)}
                className={[
                  'group flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors',
                  active
                    ? 'bg-[var(--tm-surface-muted)] font-semibold text-[var(--tm-text-strong)]'
                    : 'text-[var(--tm-muted)] hover:bg-[var(--tm-surface-muted)] hover:text-[var(--tm-text)]',
                ].join(' ')}
              >
                <span
                  className={[
                    'h-px w-6 transition-all',
                    active ? 'w-10 bg-[var(--tm-primary)]' : 'bg-[var(--tm-border)] group-hover:bg-[var(--tm-muted)]',
                  ].join(' ')}
                  aria-hidden="true"
                />
                {ch.label}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default function ProductDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const product = useMemo(() => PRODUCTS.find((p) => p.slug === slug), [slug])
  useDocumentTitle(product?.name ?? 'Produk')

  const [activeId, setActiveId] = useState<string>(CHAPTERS[0].id)
  const observerRef = useRef<IntersectionObserver | null>(null)

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
            ← Kembali ke Catalog
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
      description={product.summary}
    >
      <div className="mb-6">
        <Link to="/catalog" className="text-sm font-semibold text-[var(--tm-muted)] hover:text-[var(--tm-text-strong)] transition-colors">
          ← Kembali ke Catalog
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[200px_minmax(0,1fr)]">
        <ChapterTOC activeId={activeId} onJump={jumpTo} />

        <div className="space-y-12">
          {/* Chapter: Overview */}
          <section id="overview" className="scroll-mt-24">
            <Reveal>
              <Card>
                <CardHeader>
                  <Badge variant="secondary" className="w-fit px-3 py-1 text-xs">Product Detail</Badge>
                  <CardTitle className="text-2xl">{product.name}</CardTitle>
                  <CardDescription>{product.summary}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {['Konsultasi', 'Instalasi', 'Maintenance'].map((item) => (
                      <Badge key={item} variant="outline">{item}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          </section>

          {/* Chapter: Preview */}
          <section id="preview" className="scroll-mt-24">
            <Reveal delay={0.05}>
              <Card className="overflow-hidden">
                <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
                  <div
                    className="grid h-full w-full place-items-center"
                    style={{
                      background:
                        'linear-gradient(135deg, var(--tm-primary) 0%, var(--tm-accent) 60%, var(--tm-footer) 100%)',
                    }}
                  >
                    <div className="flex flex-col items-center gap-3 px-6 text-center">
                      <div className="grid size-14 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur-sm">
                        <Move3d className="size-6 text-white" />
                      </div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/85">
                        3D experience coming soon
                      </p>
                      <p className="max-w-[28ch] text-sm leading-6 text-white/75">
                        Visualisasi interaktif sedang disiapkan ulang untuk pengalaman
                        produk yang lebih mendalam.
                      </p>
                    </div>
                  </div>
                  <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
                    <Sparkles className="size-3" />
                    Preview
                  </div>
                </div>
                <CardContent className="space-y-4 p-6">
                  <div className="rounded-md border border-dashed border-[var(--tm-border)] bg-[var(--tm-surface-muted)] p-4 text-sm text-[var(--tm-muted)]">
                    <p className="font-semibold text-[var(--tm-text-strong)]">Tentang preview 3D</p>
                    <ul className="mt-2 space-y-1 text-xs">
                      <li>- Visualisasi interaktif sedang disiapkan ulang</li>
                      <li>- Akan tersedia di update berikutnya</li>
                      <li>- Sementara, tim teknis dapat mengirim spesifikasi penuh</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          </section>

          {/* Chapter: Coverage */}
          <section id="coverage" className="scroll-mt-24">
            <Reveal>
              <Card>
                <CardHeader>
                  <div className="grid size-10 place-items-center rounded-md bg-[var(--tm-surface-muted)] text-[var(--tm-primary)]">
                    <Layers3 className="size-5" />
                  </div>
                  <CardTitle className="text-xl">Cakupan Layanan</CardTitle>
                  <CardDescription>Tahap demi tahap, sesuai standar.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm leading-6 text-[var(--tm-muted)]">
                    {product.bullets.map((b) => (
                      <li key={b} className="flex gap-2">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--tm-primary)]" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </Reveal>
          </section>

          {/* Chapter: Engineering */}
          <section id="engineering" className="scroll-mt-24">
            <Reveal>
              <Card>
                <CardHeader>
                  <div className="grid size-10 place-items-center rounded-md bg-[var(--tm-surface-muted)] text-[var(--tm-primary)]">
                    <ShieldCheck className="size-5" />
                  </div>
                  <CardTitle className="text-xl">Engineering & Standar</CardTitle>
                  <CardDescription>
                    Eksekusi mengacu pada standar lokal dan internasional yang berlaku.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-7 text-[var(--tm-muted)]">
                    Setiap proyek didukung dokumentasi teknis lengkap, commissioning,
                    serta uji fungsi sesuai standar HTM 02-01, NFPA 99, dan ISO 14644.
                    Tim kami menyediakan as-built drawing dan logbook maintenance untuk
                    kelancaran operasional jangka panjang.
                  </p>
                </CardContent>
              </Card>
            </Reveal>
          </section>

          {/* Chapter: CTA */}
          <section id="cta" className="scroll-mt-24">
            <Reveal>
              <Card>
                <CardHeader>
                  <div className="grid size-10 place-items-center rounded-md bg-[var(--tm-surface-muted)] text-[var(--tm-primary)]">
                    <Phone className="size-5" />
                  </div>
                  <CardTitle className="text-xl">Konsultasikan Kebutuhan Anda</CardTitle>
                  <CardDescription>
                    Tim teknis kami siap membantu dari survey awal hingga commissioning.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <a
                      href="mailto:teknomedindotimurpt@gmail.com?subject=Request%20Quotation"
                      className="inline-flex h-11 items-center justify-center rounded-md px-6 text-sm font-semibold transition-opacity hover:opacity-90"
                      style={{ backgroundColor: 'var(--tm-primary)', color: '#ffffff' }}
                    >
                      Request Quotation <ArrowRight className="ml-2 size-4" />
                    </a>
                    <Button variant="outline" onClick={() => navigate('/contact')}>
                      Konsultasi
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          </section>
        </div>
      </div>
    </Section>
  )
}
