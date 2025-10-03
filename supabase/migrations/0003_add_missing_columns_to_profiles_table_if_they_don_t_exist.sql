DO $$
BEGIN
    -- Add store-related columns if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'store_name') THEN
        ALTER TABLE public.profiles ADD COLUMN store_name TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'store_category') THEN
        ALTER TABLE public.profiles ADD COLUMN store_category TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'store_description') THEN
        ALTER TABLE public.profiles ADD COLUMN store_description TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'store_opening_hours') THEN
        ALTER TABLE public.profiles ADD COLUMN store_opening_hours TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'store_whatsapp') THEN
        ALTER TABLE public.profiles ADD COLUMN store_whatsapp TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'store_accepts_delivery') THEN
        ALTER TABLE public.profiles ADD COLUMN store_accepts_delivery BOOLEAN DEFAULT false;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'store_delivery_radius_km') THEN
        ALTER TABLE public.profiles ADD COLUMN store_delivery_radius_km NUMERIC;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'store_delivery_fee') THEN
        ALTER TABLE public.profiles ADD COLUMN store_delivery_fee NUMERIC;
    END IF;
    
    -- Add professional-related columns if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'professional_name') THEN
        ALTER TABLE public.profiles ADD COLUMN professional_name TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'professional_profession') THEN
        ALTER TABLE public.profiles ADD COLUMN professional_profession TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'professional_category') THEN
        ALTER TABLE public.profiles ADD COLUMN professional_category TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'professional_description') THEN
        ALTER TABLE public.profiles ADD COLUMN professional_description TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'professional_experience_years') THEN
        ALTER TABLE public.profiles ADD COLUMN professional_experience_years INTEGER;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'professional_hourly_rate') THEN
        ALTER TABLE public.profiles ADD COLUMN professional_hourly_rate NUMERIC;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'professional_min_price') THEN
        ALTER TABLE public.profiles ADD COLUMN professional_min_price NUMERIC;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'professional_whatsapp') THEN
        ALTER TABLE public.profiles ADD COLUMN professional_whatsapp TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'professional_home_service') THEN
        ALTER TABLE public.profiles ADD COLUMN professional_home_service BOOLEAN DEFAULT false;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'professional_service_radius_km') THEN
        ALTER TABLE public.profiles ADD COLUMN professional_service_radius_km NUMERIC;
    END IF;
    
    -- Add user_type column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'user_type') THEN
        ALTER TABLE public.profiles ADD COLUMN user_type TEXT DEFAULT 'cliente';
    END IF;
END $$;