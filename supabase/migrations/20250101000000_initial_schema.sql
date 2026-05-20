-- Cortex OS — schema inicial (Supabase / PostgreSQL)
-- Executar no SQL Editor do projeto Supabase

create extension if not exists "uuid-ossp";

-- Perfis (estende auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  avatar_url text,
  xp integer not null default 0,
  level integer not null default 1,
  streak_days integer not null default 0,
  obsidian_vault_path text,
  obsidian_vault_name text,
  timezone text not null default 'Europe/Lisbon',
  dashboard_layout jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.companies (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  slug text not null,
  description text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, slug)
);

create table public.projects (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  company_id uuid references public.companies(id) on delete set null,
  name text not null,
  slug text not null,
  color text default '#6366f1',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, slug)
);

create table public.flows (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  company_id uuid references public.companies(id) on delete set null,
  name text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.flow_steps (
  id uuid primary key default uuid_generate_v4(),
  flow_id uuid not null references public.flows(id) on delete cascade,
  label text not null,
  position_x float not null default 0,
  position_y float not null default 0,
  sort_order integer not null default 0,
  color text
);

create table public.flow_edges (
  id uuid primary key default uuid_generate_v4(),
  flow_id uuid not null references public.flows(id) on delete cascade,
  from_step_id uuid not null references public.flow_steps(id) on delete cascade,
  to_step_id uuid not null references public.flow_steps(id) on delete cascade
);

create table public.tasks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'todo' check (status in ('todo','in_progress','blocked','done','cancelled')),
  priority text not null default 'medium' check (priority in ('low','medium','high','urgent')),
  due_at timestamptz,
  start_at timestamptz,
  completed_at timestamptz,
  parent_id uuid references public.tasks(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  company_id uuid references public.companies(id) on delete set null,
  flow_id uuid references public.flows(id) on delete set null,
  flow_step_id uuid references public.flow_steps(id) on delete set null,
  obsidian_path text,
  tags text[] not null default '{}',
  estimate_minutes integer,
  spent_minutes integer not null default 0,
  progress smallint not null default 0 check (progress between 0 and 100),
  recurrence_rule text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.task_dependencies (
  id uuid primary key default uuid_generate_v4(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  depends_on_task_id uuid not null references public.tasks(id) on delete cascade,
  unique (task_id, depends_on_task_id)
);

create table public.notes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text not null default '',
  obsidian_path text not null,
  tags text[] not null default '{}',
  company_id uuid references public.companies(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.note_links (
  id uuid primary key default uuid_generate_v4(),
  from_note_id uuid not null references public.notes(id) on delete cascade,
  to_note_id uuid references public.notes(id) on delete cascade,
  to_task_id uuid references public.tasks(id) on delete cascade,
  to_company_id uuid references public.companies(id) on delete cascade,
  link_type text not null default 'wikilink'
);

create table public.gamification_events (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  xp_earned integer not null default 0,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.goals (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  target_value integer not null,
  current_value integer not null default 0,
  unit text not null default 'tasks',
  due_at timestamptz,
  created_at timestamptz not null default now()
);

-- Realtime
alter publication supabase_realtime add table public.tasks;
alter publication supabase_realtime add table public.notes;
alter publication supabase_realtime add table public.profiles;

-- RLS
alter table public.profiles enable row level security;
alter table public.tasks enable row level security;
alter table public.notes enable row level security;
alter table public.companies enable row level security;

create policy "profiles_own" on public.profiles for all using (auth.uid() = id);
create policy "tasks_own" on public.tasks for all using (auth.uid() = user_id);
create policy "notes_own" on public.notes for all using (auth.uid() = user_id);
create policy "companies_own" on public.companies for all using (auth.uid() = user_id);

-- Índices
create index tasks_user_due_idx on public.tasks (user_id, due_at);
create index tasks_user_status_idx on public.tasks (user_id, status);
create index notes_obsidian_path_idx on public.notes (user_id, obsidian_path);
