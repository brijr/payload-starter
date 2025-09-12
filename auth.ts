import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { withPayload } from 'payload-authjs'
import { authConfig } from './auth.config'
import configPromise from '@payload-config'

const config = {
  ...authConfig,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  session: {
    strategy: 'jwt' as const,
  },
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account, profile }: any) {
      if (account?.provider === 'google') {
        // Ensure profile has required data
        return !!(profile?.email && profile?.email_verified)
      }
      return true
    },
    async jwt({ token, user, account, profile }: any) {
      // Persist additional user info in token
      if (user) {
        token.role = user?.role || 'user'
      }
      
      // Store OAuth provider info
      if (account) {
        token.provider = account.provider
        token.providerId = account.providerAccountId
      }
      
      return token
    },
    async session({ session, token }: any) {
      // Send properties to the client
      if (session.user) {
        session.user.role = token.role
        session.user.provider = token.provider
        session.user.providerId = token.providerId
      }
      return session
    },
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(
  withPayload(config, {
    payloadConfig: configPromise,
  })
)