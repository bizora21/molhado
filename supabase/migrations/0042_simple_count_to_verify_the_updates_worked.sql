-- Simple count to verify the updates worked
SELECT 
  user_type,
  COUNT(*) as total
FROM profiles 
WHERE user_type IN ('vendedor', 'prestador')
GROUP BY user_type;