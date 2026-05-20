-- RLS para todas as tabelas de utilizador

alter table public.projects enable row level security;
alter table public.flows enable row level security;
alter table public.flow_steps enable row level security;
alter table public.flow_edges enable row level security;
alter table public.task_dependencies enable row level security;
alter table public.note_links enable row level security;
alter table public.gamification_events enable row level security;
alter table public.goals enable row level security;

drop policy if exists "projects_own" on public.projects;
create policy "projects_own" on public.projects
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "flows_own" on public.flows;
create policy "flows_own" on public.flows
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "flow_steps_own" on public.flow_steps;
create policy "flow_steps_own" on public.flow_steps
  for all using (
    exists (select 1 from public.flows f where f.id = flow_id and f.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.flows f where f.id = flow_id and f.user_id = auth.uid())
  );

drop policy if exists "flow_edges_own" on public.flow_edges;
create policy "flow_edges_own" on public.flow_edges
  for all using (
    exists (select 1 from public.flows f where f.id = flow_id and f.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.flows f where f.id = flow_id and f.user_id = auth.uid())
  );

drop policy if exists "notes_own" on public.notes;
create policy "notes_own" on public.notes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "companies_own" on public.companies;
create policy "companies_own" on public.companies
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "goals_own" on public.goals;
create policy "goals_own" on public.goals
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "gamification_own" on public.gamification_events;
create policy "gamification_own" on public.gamification_events
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "task_deps_own" on public.task_dependencies;
create policy "task_deps_own" on public.task_dependencies
  for all using (
    exists (select 1 from public.tasks t where t.id = task_id and t.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.tasks t where t.id = task_id and t.user_id = auth.uid())
  );

drop policy if exists "note_links_own" on public.note_links;
create policy "note_links_own" on public.note_links
  for all using (
    exists (select 1 from public.notes n where n.id = from_note_id and n.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.notes n where n.id = from_note_id and n.user_id = auth.uid())
  );
