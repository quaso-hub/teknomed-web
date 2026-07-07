import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

export function AdminInquiries() {
  const [inquiries, setInquiries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchInquiries = async () => {
    setLoading(true)
    const { data } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false })
    if (data) setInquiries(data)
    setLoading(false)
  }

  useEffect(() => { fetchInquiries() }, [])

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('inquiries').update({ status }).eq('id', id)
    fetchInquiries()
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
      <div className="border border-[#333] overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-400 uppercase bg-[#111] border-b border-[#333]">
            <tr><th className="px-4 py-3 font-normal">Klien</th><th className="px-4 py-3 font-normal">Pesan</th><th className="px-4 py-3 font-normal text-center">Status</th><th className="px-4 py-3 font-normal text-right">Aksi</th></tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={4} className="text-center p-8 text-gray-500">Loading...</td></tr> :
             inquiries.map(item => (
              <tr key={item.id} className="border-b border-[#333] hover:bg-[#111]/50">
                <td className="px-4 py-4 w-64"><div className="font-bold text-white">{item.company_name}</div><div className="text-xs text-gray-400 mt-1">{item.contact_person}</div><div className="text-[10px] text-gray-500 mt-1">{item.email} • {item.phone || '-'}</div></td>
                <td className="px-4 py-4 max-w-md"><div className="text-xs text-gray-300 leading-relaxed whitespace-pre-wrap">{item.message}</div></td>
                <td className="px-4 py-4 text-center align-top"><span className={`text-[10px] border px-2 py-1 uppercase tracking-wider ${getStatusColor(item.status)}`}>{item.status}</span></td>
                <td className="px-4 py-4 text-right align-top"><select value={item.status} onChange={(e) => updateStatus(item.id, e.target.value)} className="bg-[#0a0a0a] border border-[#333] text-xs text-gray-300 p-1 uppercase outline-none"><option value="new">New</option><option value="contacted">Contacted</option><option value="quoted">Quoted</option><option value="won">Won</option><option value="lost">Lost</option></select></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
