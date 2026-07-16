-- VelNit Life — Phase B: Content Operating System (MVP, review-first, no auto-publish)
--
-- Adds a private, founder-only workspace for turning a content idea into a
-- brief, generating four draft formats against the VelNit Brain (VRIF, TALK,
-- Writing DNA, Knowledge Graph), and reviewing/approving before anything is
-- ever published. Nothing in this migration wires up real publishing -
-- publication_jobs exists as a forward-looking record only.
--
-- Run this in the Supabase SQL editor after 0001_init.sql. Safe to re-run.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- Shared status enum
-- ---------------------------------------------------------------------

do $$
begin
  if not exists (select 1 from pg_type where typname = 'content_status') then
    create type content_status as enum (
      'idea',
      'brief_ready',
      'generating',
      'draft',
      'needs_revision',
      'approved',
      'scheduled',
      'published',
      'archived'
    );
  end if;
end $$;

-- ---------------------------------------------------------------------
-- Founders — the allowlist that gates the entire Content OS workspace.
-- A row here must exist (id = auth.users.id) before that user can read or
-- write anything below. Adding a founder requires the secret key /
-- Supabase dashboard - see docs/SUPABASE_SETUP.md.
-- ---------------------------------------------------------------------

create table if not exists public.founders (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  full_name text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Knowledge references — citable entries drawn from VRIF, TALK, Writing
-- DNA, and the Knowledge Graph documents. Briefs and content items store
-- arrays of ids referencing this table so every draft can show its work.
-- ---------------------------------------------------------------------

create table if not exists public.knowledge_references (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  source_document text not null,
  section text,
  concept text not null,
  summary text not null,
  url text
);

-- ---------------------------------------------------------------------
-- Content ideas
-- ---------------------------------------------------------------------

create table if not exists public.content_ideas (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.founders (id) on delete set null,
  topic text not null,
  audience text not null,
  notes text,
  status content_status not null default 'idea'
);

-- ---------------------------------------------------------------------
-- Content briefs
-- ---------------------------------------------------------------------

create table if not exists public.content_briefs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  idea_id uuid not null references public.content_ideas (id) on delete cascade,
  created_by uuid references public.founders (id) on delete set null,
  topic text not null,
  audience text not null,
  primary_emotion text not null,
  desired_outcome text not null,
  talk_stage text not null,
  vrif_pillars text[] not null default '{}',
  practical_action text not null,
  call_to_action text not null,
  knowledge_reference_ids uuid[] not null default '{}',
  prohibited_claims text,
  status content_status not null default 'brief_ready'
);

create index if not exists content_briefs_idea_idx on public.content_briefs (idea_id);

-- ---------------------------------------------------------------------
-- Content items — one row per generated format (article / facebook /
-- newsletter / reel) for a given brief.
-- ---------------------------------------------------------------------

create table if not exists public.content_items (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  brief_id uuid not null references public.content_briefs (id) on delete cascade,
  created_by uuid references public.founders (id) on delete set null,
  content_type text not null check (content_type in ('article', 'facebook', 'newsletter', 'reel')),
  title text not null,
  body text not null,
  version integer not null default 1,
  status content_status not null default 'draft',
  talk_stage text,
  vrif_pillars text[] not null default '{}',
  knowledge_reference_ids uuid[] not null default '{}',
  prompt_version text,
  review_score numeric,
  review_notes text,
  generation_error text,
  approved_at timestamptz,
  published_at timestamptz
);

create index if not exists content_items_brief_idx on public.content_items (brief_id);
create index if not exists content_items_status_idx on public.content_items (status);
create unique index if not exists content_items_brief_type_idx
  on public.content_items (brief_id, content_type);

-- ---------------------------------------------------------------------
-- Content reviews — an append-only log of review decisions per item.
-- ---------------------------------------------------------------------

