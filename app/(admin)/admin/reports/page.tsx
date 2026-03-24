import { createServerSupabaseClient } from '@/lib/supabase'
import { FileText, Users, TrendingUp, DollarSign } from 'lucide-react'

export default async function AdminReportsPage() {
  const supabase = await createServerSupabaseClient()

  const [{ count: totalUsers }, { count: activeUsers }, { count: drawCount }, { data: poolData }] = await Promise.all([
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('users').select('*', { count: 'exact', head: true }).eq('subscription_status', 'active'),
    supabase.from('draws').select('*', { count: 'exact', head: true }),
    supabase.from('prize_pools').select('total_pool')
  ])

  const totalPool = poolData ? poolData.reduce((acc, p) => acc + (p.total_pool || 0), 0) : 0
  const conversionRate = totalUsers ? ((activeUsers || 0) / totalUsers * 100).toFixed(1) : '0.0'

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="skeuo-card rounded-3xl p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-400 rounded-full blur-[80px] opacity-20 -mr-10 -mt-10"></div>
        <div className="flex items-center space-x-4 relative z-10">
          <div className="w-16 h-16 skeuo-inset rounded-2xl flex items-center justify-center border border-white/30">
            <FileText className="w-8 h-8 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-3xl font-black skeuo-text-emboss">Telemetry & Reports</h1>
            <p className="text-gray-500 font-medium tracking-wide mt-1 text-sm">System analytics and key performance indicators.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="skeuo-card rounded-3xl p-8">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center">
            <Users className="w-4 h-4 mr-2" /> User Metrics
          </h3>
          <div className="space-y-4">
            <div className="skeuo-inset rounded-2xl p-5 flex justify-between items-center">
              <span className="font-bold text-gray-600">Total Registered</span>
              <span className="text-2xl font-black text-gray-700">{totalUsers || 0}</span>
            </div>
            <div className="skeuo-inset rounded-2xl p-5 flex justify-between items-center">
              <span className="font-bold text-gray-600">Active Subscribers</span>
              <span className="text-2xl font-black text-green-600">{activeUsers || 0}</span>
            </div>
            <div className="skeuo-inset rounded-2xl p-5 flex justify-between items-center">
              <span className="font-bold text-gray-600">Conversion Rate</span>
              <span className="text-2xl font-black text-blue-600">{conversionRate}%</span>
            </div>
          </div>
        </div>

        <div className="skeuo-card rounded-3xl p-8">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2" /> Draw Metrics
          </h3>
          <div className="space-y-4">
            <div className="skeuo-inset rounded-2xl p-5 flex justify-between items-center">
              <span className="font-bold text-gray-600">Total Draws Executed</span>
              <span className="text-2xl font-black text-gray-700">{drawCount || 0}</span>
            </div>
            <div className="skeuo-inset rounded-2xl p-5 flex justify-between items-center">
              <span className="font-bold text-gray-600">Accumulated Prize Pool</span>
              <span className="text-2xl font-black text-purple-600">${totalPool.toFixed(2)}</span>
            </div>
            <div className="skeuo-inset rounded-2xl p-5 flex justify-between items-center">
              <span className="font-bold text-gray-600">Avg. Pool Per Draw</span>
              <span className="text-2xl font-black text-amber-600">${drawCount ? (totalPool / drawCount).toFixed(2) : '0.00'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
