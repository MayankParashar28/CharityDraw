import { createServerSupabaseClient } from '@/lib/supabase'
import { Gift } from 'lucide-react'

export default async function DrawsPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: draws } = await supabase.from('draws').select('*').order('created_at', { ascending: false }).limit(5)
  const { data: entries } = await supabase.from('draw_entries').select('*, draws(draw_date)').eq('user_id', user?.id).order('created_at', { ascending: false })

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="skeuo-card rounded-3xl p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-purple-400 rounded-full blur-[80px] opacity-20 -mr-10 -mt-10"></div>
        <div className="flex items-center space-x-4 relative z-10">
          <div className="w-16 h-16 skeuo-inset rounded-2xl flex items-center justify-center border border-white/30">
            <Gift className="w-8 h-8 text-purple-500" />
          </div>
          <div>
            <h1 className="text-3xl font-black skeuo-text-emboss">Draws & Entries</h1>
            <p className="text-gray-500 font-medium tracking-wide mt-1 text-sm">Review past jackpot draws and verify your weekly entries.</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-8">
        <div className="skeuo-card p-8 rounded-3xl">
          <h2 className="text-xl font-black skeuo-text-emboss mb-6">Recent Draws</h2>
          {draws && draws.length > 0 ? (
            <div className="space-y-4">
              {draws.map(draw => {
                const drawDate = draw.draw_date ? new Date(draw.draw_date).toLocaleDateString() : 'Unknown Date'
                return (
                  <div key={draw.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-5 skeuo-inset rounded-2xl gap-4">
                    <div>
                      <div className="font-black text-gray-700">Draw: {drawDate}</div>
                      <div className="text-sm font-medium text-gray-500">Jackpot: ${draw.jackpot_amount?.toFixed(2) || '0.00'}</div>
                    </div>
                    <div className="flex gap-2">
                      {Array.isArray(draw.winning_numbers) ? draw.winning_numbers.map((num: number, i: number) => (
                        <span key={i} className="w-10 h-10 rounded-xl skeuo-card text-blue-700 flex items-center justify-center font-black text-sm">
                          {num}
                        </span>
                      )) : <span className="text-gray-400 text-sm italic font-medium">Pending...</span>}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-gray-500 font-medium">No draws have occurred yet.</p>
          )}
        </div>

        <div className="skeuo-card p-8 rounded-3xl">
          <h2 className="text-xl font-black skeuo-text-emboss mb-6">Your Entries</h2>
          {entries && entries.length > 0 ? (
            <div className="space-y-4">
              {entries.map(entry => {
                // @ts-ignore
                const safeDate = entry.draws?.draw_date ? new Date(entry.draws.draw_date).toLocaleDateString() : 'Unknown Draw'
                return (
                  <div key={entry.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-5 skeuo-inset rounded-2xl gap-4">
                    <div>
                      <div className="font-black text-gray-700">Draw: {safeDate}</div>
                      <div className="text-sm font-medium text-gray-500">Matches: {entry.match_count || 0}</div>
                    </div>
                    <div className="flex gap-2">
                      {Array.isArray(entry.numbers) ? entry.numbers.map((num: number, i: number) => (
                        <span key={i} className="w-10 h-10 rounded-xl skeuo-card text-gray-700 flex items-center justify-center font-black text-sm border border-white/40">
                          {num}
                        </span>
                      )) : null}
                    </div>
                    {entry.prize_tier && (
                      <div className="px-5 py-2 skeuo-button rounded-xl text-green-700 font-black text-sm">
                        Won ${entry.prize_amount?.toFixed(2) || '0.00'}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-gray-500 font-medium">You haven't participated in any draws yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
