# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Payload App Starter - AI Assistant Guide

## Project Overview

This is a modern SaaS starter kit built with Next.js 15 and Payload CMS, designed to accelerate SaaS development. The project uses TypeScript, PostgreSQL, and includes a complete authentication system with role-based access control.

## Tech Stack

- **Framework**: Next.js 15.5.3 with App Router
- **CMS**: Payload CMS 3.55.1
- **Database**: PostgreSQL with Payload adapter
- **Language**: TypeScript 5.7.3
- **Styling**: Tailwind CSS v4 with Shadcn UI components
- **Storage**: Vercel Blob Storage (with optional Cloudflare R2/AWS S3 support)
- **Node**: v18.20.2+ or v20.9.0+
- **Package Manager**: pnpm

## Architecture Overview

### Core Architecture Patterns
- **App Router Architecture**: Uses Next.js 15 App Router with clear separation between frontend and Payload admin routes
- **Server-First Approach**: Defaults to Server Components, using Client Components only when necessary for interactivity
- **Type Safety**: Leverages Payload's automatic type generation for end-to-end type safety
- **Authentication Flow**: Cookie-based auth with middleware protection, server actions for mutations
- **Storage Abstraction**: Configurable storage backend (Vercel Blob/S3/R2) through Payload plugins

### Route Organization
- Public routes: `/(site)/*` - Accessible to all users
- Auth routes: `/(auth)/*` - Login, register, password reset (redirects if already authenticated)
- Protected routes: `/(admin)/*` - Requires authentication via middleware
- Payload admin: `/(payload)/*` - CMS admin interface
- API routes: `/api/*` - REST endpoints, Payload API at `/api`, GraphQL at `/api/graphql`

## Project Structure

```
/src
  /app                 # Next.js App Router
    /(frontend)        # Frontend routes
      /(admin)         # Protected admin routes (requires authentication)
      /(auth)          # Authentication routes (login, register)
      /(site)          # Public site routes
    /(payload)         # Payload CMS routes
    /api               # API routes including auth verification
  /collections         # Payload collections (Users, Media)
  /components          # React components
    /auth              # Authentication components
    /dashboard         # Dashboard components
    /ds.tsx            # Design system exports
    /site              # Site components (header, footer)
    /theme             # Theme components (dark/light mode)
    /ui                # Shadcn UI components
  /lib                 # Utility functions
    /auth.ts           # Authentication utilities and server actions
    /email.ts          # Email service with Resend
    /validation.ts     # Form validation schemas
  /middleware.ts       # Next.js middleware for route protection
  /payload.config.ts   # Payload CMS configuration
  /payload-types.ts    # Auto-generated Payload types
```

## Development Commands

```bash
# Install dependencies
pnpm install

# Development server
pnpm dev

# Safe development (clears .next cache)
pnpm devsafe

# Build for production
pnpm build

# Start production server
pnpm start

# Generate Payload import map
pnpm generate:importmap

# Generate TypeScript types
pnpm generate:types

# Run linter
pnpm lint

# Access Payload CLI
pnpm payload

# Testing
# Note: No test framework is currently configured.
# To run tests, first install a test framework (e.g., Jest, Vitest)
```

## Environment Variables

Required environment variables (see `.env.example`):

```bash
# Database
DATABASE_URI=postgres://postgres:<password>@127.0.0.1:5432/your-database-name

# Payload secret key
PAYLOAD_SECRET=YOUR_SECRET_HERE

# Email Configuration (Resend)
RESEND_API_KEY=re_xxxxxxxx
EMAIL_FROM=noreply@yourdomain.com

# Storage
BLOB_READ_WRITE_TOKEN=YOUR_READ_WRITE_TOKEN_HERE

# Optional: Cloudflare R2
R2_ACCESS_KEY_ID=YOUR_ACCESS_KEY_ID_HERE
R2_SECRET_ACCESS_KEY=YOUR_SECRET_ACCESS_KEY_HERE
R2_BUCKET=YOUR_BUCKET_HERE
R2_ENDPOINT=YOUR_ENDPOINT_HERE
```

