# Repository Guidelines

## Project Structure & Module Organization
Next.js routes live under `src/app`. Public-facing pages sit in `src/app/(frontend)/(site)` and admin CMS routes in `src/app/(frontend)/(admin)`. Shared layout and metadata is in `src/app/(frontend)/layout.tsx`, while API email hooks live in `src/app/api`. Payload collections and globals reside in `src/collections` with schema definition inside `payload.config.ts`. UI building blocks belong in `src/components/ui` and `src/components/ds.tsx`, with domain-specific variants grouped by folder. Shared utilities are in `src/lib`, and static assets live in `public/`. Update `globals.css` when extending Tailwind tokens.

## Build, Test, and Development Commands
- `pnpm dev` – boots the Next.js dev server alongside Payload in watch mode.
- `pnpm devsafe` – same as dev after clearing `.next` cache, useful for schema changes.
- `pnpm build` – creates an optimized production build; run before deploying.
- `pnpm start` – serves the production bundle created by `build`.
- `pnpm lint` – runs ESLint using the flat config in `eslint.config.mjs`.
- `pnpm payload` – opens the Payload CLI; use for database migrations or seeds.
- `pnpm generate:types` / `pnpm generate:importmap` – regenerate Payload types and import maps after schema updates.

## Coding Style & Naming Conventions
TypeScript is required for React components and Payload configs. Follow the ESLint ruleset (`next/core-web-vitals` + TypeScript) and keep imports using the `@/` alias for files under `src`. Prefer 2-space indentation and Prettier 3 defaults; commit formatted code. Components use PascalCase filenames (e.g., `BillingTable.tsx`), hooks use `useFoo.ts`, and Tailwind classes should remain composable utility-first strings. Name Payload collections in singular form and mirror them in the database.

## Testing Guidelines
An automated test runner is not yet configured. Before opening a PR, run `pnpm lint`, exercise critical flows (auth, dashboard, billing) via `pnpm dev`, and confirm Payload admin changes persist against your local Postgres instance. When introducing automated tests, colocate them near their modules (e.g., `src/lib/foo.test.ts`) and document the required runner in the PR so the team can replicate.

## Commit & Pull Request Guidelines
Follow lightweight Conventional Commit messages (`fix: resolve billing total`, `chore: update importmap`). Avoid `wip` in shared history. Each PR should include: summary of changes, affected routes or Payload collections, manual verification notes, and links to issues or design docs. Attach screenshots or screencasts when modifying UI states or admin panels, and call out required environment variables in the description.

## Environment & Payload Setup
Copy `.env.example` to `.env` and supply Postgres, Payload, Resend, and storage credentials before running any command. `docker-compose.yml` can provision Postgres locally; update connection strings to match. Sensitive keys must never be committed—use Vercel project environment variables for deployments. After editing schemas in `src/collections`, run `pnpm generate:types` so the generated `payload-types.ts` stays in sync.
