'use server'

import { auth } from '@/auth'
import type { User } from '@/payload-types'
import { default as config, default as configPromise } from '@payload-config'
import { randomBytes } from 'crypto'
import { cookies, headers as getHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import type { Payload } from 'payload'
import { getPayload } from 'payload'
import {
  passwordChangedEmailTemplate,
  passwordResetEmailTemplate,
  sendEmail,
  verificationEmailTemplate,
} from './email'
import { validateEmail, validatePassword } from './validation'

// Auth Types

type LoginParams = {
  email: string
  password: string
  rememberMe?: boolean
}

type RegisterParams = {
  email: string
  password: string
}

export type LoginResponse = {
  success: boolean
  error?: string
  errorCode?: string
}

export type Result = {
  exp?: number
  token?: string
  user?: User
}

export type RegisterResponse = {
  success: boolean
  error?: string
  errorCode?: string
}

export type ForgotPasswordResponse = {
  success: boolean
  error?: string
  errorCode?: string
}

export type ResetPasswordResponse = {
  success: boolean
  error?: string
  errorCode?: string
}

// Auth Actions

/**
 * Get the currently authenticated user (supports both Payload and OAuth users)
 * @returns The authenticated user or null if not authenticated
 */
export async function getUser(): Promise<User | null> {
  try {
    // First try to get NextAuth session (for OAuth users)
    const session = await auth()
    if (session?.user?.email) {
      const payload: Payload = await getPayload({ config: await configPromise })

      // Find user by email in Payload
      const users = await payload.find({
        collection: 'users',
        where: {
          email: { equals: session.user.email },
        },
      })

      if (users.docs.length > 0) {
        return users.docs[0] as User
      }
    }

    // Fallback to Payload auth (for email/password users)
    const headers = await getHeaders()
    const payload: Payload = await getPayload({ config: await configPromise })
    const { user } = await payload.auth({ headers })
    return user || null
  } catch (error) {
    console.error('Error getting user:', error)
    return null
  }
}

/**
 * Authenticate a user with email and password
 * @param params Login parameters including email, password and optional rememberMe flag
 * @returns Login response with success status and error message if applicable
 */
export async function loginUser({
  email,
  password,
  rememberMe = false,
}: LoginParams): Promise<LoginResponse> {
  // Validate inputs first
  const emailValidation = validateEmail(email)
  if (!emailValidation.valid) {
    return { success: false, error: emailValidation.error, errorCode: 'INVALID_EMAIL' }
  }

  if (!password) {
    return { success: false, error: 'Password is required', errorCode: 'MISSING_PASSWORD' }
  }

  try {
    const payload = await getPayload({ config })

    // Track login attempts (could be extended with rate limiting)
    try {
      const result: Result = await payload.login({
        collection: 'users',
        data: { email, password },
      })

      if (result.token) {
        const cookieStore = await cookies()

        // Calculate expiration date based on rememberMe flag
        const expiresIn = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000 // 30 days or 1 day in milliseconds
        const expiresDate = new Date(Date.now() + expiresIn)

        cookieStore.set('payload-token', result.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/',
          expires: expiresDate,
        })

        return { success: true }
      }

      return {
        success: false,
        error: 'Invalid email or password',
        errorCode: 'INVALID_CREDENTIALS',
      }
    } catch (error) {
      console.error('Login attempt failed:', error)

      // Provide more specific error messages based on error type
      if (error instanceof Error) {
        if (error.message.includes('credentials')) {
          return {
            success: false,
            error: 'The email or password you entered is incorrect',
            errorCode: 'INVALID_CREDENTIALS',
          }
        }
      }

      return {
        success: false,
        error: 'Authentication failed. Please try again later.',
        errorCode: 'AUTH_ERROR',
      }
    }
  } catch (error) {
    console.error('Login system error:', error)
    return {
      success: false,
      error: 'We encountered a system error. Please try again later.',
      errorCode: 'SYSTEM_ERROR',
    }
  }
}

