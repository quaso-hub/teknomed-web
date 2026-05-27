import { useState, useEffect, useRef } from 'react'
import { ArrowRight, X, MapPin, Calendar, ChevronRight } from 'lucide-react'
import { Reveal, Stagger, StaggerItem, TiltCard, CharReveal, ClipReveal } from '../components/Motion'
import { motion, AnimatePresence } from 'motion/react'
import { useLenis } from 'lenis/react'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import Section from '../components/Section'
import Badge from '../components/ui/Badge'
import { Card, CardContent } from '../components/ui/Card'
import {
  PROJECTS, SCOPE_CATEGORIES, PROJECT_AREAS, PROJECT_STATS, PROJECT_CATEGORIES,
  type ProjectCategory, type Project,
} from '../data/projects'

export default function Projects() {
  useDocumentTitle('Proyek')
  const [activeFilter, setActiveFilter] = useState<ProjectCategory>('Semua')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const lenis = useLenis()

  const filtered = activeFilter === 'Semua'
    ? PROJECTS
    : PROJECTS.filter(p => p.category === activeFilter)

  useEffect(() => {
    if (!selectedProject) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedProject(null)
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    lenis?.stop()
    modalRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
      lenis?.start()
    }
  }, [selectedProject, lenis])

  return (
    <>
      <Section>
        {/* Header */}
        <div className="mb-12 text-center">
          <Reveal>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--tm-muted)]">Portofolio</p>
          </Reveal>
          <h1 className="mb-4 text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-[1.1] text-[var(--tm-text-strong)]">
            <CharReveal text="Portofolio Proyek" />
          </h1>
          <ClipReveal delay={0.3}>
            <p className="mx-auto max-w-[640px] text-lg text-[var(--tm-muted)]">
              Proyek konstruksi fasilitas kesehatan yang telah kami selesaikan di Jawa Timur, Bali, NTB, NTT, dan Sulawesi.
            </p>
          </ClipReveal>
        </div>

        {/* Stats Bar */}
        <Reveal>
          <div className="mb-8 grid gap-6 rounded-2xl border border-[var(--tm-border)] bg-[var(--tm-surface)] p-8 [grid-template-columns:repeat(auto-fit,minmax(160px,1fr))]">
            {PROJECT_STATS.map(stat => (
              <div key={stat.label} className="text-center">
                <div className="mb-2 flex items-center justify-center gap-2 text-[var(--tm-primary)]">
                  <stat.icon size={20} />
                </div>
                <div className="text-[1.75rem] font-bold text-[var(--tm-text-strong)]">{stat.getValue()}</div>
                <div className="text-sm text-[var(--tm-muted)]">{stat.label}</div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Scope Categories */}
        <Reveal>
          <div className="mb-6">
            <h2 className="mb-3 text-base font-semibold text-[var(--tm-text-strong)]">
              Lingkup Pekerjaan
            </h2>
            <div className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]">
              {SCOPE_CATEGORIES.map(({ label, icon: Icon, count }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-[0.625rem] border border-[var(--tm-border)] bg-[var(--tm-surface)] px-4 py-3.5"
                >
                  <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-[var(--tm-surface-muted)] text-[var(--tm-primary)]">
                    <Icon size={18} />
                  </div>
                  <div>
                    <div className="text-[0.8rem] font-semibold text-[var(--tm-text-strong)]">{label}</div>
                    <div className="text-[0.7rem] text-[var(--tm-muted)]">{count} proyek</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Area Coverage */}
        <Reveal>
          <div className="mb-10">
            <h2 className="mb-3 text-base font-semibold text-[var(--tm-text-strong)]">
              Area Layanan
            </h2>
            <div className="flex flex-wrap gap-2">
              {PROJECT_AREAS.map(area => (
                <span
                  key={area}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--tm-border)] bg-[var(--tm-surface)] px-4 py-2 text-[0.8rem] font-medium text-[var(--tm-text)]"
                >
                  <MapPin size={12} className="text-[var(--tm-primary)]" />
                  {area}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Filter Tabs */}
        <Reveal>
          <div className="mb-10 flex justify-center">
            <div className="relative inline-flex rounded-xl bg-[var(--tm-surface-muted)] p-1">
              {PROJECT_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={[
                    'relative z-[1] rounded-lg border-0 bg-transparent px-6 py-2.5 text-[0.9rem] font-semibold transition-colors cursor-pointer',
                    activeFilter === cat ? 'text-white' : 'text-[var(--tm-muted)]',
                  ].join(' ')}
                >
                  {cat}
                  {activeFilter === cat && (
                    <motion.div
                      layoutId="filter-indicator"
                      className="absolute inset-0 -z-[1] rounded-lg bg-[var(--tm-primary)]"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Project Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Stagger>
              <div className="grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(340px,1fr))]">
                {filtered.map((project, idx) => (
                  <StaggerItem key={project.id}>
                    <TiltCard className="h-full">
                      <Card
                        className="group h-full cursor-pointer border border-[var(--tm-border)] bg-[var(--tm-surface)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]"
                        onClick={() => setSelectedProject(project)}
                      >
                        <CardContent className="flex h-full flex-col p-6">
                          <div className="mb-4 flex items-center justify-between">
                            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--tm-muted)]">
                              PRJ {String(project.year).slice(-2)}·{String(idx + 1).padStart(2, '0')}
                            </span>
                            <Badge>{project.category}</Badge>
                          </div>

                          <h3 className="mb-1 text-xl font-bold text-[var(--tm-text-strong)]">
                            {project.title}
                          </h3>

                          <div className="mb-2 flex items-center gap-1.5 text-sm text-[var(--tm-muted)]">
                            <MapPin size={14} />
                            <span>{project.subtitle}</span>
                          </div>

                          <div className="mb-3 flex items-center gap-3">
                            <span className="flex items-center gap-1 text-[0.8rem] text-[var(--tm-muted)]">
                              <Calendar size={13} /> {project.year}
                            </span>
                            <span className="flex items-center gap-1 text-[0.8rem] text-[var(--tm-muted)]">
                              <MapPin size={13} /> {project.area}
                            </span>
                          </div>

                          <p className="mb-4 text-[0.9rem] font-medium italic leading-6 text-[var(--tm-primary)]">
                            &ldquo;{project.highlight}&rdquo;
                          </p>

                          <div className="mb-5 flex flex-wrap gap-1.5">
                            {project.tags.map(tag => (
                              <span key={tag} className="rounded-md bg-[var(--tm-surface-muted)] px-2 py-1 text-xs font-medium text-[var(--tm-text)]">
                                {tag}
                              </span>
                            ))}
                          </div>

                          <div className="mt-auto">
                            <button className="inline-flex cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0 text-sm font-semibold text-[var(--tm-primary)]">
                              Lihat Detail <ChevronRight size={16} />
                            </button>
                          </div>
                        </CardContent>
                      </Card>
                    </TiltCard>
                  </StaggerItem>
                ))}
              </div>
            </Stagger>

            {filtered.length === 0 && (
              <div className="px-4 py-16 text-center text-[var(--tm-muted)]">
                <p className="text-lg">Belum ada proyek di kategori ini.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </Section>

      {/* Bottom CTA */}
      <Section>
        <Reveal>
          <div
            className="rounded-2xl px-8 py-12 text-center text-white"
            style={{ background: 'linear-gradient(135deg, var(--tm-primary) 0%, var(--tm-accent) 60%, var(--tm-footer) 100%)' }}
          >
            <h2 className="mb-4 text-[clamp(1.5rem,3vw,2.25rem)] font-bold text-white">
              Punya Proyek Serupa?
            </h2>
            <p className="mx-auto mb-6 max-w-[480px] text-base text-white/90">
              Konsultasikan kebutuhan fasilitas kesehatan Anda bersama tim ahli kami.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-3.5 text-[0.95rem] font-bold text-[#043962] no-underline"
            >
              Hubungi Kami <ArrowRight size={18} />
            </a>
          </div>
        </Reveal>
      </Section>

      {/* Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSelectedProject(null)}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            aria-modal="true"
            aria-label={`Detail proyek: ${selectedProject.title}`}
            role="dialog"
          >
            <motion.div
              ref={modalRef}
              tabIndex={-1}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={e => e.stopPropagation()}
              className="relative w-full max-w-[680px] max-h-[90vh] overflow-y-auto rounded-2xl border border-[var(--tm-border)] bg-[var(--tm-surface)]"
            >
              {/* Hero photo */}
              <div className="relative h-[220px] overflow-hidden rounded-t-2xl">
                <img
                  src={selectedProject.imageUrl}
                  alt={selectedProject.title}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-5 right-12">
                  <div className="mb-2 flex gap-2">
                    <Badge>{selectedProject.category}</Badge>
                    <Badge variant="outline" className="border-white/40 bg-white/10 text-white">{selectedProject.area}</Badge>
                  </div>
                  <h2 className="m-0 text-[1.375rem] font-bold leading-snug text-white">
                    {selectedProject.title}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  aria-label="Tutup modal"
                  className="absolute right-3 top-3 grid size-8 cursor-pointer place-items-center rounded-full border-0 bg-black/50 text-white"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-5 flex flex-wrap gap-4 text-sm text-[var(--tm-muted)]">
                  <span className="flex items-center gap-1">
                    <MapPin size={14} /> {selectedProject.subtitle}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} /> {selectedProject.year}
                  </span>
                </div>

                <div className="mb-5 rounded-lg border-l-[3px] border-l-[var(--tm-primary)] bg-[var(--tm-surface-muted)] px-4 py-3.5">
                  <p className="m-0 text-[0.9rem] font-medium italic text-[var(--tm-primary)]">
                    &ldquo;{selectedProject.highlight}&rdquo;
                  </p>
                </div>

                <h3 className="mb-2.5 text-sm font-semibold uppercase tracking-[0.05em] text-[var(--tm-text-strong)]">
                  Lingkup Pekerjaan
                </h3>
                <ul className="m-0 mb-5 grid gap-1.5 p-0 [list-style:none] [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
                  {selectedProject.scope.map(item => (
                    <li key={item} className="flex items-start gap-2 text-sm text-[var(--tm-text)]">
                      <ChevronRight size={15} className="mt-0.5 shrink-0 text-[var(--tm-primary)]" />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mb-6 flex flex-wrap gap-1.5">
                  {selectedProject.tags.map(tag => (
                    <span key={tag} className="rounded-full bg-[var(--tm-surface-muted)] px-2.5 py-1 text-xs font-medium text-[var(--tm-text)]">
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="mb-2.5 text-sm font-semibold uppercase tracking-[0.05em] text-[var(--tm-text-strong)]">
                  Lokasi Proyek
                </h3>
                <div data-lenis-prevent className="mb-6 overflow-hidden rounded-[0.625rem] border border-[var(--tm-border)]">
                  <iframe
                    title={`Lokasi ${selectedProject.title}`}
                    src={`https://maps.google.com/maps?q=${selectedProject.mapQuery}&output=embed&z=14`}
                    width="100%"
                    height="200"
                    className="map-iframe block border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <div className="flex gap-3">
                  <a
                    href="/contact"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[var(--tm-primary)] px-5 py-3 text-sm font-semibold text-white no-underline"
                  >
                    Diskusikan Proyek Serupa <ArrowRight size={15} />
                  </a>
                  <a
                    href={`https://maps.google.com/?q=${selectedProject.mapQuery}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--tm-border)] bg-[var(--tm-surface)] px-4 py-3 text-sm font-medium text-[var(--tm-text)] no-underline"
                  >
                    <MapPin size={15} /> Maps
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
