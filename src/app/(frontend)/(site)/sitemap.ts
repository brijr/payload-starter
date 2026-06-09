import config from '@payload-config'
import { getPayload } from 'payload'

import type { MetadataRoute } from 'next'

import { absoluteUrl } from '@/lib/seo'

export const dynamic = 'force-dynamic'

const staticRoutes: MetadataRoute.Sitemap = [
  {
    url: absoluteUrl('/'),
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1,
  },
  {
    url: absoluteUrl('/posts'),
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  },
]

const getPublishedPostRoutes = async (): Promise<MetadataRoute.Sitemap> => {
  if (!process.env.DATABASE_URI) return []

  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'posts',
    where: {
      _status: { equals: 'published' },
      slug: { exists: true },
    },
    sort: '-publishedAt',
    limit: 1000,
  })

  return docs
    .filter((post) => post.slug)
    .map((post) => ({
      url: absoluteUrl(`/posts/${post.slug}`),
      lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }))
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [...staticRoutes, ...(await getPublishedPostRoutes())]
}
