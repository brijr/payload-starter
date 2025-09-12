'use client'

import { SubmitButton } from '@/components/auth/submit-button'
import { GoogleOAuthButton } from '@/components/auth/google-oauth-button'
import Link from 'next/link'
import { toast } from 'sonner'

import { loginUser } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import type { LoginResponse } from '@/lib/auth'

export const LoginForm = () => {
  const [isPending, setIsPending] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsPending(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const res: LoginResponse = await loginUser({ email, password, rememberMe })

    setIsPending(false)

    if (res.error) {
      // Show error toast with specific error message
      switch (res.errorCode) {
        case 'INVALID_EMAIL':
          toast.error('Invalid Email', {
            description: res.error,
          })
          break
        case 'INVALID_CREDENTIALS':
          toast.error('Invalid Credentials', {
            description: 'The email or password you entered is incorrect',
          })
          break
        case 'AUTH_ERROR':
          toast.error('Authentication Failed', {
            description: 'Please try again later',
          })
          break
        default:
          toast.error('Login Failed', {
            description: res.error || 'Something went wrong',
          })
      }
    } else {
      toast.success('Welcome back!', {
        description: 'Redirecting to dashboard...',
      })
      router.push('/dashboard')
    }
  }

  return (
    <div className="grid gap-6 my-6">
      <GoogleOAuthButton text="Sign in with Google" />
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <form className="grid gap-6" onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          autoComplete="email"
          className="w-full focus:outline-none border-b pb-2 h-8"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          autoComplete="current-password"
          className="w-full focus:outline-none border-b pb-2 h-8"
          required
        />
        <div className="text-xs text-muted-foreground">
          <Link href="/forgot-password" className="hover:underline">
            Forgot password?
          </Link>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="remember-me"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label htmlFor="remember-me" className="text-sm text-muted-foreground cursor-pointer">
            Remember me for 30 days
          </label>
        </div>

        <SubmitButton loading={isPending} text="Login with Email" />
      </form>
    </div>
  )
}
