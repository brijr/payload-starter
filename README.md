# Payload App Starter

A modern, open-source starter kit built with Next.js 16 and Payload CMS 3. Ships with the Payload admin panel, a PostgreSQL-backed CMS, role-based admin access, and a clean Next.js frontend — no custom SaaS auth layer to rip out.

![Payload Starter](https://payloadstarter.dev/opengraph-image.jpg)

## Demo

[payloadstarter.dev](https://payloadstarter.dev)

> **Want user-facing authentication?** These sibling templates add a full auth layer on top of the same foundation:
>
> - [payload-clerk](https://github.com/brijr/payload-clerk) - With Clerk authentication
> - [payload-workos](https://github.com/brijr/payload-workos) - With WorkOS authentication
> - [payload-blog](https://github.com/brijr/payload-blog) - Blog starter template

## Features

### Payload CMS, batteries included

- Payload admin panel at `/admin` with its own built-in authentication
- Role-based admin access control (`admin` / `user`) on the `Users` collection
- PostgreSQL via the official Payload adapter
- Auto-generated, end-to-end TypeScript types from your collections
- Media uploads with Sharp optimization, stored in Vercel Blob (S3/R2-ready)
- REST API at `/api` and GraphQL at `/api/graphql`
- SEO-ready public site with shared metadata helpers, sitemap, robots, JSON-LD, and post-level SEO overrides

### Modern Tech Stack

| Category        | Technology                          |
| --------------- | ----------------------------------- |
| Framework       | Next.js 16.2 with App Router        |
| Runtime UI      | React 19.2                          |
| CMS             | Payload CMS 3.85                    |
| Language        | TypeScript 5.7                      |
| Database        | PostgreSQL                          |
| Styling         | Tailwind CSS 4                      |
| Components      | shadcn/ui + Radix UI                |
| Storage         | Vercel Blob by default, S3/R2-ready |
| Testing         | Vitest                              |
| Package Manager | pnpm 10.12                          |

### Developer Experience

- Server-first architecture with React Server Components
- Auto-generated TypeScript types from Payload collections
- `typecheck` and `test` scripts for a green baseline
- Reusable design system components (`@/components/ds`)
- Central SEO config driven by `APP_URL`
- Built-in security headers
- Docker support included
- Vercel deployment ready

## Quick Start

### Prerequisites

- **Node.js**: v20.9.0 or newer
- **Package Manager**: pnpm 10.12.4
- **Database**: PostgreSQL
- **Storage**: Vercel Blob for media uploads, or configure S3/R2

### Installation

```bash
# Clone the repository
git clone https://github.com/brijr/payload-starter.git
cd payload-starter

# Use the pnpm version pinned in package.json
npm install -g pnpm@10.12.4

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Start the development server
pnpm dev
```

Visit `http://localhost:3000` to see the frontend, and `http://localhost:3000/admin` for the Payload admin panel. The first account you create at `/admin` becomes your CMS user — set its role to `admin` to access the panel.

## Available Scripts

| Command                   | Description                                 |
| ------------------------- | ------------------------------------------- |
| `pnpm dev`                | Start development server                    |
| `pnpm devsafe`            | Start dev server (clears .next cache first) |
| `pnpm build`              | Build for production                        |
| `pnpm start`              | Start production server                     |
| `pnpm lint`               | Run ESLint                                  |
| `pnpm typecheck`          | Type-check with `tsc --noEmit`              |
| `pnpm test`               | Run the Vitest suite once                   |
| `pnpm test:watch`         | Run Vitest in watch mode                    |
| `pnpm payload`            | Access Payload CLI                          |
| `pnpm generate:types`     | Generate TypeScript types from collections  |
| `pnpm generate:importmap` | Generate Payload import map                 |

## Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── (frontend)/           # Frontend routes
│   │   └── (site)/           # Public site routes
│   └── (payload)/            # Payload CMS admin + API routes
│       ├── admin/            # Admin panel UI
│       └── api/              # Payload REST + GraphQL endpoints
├── collections/              # Payload collections (Users, Media)
│   └── Posts.ts              # Publishable posts with SEO override fields
├── components/
│   ├── site/                 # Site components (header, footer)
│   ├── theme/                # Theme provider and toggle
│   ├── ui/                   # shadcn/ui components
│   ├── rich-text.tsx         # Payload Lexical rich text renderer
│   ├── structured-data.tsx   # JSON-LD script renderer
│   └── ds.tsx                # Design system exports
├── hooks/                    # React hooks (use-mobile, ...)
├── lib/
│   ├── seo.ts                # Shared metadata, URL, sitemap, and JSON-LD helpers
│   ├── seo.test.ts           # SEO helper tests
│   ├── utils.ts              # Utility functions (cn, ...)
│   └── utils.test.ts         # Vitest smoke test
├── payload.config.ts         # Payload CMS configuration
└── payload-types.ts          # Auto-generated types
```

## Environment Variables

Create a `.env` file in the root directory:

### Required to Run

```bash
# Public app URL used for metadataBase, canonical URLs, sitemap, robots, and JSON-LD
APP_URL=http://localhost:3000

# Database (PostgreSQL)
DATABASE_URI=postgres://user:password@localhost:5432/dbname

# Payload CMS
PAYLOAD_SECRET=your-secure-secret-key-min-32-chars
```

### Required for Media Uploads

Vercel Blob is preconfigured as the default media storage backend.

```bash
# Storage (Vercel Blob)
BLOB_READ_WRITE_TOKEN=vercel_blob_xxxxxx
```

### Optional Storage Providers

The S3 storage package is installed for Cloudflare R2 or AWS S3. To switch providers, update `src/payload.config.ts` to use `@payloadcms/storage-s3`, then add the relevant credentials:

```bash
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
R2_BUCKET=your-bucket-name
R2_ENDPOINT=https://your-endpoint.r2.cloudflarestorage.com
```

## Route Organization

| Route Pattern  | Access      | Description                          |
| -------------- | ----------- | ------------------------------------ |
| `/(site)/*`    | Public      | Marketing pages, public content      |
| `/(payload)/*` | Admin login | Payload CMS admin interface          |
| `/api/*`       | Varies      | Payload REST API                     |
| `/api/graphql` | Varies      | GraphQL endpoint                     |

## SEO Setup

SEO is centralized in `src/lib/seo.ts` so new projects can change the site name, default description, canonical host, and social images in one place.

- Set `APP_URL` to the public origin for each environment. It powers `metadataBase`, canonical URLs, Open Graph URLs, `robots.txt`, `sitemap.xml`, and JSON-LD.
- Root metadata in `src/app/(frontend)/layout.tsx` uses shared defaults, including title templates, robots directives, Open Graph, and Twitter card metadata.
- Public pages use `createMetadata()` or `createArticleMetadata()` for canonical, Open Graph, and Twitter metadata.
- `src/app/(frontend)/(site)/sitemap.ts` includes `/`, `/posts`, and published posts from Payload when `DATABASE_URI` is configured.
- `src/app/robots.ts` allows the public site and disallows `/admin` and `/api`.
- `StructuredData` renders escaped JSON-LD. The root layout emits WebSite and Organization schema; post pages emit Article and BreadcrumbList schema.
- Posts include optional `meta.title`, `meta.description`, and `meta.image` fields. If left blank, metadata falls back to the post title, excerpt, hero image, and site defaults.

## Authentication

Authentication is handled entirely by **Payload CMS's built-in auth** on the `Users` collection — there is no custom user-facing auth layer.

- Sign in at `/admin` to reach the CMS.
- Access to the admin panel is gated by the `isAdmin` access control in `src/collections/Users.ts`, which checks `user.role === 'admin'`.
- Payload manages password hashing (bcrypt), the auth cookie, CSRF protection, and rate limiting for you.

To add user-facing login/registration, layer an auth provider on top (see the `payload-clerk` / `payload-workos` sibling templates) or build against Payload's [local API](https://payloadcms.com/docs/local-api/overview) and [authentication](https://payloadcms.com/docs/authentication/overview) docs.

## Storage Configuration

### Vercel Blob (Default)

Already configured. Just add `BLOB_READ_WRITE_TOKEN` to your environment.

### Cloudflare R2 / AWS S3

1. Add an `@payloadcms/storage-s3` plugin configuration in `payload.config.ts`
2. Disable or remove the Vercel Blob storage plugin
3. Add R2/S3 credentials to your environment

## Security

| Feature          | Implementation                       |
| ---------------- | ------------------------------------ |
| Admin auth       | Payload built-in (HTTP-only cookies) |
| CSRF Protection  | Built into Payload                   |
| Password Hashing | bcrypt via Payload                   |
| Access Control   | `role`-based on the Users collection |
| Security Headers | Configured in `next.config.mjs`      |
| Rate Limiting    | Built into Payload auth endpoints    |

## Common Tasks

### Adding a New Collection

```bash
# 1. Create collection file
# /src/collections/Posts.ts

# 2. Add to payload.config.ts
# collections: [Users, Media, Posts]

# 3. Generate types
pnpm generate:types
```

### Adding UI Components

```bash
# shadcn/ui components are in /src/components/ui/
# Import layout + prose primitives from the design system:
import { Section, Container, Nav } from '@/components/ds'
```

### Writing Tests

Vitest is configured out of the box. Co-locate `*.test.ts` files next to the code they cover (see `src/lib/utils.test.ts`) and run `pnpm test`.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in Vercel
3. Configure `DATABASE_URI`, `PAYLOAD_SECRET`, `APP_URL`, and `BLOB_READ_WRITE_TOKEN`
4. Deploy

### Docker

```bash
# Build the image
docker build -t payload-starter .

# Run the container
docker run -p 3000:3000 --env-file .env payload-starter
```

See [README.docker.md](README.docker.md) for Docker Compose development setup.

## Troubleshooting

### Next.js Cache Issues

```bash
pnpm devsafe  # Clears .next cache and starts dev server
```

### Type Errors After Collection Changes

```bash
pnpm generate:types
```

### Database Connection Issues

- Verify `DATABASE_URI` format: `postgres://user:password@host:5432/database`
- Ensure PostgreSQL is running
- Check firewall/network settings

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Payload CMS](https://payloadcms.com)
- [Next.js](https://nextjs.org)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)

---

Created by [brijr](https://github.com/brijr)
