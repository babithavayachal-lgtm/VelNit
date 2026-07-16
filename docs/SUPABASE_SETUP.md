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


## 6. Content Operating System (Phase B) - schema migration

Run the second migration in the SQL Editor:

```
supabase/migrations/0002_content_os.sql
```

This creates the founder-only Content Operating System workspace:

- `founders` - the allowlist gating everything below. A Supabase Auth
  account alone is never enough to reach `/studio` - see step 8.
- `content_ideas`, `content_briefs`, `content_items`, `content_reviews`,
  `knowledge_references`, `publication_jobs` - the idea -> brief -> draft
  -> review pipeline described in the README.
- A `content_status` enum (`idea`, `brief_ready`, `generating`, `draft`,
  `needs_revision`, `approved`, `scheduled`, `published`, `archived`).
- Row Level Security restricted entirely to founders - there is no public
  read or write access to any table in this migration, unlike the Phase 1
  lead-capture tables.

Also idempotent (safe to re-run).

## 7. (Optional) Seed the pilot content idea and brief

```
supabase/seed/content_os_seed.sql
```

Seeds a handful of `knowledge_references` drawn from the Brain documents
(`brain/*.md`) and the Phase B pilot idea/brief - "Loneliness after the
children leave home" - so `/studio` has something to generate drafts from
immediately instead of starting completely empty. Safe to re-run.

## 8. Provision a founder

The Content OS workspace at `/studio` is founder-only. Getting in takes
two steps, both one-time:

1. **Create a Supabase Auth account.** In the Supabase dashboard, go to
   **Authentication → Users → Add user** and create an account with the
   founder's email and a password (or invite by email). This is a normal
   Supabase Auth user - it does *not* grant Studio access by itself.
2. **Add that user to the `founders` allowlist.** In the SQL Editor, run:

   ```sql
   insert into public.founders (id, email, full_name)
   values (
     (select id from auth.users where email = 'founder@velnit.life'),
     'founder@velnit.life',
     'Founder Name'
   );
   ```

   Repeat step 2 for each additional founder. Removing Studio access for
   someone is the reverse: `delete from public.founders where email = '...'`.

Once both steps are done, sign in at `/studio/login` with that email and
password.

## 9. AI generation (optional)

`/studio` works fully without this - founders can still create ideas,
briefs, and manually written or edited drafts. Only the "Generate 4
drafts" button needs it. See
[ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md) for
`AI_PROVIDER` / `ANTHROPIC_API_KEY` / `ANTHROPIC_MODEL`.
