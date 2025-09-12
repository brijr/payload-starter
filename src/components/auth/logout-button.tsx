'use client'

import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

import { clearAuthCookies } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export const LogoutButton = () => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setIsLoading(true)

    try {
      const result = await clearAuthCookies()

      if (result.success) {
        toast.success('Logged out successfully', {
          description: 'You have been signed out of your account.',
        })
        router.push('/')
        router.refresh() // Refresh to clear any cached user state
      } else {
        toast.error('Logout failed', {
          description: 'Please try again.',
        })
      }
    } catch (_error) {
      toast.error('Logout failed', {
        description: 'Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button variant="outline" onClick={handleLogout} disabled={isLoading}>
      {isLoading ? 'Signing out...' : 'Logout'}
    </Button>
  )
}

export const LogoutIconButton = () => {
  const handleLogout = async () => {
    await clearAuthCookies()
  }

  return (
    <Button variant="outline" size="icon" onClick={handleLogout}>
      <LogOut />
    </Button>
  )
}
