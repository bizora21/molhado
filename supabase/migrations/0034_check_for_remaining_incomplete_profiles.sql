-- Let's check if there are still incomplete profiles
SELECT 
  user_id,
  user_type,
  full_name,
  store_name,
  store_category,
  store_description,
  store_opening_hours,
  store_whatsapp,
  professional_name,
  professional_profession,
  professional_category,
  professional_description,
  professional_whatsapp
FROM profiles 
WHERE 
  user_type IN ('vendedor', 'prestador')
  AND (
    (user_type = 'vendedor' AND (store_name IS NULL OR store_category IS NULL OR store_description IS NULL OR store_opening_hours IS NULL OR store_whatsapp IS NULL))
    OR
    (user_type = 'prestador' AND (professional_name IS NULL OR professional_profession IS NULL OR professional_category IS NULL OR professional_description IS NULL OR professional_whatsapp IS NULL))
  )
LIMIT 10;