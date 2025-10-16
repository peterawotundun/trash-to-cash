-- 1. Update transactions table to remove waste_type and add is_valid boolean
ALTER TABLE public.transactions 
DROP COLUMN waste_type,
ADD COLUMN is_valid boolean NOT NULL DEFAULT false;

-- 2. Update the handle_new_user function to use phone number as unique_code
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, full_name, username, unique_code)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'phone_number', generate_unique_code())
  );
  RETURN NEW;
END;
$function$;

-- 3. Clear existing locations and add Kwara State locations
DELETE FROM public.locations;

INSERT INTO public.locations (name, address, latitude, longitude, capacity_kg, current_weight_kg, status) VALUES
('Ilorin Central Market', 'Oja-Oba Road, Ilorin, Kwara State', 8.4799, 4.5421, 500, 0, 'available'),
('University of Ilorin Campus', 'UNILORIN Road, Ilorin, Kwara State', 8.4799, 4.6749, 750, 0, 'available'),
('Offa Town Center', 'Oyo Road, Offa, Kwara State', 8.1479, 4.7207, 400, 0, 'available'),
('Jebba Community', 'Jebba, Kwara State', 9.1167, 4.8167, 300, 0, 'available'),
('Lafiagi Market', 'Lafiagi, Kwara State', 8.8536, 5.4175, 350, 0, 'available');