import { useState, useRef, useEffect } from "react"
import { Download, X, Loader2, FileText, Eye } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"

interface CatalogPreviewProps {
  isOpen: boolean
  onClose: () => void
}

export function CatalogPreview({ isOpen, onClose }: CatalogPreviewProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (!isOpen) {
      setPdfUrl(null)
      setError(null)
      setLoading(false)
      return
    }

    // Auto-generate PDF when dialog opens
    const generatePdf = async () => {
      setLoading(true)
      setError(null)
      try {
        const resp = await fetch('https://api.teknomed.web.id/api/pdf/generate', {
          method: 'POST',
          signal: AbortSignal.timeout(120000),
        })
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
        const data = await resp.json()
        if (data.url) {
          setPdfUrl(data.url)
        } else if (data.error) {
          setError(data.error)
        } else {
          setError('PDF generation failed')
        }
      } catch (err: any) {
        setError(err.message || 'Failed to generate PDF')
      }
      setLoading(false)
    }
    generatePdf()
  }, [isOpen])

  const handleDownload = () => {
    if (!pdfUrl) return
    const a = document.createElement('a')
    a.href = pdfUrl
    a.download = 'Teknomed-Katalog.pdf'
    a.target = '_blank'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex flex-col bg-black/90 backdrop-blur-sm"
          onClick={onClose}
        >
          {/* Header Bar */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center justify-between px-6 py-3 bg-[var(--tm-surface)] border-b border-[var(--tm-border)]"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <FileText className="size-5 text-[var(--tm-primary)]" />
              <div>
                <h2 className="text-sm font-bold text-[var(--tm-text-strong)]">Katalog Produk Teknomed</h2>
                <p className="text-xs text-[var(--tm-muted)]">Preview sebelum download</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {pdfUrl && (
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 rounded-lg bg-[var(--tm-primary)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                >
                  <Download className="size-4" />
                  Download PDF
                </button>
              )}
              <button
                onClick={onClose}
                className="grid size-9 place-items-center rounded-lg border border-[var(--tm-border)] text-[var(--tm-muted)] hover:bg-[var(--tm-surface-muted)] transition-colors"
                aria-label="Close preview"
              >
                <X className="size-4" />
              </button>
            </div>
          </motion.div>

          {/* PDF Content */}
          <div className="flex-1 overflow-hidden" onClick={e => e.stopPropagation()}>
            {loading && (
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <Loader2 className="size-8 text-[var(--tm-primary)] animate-spin" />
                <div className="text-center">
                  <p className="text-sm font-semibold text-white">Generating catalog...</p>
                  <p className="text-xs text-gray-400 mt-1">This may take 30-60 seconds</p>
                </div>
              </div>
            )}

            {error && (
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <div className="grid size-16 place-items-center rounded-full bg-red-500/10">
                  <X className="size-8 text-red-400" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-white">Failed to generate catalog</p>
                  <p className="text-xs text-gray-400 mt-1">{error}</p>
                  <button
                    onClick={onClose}
                    className="mt-4 text-xs text-gray-400 underline hover:text-white"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {pdfUrl && !loading && (
              <iframe
                ref={iframeRef}
                src={pdfUrl}
                className="w-full h-full border-0"
                title="Catalog Preview"
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
