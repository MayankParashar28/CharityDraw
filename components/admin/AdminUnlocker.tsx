'use client'

import { useState, useEffect } from 'react'
import { Lock, Unlock, AlertTriangle } from 'lucide-react'

export default function AdminUnlocker({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [mounting, setMounting] = useState(true)

  useEffect(() => {
    if (sessionStorage.getItem('admin_master_key') === 'granted') {
      setUnlocked(true)
    }
    setMounting(false)
  }, [])

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault()
    const validPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'
    if (password === validPass) {
      sessionStorage.setItem('admin_master_key', 'granted')
      setUnlocked(true)
    } else {
      setError(true)
      setPassword('')
      setTimeout(() => setError(false), 2000)
    }
  }

  if (mounting) return null // Prevent hydration flash

  if (unlocked) return <>{children}</>

  return (
    <div className="fixed inset-0 z-[100] skeuo-base flex flex-col items-center justify-center p-4">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500 rounded-full blur-[150px] opacity-10 -z-10 animate-pulse"></div>
      
      <div className={`skeuo-card max-w-sm w-full p-2 rounded-3xl transition-transform duration-300 ${error ? 'animate-bounce' : ''}`}>
        <div className="skeuo-inset rounded-2xl p-10 flex flex-col items-center border border-white/20">
          <div className="w-24 h-24 rounded-full skeuo-base shadow-inner flex items-center justify-center mb-6">
            <Lock className={`w-10 h-10 ${error ? 'text-red-500' : 'text-gray-400'}`} />
          </div>
          
          <h2 className="text-2xl font-black skeuo-text-emboss mb-2 text-center uppercase tracking-widest">Master Override</h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8 text-center flex items-center justify-center">
             {error ? <><AlertTriangle className="w-3 h-3 mr-1 text-red-500"/> Auth Failed</> : 'Enter Security Key'}
          </p>

          <form onSubmit={handleUnlock} className="w-full space-y-6">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-center text-3xl tracking-[0.5em] font-black text-gray-700 skeuo-inset py-4 rounded-xl outline-none focus:ring-2 focus:ring-red-400/50 bg-transparent border-none placeholder:text-gray-300 transition-all"
              placeholder="••••"
              autoFocus
            />
            
            <button 
              type="submit"
              className="w-full skeuo-button py-4 rounded-xl font-black uppercase tracking-widest text-gray-600 hover:text-red-500 transition-colors flex items-center justify-center"
            >
              <Unlock className="w-4 h-4 mr-2" /> Disengage Lock
            </button>
          </form>
          
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-8 opacity-50 text-center">
            System Key Required
          </p>
        </div>
      </div>
    </div>
  )
}
