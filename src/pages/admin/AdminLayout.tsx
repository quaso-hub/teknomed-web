import { useState, useEffect, useCallback } from "react"
import { Outlet, Link, useLocation } from "react-router-dom"
import { supabase } from "../../lib/supabase"
import { AuthGuard } from "../../components/AuthGuard"
import type { AdminRole } from "../../components/AuthGuard"
import "../../admin.css"

const isAdminDomain = typeof window !== 'undefined' && window.location.hostname.startsWith('admin.')
const base = isAdminDomain ? '' : '/admin'

const navSections = [
  {
    label: "Overview",
    items: [
      { to: `${base}`, label: "Dashboard", icon: "◆" },
    ]
  },
  {
    label: "Katalog",
    items: [
      { to: `${base}/products`, label: "Produk", icon: "▣" },
      { to: `${base}/projects`, label: "Proyek", icon: "▦" },
      { to: `${base}/services`, label: "Layanan", icon: "◈" },
      { to: `${base}/testimonials`, label: "Testimoni", icon: "❝" },
    ]
  },
  {
    label: "3D Viewer",
    items: [
      { to: `${base}/models`, label: "Model 3D", icon: "◇" },
      { to: `${base}/models/config`, label: "Konfigurasi", icon: "⚙" },
    ]
  },
  {
    label: "Operasional",
    items: [
      { to: `${base}/inquiries`, label: "Inquiries", icon: "✉" },
      { to: `${base}/pdf`, label: "PDF Generator", icon: "⎙" },
    ]
  },
  {
    label: "Sistem",
    items: [
      { to: `${base}/settings`, label: "Pengaturan", icon: "⚙" },
    ]
  },
]

/** Role badge color mapping */
function getRoleBadgeColor(role: AdminRole | string): string {
  switch (role) {
    case "super_admin":
      return "bg-red-500/15 text-red-400 border-red-500/30"
    case "admin":
      return "bg-blue-500/15 text-blue-400 border-blue-500/30"
    case "editor":
      return "bg-green-500/15 text-green-400 border-green-500/30"
    default:
      return "bg-gray-500/15 text-gray-400 border-gray-500/30"
  }
}

