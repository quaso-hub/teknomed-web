import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

interface Product3D {
  id: string
  slug: string
  name: string
  short_name: string
  category: string
  has_3d: boolean
  viewer_config: any
  image_url: string
  updated_at: string
}

export function AdminModels() {
  const [products, setProducts] = useState<Product3D[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | '3d' | 'no-3d'>('all')
  const [editSlug, setEditSlug] = useState<string | null>(null)
  const [editConfig, setEditConfig] = useState('')

  const fetchProducts = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('products').select('*').order('sort_order')
    if (data) {
      const parsed = data.map((p: any) => ({
        ...p,
        viewer_config: typeof p.viewer_config === 'string' ? (() => { try { return JSON.parse(p.viewer_config) } catch { return {} } })() : (p.viewer_config || {})
      }))
      setProducts(parsed)
    }
    setLoading(false)
  }

  useEffect(() => { fetchProducts() }, [])

  const filtered = products.filter(p => {
    if (filter === '3d') return p.has_3d
    if (filter === 'no-3d') return !p.has_3d
    return true
  })

  const handleSaveConfig = async () => {
    if (!editSlug) return
    try {
      const parsed = JSON.parse(editConfig)
      await supabase.from('products').update({ viewer_config: JSON.stringify(parsed), has_3d: true }).eq('slug', editSlug)
      setEditSlug(null)
      fetchProducts()
    } catch {
      alert('JSON tidak valid')
    }
  }

  const viewerBaseUrl = 'https://3d.teknomed.web.id/viewer'

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-[#222] pb-4">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-wider">Model 3D</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola mapping produk → 3D viewer</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setFilter('all')} className={`text-xs px-3 py-1.5 border ${filter === 'all' ? 'border-white text-white' : 'border-[#333] text-gray-500'} hover:bg-[#1a1a1a]`}>Semua</button>
          <button onClick={() => setFilter('3d')} className={`text-xs px-3 py-1.5 border ${filter === '3d' ? 'border-white text-white' : 'border-[#333] text-gray-500'} hover:bg-[#1a1a1a]`}>Ada 3D</button>
          <button onClick={() => setFilter('no-3d')} className={`text-xs px-3 py-1.5 border ${filter === 'no-3d' ? 'border-white text-white' : 'border-[#333] text-gray-500'} hover:bg-[#1a1a1a]`}>Belum Ada</button>
        </div>
      </div>

      {/* Edit Config Dialog */}
      {editSlug && (
        <div className="border border-[#444] bg-[#111] p-6">
          <h3 className="text-sm uppercase tracking-wider font-semibold mb-4">Edit Viewer Config: {editSlug}</h3>
          <textarea
            value={editConfig}
            onChange={e => setEditConfig(e.target.value)}
            className="w-full h-40 bg-[#0a0a0a] border border-[#333] p-3 text-sm text-green-400 font-mono"
            placeholder='{"viewerProduct":"pass-box","related":["scrub-sink"]}'
          />
          <div className="flex gap-3 mt-4">
            <button onClick={() => setEditSlug(null)} className="border border-[#333] px-4 py-2 text-sm uppercase hover:bg-[#1a1a1a]">Batal</button>
            <button onClick={handleSaveConfig} className="bg-white text-black px-4 py-2 text-sm uppercase font-bold hover:bg-gray-200">Simpan</button>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border border-[#222] bg-[#111] p-5 animate-pulse">
              <div className="h-4 bg-[#222] rounded w-3/4 mb-3" />
              <div className="h-3 bg-[#222] rounded w-1/2" />
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div className="col-span-full border border-[#222] bg-[#111] p-12 text-center">
            <div className="text-gray-400 text-sm">Tidak ada produk</div>
          </div>
        ) : (
          filtered.map((product) => {
            const config = product.viewer_config || {}
            const viewerProduct = config.viewerProduct
            const related = config.related || []
            const viewerUrl = viewerProduct ? `${viewerBaseUrl}?product=${viewerProduct}` : null

            return (
              <div key={product.id} className={`border ${product.has_3d ? 'border-green-900/40' : 'border-[#222]'} bg-[#111] hover:border-[#444] transition-colors`}>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-semibold text-sm">{product.name}</div>
                      <div className="text-[10px] text-gray-600 font-mono mt-1">/{product.slug}</div>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded ${product.has_3d ? 'bg-green-400/10 text-green-400 border border-green-500/30' : 'bg-gray-800 text-gray-500 border border-[#333]'}`}>
                      {product.has_3d ? '3D Ready' : 'No 3D'}
                    </span>
                  </div>

                  {product.has_3d && viewerProduct && (
                    <div className="mb-4">
                      <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Viewer Product</div>
                      <div className="text-sm font-mono text-green-400">{viewerProduct}</div>
                      {related.length > 0 && (
                        <div className="mt-2">
                          <div className="text-[10px] text-gray-600">Related:</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {related.map((r: string) => (
                              <span key={r} className="text-[9px] border border-[#333] px-1.5 py-0.5 text-gray-400">{r}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2 mt-4">
                    {viewerUrl && (
                      <a
                        href={viewerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-xs py-1.5 border border-green-900/50 text-green-400 hover:bg-green-900/20 transition-colors text-center"
                      >
                        Preview 3D
                      </a>
                    )}
                    <button
                      onClick={() => {
                        setEditSlug(product.slug)
                        setEditConfig(JSON.stringify(config, null, 2))
                      }}
                      className="flex-1 text-xs py-1.5 border border-[#333] text-gray-400 hover:bg-[#1a1a1a] transition-colors"
                    >
                      Edit Config
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
