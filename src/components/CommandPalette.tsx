import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { Search, ArrowRight, Command } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useHotkey } from '../hooks/useHotkey'

interface CommandItem {
  id: string
  label: string
  shortcut?: string
  to?: string
  action?: () => void
  meta?: string
}

const COMMANDS: CommandItem[] = [
  { id: 'go-home', label: 'Home', shortcut: 'H', to: '/', meta: 'Halaman utama' },
  { id: 'go-about', label: 'Tentang Kami', shortcut: 'A', to: '/about', meta: 'Profil perusahaan' },
  { id: 'go-services', label: 'Layanan', shortcut: 'S', to: '/services', meta: 'Jasa konstruksi & penjualan' },
  { id: 'go-projects', label: 'Proyek', shortcut: 'P', to: '/projects', meta: 'Galeri proyek' },
  { id: 'go-catalog', label: 'Katalog Produk', shortcut: 'K', to: '/catalog', meta: 'Produk medical gas' },
  { id: 'go-contact', label: 'Hubungi Kami', shortcut: 'C', to: '/contact', meta: 'Informasi kontak' },
  { id: 'theme-toggle', label: 'Toggle Dark Mode', shortcut: 'D', action: () => document.dispatchEvent(new CustomEvent('toggle-theme')), meta: 'Ganti tema' },
  { id: 'scroll-top', label: 'Scroll ke Atas', shortcut: 'T', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }), meta: 'Navigasi cepat' },
]

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQueryRaw] = useState('')
  const [activeIdx, setActiveIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const navigate = useNavigate()
  const reduced = useReducedMotion()

  const open = useCallback(() => {
    setQueryRaw('')
    setActiveIdx(0)
    setIsOpen(true)
  }, [])

  const setQuery = useCallback((next: string) => {
    setQueryRaw(next)
    setActiveIdx(0)
  }, [])

  useHotkey('k', open, { meta: true, preventDefault: true })
  useHotkey('k', open, { ctrl: true, preventDefault: true })

  // Listen for custom event from Navbar (decoupled trigger)
  useEffect(() => {
    document.addEventListener('open-command-palette', open)
    return () => document.removeEventListener('open-command-palette', open)
  }, [open])

  const filtered = useMemo(() => {
    if (!query.trim()) return COMMANDS
    const q = query.toLowerCase()
    return COMMANDS.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.meta?.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q)
    )
  }, [query])

  const execute = useCallback((item: CommandItem) => {
    if (item.to) {
      navigate(item.to)
      setIsOpen(false)
    } else if (item.action) {
      item.action()
      setIsOpen(false)
    }
  }, [navigate])

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setIsOpen(false); return }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIdx((i) => (i + 1) % filtered.length)
        return
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIdx((i) => (i - 1 + filtered.length) % filtered.length)
        return
      }
      if (e.key === 'Enter') {
        e.preventDefault()
        const item = filtered[activeIdx]
        if (item) execute(item)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen, filtered, activeIdx, execute])

  useEffect(() => {
    if (isOpen) inputRef.current?.focus()
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const overlayVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } }
  const panelVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] } },
  }

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-start justify-center bg-black/40 backdrop-blur-sm pt-[20vh] px-4"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={reduced ? {} : overlayVariants}
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            className="w-full max-w-lg overflow-hidden rounded-xl bg-[var(--tm-surface)] shadow-2xl border border-[var(--tm-border)]"
            variants={reduced ? undefined : panelVariants}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 border-b border-[var(--tm-border)] px-4 py-3">
              <Search className="size-5 text-[var(--tm-muted)]" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari halaman, perintah..."
                className="flex-1 bg-transparent text-[var(--tm-text-strong)] placeholder:text-[var(--tm-muted)] outline-none text-sm"
              />
              <div className="flex gap-1.5">
                <kbd className="rounded border border-[var(--tm-border)] bg-[var(--tm-surface-muted)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--tm-muted)]">
                  ESC
                </kbd>
              </div>
            </div>

            {/* Results */}
            <ul ref={listRef} className="max-h-[320px] overflow-auto py-2">
              {filtered.length === 0 && (
                <li className="px-4 py-3 text-sm text-[var(--tm-muted)] text-center">
                  Tidak ada hasil untuk "{query}"
                </li>
              )}
              {filtered.map((item, idx) => (
                <li key={item.id}>
                  <button
                    onClick={() => execute(item)}
                    onMouseEnter={() => setActiveIdx(idx)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                      idx === activeIdx
                        ? 'bg-[var(--tm-surface-active)]'
                        : 'hover:bg-[var(--tm-surface-muted)]'
                    }`}
                  >
                    <div className="flex size-8 items-center justify-center rounded-md bg-[var(--tm-surface-muted)] text-[var(--tm-muted)] shrink-0">
                      <Command className="size-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-[var(--tm-text-strong)] truncate">
                        {item.label}
                      </div>
                      {item.meta && (
                        <div className="text-xs text-[var(--tm-muted)] truncate">{item.meta}</div>
                      )}
                    </div>
                    {item.shortcut && (
                      <kbd className="rounded border border-[var(--tm-border)] bg-[var(--tm-surface-muted)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--tm-muted)] shrink-0">
                        {item.shortcut}
                      </kbd>
                    )}
                    {idx === activeIdx && (
                      <ArrowRight className="size-4 text-[var(--tm-primary)] shrink-0" />
                    )}
                  </button>
                </li>
              ))}
            </ul>

            {/* Footer hint */}
            <div className="flex items-center justify-between border-t border-[var(--tm-border)] px-4 py-2.5 text-[10px] text-[var(--tm-muted)]">
              <div className="flex gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-[var(--tm-border)] bg-[var(--tm-surface-muted)] px-1 py-0.5 font-medium">↑↓</kbd> navigasi
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-[var(--tm-border)] bg-[var(--tm-surface-muted)] px-1 py-0.5 font-medium">↵</kbd> pilih
                </span>
              </div>
              <span>{filtered.length} hasil</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
