'use client'

import { Field, FieldGroup, FieldLabel, FieldDescription, FieldError } from '@/components/ui/field'
import { SubmitButton } from './submit-button'
import { Input } from '@/components/ui/input'

import { registerUser } from '@/lib/auth'
import { validatePassword, validateEmail } from '@/lib/validation'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'

import type { RegisterResponse } from '@/lib/auth'

export const RegisterForm = () => {
  const [isPending, setIsPending] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordFeedback, setPasswordFeedback] = useState<string | null>(null)
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | null>(
    null,
  )
  const router = useRouter()

  // Validate password as user types
  useEffect(() => {
    if (!password) {
      setPasswordFeedback(null)
      setPasswordStrength(null)
      return
    }

    const validation = validatePassword(password)

    if (!validation.valid) {
      setPasswordFeedback(validation.error || null)
      // Determine password strength
      if (password.length < 8) {
        setPasswordStrength('weak')
      } else if (
        password.length >= 8 &&
        (/[A-Z]/.test(password) || /[a-z]/.test(password)) &&
        /[0-9]/.test(password)
      ) {
        setPasswordStrength('medium')
      }
    } else {
      setPasswordFeedback(null)
      setPasswordStrength('strong')
    }
  }, [password])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsPending(true)

    // Client-side validation first
    const emailValidation = validateEmail(email)
    if (!emailValidation.valid) {
      toast.error('Invalid Email', {
        description: emailValidation.error || 'Please enter a valid email',
      })
      setIsPending(false)
      return
    }

    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      toast.error('Invalid Password', {
        description: passwordValidation.error || 'Please enter a valid password',
      })
      setIsPending(false)
      return
    }

    const res: RegisterResponse = await registerUser({ email, password })

    setIsPending(false)

    if (res.error) {
      // Show error toast with specific error message
      switch (res.errorCode) {
        case 'EMAIL_EXISTS':
          toast.error('Email Already Exists', {
            description:
              'An account with this email already exists. Please log in or use a different email.',
          })
          break
        case 'VALIDATION_ERROR':
          toast.error('Validation Error', {
            description: res.error,
          })
          break
        case 'REGISTRATION_FAILED':
          toast.error('Registration Failed', {
            description: "We couldn't create your account. Please try again.",
          })
          break
        default:
          toast.error('Registration Failed', {
            description: res.error || 'Something went wrong',
          })
      }
    } else {
      toast.success('Account Created!', {
        description: 'Check your email to verify your account. Redirecting to dashboard...',
      })
      router.push('/dashboard')
    }
  }

  return (
    <form className="my-6" onSubmit={handleSubmit}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="email@example.com"
            required
          />
        </Field>

        <Field data-invalid={!!passwordFeedback}>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            placeholder="Enter a strong password"
            aria-invalid={!!passwordFeedback}
            required
          />
          {password && (
            <>
              <div className="flex gap-1 h-1 mt-2">
                <div
                  className={`h-full w-1/3 rounded-l transition-colors ${passwordStrength ? 'bg-red-500' : 'bg-gray-200'}`}
                ></div>
                <div
                  className={`h-full w-1/3 transition-colors ${passwordStrength === 'medium' || passwordStrength === 'strong' ? 'bg-yellow-500' : 'bg-gray-200'}`}
                ></div>
                <div
                  className={`h-full w-1/3 rounded-r transition-colors ${passwordStrength === 'strong' ? 'bg-green-500' : 'bg-gray-200'}`}
                ></div>
              </div>
              {passwordFeedback && <FieldError>{passwordFeedback}</FieldError>}
            </>
          )}
          <FieldDescription>
            Password must be at least 8 characters with uppercase, lowercase, number, and special
            character.
          </FieldDescription>
        </Field>

        <SubmitButton loading={isPending} text="Sign Up" />
      </FieldGroup>
    </form>
  )
}
