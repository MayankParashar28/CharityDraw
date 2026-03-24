'use client'

import { Lock } from 'lucide-react'

export default function LockAdminButton() {
  const handleLock = () => {
    sessionStorage.removeItem('admin_master_key')
    window.location.reload()
  }

  return (
    <button 
      onClick={handleLock}
      className="w-full mb-3 skeuo-button flex items-center justify-center space-x-2 px-4 py-3 rounded-xl text-yellow-600 hover:text-yellow-500 border border-white/20 transition-all font-bold tracking-widest uppercase text-xs"
    >
      <Lock className="w-4 h-4" />
      <span>Lock Terminal</span>
    </button>
  )
}
