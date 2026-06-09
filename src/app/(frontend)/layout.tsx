import '@/globals.css'

import { Geist as FontSans } from 'next/font/google'
import { Geist_Mono as FontMono } from 'next/font/google'
import { ThemeProvider } from '@/components/theme/theme-provider'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'

import { StructuredData } from '@/components/structured-data'
import { cn } from '@/lib/utils'
import { createOrganizationJsonLd, createWebsiteJsonLd, defaultMetadata } from '@/lib/seo'

const fontSans = FontSans({
  subsets: ['latin'],
})

const fontMono = FontMono({
  subsets: ['latin'],
})

export const metadata = defaultMetadata

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fontSans.className} ${fontMono.className} antialiased`}
      suppressHydrationWarning
    >
      <body className={cn('flex flex-col min-h-screen', fontSans.className)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <StructuredData data={[createWebsiteJsonLd(), createOrganizationJsonLd()]} />
          {children}
          <Toaster richColors expand={true} closeButton />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
