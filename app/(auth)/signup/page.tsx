'use client'

import { useActionState } from 'react'
import { signup } from '../actions'
import { Mail, CheckCircle } from 'lucide-react'
import Link from 'next/link'

const initialState: { error?: string; success?: boolean; email?: string } = {}

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signup, initialState)

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#e0e5ec] to-[#f0f0f3] px-4 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-green-400 rounded-full blur-[120px] opacity-20 -z-10 animate-pulse"></div>
      <div className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-emerald-300 rounded-full blur-[120px] opacity-10 -z-10"></div>
      
      <div className="w-full max-w-md skeuo-glass rounded-[2rem] overflow-hidden p-[2px]">
        <div className="bg-white/40 rounded-[1.8rem] p-10 backdrop-blur-md">
          {state?.success ? (
            <div className="text-center">
              <div className="w-20 h-20 skeuo-card rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h1 className="text-2xl font-black skeuo-text-emboss mb-3">Check Your Email</h1>
              <p className="text-gray-500 font-medium mb-2">
                We sent a confirmation link to
              </p>
              <p className="text-green-700 font-bold mb-8">{state.email}</p>
              <p className="text-gray-400 text-sm font-medium mb-8">
                Click the link in the email to activate your account. Check your spam folder if you don't see it.
              </p>
              <Link
                href="/login"
                className="skeuo-button px-6 py-3 rounded-xl font-black uppercase tracking-widest text-blue-700 text-xs inline-flex items-center"
              >
                <Mail className="w-4 h-4 mr-2" /> Go to Login
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-10 text-center">
                <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-br from-green-700 to-emerald-800 drop-shadow-sm">Create Account</h1>
                <p className="text-green-900/60 font-medium tracking-wide text-sm mt-2">Join to support charity and win prizes</p>
              </div>
              <form action={formAction} className="space-y-6">
                {state?.error && (
                  <div className="p-3 bg-red-50/80 border border-red-200 text-red-600 font-medium rounded-xl text-sm text-center backdrop-blur-md shadow-sm">
                    {state.error}
                  </div>
                )}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-green-900/60 mb-2 pl-2" htmlFor="full_name">Full Name</label>
                  <input 
                    id="full_name"
                    name="full_name"
                    type="text" 
                    required 
                    className="w-full px-5 py-3.5 bg-white/60 border border-white/80 rounded-2xl focus:ring-4 focus:ring-green-400/30 focus:border-green-400 outline-none transition-all text-gray-800 font-semibold shadow-inner"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-green-900/60 mb-2 pl-2 mt-6" htmlFor="email">Email Address</label>
                  <input 
                    id="email"
                    name="email"
                    type="email" 
                    required 
                    className="w-full px-5 py-3.5 bg-white/60 border border-white/80 rounded-2xl focus:ring-4 focus:ring-green-400/30 focus:border-green-400 outline-none transition-all text-gray-800 font-semibold shadow-inner"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-green-900/60 mb-2 pl-2 mt-6" htmlFor="password">Password</label>
                  <input 
                    id="password"
                    name="password"
                    type="password" 
                    required 
                    className="w-full px-5 py-3.5 bg-white/60 border border-white/80 rounded-2xl focus:ring-4 focus:ring-green-400/30 focus:border-green-400 outline-none transition-all text-gray-800 font-semibold shadow-inner"
                    placeholder="••••••••"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={pending}
                  className="w-full mt-10 skeuo-button text-green-700 bg-white/50 backdrop-blur-md font-black uppercase tracking-widest text-sm py-4 rounded-2xl disabled:opacity-50 hover:text-green-800 border border-white"
                >
                  {pending ? 'Creating Account...' : 'Sign Up'}
                </button>
              </form>
              <div className="mt-8 text-center text-sm font-semibold text-green-900/50">
                Already have an account? <a href="/login" className="text-green-700 hover:text-green-800 underline decoration-green-300 underline-offset-4">Sign in</a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
