import type { CollectionConfig } from 'payload'
import type { User } from '@/payload-types'
import type { PayloadRequest } from 'payload'

const isAdmin = ({ req }: { req: PayloadRequest }): boolean => {
  const user = req.user as User | null
  return user?.role === 'admin'
}

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    admin: isAdmin,
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
      ],
      required: true,
      defaultValue: 'user',
    },
    {
      name: 'emailVerified',
      type: 'date',
      admin: {
        description: 'Date when the user verified their email address (null if not verified)',
      },
    },
    {
      name: 'emailVerificationToken',
      type: 'text',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'emailVerificationExpires',
      type: 'date',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'passwordResetToken',
      type: 'text',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'passwordResetExpires',
      type: 'date',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'provider',
      type: 'select',
      options: [
        { label: 'Email', value: 'credentials' },
        { label: 'Google', value: 'google' },
      ],
      defaultValue: 'credentials',
      admin: {
        description: 'Authentication provider used to create this account',
      },
    },
    {
      name: 'providerId',
      type: 'text',
      admin: {
        description: 'Provider-specific user ID',
        hidden: true,
      },
    },
    {
      name: 'image',
      type: 'text',
      admin: {
        description: 'Profile image URL from OAuth provider',
      },
    },
    // If you want to add a username field, uncomment the following lines
    // {
    //   name: 'username',
    //   type: 'text',
    //   required: true,
    //   unique: true,
    // },
  ],
}
