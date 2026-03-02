-- ============================================================
-- UPDATE Storage RLS Policies for human-readable folder names
-- Folder format is now: FirstName_LastName_uuid/timestamp_file
-- Run this in the Supabase SQL editor
-- ============================================================

-- 1. Drop old storage policies (they checked for exact UUID match)
DROP POLICY IF EXISTS "Users can upload own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can read own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own files" ON storage.objects;

-- 2. New policies: folder must CONTAIN the user's UUID
-- This supports both old format (uuid/) and new format (Name_uuid/)

CREATE POLICY "Users can upload own files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'user-documents'
    AND (storage.foldername(name))[1] LIKE '%' || auth.uid()::text
);

CREATE POLICY "Users can read own files"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'user-documents'
    AND (storage.foldername(name))[1] LIKE '%' || auth.uid()::text
);

CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'user-documents'
    AND (storage.foldername(name))[1] LIKE '%' || auth.uid()::text
);
