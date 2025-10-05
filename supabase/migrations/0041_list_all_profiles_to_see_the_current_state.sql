-- List all profiles to see the current state
SELECT 
  user_id,
  user_type,
  full_name,
  phone,
  store_name,
  store_category,
  store_description,
  store_whatsapp,
  professional_name,
  professional_profession,
  professional_category,
  professional_description,
  professional_whatsapp,
  updated_at
FROM profiles 
WHERE user_type IN ('vendedor', 'prestador')
ORDER BY updated_at DESC
LIMIT 10;