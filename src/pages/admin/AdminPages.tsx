import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

export function AdminProjects() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('projects').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setProjects(data)
      setLoading(false)
    })
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-[#222] pb-4">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-wider">Proyek</h1>
          <p className="text-sm text-gray-500 mt-1">Portofolio proyek Teknomed</p>
        </div>
        <button className="bg-white text-black px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-gray-200">+ Tambah Proyek</button>
      </div>
      <div className="border border-[#222] overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-400 uppercase bg-[#111] border-b border-[#222]">
            <tr><th className="px-5 py-3 font-normal">Proyek</th><th className="px-5 py-3 font-normal">Kategori</th><th className="px-5 py-3 font-normal">Area</th><th className="px-5 py-3 font-normal text-right">Aksi</th></tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={4} className="text-center p-8 text-gray-500">Loading...</td></tr> :
            projects.length === 0 ? <tr><td colSpan={4} className="text-center p-8 text-gray-600">Belum ada proyek di Supabase</td></tr> :
            projects.map(p => (
              <tr key={p.id} className="border-b border-[#222] hover:bg-[#111]/50">
                <td className="px-5 py-4"><div className="font-semibold">{p.title}</div><div className="text-xs text-gray-500">{p.subtitle}</div></td>
                <td className="px-5 py-4"><span className="text-[10px] border border-[#333] px-2 py-1 rounded">{p.category}</span></td>
                <td className="px-5 py-4 text-gray-400 text-xs">{p.area}</td>
                <td className="px-5 py-4 text-right"><button className="text-xs text-blue-400 hover:text-blue-300 uppercase tracking-widest border border-blue-900/50 px-3 py-1">Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function AdminServices() {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('services').select('*').order('sort_order').then(({ data }) => {
      if (data) setServices(data)
      setLoading(false)
    })
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-[#222] pb-4">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-wider">Layanan</h1>
          <p className="text-sm text-gray-500 mt-1">Daftar layanan Teknomed</p>
        </div>
        <button className="bg-white text-black px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-gray-200">+ Tambah Layanan</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? <div className="col-span-full text-center p-8 text-gray-500">Loading...</div> :
        services.length === 0 ? <div className="col-span-full text-center p-8 text-gray-600">Belum ada layanan di Supabase</div> :
        services.map(s => (
          <div key={s.id} className="border border-[#222] bg-[#111] p-5 hover:border-[#333] transition-colors">
            <div className="font-semibold text-sm mb-1">{s.title}</div>
            <div className="text-xs text-gray-500 mb-3">/{s.slug}</div>
            <div className="text-xs text-gray-400 line-clamp-2">{s.description}</div>
            <div className="mt-4 flex gap-2">
              <button className="text-xs text-blue-400 hover:text-blue-300 border border-blue-900/50 px-3 py-1">Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('testimonials').select('*').order('sort_order').then(({ data }) => {
      if (data) setTestimonials(data)
      setLoading(false)
    })
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-[#222] pb-4">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-wider">Testimoni</h1>
          <p className="text-sm text-gray-500 mt-1">Testimoni klien Teknomed</p>
        </div>
        <button className="bg-white text-black px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-gray-200">+ Tambah Testimoni</button>
      </div>
      <div className="space-y-3">
        {loading ? <div className="text-center p-8 text-gray-500">Loading...</div> :
        testimonials.length === 0 ? <div className="text-center p-8 text-gray-600">Belum ada testimoni di Supabase</div> :
        testimonials.map(t => (
          <div key={t.id} className="border border-[#222] bg-[#111] p-5 hover:border-[#333] transition-colors">
            <blockquote className="text-sm text-gray-300 mb-3">"{t.quote}"</blockquote>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-sm">{t.name}</div>
                <div className="text-xs text-gray-500">{t.role} · {t.company}</div>
              </div>
              <div className="flex gap-2">
                <button className="text-xs text-blue-400 hover:text-blue-300 border border-blue-900/50 px-3 py-1">Edit</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function AdminSettings() {
  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('site_settings').select('*').eq('id', 1).single().then(({ data }) => {
      if (data) setSettings(data)
      setLoading(false)
    })
  }, [])

  if (loading) return <div className="text-center p-8 text-gray-500">Loading...</div>
  if (!settings) return <div className="text-center p-8 text-gray-600">Pengaturan tidak ditemukan</div>

  return (
    <div className="space-y-6">
      <div className="border-b border-[#222] pb-4">
        <h1 className="text-2xl font-bold uppercase tracking-wider">Pengaturan</h1>
        <p className="text-sm text-gray-500 mt-1">Konfigurasi situs dan perusahaan</p>
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

export function AdminPdf() {
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleGenerate = async () => {
    setGenerating(true)
    setResult(null)
    try {
      const resp = await fetch('http://152.42.172.136:3002/api/pdf/generate', { method: 'POST' })
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
