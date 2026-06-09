# AGENTS.md

This file is the single source of truth for AI assistants (Codex, Claude Code, etc.) working in this repository. `CLAUDE.md` points here.

# Payload App Starter - AI Assistant Guide

## Project Overview

A modern starter kit built with Next.js 16 and Payload CMS 3. It pairs the Payload admin panel and PostgreSQL-backed CMS with a clean Next.js App Router frontend. Authentication is handled **entirely by Payload's built-in auth** on the `Users` collection — there is no custom user-facing ("SaaS") auth layer.

## Tech Stack

- **Framework**: Next.js 16.2.7 with App Router
- **Runtime UI**: React 19.2.5
- **CMS**: Payload CMS 3.85.0
- **Database**: PostgreSQL via `@payloadcms/db-postgres`
- **Language**: TypeScript 5.7.3
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **Storage**: Vercel Blob (with optional Cloudflare R2 / AWS S3 support)
- **Testing**: Vitest
- **Node**: >=20.9.0
- **Package Manager**: pnpm@10.12.4

> Build/dev/start scripts pass `--webpack` because Next.js 16 defaults to Turbopack; this starter pins webpack for Payload compatibility.

## Architecture Overview

### Core Patterns
- **App Router**: clear separation between the Next.js frontend (`(frontend)`) and the Payload admin/API (`(payload)`).
- **Server-First**: default to Server Components; reach for Client Components (`'use client'`) only for interactivity.
- **Type Safety**: Payload generates end-to-end types into `src/payload-types.ts`. Regenerate after any collection change.
- **Authentication**: Payload's built-in auth on the `Users` collection. The admin panel at `/admin` is gated by role-based access control. There is no custom middleware/proxy or auth server actions.
- **Storage Abstraction**: pluggable storage backend (Vercel Blob / S3 / R2) via Payload plugins.

### Route Organization
- Public routes: `/(site)/*` — accessible to all users
- Payload admin: `/(payload)/admin` — CMS admin interface (Payload auth)
- API routes: Payload REST API at `/api`, GraphQL at `/api/graphql`

## Project Structure

```
/src
  /app                 # Next.js App Router
    /(frontend)        # Frontend routes
      /(site)          # Public site routes
    /(payload)         # Payload CMS admin + API routes
      /admin           # Admin panel UI
      /api             # Payload REST + GraphQL endpoints
  /collections         # Payload collections (Users, Media)
  /components
    /site              # Site components (header, footer)
    /theme             # Theme provider + toggle (dark/light)
    /ui                # shadcn/ui components
    /ds.tsx            # Design system exports
  /hooks               # React hooks (use-mobile, ...)
  /lib
    /utils.ts          # Utility functions including cn()
    /utils.test.ts     # Vitest smoke test
  /payload.config.ts   # Payload CMS configuration
  /payload-types.ts    # Auto-generated Payload types
```

## Development Commands

```bash
pnpm install              # Install dependencies
pnpm dev                  # Development server
pnpm devsafe              # Dev server, clearing .next cache first
pnpm build                # Production build
pnpm start                # Production server
pnpm lint                 # ESLint
pnpm typecheck            # tsc --noEmit
pnpm test                 # Vitest (run once)
pnpm test:watch           # Vitest (watch mode)
pnpm generate:types       # Regenerate TypeScript types from collections
pnpm generate:importmap   # Regenerate Payload import map
pnpm payload              # Payload CLI
```

A green baseline is `pnpm typecheck && pnpm lint && pnpm test`. Note: `tsc` reads generated route types under `.next/types/**`; if you delete or rename routes, run `pnpm devsafe` or `rm -rf .next` before `pnpm typecheck` so stale generated types don't report phantom errors.

## Environment Variables

See `.env.example`. Required:

```bash
APP_URL=http://localhost:3000
DATABASE_URI=postgres://postgres:<password>@127.0.0.1:5432/your-database-name
PAYLOAD_SECRET=YOUR_SECRET_HERE
BLOB_READ_WRITE_TOKEN=YOUR_READ_WRITE_TOKEN_HERE
```

Optional (Cloudflare R2 / AWS S3): `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, `R2_ENDPOINT`.

## Important Files

- `/src/payload.config.ts` — Payload CMS configuration
- `/next.config.mjs` — Next.js config with security headers
- `/tsconfig.json` — TypeScript config with `@/*` and `@payload-config` aliases
- `/src/collections/Users.ts` — Users collection with Payload auth + `role`-based admin access
- `/src/collections/Media.ts` — Media/file upload collection
- `/src/components/ds.tsx` — Design system component exports
- `/src/lib/utils.ts` — `cn()` and other utilities

## Coding Guidelines

### General
1. TypeScript for all new files.
2. Follow the existing project structure.
3. Server Components by default; Client Components only when interactivity requires it.
4. Use Payload's generated types for type safety.
5. Use the design system + shadcn/ui components from `/src/components`.

### Authentication
- Auth is Payload's built-in system on the `Users` collection — do not reintroduce a custom session/cookie layer.
- Admin panel access is controlled by the `isAdmin` access function in `Users.ts` (`user.role === 'admin'`). Keep the `role` field and access control intact.
- To gate data or operations, use Payload [access control](https://payloadcms.com/docs/access-control/overview). To add user-facing auth, layer a provider on top (see the `payload-clerk` / `payload-workos` sibling templates).

### Styling
- Tailwind CSS v4 utility classes.
- Support dark/light mode via the existing theme system.
- Prefer shadcn/ui components; custom components go in `/src/components`.
- Use `cn()` from `/src/lib/utils.ts` for conditional classes.

### Database & CMS
- Define collections in `/src/collections/` and register them in `payload.config.ts`.
- Run `pnpm generate:types` after modifying collections.
- Media uploads use Vercel Blob by default.

### API
- Payload REST API is served at `/api`; GraphQL at `/api/graphql`.
- Use Payload's local/REST API for collection operations rather than hand-rolled endpoints.

### Testing
- Vitest is configured. Co-locate `*.test.ts` next to the code under test (see `src/lib/utils.test.ts`).
- Prefer testing pure functions and utilities; for Payload-dependent logic, lean on the local API in integration-style tests.

### Best Practices
1. Keep components small and focused.
2. Use generated Payload types.
3. Handle errors gracefully.
4. Follow Next.js 16 App Router best practices (Server Components first).
5. Use environment variables for secrets; never commit them.

## Deployment

Configured for Vercel: set `DATABASE_URI`, `PAYLOAD_SECRET`, `APP_URL`, and `BLOB_READ_WRITE_TOKEN`, then deploy. Docker is supported via the included `Dockerfile` (see `README.docker.md`).

## Security

1. Admin auth via Payload — HTTP-only cookies, CSRF protection, rate limiting built in.
2. Role-based access control on the Users collection.
3. Security headers in `next.config.mjs`.
4. Keep secrets in environment variables, never in the repo.

## Performance

1. Media is optimized via Sharp on upload.
2. Default to Server Components.
3. Automatic code splitting via the App Router.
4. Use Payload's query optimization and Next.js caching for static content.
