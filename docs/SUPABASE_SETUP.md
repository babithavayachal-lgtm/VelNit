# Supabase Setup

## 1. Create a project

Create a project at [supabase.com](https://supabase.com) if you don't have
one, then grab your project URL and publishable key from
**Project Settings → API**.

## 2. Run the schema migration

Open the **SQL Editor** in your Supabase dashboard and run the contents of:

```
supabase/migrations/0001_init.sql
```

This creates:

- `beta_signups`, `newsletter_subscribers`, `contact_messages` — lead
  capture tables for the Phase 1 forms.
- `authors`, `categories`, `tags`, `blog_posts`, `blog_posts_tags` — the
  Supabase-backed blog content model (Markdown body, SEO fields, draft /
  published / scheduled status).
- Row Level Security policies allowing anonymous **inserts** on the three
  lead-capture tables, and anonymous **reads** of published blog content
  only. No other access is granted to the public key — all other
  management happens server-side with elevated credentials in later
  phases.

The migration is idempotent (safe to re-run).

## 3. (Optional) Seed demo blog content

To see the blog populated immediately, also run:

```
supabase/seed/seed.sql
```

This inserts one demo author, three categories, three tags and three
published articles.

## 4. Configure environment variables

See [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md). At minimum you
need `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

## 5. Regenerating types

`types/database.ts` is currently hand-written to mirror the SQL schema
above. Once you have the Supabase CLI linked to this project, you can
regenerate it automatically:

```bash
supabase gen types typescript --project-id <your-project-ref> > types/database.ts
```

The rest of the codebase imports the `Database` type (not individual table
shapes), so regenerating this file is a drop-in replacement.
