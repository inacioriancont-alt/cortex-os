-- Executar após schema.sql no Supabase SQL Editor

-- Perfil automático ao registar
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1), 'Utilizador')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS com WITH CHECK para inserts
drop policy if exists "tasks_own" on public.tasks;
create policy "tasks_own" on public.tasks
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "profiles_own" on public.profiles;
create policy "profiles_own" on public.profiles
  for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Gamificação ao concluir tarefa
create or replace function public.on_task_completed()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'done' and (old.status is distinct from 'done') then
    update public.profiles
    set xp = xp + 25, updated_at = now()
    where id = new.user_id;

    insert into public.gamification_events (user_id, type, xp_earned, payload)
    values (new.user_id, 'task_completed', 25, jsonb_build_object('task_id', new.id));
  end if;
  return new;
end;
$$;

drop trigger if exists task_completed_xp on public.tasks;
create trigger task_completed_xp
  after update on public.tasks
  for each row execute function public.on_task_completed();
