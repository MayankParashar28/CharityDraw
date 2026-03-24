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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="flex items-center space-x-4 relative z-10">
          <div className="p-3 bg-white/20 rounded-xl">
            <Target className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Score Management</h1>
            <p className="text-blue-100 mt-1">Log your golf rounds and build your entry for the next draw.</p>
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
