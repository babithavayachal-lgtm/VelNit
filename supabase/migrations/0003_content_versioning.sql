-- VelNit Life — content_items version history.
--
-- Phase B's original schema treated "regenerating" or "revising" a draft
-- as an in-place overwrite (content_items has a unique index on
-- (brief_id, content_type), so only one row per format can exist). That
-- was fine for the first generation pass, but it means Version 1's exact
-- text was lost the moment Version 2 replaced it - there was no way to
-- compare versions side by side.
--
-- This migration adds content_item_revisions: an append-only snapshot
-- table. Before any update overwrites a content_items row, the row's
-- current state is copied here first, along with a human-readable
-- explanation of what's about to change and why. content_items always
-- holds the current/latest version; content_item_revisions holds every
-- version that came before it.
--
-- Run in the Supabase SQL editor after 0001_init.sql and
-- 0002_content_os.sql. Safe to re-run.

create table if not exists public.content_item_revisions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  content_item_id uuid not null references public.content_items (id) on delete cascade,
  version integer not null,
  title text not null,
  body text not null,
  status text not null,
  talk_stage text,
  vrif_pillars text[] not null default '{}',
  knowledge_reference_ids uuid[] not null default '{}',
  prompt_version text,
  review_score numeric,
  review_notes text,
  generation_error text,
  revision_summary text,
  changed_by uuid references public.founders (id) on delete set null
);

create index if not exists content_item_revisions_item_idx
  on public.content_item_revisions (content_item_id, version);

alter table public.content_item_revisions enable row level security;

drop policy if exists "Founders manage content item revisions" on public.content_item_revisions;
create policy "Founders manage content item revisions"
  on public.content_item_revisions for all
  to authenticated
  using (public.is_founder())
  with check (public.is_founder());
