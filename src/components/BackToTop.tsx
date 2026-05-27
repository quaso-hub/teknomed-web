import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowUp } from 'lucide-react'

/**
 * QoL: Back-to-top button with SVG progress ring.
 * Shows after 300px scroll. Smooth scroll to top.
 */
export default function BackToTop() {
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(0)
  const reduced = useReducedMotion()

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const p = docHeight > 0 ? scrollTop / docHeight : 0
      setProgress(Math.min(p, 1))
      setVisible(scrollTop > 300)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (reduced) {
    return visible ? (
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-50 grid size-12 place-items-center rounded-full bg-[var(--tm-primary)] text-white shadow-lg hover:bg-[var(--tm-primary-strong)] transition-colors"
        aria-label="Scroll to top"
      >
        <ArrowUp className="size-5" />
      </button>
    ) : null
  }

  const circumference = 2 * Math.PI * 18
  const dashOffset = circumference * (1 - progress)

  return (
    <>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 grid size-12 place-items-center rounded-full bg-[var(--tm-primary)] text-white shadow-lg hover:bg-[var(--tm-primary-strong)] transition-colors"
          aria-label="Scroll to top"
        >
          <ArrowUp className="size-5" />
          <svg
            className="absolute -inset-0 size-14"
            viewBox="0 0 44 44"
          >
            <circle
              cx="22"
              cy="22"
              r="18"
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="3"
            />
            <circle
              cx="22"
              cy="22"
              r="18"
              fill="none"
              stroke="rgba(255,255,255,0.8)"
              strokeWidth="3"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              transform="rotate(-90 22 22)"
              style={{ transition: 'stroke-dashoffset 0.15s ease' }}
            />
          </svg>
        </motion.button>
      )}
    </>
  )
}
