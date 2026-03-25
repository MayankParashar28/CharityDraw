'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
    })
    if (err) {
      setError(err.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#e0e5ec] to-[#f0f0f3] px-4 relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-[30rem] h-[30rem] bg-amber-400 rounded-full blur-[120px] opacity-15 -z-10"></div>
      
      <div className="w-full max-w-md skeuo-glass rounded-[2rem] overflow-hidden p-[2px]">
        <div className="bg-white/40 rounded-[1.8rem] p-10 backdrop-blur-md">
          {sent ? (
            <div className="text-center">
              <div className="w-20 h-20 skeuo-card rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h1 className="text-2xl font-black skeuo-text-emboss mb-3">Check Your Email</h1>
              <p className="text-gray-500 font-medium mb-8">We sent a password reset link to <strong>{email}</strong>.</p>
              <Link href="/login" className="skeuo-button px-6 py-3 rounded-xl font-black uppercase tracking-widest text-blue-700 text-xs inline-flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-10 text-center">
                <div className="w-16 h-16 skeuo-card rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-8 h-8 text-amber-500" />
                </div>
                <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-br from-amber-700 to-orange-800 drop-shadow-sm">Reset Password</h1>
                <p className="text-gray-500 font-medium tracking-wide text-sm mt-2">Enter your email to receive a reset link</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-3 bg-red-50/80 border border-red-200 text-red-600 font-medium rounded-xl text-sm text-center">
                    {error}
                  </div>
                )}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-amber-900/60 mb-2 pl-2" htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-5 py-3.5 bg-white/60 border border-white/80 rounded-2xl focus:ring-4 focus:ring-amber-400/30 focus:border-amber-400 outline-none transition-all text-gray-800 font-semibold shadow-inner"
                    placeholder="you@example.com"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full skeuo-button text-amber-700 bg-white/50 backdrop-blur-md font-black uppercase tracking-widest text-sm py-4 rounded-2xl disabled:opacity-50 border border-white"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
              <div className="mt-8 text-center text-sm font-semibold text-gray-500">
                Remember your password? <Link href="/login" className="text-amber-700 hover:text-amber-800 underline decoration-amber-300 underline-offset-4">Sign in</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
