import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../../lib/supabase"
import "../../admin.css"

/** Maximum failed login attempts before showing cooldown warning */
const MAX_ATTEMPTS = 5
/** Cooldown duration in seconds */
const COOLDOWN_SECONDS = 30

export function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const [failedAttempts, setFailedAttempts] = useState(0)
  const [cooldown, setCooldown] = useState(0)
  const navigate = useNavigate()

  // Determine admin root path based on domain
  const isAdminDomain =
    typeof window !== "undefined" &&
    window.location.hostname.startsWith("admin.")
  const adminPath = isAdminDomain ? "/" : "/admin"

  // Redirect to admin if already authenticated
  useEffect(() => {
    let mounted = true

    async function checkExistingSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!mounted) return

        if (session) {
          // Verify user still has admin role before redirecting
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", session.user.id)
            .single()

          if (!mounted) return

          if (profile && ["super_admin", "admin", "editor"].includes(profile.role)) {
            navigate(adminPath, { replace: true })
            return
          }
        }
      } catch {
        // Ignore errors — show login form
      } finally {
        if (mounted) setCheckingSession(false)
      }
    }

    checkExistingSession()

    return () => {
      mounted = false
    }
  }, [navigate, adminPath])

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (cooldown > 0 || loading) return

    setError("")
    setLoading(true)

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (authError) {
        // Increment failed attempts for rate limiting awareness
        const newAttempts = failedAttempts + 1
        setFailedAttempts(newAttempts)

        // After MAX_ATTEMPTS failures, enforce client-side cooldown
        if (newAttempts >= MAX_ATTEMPTS) {
          setCooldown(COOLDOWN_SECONDS)
          setFailedAttempts(0)
          setError(
            `Too many failed attempts. Please wait ${COOLDOWN_SECONDS} seconds before trying again.`
          )
        } else {
          // Generic error message — don't reveal whether email exists (OWASP A07)
          setError("Invalid email or password. Please try again.")
        }
        setLoading(false)
        return
      }

      if (data.session) {
        // Verify admin role before redirecting
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single()

        if (profileError || !profile) {
          await supabase.auth.signOut()
          setError("Account not found. Contact administrator.")
          setLoading(false)
          return
        }

        if (!["super_admin", "admin", "editor"].includes(profile.role)) {
          await supabase.auth.signOut()
          setError("Your account does not have admin access.")
          setLoading(false)
          return
        }

        // Successful login — navigate to admin
        navigate(adminPath, { replace: true })
      }
    } catch {
      setError("An unexpected error occurred. Please try again.")
      setLoading(false)
    }
  }

  // Show loading while checking existing session
  if (checkingSession) {
    return (
      <div className="admin-theme min-h-screen flex items-center justify-center bg-[#0a0a0a] font-mono text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <span className="text-xs uppercase tracking-widest text-gray-500">
            Checking session...
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-theme min-h-screen flex items-center justify-center bg-[#0a0a0a] font-mono text-white p-4">
      <div className="w-full max-w-md p-8 border border-[#333] bg-[#111] rounded-sm">
        <h1 className="text-2xl uppercase tracking-widest text-center mb-2">
          System Login
        </h1>
        <p className="text-xs text-gray-400 text-center mb-8 uppercase">
          Teknomed Authorized Access Only
        </p>

        {/* Error display */}
        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 text-red-400 text-xs">
            {error}
          </div>
        )}

        {/* Rate limit warning */}
        {failedAttempts >= 3 && failedAttempts < MAX_ATTEMPTS && (
          <div className="mb-4 p-3 bg-yellow-900/20 border border-yellow-500/30 text-yellow-400 text-xs">
            {MAX_ATTEMPTS - failedAttempts} attempt(s) remaining before cooldown.
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs uppercase text-gray-400 mb-1">
              Identity
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              className="w-full bg-[#0a0a0a] border border-[#333] p-3 text-sm focus:border-gray-500 outline-none transition-colors disabled:opacity-50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading || cooldown > 0}
            />
          </div>
          <div>
            <label className="block text-xs uppercase text-gray-400 mb-1">
              Passcode
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              className="w-full bg-[#0a0a0a] border border-[#333] p-3 text-sm focus:border-gray-500 outline-none transition-colors disabled:opacity-50"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading || cooldown > 0}
            />
          </div>
          <button
            type="submit"
            disabled={loading || cooldown > 0}
            className="w-full mt-6 bg-white text-black font-bold uppercase tracking-wider py-3 text-sm hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? "Authenticating..."
              : cooldown > 0
                ? `Wait ${cooldown}s...`
                : "Authenticate"}
          </button>
        </form>

        <p className="mt-6 text-[10px] text-gray-600 text-center uppercase tracking-wider">
          Protected by PKCE authentication flow
        </p>
      </div>
    </div>
  )
}
