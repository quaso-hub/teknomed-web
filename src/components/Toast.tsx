import { useState, useCallback, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'
import { X, Check, AlertTriangle, Info as InfoIcon, CircleAlert } from 'lucide-react'
import { ToastContext, type ToastType } from './toast-context'

interface ToastItem {
  id: number
  message: string
  type: ToastType
  duration: number
}

function ToastIcon({ type }: { type: ToastType }) {
  switch (type) {
    case 'success': return <Check className="size-5 text-emerald-500" />
    case 'error': return <CircleAlert className="size-5 text-red-500" />
    case 'warning': return <AlertTriangle className="size-5 text-amber-500" />
    case 'info': return <InfoIcon className="size-5 text-sky-500" />
  }
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const idRef = useRef(0)

  const addToast = useCallback((message: string, type: ToastType = 'info', duration = 4000) => {
    const id = ++idRef.current
    setToasts((prev) => [...prev, { id, message, type, duration }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, duration)
  }, [])

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {createPortal(
        <div
          className="fixed bottom-6 left-1/2 z-[100] flex -translate-x-1/2 flex-col gap-2 px-4"
          role="region"
          aria-label="Notifications"
        >
          <AnimatePresence mode="popLayout">
            {toasts.map((toast) => (
              <motion.div
                key={toast.id}
                layout
                role={toast.type === 'error' ? 'alert' : 'status'}
                aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="flex w-full max-w-sm items-start gap-3 rounded-xl border border-[var(--tm-border)] bg-[var(--tm-surface)] p-4 shadow-lg"
              >
                <div className="shrink-0 pt-0.5"><ToastIcon type={toast.type} /></div>
                <p className="flex-1 text-sm text-[var(--tm-text)] leading-5">{toast.message}</p>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="shrink-0 text-[var(--tm-muted)] hover:text-[var(--tm-text)] transition-colors"
                  aria-label="Close toast"
                >
                  <X className="size-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  )
}
