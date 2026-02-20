
-- Create households table to group members
create table households (
  id uuid default gen_random_uuid() primary key,
  primary_person_id uuid references profiles(id) on delete cascade not null,
  display_name text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create household_members table for family/dependants
create table household_members (
  id uuid default gen_random_uuid() primary key,
  household_id uuid references households(id) on delete cascade not null,
  first_name text not null,
  last_name text not null,
  relationship text not null check (relationship in ('SPOUSE', 'PARTNER', 'CHILD', 'DEPENDANT', 'OTHER')),
  is_dependent boolean default false,
  lives_with_primary boolean default true,
  date_of_birth date,
  tax_data jsonb default '{}'::jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table households enable row level security;
alter table household_members enable row level security;

-- Policies for households
create policy "Users can view own household" on households
  for select using (primary_person_id = auth.uid());

create policy "Users can insert own household" on households
  for insert with check (primary_person_id = auth.uid());

create policy "Users can update own household" on households
  for update using (primary_person_id = auth.uid());

-- Policies for household_members
-- Members are accessible if the user owns the parent household
create policy "Users can view own household members" on household_members
  for select using (
    exists (
      select 1 from households
      where households.id = household_members.household_id
      and households.primary_person_id = auth.uid()
    )
  );

create policy "Users can insert own household members" on household_members
  for insert with check (
    exists (
      select 1 from households
      where households.id = household_members.household_id
      and households.primary_person_id = auth.uid()
    )
  );

create policy "Users can update own household members" on household_members
  for update using (
    exists (
      select 1 from households
      where households.id = household_members.household_id
      and households.primary_person_id = auth.uid()
    )
  );

create policy "Users can delete own household members" on household_members
  for delete using (
    exists (
      select 1 from households
      where households.id = household_members.household_id
      and households.primary_person_id = auth.uid()
    )
  );
