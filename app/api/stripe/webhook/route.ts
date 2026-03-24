import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createServerSupabaseClient } from '@/lib/supabase'
import Stripe from 'stripe'

export async function POST(req: Request) {
  const body = await req.text()
  const headerList = await headers()
  const signature = headerList.get('Stripe-Signature') as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }

  const supabase = await createServerSupabaseClient()

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const userId = session.metadata?.userId

    if (userId && session.subscription) {
      const subscription: any = await stripe.subscriptions.retrieve(session.subscription as string)
      
      const { data: userProfile } = await supabase.from('users').select('charity_percentage').eq('id', userId).single()
      const charityPercentage = userProfile?.charity_percentage || 10
      const planAmount = subscription.items.data[0].plan.amount || 0
      const charityContribution = (planAmount / 100) * (charityPercentage / 100)

      await supabase.from('users').update({
        subscription_status: 'active',
        subscription_id: subscription.id,
        subscription_plan: subscription.items.data[0].plan.interval === 'year' ? 'yearly' : 'monthly'
      }).eq('id', userId)

      await supabase.from('subscriptions').insert({
        user_id: userId,
        stripe_subscription_id: subscription.id,
        plan: subscription.items.data[0].plan.interval === 'year' ? 'yearly' : 'monthly',
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        charity_contribution: charityContribution
      })
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription
    await supabase.from('users').update({
      subscription_status: 'cancelled'
    }).eq('subscription_id', subscription.id)
  }

  if (event.type === 'invoice.payment_failed') {
    const invoice: any = event.data.object
    if (invoice.subscription) {
      await supabase.from('users').update({
        subscription_status: 'lapsed'
      }).eq('subscription_id', invoice.subscription)
    }
  }

  if (event.type === 'invoice.payment_succeeded') {
    const invoice: any = event.data.object
    if (invoice.subscription) {
      await supabase.from('users').update({
        subscription_status: 'active'
      }).eq('subscription_id', invoice.subscription)
      
      const subscription: any = await stripe.subscriptions.retrieve(invoice.subscription as string)
      
      const { data: subData } = await supabase.from('subscriptions').select('user_id').eq('stripe_subscription_id', subscription.id).single()
      const { data: userProfile } = await supabase.from('users').select('charity_percentage').eq('id', subData?.user_id).single()
      const charityPercentage = userProfile?.charity_percentage || 10
      const planAmount = subscription.items.data[0].plan.amount || 0
      const charityContribution = (planAmount / 100) * (charityPercentage / 100)
      
      await supabase.from('subscriptions').update({
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        charity_contribution: charityContribution
      }).eq('stripe_subscription_id', subscription.id)
    }
  }

  return new NextResponse('OK', { status: 200 })
}
