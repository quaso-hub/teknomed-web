import { ReactNode } from 'react'
import { ReactLenis } from 'lenis/react'

interface SmoothScrollProviderProps {
  children: ReactNode
}

/**
 * Wraps the app with Lenis smooth inertial scrolling.
 * Disabled on touch devices automatically (smoothTouch: false).
 * Compatible with motion/react useScroll + useTransform.
 */
export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.2,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
      }}
    >
      {children}
    </ReactLenis>
  )
}
