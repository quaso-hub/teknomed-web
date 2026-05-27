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
import { useEffect, useRef, useState } from 'react'
import { cn } from '../lib/utils'

function useWindowWidth() {
  const [w, setW] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1024))
  useEffect(() => {
    const handler = () => setW(window.innerWidth)
    window.addEventListener('resize', handler, { passive: true })
    return () => window.removeEventListener('resize', handler)
  }, [])
  return w
}

export function AppMotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}

// ── Reveal on scroll ──────────────────────────────────────────────────────────
type RevealProps = { children: ReactNode; className?: string; delay?: number }

export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 20 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-6% 0px' }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94], delay }}
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

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      variants={reduced ? {} : {
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] } },
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

// ── Parallax section background ───────────────────────────────────────────────
export function ParallaxBg({ children, className, speed = 0.15 }: { children: ReactNode; className?: string; speed?: number }) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', `${speed * 100}%`])

  return (
    <div ref={ref} className={cn('relative overflow-hidden', className)}>
      <motion.div style={reduced ? undefined : { y }} className="absolute inset-0 -z-10">
        {children}
      </motion.div>
    </div>
  )
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


// ── Text scramble - characters shuffle then resolve ───────────────────────────
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
export function TextScramble({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useRef(false)

  useEffect(() => {
    if (reduced || !ref.current) return
    const el = ref.current
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || inView.current) return
      inView.current = true
      let frame = 0
      const totalFrames = 12
      const timer = setTimeout(() => {
        const interval = setInterval(() => {
          el.textContent = text.split('').map((char, i) => {
            if (char === ' ') return ' '
            if (frame / totalFrames > i / text.length) return char
            // Only scramble 1 char at a time, not all at once
            return i === Math.floor((1 - frame / totalFrames) * text.length)
              ? CHARS[Math.floor(Math.random() * CHARS.length)]
              : char
          }).join('')
          if (++frame > totalFrames) { el.textContent = text; clearInterval(interval) }
        }, 80)
      }, delay * 1000)
      return () => clearTimeout(timer)
    }, { threshold: 0.5 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [text, delay, reduced])

  return <span ref={ref} className={cn(className)}>{text}</span>
}

// ── Word reveal - words fade in staggered on scroll ───────────────────────────
export function WordReveal({ text, className }: { text: string; className?: string }) {
  const reduced = useReducedMotion()
  const words = text.split(' ')
  return (
    <motion.span
      className={cn('inline', className)}
      initial={reduced ? false : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, margin: '-10% 0px' }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.25em]"
          variants={reduced ? {} : {
            hidden: { opacity: 0, y: 12, filter: 'blur(4px)' },
            visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
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
export function SpotlightSection({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(-999)
  const mouseY = useMotionValue(-999)
  const bg = useTransform(
    [mouseX, mouseY],
    ([x, y]) => `radial-gradient(400px circle at ${x}px ${y}px, color-mix(in srgb, var(--tm-primary) 8%, transparent), transparent 70%)`
  )
  const opacity = useTransform(mouseX, (x) => x === -999 ? 0 : 1)

  if (reduced) return <div className={cn(className)}>{children}</div>

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
}

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

// ── Horizontal scroll section - pinned sticky (Awwwards #1 pattern 2025) ───────
type HorizontalScrollProps = {
  children: ReactNode
  className?: string
  /** Number of full-screen panels */
  panels: number
  /** Disable on mobile (recommended) */
  mobileBreakpoint?: number
}

/** Single progress dot - extracted so useTransform stays at top level */
function HScrollDot({
  index,
  total,
  scrollYProgress,
}: {
  index: number
  total: number
  scrollYProgress: import('motion/react').MotionValue<number>
}) {
  const width = useTransform(
    scrollYProgress,
    [index / total, (index + 0.5) / total],
    [6, 20]
  )
  const opacity = useTransform(
    scrollYProgress,
    [(index - 0.2) / total, index / total, (index + 0.8) / total, (index + 1) / total],
    [0.3, 1, 1, 0.3]
  )
  return (
    <motion.div
      className="rounded-full"
      style={{
        width,
        height: 6,
        backgroundColor: 'var(--tm-primary)',
        opacity,
      }}
    />
  )
}

export function HorizontalScrollSection({
  children,
  className,
  panels,
  mobileBreakpoint = 768,
}: HorizontalScrollProps) {
  const reduced = useReducedMotion()
  const width = useWindowWidth()
  const isMobile = width < mobileBreakpoint
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ['0%', `-${(panels - 1) * 100}%`]
  )
  const smoothX = useSpring(x, { stiffness: 100, damping: 30 })

  // Mobile or reduced motion: just render children as-is
  if (isMobile || reduced) {
    return <div className={cn(className)}>{children}</div>
  }

  return (
    <section
      ref={ref}
      className={cn('relative', className)}
      style={{ height: `${panels * 100}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div
          style={{ x: smoothX, willChange: 'transform' }}
          className="flex h-full"
        >
          {children}
        </motion.div>
        {/* Progress dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {Array.from({ length: panels }).map((_, i) => (
            <HScrollDot key={i} index={i} total={panels} scrollYProgress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Marquee track - CSS infinite scroll (zero JS, pause on hover) ──────────────
type MarqueeProps = { children: ReactNode; className?: string; speed?: number; reverse?: boolean }
export function MarqueeTrack({ children, className, speed = 30, reverse = false }: MarqueeProps) {
  const reduced = useReducedMotion()
  if (reduced) return <div className={cn('flex overflow-hidden', className)}>{children}</div>
  return (
    <div className={cn('flex overflow-hidden select-none', className)}>
      <div
        className="flex shrink-0 gap-6 [&>*]:shrink-0 group"
        style={{
          animation: `marquee ${speed}s linear infinite${reverse ? ' reverse' : ''}`,
          animationPlayState: 'running',
        }}
        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.animationPlayState = 'paused')}
        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.animationPlayState = 'running')}
      >
        {children}
      </div>
      {/* Duplicate for seamless loop */}
      <div
        aria-hidden
        className="flex shrink-0 gap-6 [&>*]:shrink-0"
        style={{ animation: `marquee ${speed}s linear infinite${reverse ? ' reverse' : ''}` }}
      >
        {children}
      </div>
    </div>
  )
}

// ── Custom cursor - spring dot following mouse (hidden on touch devices) ────────
export function CustomCursor() {
  const reduced = useReducedMotion()
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 500, damping: 40 })
  const sy = useSpring(y, { stiffness: 500, damping: 40 })
  const scale = useMotionValue(1)

  useEffect(() => {
    if (reduced) return
    const move = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY) }
    const down = () => animate(scale, 0.7, { duration: 0.15 })
    const up   = () => animate(scale, 1,   { duration: 0.15 })
    // Grow on hoverable elements
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
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mousedown', down)
      window.removeEventListener('mouseup', up)
      document.removeEventListener('mouseover', enter)
      document.removeEventListener('mouseout', leave)
    }
  }, [x, y, scale, reduced])

  if (reduced) return null

  return (
    <motion.div
      className="pointer-events-none fixed z-[9999] rounded-full -translate-x-1/2 -translate-y-1/2 hidden md:block"
      style={{
        left: sx,
        top: sy,
        scale,
        width: 8,
        height: 8,
        backgroundColor: 'var(--tm-primary)',
        opacity: 0.55,
        mixBlendMode: 'multiply',
      }}
    />
  )
}

// ── View parallax - element moves at different speed when scrolling ─────────────
type ViewParallaxProps = {
  children: ReactNode
  className?: string
  speed?: number  // positive = slow, negative = opposite direction
}
export function ViewParallax({ children, className, speed = 0.3 }: ViewParallaxProps) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [`-${speed * 100}%`, `${speed * 100}%`])

  if (reduced) return <div className={cn(className)}>{children}</div>

  return (
    <div ref={ref} className={cn('overflow-hidden', className)}>
      <motion.div style={{ y, willChange: 'transform' }}>
        {children}
      </motion.div>
    </div>
  )
}
