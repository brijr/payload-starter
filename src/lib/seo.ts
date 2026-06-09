import type { Metadata } from 'next'
import type { Media, Post } from '@/payload-types'

const DEFAULT_APP_URL = 'http://localhost:3000'
const DEFAULT_OG_IMAGE = '/opengraph-image.jpg'
const DEFAULT_TWITTER_IMAGE = '/twitter-image.jpg'

type SeoImage = Pick<Media, 'url' | 'alt' | 'width' | 'height'> | string | null | undefined

type CreateMetadataArgs = {
  title?: string
  description?: string | null
  path?: string
  image?: SeoImage
  noIndex?: boolean
}

type CreateArticleMetadataArgs = CreateMetadataArgs & {
  publishedTime?: string | null
  modifiedTime?: string | null
  authors?: string[]
}

type JsonLdValue =
  | string
  | number
  | boolean
  | null
  | JsonLdValue[]
  | {
      [key: string]: JsonLdValue | undefined
    }

export type JsonLdObject = {
  [key: string]: JsonLdValue | undefined
}

export const normalizeSiteUrl = (value = process.env.APP_URL): string => {
  const candidate = value?.trim() || DEFAULT_APP_URL
  const url = new URL(candidate)
  return url.origin
}

export const siteConfig = {
  name: 'Payload Starter',
  title: 'Payload App Starter',
  description:
    'A modern, open-source starter kit built with Next.js, Payload CMS, PostgreSQL, and a clean content foundation.',
  url: normalizeSiteUrl(),
  locale: 'en_US',
  creator: 'Bridger Tower',
  ogImage: DEFAULT_OG_IMAGE,
  twitterImage: DEFAULT_TWITTER_IMAGE,
}

export const absoluteUrl = (path = '/', base = siteConfig.url): string => {
  return new URL(path, `${normalizeSiteUrl(base)}/`).toString()
}

const getImageDetails = (image: SeoImage, fallbackAlt: string) => {
  if (typeof image === 'string') {
    return {
      url: absoluteUrl(image),
      alt: fallbackAlt,
    }
  }

  if (image?.url) {
    return {
      url: absoluteUrl(image.url),
      alt: image.alt || fallbackAlt,
      width: image.width ?? undefined,
      height: image.height ?? undefined,
    }
  }

  return {
    url: absoluteUrl(DEFAULT_OG_IMAGE),
    alt: fallbackAlt,
  }
}

const getTwitterImageUrl = (image: SeoImage) => {
  if (typeof image === 'string') return absoluteUrl(image)
  if (image?.url) return absoluteUrl(image.url)
  return absoluteUrl(DEFAULT_TWITTER_IMAGE)
}

const createRobots = (noIndex?: boolean): Metadata['robots'] =>
  noIndex
    ? {
        index: false,
        follow: false,
      }
    : {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      }

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  alternates: {
    canonical: absoluteUrl('/'),
  },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: absoluteUrl('/'),
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [getImageDetails(DEFAULT_OG_IMAGE, siteConfig.title)],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [absoluteUrl(DEFAULT_TWITTER_IMAGE)],
  },
  robots: createRobots(false),
}

export const createMetadata = ({
  title = siteConfig.title,
  description = siteConfig.description,
  path = '/',
  image,
  noIndex,
}: CreateMetadataArgs = {}): Metadata => {
  const resolvedDescription = description || siteConfig.description
  const canonical = absoluteUrl(path)
  const imageDetails = getImageDetails(image ?? DEFAULT_OG_IMAGE, title)

  return {
    title,
    description: resolvedDescription,
    alternates: {
      canonical,
    },
    openGraph: {
      type: 'website',
      locale: siteConfig.locale,
      url: canonical,
      siteName: siteConfig.name,
      title,
      description: resolvedDescription,
      images: [imageDetails],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: resolvedDescription,
      images: [getTwitterImageUrl(image)],
    },
    robots: createRobots(noIndex),
  }
}

export const createArticleMetadata = ({
  title = siteConfig.title,
  description = siteConfig.description,
  path = '/',
  image,
  noIndex,
  publishedTime,
  modifiedTime,
  authors,
}: CreateArticleMetadataArgs): Metadata => {
  const resolvedDescription = description || siteConfig.description
  const canonical = absoluteUrl(path)
  const imageDetails = getImageDetails(image ?? DEFAULT_OG_IMAGE, title)

  return {
    title,
    description: resolvedDescription,
    alternates: {
      canonical,
    },
    openGraph: {
      type: 'article',
      locale: siteConfig.locale,
      url: canonical,
      siteName: siteConfig.name,
      title,
      description: resolvedDescription,
      publishedTime: publishedTime ?? undefined,
      modifiedTime: modifiedTime ?? undefined,
      authors,
      images: [imageDetails],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: resolvedDescription,
      images: [getTwitterImageUrl(image)],
    },
    robots: createRobots(noIndex),
  }
}

export const getPostSeo = (post: Post) => {
  const metaImage = post.meta?.image && typeof post.meta.image === 'object' ? post.meta.image : null
  const heroImage = post.heroImage && typeof post.heroImage === 'object' ? post.heroImage : null

  return {
    title: post.meta?.title || post.title,
    description: post.meta?.description || post.excerpt || siteConfig.description,
    image: metaImage || heroImage || DEFAULT_OG_IMAGE,
  }
}

export const createWebsiteJsonLd = (): JsonLdObject => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteConfig.name,
  url: absoluteUrl('/'),
  description: siteConfig.description,
  publisher: {
    '@type': 'Organization',
    name: siteConfig.name,
    url: absoluteUrl('/'),
  },
})

export const createOrganizationJsonLd = (): JsonLdObject => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteConfig.name,
  url: absoluteUrl('/'),
  image: absoluteUrl(siteConfig.ogImage),
  founder: {
    '@type': 'Person',
    name: siteConfig.creator,
  },
})

export const createArticleJsonLd = ({
  title,
  description,
  path,
  image,
  publishedTime,
  modifiedTime,
  authorName,
}: {
  title: string
  description?: string | null
  path: string
  image?: SeoImage
  publishedTime?: string | null
  modifiedTime?: string | null
  authorName?: string | null
}): JsonLdObject => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: title,
  description: description || siteConfig.description,
  image: [getImageDetails(image ?? DEFAULT_OG_IMAGE, title).url],
  datePublished: publishedTime || undefined,
  dateModified: modifiedTime || publishedTime || undefined,
  mainEntityOfPage: absoluteUrl(path),
  author: {
    '@type': authorName ? 'Person' : 'Organization',
    name: authorName || siteConfig.name,
  },
  publisher: {
    '@type': 'Organization',
    name: siteConfig.name,
    url: absoluteUrl('/'),
  },
})

export const createBreadcrumbJsonLd = (
  items: {
    name: string
    path: string
  }[],
): JsonLdObject => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
})
