import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { addScore } from '@/lib/scoreManager'

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { score, playedOn } = await req.json()

    if (typeof score !== 'number' || typeof playedOn !== 'string') {
      return new NextResponse('Invalid request data', { status: 400 })
    }

    const newScore = await addScore(user.id, score, playedOn)

    return NextResponse.json({ success: true, newScore })

  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 })
  }
}
