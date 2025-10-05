-- Update incomplete provider profiles with verified existing columns
UPDATE profiles 
SET 
  professional_name = COALESCE(professional_name, full_name || 'Profissional'),
  professional_profession = COALESCE(professional_profession, 'Serviços Gerais'),
  professional_category = COALESCE(professional_category, 'Outros Serviços'),
  professional_description = COALESCE(professional_description, 'Ofereço de serviços profissionais'),
  professional_whatsapp = COALESCE(professional_whatsapp, phone),
  professional_home_service = COALESCE(professional_home_service, true),
  professional_service_radius_km = COALESCE(professional_service_radius_km, 20),
  professional_hourly_rate = COALESCE(professional_hourly_rate, 500),
  professional_min_price = COALESCE(professional_min_price, 1000),
  professional_experience_years = COALESCE(professional_experience_years, 5)
WHERE 
  user_type = 'prestador' 
  AND (
    professional_name IS NULL 
    OR professional_profession IS NULL 
    OR professional_category IS NULL 
    OR professional_description IS NULL 
    OR professional_whatsapp IS NULL
  );