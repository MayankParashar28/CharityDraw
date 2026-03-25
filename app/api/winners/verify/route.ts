import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { sendWinnerApproved, sendWinnerRejected } from '@/lib/emailService'

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return new NextResponse('Unauthorized', { status: 401 })
    const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') return new NextResponse('Forbidden', { status: 403 })

    const { winnerId, status } = await req.json()
    
    let updatePayload: any = {}
    if (status === 'approved' || status === 'rejected') {
      updatePayload.verification_status = status
      if (status === 'approved') updatePayload.payment_status = 'pending'
    } else if (status === 'paid') {
      updatePayload.payment_status = 'paid'
    }

    const { error } = await supabase.from('winners').update(updatePayload).eq('id', winnerId)
    if (error) throw error

    // Send email notification to the winner
    const { data: winner } = await supabase
      .from('winners')
      .select('user_id, prize_amount')
      .eq('id', winnerId)
      .single()

    if (winner) {
      const { data: winnerUser } = await supabase
        .from('users')
        .select('email')
        .eq('id', winner.user_id)
        .single()

      if (winnerUser?.email) {
        if (status === 'approved') {
          sendWinnerApproved(winnerUser.email, winner.prize_amount).catch(() => {})
        } else if (status === 'rejected') {
          sendWinnerRejected(winnerUser.email).catch(() => {})
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 })
  }
}
