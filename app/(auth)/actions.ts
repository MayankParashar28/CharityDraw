'use server'

import { createServerSupabaseClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import { sendWelcomeEmail } from '@/lib/emailService'

export async function login(prevState: any, formData: FormData) {
  const supabase = await createServerSupabaseClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: error.message }
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const { data: profile } = await supabase.from('users').select('subscription_status').eq('id', user.id).single()
    if (profile?.subscription_status === 'active') {
      redirect('/dashboard')
    } else {
      redirect('/dashboard') // Will be protected by middleware if needed, or point to pricing
    }
  }

  redirect('/dashboard')
}

export async function signup(prevState: any, formData: FormData) {
  const supabase = await createServerSupabaseClient()

  const email = formData.get('email') as string
  const data = {
    email,
    password: formData.get('password') as string,
    options: {
      data: {
        full_name: formData.get('full_name') as string,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    }
  }

  const { error, data: authData } = await supabase.auth.signUp(data)

  if (error) {
    return { error: error.message }
  }

  if (authData.user) {
    await supabase.from('users').insert({
      id: authData.user.id,
      email,
      full_name: data.options.data.full_name,
      subscription_status: 'inactive'
    })

    // Send welcome email (non-blocking)
    sendWelcomeEmail(email, data.options.data.full_name).catch(() => {})
  }

  // If email confirmation is enabled, tell user to check email
  if (authData.user && !authData.session) {
    return { success: true, email }
  }

  // If auto-confirmed (e.g. in dev), redirect to dashboard
  redirect('/dashboard')
}

export async function signout() {
  const supabase = await createServerSupabaseClient()
  await supabase.auth.signOut()
  redirect('/')
}