create table if not exists public.content_reviews (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  content_item_id uuid not null references public.content_items (id) on delete cascade,
  reviewer_id uuid references public.founders (id) on delete set null,
  decision text not null check (decision in ('approved', 'needs_revision')),
  score numeric,
  notes text
);

create index if not exists content_reviews_item_idx on public.content_reviews (content_item_id);

-- ---------------------------------------------------------------------
-- Publication jobs — forward-looking record only in Phase B. No channel
-- integration exists yet; nothing in this schema advances a job's status
-- automatically. Created (in 'approved' state) when an item is approved,
-- so the shape is ready for Phase C without any code change to the table.
-- ---------------------------------------------------------------------

create table if not exists public.publication_jobs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  content_item_id uuid not null references public.content_items (id) on delete cascade,
  channel text not null,
  status content_status not null default 'approved',
  scheduled_at timestamptz,
  published_at timestamptz,
  notes text
);

create index if not exists publication_jobs_item_idx on public.publication_jobs (content_item_id);

-- ---------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------

drop trigger if exists content_ideas_set_updated_at on public.content_ideas;
create trigger content_ideas_set_updated_at
  before update on public.content_ideas
  for each row execute function public.set_updated_at();

drop trigger if exists content_briefs_set_updated_at on public.content_briefs;
create trigger content_briefs_set_updated_at
  before update on public.content_briefs
  for each row execute function public.set_updated_at();

drop trigger if exists content_items_set_updated_at on public.content_items;
create trigger content_items_set_updated_at
  before update on public.content_items
  for each row execute function public.set_updated_at();

drop trigger if exists publication_jobs_set_updated_at on public.publication_jobs;
create trigger publication_jobs_set_updated_at
  before update on public.publication_jobs
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- Row Level Security — founder-only. Nothing here is public. Unlike the
-- Phase 1 tables, there is no anonymous insert/select policy anywhere in
-- this migration.
-- ---------------------------------------------------------------------

alter table public.founders enable row level security;
alter table public.knowledge_references enable row level security;
alter table public.content_ideas enable row level security;
alter table public.content_briefs enable row level security;
alter table public.content_items enable row level security;
alter table public.content_reviews enable row level security;
alter table public.publication_jobs enable row level security;

create or replace function public.is_founder()
returns boolean as $$
  select exists (
    select 1 from public.founders where founders.id = auth.uid()
  );
$$ language sql stable security definer set search_path = public;

-- founders: a founder can see the founder list (so the UI can show who's
-- who) but cannot self-insert - that always requires the secret key.
drop policy if exists "Founders can read founders" on public.founders;
create policy "Founders can read founders"
  on public.founders for select
  to authenticated
  using (public.is_founder());

drop policy if exists "Founders can read knowledge references" on public.knowledge_references;
create policy "Founders can read knowledge references"
  on public.knowledge_references for select
  to authenticated
  using (public.is_founder());

drop policy if exists "Founders manage content ideas" on public.content_ideas;
create policy "Founders manage content ideas"
  on public.content_ideas for all
  to authenticated
  using (public.is_founder())
  with check (public.is_founder());

drop policy if exists "Founders manage content briefs" on public.content_briefs;
create policy "Founders manage content briefs"
  on public.content_briefs for all
  to authenticated
  using (public.is_founder())
  with check (public.is_founder());

drop policy if exists "Founders manage content items" on public.content_items;
create policy "Founders manage content items"
  on public.content_items for all
  to authenticated
  using (public.is_founder())
  with check (public.is_founder());

drop policy if exists "Founders manage content reviews" on public.content_reviews;
create policy "Founders manage content reviews"
  on public.content_reviews for all
  to authenticated
  using (public.is_founder())
  with check (public.is_founder());

drop policy if exists "Founders manage publication jobs" on public.publication_jobs;
create policy "Founders manage publication jobs"
  on public.publication_jobs for all
  to authenticated
  using (public.is_founder())
  with check (public.is_founder());
