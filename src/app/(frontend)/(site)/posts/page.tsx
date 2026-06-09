import config from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'

import type { Metadata } from 'next'

import { Container, PageHeader, Section } from '@/components/ds'
import { PostCard } from '@/components/site/post-card'

export const metadata: Metadata = {
  title: 'Posts',
  description: 'Articles, notes, and updates.',
}

export default async function PostsPage() {
  const payload = await getPayload({ config })

  // The local API bypasses access control by default, so filter to published
  // explicitly to match what the public should see.
  const { docs: posts } = await payload.find({
    collection: 'posts',
    where: { _status: { equals: 'published' } },
    sort: '-publishedAt',
    depth: 1,
    limit: 50,
  })

  return (
    <Section>
      <Container className="space-y-10">
        <PageHeader eyebrow="Writing" title="Posts" description="Articles, notes, and updates." />

        {posts.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No posts published yet. Create one in the{' '}
            <Link href="/admin" className="text-primary underline underline-offset-4">
              admin
            </Link>
            .
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </Container>
    </Section>
  )
}
