import { useEffect } from 'react'

/**
 * QoL hook: register a global keyboard shortcut.
 * Usage: useHotkey('k', (e) => { if (e.metaKey || e.ctrlKey) setOpen(true) })
 */
export function useHotkey(
  key: string,
  callback: (e: KeyboardEvent) => void,
  options?: { meta?: boolean; ctrl?: boolean; shift?: boolean; preventDefault?: boolean }
) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== key.toLowerCase()) return
      if (options?.meta && !e.metaKey) return
      if (options?.ctrl && !e.ctrlKey) return
      if (options?.shift && !e.shiftKey) return

      if (options?.preventDefault !== false) e.preventDefault()
      callback(e)
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [key, callback, options])
}
