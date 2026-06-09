import { Button } from '@/components/ui/button'
import { Nav } from '@/components/ds'

import Image from 'next/image'
import Link from 'next/link'
import Logo from '@/public/logo.svg'

export const Header = () => {
  return (
    <Nav
      className="border-b sticky top-0 bg-accent/30 backdrop-blur-md"
      containerClassName="flex justify-between items-center gap-4"
    >
      <Link href="/" className="flex gap-3 items-center">
        <Image src={Logo} width={14} alt="" aria-hidden className="invert dark:invert-0" />
        <span className="font-medium sm:text-lg">Payload Starter</span>
      </Link>

      <div className="flex items-center gap-4">
        <Link
          href="/posts"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Posts
        </Link>
        <Button asChild>
          <Link href="/admin">Admin</Link>
        </Button>
      </div>
    </Nav>
  )
}
