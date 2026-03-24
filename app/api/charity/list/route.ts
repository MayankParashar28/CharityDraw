import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    const { data: charities } = await supabase.from('charities').select('id, name, description')
    
    let userCharityId = null
    let userPercentage = 10

    if (user) {
      const { data: profile } = await supabase.from('users').select('charity_id, charity_percentage').eq('id', user.id).single()
      if (profile) {
        userCharityId = profile.charity_id
        userPercentage = profile.charity_percentage
      }
    }

    return NextResponse.json({
      charities: charities || [],
      userCharityId,
      userPercentage
    })

  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 })
  }
}
