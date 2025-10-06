'use client'

import { useState } from 'react'
import Link from 'next/link'
import { forgotPassword } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Field, FieldGroup, FieldLabel, FieldDescription } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await forgotPassword(email)

      if (result.success) {
        setIsSuccess(true)
        toast.success('Email Sent!', {
          description:
            "If an account with that email exists, we've sent you a password reset link.",
        })
      } else {
        switch (result.errorCode) {
          case 'INVALID_EMAIL':
            toast.error('Invalid Email', {
              description: result.error || 'Please enter a valid email address',
            })
            break
          default:
            toast.error('Request Failed', {
              description: result.error || 'Something went wrong. Please try again.',
            })
        }
      }
    } catch (_error) {
      toast.error('Request Failed', {
        description: 'Something went wrong. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="space-y-4 text-center my-6">
        <p className="text-muted-foreground">Check your email for the password reset link.</p>
        <Link href="/login" className="text-foreground hover:underline">
          Return to login
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="my-6">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <FieldDescription>
            Enter your email address and we&apos;ll send you a password reset link.
          </FieldDescription>
        </Field>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </Button>
      </FieldGroup>
    </form>
  )
}
