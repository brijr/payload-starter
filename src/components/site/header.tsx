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
        <Image src={Logo} width={14} alt="Payload Starter" className="invert dark:invert-0" />
        <h3 className="sm:text-lg">Payload Starter</h3>
      </Link>

      <Button asChild>
        <Link href="/admin">Admin</Link>
      </Button>
    </Nav>
  )
}
