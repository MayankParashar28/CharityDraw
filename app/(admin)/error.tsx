'use client'

import { AlertTriangle } from 'lucide-react'

export default function AdminError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="skeuo-card rounded-3xl p-12 text-center max-w-md">
        <div className="w-20 h-20 skeuo-inset rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-red-400" />
        </div>
        <h2 className="text-2xl font-black skeuo-text-emboss mb-3">Admin Error</h2>
        <p className="text-gray-500 font-medium mb-8">{error.message || 'An unexpected error occurred.'}</p>
        <button onClick={reset} className="skeuo-button px-8 py-3 rounded-xl font-black uppercase tracking-widest text-blue-600 text-sm">
          Retry
        </button>
      </div>
    </div>
  )
}
