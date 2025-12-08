# Payload App Starter

A modern, open-source SaaS starter kit built with Next.js 16 and Payload CMS 3, designed to accelerate your SaaS development.

![Payload SaaS Starter](https://payloadstarter.dev/opengraph-image.jpg)

## Demo

[payloadstarter.dev](https://payloadstarter.dev)

> **Other Versions:**
> - [payload-clerk](https://github.com/brijr/payload-clerk) - With Clerk authentication
> - [payload-workos](https://github.com/brijr/payload-workos) - With WorkOS authentication
> - [payload-blog](https://github.com/brijr/payload-blog) - Blog starter template

## Features

### Authentication System

- Secure HTTP-only cookie-based authentication
- Email/password registration and login
- Email verification with automatic emails
- Password reset flow (forgot password)
- Resend verification email capability
- Role-based access control (admin/user)
- Password strength validation
- "Remember me" functionality
- Protected routes via middleware
- Toast notifications for auth feedback

### Modern Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 with App Router |
| CMS | Payload CMS 3.67 |
| Language | TypeScript 5.7 |
| Database | PostgreSQL |
| Styling | Tailwind CSS 4 |
| Components | shadcn/ui + Radix UI |
| Email | Resend |
| Storage | Vercel Blob / S3 / R2 |

### Developer Experience

- Server-first architecture with React Server Components
- Auto-generated TypeScript types from Payload collections
- Reusable design system components
- Built-in security headers
- Docker support included
- Vercel deployment ready

## Quick Start

### Prerequisites

- **Node.js**: v18.20.2+ or v20.9.0+
- **Package Manager**: pnpm
- **Database**: PostgreSQL
- **Storage**: Vercel Blob, AWS S3, or Cloudflare R2

### Installation

```bash
# Clone the repository
git clone https://github.com/brijr/payload-starter.git
cd payload-starter

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Start the development server
pnpm dev
```

Visit `http://localhost:3000` to see your application.

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm devsafe` | Start dev server (clears .next cache first) |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm payload` | Access Payload CLI |
| `pnpm generate:types` | Generate TypeScript types from collections |
| `pnpm generate:importmap` | Generate Payload import map |

## Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── (frontend)/           # Frontend routes
│   │   ├── (admin)/          # Protected routes (requires auth)
│   │   ├── (auth)/           # Auth routes (login, register, etc.)
│   │   └── (site)/           # Public routes
│   ├── (payload)/            # Payload CMS admin routes
│   └── api/                  # API routes
│       └── auth/             # Auth endpoints (email verification)
├── collections/              # Payload collections (Users, Media)
├── components/
│   ├── app/                  # App-specific components
│   ├── auth/                 # Authentication components
│   ├── dashboard/            # Dashboard components
│   ├── site/                 # Site components (header, footer)
│   ├── theme/                # Theme provider and toggle
│   ├── ui/                   # shadcn/ui components
│   └── ds.tsx                # Design system exports
├── lib/
│   ├── auth.ts               # Auth utilities and server actions
│   ├── email.ts              # Email service with Resend
│   ├── utils.ts              # Utility functions (cn, etc.)
│   └── validation.ts         # Zod validation schemas
├── middleware.ts             # Route protection middleware
├── payload.config.ts         # Payload CMS configuration
└── payload-types.ts          # Auto-generated types
```

## Environment Variables

Create a `.env` file in the root directory:

### Required

```bash
# Database (PostgreSQL)
DATABASE_URI=postgres://user:password@localhost:5432/dbname

# Payload CMS
PAYLOAD_SECRET=your-secure-secret-key-min-32-chars

# Storage (Vercel Blob)
BLOB_READ_WRITE_TOKEN=vercel_blob_xxxxxx
```

### Optional

```bash
# Email (Resend) - Required for email verification & password reset
RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
EMAIL_FROM=noreply@yourdomain.com

# Alternative Storage (Cloudflare R2 or AWS S3)
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
R2_BUCKET=your-bucket-name
R2_ENDPOINT=https://your-endpoint.r2.cloudflarestorage.com
```

## Route Organization

| Route Pattern | Access | Description |
|--------------|--------|-------------|
| `/(site)/*` | Public | Marketing pages, public content |
| `/(auth)/*` | Guest only | Login, register, password reset |
| `/(admin)/*` | Authenticated | Dashboard, protected pages |
| `/(payload)/*` | Admin | Payload CMS admin interface |
| `/api/*` | Varies | REST API, Payload API |
| `/api/graphql` | Varies | GraphQL endpoint |

## Authentication

### Components

| Component | Purpose |
|-----------|---------|
| `login-form.tsx` | Login with email/password |
| `register-form.tsx` | User registration with validation |
| `forgot-password-form.tsx` | Request password reset |
| `logout-button.tsx` | Client-side logout |
| `logout-form.tsx` | Server-side logout (no JS required) |
| `email-verification-banner.tsx` | Shows when email is unverified |

### Auth Flow

1. **Registration**: User registers → verification email sent → user clicks link → email verified
2. **Login**: User submits credentials → server validates → HTTP-only cookie set → redirect to dashboard
3. **Password Reset**: User requests reset → email sent → user clicks link → sets new password

## Email Configuration

This starter uses [Resend](https://resend.com) for transactional emails:

1. Create a free account at [resend.com](https://resend.com)
2. Verify your domain or use their test domain
3. Generate an API key
4. Add credentials to your `.env` file

**Features:**
- Welcome emails on registration
- Email verification links
- Password reset emails
- Customizable templates in `/src/lib/email.ts`

## Storage Configuration

### Vercel Blob (Default)

Already configured. Just add `BLOB_READ_WRITE_TOKEN` to your environment.

### Cloudflare R2 / AWS S3

1. Uncomment S3 configuration in `payload.config.ts`
2. Comment out Vercel Blob configuration
3. Add R2/S3 credentials to your environment

## Security

| Feature | Implementation |
|---------|----------------|
| Authentication | HTTP-only cookies with secure flag |
| CSRF Protection | Built into Payload |
| Input Validation | Zod schemas |
| Password Hashing | bcrypt via Payload |
| Security Headers | Configured in `next.config.mjs` |
| Rate Limiting | Built into Payload auth endpoints |

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

### Creating Protected Pages

Add pages under `/src/app/(frontend)/(admin)/`. Middleware automatically protects these routes.

### Adding UI Components

```bash
# shadcn/ui components are in /src/components/ui/
# Import from the design system for common components:
import { Button, Card, Input } from '@/components/ds'
```

### Working with Forms

```tsx
import { Field, FieldGroup, FieldLabel, FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

<form onSubmit={handleSubmit}>
  <FieldGroup>
    <Field data-invalid={hasError}>
      <FieldLabel htmlFor="email">Email</FieldLabel>
      <Input id="email" name="email" type="email" required />
      {hasError && <FieldError>Invalid email</FieldError>}
    </Field>
  </FieldGroup>
</form>
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in Vercel
3. Configure environment variables
4. Deploy

### Docker

```bash
# Build the image
docker build -t payload-starter .

# Run the container
docker run -p 3000:3000 --env-file .env payload-starter
```

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
- [Resend](https://resend.com)

---

Created by [brijr](https://github.com/brijr)
