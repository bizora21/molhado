-- Check the exact structure of the profiles table
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Create a more robust RPC function
DROP FUNCTION IF EXISTS create_profile;

CREATE OR REPLACE FUNCTION create_profile(
    p_user_id UUID,
    p_full_name TEXT,
    p_phone TEXT,
    p_address TEXT,
    p_user_type TEXT DEFAULT 'cliente',
    p_role TEXT DEFAULT 'cliente'
)
RETURNS TABLE (
    id UUID,
    user_id UUID,
    full_name TEXT,
    phone TEXT,
    address TEXT,
    user_type TEXT,
    role TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Use explicit column references in the RETURNING clause
    RETURN QUERY
    INSERT INTO profiles (user_id, full_name, phone, address, user_type, role)
    VALUES (p_user_id, p_full_name, p_phone, p_address, p_user_type, p_role)
    RETURNING 
        profiles.id,
        profiles.user_id,
        profiles.full_name,
        profiles.phone,
        profiles.address,
        profiles.user_type,
        profiles.role;
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION create_profile TO authenticated;