import { useState } from 'react'
import { Clock3, Mail, MapPin, Phone, ArrowRight, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'
import Container from './Container'
import { SITE } from '../config/site'
import { CatalogPreview } from './CatalogPreview'
const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Tentang Kami', to: '/about' },
  { label: 'Layanan', to: '/services' },
  { label: 'Proyek', to: '/projects' },
  { label: 'Katalog', to: '/catalog' },
  { label: 'Hubungi Kami', to: '/contact' },
]

const services = [
  'Konstruksi MEP',
  'Instalasi Gas Medis',
  'HVAC & Cleanroom',
  'Modular Operating Theatre',
  'Maintenance',
]

export default function Footer() {
  const year = new Date().getFullYear()
  const [previewOpen, setPreviewOpen] = useState(false)

  return (
    <>
    <footer className="mt-16 border-t border-[var(--tm-border)]" style={{ backgroundColor: 'var(--tm-footer)' }}>
      <Container>
        {/* Main grid */}
        <div className="grid gap-10 py-14 sm:grid-cols-2 xl:grid-cols-4">
          {/* Brand col */}
          <div className="xl:col-span-1">
            <div className="flex items-center gap-2.5">
              <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-lg bg-white p-0.5 shadow-sm ring-1 ring-white/10">
                <img src={SITE.logo} alt="Teknomed logo" className="h-full w-full object-contain" />
              </span>
              <div>
                <div className="text-base font-bold tracking-tight text-white">{SITE.name}</div>
                <div className="text-[0.65rem] font-medium uppercase tracking-[0.15em] text-white/50">{SITE.tagline}</div>
              </div>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-6 text-white/55 text-pretty">
              {SITE.description}
            </p>

            {/* Area pills */}
            <div className="mt-5 flex flex-wrap gap-1.5">
              {SITE.serviceAreas.map((area) => (
                <span
                  key={area}
                  className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[0.65rem] font-medium text-white/60 ring-1 ring-white/10"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>

          {/* Nav links */}
          <div>
            <div className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/40">Navigasi</div>
            <ul className="space-y-2.5 text-sm text-white/65">
              {navLinks.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="flex items-center gap-1.5 transition-colors hover:text-white group"
                  >
                    <ArrowRight className="size-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            {/* Preview Katalog */}
              <button
                onClick={() => setPreviewOpen(true)}
                className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors"
              >
                <Eye size={14} />
                Preview Katalog
              </button>
          </div>
          <div>
            <div className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/40">Layanan</div>
            <ul className="space-y-2.5 text-sm text-white/65">
              {services.map((svc) => (
                <li key={svc} className="flex items-center gap-1.5">
                  <span className="size-1 rounded-full bg-white/25 shrink-0" />
                  {svc}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + hours */}
          <div>
            <div className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/40">Kontak</div>
            <ul className="space-y-3 text-sm text-white/65">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-white/35" />
                <span className="leading-5">{SITE.address.full}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="size-4 shrink-0 text-white/35" />
                <a className="hover:text-white transition-colors" href={SITE.contact.phoneHref}>
                  {SITE.contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="size-4 shrink-0 text-white/35" />
                <a className="hover:text-white transition-colors break-all" href={`mailto:${SITE.contact.email}`}>
                  {SITE.contact.email}
                </a>
              </li>
            </ul>

            <div className="mt-5">
              <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/40">Jam Operasional</div>
              <div className="flex items-start gap-2.5 text-sm leading-6 text-white/65">
                <Clock3 className="mt-0.5 size-4 shrink-0 text-white/35" />
                <span>
                  {SITE.hours.weekdays}
                  <br />
                  <span className="text-white/40">{SITE.hours.weekend}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/8 py-6 text-xs text-white/30">
          <p>
            &copy; {year} {SITE.name}. All rights reserved.
          </p>
          <p className="text-white/20">
            Berdiri {SITE.founded} - Melayani fasilitas kesehatan Indonesia Timur
          </p>
        </div>
      </Container>
    </footer>
    <CatalogPreview isOpen={previewOpen} onClose={() => setPreviewOpen(false)} />
    </>
  )
}
