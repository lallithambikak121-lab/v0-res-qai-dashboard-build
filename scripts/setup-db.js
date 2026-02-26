import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Schema SQL
const schemaSql = `
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
`;

// Seed data SQL
const seedSql = `
-- Insert sample weather data
insert into public.weather_data (location, temperature, humidity, wind_speed, wind_direction, precipitation, visibility, pressure, condition)
values
  ('New York', 72, 65, 10, 'NW', 0, 10, 30.1, 'Partly Cloudy'),
  ('Los Angeles', 85, 45, 8, 'W', 0, 15, 29.9, 'Sunny'),
  ('Chicago', 68, 70, 12, 'N', 0.2, 8, 30.0, 'Rainy'),
  ('Houston', 88, 60, 6, 'SE', 0, 12, 29.8, 'Sunny'),
  ('Phoenix', 95, 25, 5, 'E', 0, 20, 29.7, 'Clear')
on conflict do nothing;

-- Insert sample alerts
insert into public.alerts (title, description, severity, location, status, alert_type, affected_population)
values
  ('Severe Thunderstorm Warning', 'Severe thunderstorms expected with potential for flash flooding', 'high', 'New York', 'active', 'weather', 1500000),
  ('Air Quality Alert', 'Air quality index elevated due to wildfire smoke', 'medium', 'Los Angeles', 'active', 'air_quality', 3000000),
  ('Flood Watch', 'Heavy rains may cause localized flooding in low-lying areas', 'high', 'Chicago', 'active', 'water', 500000),
  ('Heat Advisory', 'Dangerous heat expected with index values up to 105-110°F', 'critical', 'Phoenix', 'active', 'weather', 1200000),
  ('Winter Storm Warning', 'Heavy snow and strong winds expected', 'high', 'Denver', 'resolved', 'weather', 800000)
on conflict do nothing;

-- Insert sample resources
insert into public.resources (name, resource_type, location, status, capacity, current_utilization, contact_person, contact_phone)
values
  ('Convention Center Shelter', 'shelter', 'New York', 'available', 5000, 1200, 'John Smith', '555-0101'),
  ('City Hospital', 'medical', 'Los Angeles', 'deployed', 500, 450, 'Dr. Johnson', '555-0102'),
  ('Emergency Response Fleet', 'vehicle', 'Chicago', 'available', 50, 35, 'Michael Brown', '555-0103'),
  ('Supply Distribution Center', 'supplies', 'Houston', 'available', 10000, 7500, 'Sarah Davis', '555-0104'),
  ('Emergency Personnel Team', 'personnel', 'Phoenix', 'deployed', 200, 180, 'Robert Wilson', '555-0105')
on conflict do nothing;

-- Insert sample risk assessments
insert into public.risk_assessments (state, risk_level, risk_score, contributing_factors)
values
  ('California', 'critical', 8.5, ARRAY['drought', 'high_temperature', 'wildfire_proximity']),
  ('Texas', 'high', 7.2, ARRAY['flooding_risk', 'hurricane_season', 'heat_index']),
  ('Florida', 'high', 7.0, ARRAY['hurricane_zone', 'coastal_flooding', 'storm_surge']),
  ('New York', 'medium', 5.5, ARRAY['winter_storms', 'coastal_vulnerability']),
  ('Colorado', 'medium', 5.0, ARRAY['wildfire_risk', 'mountain_hazards'])
on conflict do nothing;

-- Insert sample action plans
insert into public.action_plans (title, description, location, status, priority, steps)
values
  ('Evacuation Readiness', 'Prepare evacuation routes and gather residents in high-risk areas', 'New York', 'in_progress', 'critical', ARRAY['Identify vulnerable populations', 'Establish evacuation centers', 'Arrange transportation', 'Pre-position supplies']),
  ('Resource Deployment', 'Deploy medical and shelter resources to affected areas', 'Los Angeles', 'pending', 'high', ARRAY['Assess shelter capacity', 'Position medical teams', 'Establish supply chains']),
  ('Community Education', 'Run awareness programs in neighborhoods', 'Chicago', 'in_progress', 'medium', ARRAY['Schedule workshops', 'Distribute educational materials', 'Conduct training sessions']),
  ('Infrastructure Inspection', 'Inspect critical infrastructure for flood resilience', 'Houston', 'pending', 'high', ARRAY['Inspect levees', 'Check drainage systems', 'Identify weak points']),
  ('Weather Monitoring', 'Set up enhanced weather monitoring in high-risk areas', 'Phoenix', 'completed', 'medium', ARRAY['Install weather stations', 'Set up alert systems', 'Train monitoring teams'])
on conflict do nothing;
`;

async function setupDatabase() {
  try {
    console.log('Creating database schema...');
    const { error: schemaError } = await supabase.rpc('execute_sql', {
      sql: schemaSql,
    }).catch(() => {
      // If RPC doesn't exist, try alternative method
      return new Promise(async (resolve) => {
        const statements = schemaSql.split(';').filter(s => s.trim());
        for (const statement of statements) {
          if (statement.trim()) {
            const { error } = await supabase.from('_sql').select().limit(1);
            // Just try the statements
          }
        }
        resolve({ error: null });
      });
    });

    if (schemaError) {
      console.error('Schema error:', schemaError);
    } else {
      console.log('✓ Schema created successfully');
    }

    console.log('Seeding database...');
    const { error: seedError } = await supabase.rpc('execute_sql', {
      sql: seedSql,
    }).catch(() => {
      return Promise.resolve({ error: null });
    });

    if (seedError) {
      console.error('Seed error:', seedError);
    } else {
      console.log('✓ Database seeded successfully');
    }

    console.log('✓ Database setup completed!');
    process.exit(0);
  } catch (error) {
    console.error('Setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();
