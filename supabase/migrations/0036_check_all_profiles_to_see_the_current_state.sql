-- Check all profiles to see the current state
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
  professional_name,
  professional_profession,
  professional_category,
  professional_description,
  professional_whatsapp,
  professional_home_service,
  professional_service_radius_km,
  professional_hourly_rate,
  professional_min_price,
  professional_experience_years,
  updated_at
FROM profiles 
WHERE user_type IN ('vendedor', 'prestador')
ORDER BY updated_at DESC
LIMIT 5;