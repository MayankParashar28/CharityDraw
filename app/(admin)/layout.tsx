import Link from 'next/link'
import { LayoutDashboard, Users, Gift, Heart, Trophy, FileText, LogOut, ArrowLeft } from 'lucide-react'
import { createServerSupabaseClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import { signout } from '@/app/(auth)/actions'
import AdminUnlocker from '@/components/admin/AdminUnlocker'
import LockAdminButton from '@/components/admin/LockAdminButton'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase.from('users').select('role, full_name').eq('id', user.id).single()
  if (profile?.role !== 'admin') {
    redirect('/dashboard')
  }

  const displayName = [profile?.full_name, user?.user_metadata?.full_name]
    .find(n => n && typeof n === 'string' && n.trim().length > 0) || 'Administrator'

  return (
    <AdminUnlocker>
    <div className="flex h-screen skeuo-base">
      <aside className="w-72 skeuo-inset border-r border-white/40 shadow-[4px_0_24px_rgba(163,177,198,0.2)] hidden md:flex flex-col z-10">
        <div className="h-20 flex items-center px-6 border-b border-white/30">
          <span className="text-2xl font-black skeuo-text-emboss tracking-tight text-gray-700">Admin Control</span>
        </div>

        <div className="px-6 py-6 border-b border-white/30 skeuo-card mx-4 my-6 rounded-2xl">
          <p className="text-[10px] text-gray-500 font-extrabold uppercase tracking-widest mb-2">SysAdmin</p>
          <p className="font-black text-gray-700 truncate text-lg tracking-tight">{displayName}</p>
          <p className="text-xs font-bold text-gray-500 truncate mt-1">{user.email}</p>
        </div>

        <nav className="flex-1 px-5 py-4 space-y-4">
          <Link href="/admin" className="flex items-center px-4 py-4 text-gray-600 skeuo-button rounded-xl font-extrabold uppercase tracking-widest text-[11px] group">
            <LayoutDashboard className="w-5 h-5 mr-4 text-gray-500 group-hover:text-amber-600 transition-colors" /> Overview
          </Link>
          <Link href="/admin/users" className="flex items-center px-4 py-4 text-gray-600 skeuo-button rounded-xl font-extrabold uppercase tracking-widest text-[11px] group">
            <Users className="w-5 h-5 mr-4 text-gray-500 group-hover:text-blue-600 transition-colors" /> Users Array
          </Link>
          <Link href="/admin/draws" className="flex items-center px-4 py-4 text-gray-600 skeuo-button rounded-xl font-extrabold uppercase tracking-widest text-[11px] group">
            <Gift className="w-5 h-5 mr-4 text-gray-500 group-hover:text-purple-600 transition-colors" /> Draw Engine
          </Link>
          <Link href="/admin/charities" className="flex items-center px-4 py-4 text-gray-600 skeuo-button rounded-xl font-extrabold uppercase tracking-widest text-[11px] group">
            <Heart className="w-5 h-5 mr-4 text-gray-500 group-hover:text-pink-600 transition-colors" /> Charities
          </Link>
          <Link href="/admin/winners" className="flex items-center px-4 py-4 text-gray-600 skeuo-button rounded-xl font-extrabold uppercase tracking-widest text-[11px] group">
            <Trophy className="w-5 h-5 mr-4 text-gray-500 group-hover:text-yellow-600 transition-colors" /> Winners
          </Link>
          <Link href="/admin/reports" className="flex items-center px-4 py-4 text-gray-600 skeuo-button rounded-xl font-extrabold uppercase tracking-widest text-[11px] group">
            <FileText className="w-5 h-5 mr-4 text-gray-500 group-hover:text-emerald-600 transition-colors" /> Telemetry
          </Link>
        </nav>
        <div className="p-6 border-t border-white/30 mt-auto">
          <Link href="/dashboard" className="flex items-center justify-center w-full px-4 py-4 text-gray-500 skeuo-button rounded-xl font-extrabold uppercase tracking-widest text-xs group mb-4">
            <ArrowLeft className="w-4 h-4 mr-3 group-hover:-translate-x-1 transition-transform" /> Exit Admin
          </Link>
          <div className="flex flex-col space-y-3">
            <LockAdminButton />
            <form action={signout}>
              <button className="w-full skeuo-button flex items-center justify-center space-x-2 px-4 py-3 rounded-xl text-red-500 hover:text-red-400 border border-white/20 transition-all font-bold tracking-widest uppercase text-xs">
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </form>
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto skeuo-base relative">
        <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
    </AdminUnlocker>
  )
}
