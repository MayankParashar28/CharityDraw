import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AntdRegistry } from '@ant-design/nextjs-registry'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'CharityDraw — Win Big, Support Charities',
    template: '%s | CharityDraw',
  },
  description: 'A subscription-based golf lottery that lets you win massive cash prizes while funding world-class charities. Enter your Stableford scores, match the draw, and change lives.',
  keywords: ['charity', 'lottery', 'golf', 'charity draw', 'win prizes', 'support charities', 'stableford', 'subscription'],
  authors: [{ name: 'CharityDraw' }],
  openGraph: {
    title: 'CharityDraw — Win Big, Support Charities',
    description: 'Enter your golf scores, win massive cash prizes, and fund world-class charities with every subscription.',
    url: 'https://charitydraw.com',
    siteName: 'CharityDraw',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CharityDraw — Win Big, Support Charities',
    description: 'Enter your golf scores, win massive cash prizes, and fund world-class charities.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-white text-gray-900 antialiased`}>
        <AntdRegistry>
          {children}
        </AntdRegistry>
      </body>
    </html>
  )
}
