-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  email text,
  first_name text,
  last_name text,
  phone text,
  enrollment_status text default 'pending',
  tax_data jsonb,
  
  constraint username_length check (char_length(first_name) >= 3)
);

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security
alter table profiles enable row level security;

create policy "Users can view own profile." on profiles
  for select using ((select auth.uid()) = id);

create policy "Users can insert their own profile." on profiles
  for insert with check ((select auth.uid()) = id);

create policy "Users can update own profile." on profiles
  for update using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, first_name, last_name, phone)
  values (
    new.id,
    new.email,
    nullif(new.raw_user_meta_data->>'first_name', ''),
    nullif(new.raw_user_meta_data->>'last_name', ''),
    nullif(new.raw_user_meta_data->>'phone', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create a table for tracking login attempts
create table login_attempts (
  email text primary key,
  count int default 0,
  last_attempt timestamp with time zone default now(),
  locked_until timestamp with time zone
);

alter table login_attempts enable row level security;

-- Only service role (server actions) should access this
create policy "Service role can do all on login_attempts" on login_attempts
  for all
  to service_role
  using (true) with check (true);
