-- Add a field to track if user has completed registration
ALTER TABLE public.profiles 
ADD COLUMN is_registered boolean DEFAULT false;

-- Update existing profiles to be registered
UPDATE public.profiles 
SET is_registered = true 
WHERE id IN (SELECT id FROM auth.users);

-- Add index for faster lookups
CREATE INDEX idx_profiles_unique_code ON public.profiles(unique_code);

COMMENT ON COLUMN public.profiles.is_registered IS 'Tracks if user completed full registration or is just a hardware-only user';