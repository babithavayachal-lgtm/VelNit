# Environment Variables

Copy `.env.example` to `.env.local` locally and configure the same values in
Netlify for Preview and Production.

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical public URL (`http://localhost:3000` locally; `https://velnit.com` in production). |
| `DATABASE_URL` | Forms + Studio | Neon pooled PostgreSQL connection string. Server-only. |
| `BETTER_AUTH_SECRET` | Studio | High-entropy secret of at least 32 characters. Server-only. |
| `BETTER_AUTH_URL` | Studio | Auth origin (`http://localhost:3000` locally; `https://velnit.com` in production). |
| `GITHUB_CLIENT_ID` | Studio | GitHub OAuth App client ID. |
| `GITHUB_CLIENT_SECRET` | Studio | GitHub OAuth App secret. Server-only. |
| `FOUNDER_EMAILS` | Studio | Comma-separated GitHub account emails allowed into `/studio`. |
| `RESEND_API_KEY` | No | Enables transactional email. Server-only. |
| `RESEND_FROM_EMAIL` | No | Verified sender used for transactional email. |
| `AI_PROVIDER` | No | Content generation provider; currently `anthropic`. |
| `ANTHROPIC_API_KEY` | Draft generation | Anthropic API key. Server-only. |
| `ANTHROPIC_MODEL` | Draft generation | Explicit Claude model identifier. |

If `DATABASE_URL` is absent, the public site still builds and renders, but
forms are not persisted and Studio cannot authenticate. Blog articles are
stored under `content/blog` and do not require the database.

## Initial setup

1. Run `database/migrations/0001_neon_foundation.sql` in the Neon SQL Editor.
2. Create a GitHub OAuth App. Its production callback URL is
   `https://velnit.com/api/auth/callback/github`.
3. Add all variables above to Netlify, keeping database/auth secrets server-side.
4. Add each founder's GitHub email to `FOUNDER_EMAILS`.

The `/studio` workspace requires both Neon and Better Auth. AI generation is
independent: without Anthropic credentials, founders can still manage ideas,
briefs, reviews, and manual edits.
