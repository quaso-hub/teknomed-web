import {
  ArrowRight, Building2, Hospital,
  Stethoscope, Snowflake, Zap, Layers3, Gauge, Hammer,
  CheckCircle2, TrendingUp, Award
} from 'lucide-react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useNavigate, Link } from 'react-router-dom'
import { useRef } from 'react'
import { AmbientIcons } from '../components/AmbientIcons'
import {
  Counter, FloatCard, MagneticWrap, Reveal,
  Stagger, StaggerItem, SpotlightSection,
  CharReveal, ClipReveal, ScaleReveal, MarqueeTrack,
} from '../components/Motion'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardFooter, CardHeader } from '../components/ui/Card'
import { SITE } from '../config/site'
import { HOME_STATS } from '../data/stats'

const services = [
  {
    icon: Hammer,
    title: 'Civil Work',
    desc: 'Infrastruktur sipil, pondasi, dan koordinasi lapangan untuk fasilitas kesehatan.',
    color: 'oklch(55% 0.18 220)',
    to: '/services',
  },
  {
    icon: Zap,
    title: 'Electrical',
    desc: 'Pemasangan, pemeliharaan, dan perbaikan sistem kelistrikan rumah sakit.',
    color: 'oklch(65% 0.2 90)',
    to: '/services',
  },
  {
    icon: Layers3,
    title: 'MOT',
    desc: 'Modular Operating Theatre, ICU, clean room, partisi, dan plafon modular.',
    color: 'oklch(55% 0.2 300)',
    to: '/catalog/mot',
  },
  {
    icon: Gauge,
    title: 'Mechanical',
    desc: 'Analisis, desain, manufaktur, dan pemeliharaan sistem mekanikal.',
    color: 'oklch(55% 0.18 160)',
    to: '/services',
  },
  {
    icon: Snowflake,
    title: 'HVAC',
    desc: 'Kontrol suhu, kelembapan, dan ventilasi untuk kenyamanan serta kesehatan.',
    color: 'oklch(60% 0.18 200)',
    to: '/catalog/hvac-cleanroom',
  },
  {
    icon: Stethoscope,
    title: 'Gas Medis',
    desc: 'Pasokan, pengelolaan, dan kontrol gas medis untuk prosedur kesehatan.',
    color: 'oklch(55% 0.2 10)',
    to: '/catalog/mgps',
  },
]

const highlights = [
  { icon: CheckCircle2, text: 'Standar HTM 02-01 & NFPA 99' },
  { icon: TrendingUp, text: 'Berpengalaman di 5 area' },
  { icon: Award, text: 'Sertifikasi & dokumentasi lengkap' },
]

