import config from '@payload-config'
import { getPayload } from 'payload'

import type { Post } from '@/payload-types'

/**
 * Seed a couple of published posts so the frontend has content to render.
 * Run with: pnpm payload run scripts/seed.ts
 *
 * Idempotent — posts are matched by title and skipped if they already exist.
 */

type LexicalNode = Record<string, unknown>

const text = (value: string): LexicalNode => ({
  type: 'text',
  text: value,
  format: 0,
  style: '',
  mode: 'normal',
  detail: 0,
  version: 1,
})

const paragraph = (value: string): LexicalNode => ({
  type: 'paragraph',
  version: 1,
  format: '',
  indent: 0,
  direction: 'ltr',
  textFormat: 0,
  textStyle: '',
  children: [text(value)],
})

const heading = (tag: 'h2' | 'h3' | 'h4', value: string): LexicalNode => ({
  type: 'heading',
  tag,
  version: 1,
  format: '',
  indent: 0,
  direction: 'ltr',
  children: [text(value)],
})

const bulletList = (items: string[]): LexicalNode => ({
  type: 'list',
  listType: 'bullet',
  tag: 'ul',
  start: 1,
  version: 1,
  format: '',
  indent: 0,
  direction: 'ltr',
  children: items.map((item, i) => ({
    type: 'listitem',
    value: i + 1,
    checked: false,
    version: 1,
    format: '',
    indent: 0,
    direction: 'ltr',
    children: [text(item)],
  })),
})

const quote = (value: string): LexicalNode => ({
  type: 'quote',
  version: 1,
  format: '',
  indent: 0,
  direction: 'ltr',
  children: [text(value)],
})

const doc = (...children: LexicalNode[]): Post['content'] =>
  ({
    root: {
      type: 'root',
      version: 1,
      format: '',
      indent: 0,
      direction: 'ltr',
      children,
    },
  }) as unknown as Post['content']

const posts: Array<{ title: string; excerpt: string; content: Post['content'] }> = [
  {
    title: 'Designing with restraint',
    excerpt:
      'A minimal, neutral foundation you can extend — typography, spacing, and tokens that get out of your way.',
    content: doc(
      paragraph(
        'This starter ships a deliberately small design system: a handful of layout primitives and one typography component. The goal is a clean base you can grow, not a kit you have to fight.',
      ),
      heading('h2', 'Layout primitives'),
      paragraph(
        'Section, Container, Nav, and Main handle page structure. Prose handles long-form typography for any rich text you render.',
      ),
      bulletList([
        'Section — consistent vertical rhythm',
        'Container — centered, max-width content',
        'Prose — headings, lists, quotes, and code, styled once',
      ]),
      heading('h2', 'Tokens'),
      paragraph(
        'Colors live as oklch CSS variables in globals.css and map onto Tailwind. Edit them in one place to rebrand the whole system, light and dark.',
      ),
      quote('Good defaults are invisible. You notice them only when they are missing.'),
    ),
  },
  {
    title: 'Writing your first article',
    excerpt:
      'How posts flow from the Payload admin to a typeset article page, rendered through the Prose system.',
    content: doc(
      paragraph(
        'Posts are authored in the Payload admin and rendered here through the design system. Drafts stay private; only published posts appear on the public site.',
      ),
      heading('h2', 'From draft to published'),
      paragraph(
        'Each post has a title, an auto-generated slug, an excerpt for listings, an optional hero image, and a rich text body. Publish when it is ready and it shows up at /posts.',
      ),
      bulletList([
        'Create a post in the admin',
        'Write with the rich text editor',
        'Publish — it appears in the list and at its own URL',
      ]),
    ),
  },
]

const seed = async () => {
  const payload = await getPayload({ config })

  for (const data of posts) {
    const existing = await payload.find({
      collection: 'posts',
      where: { title: { equals: data.title } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      // Ensure it's published (create defaults to draft when versions are on).
      await payload.update({
        collection: 'posts',
        id: existing.docs[0].id,
        data: { _status: 'published' },
      })
      payload.logger.info(`published existing: ${data.title}`)
      continue
    }

    const created = await payload.create({
      collection: 'posts',
      data: { ...data, _status: 'published' },
    })
    payload.logger.info(`created: ${created.title} (/posts/${created.slug})`)
  }

  payload.logger.info('Seed complete.')
  process.exit(0)
}

await seed()