Note: The example shows minimal required variables. Additional optional variables may be needed for S3/R2 storage.

## Important Files

### Configuration
- `/src/payload.config.ts` - Payload CMS configuration
- `/next.config.mjs` - Next.js configuration with security headers
- `/tsconfig.json` - TypeScript configuration with path aliases
- `/postcss.config.mjs` - PostCSS configuration for Tailwind CSS v4
- `/Dockerfile` - Docker configuration for containerized deployment

### Collections
- `/src/collections/Users.ts` - User collection with authentication fields
- `/src/collections/Media.ts` - Media/file upload collection

### Authentication System
- `/src/lib/auth.ts` - Core authentication utilities and server actions
- `/src/lib/email.ts` - Email service with Resend integration
- `/src/middleware.ts` - Route protection middleware
- `/src/components/auth/` - Authentication UI components
  - `login-form.tsx` - Login form with toast notifications
  - `register-form.tsx` - Registration form with email verification
  - `logout-button.tsx` - Client-side logout with router navigation
  - `logout-form.tsx` - Server action logout form (works without JS)
  - `forgot-password-form.tsx` - Password reset request form
  - `email-verification-banner.tsx` - Email verification status banner
- `/src/app/api/auth/verify-email/route.ts` - Email verification endpoint
- `/src/app/(frontend)/(auth)/forgot-password/` - Password reset request page
- `/src/app/(frontend)/(auth)/reset-password/` - Password reset page

### Layouts
- `/src/app/(frontend)/layout.tsx` - Main frontend layout with providers
- `/src/app/(frontend)/(admin)/layout.tsx` - Admin area layout
- `/src/app/(payload)/layout.tsx` - Payload CMS layout

### Components
- `/src/components/ds.tsx` - Design system component exports
- `/src/components/ui/` - Shadcn UI components (button, card, form, etc.)
- `/src/components/theme/` - Theme provider and toggle components
- `/src/components/app/` - App-specific components (navigation)
- `/src/lib/utils.ts` - Utility functions including `cn()` for className merging

## Coding Guidelines

### General Rules
1. Use TypeScript for all new files
2. Follow the existing project structure
3. Use server components by default, client components only when necessary
4. Utilize Payload's type generation for type safety
5. Use the design system components from `/src/components/ui/`

### Authentication
- Always use the authentication utilities from `/src/lib/auth.ts`
- Protected routes should be placed under `/(admin)/` directory
- Use middleware for route protection rather than client-side checks
- Auth pages automatically redirect authenticated users to dashboard
- All auth feedback uses toast notifications for better UX
- For logout: use `LogoutButton` (client-side) or `LogoutForm` (server action)
- Client logout uses `clearAuthCookies()` + router navigation
- Server logout uses `logoutUser()` server action with redirect

### Styling
- Use Tailwind CSS v4 classes
- Follow the existing theme system for dark/light mode support
- Use Shadcn UI components when available
- Custom components should go in `/src/components/`
- Use the `cn()` utility from `/src/lib/utils.ts` for conditional classes

### Database & CMS
- Define collections in `/src/collections/`
- Run `pnpm generate:types` after modifying collections
- Use Payload's built-in authentication for the Users collection
- Media uploads are configured to use Vercel Blob Storage by default

### API Routes
- Place custom API routes in `/src/app/api/`
- Payload API routes are automatically handled at `/api/`
- GraphQL endpoint is available at `/api/graphql`
- Use Payload's REST API for collection operations

### Best Practices
1. Keep components small and focused
2. Use proper TypeScript types (generated from Payload)
3. Handle errors gracefully with try-catch blocks
4. Follow Next.js 15 best practices (App Router, Server Components)
5. Use environment variables for sensitive data
6. Test authentication flows thoroughly
7. Use `cross-env` for cross-platform compatibility in scripts

## Deployment

The project is configured for Vercel deployment:
1. Ensure all environment variables are set in Vercel
2. The project uses Vercel Blob Storage for media uploads
3. PostgreSQL database connection is required
4. Use the "Deploy with Vercel" button in the README for quick setup
5. Docker deployment is also supported with the included Dockerfile

