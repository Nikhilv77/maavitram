# Maavitram

Maavitram storefront and admin dashboard built with Next.js, PostgreSQL (Neon), Prisma and WhatsApp ordering.

## Getting Started

### 1. Install

```bash
pnpm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Fill `.env`:

```env
DATABASE_URL=""
NEXT_PUBLIC_SITE_URL="http://localhost:999"
NEXT_PUBLIC_WHATSAPP_NUMBER=""

# Generate: openssl rand -base64 32
AUTH_SECRET=""

# Gmail SMTP — password reset emails
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="465"
SMTP_USER=""
SMTP_PASSWORD=""
MAIL_FROM=""
```

> `SMTP_PASSWORD` must be a Google App Password. Never commit `.env`.

### 3. Set up database

For a fresh database:

```bash
pnpm prisma migrate deploy
pnpm db:seed
```

This applies all committed Prisma migrations and adds the initial product data.

### 4. Create admin

Run once for a fresh database:

```bash
pnpm admin:create
```

Enter the admin email and password when prompted.

The admin email is used for login and receives password-reset links.

### 5. Start

```bash
pnpm dev
```

Open:

```text
http://localhost:999
```

## Useful Commands

```bash
# Development
pnpm dev

# Apply existing migrations
pnpm prisma migrate deploy

# Create migration while developing
pnpm db:migrate --name migration_name

# Seed database
pnpm db:seed

# Prisma Studio
pnpm db:studio

# Create first admin
pnpm admin:create

# Emergency admin password reset
pnpm admin:reset-password

# Production build
pnpm build
pnpm start
```

## New Database / Client Handover

For a new empty Neon database:

```text
Create Neon database
      ↓
Set DATABASE_URL
      ↓
pnpm install
      ↓
pnpm prisma migrate deploy
      ↓
pnpm db:seed
      ↓
pnpm admin:create
      ↓
pnpm dev
```

If existing production data also needs to be transferred, migrate the PostgreSQL database using `pg_dump` / `pg_restore` instead of only running Prisma migrations.

## Important

- Keep `prisma/migrations/` committed to Git.
- Never commit `.env` or database/SMTP credentials.
- Never store admin passwords as plaintext.
- Use `prisma migrate deploy` when setting up a fresh production/client database.