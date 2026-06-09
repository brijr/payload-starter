import type { CollectionConfig } from 'payload'
import { lexicalEditor, HeadingFeature } from '@payloadcms/richtext-lexical'

import { formatSlugHook } from '@/lib/format-slug'

/**
 * Posts — the base content collection for articles / blog posts.
 *
 * Draft/publish is handled by Payload versions. Public (unauthenticated) reads
 * only ever see published documents; logged-in users see everything, which lets
 * the admin panel and draft preview work without extra wiring.
 */
export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: {
    singular: 'Post',
    plural: 'Posts',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'publishedAt', 'updatedAt'],
    description: 'Articles and blog posts rendered on the public site.',
  },
  access: {
    // Anonymous visitors only see published posts; authenticated users see all.
    read: ({ req: { user } }) => {
      if (user) return true
      return { _status: { equals: 'published' } }
    },
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  versions: {
    drafts: { autosave: false },
    maxPerDoc: 25,
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Stamp a publish date the first time a post goes live.
        if (data?._status === 'published' && !data.publishedAt) {
          return { ...data, publishedAt: new Date().toISOString() }
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'excerpt',
      type: 'textarea',
      admin: {
        description: 'Short summary shown in listings, previews, and meta tags.',
      },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional lead image displayed at the top of the article.',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          // Reserve h1 for the page title; article bodies start at h2.
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
        ],
      }),
    },
    // --- Sidebar metadata ---
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Auto-generated from the title. Edit to customize the URL.',
      },
      hooks: {
        beforeValidate: [formatSlugHook('title')],
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
        description: 'Set automatically on first publish; override as needed.',
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      admin: { position: 'sidebar' },
      defaultValue: ({ user }) => user?.id,
    },
  ],
}
