-- VelNit Neon foundation: Better Auth + operational data only.
-- Blog articles live in content/blog and are deployed from Git.
create extension if not exists pgcrypto;

create table if not exists "user" (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  "emailVerified" boolean not null default false,
  image text,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists session (
  id uuid primary key default gen_random_uuid(),
  "userId" uuid not null references "user"(id) on delete cascade,
  token text not null unique,
  "expiresAt" timestamptz not null,
  "ipAddress" text,
  "userAgent" text,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);
create index if not exists session_user_id_idx on session ("userId");

create table if not exists account (
  id uuid primary key default gen_random_uuid(),
  "userId" uuid not null references "user"(id) on delete cascade,
  issuer text not null,
  "accountId" text not null,
  "providerId" text not null,
  "accessToken" text,
  "refreshToken" text,
  "accessTokenExpiresAt" timestamptz,
  "refreshTokenExpiresAt" timestamptz,
  scope text,
  "idToken" text,
  password text,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now(),
  unique (issuer, "accountId")
);
create index if not exists account_user_id_idx on account ("userId");

create table if not exists verification (
  id uuid primary key default gen_random_uuid(),
  identifier text not null,
  value text not null,
  "expiresAt" timestamptz not null,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);
create index if not exists verification_identifier_idx on verification (identifier);

do $$ begin create type lead_status as enum ('pending', 'invited', 'active');
exception when duplicate_object then null; end $$;
do $$ begin create type subscription_status as enum ('subscribed', 'unsubscribed');
exception when duplicate_object then null; end $$;
do $$ begin create type message_status as enum ('new', 'read', 'archived');
exception when duplicate_object then null; end $$;
do $$ begin create type content_status as enum (
  'idea', 'brief_ready', 'generating', 'draft', 'needs_revision',
  'approved', 'scheduled', 'published', 'archived'
); exception when duplicate_object then null; end $$;

create table if not exists beta_signups (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  email text not null unique,
  role text,
  reason text,
  source text,
  status lead_status not null default 'pending'
);

create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null unique,
  status subscription_status not null default 'subscribed',
  source text
);

create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  status message_status not null default 'new'
);

create table if not exists knowledge_references (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  source_document text not null,
  section text,
  concept text not null,
  summary text not null,
  url text
);

create table if not exists content_ideas (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references "user"(id) on delete set null,
  topic text not null,
  audience text not null,
  notes text,
  status content_status not null default 'idea'
);

create table if not exists content_briefs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  idea_id uuid not null references content_ideas(id) on delete cascade,
  created_by uuid references "user"(id) on delete set null,
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
create index if not exists content_briefs_idea_idx on content_briefs(idea_id);

create table if not exists content_items (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  brief_id uuid not null references content_briefs(id) on delete cascade,
  created_by uuid references "user"(id) on delete set null,
  content_type text not null check (content_type in ('article','facebook','newsletter','reel')),
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
  published_at timestamptz,
  unique (brief_id, content_type)
);
create index if not exists content_items_status_idx on content_items(status);

create table if not exists content_reviews (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  content_item_id uuid not null references content_items(id) on delete cascade,
  reviewer_id uuid references "user"(id) on delete set null,
  decision text not null check (decision in ('approved','needs_revision')),
  score numeric,
  notes text
);

create table if not exists publication_jobs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  content_item_id uuid not null references content_items(id) on delete cascade,
  channel text not null,
  status content_status not null default 'approved',
  scheduled_at timestamptz,
  published_at timestamptz,
  notes text
);

create table if not exists content_item_revisions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  content_item_id uuid not null references content_items(id) on delete cascade,
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
  changed_by uuid references "user"(id) on delete set null
);
create index if not exists content_item_revisions_item_idx on content_item_revisions(content_item_id, version);

create or replace function set_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

drop trigger if exists content_ideas_set_updated_at on content_ideas;
create trigger content_ideas_set_updated_at before update on content_ideas
for each row execute function set_updated_at();
drop trigger if exists content_briefs_set_updated_at on content_briefs;
create trigger content_briefs_set_updated_at before update on content_briefs
for each row execute function set_updated_at();
drop trigger if exists content_items_set_updated_at on content_items;
create trigger content_items_set_updated_at before update on content_items
for each row execute function set_updated_at();
drop trigger if exists publication_jobs_set_updated_at on publication_jobs;
create trigger publication_jobs_set_updated_at before update on publication_jobs
for each row execute function set_updated_at();
