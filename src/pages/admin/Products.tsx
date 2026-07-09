import { useEffect, useState, useMemo } from "react"
import { supabase } from "../../lib/supabase"
import { useToast } from "../../components/toast-context"

const CATEGORIES = ["Konstruksi", "Penjualan", "Maintenance"] as const

const EMPTY_FORM = {
  name: "",
  category: "Konstruksi" as string,
  desc: "",
  summary: "",
  slug: "",
  published: true,
  has_3d: false,
  model_url: "",
}

export function AdminProducts() {
  const { addToast } = useToast()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("")
  const [showUnpublished, setShowUnpublished] = useState(false)

  const fetchProducts = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    if (error) {
      console.error('[Products] fetch error:', error.message)
      addToast("Gagal memuat data produk", "error")
    } else if (data) {
      setProducts(data)
    }
    setLoading(false)
  }

  useEffect(() => { fetchProducts() }, [])

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (!showUnpublished && !p.published) return false
      if (categoryFilter && p.category !== categoryFilter) return false
      if (search) {
        const q = search.toLowerCase()
        return (
          p.name?.toLowerCase().includes(q) ||
          p.slug?.toLowerCase().includes(q) ||
          p.desc?.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [products, search, categoryFilter, showUnpublished])

  const openCreateForm = () => {
    setEditingId(null)
    setFormData(EMPTY_FORM)
    setIsFormOpen(true)
  }

  const openEditForm = (product: any) => {
    setEditingId(product.id)
    setFormData({
      name: product.name || "",
      category: product.category || "Konstruksi",
      desc: product.desc || "",
      summary: product.summary || "",
      slug: product.slug || "",
      published: product.published ?? true,
      has_3d: product.has_3d ?? false,
      model_url: product.model_url || "",
    })
    setIsFormOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (editingId) {
        const { error } = await supabase
          .from('products')
          .update({
            name: formData.name,
            category: formData.category,
            desc: formData.desc,
            summary: formData.summary,
            slug: formData.slug,
            published: formData.published,
            has_3d: formData.has_3d,
            model_url: formData.model_url || null,
          })
          .eq('id', editingId)

        if (error) throw error
        addToast("Produk berhasil diperbarui", "success")
      } else {
        const { error } = await supabase
          .from('products')
          .insert([{
            name: formData.name,
            category: formData.category,
            desc: formData.desc,
            summary: formData.summary,
            slug: formData.slug,
            published: formData.published,
            has_3d: formData.has_3d,
            model_url: formData.model_url || null,
          }])

        if (error) throw error
        addToast("Produk berhasil ditambahkan", "success")
      }

      setIsFormOpen(false)
      fetchProducts()
    } catch (err: any) {
      console.error('[Products] save error:', err)
      addToast(`Gagal menyimpan: ${err.message}`, "error")
    } finally {
      setSaving(false)
    }
  }

  const handleSoftDelete = async (id: string, name: string) => {
    if (!confirm(`Nonaktifkan produk "${name}"? Produk tidak akan tampil di publik.`)) return

    const { error } = await supabase
      .from('products')
      .update({ published: false })
      .eq('id', id)

    if (error) {
      console.error('[Products] soft delete error:', error)
      addToast(`Gagal menonaktifkan: ${error.message}`, "error")
    } else {
      addToast(`"${name}" dinonaktifkan`, "success")
      fetchProducts()
    }
  }

  const handleRestore = async (id: string, name: string) => {
    const { error } = await supabase
      .from('products')
      .update({ published: true })
      .eq('id', id)

    if (error) {
      addToast(`Gagal mengaktifkan: ${error.message}`, "error")
    } else {
      addToast(`"${name}" diaktifkan kembali`, "success")
      fetchProducts()
    }
  }

  if (isFormOpen) {
    return (
      <div className="max-w-2xl border border-[#333] p-8 bg-[#111]">
        <h2 className="text-xl uppercase tracking-widest border-b border-[#333] pb-4 mb-6">
          {editingId ? "Edit Produk" : "Tambah Produk Baru"}
        </h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase text-gray-400 mb-1">Nama *</label>
              <input
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#0a0a0a] border border-[#333] p-2 text-sm text-white outline-none focus:border-gray-500"
              />
            </div>
            <div>
              <label className="block text-xs uppercase text-gray-400 mb-1">Slug *</label>
              <input
                required
                value={formData.slug}
                onChange={e => setFormData({ ...formData, slug: e.target.value })}
                className="w-full bg-[#0a0a0a] border border-[#333] p-2 text-sm text-white outline-none focus:border-gray-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase text-gray-400 mb-1">Kategori</label>
            <select
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-[#0a0a0a] border border-[#333] p-2 text-sm text-white outline-none focus:border-gray-500"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase text-gray-400 mb-1">Ringkasan</label>
            <input
              value={formData.summary}
              onChange={e => setFormData({ ...formData, summary: e.target.value })}
              className="w-full bg-[#0a0a0a] border border-[#333] p-2 text-sm text-white outline-none focus:border-gray-500"
            />
          </div>
          <div>
            <label className="block text-xs uppercase text-gray-400 mb-1">Deskripsi *</label>
            <textarea
              required
              value={formData.desc}
              onChange={e => setFormData({ ...formData, desc: e.target.value })}
              className="w-full bg-[#0a0a0a] border border-[#333] p-2 text-sm text-white h-24 outline-none focus:border-gray-500"
            />
          </div>
          <div>
            <label className="block text-xs uppercase text-gray-400 mb-1">3D Model URL (Opsional)</label>
            <input
              value={formData.model_url}
              onChange={e => setFormData({ ...formData, model_url: e.target.value, has_3d: !!e.target.value })}
              placeholder="https://..."
              className="w-full bg-[#0a0a0a] border border-[#333] p-2 text-sm text-white outline-none focus:border-gray-500"
            />
            <p className="text-[10px] text-gray-500 mt-1">Paste public URL file .glb dari Supabase Storage.</p>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-gray-400">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={e => setFormData({ ...formData, published: e.target.checked })}
                className="accent-white"
              />
              Publikasikan
            </label>
          </div>
          <div className="flex gap-4 pt-6 border-t border-[#333]">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="flex-1 border border-[#333] py-2 text-sm uppercase hover:bg-[#222]"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-white text-black py-2 text-sm uppercase font-bold hover:bg-gray-200 disabled:opacity-50"
            >
              {saving ? "Menyimpan..." : "Simpan Data"}
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-[#333] pb-4">
        <h1 className="text-3xl font-bold uppercase tracking-widest">Katalog Produk</h1>
        <button
          onClick={openCreateForm}
          className="bg-white text-black px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-gray-200"
        >
          + Tambah Data
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="Cari produk..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-[#0a0a0a] border border-[#333] px-3 py-2 text-sm text-white outline-none focus:border-gray-500 w-64"
        />
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="bg-[#0a0a0a] border border-[#333] px-3 py-2 text-sm text-white outline-none focus:border-gray-500"
        >
          <option value="">Semua Kategori</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <label className="flex items-center gap-2 text-xs text-gray-400">
          <input
            type="checkbox"
            checked={showUnpublished}
            onChange={e => setShowUnpublished(e.target.checked)}
            className="accent-white"
          />
          Tampilkan nonaktif
        </label>
        <span className="text-xs text-gray-600">{filteredProducts.length} produk</span>
      </div>

      <div className="border border-[#333] overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-400 uppercase bg-[#111] border-b border-[#333]">
            <tr>
              <th className="px-4 py-3 font-normal">Produk</th>
              <th className="px-4 py-3 font-normal">Kategori</th>
              <th className="px-4 py-3 font-normal text-center">Status</th>
              <th className="px-4 py-3 font-normal text-center">3D</th>
              <th className="px-4 py-3 font-normal text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center p-8 text-gray-500">Loading...</td></tr>
            ) : filteredProducts.length === 0 ? (
              <tr><td colSpan={5} className="text-center p-8 text-gray-600">Tidak ada produk ditemukan</td></tr>
            ) : (
              filteredProducts.map(p => (
                <tr key={p.id} className={`border-b border-[#333] hover:bg-[#111]/50 ${!p.published ? 'opacity-50' : ''}`}>
                  <td className="px-4 py-4">
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-xs text-gray-500">/{p.slug}</div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-[10px] border border-[#333] px-2 py-1 rounded-sm">{p.category}</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    {p.published ? (
                      <span className="text-[10px] bg-green-900/30 text-green-400 border border-green-500/30 px-2 py-1 uppercase tracking-wider">Aktif</span>
                    ) : (
                      <span className="text-[10px] bg-red-900/30 text-red-400 border border-red-500/30 px-2 py-1 uppercase tracking-wider">Nonaktif</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-center">
                    {p.has_3d ? (
                      <span className="text-[10px] bg-green-900/30 text-green-400 border border-green-500/30 px-2 py-1 uppercase tracking-wider">Tersedia</span>
                    ) : (
                      <span className="text-[10px] text-gray-600 uppercase">Tidak</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-right space-x-2">
                    <button
                      onClick={() => openEditForm(p)}
                      className="text-xs text-blue-400 hover:text-blue-300 uppercase tracking-widest border border-blue-900/50 px-3 py-1"
                    >
                      Edit
                    </button>
                    {p.published ? (
                      <button
                        onClick={() => handleSoftDelete(p.id, p.name)}
                        className="text-xs text-red-400 hover:text-red-300 uppercase tracking-widest border border-red-900/50 px-3 py-1"
                      >
                        Nonaktifkan
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRestore(p.id, p.name)}
                        className="text-xs text-green-400 hover:text-green-300 uppercase tracking-widest border border-green-900/50 px-3 py-1"
                      >
                        Aktifkan
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
