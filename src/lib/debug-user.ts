'use server'

import { auth } from '@/auth'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { User } from '@/payload-types'

/**
 * Debug function to check user authentication and Payload sync
 */
export async function debugUserSync() {
  try {
    console.log('🔍 Starting user debug...')

    // Check NextAuth session
    const session = await auth()
    console.log('📱 NextAuth Session:', {
      hasSession: !!session,
      user: session?.user,
      email: session?.user?.email,
    })

    if (!session?.user?.email) {
      console.log('❌ No NextAuth session found')
      return { nextAuth: null, payload: null }
    }

    // Check Payload database
    const payload = await getPayload({ config: configPromise })
    console.log('💾 Searching Payload for user:', session.user.email)

    const users = await payload.find({
      collection: 'users',
      where: {
        email: { equals: session.user.email },
      },
    })

    console.log('👥 Payload users found:', {
      count: users.docs.length,
      users: users.docs.map(u => ({ id: u.id, email: u.email, name: u.name, role: u.role }))
    })

    // Also check all users to see what's in there
    const allUsers = await payload.find({
      collection: 'users',
      limit: 10,
    })

    console.log('📊 All Payload users:', {
      total: allUsers.totalDocs,
      users: allUsers.docs.map(u => ({ id: u.id, email: u.email, name: u.name, role: u.role }))
    })

    return {
      nextAuth: session,
      payload: users.docs[0] || null,
      allUsers: allUsers.docs
    }
  } catch (error) {
    console.error('🚨 Debug error:', error)
    return { error: error }
  }
}