## Common Tasks

### Adding a New Collection
1. Create a new file in `/src/collections/`
2. Add the collection to `/src/payload.config.ts`
3. Run `pnpm generate:types` to update TypeScript types
4. Create UI components if needed for the collection

### Creating Protected Pages
1. Add pages under `/src/app/(frontend)/(admin)/`
2. The middleware will automatically protect these routes
3. Use authentication utilities to check user roles if needed

### Customizing the Theme
1. Modify theme components in `/src/components/theme/`
2. Update Tailwind configuration if needed
3. Ensure dark mode compatibility

### Working with Forms
1. Use shadcn Field components for all new forms (see migrated auth forms for examples)
2. Implement proper validation using `/src/lib/validation.ts`
3. Handle form submissions with Server Actions
4. Use toast notifications for user feedback

#### Form Component Structure
Forms should use the Field component family for accessibility and consistency:

```tsx
import { Field, FieldGroup, FieldLabel, FieldDescription, FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

<form onSubmit={handleSubmit}>
  <FieldGroup>
    <Field>
      <FieldLabel htmlFor="email">Email</FieldLabel>
      <Input
        id="email"
        type="email"
        name="email"
        placeholder="email@example.com"
        required
      />
      <FieldDescription>Optional helper text</FieldDescription>
    </Field>

    <Field data-invalid={hasError}>
      <FieldLabel htmlFor="password">Password</FieldLabel>
      <Input
        id="password"
        type="password"
        name="password"
        aria-invalid={hasError}
        required
      />
      {hasError && <FieldError>Error message here</FieldError>}
    </Field>
  </FieldGroup>
</form>
```

- Use `Field` to wrap each form field
- Use `FieldGroup` to organize multiple fields
- Use `FieldLabel` with `htmlFor` attribute for accessibility
- Use `FieldDescription` for helper text
- Use `FieldError` to display validation errors
- Set `data-invalid` on Field and `aria-invalid` on Input for error states
- For horizontal layouts (e.g., checkbox with label), use `orientation="horizontal"` on Field

### Email and Authentication Features
1. Email verification is automatic on registration
2. Password reset flow includes email verification
3. Email templates are customizable in `/src/lib/email.ts`
4. Users collection includes email verification fields
5. Use `EmailVerificationBanner` component for unverified users
6. Security headers are configured in `next.config.mjs`

### Storage Configuration
1. Default: Vercel Blob Storage (configured in payload.config.ts)
2. Alternative: Uncomment S3/R2 configuration in payload.config.ts
3. Update environment variables accordingly
4. Media collection handles all file uploads

### Development Workflow
1. Use `pnpm devsafe` if you encounter Next.js caching issues
2. Always run `pnpm generate:types` after modifying Payload collections
3. Check `pnpm lint` before committing code
4. Use Server Actions for data mutations
5. Implement loading states for better UX
6. Handle errors with appropriate user feedback

## Testing Strategy

Currently, no test framework is configured. When implementing tests:
1. Choose a test framework (Jest, Vitest, or Playwright for E2E)
2. Focus on testing:
   - Authentication flows (login, register, password reset)
   - Protected route access
   - Form validations
   - Server actions
   - API endpoints

## Performance Considerations

1. **Image Optimization**: Media uploads are automatically optimized via Sharp
2. **Server Components**: Default to Server Components for better performance
3. **Code Splitting**: Automatic with Next.js App Router
4. **Database Queries**: Use Payload's built-in query optimization
5. **Caching**: Leverage Next.js caching strategies for static content

## Security Best Practices

1. **Authentication**: HTTP-only cookies with secure flags
2. **CSRF Protection**: Built into Payload's authentication
3. **Input Validation**: Use Zod schemas in `/src/lib/validation.ts`
4. **Security Headers**: Configured in `next.config.mjs`
5. **Environment Variables**: Never commit sensitive data
6. **Database Security**: Use connection pooling and prepared statements
