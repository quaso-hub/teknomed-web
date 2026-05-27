/**
 * MarkersRail — animated vertical SVG rail for section progress.
 * Pattern: EatNaked markers rail, adapted for medical authority.
 *
 * - SVG line vertical di sisi kiri
 * - pathLength animates with scroll progress
 * - Active section marker morphs from dot to wave
 * - prefers-reduced-motion: static line only
 */
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { useRef } from 'react'

interface MarkersRailProps {
  /** IDs of sections to mark — order matters */
  sections: { id: string; label: string }[]
  /** Which section is currently active */
  activeId: string
  /** Container ref for scroll tracking */
  containerRef: React.RefObject<HTMLElement | null>
  className?: string
}

const RAIL_HEIGHT = 320   // px — visual height of the rail SVG
const DOT_R = 4           // dot radius
const WAVE_AMPLITUDE = 6  // wave morph amplitude

/** Morph path: straight dot vs wave dot */
function dotPath(y: number, active: boolean): string {
  if (!active) return `M ${DOT_R} ${y} a ${DOT_R} ${DOT_R} 0 1 0 0.001 0`
  // wave: small horizontal sine-like path centered at y
  const x0 = DOT_R
  return [
    `M ${x0 - WAVE_AMPLITUDE} ${y}`,
    `C ${x0 - WAVE_AMPLITUDE / 2} ${y - 6} ${x0 + WAVE_AMPLITUDE / 2} ${y + 6} ${x0 + WAVE_AMPLITUDE} ${y}`,
  ].join(' ')
}

export function MarkersRail({ sections, activeId, containerRef, className = '' }: MarkersRailProps) {
  const reduced = useReducedMotion()
  const svgRef = useRef<SVGSVGElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 20%', 'end 80%'],
  })

  const rawProgress = useTransform(scrollYProgress, [0, 1], [0, 1])
  const springProgress = useSpring(rawProgress, { stiffness: 120, damping: 20 })

  const totalSections = sections.length
  const spacing = RAIL_HEIGHT / (totalSections + 1)

  // y positions for each section dot
  const dotYs = sections.map((_, i) => spacing * (i + 1))

  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden>
      <svg
        ref={svgRef}
        width={DOT_R * 2 + WAVE_AMPLITUDE * 2 + 4}
        height={RAIL_HEIGHT}
        viewBox={`0 0 ${DOT_R * 2 + WAVE_AMPLITUDE * 2 + 4} ${RAIL_HEIGHT}`}
        fill="none"
        overflow="visible"
      >
        {/* Background rail line */}
        <line
          x1={DOT_R + WAVE_AMPLITUDE}
          y1={dotYs[0]}
          x2={DOT_R + WAVE_AMPLITUDE}
          y2={dotYs[dotYs.length - 1]}
          stroke="var(--tm-border)"
          strokeWidth="1"
        />

        {/* Animated progress fill on rail */}
        {!reduced && (
          <motion.line
            x1={DOT_R + WAVE_AMPLITUDE}
            y1={dotYs[0]}
            x2={DOT_R + WAVE_AMPLITUDE}
            y2={dotYs[dotYs.length - 1]}
            stroke="var(--tm-primary)"
            strokeWidth="1.5"
            strokeLinecap="round"
            style={{
              pathLength: springProgress,
              opacity: 0.6,
            }}
          />
        )}

        {/* Section dots / wave markers */}
        {sections.map((section, i) => {
          const y = dotYs[i]
          const active = section.id === activeId
          const cx = DOT_R + WAVE_AMPLITUDE

          return (
            <g key={section.id}>
              {active ? (
                /* Active: wave morph */
                <motion.path
                  d={dotPath(y, true)}
                  stroke="var(--tm-primary)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                  initial={reduced ? false : { pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                />
              ) : (
                /* Inactive: simple dot */
                <motion.circle
                  cx={cx}
                  cy={y}
                  r={DOT_R - 1}
                  fill="var(--tm-border)"
                  animate={{ scale: 1, opacity: 0.5 }}
                  transition={{ duration: 0.2 }}
                />
              )}

              {/* Active dot fill */}
              {active && (
                <motion.circle
                  cx={cx}
                  cy={y}
                  r={2}
                  fill="var(--tm-primary)"
                  initial={reduced ? false : { scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                />
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
