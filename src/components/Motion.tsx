import type { ReactNode } from 'react'
import {
  MotionConfig,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  animate,
} from 'motion/react'
import { useEffect, useRef, forwardRef } from 'react'
import { cn } from '../lib/utils'

export function AppMotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}

// ── Reveal on scroll ──────────────────────────────────────────────────────────
type RevealProps = { children: ReactNode; className?: string; delay?: number }

// NRG default easing - sharp ease-in-out, lebih premium dari ease-out biasa
const PREMIUM_EASE = [0.55, 0.1, 0.26, 0.995] as const

export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 20 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-6% 0px' }}
      transition={{ duration: 0.55, ease: PREMIUM_EASE, delay }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}

// ── Stagger container - children animate in sequence ─────────────────────────
type StaggerProps = { children: ReactNode; className?: string; stagger?: number }

export function Stagger({ children, className, stagger = 0.08 }: StaggerProps) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      initial={reduced ? false : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, margin: '-6% 0px' }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}

// ── Float card - spring hover ─────────────────────────────────────────────────
type FloatCardProps = { children: ReactNode; className?: string }

export function FloatCard({ children, className }: FloatCardProps) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      whileHover={reduced ? undefined : { y: -5, scale: 1.015 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}

// ── Magnetic button - cursor attraction ──────────────────────────────────────
export function MagneticWrap({ children, className, strength = 0.3 }: { children: ReactNode; className?: string; strength?: number }) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 300, damping: 20 })
  const sy = useSpring(y, { stiffness: 300, damping: 20 })

  if (reduced) return <div className={cn(className)}>{children}</div>

  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy }}
      className={cn(className)}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect()
        if (!rect) return
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        x.set((e.clientX - cx) * strength)
        y.set((e.clientY - cy) * strength)
      }}
      onMouseLeave={() => { x.set(0); y.set(0) }}
    >
      {children}
    </motion.div>
  )
}

// ── Animated counter ─────────────────────────────────────────────────────────
export function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useRef(false)

  useEffect(() => {
    if (reduced || !ref.current) return
    const el = ref.current
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !inView.current) {
        inView.current = true
        const ctrl = animate(0, to, {
          duration: 1.4,
          ease: [0.25, 0.46, 0.45, 0.94],
          onUpdate: (v) => { el.textContent = Math.round(v) + suffix },
        })
        return () => ctrl.stop()
      }
    }, { threshold: 0.5 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [to, suffix, reduced])

  return <span ref={ref}>{reduced ? `${to}${suffix}` : `0${suffix}`}</span>
}

// ── Fade in line - horizontal rule with reveal ────────────────────────────────
export function FadeLine({ className }: { className?: string }) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      initial={reduced ? false : { scaleX: 0, opacity: 0 }}
      whileInView={reduced ? undefined : { scaleX: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ originX: 0 }}
      className={cn('h-px bg-[var(--tm-border)]', className)}
    />
  )
}


// ── Tilt card - 3D perspective tilt on hover ──────────────────────────────────
export function TiltCard({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const sx = useSpring(rotateX, { stiffness: 300, damping: 30 })
  const sy = useSpring(rotateY, { stiffness: 300, damping: 30 })

  if (reduced) return <div className={cn(className)}>{children}</div>

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      style={{ rotateX: sx, rotateY: sy, transformStyle: 'preserve-3d', perspective: 800 }}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect()
        if (!rect) return
        const x = (e.clientY - rect.top - rect.height / 2) / rect.height * -10
        const y = (e.clientX - rect.left - rect.width / 2) / rect.width * 10
        rotateX.set(x); rotateY.set(y)
      }}
      onMouseLeave={() => { rotateX.set(0); rotateY.set(0) }}
    >
      {children}
    </motion.div>
  )
}

// ── Spotlight - cursor radial gradient follows mouse ──────────────────────────
export const SpotlightSection = forwardRef<HTMLDivElement, { children: ReactNode; className?: string }>(({ children, className }, forwardedRef) => {
  const reduced = useReducedMotion()
  const fallbackRef = useRef<HTMLDivElement>(null)
  const ref = (forwardedRef as React.RefObject<HTMLDivElement>) || fallbackRef
  const mouseX = useMotionValue(-999)
  const mouseY = useMotionValue(-999)
  const bg = useTransform(
    [mouseX, mouseY],
    ([x, y]) => `radial-gradient(400px circle at ${x}px ${y}px, color-mix(in srgb, var(--tm-primary) 8%, transparent), transparent 70%)`
  )
  const opacity = useTransform(mouseX, (x) => x === -999 ? 0 : 1)

  if (reduced) return <div ref={ref} className={cn(className)}>{children}</div>

  return (
    <div
      ref={ref}
      className={cn('relative', className)}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect()
        if (!rect) return
        mouseX.set(e.clientX - rect.left)
        mouseY.set(e.clientY - rect.top)
      }}
      onMouseLeave={() => { mouseX.set(-999); mouseY.set(-999) }}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{ background: bg, opacity }}
      />
      {children}
    </div>
  )
})
SpotlightSection.displayName = 'SpotlightSection'

