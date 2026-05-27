import { useState, useEffect, useRef } from 'react'
import { ArrowRight, X, MapPin, Calendar, ChevronRight } from 'lucide-react'
import { Reveal, Stagger, StaggerItem, TiltCard, CharReveal, ClipReveal } from '../components/Motion'
import { motion, AnimatePresence } from 'motion/react'
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
    modalRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [selectedProject])

  return (
    <>
      <Section>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <Reveal>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--tm-muted)', marginBottom: '1rem' }}>Portofolio</p>
          </Reveal>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, color: 'var(--tm-text-strong)', marginBottom: '1rem', lineHeight: 1.1 }}>
            <CharReveal text="Portofolio Proyek" />
          </h1>
          <ClipReveal delay={0.3}>
            <p style={{ fontSize: '1.125rem', color: 'var(--tm-muted)', maxWidth: '640px', margin: '0 auto' }}>
              Proyek konstruksi fasilitas kesehatan yang telah kami selesaikan di Jawa Timur, Bali, NTB, NTT, dan Sulawesi.
            </p>
          </ClipReveal>
        </div>

        {/* Stats Bar */}
        <Reveal>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '1.5rem',
            padding: '2rem',
            borderRadius: '1rem',
            background: 'var(--tm-surface)',
            border: '1px solid var(--tm-border)',
            marginBottom: '2rem',
          }}>
            {PROJECT_STATS.map(stat => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--tm-primary)', marginBottom: '0.5rem' }}>
                  <stat.icon size={20} />
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--tm-text-strong)' }}>{stat.getValue()}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--tm-muted)' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Scope Categories */}
        <Reveal>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--tm-text-strong)', marginBottom: '0.75rem' }}>
              Lingkup Pekerjaan
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '0.75rem',
            }}>
              {SCOPE_CATEGORIES.map(({ label, icon: Icon, count }) => (
                <div
                  key={label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.875rem 1rem',
                    borderRadius: '0.625rem',
                    background: 'var(--tm-surface)',
                    border: '1px solid var(--tm-border)',
                  }}
                >
                  <div style={{
                    width: '2.25rem',
                    height: '2.25rem',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--tm-surface-muted)',
                    color: 'var(--tm-primary)',
                    flexShrink: 0,
                  }}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--tm-text-strong)' }}>{label}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--tm-muted)' }}>{count} proyek</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Area Coverage */}
        <Reveal>
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--tm-text-strong)', marginBottom: '0.75rem' }}>
              Area Layanan
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {PROJECT_AREAS.map(area => (
                <span
                  key={area}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    padding: '0.5rem 1rem',
                    borderRadius: '2rem',
                    background: 'var(--tm-surface)',
                    border: '1px solid var(--tm-border)',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    color: 'var(--tm-text)',
                  }}
                >
                  <MapPin size={12} style={{ color: 'var(--tm-primary)' }} />
                  {area}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Filter Tabs */}
        <Reveal>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }}>
            <div style={{ display: 'inline-flex', position: 'relative', background: 'var(--tm-surface-muted)', borderRadius: '0.75rem', padding: '0.25rem' }}>
              {PROJECT_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  style={{
                    position: 'relative',
                    padding: '0.625rem 1.5rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: activeFilter === cat ? '#ffffff' : 'var(--tm-muted)',
                    zIndex: 1,
                    transition: 'color 0.2s',
                  }}
                >
                  {cat}
                  {activeFilter === cat && (
                    <motion.div
                      layoutId="filter-indicator"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '0.5rem',
                        background: 'var(--tm-primary)',
                        zIndex: -1,
                      }}
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
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                gap: '1.5rem',
              }}>
                {filtered.map((project, idx) => (
                  <StaggerItem key={project.id}>
                    <TiltCard className="h-full">
                    <Card
                      style={{
                        height: '100%',
                        cursor: 'pointer',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        border: '1px solid var(--tm-border)',
                        background: 'var(--tm-surface)',
                      }}
                      onClick={() => setSelectedProject(project)}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'
                        ;(e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(0,0,0,0.08)'
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
                        ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
                      }}
                    >
                      <CardContent style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                          <span style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: '#ffffff',
                            background: 'var(--tm-primary)',
                            borderRadius: '0.375rem',
                            padding: '0.25rem 0.625rem',
                          }}>
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          <Badge>{project.category}</Badge>
                        </div>

                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--tm-text-strong)', marginBottom: '0.25rem' }}>
                          {project.title}
                        </h3>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--tm-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                          <MapPin size={14} />
                          <span>{project.subtitle}</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--tm-muted)', fontSize: '0.8rem' }}>
                            <Calendar size={13} /> {project.year}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--tm-muted)', fontSize: '0.8rem' }}>
                            <MapPin size={13} /> {project.area}
                          </span>
                        </div>

                        <p style={{
                          fontStyle: 'italic',
                          color: 'var(--tm-primary)',
                          fontSize: '0.9rem',
                          fontWeight: 500,
                          marginBottom: '1rem',
                          lineHeight: 1.5,
                        }}>
                          &ldquo;{project.highlight}&rdquo;
                        </p>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '1.25rem' }}>
                          {project.tags.map(tag => (
                            <span key={tag} style={{
                              fontSize: '0.75rem',
                              padding: '0.2rem 0.5rem',
                              borderRadius: '0.25rem',
                              background: 'var(--tm-surface-muted)',
                              color: 'var(--tm-text)',
                              fontWeight: 500,
                            }}>
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div style={{ marginTop: 'auto' }}>
                          <button
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.375rem',
                              background: 'none',
                              border: 'none',
                              color: 'var(--tm-primary)',
                              fontWeight: 600,
                              fontSize: '0.875rem',
                              cursor: 'pointer',
                              padding: 0,
                            }}
                          >
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
              <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--tm-muted)' }}>
                <p style={{ fontSize: '1.125rem' }}>Belum ada proyek di kategori ini.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </Section>

      {/* Bottom CTA */}
      <Section>
        <Reveal>
          <div style={{
            textAlign: 'center',
            padding: '3rem 2rem',
            borderRadius: '1rem',
            background: 'linear-gradient(135deg, var(--tm-primary) 0%, var(--tm-accent) 60%, var(--tm-footer) 100%)',
            color: '#ffffff',
          }}>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 700, marginBottom: '1rem', color: '#ffffff' }}>
              Punya Proyek Serupa?
            </h2>
            <p style={{ fontSize: '1rem', opacity: 0.9, marginBottom: '1.5rem', maxWidth: '480px', margin: '0 auto 1.5rem', color: '#ffffff' }}>
              Konsultasikan kebutuhan fasilitas kesehatan Anda bersama tim ahli kami.
            </p>
            <a
              href="/contact"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.875rem 2rem',
                borderRadius: '0.5rem',
                background: '#ffffff',
                color: '#043962',
                fontWeight: 700,
                fontSize: '0.95rem',
                textDecoration: 'none',
              }}
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
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(4px)',
            }}
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
              style={{
                background: 'var(--tm-surface)',
                borderRadius: '1rem',
                maxWidth: '680px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                position: 'relative',
                border: '1px solid var(--tm-border)',
              }}
            >
              {/* Hero photo */}
              <div style={{ position: 'relative', height: '220px', overflow: 'hidden', borderRadius: '1rem 1rem 0 0' }}>
                <img
                  src={selectedProject.imageUrl}
                  alt={selectedProject.title}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)',
                }} />
                <div style={{ position: 'absolute', bottom: '1rem', left: '1.25rem', right: '3rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <Badge>{selectedProject.category}</Badge>
                    <Badge variant="outline" style={{ borderColor: 'rgba(255,255,255,0.4)', color: '#fff', background: 'rgba(255,255,255,0.1)' }}>{selectedProject.area}</Badge>
                  </div>
                  <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#ffffff', margin: 0, lineHeight: 1.3 }}>
                    {selectedProject.title}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  aria-label="Tutup modal"
                  style={{
                    position: 'absolute', top: '0.75rem', right: '0.75rem',
                    background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%',
                    width: '2rem', height: '2rem', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', cursor: 'pointer', color: '#ffffff',
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Content */}
              <div style={{ padding: '1.5rem' }}>
                {/* Meta */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', color: 'var(--tm-muted)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <MapPin size={14} /> {selectedProject.subtitle}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Calendar size={14} /> {selectedProject.year}
                  </span>
                </div>

                {/* Highlight */}
                <div style={{
                  padding: '0.875rem 1rem',
                  borderRadius: '0.5rem',
                  background: 'var(--tm-surface-muted)',
                  borderLeft: '3px solid var(--tm-primary)',
                  marginBottom: '1.25rem',
                }}>
                  <p style={{ fontStyle: 'italic', color: 'var(--tm-primary)', fontWeight: 500, margin: 0, fontSize: '0.9rem' }}>
                    &ldquo;{selectedProject.highlight}&rdquo;
                  </p>
                </div>

                {/* Scope */}
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--tm-text-strong)', marginBottom: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Lingkup Pekerjaan
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.375rem' }}>
                  {selectedProject.scope.map(item => (
                    <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: 'var(--tm-text)', fontSize: '0.875rem' }}>
                      <ChevronRight size={15} style={{ color: 'var(--tm-primary)', flexShrink: 0, marginTop: '0.15rem' }} />
                      {item}
                    </li>
                  ))}
                </ul>

                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '1.5rem' }}>
                  {selectedProject.tags.map(tag => (
                    <span key={tag} style={{
                      fontSize: '0.75rem', padding: '0.25rem 0.625rem', borderRadius: '1rem',
                      background: 'var(--tm-surface-muted)', color: 'var(--tm-text)', fontWeight: 500,
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Map */}
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--tm-text-strong)', marginBottom: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Lokasi Proyek
                </h3>
                <div style={{ borderRadius: '0.625rem', overflow: 'hidden', border: '1px solid var(--tm-border)', marginBottom: '1.5rem' }}>
                  <iframe
                    title={`Lokasi ${selectedProject.title}`}
                    src={`https://maps.google.com/maps?q=${selectedProject.mapQuery}&output=embed&z=14`}
                    width="100%"
                    height="200"
                    className="map-iframe"
                    style={{ border: 0, display: 'block' }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <a
                    href="/contact"
                    style={{
                      flex: 1, display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                      padding: '0.75rem 1.25rem', borderRadius: '0.5rem',
                      background: 'var(--tm-primary)', color: '#ffffff',
                      fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none', justifyContent: 'center',
                    }}
                  >
                    Diskusikan Proyek Serupa <ArrowRight size={15} />
                  </a>
                  <a
                    href={`https://maps.google.com/?q=${selectedProject.mapQuery}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                      padding: '0.75rem 1rem', borderRadius: '0.5rem',
                      border: '1px solid var(--tm-border)', background: 'var(--tm-surface)',
                      color: 'var(--tm-text)', fontWeight: 500, fontSize: '0.875rem', textDecoration: 'none',
                    }}
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
