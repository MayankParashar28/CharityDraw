import { createServerSupabaseClient } from '@/lib/supabase'

export default async function AdminOverviewPage() {
  const supabase = await createServerSupabaseClient()
  
  // Quick stats
  const [{ count: userCount }, { count: activeUsers }, { data: poolData }] = await Promise.all([
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('users').select('*', { count: 'exact', head: true }).eq('subscription_status', 'active'),
    supabase.from('prize_pools').select('total_pool')
  ])

  const totalPrizePoolStr = poolData ? poolData.reduce((acc, p) => acc + (p.total_pool || 0), 0).toFixed(2) : '0.00'

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">System Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 font-medium mb-1">Total Users</h3>
          <div className="text-3xl font-bold text-gray-900">{userCount || 0}</div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 font-medium mb-1">Active Subscribers</h3>
          <div className="text-3xl font-bold text-green-600">{activeUsers || 0}</div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 font-medium mb-1">Total Prize Pool Tracked</h3>
          <div className="text-3xl font-bold text-purple-600">${totalPrizePoolStr}</div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 font-medium mb-1">System Health</h3>
          <div className="text-3xl font-bold text-blue-600">Online</div>
        </div>
      </div>
    </div>
  )
}
