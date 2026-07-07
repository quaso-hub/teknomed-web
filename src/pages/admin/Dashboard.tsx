import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

export function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, inquiries: 0 })

  useEffect(() => {
    async function fetchStats() {
      const { count: pCount } = await supabase.from('products').select('*', { count: 'exact', head: true })
      const { count: iCount } = await supabase.from('inquiries').select('*', { count: 'exact', head: true })
      setStats({ products: pCount || 0, inquiries: iCount || 0 })
    }
    fetchStats()
  }, [])

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold uppercase tracking-widest border-b border-[#333] pb-4">Terminal Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 border border-[#333] bg-[#111] flex flex-col">
          <span className="text-xs text-gray-400 uppercase tracking-widest mb-2">Total Produk</span>
          <span className="text-5xl font-light tracking-tighter">{stats.products}</span>
        </div>
        <div className="p-6 border border-[#333] bg-[#111] flex flex-col">
          <span className="text-xs text-gray-400 uppercase tracking-widest mb-2">Inquiries Masuk</span>
          <span className="text-5xl font-light tracking-tighter">{stats.inquiries}</span>
        </div>
      </div>
    </div>
  )
}
