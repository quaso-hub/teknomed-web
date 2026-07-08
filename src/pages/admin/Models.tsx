import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

interface Model3D {
  id: string
  product_id: string
  product_name?: string
  storage_path: string
  asset_type: string
  metadata: any
  created_at: string
}

export function AdminModels() {
  const [models, setModels] = useState<Model3D[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formData, setFormData] = useState({ product_id: '', storage_path: '', asset_type: 'model' })
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const fetchModels = async () => {
    setLoading(true)
    const { data: assets } = await supabase.from('product_3d_assets').select('*').order('created_at', { ascending: false })
    const { data: prods } = await supabase.from('products').select('id, name, slug')
    if (prods) setProducts(prods)
    if (assets) {
      const enriched = assets.map(a => ({
        ...a,
        product_name: prods?.find(p => p.id === a.product_id)?.name || 'Unknown'
      }))
      setModels(enriched)
    }
    setLoading(false)
  }

  useEffect(() => { fetchModels() }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    await supabase.from('product_3d_assets').insert([formData])
    await supabase.from('products').update({ has_3d: true }).eq('id', formData.product_id)
    setIsFormOpen(false)
    setFormData({ product_id: '', storage_path: '', asset_type: 'model' })
    fetchModels()
  }

  const handleDelete = async (id: string, productId: string) => {
    if (!confirm("Hapus model 3D ini?")) return
    await supabase.from('product_3d_assets').delete().eq('id', id)
    const { count } = await supabase.from('product_3d_assets').select('*', { count: 'exact', head: true }).eq('product_id', productId)
    if (!count || count === 0) {
      await supabase.from('products').update({ has_3d: false }).eq('id', productId)
    }
    fetchModels()
  }

  if (isFormOpen) {
    return (
      <div className="max-w-2xl">
        <div className="border border-[#222] bg-[#111] p-6">
          <h2 className="text-lg uppercase tracking-widest border-b border-[#222] pb-4 mb-6">Tambah Model 3D</h2>
          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="block text-xs uppercase text-gray-400 mb-2">Produk</label>
              <select
                required
                value={formData.product_id}
                onChange={e => setFormData({...formData, product_id: e.target.value})}
                className="w-full bg-[#0a0a0a] border border-[#333] p-3 text-sm text-white outline-none focus:border-gray-500"
              >
                <option value="">Pilih produk...</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name} (/{p.slug})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase text-gray-400 mb-2">URL Model .GLB</label>
              <input
                required
                value={formData.storage_path}
                onChange={e => setFormData({...formData, storage_path: e.target.value})}
                placeholder="https://...supabase.co/storage/v1/object/public/3d-models/..."
                className="w-full bg-[#0a0a0a] border border-[#333] p-3 text-sm text-white outline-none focus:border-gray-500"
              />
              <p className="text-[10px] text-gray-600 mt-1">Upload file .glb ke Supabase Storage bucket "3d-models", lalu paste public URL di sini.</p>
            </div>
            <div>
              <label className="block text-xs uppercase text-gray-400 mb-2">Tipe Asset</label>
              <select
                value={formData.asset_type}
                onChange={e => setFormData({...formData, asset_type: e.target.value})}
                className="w-full bg-[#0a0a0a] border border-[#333] p-3 text-sm text-white outline-none focus:border-gray-500"
              >
                <option value="model">Model 3D (.glb)</option>
                <option value="texture">Texture</option>
                <option value="screenshot">Screenshot</option>
              </select>
            </div>
            <div className="flex gap-3 pt-4 border-t border-[#222]">
              <button type="button" onClick={() => setIsFormOpen(false)} className="flex-1 border border-[#333] py-2.5 text-sm uppercase hover:bg-[#1a1a1a]">Batal</button>
              <button type="submit" className="flex-1 bg-white text-black py-2.5 text-sm uppercase font-bold hover:bg-gray-200">Simpan</button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-[#222] pb-4">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-wider">Model 3D</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola asset 3D untuk produk</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-white text-black px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-gray-200"
        >
          + Tambah Model
        </button>
      </div>

      {/* Preview Panel */}
      {previewUrl && (
        <div className="border border-[#333] bg-[#111] p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase text-gray-400">Preview Model</span>
            <button onClick={() => setPreviewUrl(null)} className="text-xs text-gray-500 hover:text-white">Tutup</button>
          </div>
          <div className="aspect-video bg-[#0a0a0a] rounded overflow-hidden">
            <model-viewer
              src={previewUrl}
              alt="3D Preview"
              camera-controls
              auto-rotate
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </div>
      )}

      {/* Models Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border border-[#222] bg-[#111] p-5 animate-pulse">
              <div className="h-4 bg-[#222] rounded w-3/4 mb-3" />
              <div className="h-3 bg-[#222] rounded w-1/2" />
            </div>
          ))
        ) : models.length === 0 ? (
          <div className="col-span-full border border-[#222] bg-[#111] p-12 text-center">
            <div className="text-4xl mb-4">◇</div>
            <div className="text-gray-400 text-sm">Belum ada model 3D</div>
            <div className="text-gray-600 text-xs mt-1">Tambah model pertama untuk produk Anda</div>
          </div>
        ) : (
          models.map((model) => (
            <div key={model.id} className="border border-[#222] bg-[#111] hover:border-[#333] transition-colors">
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-semibold text-sm">{model.product_name}</div>
                    <div className="text-[10px] text-gray-600 uppercase mt-1">{model.asset_type}</div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 bg-green-400/10 text-green-400 rounded">Active</span>
                </div>
                <div className="text-xs text-gray-500 truncate mb-4">{model.storage_path}</div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPreviewUrl(model.storage_path)}
                    className="flex-1 text-xs py-1.5 border border-[#333] hover:bg-[#1a1a1a] transition-colors"
                  >
                    Preview
                  </button>
                  <a
                    href={model.storage_path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-xs py-1.5 border border-[#333] hover:bg-[#1a1a1a] transition-colors text-center"
                  >
                    Download
                  </a>
                  <button
                    onClick={() => handleDelete(model.id, model.product_id)}
                    className="text-xs py-1.5 px-3 border border-red-900/50 text-red-400 hover:bg-red-900/20 transition-colors"
                  >
                    Del
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
