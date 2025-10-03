DO $$
BEGIN
    -- Enable RLS if not already enabled
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'services' AND rowsecurity = true) THEN
        ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;