/**
 * Log out the current user by removing their authentication token (Server Action)
 */
export async function logoutUser() {
  try {
    const cookieStore = await cookies()
    // Delete the auth cookie with proper options
    cookieStore.delete('payload-token')

    // Clear any other auth-related cookies if they exist
    cookieStore.delete('user-session')

    redirect('/')
  } catch (error) {
    console.error('Logout error:', error)
    redirect('/')
  }
}

/**
 * Clear authentication cookies without redirect (for client components)
 */
export async function clearAuthCookies(): Promise<{ success: boolean }> {
  try {
    const cookieStore = await cookies()
    // Delete the auth cookie with proper options
    cookieStore.delete('payload-token')

    // Clear any other auth-related cookies if they exist
    cookieStore.delete('user-session')

    return { success: true }
  } catch (error) {
    console.error('Clear cookies error:', error)
    return { success: false }
  }
}

/**
 * Register a new user with email and password
 * @param params Registration parameters including email and password
 * @returns Registration response with success status and error message if applicable
 */
export async function registerUser({ email, password }: RegisterParams): Promise<RegisterResponse> {
  // Validate email
  const emailValidation = validateEmail(email)
  if (!emailValidation.valid) {
    return { success: false, error: emailValidation.error, errorCode: 'INVALID_EMAIL' }
  }

  // Validate password
  const passwordValidation = validatePassword(password)
  if (!passwordValidation.valid) {
    return { success: false, error: passwordValidation.error, errorCode: 'INVALID_PASSWORD' }
  }

  try {
    const payload = await getPayload({ config })

    try {
      // Generate email verification token
      const verificationToken = randomBytes(32).toString('hex')
      const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

      // Create the user with auth data
      await payload.create({
        collection: 'users',
        data: {
          email,
          role: 'user',
          emailVerified: null, // null = not verified, date = verified
          emailVerificationToken: verificationToken,
          emailVerificationExpires: verificationExpires.toISOString(),
          provider: 'credentials',
          password, // Include password in data
        } as any, // Type assertion needed due to payload-authjs plugin transforming the interface
      })

      // Send verification email
      await sendEmail({
        to: email,
        subject: 'Verify your email address',
        html: verificationEmailTemplate(email, verificationToken),
      })

      // Log the user in (they can use the app but with limited access until verified)
      const loginResponse = await loginUser({ email, password })

      if (loginResponse.success) {
        return { success: true }
      }

      return {
        success: false,
        error:
          'Account created but unable to log in automatically. Please try logging in manually.',
        errorCode: 'LOGIN_AFTER_REGISTER_FAILED',
      }
    } catch (error) {
      console.error('Registration attempt failed:', error)

      // Provide specific error messages based on error type
      if (error instanceof Error) {
        if (error.message.includes('duplicate key error')) {
          return {
            success: false,
            error:
              'An account with this email already exists. Please log in or use a different email.',
            errorCode: 'EMAIL_EXISTS',
          }
        }

        if (error.message.includes('validation')) {
          return {
            success: false,
            error: 'Please check your information and try again.',
            errorCode: 'VALIDATION_ERROR',
          }
        }
      }

      return {
        success: false,
        error: "We couldn't create your account. Please try again later.",
        errorCode: 'REGISTRATION_FAILED',
      }
    }
  } catch (error) {
    console.error('Registration system error:', error)
    return {
      success: false,
      error: 'We encountered a system error. Please try again later.',
      errorCode: 'SYSTEM_ERROR',
    }
  }
}

/**
 * Send password reset email
 * @param email Email address to send reset link to
 * @returns Response indicating success or failure
 */
