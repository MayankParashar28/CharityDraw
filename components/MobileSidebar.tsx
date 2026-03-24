'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

export default function MobileSidebar({ links, children }: { 
  links: { href: string; label: string; icon: React.ReactNode }[]
  children?: React.ReactNode 
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button 
        onClick={() => setOpen(true)} 
        className="md:hidden fixed top-4 left-4 z-50 skeuo-button p-3 rounded-xl shadow-lg"
        aria-label="Open sidebar"
      >
        <Menu className="w-5 h-5 text-gray-600" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[80] md:hidden">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 skeuo-inset z-[81] animate-in slide-in-from-left duration-300 flex flex-col p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <span className="text-xl font-black skeuo-text-emboss">Menu</span>
              <button onClick={() => setOpen(false)} className="skeuo-button p-2 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <nav className="flex flex-col gap-3 flex-1">
              {links.map((link, i) => (
                <Link 
                  key={i} 
                  href={link.href} 
                  onClick={() => setOpen(false)}
                  className="flex items-center px-4 py-4 text-gray-600 skeuo-button rounded-xl font-extrabold uppercase tracking-widest text-[11px] group"
                >
                  {link.icon}
                  <span className="ml-3">{link.label}</span>
                </Link>
              ))}
            </nav>
            {children && <div className="mt-auto pt-6 border-t border-white/30">{children}</div>}
          </aside>
        </div>
      )}
    </>
  )
}
