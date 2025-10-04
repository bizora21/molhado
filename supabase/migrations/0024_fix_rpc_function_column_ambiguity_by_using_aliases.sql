-- Drop and recreate the RPC function with proper aliases to avoid column ambiguity
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
AS $$
BEGIN
    -- Insert the profile and return the created record
    -- Using aliases to avoid column name ambiguity
    RETURN QUERY
    INSERT INTO profiles (
        user_id,
        full_name,
        phone,
        address,
        user_type,
        role
    )
    VALUES (
        p_user_id,
        p_full_name,
        p_phone,
        p_address,
        p_user_type,
        p_role
    )
    RETURNING 
        id,
        user_id,
        full_name,
        phone,
        address,
        user_type,
        role;
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION create_profile TO authenticated;