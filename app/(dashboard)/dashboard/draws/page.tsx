import { createServerSupabaseClient } from '@/lib/supabase'
import { Gift } from 'lucide-react'

export default async function DrawsPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: draws } = await supabase.from('draws').select('*').order('created_at', { ascending: false }).limit(5)
  const { data: entries } = await supabase.from('draw_entries').select('*, draws(draw_date)').eq('user_id', user?.id).order('created_at', { ascending: false })

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="flex items-center space-x-4 relative z-10">
          <div className="p-3 bg-white/20 rounded-xl">
            <Gift className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Draws & Entries</h1>
            <p className="text-purple-100 mt-1">Review past jackpot draws and verify your weekly entries.</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Draws</h2>
          {draws && draws.length > 0 ? (
            <div className="space-y-4">
              {draws.map(draw => {
                const drawDate = draw.draw_date ? new Date(draw.draw_date).toLocaleDateString() : 'Unknown Date'
                return (
                  <div key={draw.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 bg-gray-50 rounded-lg gap-4">
                    <div>
                      <div className="font-semibold text-gray-900">Draw: {drawDate}</div>
                      <div className="text-sm text-gray-500">Jackpot: ${draw.jackpot_amount?.toFixed(2) || '0.00'}</div>
                    </div>
                    <div className="flex gap-2">
                      {Array.isArray(draw.winning_numbers) ? draw.winning_numbers.map((num: number, i: number) => (
                        <span key={i} className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                          {num}
                        </span>
                      )) : <span className="text-gray-400 text-sm italic">Pending...</span>}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-gray-500">No draws have occurred yet.</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Entries</h2>
          {entries && entries.length > 0 ? (
            <div className="space-y-4">
              {entries.map(entry => {
                // @ts-ignore
                const safeDate = entry.draws?.draw_date ? new Date(entry.draws.draw_date).toLocaleDateString() : 'Unknown Draw'
                return (
                  <div key={entry.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 bg-gray-50 rounded-lg gap-4 shadow-sm border border-gray-200">
                    <div>
                      <div className="font-semibold text-gray-900">Draw: {safeDate}</div>
                      <div className="text-sm text-gray-500">Matches: {entry.match_count || 0}</div>
                    </div>
                    <div className="flex gap-2">
                      {Array.isArray(entry.numbers) ? entry.numbers.map((num: number, i: number) => (
                        <span key={i} className="w-8 h-8 rounded-full bg-white border border-gray-300 text-gray-800 flex items-center justify-center font-bold text-sm shadow-sm">
                          {num}
                        </span>
                      )) : null}
                    </div>
                    {entry.prize_tier && (
                      <div className="px-4 py-1.5 bg-green-100 text-green-800 border border-green-200 rounded-full text-sm font-bold shadow-sm">
                        Won ${entry.prize_amount?.toFixed(2) || '0.00'}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-gray-500">You haven't participated in any draws yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
