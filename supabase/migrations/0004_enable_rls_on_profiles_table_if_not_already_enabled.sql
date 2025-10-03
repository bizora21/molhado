DO $$
BEGIN
    -- Enable RLS if not already enabled
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'profiles' AND rowsecurity = true) THEN
        ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;