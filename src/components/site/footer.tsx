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
            <div className="mb-6 flex flex-col gap-4 text-xs text-muted-foreground underline underline-offset-4 md:mb-0 md:flex-row">
              <Link href="/privacy-policy">Privacy Policy</Link>
              <Link href="/terms-of-service">Terms of Service</Link>
              <Link href="/cookie-policy">Cookie Policy</Link>
            </div>
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
