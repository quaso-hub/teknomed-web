import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"
import { Link } from "react-router-dom"

export function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, inquiries: 0, projects: 0, testimonials: 0 })
  const [recentInquiries, setRecentInquiries] = useState<any[]>([])
  const [recentProducts, setRecentProducts] = useState<any[]>([])

  useEffect(() => {
    async function fetchStats() {
      const [p, i, pr, t] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('inquiries').select('*', { count: 'exact', head: true }),
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('testimonials').select('*', { count: 'exact', head: true }),
      ])
      setStats({
        products: p.count || 0,
        inquiries: i.count || 0,
        projects: pr.count || 0,
        testimonials: t.count || 0,
      })

      const { data: inq } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false }).limit(5)
      if (inq) setRecentInquiries(inq)

      const { data: prods } = await supabase.from('products').select('*').order('updated_at', { ascending: false }).limit(5)
      if (prods) setRecentProducts(prods)
    }
    fetchStats()
  }, [])

  const statCards = [
    { label: "Produk", value: stats.products, link: "/admin/products", color: "border-blue-500/30" },
    { label: "Inquiries", value: stats.inquiries, link: "/admin/inquiries", color: "border-green-500/30" },
    { label: "Proyek", value: stats.projects, link: "/admin/projects", color: "border-purple-500/30" },
    { label: "Testimoni", value: stats.testimonials, link: "/admin/testimonials", color: "border-yellow-500/30" },
  ]

  const getStatusColor = (status: string) => {
    if (status === 'new') return 'text-blue-400 bg-blue-400/10'
    if (status === 'won') return 'text-green-400 bg-green-400/10'
    if (status === 'lost') return 'text-red-400 bg-red-400/10'
    return 'text-yellow-400 bg-yellow-400/10'
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold uppercase tracking-wider">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview sistem Teknomed</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Link
            key={card.label}
            to={card.link}
            className={`p-5 border ${card.color} bg-[#111] hover:bg-[#161616] transition-colors group`}
          >
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">{card.label}</div>
            <div className="text-4xl font-light tracking-tighter">{card.value}</div>
            <div className="text-[10px] text-gray-600 uppercase tracking-wider mt-2 group-hover:text-gray-400 transition-colors">
              Lihat semua →
            </div>
          </Link>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Inquiries */}
        <div className="border border-[#222] bg-[#111]">
          <div className="px-5 py-4 border-b border-[#222] flex items-center justify-between">
            <h3 className="text-sm uppercase tracking-wider font-semibold">Inquiries Terbaru</h3>
            <Link to="/admin/inquiries" className="text-[10px] text-gray-500 hover:text-white uppercase tracking-wider">
              Lihat semua
            </Link>
          </div>
          <div className="divide-y divide-[#222]">
            {recentInquiries.length === 0 ? (
              <div className="px-5 py-8 text-center text-gray-600 text-sm">Belum ada inquiry</div>
            ) : (
              recentInquiries.map((inq) => (
                <div key={inq.id} className="px-5 py-3 hover:bg-[#161616] transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-sm">{inq.company_name}</div>
                    <span className={`text-[10px] px-2 py-0.5 rounded ${getStatusColor(inq.status)}`}>
                      {inq.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{inq.contact_person} · {inq.email}</div>
                  <div className="text-xs text-gray-600 mt-1 truncate">{inq.message}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Products */}
        <div className="border border-[#222] bg-[#111]">
          <div className="px-5 py-4 border-b border-[#222] flex items-center justify-between">
            <h3 className="text-sm uppercase tracking-wider font-semibold">Produk Terbaru</h3>
            <Link to="/admin/products" className="text-[10px] text-gray-500 hover:text-white uppercase tracking-wider">
              Lihat semua
            </Link>
          </div>
          <div className="divide-y divide-[#222]">
            {recentProducts.length === 0 ? (
              <div className="px-5 py-8 text-center text-gray-600 text-sm">Belum ada produk</div>
            ) : (
              recentProducts.map((prod) => (
                <Link key={prod.id} to="/admin/products" className="block px-5 py-3 hover:bg-[#161616] transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-sm">{prod.name}</div>
                    <div className="flex items-center gap-2">
                      {prod.has_3d && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-green-400/10 text-green-400 rounded">3D</span>
                      )}
                      <span className="text-[10px] text-gray-600 border border-[#333] px-1.5 py-0.5 rounded">
                        {prod.category}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">/{prod.slug}</div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="border border-[#222] bg-[#111] p-5">
        <h3 className="text-sm uppercase tracking-wider font-semibold mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/products" className="px-4 py-2 bg-white/5 border border-[#333] text-sm hover:bg-white/10 transition-colors rounded">
            + Tambah Produk
          </Link>
          <Link to="/admin/inquiries" className="px-4 py-2 bg-white/5 border border-[#333] text-sm hover:bg-white/10 transition-colors rounded">
            Cek Inquiries
          </Link>
          <Link to="/admin/pdf" className="px-4 py-2 bg-white/5 border border-[#333] text-sm hover:bg-white/10 transition-colors rounded">
            Generate PDF
          </Link>
          <a href="/" target="_blank" className="px-4 py-2 bg-white/5 border border-[#333] text-sm hover:bg-white/10 transition-colors rounded">
            Preview Site ↗
          </a>
        </div>
      </div>
    </div>
  )
}
