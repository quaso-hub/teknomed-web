import { useEffect, useState, useMemo } from "react"
import { supabase } from "../../lib/supabase"
import { useToast } from "../../components/toast-context"

const STATUSES = ["new", "contacted", "quoted", "won", "lost"] as const

export function AdminInquiries() {
  const { addToast } = useToast()
  const [inquiries, setInquiries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [search, setSearch] = useState("")

  const fetchInquiries = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[Inquiries] fetch error:', error.message)
      addToast("Gagal memuat data inquiry", "error")
    } else if (data) {
      setInquiries(data)
    }
    setLoading(false)
  }

  useEffect(() => { fetchInquiries() }, [])

  const filteredInquiries = useMemo(() => {
    return inquiries.filter(item => {
      if (statusFilter && item.status !== statusFilter) return false
      if (search) {
        const q = search.toLowerCase()
        return (
          item.company_name?.toLowerCase().includes(q) ||
          item.contact_person?.toLowerCase().includes(q) ||
          item.email?.toLowerCase().includes(q) ||
          item.message?.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [inquiries, statusFilter, search])

  const updateStatus = async (id: string, newStatus: string, companyName: string) => {
    const { error } = await supabase
      .from('inquiries')
      .update({ status: newStatus })
      .eq('id', id)

    if (error) {
      console.error('[Inquiries] update error:', error)
      addToast(`Gagal mengubah status: ${error.message}`, "error")
    } else {
      addToast(`Status "${companyName}" → ${newStatus}`, "success")
      fetchInquiries()
    }
  }

  const getStatusColor = (status: string) => {
    if (status === 'new') return 'text-blue-400 border-blue-900/50 bg-blue-900/20'
    if (status === 'won') return 'text-green-400 border-green-900/50 bg-green-900/20'
    if (status === 'lost') return 'text-red-400 border-red-900/50 bg-red-900/20'
    return 'text-yellow-400 border-yellow-900/50 bg-yellow-900/20'
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-[#333] pb-4">
        <h1 className="text-3xl font-bold uppercase tracking-widest">Inquiries</h1>
        <button onClick={fetchInquiries} className="text-xs text-gray-400 border border-[#333] px-3 py-1 uppercase hover:bg-[#222]">Refresh</button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="Cari inquiry..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-[#0a0a0a] border border-[#333] px-3 py-2 text-sm text-white outline-none focus:border-gray-500 w-64"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="bg-[#0a0a0a] border border-[#333] px-3 py-2 text-sm text-white outline-none focus:border-gray-500"
        >
          <option value="">Semua Status</option>
          {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
        <span className="text-xs text-gray-600">{filteredInquiries.length} inquiry</span>
      </div>

      <div className="border border-[#333] overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-400 uppercase bg-[#111] border-b border-[#333]">
            <tr>
              <th className="px-4 py-3 font-normal">Klien</th>
              <th className="px-4 py-3 font-normal">Pesan</th>
              <th className="px-4 py-3 font-normal text-center">Status</th>
              <th className="px-4 py-3 font-normal text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="text-center p-8 text-gray-500">Loading...</td></tr>
            ) : filteredInquiries.length === 0 ? (
              <tr><td colSpan={4} className="text-center p-8 text-gray-600">Tidak ada inquiry ditemukan</td></tr>
            ) : (
              filteredInquiries.map(item => (
                <tr key={item.id} className="border-b border-[#333] hover:bg-[#111]/50">
                  <td className="px-4 py-4 w-64">
                    <div className="font-bold text-white">{item.company_name}</div>
                    <div className="text-xs text-gray-400 mt-1">{item.contact_person}</div>
                    <div className="text-[10px] text-gray-500 mt-1">{item.email} • {item.phone || '-'}</div>
                  </td>
                  <td className="px-4 py-4 max-w-md">
                    <div className="text-xs text-gray-300 leading-relaxed whitespace-pre-wrap">{item.message}</div>
                  </td>
                  <td className="px-4 py-4 text-center align-top">
                    <span className={`text-[10px] border px-2 py-1 uppercase tracking-wider ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right align-top">
                    <select
                      value={item.status}
                      onChange={(e) => updateStatus(item.id, e.target.value, item.company_name)}
                      className="bg-[#0a0a0a] border border-[#333] text-xs text-gray-300 p-1 uppercase outline-none focus:border-gray-500"
                    >
                      {STATUSES.map(s => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
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