export default function Home() {
  const reduced = useReducedMotion()
  const navigate = useNavigate()
  const heroRef = useRef<HTMLDivElement>(null)
  useDocumentTitle()

  // Subtle parallax on hero content as user scrolls
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const heroY = useTransform(heroScroll, [0, 1], ['0%', '20%'])
  const heroOpacity = useTransform(heroScroll, [0, 0.6], [1, 0])

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <SpotlightSection className="relative overflow-hidden" ref={heroRef}>
        {/* Animated background orbs */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          {/* Base gradient */}
          <div
            className="absolute inset-0 animated-gradient"
            style={{
              background: [
                'radial-gradient(ellipse 80% 60% at 15% 15%, color-mix(in srgb, var(--tm-primary) 12%, transparent), transparent 60%)',
                'radial-gradient(ellipse 60% 60% at 85% 80%, color-mix(in srgb, var(--tm-accent) 8%, transparent), transparent 60%)',
                'var(--tm-page)',
              ].join(', '),
            }}
          />
          {/* Grid */}
          <div className="absolute inset-0 hero-grid" />
          {/* Vignette */}
          <div className="vignette absolute inset-0" />
          {/* Ambient medical/MEP icons - parallax on scroll */}
          <AmbientIcons containerRef={heroRef} />
          {/* Floating orbs */}
          <div
            className="orb-float absolute -top-32 -left-32 size-96 rounded-full opacity-30 blur-3xl pointer-events-none"
            style={{ background: 'color-mix(in srgb, var(--tm-primary) 35%, transparent)' }}
          />
          <div
            className="orb-float-delay absolute top-1/2 -right-24 size-72 rounded-full opacity-20 blur-3xl pointer-events-none"
            style={{ background: 'color-mix(in srgb, var(--tm-accent) 40%, transparent)' }}
          />
          <div
            className="orb-float absolute bottom-0 left-1/3 size-64 rounded-full opacity-15 blur-3xl pointer-events-none"
            style={{ background: 'color-mix(in srgb, var(--tm-secondary) 50%, transparent)', animationDelay: '-5s' }}
          />
        </div>

        <motion.div
          style={reduced ? undefined : { y: heroY, opacity: heroOpacity }}
          className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:px-8 lg:py-28"
        >
          {/* Left: copy */}
          <div className="flex flex-col justify-center">
            <Reveal>
              <Badge variant="secondary" className="w-fit px-3 py-1 text-xs tracking-widest uppercase gap-1.5 mb-4">
                <span className="size-1.5 rounded-full bg-emerald-400 soft-pulse" />
                Medical Contractor
              </Badge>
            </Reveal>

            {/* H1 with CharReveal + NRG text wipe */}
            <h1 className="font-serif text-4xl font-bold tracking-tight text-[var(--tm-text-strong)] sm:text-5xl lg:text-[3.5rem] lg:leading-[1.1]">
              <span className="block pb-1">
                <CharReveal text="PT Teknomed" delay={0.1} />
              </span>
              <span className="block text-wipe">
                <CharReveal text="Indo Timur" delay={0.4} />
              </span>
            </h1>

            {/* Tagline with ClipReveal */}
            <ClipReveal delay={0.7} className="mt-5 max-w-xl">
              <p className="text-base leading-7 text-[var(--tm-muted)] sm:text-lg">
                Konstruksi fasilitas kesehatan: MEP, instalasi gas medis, tata udara,
                Modular Operating Theatre, dan maintenance yang aman serta profesional.
              </p>
            </ClipReveal>

            {/* Highlights - stagger from left */}
            <motion.div
              className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap"
              initial={reduced ? false : 'hidden'}
              animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.9 } } }}
            >
              {highlights.map(({ icon: Icon, text }) => (
                <motion.span
                  key={text}
                  className="flex items-center gap-1.5 text-sm text-[var(--tm-muted)]"
                  variants={reduced ? {} : {
                    hidden: { opacity: 0, x: -16 },
                    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
                  }}
                >
                  <Icon className="size-4 text-[var(--tm-accent)] shrink-0" />
                  {text}
                </motion.span>
              ))}
            </motion.div>

            {/* CTA — EatNaked glassmorphism style */}
            <Reveal delay={1.1} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <MagneticWrap strength={0.4}>
                <a
                  href={`mailto:${SITE.contact.email}`}
                  className="cta-glass inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Hubungi Kami <ArrowRight className="ml-2 size-4" />
                </a>
              </MagneticWrap>
              <Button variant="outline" className="px-6 py-3 hover:-translate-y-0.5 transition-transform duration-300" onClick={() => navigate('/services')}>
                Lihat Layanan
              </Button>
            </Reveal>

            {/* Stats - bento grid */}
            <ScaleReveal delay={0.2} className="mt-10">
              <div className="grid grid-cols-3 gap-3">
                {HOME_STATS.map(({ value, suffix, label, icon: Icon, sub }) => (
                  <FloatCard key={label} className="h-full">
                    <Card className="h-full card-shine">
                      <CardContent className="p-4">
                        <div
                          className="grid size-9 place-items-center rounded-md mb-2"
                          style={{
                            backgroundColor: 'color-mix(in srgb, var(--tm-primary) 12%, transparent)',
                            color: 'var(--tm-primary)',
                          }}
                        >
                          <Icon className="size-4" />
                        </div>
                        <div className="text-2xl font-bold tabular-nums text-[var(--tm-text-strong)]">
                          <Counter to={value} suffix={suffix} />
                        </div>
                        <p className="mt-0.5 text-xs font-semibold text-[var(--tm-text)]">{label}</p>
                        <p className="text-[0.65rem] text-[var(--tm-muted)]">{sub}</p>
                      </CardContent>
                    </Card>
                  </FloatCard>
                ))}
              </div>
            </ScaleReveal>
          </div>

          {/* Right: animated visual card — Vaonis perspective depth */}
          <ScaleReveal delay={0.3} className="h-full">
            <Card className="overflow-hidden h-full perspective-card shadow-depth gradient-border">
              <CardHeader className="p-0">
                {/* Animated mesh gradient background */}
                <div
                  className="relative grid aspect-[4/3] place-items-center rounded-t-lg overflow-hidden animated-gradient"
                  style={{
                    background: [
                      `radial-gradient(ellipse at 20% 50%, color-mix(in srgb, var(--tm-primary) 80%, var(--tm-accent)) 0%`,
                      `color-mix(in srgb, var(--tm-secondary) 60%, var(--tm-primary)) 50%`,
                      `var(--tm-accent) 100%)`,
                    ].join(', '),
                    backgroundSize: '300% 300%',
                  }}
                >
                  {/* Noise overlay */}
                  <div className="absolute inset-0 noise opacity-[0.04]" />

                  {/* Floating orbs inside card */}
                  <div className="orb-float absolute top-4 right-4 size-24 rounded-full opacity-20"
                    style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)' }} />
                  <div className="orb-float-delay absolute bottom-6 left-6 size-16 rounded-full opacity-15"
                    style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)' }} />

                  <div className="relative max-w-md space-y-3 text-center z-10 px-6">
                    <motion.div
                      animate={reduced ? undefined : { y: [0, -8, 0] }}
                      transition={reduced ? undefined : { duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                      className="mx-auto grid size-16 place-items-center rounded-2xl bg-white/10 text-white ring-1 ring-white/20 backdrop-blur-sm"
                    >
                      <Hospital className="size-7" />
                    </motion.div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                      Modern Medical Construction
                    </p>
                    <h2 className="font-serif text-2xl font-bold text-white sm:text-3xl">
                      Fasilitas kesehatan, dieksekusi lebih baik.
                    </h2>
                    <p className="text-sm text-white/70">
                      Dari perencanaan hingga maintenance, kami pastikan fasilitas Anda aman dan siap beroperasi.
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 p-6">
                <div className="flex flex-wrap gap-2">
                  {['MEP', 'Gas Medis', 'HVAC', 'MOT', 'Maintenance'].map((item) => (
                    <Badge key={item} variant="outline" className="chip-hover">{item}</Badge>
                  ))}
                </div>
                <p className="text-sm leading-6 text-[var(--tm-muted)]">
                  Tenaga ahli berpengalaman dengan orientasi kerja yang mengutamakan keamanan,
                  kerapian, dan kemudahan pemeliharaan jangka panjang.
                </p>
              </CardContent>

              <CardFooter className="flex items-center justify-between p-6 pt-0">
                <p className="text-xs text-[var(--tm-muted)]">Berdiri sejak {SITE.founded}</p>
                <Button variant="ghost" size="sm" className="gap-1 px-2" onClick={() => navigate('/about')}>
                  Tentang Kami <ArrowRight className="size-4" />
                </Button>
              </CardFooter>
            </Card>
          </ScaleReveal>
        </motion.div>
      </SpotlightSection>

      {/* ── Services - responsive grid ───────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <Reveal>
          <div className="mb-8 max-w-2xl">
            <Badge variant="secondary" className="text-xs tracking-widest uppercase mb-3">Jasa layanan</Badge>
            <h2 className="font-serif text-2xl font-bold text-[var(--tm-text-strong)] sm:text-3xl">
              Melayani konstruksi fasilitas kesehatan
            </h2>
            <p className="mt-2 text-sm text-[var(--tm-muted)]">
              Layanan inti untuk kebutuhan MEP, tata udara, gas medis, dan ruang operasi modular.
            </p>
          </div>
        </Reveal>

        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(({ icon: Icon, title, desc, color, to }, index) => (
            <StaggerItem key={title}>
              <Link to={to} className="block h-full no-underline">
                <Card className="group h-full card-shine float-shadow transition-colors duration-300 hover:border-[var(--tm-primary)]">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div
                        className="grid size-12 place-items-center rounded-xl"
                        style={{ background: `color-mix(in srgb, ${color} 15%, var(--tm-surface-muted))`, color }}
                      >
                        <Icon className="size-6" />
                      </div>
                      <span
                        className="service-num text-3xl font-bold opacity-10 group-hover:opacity-20 transition-opacity"
                        style={{ color }}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[var(--tm-text-strong)]">{title}</h3>
                      <p className="mt-2 text-sm leading-6 text-[var(--tm-muted)]">{desc}</p>
                    </div>
                    <div
                      className="flex items-center gap-1.5 text-xs font-semibold group-hover:gap-2 transition-all"
                      style={{ color: 'var(--tm-primary)' }}
                    >
                      Lihat detail <ArrowRight className="size-3" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      {/* ── Area Coverage Marquee ────────────────────────────────────────────── */}
      <Reveal>
        <div
          className="py-5 border-y border-[var(--tm-border)] overflow-hidden"
          style={{ backgroundColor: 'var(--tm-surface)' }}
        >
          <MarqueeTrack speed={25} className="gap-10">
            {[...SITE.serviceAreas, ...SITE.serviceAreas].map((area, i) => (
              <div key={i} className="flex items-center gap-3 shrink-0">
                <span
                  className="size-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: 'var(--tm-primary)' }}
                />
                <span className="text-sm font-semibold text-[var(--tm-text-strong)] whitespace-nowrap">{area}</span>
              </div>
            ))}
          </MarqueeTrack>
        </div>
      </Reveal>

      {/* ── Projects teaser ──────────────────────────────────────────────────── */}
      <Reveal>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div
            className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl p-5"
            style={{ background: 'var(--tm-surface)', border: '1px solid var(--tm-border)' }}
          >
            <div className="flex items-center gap-3">
              <div
                className="grid size-10 place-items-center rounded-lg"
                style={{ background: 'color-mix(in srgb, var(--tm-primary) 10%, transparent)', color: 'var(--tm-primary)' }}
              >
                <Building2 className="size-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--tm-text-strong)]">Portofolio Proyek</p>
                <p className="text-xs text-[var(--tm-muted)]">6+ proyek selesai di seluruh Indonesia Timur</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/projects')} className="shrink-0">
              Lihat Semua Proyek <ArrowRight className="size-4 ml-1" />
            </Button>
          </div>
        </div>
      </Reveal>

      {/* ── CTA ─────────────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <ClipReveal direction="up">
          <div
            className="relative overflow-hidden rounded-2xl animated-gradient"
            style={{
              background: `linear-gradient(135deg, var(--tm-primary) 0%, var(--tm-accent) 50%, color-mix(in srgb, var(--tm-secondary) 50%, var(--tm-primary)) 100%)`,
              backgroundSize: '300% 300%',
            }}
          >
            <div className="noise absolute inset-0 opacity-[0.04]" />
            <div
              className="orb-float absolute -top-16 -right-16 size-64 rounded-full opacity-20 blur-3xl pointer-events-none"
              style={{ background: 'var(--tm-secondary)' }}
            />
            <div
              className="orb-float-delay absolute -bottom-12 -left-12 size-48 rounded-full opacity-15 blur-3xl pointer-events-none"
              style={{ background: 'var(--tm-accent)' }}
            />

            <div className="relative flex flex-col gap-6 p-8 sm:flex-row sm:items-center sm:justify-between lg:p-12">
              <div className="max-w-xl">
                <p className="text-xs font-semibold uppercase tracking-widest text-white/60">Siap berdiskusi</p>
                <h2 className="mt-3 font-serif text-2xl font-bold text-white sm:text-3xl">
                  Butuh medical contractor untuk proyek Anda?
                </h2>
                <p className="mt-3 text-sm leading-6 text-white/70">
                  Dari survey awal hingga serah terima, kami siap mendampingi setiap tahap proyek
                  fasilitas kesehatan Anda.
                </p>
              </div>
              <div className="flex flex-col gap-3 shrink-0">
                <MagneticWrap strength={0.2}>
                  <a
                    href={`mailto:${SITE.contact.email}`}
                    className="inline-flex h-12 items-center justify-center rounded-lg px-6 text-sm font-semibold transition-all hover:opacity-90 hover:shadow-lg"
                    style={{ backgroundColor: 'var(--tm-pill-bg)', color: 'var(--tm-pill-fg)' }}
                  >
                    Hubungi Kami <ArrowRight className="ml-2 size-4" />
                  </a>
                </MagneticWrap>
                <a
                  href={SITE.contact.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 items-center justify-center rounded-lg px-6 text-sm font-medium text-white/80 ring-1 ring-white/20 hover:bg-white/10 transition-all"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </ClipReveal>
      </div>
    </div>
  )
}
