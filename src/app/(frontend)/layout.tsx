import '@/globals.css'

import { Geist as FontSans } from 'next/font/google'
import { Geist_Mono as FontMono } from 'next/font/google'
import { ThemeProvider } from '@/components/theme/theme-provider'
import { SessionProvider } from 'next-auth/react'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'

import { cn } from '@/lib/utils'

import type { Metadata } from 'next'

const fontSans = FontSans({
  subsets: ['latin'],
})

const fontMono = FontMono({
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Payload App Starter by Bridger Tower',
  description: 'A modern SaaS starter built with Payload CMS, Next.js, and TypeScript',
  metadataBase: new URL('https://payload-saas-starter.vercel.app/'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://payload-saas-starter.vercel.app/',
    siteName: 'Payload SaaS Starter by Bridger Tower',
    title: 'Payload SaaS Starter by Bridger Tower',
    description: 'A modern SaaS starter built with Payload CMS, Next.js, and TypeScript',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Payload SaaS Starter by Bridger Tower',
    description: 'A modern SaaS starter built with Payload CMS, Next.js, and TypeScript',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fontSans.className} ${fontMono.className} antialiased`}
      suppressHydrationWarning
    >
      <body className={cn('flex flex-col min-h-screen', fontSans.className)}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster richColors expand={true} closeButton />
          </ThemeProvider>
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  )
}
