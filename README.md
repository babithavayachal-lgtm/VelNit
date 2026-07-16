# VelNit Life — Public Marketing Website (Phase 1)

**Relationship Intelligence for Life's Second Chapter.**

VelNit Life is an AI-powered Relationship Intelligence Platform helping
couples, families, caregivers and communities stay emotionally connected
through life's second chapter. This repository contains **Phase 1**: the
public marketing website and its core architecture.

Phase 1 deliberately does **not** include the authenticated SaaS
dashboard, AI companion product, healthcare workflows, or the n8n content
automation system — those are planned for later phases on top of this
foundation.

## What's in Phase 1

- Marketing pages: Home, About, Relationship Intelligence, VelNit Care,
  VelNit Connect, VelNit Companion, Academy, Blog, Contact
- Beta registration and newsletter signup, backed by Supabase
- A Supabase-backed blog (categories, tags, author, search, pagination,
  Markdown content, related posts)
- Responsive navigation and footer
- A clean-architecture, Supabase-ready data layer
- Netlify deployment configuration
- SEO (metadata, sitemap, robots, JSON-LD, Open Graph image), accessibility
  (skip link, semantic landmarks, focus states, labelled forms) and
  performance foundations (self-hosted variable fonts, `next/image`, ISR
  on the blog)

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS, hand-rolled shadcn/ui-style primitives, Framer Motion |
| Data | Supabase (Postgres + Row Level Security) |
| Forms | React Hook Form + Zod |
| Email | Resend (optional, transactional only) |
| Hosting | Netlify (`@netlify/plugin-nextjs`) |

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in your Supabase project details
npm run dev
```

Visit `http://localhost:3000`. See
[docs/SUPABASE_SETUP.md](./docs/SUPABASE_SETUP.md) to provision the
database, and [docs/ENVIRONMENT_VARIABLES.md](./docs/ENVIRONMENT_VARIABLES.md)
for a full list of variables. The site builds and runs even without
Supabase configured — forms and the blog simply degrade gracefully.

### Scripts

```bash
npm run dev         # start the dev server
npm run build        # production build
npm run start        # run the production build locally
npm run lint          # ESLint (next/core-web-vitals + next/typescript)
npm run typecheck   # tsc --noEmit
```

## Project structure

```
app/            Route segments (App Router) — one folder per page
components/     Shared UI: ui/ primitives, layout/ (nav, footer), marketing/
features/       Feature-scoped client code: beta, newsletter, contact, blog
hooks/          Shared React hooks
lib/            Cross-cutting utilities: supabase clients, validation, SEO, constants
services/       Server-side data access (currently: blog reads)
supabase/       SQL migrations and seed data
types/          Shared TypeScript types, including the Supabase `Database` type
content/        Reserved for future static/MDX content
docs/           Project documentation (this folder)
```

This follows clean-architecture separation: `app/` owns routing and
composition only; `features/` owns client-side form state and Server
Actions; `services/` owns Supabase reads used by Server Components;
`lib/` has no dependency on React. UI primitives in `components/ui` are
intentionally dependency-free and reusable across any feature.

## Data layer

Supabase is the system of record for beta signups, newsletter
subscribers, contact messages, and blog content. See:

- `supabase/migrations/0001_init.sql` — schema + Row Level Security
- `supabase/seed/seed.sql` — optional demo blog content
- `types/database.ts` — hand-written types mirroring the schema (see
  the file header for how to regenerate these from the Supabase CLI)
- `lib/supabase/` — three clients: `client.ts` (browser), `server.ts`
  (cookie-aware, for Server Components/Actions), `public.ts`
  (cookie-free, for statically generated/ISR blog pages), and
  `admin.ts` (service-role, reserved for future admin tooling)

Forms use React Hook Form + Zod for validation and call Server Actions in
`features/*/actions.ts`, which insert directly into Supabase under the
public Row Level Security policies — no service-role key is required for
Phase 1 to be fully functional.

## Deployment (Netlify)

This repo includes `netlify.toml`, pre-configured with the official
`@netlify/plugin-nextjs` build plugin, security headers, and a note on
which environment variables to set in the Netlify UI. Connect the repo to
Netlify, set the environment variables from
[docs/ENVIRONMENT_VARIABLES.md](./docs/ENVIRONMENT_VARIABLES.md), and
deploy — no further configuration is required.

## What's next (Phase 2+)

Out of scope for this repository, planned next: Supabase Authentication
(Google + email), the authenticated dashboard (relationship profile,
health dashboard, documents, appointments, tasks, medication, journal,
messages, notifications, AI companion, settings), the VelNit Companion AI
product surface, HeyGen avatar integration, and n8n-driven content
automation (Canva graphics, avatar video, social scheduling).
