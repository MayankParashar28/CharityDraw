'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

export default function MobileNav({ user }: { user: boolean }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button 
        onClick={() => setOpen(!open)} 
        className="md:hidden skeuo-button p-2.5 rounded-xl"
        aria-label="Toggle menu"
      >
        {open ? <X className="w-5 h-5 text-gray-600" /> : <Menu className="w-5 h-5 text-gray-600" />}
      </button>

      {open && (
        <div className="fixed inset-0 z-[90] md:hidden">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute top-20 right-4 left-4 skeuo-card rounded-3xl p-6 z-[91] animate-in slide-in-from-top-2 duration-300">
            <nav className="flex flex-col gap-3 mb-6">
              <a href="#how-it-works" onClick={() => setOpen(false)} className="skeuo-button px-5 py-4 rounded-xl text-gray-600 font-bold uppercase tracking-widest text-xs text-center">
                How It Works
              </a>
              <Link href="/charities" onClick={() => setOpen(false)} className="skeuo-button px-5 py-4 rounded-xl text-gray-600 font-bold uppercase tracking-widest text-xs text-center">
                Charities
              </Link>
              <a href="#pricing" onClick={() => setOpen(false)} className="skeuo-button px-5 py-4 rounded-xl text-gray-600 font-bold uppercase tracking-widest text-xs text-center">
                Pricing
              </a>
            </nav>
            <div className="flex flex-col gap-3 pt-3 border-t border-white/40">
              {user ? (
                <Link href="/dashboard" onClick={() => setOpen(false)} className="skeuo-button px-5 py-4 rounded-xl text-blue-700 font-black uppercase tracking-widest text-xs text-center">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/login" onClick={() => setOpen(false)} className="skeuo-button px-5 py-4 rounded-xl text-gray-600 font-bold uppercase tracking-widest text-xs text-center">
                    Log In
                  </Link>
                  <Link href="/signup" onClick={() => setOpen(false)} className="skeuo-button px-5 py-4 rounded-xl text-blue-700 font-black uppercase tracking-widest text-xs text-center border-blue-200">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
