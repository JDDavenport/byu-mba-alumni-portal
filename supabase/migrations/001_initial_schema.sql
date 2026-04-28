-- ============================================================
-- BYU MBA Alumni Portal — Initial Schema
-- Phase 1: Auth, profiles, PostGIS, RLS, roles
-- ============================================================

-- Enable PostGIS for geographic queries
create extension if not exists postgis;

-- --------------------------------------------------------
-- Roles / user types
-- --------------------------------------------------------
create type user_role as enum ('alumni', 'student', 'admin');

-- --------------------------------------------------------
-- Alumni profiles
-- --------------------------------------------------------
create table alumni (
  id uuid primary key default gen_random_uuid(),

  -- Auth link: Supabase Auth user id
  auth_user_id uuid unique references auth.users(id) on delete set null,

  -- Identity
  first_name text not null,
  last_name text not null,
  name text generated always as (first_name || ' ' || last_name) stored,
  email text unique,
  phone text,
  avatar_url text,
  linkedin_url text,

  -- Academics
  graduation_year int not null,
  degree text not null default 'MBA', -- MBA, EMBA, etc.

  -- Professional
  company text,
  title text,
  industry text,
  bio text,
  skills text[] default '{}',
  career_history jsonb default '[]',
  -- career_history schema: [{ company, title, start_year, end_year? }]

  -- Location (text fields for display)
  city text,
  state text,
  country text default 'US',
  lat double precision,
  lng double precision,

  -- PostGIS geography column — computed from lat/lng or set directly
  location geography(Point, 4326),

  -- Engagement
  willing_to_mentor boolean default false,
  mentor_topics text[] default '{}',
  mentor_availability text, -- 'weekly', 'monthly', 'quarterly'

  -- Privacy controls
  show_in_directory boolean default true,
  show_email boolean default false,
  show_phone boolean default false,

  -- Verification & status
  role user_role default 'alumni',
  byu_email text,
  byu_email_verified boolean default false,
  is_claimed boolean default false, -- false = seeded from registrar, not yet claimed
  is_active boolean default true,

  -- Metadata
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes for common queries
create index idx_alumni_auth_user on alumni(auth_user_id);
create index idx_alumni_graduation_year on alumni(graduation_year);
create index idx_alumni_industry on alumni(industry);
create index idx_alumni_city_state on alumni(city, state);
create index idx_alumni_name on alumni(name);
create index idx_alumni_location on alumni using gist(location);
create index idx_alumni_directory on alumni(show_in_directory, is_active);

-- Auto-compute PostGIS point from lat/lng
create or replace function compute_location()
returns trigger as $$
begin
  if NEW.lat is not null and NEW.lng is not null then
    NEW.location := ST_SetSRID(ST_MakePoint(NEW.lng, NEW.lat), 4326)::geography;
  end if;
  return NEW;
end;
$$ language plpgsql;

create trigger trg_compute_location
  before insert or update of lat, lng on alumni
  for each row execute function compute_location();

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  NEW.updated_at := now();
  return NEW;
end;
$$ language plpgsql;

create trigger trg_alumni_updated_at
  before update on alumni
  for each row execute function update_updated_at();

-- --------------------------------------------------------
-- Events
-- --------------------------------------------------------
create table events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  event_date timestamptz not null,
  end_date timestamptz,
  location text,
  city text,
  state text,
  event_type text, -- 'networking', 'reunion', 'workshop', 'social'
  chapter text, -- geographic chapter: 'NYC', 'SF Bay', etc.
  organizer_id uuid references alumni(id) on delete set null,
  max_attendees int,
  is_published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger trg_events_updated_at
  before update on events
  for each row execute function update_updated_at();

-- --------------------------------------------------------
-- Event RSVPs
-- --------------------------------------------------------
create table event_rsvps (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  alumni_id uuid references alumni(id) on delete cascade,
  status text default 'attending', -- 'attending', 'maybe', 'cancelled'
  created_at timestamptz default now(),
  unique(event_id, alumni_id)
);

-- --------------------------------------------------------
-- Mentorship connections
-- --------------------------------------------------------
create table mentorship_connections (
  id uuid primary key default gen_random_uuid(),
  mentor_id uuid references alumni(id) on delete cascade,
  mentee_id uuid references alumni(id) on delete cascade,
  status text default 'pending', -- 'pending', 'accepted', 'declined', 'completed'
  message text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger trg_mentorship_updated_at
  before update on mentorship_connections
  for each row execute function update_updated_at();

-- --------------------------------------------------------
-- Job postings
-- --------------------------------------------------------
create table jobs (
  id uuid primary key default gen_random_uuid(),
  posted_by uuid references alumni(id) on delete set null,
  title text not null,
  company text not null,
  description text,
  location text,
  industry text,
  url text,
  referral_available boolean default false,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger trg_jobs_updated_at
  before update on jobs
  for each row execute function update_updated_at();

-- --------------------------------------------------------
-- Admin audit log (tracks admin actions)
-- --------------------------------------------------------
create table admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid references alumni(id) on delete set null,
  action text not null, -- 'deactivate_user', 'approve_user', 'edit_event', etc.
  target_table text,
  target_id uuid,
  details jsonb default '{}',
  created_at timestamptz default now()
);

-- --------------------------------------------------------
-- Row Level Security
-- --------------------------------------------------------

-- Alumni
alter table alumni enable row level security;

-- Anyone can read directory-visible, active profiles
create policy "Public can view active directory profiles"
  on alumni for select
  using (show_in_directory = true and is_active = true);

-- Authenticated users can also view all active profiles (even hidden ones won't show sensitive fields — handled in API)
-- This broader policy lets admins see everything
create policy "Admins can view all profiles"
  on alumni for select
  using (
    exists (
      select 1 from alumni a
      where a.auth_user_id = auth.uid() and a.role = 'admin'
    )
  );

-- Users can update their own profile
create policy "Users can update own profile"
  on alumni for update
  using (auth_user_id = auth.uid())
  with check (auth_user_id = auth.uid());

-- Users can insert their own profile (registration)
create policy "Users can insert own profile"
  on alumni for insert
  with check (auth_user_id = auth.uid());

-- Admins can update any profile
create policy "Admins can update any profile"
  on alumni for update
  using (
    exists (
      select 1 from alumni a
      where a.auth_user_id = auth.uid() and a.role = 'admin'
    )
  );

-- Admins can insert profiles (for CSV import / seeding)
create policy "Admins can insert profiles"
  on alumni for insert
  with check (
    exists (
      select 1 from alumni a
      where a.auth_user_id = auth.uid() and a.role = 'admin'
    )
  );

-- Events
alter table events enable row level security;

create policy "Events are viewable by everyone"
  on events for select
  using (is_published = true);

create policy "Admins can manage events"
  on events for all
  using (
    exists (
      select 1 from alumni a
      where a.auth_user_id = auth.uid() and a.role = 'admin'
    )
  );

create policy "Organizers can update own events"
  on events for update
  using (
    organizer_id = (
      select id from alumni where auth_user_id = auth.uid()
    )
  );

-- Event RSVPs
alter table event_rsvps enable row level security;

create policy "RSVPs are viewable by everyone"
  on event_rsvps for select
  using (true);

create policy "Users can manage own RSVPs"
  on event_rsvps for all
  using (
    alumni_id = (
      select id from alumni where auth_user_id = auth.uid()
    )
  );

-- Mentorship connections
alter table mentorship_connections enable row level security;

create policy "Users can view own mentorship connections"
  on mentorship_connections for select
  using (
    mentor_id = (select id from alumni where auth_user_id = auth.uid())
    or mentee_id = (select id from alumni where auth_user_id = auth.uid())
  );

create policy "Users can create mentorship requests"
  on mentorship_connections for insert
  with check (
    mentee_id = (select id from alumni where auth_user_id = auth.uid())
  );

create policy "Mentors can update connection status"
  on mentorship_connections for update
  using (
    mentor_id = (select id from alumni where auth_user_id = auth.uid())
  );

-- Jobs
alter table jobs enable row level security;

create policy "Jobs are viewable by everyone"
  on jobs for select
  using (is_active = true);

create policy "Users can post jobs"
  on jobs for insert
  with check (
    posted_by = (select id from alumni where auth_user_id = auth.uid())
  );

create policy "Users can update own jobs"
  on jobs for update
  using (
    posted_by = (select id from alumni where auth_user_id = auth.uid())
  );

-- Admin audit log
alter table admin_audit_log enable row level security;

create policy "Admins can view audit log"
  on admin_audit_log for select
  using (
    exists (
      select 1 from alumni a
      where a.auth_user_id = auth.uid() and a.role = 'admin'
    )
  );

create policy "Admins can insert audit entries"
  on admin_audit_log for insert
  with check (
    exists (
      select 1 from alumni a
      where a.auth_user_id = auth.uid() and a.role = 'admin'
    )
  );

-- --------------------------------------------------------
-- Storage bucket for profile photos
-- --------------------------------------------------------
-- Run in Supabase dashboard or via API:
-- insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);

-- Storage policies (run after bucket creation):
-- create policy "Anyone can view avatars"
--   on storage.objects for select
--   using (bucket_id = 'avatars');
--
-- create policy "Authenticated users can upload avatars"
--   on storage.objects for insert
--   with check (bucket_id = 'avatars' and auth.role() = 'authenticated');
--
-- create policy "Users can update own avatar"
--   on storage.objects for update
--   using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
