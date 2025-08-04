import { Header } from '@/components/app/header'
import { Footer } from '@/components/app/footer'

import { redirect } from 'next/navigation'
import { getUser } from '@/lib/auth'

import type { User } from '@/payload-types'

export const dynamic = 'force-dynamic'

type AuthLayoutProps = {
  children: React.ReactNode
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  const user: User | null = await getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <main className="flex flex-col min-h-screen">
      <Header user={user} />
      <section className="flex-1">{children}</section>
      <Footer />
    </main>
  )
}
