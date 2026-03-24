import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return new NextResponse('Unauthorized', { status: 401 })
    const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') return new NextResponse('Forbidden', { status: 403 })

    const { data: winners } = await supabase
      .from('winners')
      .select('*, users(full_name)')
      .order('created_at', { ascending: false })

    return NextResponse.json({ winners: winners || [] })
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 })
  }
}
