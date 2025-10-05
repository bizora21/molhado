-- Check the specific user profile to confirm it's complete
SELECT 
  user_id,
  user_type,
  full_name,
  phone,
  store_name,
  store_category,
  store_description,
  store_whatsapp,
  store_accepts_delivery,
  store_delivery_radius_km,
  store_delivery_fee,
  professional_name,
  professional_profession,
  professional_category,
  professional_description,
  professional_whatsapp,
  updated_at
FROM profiles 
WHERE user_id = 'a17cd914-2f12-4eac-be22-ca4bf3105bf9';