# Payload App Starter

A modern, open-source SaaS starter kit built with Next.js 15 and Payload CMS, designed to accelerate your SaaS development.

![Payload SaaS Starter](https://payloadstarter.dev/opengraph-image.jpg)

## Demo

[payloadstarter.dev](https://payloadstarter.dev)

> Version with Clerk: [payload-clerk](https://github.com/brijr/payload-clerk)
> Version with WorkOS: [payload-workos](https://github.com/brijr/payload-workos)

## Features

- **Authentication System**
  - Secure user authentication with HTTP-only cookies
  - Email/password registration and login
  - Email verification with automatic emails
  - Password reset functionality (forgot password flow)
  - Resend verification email capability
  - Role-based access control (admin/user)
  - Password strength validation
  - "Remember me" functionality
  - Protected routes with middleware
  - Toast notifications for all auth feedback

- **Modern Tech Stack**
  - Next.js 15+ with App Router
  - Payload CMS 3+ for content management
  - TypeScript 5+ for type safety
  - PostgreSQL database with Payload adapter
  - Tailwind 4+ for styling
  - shadcn/ui components
  - Dark/light mode with theme persistence
  - Resend for transactional emails
  - Vercel Blob Storage (or S3/R2)

- **Developer Experience**
  - Clean project structure
  - Server components and actions
  - Reusable design system components
  - Type-safe APIs with auto-generated types
  - Cross-platform support with cross-env
  - Built-in security headers
  - Docker support included
  - Vercel deployment ready

## Getting Started

### Prerequisites

- Node.js and pnpm
- PostgreSQL database
- Blob Storage (Vercel Blob or S3/R2)
- Resend account for email functionality (optional but recommended)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/brijr/payload-starter.git
   cd payload-starter
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

   Edit the `.env` file with your database credentials and other settings. See the [Environment Variables](#environment-variables) section for details.

4. Start the development server:

   ```bash
   pnpm dev
   ```

5. Visit `http://localhost:3000` to see your application.

## Available Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm devsafe          # Start dev server (clears .next cache first)

# Production
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint

# Payload CMS
pnpm payload          # Access Payload CLI
pnpm generate:types   # Generate TypeScript types
pnpm generate:importmap # Generate import map
```

## Project Structure

```
/src
  /app                 # Next.js App Router
    /(frontend)        # Frontend routes
      /(admin)         # Protected admin routes
      /(auth)          # Authentication routes
      /(site)          # Public site routes
    /(payload)         # Payload CMS routes
    /api               # API routes
      /auth            # Auth endpoints (email verification)
  /collections         # Payload collections
  /components          # React components
    /app               # App-specific components
    /auth              # Authentication components
    /site              # Site components
    /theme             # Theme components
    /ui                # Shadcn UI components
    ds.tsx             # Design system exports
  /lib                 # Utility functions
  /public              # Static assets
  middleware.ts        # Route protection
  payload.config.ts    # Payload configuration
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

### Required Variables

```bash
# Database
DATABASE_URI=postgres://user:password@localhost:5432/dbname

# Payload
PAYLOAD_SECRET=your-secret-key-here
APP_URL=http://localhost:3000  # Your app URL (production URL in deployment)

# Email (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxx  # Get from resend.com
EMAIL_FROM=noreply@yourdomain.com

# Storage
BLOB_READ_WRITE_TOKEN=vercel_blob_xxxxxx  # From Vercel dashboard
```

### Optional Variables (for S3/R2 storage)

```bash
# Cloudflare R2 or AWS S3
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
R2_BUCKET=your-bucket-name
R2_ENDPOINT=https://your-endpoint.r2.cloudflarestorage.com
```

## Email Configuration

This starter uses [Resend](https://resend.com) for transactional emails. To set up:

1. Create a free account at [resend.com](https://resend.com)
2. Verify your domain or use their test domain
3. Generate an API key
4. Add the API key to your `.env` file

Email features include:

- Welcome emails on registration
- Email verification links
- Password reset emails
- Customizable email templates in `/src/lib/email.ts`

## Key Components

### Authentication Components

- `login-form.tsx` - Login with email/password
- `register-form.tsx` - User registration with validation
- `email-verification-banner.tsx` - Shows when email is unverified
- `forgot-password-form.tsx` - Request password reset
- `logout-button.tsx` - Client-side logout
- `logout-form.tsx` - Server-side logout (works without JS)

### Design System

- All UI components are in `/src/components/ui/`
- Import common components from `/src/components/ds.tsx`
- Consistent theming with CSS variables
- Full dark mode support

## Security Features

- **Authentication**: HTTP-only cookies, secure flag in production
- **Headers**: Security headers configured in `next.config.mjs`
- **CSRF**: Built-in protection via Payload
- **Input Validation**: Zod schemas for all forms
- **Password Security**: Strength requirements, bcrypt hashing
- **Rate Limiting**: Built into Payload auth endpoints

## Deployment

This project is ready to deploy on Vercel:

1. Push your code to a GitHub repository
2. Connect the repository to Vercel
3. Configure all required environment variables
4. Deploy!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Payload CMS](https://payloadcms.com)
- [Next.js](https://nextjs.org)
- [Shadcn UI](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)

---

Created by [brijr](https://github.com/brijr)
