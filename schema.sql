-- Run in Supabase Dashboard -> SQL Editor.
-- Simulation data is user-owned. Never put a service-role key in the browser.
create table if not exists public.simulations (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.simulations enable row level security;

drop policy if exists "Users can read their own simulation" on public.simulations;
create policy "Users can read their own simulation"
on public.simulations for select to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert their own simulation" on public.simulations;
create policy "Users can insert their own simulation"
on public.simulations for insert to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update their own simulation" on public.simulations;
create policy "Users can update their own simulation"
on public.simulations for update to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

grant select, insert, update on public.simulations to authenticated;
