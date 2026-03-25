'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Lock, CheckCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    const { error: err } = await supabase.auth.updateUser({ password })

    if (err) {
      setError(err.message)
    } else {
      setSuccess(true)
    }
    setLoading(false)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#e0e5ec] to-[#f0f0f3] px-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/3 w-[30rem] h-[30rem] bg-violet-400 rounded-full blur-[120px] opacity-15 -z-10"></div>

      <div className="w-full max-w-md skeuo-glass rounded-[2rem] overflow-hidden p-[2px]">
        <div className="bg-white/40 rounded-[1.8rem] p-10 backdrop-blur-md">
          {success ? (
            <div className="text-center">
              <div className="w-20 h-20 skeuo-card rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h1 className="text-2xl font-black skeuo-text-emboss mb-3">Password Updated</h1>
              <p className="text-gray-500 font-medium mb-8">Your password has been successfully reset.</p>
              <Link
                href="/login"
                className="skeuo-button px-6 py-3 rounded-xl font-black uppercase tracking-widest text-blue-700 text-xs inline-flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Sign In
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-10 text-center">
                <div className="w-16 h-16 skeuo-card rounded-full flex items-center justify-center mx-auto mb-6">
                  <Lock className="w-8 h-8 text-violet-500" />
                </div>
                <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-br from-violet-700 to-purple-800 drop-shadow-sm">
                  Set New Password
                </h1>
                <p className="text-gray-500 font-medium tracking-wide text-sm mt-2">
                  Enter your new password below
                </p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-3 bg-red-50/80 border border-red-200 text-red-600 font-medium rounded-xl text-sm text-center">
                    {error}
                  </div>
                )}
                <div>
                  <label
                    className="block text-xs font-bold uppercase tracking-widest text-violet-900/60 mb-2 pl-2"
                    htmlFor="password"
                  >
                    New Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-5 py-3.5 bg-white/60 border border-white/80 rounded-2xl focus:ring-4 focus:ring-violet-400/30 focus:border-violet-400 outline-none transition-all text-gray-800 font-semibold shadow-inner"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label
                    className="block text-xs font-bold uppercase tracking-widest text-violet-900/60 mb-2 pl-2 mt-6"
                    htmlFor="confirm-password"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-5 py-3.5 bg-white/60 border border-white/80 rounded-2xl focus:ring-4 focus:ring-violet-400/30 focus:border-violet-400 outline-none transition-all text-gray-800 font-semibold shadow-inner"
                    placeholder="••••••••"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-10 skeuo-button text-violet-700 bg-white/50 backdrop-blur-md font-black uppercase tracking-widest text-sm py-4 rounded-2xl disabled:opacity-50 hover:text-violet-800 border border-white"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
