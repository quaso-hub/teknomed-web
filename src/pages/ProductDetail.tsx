import { ArrowRight, Move3d, Sparkles } from 'lucide-react'
import { useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Reveal } from '../components/Motion'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import Section from '../components/Section'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'

// 3D viewer dipause dulu - ganti placeholder.
// File Product3DViewer.tsx tetap ada di src/components/, tinggal di-wire ulang
// nanti setelah arah final 3D experience disepakati (lihat PLAN.md fase 4).

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

export default function ProductDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const product = useMemo(() => PRODUCTS.find((p) => p.slug === slug), [slug])
  useDocumentTitle(product?.name ?? 'Produk')

  return (
    <div>
      <Section
        eyebrow="Katalog"
        title={product?.name ?? 'Produk tidak ditemukan'}
        description={product?.summary ?? 'Produk dengan slug ini belum tersedia.'}
      >
        <div className="mb-6">
          <Link to="/catalog" className="text-sm font-semibold text-[var(--tm-muted)] hover:text-[var(--tm-text-strong)] transition-colors">
            ← Kembali ke Catalog
          </Link>
        </div>

        {!product ? (
          <Card>
            <CardContent className="p-8">
              <p className="text-sm text-[var(--tm-muted)]">Slug: <code className="font-mono text-[var(--tm-text-strong)]">{slug}</code></p>
              <Button className="mt-4" onClick={() => navigate('/catalog')}>
                Lihat Semua Produk
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-8 lg:grid-cols-2">
            <Reveal>
              <Card className="h-full">
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

                  <h2 className="mt-6 text-sm font-bold text-[var(--tm-text-strong)]">Cakupan Layanan</h2>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--tm-muted)]">
                    {product.bullets.map((b) => (
                      <li key={b} className="flex gap-2">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--tm-primary)]" />
                        {b}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <a href="mailto:teknomedindotimurpt@gmail.com?subject=Request%20Quotation" className="inline-flex h-10 items-center justify-center rounded-md px-5 text-sm font-semibold transition-opacity hover:opacity-90" style={{ backgroundColor: 'var(--tm-primary)', color: '#ffffff' }}>
                      Request Quotation <ArrowRight className="ml-2 size-4" />
                    </a>
                    <Button variant="outline" onClick={() => navigate('/contact')}>
                      Konsultasi
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Reveal>

            <Reveal delay={0.1}>
              <Card className="h-full overflow-hidden">
                <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
                  {/* Placeholder gradient panel - 3D viewer akan kembali setelah Phase 4 */}
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
                  <div className="flex items-center gap-2 text-sm font-semibold text-[var(--tm-text-strong)]">
                    <Sparkles className="size-4 text-[var(--tm-primary)]" />
                    Untuk model presisi vendor, hubungi tim teknis kami.
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          </div>
        )}
      </Section>
    </div>
  )
}
