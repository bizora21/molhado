-- First, let's check the structure of the profiles table
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check if RLS is enabled on the table
SELECT relrowsecurity 
FROM pg_class 
WHERE relname = 'profiles';

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON profiles;

-- Enable RLS on the table if not already enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies with more flexible conditions
CREATE POLICY "Users can insert their own profile" ON profiles
FOR INSERT TO authenticated
WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view their own profile" ON profiles
FOR SELECT TO authenticated
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own profile" ON profiles
FOR UPDATE TO authenticated
USING (auth.uid()::text = user_id::text)
WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own profile" ON profiles
FOR DELETE TO authenticated
USING (auth.uid()::text = user_id::text);

-- Let's also check if there are any other constraints that might be causing issues
SELECT conname, contype 
FROM pg_constraint 
WHERE conrelid = 'profiles'::regclass;