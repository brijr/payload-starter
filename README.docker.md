# Docker Setup Guide

This project is configured to run with PostgreSQL in Docker.

## Quick Start

### Development with Docker Compose

1. Update `PAYLOAD_SECRET` in `.env.docker` with a secure random string.

2. Start the services:

```bash
docker compose up
```

This will:

- Start PostgreSQL on port 5432
- Start the Next.js/Payload app on port 3000
- Install dependencies with pnpm 10.12.4 and run in development mode

### Production Docker Build

1. Build the production image:

```bash
docker build -t payload-saas-starter .
```

2. Run with environment variables:

```bash
docker run -p 3000:3000 \
  -e DATABASE_URI="postgres://user:pass@host:5432/dbname" \
  -e PAYLOAD_SECRET="your-secret-key" \
  -e APP_URL="https://yourdomain.com" \
  -e RESEND_API_KEY="re_xxxxxxxxxxxxxxxx" \
  -e EMAIL_FROM="noreply@yourdomain.com" \
  -e BLOB_READ_WRITE_TOKEN="your-vercel-token" \
  payload-saas-starter
```

## Environment Variables

- `DATABASE_URI`: PostgreSQL connection string
- `PAYLOAD_SECRET`: Secret key for Payload CMS (generate a secure random string)
- `APP_URL`: Public app URL used in verification and password reset emails
- `RESEND_API_KEY` and `EMAIL_FROM`: Required for email verification and password reset emails
- `BLOB_READ_WRITE_TOKEN`: Vercel Blob storage token for media uploads
- `R2_*`: Cloudflare R2 credentials (optional, if using R2 instead of Vercel Blob)

## Database Connection

For local development with docker-compose:

```
DATABASE_URI=postgres://postgres:postgres@postgres:5432/payload
```

For external PostgreSQL:

```
DATABASE_URI=postgres://username:password@hostname:5432/database_name
```

## Notes

- The Dockerfile uses Node.js 22 Alpine for optimal performance
- Docker Compose uses Node.js 22.12.0 and pnpm 10.12.4 to match the application requirements
- The production build uses Next.js standalone output for smaller image size
- PostgreSQL data is persisted in a Docker volume
- Node modules are cached in a separate volume for faster rebuilds
