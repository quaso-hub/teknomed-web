import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../../lib/supabase"
import "../../admin.css"

export function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    else navigate("/admin")
  }

  return (
    <div className="admin-theme min-h-screen flex items-center justify-center bg-[#0a0a0a] font-mono text-white p-4">
      <div className="w-full max-w-md p-8 border border-[#333] bg-[#111] rounded-sm">
        <h1 className="text-2xl uppercase tracking-widest text-center mb-2">System Login</h1>
        <p className="text-xs text-gray-400 text-center mb-8 uppercase">Teknomed Authorized Access Only</p>
        {error && <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 text-red-400 text-xs">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs uppercase text-gray-400 mb-1">Identity</label>
            <input type="email" required className="w-full bg-[#0a0a0a] border border-[#333] p-3 text-sm focus:border-gray-500 outline-none transition-colors" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs uppercase text-gray-400 mb-1">Passcode</label>
            <input type="password" required className="w-full bg-[#0a0a0a] border border-[#333] p-3 text-sm focus:border-gray-500 outline-none transition-colors" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="w-full mt-6 bg-white text-black font-bold uppercase tracking-wider py-3 text-sm hover:bg-gray-200 transition-colors">Authenticate</button>
        </form>
      </div>
    </div>
  )
}
