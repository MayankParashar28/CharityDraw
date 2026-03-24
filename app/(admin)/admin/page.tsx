import { createServerSupabaseClient } from '@/lib/supabase'
import { LayoutDashboard, Users, Activity, DollarSign } from 'lucide-react'

export default async function AdminOverviewPage() {
  const supabase = await createServerSupabaseClient()
  
  const [{ count: userCount }, { count: activeUsers }, { data: poolData }] = await Promise.all([
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('users').select('*', { count: 'exact', head: true }).eq('subscription_status', 'active'),
    supabase.from('prize_pools').select('total_pool')
  ])

  const totalPrizePoolStr = poolData ? poolData.reduce((acc, p) => acc + (p.total_pool || 0), 0).toFixed(2) : '0.00'

  const stats = [
    { label: 'Total Users', value: userCount || 0, icon: Users, color: 'text-blue-500' },
    { label: 'Active Subscribers', value: activeUsers || 0, icon: Activity, color: 'text-green-500' },
    { label: 'Total Prize Pool', value: `$${totalPrizePoolStr}`, icon: DollarSign, color: 'text-purple-500' },
    { label: 'System Health', value: 'Online', icon: LayoutDashboard, color: 'text-emerald-500' },
  ]

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-4xl font-black skeuo-text-emboss">System Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="skeuo-card p-8 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-28 h-28 bg-gray-400 rounded-full blur-[60px] opacity-10 -mr-8 -mt-8 group-hover:opacity-20 transition-opacity"></div>
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 skeuo-inset rounded-xl flex items-center justify-center border border-white/30">
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{stat.label}</h3>
            <div className="text-3xl font-black text-gray-700">{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
