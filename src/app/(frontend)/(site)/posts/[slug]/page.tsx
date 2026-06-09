import config from '@payload-config'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

import type { Metadata } from 'next'

import { Container, PageHeader, Section } from '@/components/ds'
import { RichText } from '@/components/rich-text'
import { StructuredData } from '@/components/structured-data'
import {
  createArticleJsonLd,
  createArticleMetadata,
  createBreadcrumbJsonLd,
  getPostSeo,
} from '@/lib/seo'

type Params = { params: Promise<{ slug: string }> }

const getPost = async (slug: string) => {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'posts',
    where: {
      slug: { equals: slug },
      _status: { equals: 'published' },
    },
    depth: 2,
    limit: 1,
  })
  return docs[0] ?? null
}

const formatDate = (value?: string | null) =>
  value
    ? new Date(value).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}

  const seo = getPostSeo(post)
  const author = post.author && typeof post.author === 'object' ? post.author : null

  return createArticleMetadata({
    title: seo.title,
    description: seo.description,
    path: `/posts/${slug}`,
    image: seo.image,
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    authors: author?.email ? [author.email] : undefined,
  })
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  const hero = post.heroImage && typeof post.heroImage === 'object' ? post.heroImage : null
  const author = post.author && typeof post.author === 'object' ? post.author : null
  const date = formatDate(post.publishedAt)
  const seo = getPostSeo(post)
  const postPath = `/posts/${slug}`

  return (
    <Section>
      <Container className="space-y-8">
        <StructuredData
          data={[
            createArticleJsonLd({
              title: seo.title,
              description: seo.description,
              path: postPath,
              image: seo.image,
              publishedTime: post.publishedAt,
              modifiedTime: post.updatedAt,
              authorName: author?.email,
            }),
            createBreadcrumbJsonLd([
              { name: 'Home', path: '/' },
              { name: 'Posts', path: '/posts' },
              { name: post.title, path: postPath },
            ]),
          ]}
        />

        <Link
          href="/posts"
          className="inline-block text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          ← All posts
        </Link>

        <PageHeader title={post.title} description={post.excerpt ?? undefined}>
          {date || author ? (
            <p className="text-sm text-muted-foreground">
              {author?.email ? <span>{author.email}</span> : null}
              {author?.email && date ? <span aria-hidden="true"> · </span> : null}
              {date ? (
                <time dateTime={post.publishedAt ?? undefined} className="tabular-nums">
                  {date}
                </time>
              ) : null}
            </p>
          ) : null}
        </PageHeader>

        {hero?.url ? (
          <div className="relative aspect-[16/9] overflow-hidden rounded-lg border bg-muted">
            <Image
              src={hero.url}
              alt={hero.alt ?? post.title}
              fill
              priority
              sizes="(min-width: 1024px) 64rem, 100vw"
              className="object-cover"
            />
          </div>
        ) : null}

        <RichText data={post.content} isArticle />
      </Container>
    </Section>
  )
}
