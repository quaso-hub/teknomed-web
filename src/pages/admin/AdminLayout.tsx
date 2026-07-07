import { useEffect, useState } from "react"
import { useNavigate, Outlet, Link } from "react-router-dom"
import { supabase } from "../../lib/supabase"
import "../../admin.css"

export function AdminLayout() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
      if (!session) navigate("/admin/login")
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (!session) navigate("/admin/login")
    })
    return () => subscription.unsubscribe()
  }, [navigate])

  if (loading) return <div className="admin-theme flex min-h-screen items-center justify-center bg-[#0a0a0a] text-white">Loading...</div>

  return (
    <div className="admin-theme min-h-screen flex w-full bg-[#0a0a0a] text-white font-mono">
      <aside className="w-64 border-r border-[#333] bg-[#111] flex flex-col p-6">
        <div className="font-bold text-xl mb-10 uppercase tracking-widest text-center border-b border-[#333] pb-4">Admin Panel</div>
        <nav className="flex flex-col gap-4">
          <Link to="/admin" className="text-sm px-4 py-2 rounded hover:bg-[#222] transition-colors uppercase tracking-wider">Dashboard</Link>
          <Link to="/admin/products" className="text-sm px-4 py-2 rounded hover:bg-[#222] transition-colors uppercase tracking-wider">Katalog & 3D</Link>
          <Link to="/admin/inquiries" className="text-sm px-4 py-2 rounded hover:bg-[#222] transition-colors uppercase tracking-wider">Inquiries</Link>
        </nav>
        <button onClick={() => supabase.auth.signOut()} className="mt-auto text-sm w-full text-center px-4 py-2 border border-red-500/50 text-red-400 hover:bg-red-500/10 rounded uppercase transition-colors">Logout</button>
      </aside>
      <main className="flex-1 p-10 overflow-y-auto bg-[#0a0a0a]"><Outlet /></main>
    </div>
  )
}
