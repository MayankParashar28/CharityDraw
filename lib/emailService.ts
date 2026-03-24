import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY || 're_mock')
const sender = 'CharityDraw <noreply@charitydraw.com>'

export async function sendWelcomeEmail(email: string, name: string) {
  if (!process.env.RESEND_API_KEY) return
  return resend.emails.send({
    from: sender,
    to: email,
    subject: 'Welcome to CharityDraw!',
    html: `<h1>Welcome ${name}</h1><p>Thanks for joining CharityDraw. Start entering your golf scores to win big and help charities.</p>`
  })
}

export async function sendSubscriptionConfirmed(email: string, plan: string) {
  if (!process.env.RESEND_API_KEY) return
  return resend.emails.send({
    from: sender,
    to: email,
    subject: 'Subscription Confirmed',
    html: `<p>Your ${plan} subscription is active. Good luck in the draws!</p>`
  })
}

export async function sendSubscriptionLapsed(email: string) {
  if (!process.env.RESEND_API_KEY) return
  return resend.emails.send({
    from: sender,
    to: email,
    subject: 'Action Required: Subscription Lapsed',
    html: `<p>Your payment failed. Please update your billing details to keep participating in weekly draws.</p>`
  })
}

export async function sendWinnerNotification(email: string, amount: number) {
  if (!process.env.RESEND_API_KEY) return
  return resend.emails.send({
    from: sender,
    to: email,
    subject: '🎉 YOU WON!',
    html: `<h1>Congratulations!</h1><p>You won $${amount.toFixed(2)} in the recent draw. Please log in to your dashboard to upload your golf score proof to claim your prize.</p>`
  })
}

export async function sendWinnerApproved(email: string, amount: number) {
  if (!process.env.RESEND_API_KEY) return
  return resend.emails.send({
    from: sender,
    to: email,
    subject: 'Proof Approved - Payment Incoming',
    html: `<p>Your proof for $${amount.toFixed(2)} was approved! We are processing your payment now.</p>`
  })
}

export async function sendWinnerRejected(email: string, reason: string = 'Invalid proof') {
  if (!process.env.RESEND_API_KEY) return
  return resend.emails.send({
    from: sender,
    to: email,
    subject: 'Prize Claim Update',
    html: `<p>Unfortunately, your prize claim was rejected. Reason: ${reason}. Please contact support if you believe this is an error.</p>`
  })
}
