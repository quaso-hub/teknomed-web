import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'

/**
 * QoL: Page-scroll progress bar pinned to top.
 * Lightweight, purely visual feedback for scroll position.
 */
export default function ScrollProgress() {
  const [progress, setProgress] = useState(0)
  const reduced = useReducedMotion()

  useEffect(() => {
    const handler = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight <= 0) return
      setProgress(window.scrollY / docHeight)
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <div className="fixed left-0 right-0 top-0 z-40 h-[3px] bg-transparent">
      {reduced ? (
        <div
          className="h-full bg-[var(--tm-primary)]"
          style={{ width: `${progress * 100}%` }}
        />
      ) : (
        <motion.div
          className="h-full bg-[var(--tm-primary)]"
          style={{ width: `${progress * 100}%` }}
          layout
        />
      )}
    </div>
  )
}
