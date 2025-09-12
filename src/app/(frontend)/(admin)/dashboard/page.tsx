import { Section, Container } from '@/components/ds'

import { redirect } from 'next/navigation'
import { getUser } from '@/lib/auth'

import type { User } from '@/payload-types'

export const dynamic = 'force-dynamic'

export default async function Dashboard() {
  const user: User | null = await getUser()

  if (!user) {
    redirect('/login')
  }

  return <ToDelete user={user} />
}

const ToDelete = ({ user }: { user: User }) => {
  const createdAt = user.createdAt ? new Date(user.createdAt) : new Date()
  const now = new Date()
  const accountAgeDays = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24))
  return (
    <Section>
      <Container className="font-mono space-y-2">
        <h1 className="mb-4">Payload Starter Dashboard</h1>
        <p>
          &gt; You&apos;re email is <span className="text-primary">{user.email}</span>
        </p>
        <p>
          &gt; Your created your account at{' '}
          <span className="text-primary">{createdAt.toLocaleString()}</span>
        </p>
        <p>
          &gt; Your account is <span className="text-primary">{accountAgeDays}</span> days old
        </p>
        <p>
          &gt; You have the role of <span className="text-primary">{user.role}</span>
        </p>
      </Container>
    </Section>
  )
}
