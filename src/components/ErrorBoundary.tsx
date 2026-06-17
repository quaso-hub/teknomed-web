import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

/**
 * ErrorBoundary - catch render errors in child tree, show friendly fallback
 * instead of white screen. Place around <Suspense> in App.tsx.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div className="grid min-h-[60vh] place-items-center px-4">
          <div className="max-w-md text-center">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.22em] text-[var(--tm-muted)]">
              Error
            </p>
            <h2 className="mt-3 font-serif text-2xl font-bold text-[var(--tm-text-strong)]">
              Terjadi kesalahan
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--tm-muted)]">
              Maaf, halaman ini gagal dimuat. Silakan muat ulang atau kembali
              ke beranda.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="inline-flex h-10 items-center justify-center rounded-lg bg-[var(--tm-primary)] px-5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
              >
                Muat Ulang
              </button>
              <a
                href="/"
                className="inline-flex h-10 items-center justify-center rounded-lg border border-[var(--tm-border)] px-5 text-sm font-medium text-[var(--tm-text)] hover:bg-[var(--tm-surface-muted)] transition-colors"
              >
                Ke Beranda
              </a>
            </div>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
