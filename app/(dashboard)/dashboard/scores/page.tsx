'use client'

import { useState, useEffect } from 'react'
import ScoreEntryForm from '@/components/dashboard/ScoreEntryForm'
import ScoreHistory from '@/components/dashboard/ScoreHistory'
import { createBrowserClient } from '@supabase/ssr'
import { Target } from 'lucide-react'

export default function ScoresPage() {
  const [scores, setScores] = useState([])
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const fetchScores = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data } = await supabase.from('scores').select('*').eq('user_id', user.id).order('played_on', { ascending: false })
      setScores(data as any || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchScores()
  }, [])

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="skeuo-card rounded-3xl p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-400 rounded-full blur-[80px] opacity-20 -mr-10 -mt-10"></div>
        <div className="flex items-center space-x-4 relative z-10">
          <div className="w-16 h-16 skeuo-inset rounded-2xl flex items-center justify-center border border-white/30">
            <Target className="w-8 h-8 text-blue-500" />
          </div>
          <div>
            <h1 className="text-3xl font-black skeuo-text-emboss">Score Management</h1>
            <p className="text-gray-500 font-medium tracking-wide mt-1 text-sm">Log your golf rounds and build your entry for the next draw.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col">
          <ScoreEntryForm onScoreAdded={fetchScores} />
        </div>
        <div className="flex flex-col">
          <ScoreHistory scores={scores} loading={loading} />
        </div>
      </div>
    </div>
  )
}
