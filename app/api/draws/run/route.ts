import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { generateRandomNumbers, generateAlgorithmicNumbers, countMatches } from '@/lib/drawEngine'
import { calculatePrizePools } from '@/lib/prizeCalculator'
import { sendWinnerNotification } from '@/lib/emailService'

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return new NextResponse('Unauthorized', { status: 401 })
    const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') return new NextResponse('Forbidden', { status: 403 })

    const { type, winningNumbers } = await req.json()
    // Admin passes the numbers from simulation to publish exactly what was previewed
    if (!winningNumbers || winningNumbers.length !== 5) {
      return new NextResponse('Invalid winning numbers', { status: 400 })
    }

    const { data: activeUsers } = await supabase.from('users').select('id').eq('subscription_status', 'active')
    const activeSubscribersCount = activeUsers?.length || 0

    const pools = calculatePrizePools(activeSubscribersCount)

    // 1. Create draw record
    const { data: draw, error: drawError } = await supabase.from('draws').insert({
      draw_date: new Date().toISOString(),
      draw_type: type,
      winning_numbers: winningNumbers,
      status: 'published',
      jackpot_amount: pools.fiveMatch
    }).select().single()

    if (drawError) throw drawError

    // 2. Create Prize pool record
    await supabase.from('prize_pools').insert({
      draw_id: draw.id,
      total_pool: pools.total,
      five_match_pool: pools.fiveMatch,
      four_match_pool: pools.fourMatch,
      three_match_pool: pools.threeMatch,
      active_subscribers: activeSubscribersCount
    })

    // 3. Process entries and winners
    if (activeUsers && activeUsers.length > 0) {
      const activeIds = activeUsers.map((u: any) => u.id)
      const { data: scores } = await supabase.from('scores').select('user_id, score').in('user_id', activeIds)
      
      const userScores: Record<string, number[]> = {}
      scores?.forEach(s => {
        if (!userScores[s.user_id]) userScores[s.user_id] = []
        userScores[s.user_id].push(s.score)
      })

      const entriesToInsert: any[] = []
      const winnersToInsert: any[] = []

      // In a real app we would pre-calculate payouts based on exact count of winners
      let tier5Count = 0; let tier4Count = 0; let tier3Count = 0;
      Object.keys(userScores).forEach(uid => {
        const nums = userScores[uid].slice(-5)
        if (nums.length === 5) {
          const matchCount = countMatches(nums, winningNumbers)
          if (matchCount === 5) tier5Count++
          if (matchCount === 4) tier4Count++
          if (matchCount === 3) tier3Count++
        }
      })

      // Calculate splits
      const tier5Prize = tier5Count > 0 ? (pools.fiveMatch / tier5Count) : 0
      const tier4Prize = tier4Count > 0 ? (pools.fourMatch / tier4Count) : 0
      const tier3Prize = tier3Count > 0 ? (pools.threeMatch / tier3Count) : 0

      Object.keys(userScores).forEach(uid => {
        const nums = userScores[uid].slice(-5)
        if (nums.length === 5) {
          const matchCount = countMatches(nums, winningNumbers)
          let prizeTier = null
          let prizeAmount = 0
          
          if (matchCount === 5) { prizeTier = '5-match'; prizeAmount = tier5Prize }
          else if (matchCount === 4) { prizeTier = '4-match'; prizeAmount = tier4Prize }
          else if (matchCount === 3) { prizeTier = '3-match'; prizeAmount = tier3Prize }

          entriesToInsert.push({
            draw_id: draw.id,
            user_id: uid,
            numbers: nums,
            match_count: matchCount,
            prize_tier: prizeTier,
            prize_amount: prizeAmount
          })

          if (prizeTier) {
            winnersToInsert.push({
              draw_id: draw.id,
              user_id: uid,
              prize_tier: prizeTier,
              prize_amount: prizeAmount,
              verification_status: 'pending',
              payment_status: 'pending'
            })
          }
        }
      })

      if (entriesToInsert.length > 0) await supabase.from('draw_entries').insert(entriesToInsert)
      if (winnersToInsert.length > 0) {
        await supabase.from('winners').insert(winnersToInsert)

        // Send winner notification emails (non-blocking)
        for (const winner of winnersToInsert) {
          const { data: winnerUser } = await supabase.from('users').select('email').eq('id', winner.user_id).single()
          if (winnerUser?.email) {
            sendWinnerNotification(winnerUser.email, winner.prize_amount).catch(() => {})
          }
        }
      }
      
      // Update jackpot rolled over flag
      if (tier5Count === 0) {
        await supabase.from('draws').update({ jackpot_rolled_over: true }).eq('id', draw.id)
      }
    }

    return NextResponse.json({ success: true, drawId: draw.id })

  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 })
  }
}
