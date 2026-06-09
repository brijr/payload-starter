import Link from 'next/link'

import { Container, PageHeader, Section } from '@/components/ds'
import { Button } from '@/components/ui/button'
import { StructuredData } from '@/components/structured-data'
import { createBreadcrumbJsonLd, createMetadata } from '@/lib/seo'

export const metadata = createMetadata({
  path: '/',
})

export default function Home() {
  return (
    <Section>
      <Container className="space-y-8">
        <StructuredData data={createBreadcrumbJsonLd([{ name: 'Home', path: '/' }])} />

        <PageHeader
          eyebrow="Payload Starter"
          title="A minimal Payload + Next.js starter"
          description="Next.js 16 App Router, Payload CMS, a small design system, and a Posts collection ready for articles — a clean base to build on with agents."
        />

        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/posts">Read posts</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin">Open admin</Link>
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            'Payload admin and API routes stay isolated from the public site.',
            'Posts publish with automatic metadata, canonical URLs, and sitemap entries.',
            'Shared helpers keep search, social previews, and JSON-LD easy to customize.',
          ].map((item) => (
            <p key={item} className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
              {item}
            </p>
          ))}
        </div>

        <div className="grid gap-1 font-mono text-sm text-muted-foreground">
          <a className="transition-colors hover:text-foreground" href="https://payloadcms.com/docs">
            Payload docs &rarr;
          </a>
          <a
            className="transition-colors hover:text-foreground"
            href="https://github.com/brijr/payload-starter"
          >
            View on GitHub &rarr;
          </a>
        </div>
      </Container>
    </Section>
  )
}
