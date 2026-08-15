# Maavitram

Maavitram is a premium Indian spice/masala brand. This repo is its
storefront + admin dashboard: a Next.js app backed by Postgres (Neon) via
Prisma, with **WhatsApp as the entire checkout mechanism** — there is no
payment gateway.

The storefront UI (navbar, product pages, cart) and the admin UI (product
and order management tables) have **not been built yet**. What exists today
is the full foundation: data model, business logic, theme, and a working
order-creation API — see [Current features](#current-features-vs-planned)
below for the exact line between what's real and what's next.

## Tech stack

| Layer           | Choice                                                            |
| --------------- | ----------------------------------------------------------------- |
| Framework       | Next.js 16 (App Router), React 19, TypeScript (strict)            |
| Styling         | Tailwind CSS v4, `next/font/google` (Raleway)                     |
| Database        | Postgres via [Neon](https://neon.tech), accessed with Prisma 7    |
| ORM driver      | `@prisma/adapter-pg` (plain node-postgres — no Neon-specific SDK) |
| Validation      | Zod                                                               |
| Formatting      | Prettier + `prettier-plugin-tailwindcss`                          |
| Package manager | pnpm                                                              |

No Redux, React Query, Axios, Docker, or Redis — deliberately not part of
this stack yet.

## Project structure

```
prisma/
  schema.prisma       Product, ProductVariant, Inventory, Order, OrderItem
  migrations/          Committed SQL migrations (source of truth for schema changes)
  seed.ts              Seeds the 4 Maavitram products

src/
  app/                  Routes and layouts ONLY — no business logic lives here
    (store)/            Storefront route group (currently just a placeholder "/")
    admin/               Admin route group (currently a live stats dashboard)
    api/
      health/            GET /api/health
      orders/            POST /api/orders — the WhatsApp order flow

  features/              Business logic, one folder per domain
    products/lib/        Catalogue queries (Prisma), pricing helpers
    inventory/lib/        Stock status + validated stock adjustments
    orders/lib/            Order creation (validates input, writes to DB)
    whatsapp/lib/          Order -> WhatsApp message text -> wa.me link
    analytics/lib/         Sales summary / top-product aggregation

  components/
    ui/                  Design-system primitives: Button, Container, Badge
    store/                Storefront-facing components (e.g. PriceTag)
    admin/                Admin-facing components (e.g. StatCard)

  config/
    site.ts               Site name/tagline/URL/WhatsApp number (from env)
    nav.ts                 Store + admin nav item lists (not yet rendered anywhere)

  lib/
    db.ts                  Prisma client singleton (driver-adapter based)
    env.ts                 Server-only env validation (DATABASE_URL)
    api-response.ts        The one shared API error shape
    utils.ts                `cn()` class-merging helper

  schemas/                Zod schemas — validate seed data and API input
  types/                   Public type surface, re-exported from Prisma/schemas
```

**Why this split:** `app/` stays thin (routing + layout only) so every
route can be a Server Component that just calls into `features/`. Business
logic in `features/` doesn't know or care whether it's called from a page
or an API route. `components/ui` is the only place allowed to be
domain-agnostic; `components/store` and `components/admin` know about
products/orders/stats.

## Data model: Product → Variant → Inventory

```
Product (name, category, description, images, tags, isFeatured, isActive)
  └─ ProductVariant (sku, label, weightInGrams, price, mrp?, isDefault, isActive)
       └─ Inventory (stockQuantity)   [1:1 with the variant]
```

- A **Product** is a spice/masala line (e.g. "Maavitram Tez").
- Each **ProductVariant** is a sellable SKU at a given weight (e.g. "100 g"
  at ₹99) — this is where price and active/inactive status live.
- **Inventory** is a separate 1:1 table holding `stockQuantity`, kept apart
  from the variant so stock and catalogue/pricing concerns don't mix.
- `ProductCategory` enum: `whole_spices`, `ground_spices`,
  `blended_masalas`, `seasonings`.

Orders mirror the same pattern: `Order` → `OrderItem[]`, with each item
denormalizing `productId`/`productName`/`variantLabel` so an order's
receipt/WhatsApp message never needs a join.

## Storefront vs admin responsibilities

- **Storefront** (`app/(store)`) — customer-facing. Currently just a
  placeholder home screen. Will eventually list products and let a
  customer build an order that redirects to WhatsApp.
- **Admin** (`app/admin`) — internal. Currently a single dashboard page
  that queries the real database and shows three live stats (active
  product count, variants needing attention, total inventory value).
  Product/inventory/order management screens don't exist yet.
  **There is no authentication on `/admin` yet** — anyone with the URL can
  view it. Do not deploy publicly before adding access control.

## WhatsApp ordering flow (V1)

There is no payment gateway. The entire "checkout" is:

1. Client sends cart + customer details to `POST /api/orders`.
2. [`checkoutInputSchema`](src/schemas/order.ts) validates the input.
3. [`createOrder`](src/features/orders/lib/create-order.ts) writes an
   `Order` + `OrderItem[]` to the database with `status: "pending"`.
4. [`formatOrderMessage`](src/features/whatsapp/lib/message.ts) renders
   the order as WhatsApp text; [`buildWhatsAppLink`](src/features/whatsapp/lib/link.ts)
   turns it into a `wa.me` deep link.
5. The route returns `{ order, whatsappUrl }`. **The client redirecting
   the browser to `whatsappUrl` is not built yet** — there's no cart/checkout
   UI to call this endpoint from.

Every created order counts as a real order — there's no separate
"confirmed" step. `OrderStatus` (`pending` / `confirmed` / `fulfilled` /
`cancelled`) exists for the admin to update manually later.

## Getting started

```bash
pnpm install        # also runs `prisma generate` via postinstall
cp .env.example .env
# fill in .env (see below), then:
pnpm db:migrate      # applies prisma/migrations/ to your database
pnpm db:seed         # seeds the 4 Maavitram products
pnpm dev             # http://localhost:999
```

The dev server always runs on **port 999** (`next dev -p 999`), not the
Next.js default 3000.

## Environment variables

Defined in [.env.example](.env.example) — copy it to `.env`, which is
gitignored (`.gitignore` excludes `.env*` but explicitly un-ignores
`.env.example`, so the example file stays committed and safe).

| Variable                      | Used for                                                                 |
| ----------------------------- | ------------------------------------------------------------------------ |
| `DATABASE_URL`                | Postgres connection string. Use Neon's **pooled** connection string.     |
| `NEXT_PUBLIC_SITE_URL`        | Public site URL (defaults to `http://localhost:999` locally).            |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp Business number (digits only, country code first) orders go to. |

`DATABASE_URL` is only read server-side ([src/lib/env.ts](src/lib/env.ts),
validated at startup). The `NEXT_PUBLIC_*` vars are inlined at build time
and read directly in [src/config/site.ts](src/config/site.ts), with
placeholder fallbacks so the app still runs before real values are set.

Since the Prisma layer uses the plain `postgresql` provider (no
Neon-specific SDK), any reachable Postgres connection string works for
local development — Neon is only required for the deployed environment.

## Database: Neon + Prisma

Prisma 7 requires a driver adapter — there's no more "just set
`DATABASE_URL` and go." The connection is wired in two places:

- [prisma.config.ts](prisma.config.ts) — used by the Prisma CLI
  (migrate/seed/studio), reads `DATABASE_URL` via `dotenv`.
- [src/lib/db.ts](src/lib/db.ts) — the runtime Prisma Client singleton,
  built with `@prisma/adapter-pg` wrapping `DATABASE_URL`.

Schema changes always go through a migration — the schema is never pushed
directly. Workflow for a schema change:

```bash
# 1. edit prisma/schema.prisma
pnpm db:migrate --name describe_the_change   # creates + applies a migration
pnpm db:seed                                  # re-run if seed data is affected
```

Two migrations exist so far: the initial schema, and adding
`ProductVariant.isActive`.

## Available scripts

| Script             | What it does                                      |
| ------------------ | ------------------------------------------------- |
| `pnpm dev`         | Start the dev server on port 999                  |
| `pnpm build`       | Production build                                  |
| `pnpm start`       | Run the production build on port 999              |
| `pnpm lint`        | ESLint (`eslint .`)                               |
| `pnpm format`      | Prettier, writes in place, sorts Tailwind classes |
| `pnpm db:generate` | Regenerate the Prisma Client                      |
| `pnpm db:migrate`  | Create/apply a migration (`prisma migrate dev`)   |
| `pnpm db:seed`     | Run `prisma/seed.ts`                              |
| `pnpm db:studio`   | Open Prisma Studio                                |

`prisma generate` also runs automatically via `postinstall` after
`pnpm install`.

## Production build

```bash
pnpm build
pnpm start   # serves the build on port 999
```

`next build` type-checks the whole project (including `prisma/seed.ts` and
`prisma.config.ts`) and statically prerenders any route that doesn't need
per-request data — `/admin` currently prerenders by querying the database
at build time, so a reachable `DATABASE_URL` is required to build, not
just to run.

## Development conventions

- **`app/` is routes and layouts only.** Anything that touches the
  database or has real logic belongs in `features/`.
- **Server Components by default.** Data-access functions in `features/*/lib`
  are marked `import "server-only"` so they can't accidentally end up in a
  client bundle.
- **Strict TypeScript, no `any`.** Entity types are re-exported from
  Prisma (`@/types/*`) rather than hand-duplicated; Zod schemas
  (`@/schemas/*`) validate anything crossing a real boundary — seed data,
  API request bodies.
- **`@/*` imports**, resolved to `src/*`.
- **One API error shape.** Every route returns errors as
  `{ error: { message, issues? } }` via [`apiError()`](src/lib/api-response.ts) —
  see `POST /api/orders` for the pattern.
- **Product images** live under `public/images/products/<slug>/<n>.jpg`
  (see [public/images/products/README.md](public/images/products/README.md)).
- **Keep this README current.** When a change alters the architecture,
  data model, scripts, or env vars, update the relevant section here in
  the same change.

## Current features vs planned

**Built and working:**

- Next.js/TypeScript/Tailwind scaffold with the Maavitram theme
  (cream/green palette, Raleway, fluid type scale, 1440px container)
- Prisma schema and migrations: `Product → ProductVariant → Inventory`,
  `Order → OrderItem`
- Seed data for the 4 real products (Tez, Saumya, Achaari Virasat, Lal
  Tadka), each with weight-based SKUs, pricing and stock
- `POST /api/orders` — validates input, writes an order to the database,
  and returns a ready-to-use WhatsApp deep link
- `GET /api/health`
- `/admin` dashboard showing three stats computed live from the database
- Business-logic layer for products, inventory, orders, WhatsApp
  messaging, and analytics aggregation, independent of any UI
- A small shared UI kit (`Button`, `Container`, `Badge`, `PriceTag`,
  `StatCard`)

**Not built yet:**

- Storefront UI: navbar, product listing/detail pages, cart, and a
  checkout form that actually calls `POST /api/orders` and redirects to
  WhatsApp
- Admin UI: product/inventory/order management tables and CRUD, an
  analytics view beyond the three dashboard stat tiles
- Authentication/access control for `/admin`
- Real product photography (the `public/images/products/` structure
  exists; it's currently empty)
- `lucide-react` is installed for future icon use but nothing imports it yet
