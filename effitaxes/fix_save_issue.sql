-- 1. Grant necessary permissions to the authenticated role
GRANT ALL ON TABLE public.profiles TO authenticated;
GRANT ALL ON TABLE public.profiles TO service_role;

-- 2. Ensure Row Level Security is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Drop ALL existing policies to avoid conflicts/corruption
-- Drop old insecure policies if they exist
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;

-- Drop policies we are about to create/update
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;


-- 4. Re-create the Update Policy
-- This allows a user to update their own row.
CREATE POLICY "Users can update own profile."
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 5. Re-create the Insert Policy
-- Allows a user to insert a row for themselves (if it's missing)
CREATE POLICY "Users can insert their own profile."
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- 6. Re-create Select Policy
-- Only the user can see their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- 7. Ensure columns exist (idempotent)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS tax_data jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS enrollment_status text DEFAULT 'pending';
