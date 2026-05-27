import { MoonStar, SunMedium, Command, Search, X as XIcon, Menu, ArrowUpRight } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
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
  { to: '/', label: 'Home', index: '01' },
  { to: '/about', label: 'Tentang', index: '02' },
  { to: '/services', label: 'Layanan', index: '03' },
  { to: '/projects', label: 'Proyek', index: '04' },
  { to: '/catalog', label: 'Katalog', index: '05' },
  { to: '/contact', label: 'Hubungi', index: '06' },
]

function openCommandPalette() {
  document.dispatchEvent(new CustomEvent('open-command-palette'))
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const menuId = useId()
  const closeBtnRef = useRef<HTMLButtonElement | null>(null)
  const { theme, toggleTheme } = useTheme()
  const scrolled = useScrolled()
  const reduced = useReducedMotion()

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

  const iconBtnClass =
    'inline-flex size-9 items-center justify-center rounded-md border border-[var(--tm-border)] bg-[var(--tm-surface)] text-[var(--tm-text)] hover:bg-[var(--tm-surface-muted)] transition-colors'

  return (
    <header
      className={`sticky top-0 z-30 transition-all duration-500 safe-top ${
        scrolled
          ? 'border-b border-[var(--tm-border)] bg-[color-mix(in_srgb,var(--tm-page)_85%,transparent)] backdrop-blur-xl shadow-sm'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <Container>
        <div className="flex h-14 items-center justify-between gap-4">

          {/* Logo — editorial style */}
          <NavLink to="/" className="group flex items-center gap-2.5 shrink-0">
            <span className="grid size-8 shrink-0 place-items-center overflow-hidden rounded-lg bg-white p-0.5 shadow-sm ring-1 ring-[var(--tm-border)] transition-transform duration-300 group-hover:scale-105">
              <img src="/logo_pt.png" alt="" className="h-full w-full object-contain" />
            </span>
            <span className="hidden sm:flex flex-col leading-none">
              <span className="text-[0.8rem] font-bold tracking-tight text-[var(--tm-text-strong)]">PT Teknomed</span>
              <span className="text-[0.55rem] font-semibold uppercase tracking-[0.15em] text-[var(--tm-muted)]">Indo Timur</span>
            </span>
          </NavLink>

          {/* Desktop nav — Digitalists-inspired with index prefix */}
          <nav className="hidden items-center md:flex" aria-label="Main navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onMouseEnter={() => setHoveredItem(item.to)}
                onMouseLeave={() => setHoveredItem(null)}
                className={({ isActive }) => [
                  'group relative flex items-center gap-1 px-3 py-2 text-sm transition-all duration-200',
                  isActive
                    ? 'text-[var(--tm-text-strong)]'
                    : 'text-[var(--tm-muted)] hover:text-[var(--tm-text-strong)]',
                ].join(' ')}
              >
                {({ isActive }) => (
                  <>
                    <span className={[
                      'font-mono text-[0.55rem] font-semibold transition-all duration-200',
                      isActive || hoveredItem === item.to
                        ? 'text-[var(--tm-primary)] opacity-100'
                        : 'opacity-0 group-hover:opacity-60',
                    ].join(' ')}>
                      {item.index}
                    </span>
                    <span className="font-medium">{item.label}</span>
                    {isActive && !reduced && (
                      <motion.span
                        layoutId="nav-active-pill"
                        className="absolute inset-0 rounded-md bg-[var(--tm-surface-muted)] -z-10"
                        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            {/* Search — desktop */}
            <button
              type="button"
              onClick={openCommandPalette}
              className="hidden md:inline-flex items-center gap-2 h-8 px-3 rounded-md border border-[var(--tm-border)] bg-[var(--tm-surface-muted)] text-[var(--tm-muted)] hover:text-[var(--tm-text)] hover:border-[var(--tm-primary)/40] transition-all text-xs"
              aria-label="Buka command palette (Ctrl+K)"
            >
              <Search className="size-3" />
              <span className="hidden lg:inline">Cari...</span>
              <kbd className="hidden lg:inline rounded border border-[var(--tm-border)] bg-[var(--tm-surface)] px-1 py-0.5 text-[9px] font-medium">
                {typeof navigator !== 'undefined' && navigator.platform.includes('Mac') ? '⌘K' : 'Ctrl K'}
              </kbd>
            </button>

            {/* Theme toggle */}
            <button
              type="button"
              className={iconBtnClass}
              aria-label={theme === 'dark' ? 'Light mode' : 'Dark mode'}
              onClick={toggleTheme}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme}
                  initial={reduced ? false : { opacity: 0, rotate: -90, scale: 0.5 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={reduced ? undefined : { opacity: 0, rotate: 90, scale: 0.5 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center justify-center"
                >
                  {theme === 'dark'
                    ? <SunMedium className="size-4" />
                    : <MoonStar className="size-4" />}
                </motion.span>
              </AnimatePresence>
            </button>

            {/* CTA — desktop, EatNaked glassmorphism style */}
            <a
              href="mailto:teknomedindotimurpt@gmail.com"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all duration-200 hover:opacity-90 hover:shadow-md hover:-translate-y-px"
              style={{ backgroundColor: 'var(--tm-primary)', color: '#ffffff' }}
            >
              Hubungi
              <ArrowUpRight className="size-3" />
            </a>

            {/* Search — mobile */}
            <button
              type="button"
              className={`${iconBtnClass} md:hidden`}
              aria-label="Cari"
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

      {/* Mobile drawer — EatNaked layered panel style */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            role="presentation"
          >
            {/* Backdrop */}
            <motion.button
              type="button"
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
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
              className="fixed inset-y-0 right-0 flex h-full w-[min(85vw,20rem)] flex-col overflow-y-auto border-l border-[var(--tm-border)] bg-[var(--tm-surface)] shadow-2xl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 38 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[var(--tm-border)] px-5 py-4 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="grid size-7 shrink-0 place-items-center overflow-hidden rounded-md bg-white p-0.5 ring-1 ring-[var(--tm-border)]">
                    <img src="/logo_pt.png" alt="" className="h-full w-full object-contain" />
                  </span>
                  <div className="flex flex-col leading-none">
                    <span className="text-xs font-bold text-[var(--tm-text-strong)]">PT Teknomed</span>
                    <span className="text-[0.55rem] font-semibold uppercase tracking-[0.12em] text-[var(--tm-muted)]">Indo Timur</span>
                  </div>
                </div>
                <button
                  ref={closeBtnRef}
                  type="button"
                  className="inline-flex size-8 items-center justify-center rounded-md border border-[var(--tm-border)] text-[var(--tm-muted)] hover:bg-[var(--tm-surface-muted)] hover:text-[var(--tm-text)] transition-colors"
                  aria-label="Tutup menu"
                  onClick={() => setIsOpen(false)}
                >
                  <XIcon className="size-4" />
                </button>
              </div>

              {/* Nav links — Digitalists editorial style */}
              <nav className="flex-1 py-3" aria-label="Mobile navigation">
                {navItems.map((item, i) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) => [
                      'group flex items-center gap-4 px-5 py-3.5 transition-all duration-200',
                      isActive
                        ? 'bg-[var(--tm-surface-muted)] text-[var(--tm-text-strong)]'
                        : 'text-[var(--tm-muted)] hover:bg-[var(--tm-surface-muted)] hover:text-[var(--tm-text-strong)]',
                    ].join(' ')}
                  >
                    {({ isActive }) => (
                      <>
                        <span className={[
                          'font-mono text-[0.6rem] font-semibold w-5 shrink-0 transition-colors',
                          isActive ? 'text-[var(--tm-primary)]' : 'text-[var(--tm-border)] group-hover:text-[var(--tm-muted)]',
                        ].join(' ')}>
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="text-sm font-medium">{item.label}</span>
                        {isActive && (
                          <span className="ml-auto size-1.5 rounded-full bg-[var(--tm-primary)]" />
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </nav>

              {/* Footer */}
              <div className="border-t border-[var(--tm-border)] p-4 space-y-2 shrink-0">
                <button
                  type="button"
                  onClick={() => { openCommandPalette(); setIsOpen(false) }}
                  className="flex h-9 w-full items-center gap-2 rounded-md border border-[var(--tm-border)] px-3 text-xs font-medium text-[var(--tm-muted)] hover:bg-[var(--tm-surface-muted)] hover:text-[var(--tm-text)] transition-colors"
                >
                  <Command className="size-3.5 shrink-0" />
                  Command Palette
                  <kbd className="ml-auto rounded border border-[var(--tm-border)] bg-[var(--tm-surface-muted)] px-1 py-0.5 text-[9px] font-medium">Ctrl+K</kbd>
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="flex h-9 flex-1 items-center justify-center gap-2 rounded-md border border-[var(--tm-border)] text-xs font-medium text-[var(--tm-muted)] hover:bg-[var(--tm-surface-muted)] transition-colors"
                  >
                    {theme === 'dark' ? <SunMedium className="size-3.5" /> : <MoonStar className="size-3.5" />}
                    {theme === 'dark' ? 'Light' : 'Dark'}
                  </button>
                  <a
                    href="mailto:teknomedindotimurpt@gmail.com"
                    className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-md text-xs font-semibold transition-opacity hover:opacity-90"
                    style={{ backgroundColor: 'var(--tm-primary)', color: '#ffffff' }}
                    onClick={() => setIsOpen(false)}
                  >
                    Hubungi
                    <ArrowUpRight className="size-3" />
                  </a>
                </div>
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
