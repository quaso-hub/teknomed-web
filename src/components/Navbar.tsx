import { MoonStar, SunMedium, Command, Search, X as XIcon, Menu } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import Container from './Container'
import { useTheme } from './theme-context'

function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > threshold)
    handler()
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [threshold])
  return scrolled
}

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'Tentang Kami' },
  { to: '/services', label: 'Layanan' },
  { to: '/projects', label: 'Proyek' },
  { to: '/catalog', label: 'Katalog' },
  { to: '/contact', label: 'Hubungi' },
]

/** Opens CommandPalette via custom event - decoupled from import */
function openCommandPalette() {
  document.dispatchEvent(new CustomEvent('open-command-palette'))
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const menuId = useId()
  const closeBtnRef = useRef<HTMLButtonElement | null>(null)
  const { theme, toggleTheme } = useTheme()
  const scrolled = useScrolled()

  useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = 'hidden'
    closeBtnRef.current?.focus()
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsOpen(false) }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen])

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    [
      'relative px-3 py-1.5 text-sm font-medium transition-all duration-200 rounded-md border',
      isActive
        ? 'border-[var(--tm-primary)] bg-[var(--tm-primary)] text-white'
        : 'border-transparent text-[var(--tm-text)] hover:border-[var(--tm-border)] hover:bg-[var(--tm-surface-muted)]',
    ].join(' ')

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    [
      'flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 border-l-2',
      isActive
        ? 'border-[var(--tm-primary)] bg-[var(--tm-surface-muted)] text-[var(--tm-text-strong)]'
        : 'border-transparent text-[var(--tm-text)] hover:border-[var(--tm-border)] hover:bg-[var(--tm-surface-muted)]',
    ].join(' ')

  const iconBtnClass =
    'inline-flex size-9 items-center justify-center rounded-md border border-[var(--tm-border)] bg-[var(--tm-surface)] text-[var(--tm-text)] hover:bg-[var(--tm-surface-muted)] transition-colors'

  return (
    <header
      className={`sticky top-0 z-30 border-b border-[var(--tm-border)] transition-all duration-300 ${
        scrolled
          ? 'bg-[color-mix(in_srgb,var(--tm-page)_90%,transparent)] backdrop-blur-xl shadow-sm'
          : 'bg-[color-mix(in_srgb,var(--tm-page)_95%,transparent)] backdrop-blur-md border-transparent'
      } safe-top`}
    >
      <Container>
        <div className="flex h-14 items-center justify-between gap-6">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2.5 font-semibold text-[var(--tm-text-strong)] shrink-0">
            <span
              className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-lg bg-white p-0.5 shadow-sm ring-1 ring-[var(--tm-border)]"
              aria-hidden="true"
            >
              <img src="/logo_pt.png" alt="" className="h-full w-full object-contain" />
            </span>
            <span className="hidden sm:flex flex-col leading-tight">
              <span className="text-sm font-bold tracking-tight text-[var(--tm-text-strong)]">PT Teknomed</span>
              <span className="text-[0.6rem] font-medium uppercase tracking-[0.1em] text-[var(--tm-muted)]">Indo Timur</span>
            </span>
            <span className="sm:hidden text-sm font-bold tracking-tight">Teknomed</span>
          </NavLink>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-0.5 md:flex" aria-label="Main navigation">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === '/'} className={navLinkClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Cmd+K palette trigger - desktop only */}
            <button
              type="button"
              onClick={openCommandPalette}
              className="hidden md:inline-flex items-center gap-2 h-9 px-3 rounded-md border border-[var(--tm-border)] bg-[var(--tm-surface)] text-[var(--tm-muted)] hover:bg-[var(--tm-surface-muted)] hover:text-[var(--tm-text)] transition-colors text-xs"
              aria-label="Buka command palette (Ctrl+K)"
            >
              <Search className="size-3.5" />
              <span className="hidden lg:inline text-xs">Cari...</span>
              <span className="hidden lg:flex items-center gap-0.5">
                <kbd className="rounded border border-[var(--tm-border)] bg-[var(--tm-surface-muted)] px-1 py-0.5 text-[9px] font-medium leading-none">
                  {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}
                </kbd>
                <kbd className="rounded border border-[var(--tm-border)] bg-[var(--tm-surface-muted)] px-1 py-0.5 text-[9px] font-medium leading-none">
                  K
                </kbd>
              </span>
            </button>

            {/* Theme toggle */}
            <button
              type="button"
              className={iconBtnClass}
              aria-label={theme === 'dark' ? 'Aktifkan light mode' : 'Aktifkan dark mode'}
              onClick={toggleTheme}
            >
              {theme === 'dark' ? <SunMedium className="size-4" /> : <MoonStar className="size-4" />}
            </button>

            {/* CTA - desktop */}
            <a
              href="mailto:teknomedindotimurpt@gmail.com"
              className="hidden items-center justify-center rounded-md px-3 py-1.5 text-xs font-semibold transition-all hover:opacity-90 hover:shadow-md sm:inline-flex"
              style={{ backgroundColor: 'var(--tm-primary)', color: 'var(--tm-on-primary)' }}
            >
              Hubungi Kami
            </a>

            {/* Cmd+K - mobile */}
            <button
              type="button"
              className={`${iconBtnClass} md:hidden`}
              aria-label="Buka pencarian"
              onClick={openCommandPalette}
            >
              <Search className="size-4" />
            </button>

            {/* Hamburger */}
            <button
              type="button"
              className={`${iconBtnClass} md:hidden`}
              aria-haspopup="dialog"
              aria-expanded={isOpen}
              aria-controls={menuId}
              aria-label={isOpen ? 'Tutup menu' : 'Buka menu'}
              onClick={() => setIsOpen(true)}
            >
              <Menu className="size-4" />
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile drawer with motion */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            role="presentation"
          >
            {/* Backdrop */}
            <motion.button
              type="button"
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              aria-label="Tutup overlay"
              onClick={() => setIsOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Drawer panel */}
            <motion.section
              id={menuId}
              role="dialog"
              aria-modal="true"
              aria-label="Menu navigasi"
              className="fixed inset-y-0 right-0 h-full w-[min(88vw,22rem)] overflow-y-auto border-l border-[var(--tm-border)] bg-[var(--tm-surface)] text-[var(--tm-text)] shadow-2xl flex flex-col"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 35 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between gap-3 border-b border-[var(--tm-border)] px-4 py-3 shrink-0">
                <div className="flex items-center gap-2 text-sm font-semibold text-[var(--tm-text-strong)]">
                  <span className="grid size-8 shrink-0 place-items-center overflow-hidden rounded-md bg-white p-0.5 ring-1 ring-[var(--tm-border)]" aria-hidden="true">
                    <img src="/logo_pt.png" alt="" className="h-full w-full object-contain" />
                  </span>
                  PT Teknomed
                </div>
                <button
                  ref={closeBtnRef}
                  type="button"
                  className="inline-flex size-9 items-center justify-center rounded-md border border-[var(--tm-border)] text-[var(--tm-text)] hover:bg-[var(--tm-surface-muted)] transition-colors"
                  aria-label="Tutup menu"
                  onClick={() => setIsOpen(false)}
                >
                  <XIcon className="size-4" />
                </button>
              </div>

              {/* Nav links */}
              <nav className="py-2 flex-1" aria-label="Mobile navigation">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    onClick={() => setIsOpen(false)}
                    className={mobileNavLinkClass}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>

              {/* Footer actions */}
              <div className="border-t border-[var(--tm-border)] p-4 space-y-2 shrink-0">
                <button
                  type="button"
                  onClick={() => { openCommandPalette(); setIsOpen(false) }}
                  className="flex h-10 w-full items-center justify-center gap-2 rounded-md border border-[var(--tm-border)] text-xs font-medium text-[var(--tm-text)] hover:bg-[var(--tm-surface-muted)] transition-colors"
                >
                  <Command className="size-3.5" />
                  Command Palette
                  <kbd className="ml-auto rounded border border-[var(--tm-border)] bg-[var(--tm-surface-muted)] px-1 py-0.5 text-[9px] font-medium">Ctrl+K</kbd>
                </button>
                <a
                  href="mailto:teknomedindotimurpt@gmail.com"
                  className="flex h-10 items-center justify-center rounded-md text-xs font-semibold transition-opacity hover:opacity-90"
                  style={{ backgroundColor: 'var(--tm-primary)', color: 'var(--tm-on-primary)' }}
                >
                  Hubungi Kami
                </a>
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
