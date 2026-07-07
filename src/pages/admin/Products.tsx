import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

export function AdminProducts() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formData, setFormData] = useState<any>({ name: "", category: "Konstruksi", desc: "", summary: "", slug: "", published: true, has_3d: false, model_url: "" })

  const fetchProducts = async () => {
    setLoading(true)
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    if (data) setProducts(data)
    setLoading(false)
  }

  useEffect(() => { fetchProducts() }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.id) await supabase.from('products').update(formData).eq('id', formData.id)
    else await supabase.from('products').insert([formData])
    setIsFormOpen(false)
    fetchProducts()
  }

  const handleDelete = async (id: string) => {
    if (confirm("Hapus produk ini?")) {
      await supabase.from('products').delete().eq('id', id)
      fetchProducts()
    }
  }

  if (isFormOpen) {
    return (
      <div className="max-w-2xl border border-[#333] p-8 bg-[#111]">
        <h2 className="text-xl uppercase tracking-widest border-b border-[#333] pb-4 mb-6">{formData.id ? "Edit Data" : "Input Baru"}</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase text-gray-400 mb-1">Nama</label>
              <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#0a0a0a] border border-[#333] p-2 text-sm text-white" />
            </div>
            <div>
              <label className="block text-xs uppercase text-gray-400 mb-1">Slug</label>
              <input required value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full bg-[#0a0a0a] border border-[#333] p-2 text-sm text-white" />
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase text-gray-400 mb-1">Kategori</label>
            <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-[#0a0a0a] border border-[#333] p-2 text-sm text-white">
              <option value="Konstruksi">Konstruksi</option>
              <option value="Penjualan">Penjualan</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase text-gray-400 mb-1">Deskripsi</label>
            <textarea required value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} className="w-full bg-[#0a0a0a] border border-[#333] p-2 text-sm text-white h-24" />
          </div>
          <div>
            <label className="block text-xs uppercase text-gray-400 mb-1">3D Model URL (Opsional)</label>
            <input value={formData.model_url || ''} onChange={e => setFormData({...formData, model_url: e.target.value, has_3d: !!e.target.value})} placeholder="https://..." className="w-full bg-[#0a0a0a] border border-[#333] p-2 text-sm text-white" />
            <p className="text-[10px] text-gray-500 mt-1">Paste public URL file .glb dari Supabase Storage.</p>
          </div>
          <div className="flex gap-4 pt-6 border-t border-[#333]">
            <button type="button" onClick={() => setIsFormOpen(false)} className="flex-1 border border-[#333] py-2 text-sm uppercase hover:bg-[#222]">Batal</button>
            <button type="submit" className="flex-1 bg-white text-black py-2 text-sm uppercase font-bold hover:bg-gray-200">Simpan Data</button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-[#333] pb-4">
        <h1 className="text-3xl font-bold uppercase tracking-widest">Katalog Produk</h1>
        <button onClick={() => { setFormData({name:"", category:"Konstruksi", desc:"", summary:"", slug:"", published:true, has_3d:false, model_url:""}); setIsFormOpen(true) }} className="bg-white text-black px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-gray-200">+ Tambah Data</button>
      </div>
      <div className="border border-[#333] overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-400 uppercase bg-[#111] border-b border-[#333]">
            <tr><th className="px-4 py-3 font-normal">Produk</th><th className="px-4 py-3 font-normal">Kategori</th><th className="px-4 py-3 font-normal text-center">3D</th><th className="px-4 py-3 font-normal text-right">Aksi</th></tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={4} className="text-center p-8 text-gray-500">Loading...</td></tr> :
             products.map(p => (
              <tr key={p.id} className="border-b border-[#333] hover:bg-[#111]/50">
                <td className="px-4 py-4"><div className="font-semibold">{p.name}</div><div className="text-xs text-gray-500">/{p.slug}</div></td>
                <td className="px-4 py-4"><span className="text-[10px] border border-[#333] px-2 py-1 rounded-sm">{p.category}</span></td>
                <td className="px-4 py-4 text-center">{p.has_3d ? <span className="text-[10px] bg-green-900/30 text-green-400 border border-green-500/30 px-2 py-1 uppercase tracking-wider">Tersedia</span> : <span className="text-[10px] text-gray-600 uppercase">Tidak</span>}</td>
                <td className="px-4 py-4 text-right space-x-2">
                  <button onClick={() => {setFormData(p); setIsFormOpen(true)}} className="text-xs text-blue-400 hover:text-blue-300 uppercase tracking-widest border border-blue-900/50 px-3 py-1">Edit</button>
                  <button onClick={() => handleDelete(p.id)} className="text-xs text-red-400 hover:text-red-300 uppercase tracking-widest border border-red-900/50 px-3 py-1">Del</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
