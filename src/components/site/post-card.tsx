import Image from 'next/image'
import Link from 'next/link'

import type { Post } from '@/payload-types'
import { cn } from '@/lib/utils'

const formatDate = (value?: string | null) =>
  value
    ? new Date(value).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

/**
 * PostCard — a compact, linkable preview of a Post for use in listings/grids.
 */
export const PostCard = ({ post, className }: { post: Post; className?: string }) => {
  if (!post.slug) return null

  const hero = post.heroImage && typeof post.heroImage === 'object' ? post.heroImage : null
  const date = formatDate(post.publishedAt)

  return (
    <Link
      href={`/posts/${post.slug}`}
      className={cn(
        'group flex flex-col gap-4 rounded-lg border bg-card p-4 transition-colors hover:bg-accent/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
        className,
      )}
    >
      {hero?.url ? (
        <div className="relative aspect-[16/9] overflow-hidden rounded-md border bg-muted">
          <Image
            src={hero.url}
            alt={hero.alt ?? post.title}
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </div>
      ) : null}

      <div className="space-y-1.5">
        <h2 className="text-lg font-medium tracking-tight text-balance">{post.title}</h2>
        {post.excerpt ? (
          <p className="line-clamp-2 text-sm text-muted-foreground text-pretty">{post.excerpt}</p>
        ) : null}
        {date ? (
          <time
            dateTime={post.publishedAt ?? undefined}
            className="block text-xs text-muted-foreground tabular-nums"
          >
            {date}
          </time>
        ) : null}
      </div>
    </Link>
  )
}
