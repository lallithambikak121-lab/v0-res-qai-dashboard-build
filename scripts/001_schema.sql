-- Create profiles table for user metadata
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
create policy "profiles_delete_own" on public.profiles for delete using (auth.uid() = id);

-- Create weather_data table
create table if not exists public.weather_data (
  id uuid primary key default gen_random_uuid(),
  location text not null,
  temperature numeric,
  humidity numeric,
  wind_speed numeric,
  wind_direction text,
  precipitation numeric,
  visibility numeric,
  pressure numeric,
  condition text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

alter table public.weather_data enable row level security;

create policy "weather_select_all" on public.weather_data for select using (true);
create policy "weather_insert_all" on public.weather_data for insert with check (true);
create policy "weather_update_all" on public.weather_data for update using (true);
create policy "weather_delete_all" on public.weather_data for delete using (true);

-- Create alerts table
create table if not exists public.alerts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  severity text not null check (severity in ('low', 'medium', 'high', 'critical')),
  location text not null,
  status text default 'active' check (status in ('active', 'resolved', 'archived')),
  alert_type text,
  affected_population numeric,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

alter table public.alerts enable row level security;

create policy "alerts_select_all" on public.alerts for select using (true);
create policy "alerts_insert_all" on public.alerts for insert with check (true);
create policy "alerts_update_all" on public.alerts for update using (true);
create policy "alerts_delete_all" on public.alerts for delete using (true);

-- Create resources table
create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  resource_type text not null check (resource_type in ('shelter', 'medical', 'vehicle', 'supplies', 'personnel', 'equipment')),
  location text,
  status text default 'available' check (status in ('available', 'deployed', 'maintenance', 'unavailable')),
  capacity numeric,
  current_utilization numeric,
  contact_person text,
  contact_phone text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

alter table public.resources enable row level security;

create policy "resources_select_all" on public.resources for select using (true);
create policy "resources_insert_all" on public.resources for insert with check (true);
create policy "resources_update_all" on public.resources for update using (true);
create policy "resources_delete_all" on public.resources for delete using (true);

-- Create risk_assessments table
create table if not exists public.risk_assessments (
  id uuid primary key default gen_random_uuid(),
  state text not null,
  risk_level text not null check (risk_level in ('low', 'medium', 'high', 'critical')),
  risk_score numeric not null,
  contributing_factors text[],
  timestamp timestamp default now(),
  updated_at timestamp default now()
);

alter table public.risk_assessments enable row level security;

create policy "risk_assessments_select_all" on public.risk_assessments for select using (true);
create policy "risk_assessments_insert_all" on public.risk_assessments for insert with check (true);
create policy "risk_assessments_update_all" on public.risk_assessments for update using (true);
create policy "risk_assessments_delete_all" on public.risk_assessments for delete using (true);

-- Create action_plans table
create table if not exists public.action_plans (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  location text,
  status text default 'pending' check (status in ('pending', 'in_progress', 'completed', 'cancelled')),
  priority text check (priority in ('low', 'medium', 'high', 'critical')),
  steps text[],
  assigned_to uuid references public.profiles(id),
  created_at timestamp default now(),
  updated_at timestamp default now()
);

alter table public.action_plans enable row level security;

create policy "action_plans_select_all" on public.action_plans for select using (true);
create policy "action_plans_insert_all" on public.action_plans for insert with check (true);
create policy "action_plans_update_all" on public.action_plans for update using (true);
create policy "action_plans_delete_all" on public.action_plans for delete using (true);

-- Create indexes for better query performance
create index if not exists idx_weather_location on public.weather_data(location);
create index if not exists idx_weather_created on public.weather_data(created_at desc);
create index if not exists idx_alerts_location on public.alerts(location);
create index if not exists idx_alerts_severity on public.alerts(severity);
create index if not exists idx_alerts_status on public.alerts(status);
create index if not exists idx_alerts_created on public.alerts(created_at desc);
create index if not exists idx_resources_type on public.resources(resource_type);
create index if not exists idx_resources_status on public.resources(status);
create index if not exists idx_risk_state on public.risk_assessments(state);
create index if not exists idx_risk_updated on public.risk_assessments(updated_at desc);
create index if not exists idx_action_plans_status on public.action_plans(status);
create index if not exists idx_action_plans_assigned on public.action_plans(assigned_to);
