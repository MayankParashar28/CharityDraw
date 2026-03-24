'use client'

import { useActionState } from 'react'
import { login } from '../actions'

// Note: metadata can't be exported from client components.
// This is handled by the parent layout template.

const initialState = { error: '' }

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState)

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#e0e5ec] to-[#f0f0f3] px-4 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-blue-400 rounded-full blur-[120px] opacity-30 -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-indigo-300 rounded-full blur-[120px] opacity-20 -z-10"></div>
      
      <div className="w-full max-w-md skeuo-glass rounded-[2rem] overflow-hidden p-[2px]">
        <div className="bg-white/40 rounded-[1.8rem] p-10 backdrop-blur-md">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-br from-blue-700 to-indigo-800 drop-shadow-sm">Welcome Back</h1>
            <p className="text-blue-800/60 font-medium tracking-wide text-sm mt-2">Sign in to access your dashboard</p>
          </div>
          <form action={formAction} className="space-y-6">
            {state?.error && (
              <div className="p-3 bg-red-50/80 border border-red-200 text-red-600 font-medium rounded-xl text-sm text-center backdrop-blur-md shadow-sm">
                {state.error}
              </div>
            )}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-blue-900/60 mb-2 pl-2" htmlFor="email">Email Address</label>
              <input 
                id="email"
                name="email"
                type="email" 
                required 
                className="w-full px-5 py-3.5 bg-white/60 border border-white/80 rounded-2xl focus:ring-4 focus:ring-blue-400/30 focus:border-blue-400 outline-none transition-all text-gray-800 font-semibold shadow-inner"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-blue-900/60 mb-2 pl-2 mt-6" htmlFor="password">Password</label>
              <input 
                id="password"
                name="password"
                type="password" 
                required 
                className="w-full px-5 py-3.5 bg-white/60 border border-white/80 rounded-2xl focus:ring-4 focus:ring-blue-400/30 focus:border-blue-400 outline-none transition-all text-gray-800 font-semibold shadow-inner"
                placeholder="••••••••"
              />
            </div>
            <button 
              type="submit"
              disabled={pending}
              className="w-full mt-10 skeuo-button text-blue-700 bg-white/50 backdrop-blur-md font-black uppercase tracking-widest text-sm py-4 rounded-2xl disabled:opacity-50 hover:text-blue-800 border border-white"
            >
              {pending ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
          <div className="mt-8 text-center text-sm font-semibold text-blue-900/50">
            <a href="/forgot-password" className="text-blue-600 hover:text-blue-700 underline decoration-blue-300 underline-offset-4">Forgot password?</a>
          </div>
          <div className="mt-4 text-center text-sm font-semibold text-blue-900/50">
            Don't have an account? <a href="/signup" className="text-blue-700 hover:text-blue-800 underline decoration-blue-300 underline-offset-4">Create one</a>
          </div>
        </div>
      </div>
    </div>
  )
}
