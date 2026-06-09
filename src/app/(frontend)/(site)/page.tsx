import Link from 'next/link'

import { Container, PageHeader, Section } from '@/components/ds'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <Section>
      <Container className="space-y-8">
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
