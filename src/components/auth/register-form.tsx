'use client'

import { SubmitButton } from './submit-button'
import { GoogleOAuthButton } from '@/components/auth/google-oauth-button'
import { toast } from 'sonner'

import { registerUser } from '@/lib/auth'
import { validatePassword, validateEmail } from '@/lib/validation'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

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
    <div className="grid gap-6 my-6">
      <GoogleOAuthButton text="Sign up with Google" />
      
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          placeholder="Email"
          className="w-full focus:outline-none border-b pb-2"
          required
        />

        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          placeholder="Password"
          className="w-full focus:outline-none border-b pb-2"
          required
        />

        {password && (
          <div className="mt-1">
            <div className="flex gap-1 h-1 mt-1">
              <div
                className={`h-full w-1/3 rounded-l ${passwordStrength ? 'bg-red-500' : 'bg-gray-200'}`}
              ></div>
              <div
                className={`h-full w-1/3 ${passwordStrength === 'medium' || passwordStrength === 'strong' ? 'bg-yellow-500' : 'bg-gray-200'}`}
              ></div>
              <div
                className={`h-full w-1/3 rounded-r ${passwordStrength === 'strong' ? 'bg-green-500' : 'bg-gray-200'}`}
              ></div>
            </div>
            {passwordFeedback && <p className="text-xs text-amber-600 mt-1">{passwordFeedback}</p>}
          </div>
        )}

        <div className="text-xs text-muted-foreground mt-2">
          Password must be at least 8 characters with uppercase, lowercase, number, and special
          character.
        </div>

        <SubmitButton loading={isPending} text="Sign Up with Email" />
      </form>
    </div>
  )
}
