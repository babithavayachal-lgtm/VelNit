# Environment Variables

Copy `.env.example` to `.env.local` for local development. Set the same
variables in Netlify (Site configuration → Environment variables) for
Preview and Production deploys.

| Variable | Required | Where it's used | Description |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Yes | Client + Server | Canonical site URL used for metadata, Open Graph tags, JSON-LD and the sitemap. Use `http://localhost:3000` locally and your production domain on Netlify. |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Client + Server | Your Supabase project URL, e.g. `https://xxxxx.supabase.co`. Found in Project Settings → API. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Yes | Client + Server | The modern Supabase **publishable** key (`sb_publishable_...`), or the legacy anon key if your project hasn't migrated yet. Safe to expose to the browser — access is controlled by Row Level Security, not by keeping this secret. |
| `SUPABASE_SECRET_KEY` | No (Phase 2+) | Server only | The Supabase **secret** key (`sb_secret_...`) or legacy `service_role` key. Bypasses Row Level Security. Not required for Phase 1 — the public site only performs inserts that Row Level Security already allows anonymously (beta signups, newsletter, contact). Reserved for future admin/CMS tooling. **Never** prefix this with `NEXT_PUBLIC_` or expose it to the browser. |
| `RESEND_API_KEY` | No | Server only | Enables transactional email (beta confirmation, contact form notification) via [Resend](https://resend.com). Forms work fully without it — email sending is simply skipped and logged. |
| `RESEND_FROM_EMAIL` | No | Server only | The "from" address used for transactional email, e.g. `VelNit Life <hello@velnit.life>`. Must be a verified domain/sender in Resend. |
| `AI_PROVIDER` | No | Server only | Which AI provider service (`lib/ai/provider.ts`) to use for Content OS draft generation in `/studio`. Currently only `anthropic` is implemented; defaults to `anthropic`. |
| `ANTHROPIC_API_KEY` | No (required to generate drafts) | Server only | API key for Anthropic's Messages API. Without it, `/studio` still works fully - founders can create ideas, briefs, and manually write or edit drafts - only the "Generate 4 drafts" button is disabled. **Never** prefix this with `NEXT_PUBLIC_`. |
| `ANTHROPIC_MODEL` | No (required to generate drafts) | Server only | The specific Claude model string your Anthropic account has access to. Deliberately has no hardcoded default - model availability changes over time, so this must be set explicitly rather than guessed. |

## Notes on Supabase key naming

Supabase is migrating from the legacy `anon` / `service_role` key pair to
new `publishable` / `secret` keys. Both naming schemes are read by this app
(see `lib/supabase/env.ts`), preferring the modern names:

- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` falls back to `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SECRET_KEY` falls back to `SUPABASE_SERVICE_ROLE_KEY`

## What happens if Supabase isn't configured?

The site still builds and runs. Forms will validate and appear to submit
successfully (so the UI can be reviewed end-to-end), but nothing is
persisted, and a warning is logged server-side. The blog will show an
empty state pointing back to this documentation.


## Content Operating System (Phase B)

Draft generation in `/studio` is grounded in the four Brain documents
under `brain/*.md` (VRIF, TALK, Writing DNA, Knowledge Graph), compiled
into `lib/ai/brain-content.generated.ts` by `npm run generate:brain`
(also run automatically before every `npm run build` via the `prebuild`
script). If you edit anything in `brain/`, run `npm run generate:brain`
and commit the regenerated file alongside your change - see
`brain/README.md`.

`/studio` itself is gated by founder authentication (Supabase Auth plus
membership in the `founders` table), independent of whether AI generation
is configured - see [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) steps 6-9.
