/**
 * AmbientIcons — floating medical/MEP SVG icons for Hero background.
 * Pattern: EatNaked floating ambient, toned down for medical authority.
 * - One-shot reveal (no loop animation)
 * - Parallax driven by Lenis scroll via motion/react useScroll
 * - prefers-reduced-motion: skip entirely
 * - GPU: transform only (no layout thrash)
 */
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'

/* ── SVG icon paths (monoline, medical/MEP themed) ─────────────────────────── */

const GasValveSvg = () => (
  <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="20" cy="20" r="7" />
    <line x1="20" y1="13" x2="20" y2="8" />
    <line x1="20" y1="27" x2="20" y2="32" />
    <line x1="13" y1="20" x2="8" y2="20" />
    <line x1="27" y1="20" x2="32" y2="20" />
    <rect x="16" y="5" width="8" height="3" rx="1" />
  </svg>
)

const HvacFanSvg = () => (
  <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="20" cy="20" r="3" />
    <path d="M20 17 C20 12 14 8 14 14 C14 17 17 17 20 17Z" />
    <path d="M23 20 C28 20 32 14 26 14 C23 14 23 17 23 20Z" />
    <path d="M20 23 C20 28 26 32 26 26 C26 23 23 23 20 23Z" />
    <path d="M17 20 C12 20 8 26 14 26 C17 26 17 23 17 20Z" />
    <circle cx="20" cy="20" r="10" strokeDasharray="3 3" opacity="0.4" />
  </svg>
)

const ManifoldSvg = () => (
  <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="16" width="28" height="8" rx="2" />
    <line x1="12" y1="16" x2="12" y2="10" />
    <line x1="20" y1="16" x2="20" y2="10" />
    <line x1="28" y1="16" x2="28" y2="10" />
    <circle cx="12" cy="9" r="1.5" />
    <circle cx="20" cy="9" r="1.5" />
    <circle cx="28" cy="9" r="1.5" />
    <line x1="14" y1="24" x2="14" y2="31" />
    <line x1="26" y1="24" x2="26" y2="31" />
  </svg>
)

const ModularWallSvg = () => (
  <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="8" width="12" height="24" rx="1.5" />
    <rect x="22" y="8" width="12" height="24" rx="1.5" />
    <line x1="6" y1="20" x2="18" y2="20" />
    <line x1="22" y1="20" x2="34" y2="20" />
    <line x1="12" y1="8" x2="12" y2="32" />
    <line x1="28" y1="8" x2="28" y2="32" />
  </svg>
)

const FilterSvg = () => (
  <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 10 L18 22 L18 32 L22 30 L22 22 L32 10 Z" />
    <line x1="8" y1="10" x2="32" y2="10" />
  </svg>
)

const PressureGaugeSvg = () => (
  <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="20" cy="20" r="12" />
    <path d="M12 28 A10 10 0 1 1 28 28" strokeDasharray="none" />
    <line x1="20" y1="20" x2="26" y2="14" strokeWidth="2" />
    <circle cx="20" cy="20" r="2" fill="currentColor" />
    <line x1="20" y1="8" x2="20" y2="10" />
    <line x1="28" y1="12" x2="26.5" y2="13.5" />
    <line x1="32" y1="20" x2="30" y2="20" />
  </svg>
)

/* ── Icon config: position, size, blur, opacity, parallax factor ────────────── */
interface AmbientIcon {
  id: string
  Svg: () => JSX.Element
  top?: string
  bottom?: string
  left?: string
  right?: string
  size: number
  blur: number
  opacity: number
  parallaxY: [number, number]   // [start%, end%] as scroll 0->1
  delay: number
  rotate: number
}

const ICONS: AmbientIcon[] = [
  {
    id: 'gas-valve',
    Svg: GasValveSvg,
    top: '12%', left: '6%',
    size: 52, blur: 0, opacity: 0.12,
    parallaxY: [0, -40],
    delay: 0.2, rotate: -15,
  },
  {
    id: 'hvac-fan',
    Svg: HvacFanSvg,
    top: '8%', right: '8%',
    size: 64, blur: 1, opacity: 0.10,
    parallaxY: [0, -60],
    delay: 0.4, rotate: 20,
  },
  {
    id: 'manifold',
    Svg: ManifoldSvg,
    top: '55%', left: '3%',
    size: 48, blur: 2, opacity: 0.09,
    parallaxY: [0, -30],
    delay: 0.1, rotate: 5,
  },
  {
    id: 'modular-wall',
    Svg: ModularWallSvg,
    top: '30%', right: '4%',
    size: 56, blur: 1, opacity: 0.08,
    parallaxY: [0, -50],
    delay: 0.6, rotate: -8,
  },
  {
    id: 'filter',
    Svg: FilterSvg,
    bottom: '20%', left: '10%',
    size: 44, blur: 3, opacity: 0.07,
    parallaxY: [0, -20],
    delay: 0.3, rotate: 12,
  },
  {
    id: 'pressure-gauge',
    Svg: PressureGaugeSvg,
    bottom: '15%', right: '12%',
    size: 58, blur: 2, opacity: 0.09,
    parallaxY: [0, -45],
    delay: 0.5, rotate: -5,
  },
]

/* ── Single icon with parallax ──────────────────────────────────────────────── */
function AmbientIconItem({
  icon,
  scrollYProgress,
}: {
  icon: AmbientIcon
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress']
}) {
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`${icon.parallaxY[0]}px`, `${icon.parallaxY[1]}px`]
  )

  const posStyle: React.CSSProperties = {
    position: 'absolute',
    ...(icon.top !== undefined && { top: icon.top }),
    ...(icon.bottom !== undefined && { bottom: icon.bottom }),
    ...(icon.left !== undefined && { left: icon.left }),
    ...(icon.right !== undefined && { right: icon.right }),
    width: icon.size,
    height: icon.size,
    color: 'var(--tm-primary)',
    filter: icon.blur > 0 ? `blur(${icon.blur}px)` : undefined,
    opacity: icon.opacity,
    pointerEvents: 'none',
    willChange: 'transform',
  }

  return (
    <motion.div
      style={{ ...posStyle, y, rotate: icon.rotate }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: icon.opacity, scale: 1 }}
      transition={{
        duration: 0.8,
        delay: icon.delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <icon.Svg />
    </motion.div>
  )
}

/* ── Main export ────────────────────────────────────────────────────────────── */
export function AmbientIcons({ containerRef }: { containerRef: React.RefObject<HTMLElement | null> }) {
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  if (reduced) return null

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden>
      {ICONS.map((icon) => (
        <AmbientIconItem
          key={icon.id}
          icon={icon}
          scrollYProgress={scrollYProgress}
        />
      ))}
    </div>
  )
}
