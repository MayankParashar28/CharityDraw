import { createServerSupabaseClient } from '@/lib/supabase'
import Link from 'next/link'
import { ArrowRight, Info, Heart, Target, CalendarDays } from 'lucide-react'

export default async function DashboardHomePage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('users').select('*').eq('id', user?.id).single()

  const displayName = [profile?.full_name, user?.user_metadata?.full_name]
    .find(n => n && typeof n === 'string' && n.trim().length > 0) || 'Player'

  // Fetch their charity
  let charityName = 'No Charity Selected'
  if (profile?.charity_id) {
    const { data: charity } = await supabase.from('charities').select('name').eq('id', profile.charity_id).single()
    if (charity) charityName = charity.name
  }

  // Fetch their scores
  const { data: scores } = await supabase
    .from('scores')
    .select('score, played_on')
    .eq('user_id', user?.id)
    .order('played_on', { ascending: false })

  const scoreCount = scores?.length || 0

  // Fetch next draw
  const { data: nextDraw } = await supabase
    .from('draws')
    .select('draw_date')
    .eq('status', 'draft')
    .order('draw_date', { ascending: true })
    .limit(1)
    .single()

  const nextDrawDate = nextDraw ? new Date(nextDraw.draw_date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }) : 'To Be Announced'

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-4xl font-black skeuo-text-emboss">Welcome back, {displayName}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="skeuo-card p-8 rounded-3xl relative overflow-hidden group transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
          <h3 className="text-gray-500 font-medium mb-1 relative z-10 flex items-center">
            <Info className="w-4 h-4 mr-2" /> Subscription Status
          </h3>
          <div className="text-2xl font-bold capitalize text-gray-900 flex items-center relative z-10 mt-2">
            {profile?.subscription_status || 'Inactive'}
            {profile?.subscription_status === 'active' && <span className="ml-3 w-3 h-3 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>}
          </div>
          <p className="text-sm text-gray-500 mt-2 relative z-10 font-medium tracking-wide">Plan: {profile?.subscription_plan === 'yearly' ? 'Yearly Supporter' : profile?.subscription_plan === 'monthly' ? 'Monthly Supporter' : 'None'}</p>
        </div>
        
        <div className="skeuo-card p-8 rounded-3xl relative overflow-hidden group transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-400 rounded-full blur-[60px] opacity-20 -mr-10 -mt-10 transition-transform group-hover:scale-125"></div>
          <h3 className="text-gray-500 font-extrabold mb-1 relative z-10 flex items-center uppercase tracking-widest text-[10px]">
            <Heart className="w-4 h-4 mr-2 text-pink-500" /> Selected Charity
          </h3>
          <div className="text-2xl font-black text-gray-800 relative z-10 mt-3 truncate pr-4">{charityName}</div>
          <p className="text-sm text-gray-500 mt-2 relative z-10 font-medium tracking-wide">Donating <strong className="text-pink-600 font-extrabold">{profile?.charity_percentage || 10}%</strong> of capacity</p>
        </div>

        <div className="skeuo-card p-8 rounded-3xl relative overflow-hidden ring-4 ring-blue-500/20">
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500 rounded-full blur-[70px] opacity-20 -mr-10 -mt-10"></div>
          <div className="absolute bottom-0 right-0 opacity-5 blur-[2px]">
            <CalendarDays className="w-48 h-48" />
          </div>
          <h3 className="text-blue-600 font-extrabold mb-1 relative z-10 flex items-center uppercase tracking-widest text-[10px]">
            <Target className="w-4 h-4 mr-2" /> Next Jackpot Draw
          </h3>
          <div className="text-3xl font-black text-gray-800 relative z-10 mt-3 tracking-tighter">{nextDrawDate}</div>
          <p className="text-sm font-bold text-blue-600 mt-2 relative z-10 uppercase tracking-widest">
            {scoreCount >= 5 
              ? '✅ Chamber Fully Loaded' 
              : `⚠️ ${5 - scoreCount} Parameters Missing`}
          </p>
        </div>
      </div>

      <div className="mt-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-black skeuo-text-emboss">Live Score Array</h2>
            <p className="text-gray-500 font-medium tracking-wide mt-1 text-sm">Your mechanical draw inputs over the last 5 cycles.</p>
          </div>
          <Link href="/dashboard/scores" className="skeuo-button text-blue-600 px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center">
            Input <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>

        {scoreCount === 0 ? (
          <div className="skeuo-inset rounded-3xl p-16 text-center text-gray-500">
            <div className="w-20 h-20 skeuo-card rounded-full flex items-center justify-center mx-auto mb-6">
              <Target className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-xl font-black text-gray-600 uppercase tracking-widest">Array Empty</p>
            <p className="mt-3 text-md max-w-sm mx-auto font-medium">Input your first physical golf score to initiate the rolling draw cylinder.</p>
            <Link href="/dashboard/scores" className="mt-8 inline-flex items-center skeuo-button text-blue-700 px-8 py-3 rounded-2xl font-black uppercase tracking-widest">
              Commence Logging
            </Link>
          </div>
        ) : (
          <div className="skeuo-card rounded-3xl overflow-hidden p-2">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
              {scores?.map((scoreObj, i) => (
                <div key={i} className="p-8 text-center skeuo-inset rounded-2xl flex flex-col justify-center relative overflow-hidden group">
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-500 opacity-50"></div>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-3">Position {i + 1}</p>
                  <p className="text-5xl font-black text-gray-700 tracking-tighter drop-shadow-md">
                    {scoreObj.score}
                  </p>
                  <p className="text-xs font-bold text-gray-500 mt-4 uppercase tracking-widest">{new Date(scoreObj.played_on).toLocaleDateString()}</p>
                </div>
              ))}
              
              {/* Fill remaining with empty slots if < 5 */}
              {Array.from({ length: 5 - scoreCount }).map((_, i) => (
                <div key={`empty-${i}`} className="p-8 text-center flex flex-col items-center justify-center skeuo-inset rounded-2xl opacity-60">
                  <div className="w-16 h-16 rounded-full skeuo-base flex items-center justify-center mb-4 shadow-inner border border-white/20">
                    <span className="text-gray-400 font-black text-xl">?</span>
                  </div>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Null Output</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
