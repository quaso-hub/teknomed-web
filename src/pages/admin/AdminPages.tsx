import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"
import { useToast } from "../../components/toast-context"

// ─── Shared helpers ──────────────────────────────────────────────────────────

function FormActions({ saving, onCancel }: { saving: boolean; onCancel: () => void }) {
  return (
    <div className="flex gap-4 pt-6 border-t border-[#333]">
      <button type="button" onClick={onCancel} className="flex-1 border border-[#333] py-2 text-sm uppercase hover:bg-[#222]">Batal</button>
      <button type="submit" disabled={saving} className="flex-1 bg-white text-black py-2 text-sm uppercase font-bold hover:bg-gray-200 disabled:opacity-50">
        {saving ? "Menyimpan..." : "Simpan"}
      </button>
    </div>
  )
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs uppercase text-gray-400 mb-1">{children}</label>
}

const inputCls = "w-full bg-[#0a0a0a] border border-[#333] p-2 text-sm text-white outline-none focus:border-gray-500"

// ─── AdminProjects ───────────────────────────────────────────────────────────

export function AdminProjects() {
  const { addToast } = useToast()
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "", subtitle: "", category: "", area: "", year: "",
    highlight: "", image_url: "", map_query: "", published: true, sort_order: 0,
  })

  const fetchProjects = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false })
    if (error) addToast("Gagal memuat proyek", "error")
    else if (data) setProjects(data)
    setLoading(false)
  }

  useEffect(() => { fetchProjects() }, [])

  const openCreate = () => {
    setEditingId(null)
    setFormData({ title: "", subtitle: "", category: "", area: "", year: "", highlight: "", image_url: "", map_query: "", published: true, sort_order: 0 })
    setIsFormOpen(true)
  }

  const openEdit = (p: any) => {
    setEditingId(p.id)
    setFormData({
      title: p.title || "", subtitle: p.subtitle || "", category: p.category || "",
      area: p.area || "", year: p.year || "", highlight: p.highlight || "",
      image_url: p.image_url || "", map_query: p.map_query || "",
      published: p.published ?? true, sort_order: p.sort_order || 0,
    })
    setIsFormOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editingId) {
        const { error } = await supabase.from('projects').update(formData).eq('id', editingId)
        if (error) throw error
        addToast("Proyek diperbarui", "success")
      } else {
        const { error } = await supabase.from('projects').insert([formData])
        if (error) throw error
        addToast("Proyek ditambahkan", "success")
      }
      setIsFormOpen(false)
      fetchProjects()
    } catch (err: any) {
      addToast(`Gagal: ${err.message}`, "error")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Nonaktifkan proyek "${title}"?`)) return
    const { error } = await supabase.from('projects').update({ published: false }).eq('id', id)
    if (error) addToast(`Gagal: ${error.message}`, "error")
    else { addToast(`"${title}" dinonaktifkan`, "success"); fetchProjects() }
  }

  if (isFormOpen) {
    return (
      <div className="max-w-2xl border border-[#333] p-8 bg-[#111]">
        <h2 className="text-xl uppercase tracking-widest border-b border-[#333] pb-4 mb-6">{editingId ? "Edit Proyek" : "Tambah Proyek"}</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><FieldLabel>Judul *</FieldLabel><input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className={inputCls} /></div>
            <div><FieldLabel>Subjudul</FieldLabel><input value={formData.subtitle} onChange={e => setFormData({ ...formData, subtitle: e.target.value })} className={inputCls} /></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div><FieldLabel>Kategori *</FieldLabel><input required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className={inputCls} /></div>
            <div><FieldLabel>Area</FieldLabel><input value={formData.area} onChange={e => setFormData({ ...formData, area: e.target.value })} className={inputCls} /></div>
            <div><FieldLabel>Tahun</FieldLabel><input value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })} className={inputCls} /></div>
          </div>
          <div><FieldLabel>Highlight</FieldLabel><textarea value={formData.highlight} onChange={e => setFormData({ ...formData, highlight: e.target.value })} className={`${inputCls} h-20`} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><FieldLabel>Image URL</FieldLabel><input value={formData.image_url} onChange={e => setFormData({ ...formData, image_url: e.target.value })} className={inputCls} /></div>
            <div><FieldLabel>Map Query</FieldLabel><input value={formData.map_query} onChange={e => setFormData({ ...formData, map_query: e.target.value })} className={inputCls} /></div>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-gray-400">
              <input type="checkbox" checked={formData.published} onChange={e => setFormData({ ...formData, published: e.target.checked })} className="accent-white" />
              Publikasikan
            </label>
          </div>
          <FormActions saving={saving} onCancel={() => setIsFormOpen(false)} />
        </form>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-[#222] pb-4">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-wider">Proyek</h1>
          <p className="text-sm text-gray-500 mt-1">Portofolio proyek Teknomed</p>
        </div>
        <button onClick={openCreate} className="bg-white text-black px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-gray-200">+ Tambah Proyek</button>
      </div>
      <div className="border border-[#222] overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-400 uppercase bg-[#111] border-b border-[#222]">
            <tr><th className="px-5 py-3 font-normal">Proyek</th><th className="px-5 py-3 font-normal">Kategori</th><th className="px-5 py-3 font-normal">Area</th><th className="px-5 py-3 font-normal text-right">Aksi</th></tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={4} className="text-center p-8 text-gray-500">Loading...</td></tr> :
            projects.length === 0 ? <tr><td colSpan={4} className="text-center p-8 text-gray-600">Belum ada proyek</td></tr> :
            projects.map(p => (
              <tr key={p.id} className={`border-b border-[#222] hover:bg-[#111]/50 ${!p.published ? 'opacity-50' : ''}`}>
                <td className="px-5 py-4"><div className="font-semibold">{p.title}</div><div className="text-xs text-gray-500">{p.subtitle}</div></td>
                <td className="px-5 py-4"><span className="text-[10px] border border-[#333] px-2 py-1 rounded">{p.category}</span></td>
                <td className="px-5 py-4 text-gray-400 text-xs">{p.area}</td>
                <td className="px-5 py-4 text-right space-x-2">
                  <button onClick={() => openEdit(p)} className="text-xs text-blue-400 hover:text-blue-300 uppercase tracking-widest border border-blue-900/50 px-3 py-1">Edit</button>
                  <button onClick={() => handleDelete(p.id, p.title)} className="text-xs text-red-400 hover:text-red-300 uppercase tracking-widest border border-red-900/50 px-3 py-1">Nonaktifkan</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── AdminServices ───────────────────────────────────────────────────────────

export function AdminServices() {
  const { addToast } = useToast()
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "", slug: "", description: "", icon: "", category: "", sort_order: 0, published: true,
  })

  const fetchServices = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('services').select('*').order('sort_order')
    if (error) addToast("Gagal memuat layanan", "error")
    else if (data) setServices(data)
    setLoading(false)
  }

  useEffect(() => { fetchServices() }, [])

  const openCreate = () => {
    setEditingId(null)
    setFormData({ title: "", slug: "", description: "", icon: "", category: "", sort_order: 0, published: true })
    setIsFormOpen(true)
  }

  const openEdit = (s: any) => {
    setEditingId(s.id)
    setFormData({
      title: s.title || "", slug: s.slug || "", description: s.description || "",
      icon: s.icon || "", category: s.category || "", sort_order: s.sort_order || 0,
      published: s.published ?? true,
    })
    setIsFormOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editingId) {
        const { error } = await supabase.from('services').update(formData).eq('id', editingId)
        if (error) throw error
        addToast("Layanan diperbarui", "success")
      } else {
        const { error } = await supabase.from('services').insert([formData])
        if (error) throw error
        addToast("Layanan ditambahkan", "success")
      }
      setIsFormOpen(false)
      fetchServices()
    } catch (err: any) {
      addToast(`Gagal: ${err.message}`, "error")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Nonaktifkan layanan "${title}"?`)) return
    const { error } = await supabase.from('services').update({ published: false }).eq('id', id)
    if (error) addToast(`Gagal: ${error.message}`, "error")
    else { addToast(`"${title}" dinonaktifkan`, "success"); fetchServices() }
  }

  if (isFormOpen) {
    return (
      <div className="max-w-2xl border border-[#333] p-8 bg-[#111]">
        <h2 className="text-xl uppercase tracking-widest border-b border-[#333] pb-4 mb-6">{editingId ? "Edit Layanan" : "Tambah Layanan"}</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><FieldLabel>Judul *</FieldLabel><input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className={inputCls} /></div>
            <div><FieldLabel>Slug *</FieldLabel><input required value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} className={inputCls} /></div>
          </div>
          <div><FieldLabel>Deskripsi</FieldLabel><textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className={`${inputCls} h-20`} /></div>
          <div className="grid grid-cols-3 gap-4">
            <div><FieldLabel>Icon</FieldLabel><input value={formData.icon} onChange={e => setFormData({ ...formData, icon: e.target.value })} className={inputCls} /></div>
            <div><FieldLabel>Kategori</FieldLabel><input value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className={inputCls} /></div>
            <div><FieldLabel>Urutan</FieldLabel><input type="number" value={formData.sort_order} onChange={e => setFormData({ ...formData, sort_order: Number(e.target.value) })} className={inputCls} /></div>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-gray-400">
              <input type="checkbox" checked={formData.published} onChange={e => setFormData({ ...formData, published: e.target.checked })} className="accent-white" />
              Publikasikan
            </label>
          </div>
          <FormActions saving={saving} onCancel={() => setIsFormOpen(false)} />
        </form>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-[#222] pb-4">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-wider">Layanan</h1>
          <p className="text-sm text-gray-500 mt-1">Daftar layanan Teknomed</p>
        </div>
        <button onClick={openCreate} className="bg-white text-black px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-gray-200">+ Tambah Layanan</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? <div className="col-span-full text-center p-8 text-gray-500">Loading...</div> :
        services.length === 0 ? <div className="col-span-full text-center p-8 text-gray-600">Belum ada layanan</div> :
        services.map(s => (
          <div key={s.id} className={`border border-[#222] bg-[#111] p-5 hover:border-[#333] transition-colors ${!s.published ? 'opacity-50' : ''}`}>
            <div className="font-semibold text-sm mb-1">{s.title}</div>
            <div className="text-xs text-gray-500 mb-3">/{s.slug}</div>
            <div className="text-xs text-gray-400 line-clamp-2">{s.description}</div>
            <div className="mt-4 flex gap-2">
              <button onClick={() => openEdit(s)} className="text-xs text-blue-400 hover:text-blue-300 border border-blue-900/50 px-3 py-1">Edit</button>
              <button onClick={() => handleDelete(s.id, s.title)} className="text-xs text-red-400 hover:text-red-300 border border-red-900/50 px-3 py-1">Nonaktifkan</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── AdminTestimonials ───────────────────────────────────────────────────────

export function AdminTestimonials() {
  const { addToast } = useToast()
  const [testimonials, setTestimonials] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    quote: "", name: "", role: "", company: "", project_context: "", published: true, sort_order: 0,
  })

  const fetchTestimonials = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('testimonials').select('*').order('sort_order')
    if (error) addToast("Gagal memuat testimoni", "error")
    else if (data) setTestimonials(data)
    setLoading(false)
  }

  useEffect(() => { fetchTestimonials() }, [])

  const openCreate = () => {
    setEditingId(null)
    setFormData({ quote: "", name: "", role: "", company: "", project_context: "", published: true, sort_order: 0 })
    setIsFormOpen(true)
  }

  const openEdit = (t: any) => {
    setEditingId(t.id)
    setFormData({
      quote: t.quote || "", name: t.name || "", role: t.role || "",
      company: t.company || "", project_context: t.project_context || "",
      published: t.published ?? true, sort_order: t.sort_order || 0,
    })
    setIsFormOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editingId) {
        const { error } = await supabase.from('testimonials').update(formData).eq('id', editingId)
        if (error) throw error
        addToast("Testimoni diperbarui", "success")
      } else {
        const { error } = await supabase.from('testimonials').insert([formData])
        if (error) throw error
        addToast("Testimoni ditambahkan", "success")
      }
      setIsFormOpen(false)
      fetchTestimonials()
    } catch (err: any) {
      addToast(`Gagal: ${err.message}`, "error")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Nonaktifkan testimoni dari "${name}"?`)) return
    const { error } = await supabase.from('testimonials').update({ published: false }).eq('id', id)
    if (error) addToast(`Gagal: ${error.message}`, "error")
    else { addToast(`Testimoni "${name}" dinonaktifkan`, "success"); fetchTestimonials() }
  }

  if (isFormOpen) {
    return (
      <div className="max-w-2xl border border-[#333] p-8 bg-[#111]">
        <h2 className="text-xl uppercase tracking-widest border-b border-[#333] pb-4 mb-6">{editingId ? "Edit Testimoni" : "Tambah Testimoni"}</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div><FieldLabel>Kutipan *</FieldLabel><textarea required value={formData.quote} onChange={e => setFormData({ ...formData, quote: e.target.value })} className={`${inputCls} h-24`} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><FieldLabel>Nama *</FieldLabel><input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className={inputCls} /></div>
            <div><FieldLabel>Jabatan</FieldLabel><input value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className={inputCls} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><FieldLabel>Perusahaan</FieldLabel><input value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} className={inputCls} /></div>
            <div><FieldLabel>Konteks Proyek</FieldLabel><input value={formData.project_context} onChange={e => setFormData({ ...formData, project_context: e.target.value })} className={inputCls} /></div>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-gray-400">
              <input type="checkbox" checked={formData.published} onChange={e => setFormData({ ...formData, published: e.target.checked })} className="accent-white" />
              Publikasikan
            </label>
          </div>
          <FormActions saving={saving} onCancel={() => setIsFormOpen(false)} />
        </form>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-[#222] pb-4">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-wider">Testimoni</h1>
          <p className="text-sm text-gray-500 mt-1">Testimoni klien Teknomed</p>
        </div>
        <button onClick={openCreate} className="bg-white text-black px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-gray-200">+ Tambah Testimoni</button>
      </div>
      <div className="space-y-3">
        {loading ? <div className="text-center p-8 text-gray-500">Loading...</div> :
        testimonials.length === 0 ? <div className="text-center p-8 text-gray-600">Belum ada testimoni</div> :
        testimonials.map(t => (
          <div key={t.id} className={`border border-[#222] bg-[#111] p-5 hover:border-[#333] transition-colors ${!t.published ? 'opacity-50' : ''}`}>
            <blockquote className="text-sm text-gray-300 mb-3">"{t.quote}"</blockquote>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-sm">{t.name}</div>
                <div className="text-xs text-gray-500">{t.role} · {t.company}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(t)} className="text-xs text-blue-400 hover:text-blue-300 border border-blue-900/50 px-3 py-1">Edit</button>
                <button onClick={() => handleDelete(t.id, t.name)} className="text-xs text-red-400 hover:text-red-300 border border-red-900/50 px-3 py-1">Nonaktifkan</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── AdminSettings ───────────────────────────────────────────────────────────

export function AdminSettings() {
  const { addToast } = useToast()
  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState<any>({})

  useEffect(() => {
    supabase.from('site_settings').select('*').eq('id', 1).single().then(({ data, error }) => {
      if (error) addToast("Gagal memuat pengaturan", "error")
      else if (data) { setSettings(data); setFormData(data) }
      setLoading(false)
    })
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { error } = await supabase
        .from('site_settings')
        .update({
          company_name: formData.company_name,
          tagline: formData.tagline,
          description: formData.description,
          founded: formData.founded,
          contact: formData.contact,
          address: formData.address,
          hours: formData.hours,
          service_areas: formData.service_areas,
          logo: formData.logo,
          url: formData.url,
        })
        .eq('id', 1)

      if (error) throw error
      setSettings(formData)
      setEditing(false)
      addToast("Pengaturan disimpan", "success")
    } catch (err: any) {
      addToast(`Gagal menyimpan: ${err.message}`, "error")
    } finally {
      setSaving(false)
    }
  }

  const updateContact = (key: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      contact: { ...(prev.contact || {}), [key]: value },
    }))
  }

  const updateAddress = (key: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      address: { ...(prev.address || {}), [key]: value },
    }))
  }

  const updateHours = (key: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      hours: { ...(prev.hours || {}), [key]: value },
    }))
  }

  if (loading) return <div className="text-center p-8 text-gray-500">Loading...</div>
  if (!settings) return <div className="text-center p-8 text-gray-600">Pengaturan tidak ditemukan</div>

  if (editing) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b border-[#222] pb-4">
          <div>
            <h1 className="text-2xl font-bold uppercase tracking-wider">Edit Pengaturan</h1>
            <p className="text-sm text-gray-500 mt-1">Ubah konfigurasi situs</p>
          </div>
        </div>
        <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
          {/* Company Info */}
          <div className="border border-[#222] bg-[#111] p-5 space-y-4">
            <h3 className="text-sm uppercase tracking-wider font-semibold">Informasi Perusahaan</h3>
            <div><FieldLabel>Nama Perusahaan</FieldLabel><input value={formData.company_name || ''} onChange={e => setFormData({ ...formData, company_name: e.target.value })} className={inputCls} /></div>
            <div><FieldLabel>Tagline</FieldLabel><input value={formData.tagline || ''} onChange={e => setFormData({ ...formData, tagline: e.target.value })} className={inputCls} /></div>
            <div><FieldLabel>Deskripsi</FieldLabel><textarea value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} className={`${inputCls} h-16`} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><FieldLabel>Tahun Berdiri</FieldLabel><input type="number" value={formData.founded || ''} onChange={e => setFormData({ ...formData, founded: Number(e.target.value) })} className={inputCls} /></div>
              <div><FieldLabel>Logo URL</FieldLabel><input value={formData.logo || ''} onChange={e => setFormData({ ...formData, logo: e.target.value })} className={inputCls} /></div>
            </div>
            <div><FieldLabel>Website URL</FieldLabel><input value={formData.url || ''} onChange={e => setFormData({ ...formData, url: e.target.value })} className={inputCls} /></div>
          </div>

          {/* Contact */}
          <div className="border border-[#222] bg-[#111] p-5 space-y-4">
            <h3 className="text-sm uppercase tracking-wider font-semibold">Kontak</h3>
            <div><FieldLabel>Email</FieldLabel><input value={formData.contact?.email || ''} onChange={e => updateContact('email', e.target.value)} className={inputCls} /></div>
            <div><FieldLabel>Telepon</FieldLabel><input value={formData.contact?.phone || ''} onChange={e => updateContact('phone', e.target.value)} className={inputCls} /></div>
            <div><FieldLabel>WhatsApp URL</FieldLabel><input value={formData.contact?.whatsapp || ''} onChange={e => updateContact('whatsapp', e.target.value)} className={inputCls} /></div>
          </div>

          {/* Address */}
          <div className="border border-[#222] bg-[#111] p-5 space-y-4">
            <h3 className="text-sm uppercase tracking-wider font-semibold">Alamat</h3>
            <div><FieldLabel>Alamat Lengkap</FieldLabel><textarea value={formData.address?.full || ''} onChange={e => updateAddress('full', e.target.value)} className={`${inputCls} h-16`} /></div>
            <div className="grid grid-cols-3 gap-4">
              <div><FieldLabel>Kota</FieldLabel><input value={formData.address?.city || ''} onChange={e => updateAddress('city', e.target.value)} className={inputCls} /></div>
              <div><FieldLabel>Provinsi</FieldLabel><input value={formData.address?.province || ''} onChange={e => updateAddress('province', e.target.value)} className={inputCls} /></div>
              <div><FieldLabel>Kodepos</FieldLabel><input value={formData.address?.zipCode || ''} onChange={e => updateAddress('zipCode', e.target.value)} className={inputCls} /></div>
            </div>
          </div>

          {/* Hours */}
          <div className="border border-[#222] bg-[#111] p-5 space-y-4">
            <h3 className="text-sm uppercase tracking-wider font-semibold">Jam Operasional</h3>
            <div><FieldLabel>Weekday</FieldLabel><input value={formData.hours?.weekdays || ''} onChange={e => updateHours('weekdays', e.target.value)} className={inputCls} /></div>
            <div><FieldLabel>Weekend</FieldLabel><input value={formData.hours?.weekend || ''} onChange={e => updateHours('weekend', e.target.value)} className={inputCls} /></div>
          </div>

          <div className="flex gap-4">
            <button type="button" onClick={() => { setEditing(false); setFormData(settings) }} className="flex-1 border border-[#333] py-2 text-sm uppercase hover:bg-[#222]">Batal</button>
            <button type="submit" disabled={saving} className="flex-1 bg-white text-black py-2 text-sm uppercase font-bold hover:bg-gray-200 disabled:opacity-50">
              {saving ? "Menyimpan..." : "Simpan Pengaturan"}
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-[#222] pb-4">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-wider">Pengaturan</h1>
          <p className="text-sm text-gray-500 mt-1">Konfigurasi situs dan perusahaan</p>
        </div>
        <button onClick={() => setEditing(true)} className="bg-white text-black px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-gray-200">Edit Pengaturan</button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border border-[#222] bg-[#111] p-5">
          <h3 className="text-sm uppercase tracking-wider font-semibold mb-4">Informasi Perusahaan</h3>
          <div className="space-y-3 text-sm">
            <div><span className="text-gray-500">Nama:</span> <span className="ml-2">{settings.company_name}</span></div>
            <div><span className="text-gray-500">Tagline:</span> <span className="ml-2">{settings.tagline}</span></div>
            <div><span className="text-gray-500">Berdiri:</span> <span className="ml-2">{settings.founded}</span></div>
          </div>
        </div>
        <div className="border border-[#222] bg-[#111] p-5">
          <h3 className="text-sm uppercase tracking-wider font-semibold mb-4">Kontak</h3>
          <div className="space-y-3 text-sm">
            <div><span className="text-gray-500">Email:</span> <span className="ml-2">{settings.contact?.email}</span></div>
            <div><span className="text-gray-500">Telepon:</span> <span className="ml-2">{settings.contact?.phone}</span></div>
            <div><span className="text-gray-500">WhatsApp:</span> <span className="ml-2">{settings.contact?.whatsapp}</span></div>
          </div>
        </div>
        <div className="border border-[#222] bg-[#111] p-5">
          <h3 className="text-sm uppercase tracking-wider font-semibold mb-4">Alamat</h3>
          <div className="text-sm text-gray-300">{settings.address?.full}</div>
        </div>
        <div className="border border-[#222] bg-[#111] p-5">
          <h3 className="text-sm uppercase tracking-wider font-semibold mb-4">Area Layanan</h3>
          <div className="flex flex-wrap gap-2">
            {settings.service_areas?.map((area: string) => (
              <span key={area} className="text-[10px] border border-[#333] px-2 py-1 rounded">{area}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── AdminPdf ────────────────────────────────────────────────────────────────

export function AdminPdf() {
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleGenerate = async () => {
    setGenerating(true)
    setResult(null)
    try {
      const resp = await fetch('https://api.teknomed.web.id/api/pdf/generate', { method: 'POST' })
      const data = await resp.json()
      setResult(data)
    } catch (err: any) {
      setResult({ error: err.message })
    }
    setGenerating(false)
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-[#222] pb-4">
        <h1 className="text-2xl font-bold uppercase tracking-wider">PDF Generator</h1>
        <p className="text-sm text-gray-500 mt-1">Generate katalog PDF dari data produk</p>
      </div>
      <div className="border border-[#222] bg-[#111] p-6 max-w-lg">
        <p className="text-sm text-gray-400 mb-4">Klik tombol di bawah untuk generate PDF katalog dari data produk yang ada di Supabase. Proses ini memakan waktu ~30-60 detik.</p>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="bg-white text-black px-6 py-2.5 text-sm font-bold uppercase tracking-wider hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {generating ? 'Generating...' : 'Generate PDF'}
        </button>
        {result && (
          <div className="mt-4 p-4 border border-[#333] bg-[#0a0a0a] text-sm">
            {result.error ? (
              <div className="text-red-400">Error: {result.error}</div>
            ) : (
              <div>
                <div className="text-green-400 mb-2">PDF berhasil di-generate!</div>
                <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
                  Download PDF ↗
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