// ── Char reveal - per-character clipPath curtain (signature Awwwards 2025) ──────
type CharRevealProps = { text: string; className?: string; delay?: number }
export function CharReveal({ text, className, delay = 0 }: CharRevealProps) {
  const reduced = useReducedMotion()
  // Split preserving spaces
  const chars = text.split('')
  return (
    <motion.span
      className={cn('inline', className)}
      initial={reduced ? false : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, margin: '-5% 0px' }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.028, delayChildren: delay } },
      }}
    >
      {chars.map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          style={{ willChange: 'transform, opacity, clip-path' }}
          variants={reduced ? {} : {
            hidden: {
              opacity: 0,
              y: '60%',
              clipPath: 'inset(100% 0 0 0)',
            },
            visible: {
              opacity: 1,
              y: '0%',
              clipPath: 'inset(0% 0 0 0)',
              transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
            },
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.span>
  )
}

// ── Clip reveal - curtain wipe for headlines and images ────────────────────────
type ClipRevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
}
export function ClipReveal({ children, className, delay = 0, direction = 'up' }: ClipRevealProps) {
  const reduced = useReducedMotion()
  const clipInit = {
    up:    'inset(100% 0 0 0)',
    down:  'inset(0 0 100% 0)',
    left:  'inset(0 0 0 100%)',
    right: 'inset(0 100% 0 0)',
  }[direction]
  return (
    <motion.div
      className={cn('overflow-hidden', className)}
      initial={reduced ? false : { clipPath: clipInit, opacity: 0 }}
      whileInView={reduced ? undefined : { clipPath: 'inset(0% 0 0 0)', opacity: 1 }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  )
}

// ── Scale reveal - buttery scale+opacity+blur (more organic than slide) ────────
export function ScaleReveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className={cn(className)}
      initial={reduced ? false : { opacity: 0, scale: 0.92, filter: 'blur(8px)' }}
      whileInView={reduced ? undefined : { opacity: 1, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-6% 0px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  )
}

// ── Marquee track - CSS infinite scroll (zero JS, pause on hover) ──────────────
type MarqueeProps = { children: ReactNode; className?: string; speed?: number; reverse?: boolean }
export function MarqueeTrack({ children, className, speed = 30, reverse = false }: MarqueeProps) {
  const reduced = useReducedMotion()
  if (reduced) return (
    <div className={cn('flex w-full overflow-hidden', className)}>
      <div className="flex min-w-full justify-around gap-6">{children}</div>
    </div>
  )
  return (
    <div className={cn('flex w-full overflow-hidden select-none', className)}>
      <div
        className="flex min-w-full shrink-0 justify-around gap-6 [&>*]:shrink-0"
        style={{
          animation: `marquee ${speed}s linear infinite${reverse ? ' reverse' : ''}`,
          animationPlayState: 'running',
        }}
        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.animationPlayState = 'paused')}
        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.animationPlayState = 'running')}
      >
        {children}
      </div>
      <div
        aria-hidden
        className="flex min-w-full shrink-0 justify-around gap-6 [&>*]:shrink-0"
        style={{ animation: `marquee ${speed}s linear infinite${reverse ? ' reverse' : ''}` }}
      >
        {children}
      </div>
    </div>
  )
}

// ── Custom cursor - spring dot with directional skew (Digitalists pattern) ─────
export function CustomCursor() {
  const reduced = useReducedMotion()
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 500, damping: 40 })
  const sy = useSpring(y, { stiffness: 500, damping: 40 })
  const scale = useMotionValue(1)
  const rotate = useMotionValue(0)
  const rotateSpring = useSpring(rotate, { stiffness: 300, damping: 40 })

  useEffect(() => {
    if (reduced) return
    let lastX = -100
    let resetTimer: ReturnType<typeof setTimeout> | null = null

    const move = (e: MouseEvent) => {
      const dx = e.clientX - lastX
      lastX = e.clientX
      x.set(e.clientX)
      y.set(e.clientY)
      // Rotation based on horizontal velocity (Digitalists 4*delta clamp -90/90)
      const target = Math.max(-90, Math.min(90, dx * 4))
      rotate.set(target)
      if (resetTimer) clearTimeout(resetTimer)
      resetTimer = setTimeout(() => rotate.set(0), 400)
    }
    const down = () => animate(scale, 0.7, { duration: 0.15 })
    const up   = () => animate(scale, 1,   { duration: 0.15 })
    const enter = (e: MouseEvent) => {
      const el = e.target as HTMLElement
      if (el.closest('a, button, [role="button"]')) animate(scale, 1.8, { duration: 0.2 })
    }
    const leave = () => animate(scale, 1, { duration: 0.2 })
    window.addEventListener('mousemove', move)
    window.addEventListener('mousedown', down)
    window.addEventListener('mouseup', up)
    document.addEventListener('mouseover', enter)
    document.addEventListener('mouseout', leave)
    return () => {
      if (resetTimer) clearTimeout(resetTimer)
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mousedown', down)
      window.removeEventListener('mouseup', up)
      document.removeEventListener('mouseover', enter)
      document.removeEventListener('mouseout', leave)
    }
  }, [x, y, scale, rotate, reduced])

  if (reduced) return null

  return (
    <motion.div
      className="pointer-events-none fixed z-[9999] rounded-full -translate-x-1/2 -translate-y-1/2 hidden md:block"
      style={{
        left: sx,
        top: sy,
        scale,
        rotate: rotateSpring,
        width: 8,
        height: 8,
        backgroundColor: 'var(--tm-primary)',
        opacity: 0.55,
        mixBlendMode: 'multiply',
      }}
    />
  )
}

