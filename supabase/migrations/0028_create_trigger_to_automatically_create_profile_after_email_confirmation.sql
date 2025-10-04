-- Create or update the trigger function to handle profile creation after email confirmation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
AS $$
BEGIN
  -- Try to insert profile with available columns
  INSERT INTO public.profiles (user_id, full_name, phone, address, user_type, role)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data ->> 'phone', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'address', ''),
    'cliente',
    'cliente'
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- If profile creation fails, still allow user creation
    RETURN NEW;
END;
$$;

-- Create trigger to automatically create profile after user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();