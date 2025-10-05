-- Count profiles by type using only existing columns
SELECT 
  user_type,
  COUNT(*) as total_count,
  COUNT(CASE WHEN user_type = 'vendedor' AND store_name IS NOT NULL AND store_category IS NOT NULL AND store_description IS NOT NULL AND store_whatsapp IS NOT NULL THEN 1 END) as complete_vendors,
  COUNT(CASE WHEN user_type = 'prestador' AND professional_name IS NOT NULL AND professional_profession IS NOT NULL AND professional_category IS NOT NULL AND professional_description IS NOT NULL AND professional_whatsapp IS NOT NULL THEN 1 END) as complete_providers
FROM profiles 
WHERE user_type IN ('vendedor', 'prestador')
GROUP BY user_type;