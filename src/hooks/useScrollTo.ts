import { useCallback } from 'react'

/**
 * QoL hook: smooth scroll to a selector or top.
 * Returns a click handler and a programmatic trigger.
 */
export function useScrollTo() {
  const scrollTo = useCallback((target?: string | number) => {
    if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior: 'smooth' })
      return
    }
    if (typeof target === 'string') {
      const el = document.querySelector(target)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      return
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return { scrollTo }
}