// ── StaggerItem3D - elements fly in from Z-axis (NRG card grid pattern) ─────────
export function StaggerItem3D({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className={className}
      style={{ transformStyle: 'preserve-3d' }}
      variants={reduced ? {} : {
        hidden: {
          opacity: 0,
          scale: 0.85,
          rotateX: 12,
          y: 24,
          filter: 'blur(4px)',
        },
        visible: {
          opacity: 1,
          scale: 1,
          rotateX: 0,
          y: 0,
          filter: 'blur(0px)',
          transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

// ── ScrollTiltCard - card tilts driven by scroll position (Vaonis Hyperia) ───────
type ScrollTiltProps = { children: ReactNode; className?: string; maxTilt?: number }

export function ScrollTiltCard({ children, className, maxTilt = 7 }: ScrollTiltProps) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const rotateX = useTransform(
    scrollYProgress,
    [0, 0.35, 0.5, 0.65, 1],
    [maxTilt, maxTilt * 0.3, 0, -maxTilt * 0.3, -maxTilt]
  )
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.93, 1, 1, 0.93])
  const opacity = useTransform(scrollYProgress, [0, 0.12, 0.88, 1], [0, 1, 1, 0])
  const springRotateX = useSpring(rotateX, { stiffness: 80, damping: 22 })
  const springScale = useSpring(scale, { stiffness: 80, damping: 22 })

  if (reduced) return <div className={className}>{children}</div>

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        rotateX: springRotateX,
        scale: springScale,
        opacity,
        perspective: 1000,
        transformStyle: 'preserve-3d',
        willChange: 'transform, opacity',
      }}
    >
      {children}
    </motion.div>
  )
}

// ── DepthReveal - section entrance with Z-depth + blur (EatNaked/Digitalists) ───
export function DepthReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, scale: 0.9, y: 40, filter: 'blur(12px)', rotateX: 8 }}
      whileInView={reduced ? undefined : { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)', rotateX: 0 }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay }}
      style={{ transformStyle: 'preserve-3d', perspective: 800 }}
    >
      {children}
    </motion.div>
  )
}

// ── MouseParallaxLayer — NRG dual-lag mouse parallax ─────────────────────────
// Wrap hero content in this. Background layer moves slow, foreground fast.
export function MouseParallaxLayer({
  children,
  className,
  strength = 16,
  lag = 12,
}: {
  children: ReactNode
  className?: string
  strength?: number
  lag?: number
}) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const state = useRef({ x: 0, y: 0, xLag: 0, yLag: 0 })
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (reduced) return
    const onMove = (e: MouseEvent) => {
      state.current.x = e.clientX
      state.current.y = e.clientY
    }
    window.addEventListener('mousemove', onMove)
    const tick = () => {
      const s = state.current
      s.xLag += (s.x - s.xLag) / lag
      s.yLag += (s.y - s.yLag) / lag
      if (ref.current) {
        const x = (s.xLag / window.innerWidth - 0.5) * -strength
        const y = (s.yLag / window.innerHeight - 0.5) * -(strength * 0.6)
        ref.current.style.transform = `translate(${x}px, ${y}px)`
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [reduced, lag, strength])

  return (
    <div ref={ref} className={cn('will-change-transform', className)}>
      {children}
    </div>
  )
}

// ── TiltCard3D — Digitalists 3D tilt with content depth parallax ─────────────
export function TiltCard3D({
  children,
  className,
  maxTilt = 12,
  perspective = 1000,
}: {
  children: ReactNode
  className?: string
  maxTilt?: number
  perspective?: number
}) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness: 150, damping: 20 })
  const y = useSpring(rawY, { stiffness: 150, damping: 20 })
  const rotateX = useTransform(y, [-0.5, 0.5], [maxTilt, -maxTilt])
  const rotateY = useTransform(x, [-0.5, 0.5], [-maxTilt, maxTilt])
  const contentX = useTransform(x, [-0.5, 0.5], [-12, 12])
  const contentY = useTransform(y, [-0.5, 0.5], [-6, 6])

  if (reduced) return <div className={className}>{children}</div>

  return (
    <div style={{ perspective }}>
      <motion.div
        ref={ref}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className={cn('cursor-pointer', className)}
        onMouseMove={(e) => {
          const rect = ref.current!.getBoundingClientRect()
          rawX.set((e.clientX - rect.left) / rect.width - 0.5)
          rawY.set((e.clientY - rect.top) / rect.height - 0.5)
        }}
        onMouseLeave={() => { rawX.set(0); rawY.set(0) }}
      >
        <motion.div style={{ x: contentX, y: contentY }}>
          {children}
        </motion.div>
      </motion.div>
    </div>
  )
}

