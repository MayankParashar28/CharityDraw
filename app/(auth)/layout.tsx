import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Account',
  description: 'Sign in, create an account, or reset your password for CharityDraw.',
  robots: { index: false, follow: false },
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
