import { useEffect, useState } from "react"
import { useNavigate, Outlet, Link, useLocation } from "react-router-dom"
import { supabase } from "../../lib/supabase"
import "../../admin.css"

const navSections = [
  {
    label: "Overview",
    items: [
      { to: "/admin", label: "Dashboard", icon: "◆" },
    ]
  },
  {
    label: "Katalog",
    items: [
      { to: "/admin/products", label: "Produk", icon: "▣" },
      { to: "/admin/projects", label: "Proyek", icon: "▦" },
      { to: "/admin/services", label: "Layanan", icon: "◈" },
      { to: "/admin/testimonials", label: "Testimoni", icon: "❝" },
    ]
  },
  {
    label: "3D Viewer",
    items: [
      { to: "/admin/models", label: "Model 3D", icon: "◇" },
      { to: "/admin/models/config", label: "Konfigurasi", icon: "⚙" },
    ]
  },
  {
    label: "Operasional",
    items: [
      { to: "/admin/inquiries", label: "Inquiries", icon: "✉" },
      { to: "/admin/pdf", label: "PDF Generator", icon: "⎙" },
    ]
  },
  {
    label: "Sistem",
    items: [
      { to: "/admin/settings", label: "Pengaturan", icon: "⚙" },
    ]
  },
]

export function AdminLayout() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

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

  if (loading) {
    return (
      <div className="admin-theme flex min-h-screen items-center justify-center bg-[#0a0a0a] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <span className="text-xs uppercase tracking-widest text-gray-500">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-theme min-h-screen flex w-full bg-[#0a0a0a] text-white font-mono">
      {/* Sidebar */}
      <aside className={`${sidebarCollapsed ? 'w-16' : 'w-64'} border-r border-[#222] bg-[#0d0d0d] flex flex-col transition-all duration-200`}>
        {/* Logo */}
        <div className="h-16 border-b border-[#222] flex items-center justify-between px-4">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
                <span className="text-black font-bold text-sm">T</span>
              </div>
              <div>
                <div className="text-sm font-bold uppercase tracking-wider">Teknomed</div>
                <div className="text-[9px] text-gray-500 uppercase tracking-widest">Admin Panel</div>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-white hover:bg-[#1a1a1a] rounded transition-colors"
          >
            {sidebarCollapsed ? '→' : '←'}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          {navSections.map((section) => (
            <div key={section.label} className="mb-4">
              {!sidebarCollapsed && (
                <div className="px-4 mb-2 text-[10px] uppercase tracking-[0.2em] text-gray-600 font-semibold">
                  {section.label}
                </div>
              )}
              {section.items.map((item) => {
                const isActive = location.pathname === item.to ||
                  (item.to !== '/admin' && location.pathname.startsWith(item.to))
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                      isActive
                        ? 'bg-white/10 text-white border-r-2 border-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                    title={sidebarCollapsed ? item.label : undefined}
                  >
                    <span className="w-5 text-center text-xs">{item.icon}</span>
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        {/* User */}
        <div className="border-t border-[#222] p-4">
          {!sidebarCollapsed ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#1a1a1a] rounded-full flex items-center justify-center text-xs">
                {session?.user?.email?.[0]?.toUpperCase() || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs truncate">{session?.user?.email || 'Admin'}</div>
                <div className="text-[10px] text-gray-500 uppercase">Super Admin</div>
              </div>
              <button
                onClick={() => supabase.auth.signOut()}
                className="text-gray-500 hover:text-red-400 transition-colors text-xs"
                title="Logout"
              >
                ↗
              </button>
            </div>
          ) : (
            <button
              onClick={() => supabase.auth.signOut()}
              className="w-full text-center text-gray-500 hover:text-red-400 transition-colors text-xs"
              title="Logout"
            >
              ↗
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 border-b border-[#222] bg-[#0d0d0d] flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h2 className="text-sm uppercase tracking-widest text-gray-400">
              {navSections.flatMap(s => s.items).find(i =>
                location.pathname === i.to ||
                (i.to !== '/admin' && location.pathname.startsWith(i.to))
              )?.label || 'Dashboard'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-500 hover:text-white transition-colors uppercase tracking-wider"
            >
              Lihat Site ↗
            </a>
            <div className="w-px h-4 bg-[#333]" />
            <span className="text-[10px] text-gray-600 uppercase tracking-wider">
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
            </span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto bg-[#0a0a0a]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
