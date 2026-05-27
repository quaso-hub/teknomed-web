import { ArrowRight, Package, Hammer, Gauge, Zap, Snowflake, Layers3, Stethoscope } from 'lucide-react'
import { FloatCard, Reveal } from '../components/Motion'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import Section from '../components/Section'
import { Badge } from '../components/ui/Badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'

const konstruksi = [
  { icon: Hammer,      title: 'Civil Work',          desc: 'Infrastruktur sipil yang melibatkan pondasi, struktur, dan koordinasi lapangan.' },
  { icon: Gauge,       title: 'Mechanical',          desc: 'Analisis, desain, manufaktur, dan pemeliharaan sistem mekanikal.' },
  { icon: Zap,         title: 'Electrical',          desc: 'Pemasangan, pemeliharaan, serta perbaikan sistem kelistrikan.' },
  { icon: Snowflake,   title: 'HVAC',                desc: 'Kontrol suhu, kelembapan, dan ventilasi untuk kenyamanan serta kesehatan.' },
  { icon: Layers3,     title: 'MOT',                 desc: 'Modular Operating Theatre, ICU, clean room, partisi, dan plafon modular.' },
  { icon: Stethoscope, title: 'Instalasi Gas Medis', desc: 'Pasokan, pengelolaan, dan kontrol gas medis untuk prosedur kesehatan.' },
]

const penjualan = [
  { title: 'Peralatan Mekanik', desc: 'Komponen utama untuk kebutuhan sistem mekanikal proyek.' },
  { title: 'Peralatan Mechanical', desc: 'Perangkat pendukung sistem mechanical fasilitas kesehatan.' },
  { title: 'Mesin', desc: 'Mesin pendukung proyek dan operasional fasilitas.' },
  { title: 'HVAC Equipment', desc: 'Perangkat tata udara dan komponen pendukungnya.' },
]

export default function Services() {
  useDocumentTitle('Layanan')
  return (
    <div>
      <Section
        eyebrow="Jasa layanan"
        title="Konstruksi & Penjualan"
        description="Layanan kami mencakup pekerjaan konstruksi MEP untuk fasilitas medis serta penjualan peralatan pendukung. Melayani area Jawa Timur, Bali, NTB, NTT, dan Sulawesi."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal>
            <Card className="h-full">
              <CardHeader>
                <div className="mb-2 flex flex-wrap gap-2">
                  <Badge variant="secondary" className="px-3 py-1 text-xs">Konstruksi</Badge>
                  <Badge variant="secondary" className="px-3 py-1 text-xs">Fasilitas Medis</Badge>
                </div>
                <CardTitle className="text-2xl">Jasa Konstruksi</CardTitle>
                <CardDescription>
                  Pekerjaan utama yang dikerjakan Teknomed untuk proyek fasilitas kesehatan.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                {konstruksi.map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex gap-3 rounded-md border border-[var(--tm-border)] bg-[var(--tm-surface-muted)] p-4">
                    <div className="grid size-9 shrink-0 place-items-center rounded-md bg-[var(--tm-surface-strong)] text-[var(--tm-primary)]">
                      <Icon className="size-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[var(--tm-text-strong)]">{title}</h3>
                      <p className="mt-1 text-xs leading-5 text-[var(--tm-muted)]">{desc}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </Reveal>

          <Reveal delay={0.1}>
            <Card className="h-full">
              <CardHeader>
                <div className="mb-2 flex flex-wrap gap-2">
                  <Badge variant="secondary" className="px-3 py-1 text-xs">Penjualan</Badge>
                  <Badge variant="secondary" className="px-3 py-1 text-xs">Catalog</Badge>
                </div>
                <CardTitle className="text-2xl">Jasa Penjualan</CardTitle>
                <CardDescription>
                  Layanan penjualan peralatan pendukung untuk proyek fasilitas kesehatan.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                {penjualan.map((item) => (
                  <div key={item.title} className="rounded-md border border-[var(--tm-border)] bg-[var(--tm-surface-muted)] p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[var(--tm-text-strong)]">
                      <Package className="size-4 text-[var(--tm-primary)]" /> {item.title}
                    </div>
                    <p className="text-xs leading-5 text-[var(--tm-muted)]">{item.desc}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </Reveal>
        </div>
      </Section>

      <Section
        eyebrow="Alur kerja"
        title="Proses yang terstruktur"
        description="Dari survey awal hingga serah terima dan maintenance, setiap tahap dikerjakan dengan koordinasi yang jelas."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { title: 'Survey & Brief', desc: 'Mengumpulkan kebutuhan proyek, scope pekerjaan, dan target timeline.' },
            { title: 'Design & Execution', desc: 'Pengembangan gambar kerja, eksekusi lapangan, dan koordinasi tim.' },
            { title: 'Handover & Maintain', desc: 'Serah terima, dokumentasi lengkap, dan maintenance berkala.' },
          ].map((step, index) => (
            <FloatCard key={step.title} className="h-full">
              <Card className="h-full">
                <CardContent className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--tm-muted)]">0{index + 1}</p>
                  <h3 className="mt-2 font-serif text-lg font-bold text-[var(--tm-text-strong)]">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--tm-muted)]">{step.desc}</p>
                </CardContent>
              </Card>
            </FloatCard>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section
        eyebrow="Tertarik?"
        title="Konsultasikan kebutuhan proyek Anda"
        description="Kami siap membantu dari perencanaan hingga maintenance."
      >
        <div
          className="overflow-hidden rounded-xl"
          style={{ background: 'linear-gradient(135deg, var(--tm-primary) 0%, var(--tm-accent) 60%, var(--tm-footer) 100%)' }}
        >
          <div className="flex flex-col gap-4 p-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl">
              <h2 className="text-xl font-bold text-white sm:text-2xl">
                Sedang mencari medical contractor yang berkualitas?
              </h2>
              <p className="mt-2 text-sm leading-6 text-white/75">
                Hubungi kami untuk diskusi kebutuhan proyek fasilitas kesehatan Anda.
              </p>
            </div>
            <a
              href="mailto:teknomedindotimurpt@gmail.com"
              className="inline-flex h-10 shrink-0 items-center justify-center rounded-md bg-white px-5 text-sm font-semibold text-[#043962] transition-colors hover:bg-white/90"
            >
              Hubungi Kami <ArrowRight className="ml-2 size-4" />
            </a>
          </div>
        </div>
      </Section>
    </div>
  )
}
