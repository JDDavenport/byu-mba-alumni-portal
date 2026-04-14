-- Alumni profiles table
create table alumni (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique,
  graduation_year int,
  company text,
  title text,
  industry text,
  city text,
  state text,
  lat float,
  lng float,
  linkedin_url text,
  avatar_url text,
  bio text,
  skills text[],
  willing_to_mentor boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Events table
create table events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  date timestamptz not null,
  location text,
  city text,
  state text,
  organizer_id uuid references alumni(id),
  max_attendees int,
  created_at timestamptz default now()
);

-- Event RSVPs
create table event_rsvps (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id),
  alumni_id uuid references alumni(id),
  status text default 'attending',
  created_at timestamptz default now(),
  unique(event_id, alumni_id)
);

-- Mentorship connections
create table mentorship_connections (
  id uuid primary key default gen_random_uuid(),
  mentor_id uuid references alumni(id),
  mentee_id uuid references alumni(id),
  status text default 'pending',
  message text,
  created_at timestamptz default now()
);

-- Job postings
create table jobs (
  id uuid primary key default gen_random_uuid(),
  posted_by uuid references alumni(id),
  title text not null,
  company text not null,
  description text,
  location text,
  url text,
  created_at timestamptz default now()
);

-- Enable RLS
alter table alumni enable row level security;
alter table events enable row level security;
alter table event_rsvps enable row level security;
alter table mentorship_connections enable row level security;
alter table jobs enable row level security;

-- Public read for alumni directory
create policy "Alumni profiles are viewable by everyone" on alumni for select using (true);
create policy "Events are viewable by everyone" on events for select using (true);
create policy "Jobs are viewable by everyone" on jobs for select using (true);
