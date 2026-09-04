# VelNit Life

Relationship Intelligence for Life's Second Chapter.

VelNit is a Next.js 15 application deployed on Netlify. It includes the public
marketing site, a Git-backed SEO blog, and a founder-only Content Operating
System at `/studio`.

## Architecture

| Layer | Choice |
|---|---|
| App | Next.js App Router, React 19, TypeScript |
| Styling | Tailwind CSS, Radix primitives, Framer Motion |
| Database | Neon PostgreSQL via `pg` |
| Founder auth | Better Auth with GitHub OAuth and an email allowlist |
| Blog | MDX files in `content/blog`, statically generated |
| Email | Resend (optional) |
| Content AI | Provider interface in `lib/ai`; Anthropic currently implemented |
| Hosting | Netlify |
| Tests | Vitest |

The public forms persist beta signups, newsletter subscriptions, and contact
messages in Neon. Blog content does not consume database space. The Content OS
stores ideas, briefs, generated drafts, review decisions, revision history, and
future publication-job stubs in Neon. Approval never publishes externally.

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

See [environment variables](docs/ENVIRONMENT_VARIABLES.md). Apply
`database/migrations/0001_neon_foundation.sql` to a fresh Neon database before
using forms or Studio.

## Commands

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm run test
npm run test:watch
npm run generate:brain
```

## Key directories

```text
app/                 Next.js routes, including /studio and the auth API
brain/               Source-of-truth VRIF, TALK, Writing DNA, and Knowledge Graph
components/          Shared UI and layout components
content/blog/        Git-backed MDX articles
database/migrations/ Neon and Better Auth schema
features/            Feature-scoped UI and server actions
lib/auth/            Better Auth configuration and founder authorization
lib/db/              Neon-compatible PostgreSQL pool
services/            Blog and Content OS data access
tests/               Unit tests
```

## Founder Studio

Studio turns an idea into a structured brief and four reviewable draft formats:
article, Facebook post, newsletter, and reel script. Founders can approve,
request revision, edit, and inspect version history. Access requires a valid
GitHub OAuth session whose email appears in `FOUNDER_EMAILS`.

The database migration is rerunnable and defines both Better Auth tables and
the application tables. Secrets must remain in local/Netlify environment
variables and must never be committed.
