import { describe, expect, it } from 'vitest'

import type { Post } from '@/payload-types'

import {
  absoluteUrl,
  createArticleJsonLd,
  createBreadcrumbJsonLd,
  createMetadata,
  getPostSeo,
  normalizeSiteUrl,
} from './seo'

describe('seo helpers', () => {
  it('normalizes APP_URL-style values to an origin', () => {
    expect(normalizeSiteUrl('https://example.com/path?preview=true')).toBe('https://example.com')
    expect(normalizeSiteUrl('http://localhost:3000/')).toBe('http://localhost:3000')
  })

  it('resolves absolute URLs from site paths', () => {
    expect(absoluteUrl('/posts', 'https://example.com')).toBe('https://example.com/posts')
    expect(absoluteUrl('https://cdn.example.com/image.jpg', 'https://example.com')).toBe(
      'https://cdn.example.com/image.jpg',
    )
  })

  it('creates canonical metadata with social defaults', () => {
    const metadata = createMetadata({
      title: 'Posts',
      description: 'Articles and updates.',
      path: '/posts',
      image: '/social.jpg',
    })

    expect(metadata).toMatchObject({
      title: 'Posts',
      description: 'Articles and updates.',
      alternates: {
        canonical: absoluteUrl('/posts'),
      },
      openGraph: {
        type: 'website',
        url: absoluteUrl('/posts'),
        title: 'Posts',
        description: 'Articles and updates.',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Posts',
        description: 'Articles and updates.',
      },
    })
  })

  it('prefers post SEO overrides before content fallbacks', () => {
    const seo = getPostSeo({
      title: 'Post title',
      excerpt: 'Post excerpt',
      meta: {
        title: 'SEO title',
        description: 'SEO description',
        image: {
          id: 1,
          alt: 'SEO image',
          url: '/seo.jpg',
          updatedAt: '2026-01-01T00:00:00.000Z',
          createdAt: '2026-01-01T00:00:00.000Z',
        },
      },
    } as Post)

    expect(seo.title).toBe('SEO title')
    expect(seo.description).toBe('SEO description')
    expect(seo.image).toMatchObject({
      url: '/seo.jpg',
      alt: 'SEO image',
    })
  })

  it('creates article and breadcrumb JSON-LD', () => {
    expect(
      createArticleJsonLd({
        title: 'Post title',
        description: 'Post excerpt',
        path: '/posts/post-title',
        publishedTime: '2026-01-01T00:00:00.000Z',
        authorName: 'author@example.com',
      }),
    ).toMatchObject({
      '@type': 'Article',
      headline: 'Post title',
      mainEntityOfPage: absoluteUrl('/posts/post-title'),
      author: {
        '@type': 'Person',
        name: 'author@example.com',
      },
    })

    expect(
      createBreadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Posts', path: '/posts' },
      ]),
    ).toMatchObject({
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: absoluteUrl('/'),
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Posts',
          item: absoluteUrl('/posts'),
        },
      ],
    })
  })
})
