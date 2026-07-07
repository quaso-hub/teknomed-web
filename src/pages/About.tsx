import { ClipboardList, ShieldCheck, Compass, FileCheck2, Users } from 'lucide-react'
import { FloatCard, Stagger, StaggerItem3D, CharReveal, ClipReveal, DepthReveal } from '../components/Motion'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import Section from '../components/Section'
import { Badge, badgeVariants } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card'

const whyUs = [
  { icon: ClipboardList, title: 'SDM Profesional', desc: 'Tenaga ahli berpengalaman di bidang MEP, gas medis, dan konstruksi fasilitas kesehatan.' },
  { icon: Users,         title: 'Fokus Kepuasan Klien', desc: 'Komunikasi jelas, koordinasi terstruktur, dan service terkontrol dari awal hingga selesai.' },
  { icon: ShieldCheck,   title: 'Aman & Tepat Waktu', desc: 'Mengutamakan keselamatan kerja, kerapian hasil, dan delivery konsisten sesuai timeline.' },
]

const misi = [
  'Memberikan pelayanan jasa terbaik secara profesional, sistematis, dan berintegrasi.',
  'Meningkatkan sumber daya manusia yang kompeten dan berdedikasi.',
  'Meningkatkan kepatuhan dan tata kelola perusahaan yang baik.',
  'Meningkatkan keselamatan, kesehatan, dan lingkungan kerja.',
]

export default function About() {
  useDocumentTitle('Tentang Kami')
  return (
    <div>
      <Section
        eyebrow="Tentang kami"
        title="PT Teknomed Indo Timur"
        description="Medical contractor yang berdiri sejak 2021, berfokus pada konstruksi MEP, tata udara, instalasi gas medis, MOT, dan maintenance untuk fasilitas kesehatan di Indonesia Timur."
      >
        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <DepthReveal>
            <Card className="float-shadow">
              <CardHeader>
                <div className="flex flex-wrap gap-2">
                  {['Medical Contractor', 'MEP', 'HVAC', 'Gas Medis', 'MOT'].map((item) => (
                    <Badge key={item} variant="secondary" className="px-3 py-1 text-xs chip-hover">{item}</Badge>
                  ))}
                </div>
                <CardTitle className="text-2xl">
                  <CharReveal text="Pelayanan Paripurna" />
                </CardTitle>
                <CardDescription>Kami hadir untuk memberikan service yang paripurna, didukung tenaga ahli yang profesional dan berpengalaman.</CardDescription>
              </CardHeader>
              <ClipReveal delay={0.1}>
                <CardContent className="space-y-4 text-sm leading-6 text-[var(--tm-muted)]">
                  <p>
                    PT Teknomed Indo Timur berdiri sejak 2021 dengan fokus utama pada konstruksi fasilitas kesehatan di wilayah Indonesia Timur. Kami melayani pekerjaan MEP, tata udara (HVAC), instalasi gas medis, Modular Operating Theatre (MOT), serta maintenance berkala.
                  </p>
                  <p>
                    Orientasi kerja kami bukan sekadar menyelesaikan pekerjaan, tetapi memastikan hasilnya aman, rapi, dan mudah dipelihara untuk jangka panjang. Area layanan kami mencakup Jawa Timur, Bali, NTB, NTT, dan Sulawesi.
                  </p>
                </CardContent>
              </ClipReveal>
            </Card>
          </DepthReveal>

          <DepthReveal delay={0.15}>
            <Card className="h-full overflow-hidden float-shadow">
              <CardHeader
                className="relative rounded-t-lg overflow-hidden animated-gradient"
                style={{
                  background: 'linear-gradient(135deg, var(--tm-primary), var(--tm-accent))',
                  backgroundSize: '300% 300%',
                }}
              >
                <div className="absolute inset-0 noise opacity-[0.04]" />
                <div
                  className="orb-float absolute -top-10 -right-10 size-40 rounded-full opacity-20 blur-2xl pointer-events-none"
                  style={{ background: 'var(--tm-secondary)' }}
                />
                <CardTitle className="relative text-2xl text-white z-10">Mengapa Harus Kami?</CardTitle>
                <CardDescription className="relative text-white/75 z-10">
                  Alasan utama klien memilih Teknomed untuk proyek fasilitas kesehatan.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 p-6">
                <Stagger>
                  {whyUs.map(({ icon: Icon, title, desc }) => (
                    <StaggerItem3D key={title}>
                      <div className="flex gap-3 rounded-md border border-[var(--tm-border)] bg-[var(--tm-surface-muted)] p-4 hover:border-[var(--tm-primary)] transition-colors duration-300">
                        <div
                          className="grid size-10 shrink-0 place-items-center rounded-md bg-[var(--tm-surface-strong)]"
                          style={{ color: 'var(--tm-primary)' }}
                        >
                          <Icon className="size-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-[var(--tm-text-strong)]">{title}</h3>
                          <p className="mt-1 text-sm leading-6 text-[var(--tm-muted)]">{desc}</p>
                        </div>
                      </div>
                    </StaggerItem3D>
                  ))}
                </Stagger>
              </CardContent>
            </Card>
          </DepthReveal>
        </div>
      </Section>

      <Section
        eyebrow="Visi & misi"
        title="Arah perusahaan yang jelas"
        description="Visi dan misi menjadi fondasi setiap keputusan dan langkah kerja kami."
      >
        <Stagger className="grid gap-6 md:grid-cols-2">
          <StaggerItem3D>
            <FloatCard>
              <Card className="h-full">
                <CardHeader>
                  <div
                    className="grid size-10 place-items-center rounded-md bg-[var(--tm-surface-muted)]"
                    style={{ color: 'var(--tm-primary)' }}
                  >
                    <Compass className="size-5" />
                  </div>
                  <CardTitle className="text-xl">Visi</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-7 text-[var(--tm-muted)]">
                    Menjadi perusahaan yang unggul, berinovasi, dan terdepan di bidang konstruksi MEP, Tata Udara, Instalasi Gas Medis, MOT, pemasangan mesin, serta pemeliharaan fasilitas kesehatan.
                  </p>
                </CardContent>
              </Card>
            </FloatCard>
          </StaggerItem3D>

          <StaggerItem3D>
            <FloatCard>
              <Card className="h-full">
                <CardHeader>
                  <div
                    className="grid size-10 place-items-center rounded-md bg-[var(--tm-surface-muted)]"
                    style={{ color: 'var(--tm-primary)' }}
                  >
                    <FileCheck2 className="size-5" />
                  </div>
                  <CardTitle className="text-xl">Misi</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm leading-6 text-[var(--tm-muted)]">
                    {misi.map((item) => (
                      <li key={item} className="flex gap-2">
                        <ShieldCheck className="mt-0.5 size-4 shrink-0" style={{ color: 'var(--tm-primary)' }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </FloatCard>
          </StaggerItem3D>
        </Stagger>
      </Section>
    </div>
  )
}