/** Inner layout — only rendered after AuthGuard passes */
function AdminShell({
  email,
  roleLabel,
  role,
  onLogout,
}: {
  email: string
  roleLabel: string
  role: string
  onLogout: () => void
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [lightMode, setLightMode] = useState(false)
  const location = useLocation()

  // Persist theme to localStorage
  useEffect(() => {
    const stored = localStorage.getItem('admin-theme')
    if (stored === 'light') setLightMode(true)
  }, [])

  const toggleTheme = useCallback(() => {
    setLightMode((prev) => {
      const next = !prev
      localStorage.setItem('admin-theme', next ? 'light' : 'dark')
      return next
    })
  }, [])

  const isViewer = role === "viewer"

  return (
    <div className={`admin-theme${lightMode ? ' light' : ''} min-h-screen flex w-full font-mono`}
      style={{ background: 'var(--adm-bg)', color: 'var(--adm-text)' }}
    >
      {/* Sidebar */}
      <aside className={`${sidebarCollapsed ? 'w-16' : 'w-64'} border-r flex flex-col transition-all duration-200`}
        style={{ borderColor: 'var(--adm-border)', background: 'var(--adm-bg-alt)' }}
      >
        {/* Logo */}
        <div className="h-16 border-b flex items-center justify-between px-4"
          style={{ borderColor: 'var(--adm-border)' }}
        >
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-sm flex items-center justify-center"
                style={{ background: 'var(--adm-accent)' }}
              >
                <span className="font-bold text-sm" style={{ color: 'var(--adm-bg)' }}>T</span>
              </div>
              <div>
                <div className="text-sm font-bold uppercase tracking-wider">Teknomed</div>
                <div className="text-[9px] text-gray-500 uppercase tracking-widest">Admin Panel</div>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-8 h-8 flex items-center justify-center rounded transition-colors"
            style={{ color: 'var(--adm-text-muted)' }}
          >
            {sidebarCollapsed ? '→' : '←'}
          </button>
        </div>

        {isViewer && !sidebarCollapsed && (
          <div className="mx-3 mt-3 px-3 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded text-[10px] text-yellow-400 uppercase tracking-wider">
            Read-Only Mode
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          {navSections.map((section) => (
            <div key={section.label} className="mb-4">
              {!sidebarCollapsed && (
                <div className="px-4 mb-2 text-[10px] uppercase tracking-[0.2em] font-semibold"
                  style={{ color: 'var(--adm-text-muted)' }}
                >
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
                    className="flex items-center gap-3 px-4 py-2 text-sm transition-colors"
                    style={{
                      color: isActive ? 'var(--adm-text)' : 'var(--adm-text-dim)',
                      backgroundColor: isActive ? 'rgba(128,128,128,0.1)' : 'transparent',
                      borderRight: isActive ? '2px solid var(--adm-accent)' : '2px solid transparent',
                    }}
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
        <div className="border-t p-4" style={{ borderColor: 'var(--adm-border)' }}>
          {!sidebarCollapsed ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs"
                style={{ background: 'var(--adm-surface)' }}
              >
                {email?.[0]?.toUpperCase() || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs truncate" style={{ color: 'var(--adm-text)' }}>{email || 'Admin'}</div>
                <div className={`text-[10px] uppercase tracking-wider inline-block mt-0.5 px-1.5 py-0.5 rounded border ${getRoleBadgeColor(role)}`}>
                  {roleLabel}
                </div>
              </div>
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="w-7 h-7 flex items-center justify-center rounded text-xs transition-colors"
                style={{ color: 'var(--adm-text-muted)' }}
                title={lightMode ? 'Switch to dark mode' : 'Switch to light mode'}
              >
                {lightMode ? '◐' : '◑'}
              </button>
              <button
                onClick={onLogout}
                className="transition-colors text-xs"
                style={{ color: 'var(--adm-text-muted)' }}
                title="Logout"
              >
                ↗
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              {/* Theme toggle (collapsed) */}
              <button
                onClick={toggleTheme}
                className="w-8 h-8 flex items-center justify-center rounded text-xs transition-colors"
                style={{ color: 'var(--adm-text-muted)' }}
                title={lightMode ? 'Switch to dark mode' : 'Switch to light mode'}
              >
                {lightMode ? '◐' : '◑'}
              </button>
              <button
                onClick={onLogout}
                className="w-full text-center transition-colors text-xs"
                style={{ color: 'var(--adm-text-muted)' }}
                title="Logout"
              >
                ↗
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 border-b flex items-center justify-between px-6"
          style={{ borderColor: 'var(--adm-border)', background: 'var(--adm-bg-alt)' }}
        >
          <div className="flex items-center gap-4">
            <h2 className="text-sm uppercase tracking-widest"
              style={{ color: 'var(--adm-text-dim)' }}
            >
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
              className="text-xs transition-colors uppercase tracking-wider"
              style={{ color: 'var(--adm-text-dim)' }}
            >
              Lihat Site ↗
            </a>
            <div className="w-px h-4" style={{ background: 'var(--adm-border-hi)' }} />
            <span className="text-[10px] uppercase tracking-wider"
              style={{ color: 'var(--adm-text-muted)' }}
            >
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
            </span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto" style={{ background: 'var(--adm-bg)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

/**
 * AdminLayout — protected by AuthGuard.
 *
 * AuthGuard checks session + role BEFORE rendering AdminShell.
 * This means no admin content is ever sent to an unauthenticated user.
 */
export function AdminLayout() {
  return (
    <AuthGuard>
      {({ session, profile, roleLabel }) => (
        <AdminShell
          email={session.user.email || profile.email || ""}
          roleLabel={roleLabel}
          role={profile.role}
          onLogout={() => supabase.auth.signOut()}
        />
      )}
    </AuthGuard>
  )
}
