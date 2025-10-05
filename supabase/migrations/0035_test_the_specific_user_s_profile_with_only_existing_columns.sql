-- Test the specific user's profile to verify the fix
SELECT 
  user_id,
  user_type,
  full_name,
  phone,
  store_name,
  store_category,
  store_description,
  store_opening_hours,
  store_whatsapp,
  store_accepts_delivery,
  store_delivery_radius_km,
  store_delivery_fee,
  updated_at
FROM profiles 
WHERE user_id = 'a17cd914-2f12-4eac-be22-ca4bf3105bf9';