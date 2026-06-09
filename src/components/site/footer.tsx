import { Section, Container } from '@/components/ds'
import { ThemeToggle } from '@/components/theme/theme-toggle'

import Balancer from 'react-wrap-balancer'
import Link from 'next/link'

export const Footer = () => {
  return (
    <footer className="border-t bg-accent/30 text-sm">
      <Section>
        <Container className="grid gap-6 grid-cols-[1fr_auto]">
          <div className="grid gap-6">
            <p className="text-muted-foreground">
              <Balancer>
                Payload Starter is an Open Source starter for creating applications with
                Next.js and Payload.
              </Balancer>
            </p>
            <nav
              aria-label="Footer"
              className="mb-6 flex flex-col gap-4 text-xs text-muted-foreground underline underline-offset-4 md:mb-0 md:flex-row"
            >
              <Link href="/">Home</Link>
              <Link href="/posts">Posts</Link>
              <Link href="/admin">Admin</Link>
              <a href="https://payloadcms.com/docs">Payload Docs</a>
              <a href="https://github.com/brijr/payload-starter">GitHub</a>
            </nav>
            <p className="text-muted-foreground text-xs">
              © <a href="https://github.com/brijr">brijr</a>. All rights reserved. 2025-present.
            </p>
          </div>
          <ThemeToggle />
        </Container>
      </Section>
    </footer>
  )
}
