import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return new NextResponse('Unauthorized', { status: 401 })

    const { charityId, percentage } = await req.json()
    if (percentage < 10 || percentage > 50) return new NextResponse('Invalid percentage', { status: 400 })

    await supabase.from('users').update({
      charity_id: charityId,
      charity_percentage: percentage
    }).eq('id', user.id)

    return NextResponse.json({ success: true })

  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 })
  }
}
