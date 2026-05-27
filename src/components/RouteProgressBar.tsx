import { useLocation } from 'react-router-dom'
import { motion } from 'motion/react'

export function RouteProgressBar() {
  const { pathname } = useLocation()
  return (
    <motion.div
      key={pathname}
      initial={{ scaleX: 0, opacity: 1 }}
      animate={{ scaleX: 1, opacity: [1, 1, 0] }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], times: [0, 0.7, 1] }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: 'linear-gradient(90deg, var(--tm-primary), var(--tm-accent))',
        transformOrigin: 'left',
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    />
  )
}
