import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { ArrowRight, X, MapPin, Calendar, ChevronRight } from 'lucide-react'
import { Reveal, Stagger, StaggerItem3D, TiltCard, CharReveal, ClipReveal } from '../components/Motion'
import { motion, AnimatePresence } from 'motion/react'
import { useLenis } from 'lenis/react'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import Section from '../components/Section'
import Badge from '../components/ui/Badge'
import { Card, CardContent } from '../components/ui/Card'
import {
  PROJECTS, PROJECT_AREAS, PROJECT_STATS, PROJECT_CATEGORIES,
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
    lenis?.stop()
    document.body.style.overflow = 'hidden'
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
        {/* Header - Digitalists editorial style */}
        <div className="mb-12">
          <Reveal>
            <p className="mb-3 font-mono text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-[var(--tm-muted)]">
              PRJ / Portofolio
            </p>
          </Reveal>
          <h1 className="mb-4 text-[clamp(2.2rem,5vw,3.75rem)] font-extrabold leading-[1.05] tracking-tight text-[var(--tm-text-strong)]">
            <CharReveal text="Portofolio" delay={0.05} />
            <span className="block text-[var(--tm-primary)]">
              <CharReveal text="Proyek" delay={0.2} />
            </span>
          </h1>
          <ClipReveal delay={0.4}>
            <p className="max-w-[560px] text-base leading-7 text-[var(--tm-muted)]">
              Konstruksi fasilitas kesehatan di Jawa Timur, Bali, NTB, NTT, dan Sulawesi.
            </p>
          </ClipReveal>
        </div>

        {/* Stats Bar - compact */}
        <Reveal>
          <div className="mb-10 grid gap-px rounded-xl border border-[var(--tm-border)] bg-[var(--tm-border)] overflow-hidden [grid-template-columns:repeat(auto-fit,minmax(120px,1fr))]">
            {PROJECT_STATS.map(stat => (
              <div key={stat.label} className="flex flex-col items-center justify-center gap-1 bg-[var(--tm-surface)] px-4 py-5 text-center">
                <stat.icon size={16} className="text-[var(--tm-primary)] mb-1" />
                <div className="text-2xl font-bold tabular-nums text-[var(--tm-text-strong)]">{stat.getValue()}</div>
                <div className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-[var(--tm-muted)]">{stat.label}</div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Area pills - centered, premium marquee style */}
        <Reveal>
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {PROJECT_AREAS.map((area) => (
              <span
                key={area}
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--tm-border)] bg-[var(--tm-surface)] px-4 py-1.5 text-xs font-semibold tracking-wide text-[var(--tm-text)] uppercase transition-colors hover:border-[var(--tm-primary)] hover:text-[var(--tm-primary)]"
              >
                <MapPin size={10} className="text-[var(--tm-primary)] shrink-0" />
                {area}
              </span>
            ))}
          </div>
        </Reveal>

        {/* Filter Tabs */}
        <Reveal>
          <div className="mb-8 flex justify-center">
            <div className="relative inline-flex rounded-xl bg-[var(--tm-surface-muted)] p-1 gap-0.5">
              {PROJECT_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={[
                    'relative z-[1] rounded-lg px-5 py-2 text-sm font-semibold transition-colors cursor-pointer',
                    activeFilter === cat ? 'text-white' : 'text-[var(--tm-muted)] hover:text-[var(--tm-text)]',
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

        {/* Project Grid - Vaonis card depth */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <Stagger>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((project, idx) => (
                  <StaggerItem3D key={project.id}>
                    <TiltCard className="h-full">
                      <Card
                        className="group h-full cursor-pointer overflow-hidden border border-[var(--tm-border)] bg-[var(--tm-surface)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--tm-primary)] hover:shadow-depth"
                        onClick={() => setSelectedProject(project)}
                      >
                        {/* Image */}
                        <div className="relative h-44 overflow-hidden">
                          <img
                            src={project.imageUrl}
                            alt={project.title}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                            <Badge className="text-[0.6rem]">{project.category}</Badge>
                            <span className="font-mono text-[0.55rem] font-semibold uppercase tracking-[0.2em] text-white/70">
                              PRJ {String(project.year).slice(-2)}·{String(idx + 1).padStart(2, '0')}
                            </span>
                          </div>
                        </div>

                        <CardContent className="flex flex-col gap-2 p-4">
                          <h3 className="text-base font-bold leading-snug text-[var(--tm-text-strong)] group-hover:text-[var(--tm-primary)] transition-colors">
                            {project.title}
                          </h3>
                          <div className="flex items-center gap-3 text-xs text-[var(--tm-muted)]">
                            <span className="flex items-center gap-1"><MapPin size={11} />{project.area}</span>
                            <span className="flex items-center gap-1"><Calendar size={11} />{project.year}</span>
                          </div>
                          <p className="text-xs italic text-[var(--tm-primary)] line-clamp-2">
                            &ldquo;{project.highlight}&rdquo;
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {project.tags.slice(0, 3).map(tag => (
                              <span key={tag} className="rounded bg-[var(--tm-surface-muted)] px-1.5 py-0.5 text-[0.6rem] font-medium text-[var(--tm-muted)]">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-[var(--tm-primary)]">
                            Lihat Detail <ChevronRight size={13} />
                          </div>
                        </CardContent>
                      </Card>
                    </TiltCard>
                  </StaggerItem3D>
                ))}
              </div>
            </Stagger>

            {filtered.length === 0 && (
              <div className="py-16 text-center text-[var(--tm-muted)]">
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
              className="inline-flex items-center gap-2 rounded-lg px-8 py-3.5 text-[0.95rem] font-bold no-underline"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#ffffff', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)' }}
            >
              Hubungi Kami <ArrowRight size={18} />
            </a>
          </div>
        </Reveal>
      </Section>

      {/* Modal — portal ke document.body agar keluar dari Lenis transform context */}
      {createPortal(
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSelectedProject(null)}
              style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
              aria-modal="true"
            aria-label={`Detail proyek: ${selectedProject.title}`}
            role="dialog"
          >
            <motion.div
              ref={modalRef}
              data-lenis-prevent
              tabIndex={-1}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={e => e.stopPropagation()}
              className="relative mb-0 w-full max-w-[680px] max-h-[88vh] overflow-y-auto rounded-2xl border border-[var(--tm-border)] bg-[var(--tm-surface)]"
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
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[var(--tm-primary)] px-5 py-3 text-sm font-semibold !text-white no-underline hover:opacity-90 transition-opacity"
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
      </AnimatePresence>,
      document.body
      )}
    </>
  )
}