export async function forgotPassword(email: string): Promise<ForgotPasswordResponse> {
  // Validate email
  const emailValidation = validateEmail(email)
  if (!emailValidation.valid) {
    return { success: false, error: emailValidation.error, errorCode: 'INVALID_EMAIL' }
  }

  try {
    const payload = await getPayload({ config: await configPromise })

    // Find user by email
    const users = await payload.find({
      collection: 'users',
      where: {
        email: { equals: email },
      },
    })

    // Always return success to prevent email enumeration attacks
    // Even if user doesn't exist, we say we sent an email
    if (users.docs.length === 0) {
      return { success: true }
    }

    const user = users.docs[0]

    // Generate reset token
    const resetToken = randomBytes(32).toString('hex')
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    // Update user with reset token
    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        passwordResetToken: resetToken,
        passwordResetExpires: resetExpires.toISOString(),
      },
    })

    // Send reset email
    await sendEmail({
      to: email,
      subject: 'Reset your password',
      html: passwordResetEmailTemplate(email, resetToken),
    })

    return { success: true }
  } catch (error) {
    console.error('Forgot password error:', error)
    return {
      success: false,
      error: 'We encountered an error. Please try again later.',
      errorCode: 'SYSTEM_ERROR',
    }
  }
}

/**
 * Reset password using token
 * @param token Reset token from email
 * @param email User's email address
 * @param newPassword New password to set
 * @returns Response indicating success or failure
 */
export async function resetPassword(
  token: string,
  email: string,
  newPassword: string,
): Promise<ResetPasswordResponse> {
  // Validate inputs
  const emailValidation = validateEmail(email)
  if (!emailValidation.valid) {
    return { success: false, error: emailValidation.error, errorCode: 'INVALID_EMAIL' }
  }

  const passwordValidation = validatePassword(newPassword)
  if (!passwordValidation.valid) {
    return { success: false, error: passwordValidation.error, errorCode: 'INVALID_PASSWORD' }
  }

  if (!token) {
    return { success: false, error: 'Invalid reset token', errorCode: 'INVALID_TOKEN' }
  }

  try {
    const payload = await getPayload({ config: await configPromise })

    // Find user with matching email and valid reset token
    const users = await payload.find({
      collection: 'users',
      where: {
        and: [
          { email: { equals: email } },
          { passwordResetToken: { equals: token } },
          { passwordResetExpires: { greater_than: new Date().toISOString() } },
        ],
      },
    })

    if (users.docs.length === 0) {
      return {
        success: false,
        error: 'Invalid or expired reset token',
        errorCode: 'INVALID_OR_EXPIRED_TOKEN',
      }
    }

    const user = users.docs[0]

    // Update password and clear reset token
    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        password: newPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      } as any,
    })

    // Send confirmation email
    await sendEmail({
      to: email,
      subject: 'Your password was changed',
      html: passwordChangedEmailTemplate(),
    })

    return { success: true }
  } catch (error) {
    console.error('Reset password error:', error)
    return {
      success: false,
      error: 'We encountered an error. Please try again later.',
      errorCode: 'SYSTEM_ERROR',
    }
  }
}

/**
 * Resend email verification
 * @param email Email address to resend verification to
 * @returns Response indicating success or failure
 */
export async function resendVerification(
  email: string,
): Promise<{ success: boolean; error?: string }> {
  const emailValidation = validateEmail(email)
  if (!emailValidation.valid) {
    return { success: false, error: emailValidation.error }
  }

  try {
    const payload = await getPayload({ config: await configPromise })

    // Find user by email
    const users = await payload.find({
      collection: 'users',
      where: {
        and: [{ email: { equals: email } }, { emailVerified: { equals: null } }],
      },
    })

    if (users.docs.length === 0) {
      // Don't reveal if email exists or is already verified
      return { success: true }
    }

    const user = users.docs[0]

    // Generate new verification token
    const verificationToken = randomBytes(32).toString('hex')
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Update user with new token
    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpires.toISOString(),
      },
    })

    // Send verification email
    await sendEmail({
      to: email,
      subject: 'Verify your email address',
      html: verificationEmailTemplate(email, verificationToken),
    })

    return { success: true }
  } catch (error) {
    console.error('Resend verification error:', error)
    return { success: false, error: 'Failed to send verification email' }
  }
}
