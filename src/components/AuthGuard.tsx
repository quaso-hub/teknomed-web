import { useEffect, useState, type ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import type { Session } from "@supabase/supabase-js"
import { supabase } from "../lib/supabase"

/**
 * Allowed admin roles. Only users with one of these roles can access admin routes.
 * 'viewer' is intentionally excluded — they can see data but cannot be assigned admin access.
 */
const ADMIN_ROLES = ["super_admin", "admin", "editor"] as const
export type AdminRole = (typeof ADMIN_ROLES)[number]

/** Role hierarchy for UI display */
const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  editor: "Editor",
  viewer: "Viewer",
}

interface UserProfile {
  id: string
  email: string | null
  full_name: string | null
  role: string
}

interface AuthGuardProps {
  /** Child components to render when authenticated and authorized */
  children: (props: {
    session: Session
    profile: UserProfile
    isAdmin: boolean
    isSuperAdmin: boolean
    roleLabel: string
  }) => ReactNode
}

/**
 * AuthGuard — OWASP-aligned authentication & authorization gate.
 *
 * Security model:
 * 1. Checks Supabase auth session on mount (A07:2021 — Identification & Authentication Failures)
 * 2. Fetches user role from `profiles` table (A01:2021 — Broken Access Control)
 * 3. Listens for auth state changes (session expiry, token refresh, sign-out)
 * 4. Redirects to /admin/login if no valid session
 * 5. Shows "Access Denied" if user role is not in ADMIN_ROLES
 * 6. Shows loading spinner while checking (prevents flash of protected content)
 *
 * Works on both:
 * - admin.teknomed.web.id (subdomain, routes at /)
 * - teknomed.web.id/admin (path-based, routes at /admin/)
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  // Determine login path based on current domain
  const isAdminDomain =
    typeof window !== "undefined" &&
    window.location.hostname.startsWith("admin.")
  const loginPath = isAdminDomain ? "/login" : "/admin/login"

  useEffect(() => {
    let mounted = true

    async function checkAuth() {
      try {
        // Step 1: Check session
        const {
          data: { session: currentSession },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (!mounted) return

        if (sessionError) {
          console.error("[AuthGuard] Session error:", sessionError.message)
          setError("Authentication check failed")
          setLoading(false)
          return
        }

        if (!currentSession) {
          navigate(loginPath, { replace: true })
          return
        }

        setSession(currentSession)

        // Step 2: Fetch user role from profiles table
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("id, email, full_name, role")
          .eq("id", currentSession.user.id)
          .single()

        if (!mounted) return

        if (profileError) {
          console.error("[AuthGuard] Profile fetch error:", profileError.message)
          // If profile doesn't exist, user is unauthorized
          setError("User profile not found. Contact administrator.")
          setLoading(false)
          return
        }

        if (!ADMIN_ROLES.includes(profileData.role as AdminRole)) {
          setError(
            `Access denied. Your role "${ROLE_LABELS[profileData.role] || profileData.role}" does not have admin access.`
          )
          setLoading(false)
          return
        }

        setProfile(profileData)
        setLoading(false)
      } catch (err) {
        if (!mounted) return
        console.error("[AuthGuard] Unexpected error:", err)
        setError("An unexpected authentication error occurred")
        setLoading(false)
      }
    }

    checkAuth()

    // Step 3: Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return

      if (event === "SIGNED_OUT" || !newSession) {
        setSession(null)
        setProfile(null)
        navigate(loginPath, { replace: true })
        return
      }

      if (event === "TOKEN_REFRESHED" || event === "SIGNED_IN") {
        setSession(newSession)

        // Re-fetch profile on sign-in or token refresh
        if (!profile || profile.id !== newSession.user.id) {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("id, email, full_name, role")
            .eq("id", newSession.user.id)
            .single()

          if (mounted && profileData) {
            if (!ADMIN_ROLES.includes(profileData.role as AdminRole)) {
              setError(
                `Access denied. Your role "${ROLE_LABELS[profileData.role] || profileData.role}" does not have admin access.`
              )
              setProfile(null)
              return
            }
            setProfile(profileData)
            setError(null)
          }
        }
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, loginPath])

  // Loading state — prevents flash of protected content
  if (loading) {
    return (
      <div className="admin-theme flex min-h-screen items-center justify-center bg-[#0a0a0a] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <span className="text-xs uppercase tracking-widest text-gray-500">
            Verifying access...
          </span>
        </div>
      </div>
    )
  }

  // Error state — access denied or auth failure
  if (error) {
    return (
      <div className="admin-theme flex min-h-screen items-center justify-center bg-[#0a0a0a] text-white font-mono p-4">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="w-16 h-16 mx-auto border-2 border-red-500/30 rounded-full flex items-center justify-center">
            <span className="text-2xl text-red-400">✕</span>
          </div>
          <div>
            <h1 className="text-xl uppercase tracking-widest mb-2">
              Access Denied
            </h1>
            <p className="text-sm text-gray-500">{error}</p>
          </div>
          <button
            onClick={() => {
              setError(null)
              setLoading(true)
              supabase.auth.signOut().then(() => navigate(loginPath, { replace: true }))
            }}
            className="px-6 py-2 bg-white/10 border border-[#333] text-sm hover:bg-white/20 transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    )
  }

  // Authenticated & authorized — render children
  if (session && profile) {
    const isAdmin = ADMIN_ROLES.includes(profile.role as AdminRole)
    const isSuperAdmin = profile.role === "super_admin"

    return (
      <>
        {children({
          session,
          profile,
          isAdmin,
          isSuperAdmin,
          roleLabel: ROLE_LABELS[profile.role] || profile.role,
        })}
      </>
    )
  }

  // Fallback — should not reach here
  return null
}
