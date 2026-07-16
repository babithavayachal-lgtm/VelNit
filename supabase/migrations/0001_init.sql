-- VelNit Life — Phase 1 schema
-- Public marketing site data layer: beta signups, newsletter, contact,
-- and a Supabase-backed blog (categories, tags, authors, posts).
--
-- Run this once in the Supabase SQL editor (or via `supabase db push`
-- if you have the CLI linked to this project). Safe to re-run: every
-- statement is guarded with IF NOT EXISTS / OR REPLACE where possible.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- Lead capture tables
-- ---------------------------------------------------------------------

create table if not exists public.beta_signups (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  email text not null unique,
  role text,
  reason text,
  source text,
  status text not null default 'pending' check (status in ('pending', 'invited', 'active'))
);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null unique,
  status text not null default 'subscribed' check (status in ('subscribed', 'unsubscribed')),
  source text
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  status text not null default 'new' check (status in ('new', 'read', 'archived'))
);

-- ---------------------------------------------------------------------
-- Content management (blog)
-- ---------------------------------------------------------------------

create table if not exists public.authors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  avatar_url text,
  bio text
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique
);

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null,
  featured_image text,
  author_id uuid references public.authors (id) on delete set null,
  category_id uuid references public.categories (id) on delete set null,
  seo_title text,
  seo_description text,
  status text not null default 'draft' check (status in ('draft', 'published', 'scheduled')),
  published_at timestamptz,
  scheduled_at timestamptz
);

create table if not exists public.blog_posts_tags (
  post_id uuid not null references public.blog_posts (id) on delete cascade,
  tag_id uuid not null references public.tags (id) on delete cascade,
  primary key (post_id, tag_id)
);

create index if not exists blog_posts_status_published_idx
  on public.blog_posts (status, published_at desc);
create index if not exists blog_posts_category_idx on public.blog_posts (category_id);
create index if not exists beta_signups_email_idx on public.beta_signups (email);
create index if not exists newsletter_email_idx on public.newsletter_subscribers (email);

-- ---------------------------------------------------------------------
-- updated_at trigger for blog_posts
-- ---------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists blog_posts_set_updated_at on public.blog_posts;
create trigger blog_posts_set_updated_at
  before update on public.blog_posts
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------

alter table public.beta_signups enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.contact_messages enable row level security;
alter table public.authors enable row level security;
alter table public.categories enable row level security;
alter table public.tags enable row level security;
alter table public.blog_posts enable row level security;
alter table public.blog_posts_tags enable row level security;

-- Public can submit a beta signup, but never read/update/delete existing ones.
drop policy if exists "Public can submit beta signup" on public.beta_signups;
create policy "Public can submit beta signup"
  on public.beta_signups for insert
  to anon, authenticated
  with check (true);

-- Public can subscribe to the newsletter only.
drop policy if exists "Public can subscribe to newsletter" on public.newsletter_subscribers;
create policy "Public can subscribe to newsletter"
  on public.newsletter_subscribers for insert
  to anon, authenticated
  with check (true);

-- Public can send a contact message only.
drop policy if exists "Public can send contact message" on public.contact_messages;
create policy "Public can send contact message"
  on public.contact_messages for insert
  to anon, authenticated
  with check (true);

-- Blog content: anyone can read published posts and their taxonomy.
drop policy if exists "Public can read authors" on public.authors;
create policy "Public can read authors" on public.authors for select to anon, authenticated using (true);

drop policy if exists "Public can read categories" on public.categories;
create policy "Public can read categories" on public.categories for select to anon, authenticated using (true);

drop policy if exists "Public can read tags" on public.tags;
create policy "Public can read tags" on public.tags for select to anon, authenticated using (true);

drop policy if exists "Public can read published posts" on public.blog_posts;
create policy "Public can read published posts"
  on public.blog_posts for select
  to anon, authenticated
  using (status = 'published' and published_at <= now());

drop policy if exists "Public can read post tags" on public.blog_posts_tags;
create policy "Public can read post tags"
  on public.blog_posts_tags for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.blog_posts p
      where p.id = post_id and p.status = 'published' and p.published_at <= now()
    )
  );

-- All writes to content + management of leads happen via the service-role
-- key (server-only), which bypasses RLS by design. No further policies
-- are required for the Phase 1 public site.
