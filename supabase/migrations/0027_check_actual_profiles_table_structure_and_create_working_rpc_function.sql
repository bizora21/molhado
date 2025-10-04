-- Check the exact structure of the profiles table
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Create a simple RPC function that works with the actual table structure
DROP FUNCTION IF EXISTS create_profile_simple;

CREATE OR REPLACE FUNCTION create_profile_simple(
    p_user_id UUID,
    p_full_name TEXT,
    p_phone TEXT,
    p_address TEXT,
    p_user_type TEXT DEFAULT 'cliente',
    p_role TEXT DEFAULT 'cliente'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Simple insert without returning complex data
    INSERT INTO profiles (user_id, full_name, phone, address, user_type, role)
    VALUES (p_user_id, p_full_name, p_phone, p_address, p_user_type, p_role);
    
    -- Return true if successful
    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        -- Return false if there's an error
        RETURN FALSE;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION create_profile_simple TO authenticated;

-- Test the function with a simple call
SELECT create_profile_simple(
    '00000000-0000-0000-0000-000000000001'::UUID,
    'Test User',
    '+258840000000',
    'Test Address',
    'cliente',
    'cliente'
);