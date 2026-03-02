-- ============================================================
-- Migration: user_documents table + RLS policies
-- Run this in the Supabase SQL editor
-- ============================================================

-- 1. Table to store document metadata
create table if not exists user_documents (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null,
    file_name text not null,
    storage_path text not null,
    file_size integer,
    mime_type text,
    label text,
    uploaded_at timestamptz default now()
);

-- 2. Enable Row Level Security
alter table user_documents enable row level security;

-- 3. Read: users can only see their own documents
create policy "Read own documents"
    on user_documents for select
    to authenticated
    using (user_id = auth.uid());

-- 4. Insert: WITH CHECK is required for insert policies
create policy "Insert own documents"
    on user_documents for insert
    to authenticated
    with check (user_id = auth.uid());

-- 5. Delete: users can only delete their own documents
create policy "Delete own documents"
    on user_documents for delete
    to authenticated
    using (user_id = auth.uid());

-- Optional: Update (uncomment if you want to allow label edits later)
-- create policy "Update own documents"
--     on user_documents for update
--     to authenticated
--     using (user_id = auth.uid())
--     with check (user_id = auth.uid());

-- ============================================================
-- Storage RLS for the 'user-documents' bucket
-- (Run these if not set via Supabase dashboard)
-- ============================================================

-- Allow authenticated users to upload to their own folder
insert into storage.policies (name, bucket_id, operation, definition)
values (
    'Authenticated users can upload',
    'user-documents',
    'INSERT',
    '(auth.role() = ''authenticated'' AND (storage.foldername(name))[1] = auth.uid()::text)'
)
on conflict do nothing;

-- Allow authenticated users to read their own files
insert into storage.policies (name, bucket_id, operation, definition)
values (
    'Users can read own files',
    'user-documents',
    'SELECT',
    '((storage.foldername(name))[1] = auth.uid()::text)'
)
on conflict do nothing;

-- Allow authenticated users to delete their own files
insert into storage.policies (name, bucket_id, operation, definition)
values (
    'Users can delete own files',
    'user-documents',
    'DELETE',
    '((storage.foldername(name))[1] = auth.uid()::text)'
)
on conflict do nothing;
