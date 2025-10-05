-- Update incomplete seller profiles with verified existing columns
UPDATE profiles 
SET 
  store_name = COALESCE(store_name, 'Minha Loja'),
  store_category = COALESCE(store_category, 'Outros'),
  store_description = COALESCE(store_description, 'Loja de produtos diversos'),
  store_whatsapp = COALESCE(store_whatsapp, phone),
  store_accepts_delivery = COALESCE(store_accepts_delivery, true),
  store_delivery_radius_km = COALESCE(store_delivery_radius_km, 10),
  store_delivery_fee = COALESCE(store_delivery_fee, 50)
WHERE 
  user_type = 'vendedor' 
  AND (
    store_name IS NULL 
    OR store_category IS NULL 
    OR store_description IS NULL 
    OR store_whatsapp IS NULL
  );