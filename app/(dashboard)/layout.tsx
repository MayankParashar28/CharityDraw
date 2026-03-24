import Link from 'next/link'
import { LayoutDashboard, Trophy, Target, Heart, Gift, LogOut } from 'lucide-react'
import { createServerSupabaseClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import { signout } from '@/app/(auth)/actions'
import MobileSidebar from '@/components/MobileSidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase.from('users').select('full_name').eq('id', user.id).single()
  
  const displayName = [profile?.full_name, user?.user_metadata?.full_name]
    .find(n => n && typeof n === 'string' && n.trim().length > 0) || 'Member'

  return (
    <div className="flex h-screen skeuo-base">
      <aside className="w-72 skeuo-inset hidden md:flex flex-col border-r border-white/40 shadow-[4px_0_24px_rgba(163,177,198,0.2)] z-10">
        <div className="h-20 flex items-center px-6 border-b border-white/30">
          <span className="text-2xl font-black skeuo-text-emboss tracking-tight">CharityDraw</span>
        </div>
        
        <div className="px-6 py-6 border-b border-white/30 skeuo-card mx-4 my-6 rounded-2xl">
          <p className="text-[10px] text-gray-500 font-extrabold uppercase tracking-widest mb-2">User Object</p>
          <p className="font-black text-gray-700 truncate text-lg tracking-tight">{displayName}</p>
          <p className="text-xs font-bold text-gray-500 truncate mt-1">{user.email}</p>
        </div>

        <nav className="flex-1 px-5 py-4 space-y-4">
          <Link href="/dashboard" className="flex items-center px-4 py-4 text-gray-600 skeuo-button rounded-xl font-extrabold uppercase tracking-widest text-[11px] group">
            <LayoutDashboard className="w-5 h-5 mr-4 text-gray-500 group-hover:text-blue-600 transition-colors" /> Dashboard View
          </Link>
          <Link href="/dashboard/scores" className="flex items-center px-4 py-4 text-gray-600 skeuo-button rounded-xl font-extrabold uppercase tracking-widest text-[11px] group">
            <Target className="w-5 h-5 mr-4 text-gray-500 group-hover:text-green-600 transition-colors" /> Log Scores
          </Link>
          <Link href="/dashboard/draws" className="flex items-center px-4 py-4 text-gray-600 skeuo-button rounded-xl font-extrabold uppercase tracking-widest text-[11px] group">
            <Gift className="w-5 h-5 mr-4 text-gray-500 group-hover:text-purple-600 transition-colors" /> Draw Results
          </Link>
          <Link href="/dashboard/charity" className="flex items-center px-4 py-4 text-gray-600 skeuo-button rounded-xl font-extrabold uppercase tracking-widest text-[11px] group">
            <Heart className="w-5 h-5 mr-4 text-gray-500 group-hover:text-pink-500 transition-colors" /> My Charity
          </Link>
          <Link href="/dashboard/winnings" className="flex items-center px-4 py-4 text-gray-600 skeuo-button rounded-xl font-extrabold uppercase tracking-widest text-[11px] group">
            <Trophy className="w-5 h-5 mr-4 text-gray-500 group-hover:text-yellow-600 transition-colors" /> Winnings
          </Link>
        </nav>
        <div className="p-6 border-t border-white/30">
          <form action={signout}>
            <button className="flex items-center justify-center w-full px-4 py-4 text-red-600 skeuo-button rounded-xl font-extrabold uppercase tracking-widest text-xs group">
              <LogOut className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" /> Disconnect
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto skeuo-base relative">
        <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>
        <MobileSidebar links={[
          { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5 text-gray-500" /> },
          { href: '/dashboard/scores', label: 'Log Scores', icon: <Target className="w-5 h-5 text-gray-500" /> },
          { href: '/dashboard/draws', label: 'Draw Results', icon: <Gift className="w-5 h-5 text-gray-500" /> },
          { href: '/dashboard/charity', label: 'My Charity', icon: <Heart className="w-5 h-5 text-gray-500" /> },
          { href: '/dashboard/winnings', label: 'Winnings', icon: <Trophy className="w-5 h-5 text-gray-500" /> },
        ]} />
        <div className="p-6 md:p-10 pt-16 md:pt-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
