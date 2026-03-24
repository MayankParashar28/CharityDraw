import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { generateRandomNumbers, generateAlgorithmicNumbers, countMatches } from '@/lib/drawEngine'
import { calculatePrizePools } from '@/lib/prizeCalculator'

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return new NextResponse('Unauthorized', { status: 401 })
    const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') return new NextResponse('Forbidden', { status: 403 })

    const { type } = await req.json()
    
    const winningNumbers = type === 'algorithmic' 
      ? await generateAlgorithmicNumbers() 
      : generateRandomNumbers()

    const { data: activeUsers } = await supabase.from('users').select('id').eq('subscription_status', 'active')
    const activeSubscribersCount = activeUsers?.length || 0

    const pools = calculatePrizePools(activeSubscribersCount)

    let tier5Winners = 0
    let tier4Winners = 0
    let tier3Winners = 0

    if (activeUsers && activeUsers.length > 0) {
      const activeIds = activeUsers.map((u: any) => u.id)
      const { data: scores } = await supabase.from('scores').select('user_id, score').in('user_id', activeIds)
      
      const userScores: Record<string, number[]> = {}
      scores?.forEach(s => {
        if (!userScores[s.user_id]) userScores[s.user_id] = []
        userScores[s.user_id].push(s.score)
      })

      Object.keys(userScores).forEach(uid => {
        const userNumbers = userScores[uid].slice(-5) 
        if (userNumbers.length === 5) {
           const matches = countMatches(userNumbers, winningNumbers)
           if (matches === 5) tier5Winners++
           if (matches === 4) tier4Winners++
           if (matches === 3) tier3Winners++
        }
      })
    }

    return NextResponse.json({
      success: true,
      winningNumbers,
      pools,
      simulatedWinners: {
        fiveMatch: tier5Winners,
        fourMatch: tier4Winners,
        threeMatch: tier3Winners
      }
    })

  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 })
  }
}
