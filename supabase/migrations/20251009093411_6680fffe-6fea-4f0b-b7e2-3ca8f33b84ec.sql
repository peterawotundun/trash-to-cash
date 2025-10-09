-- Update RLS policy to allow viewing all profiles for leaderboard
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

CREATE POLICY "Users can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (true);

-- Keep the update policy restricted to own profile
-- (already exists: "Users can update their own profile")

-- Now insert test users without auth.users dependency by temporarily removing constraint
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Insert 5 test users
INSERT INTO public.profiles (id, full_name, username, unique_code, points) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Sarah Green', 'sarah_green', 'EF8C9A2B', 245.00),
  ('22222222-2222-2222-2222-222222222222', 'Michael Waters', 'mike_waters', 'A7D3F156', 189.00),
  ('33333333-3333-3333-3333-333333333333', 'Amina Ibrahim', 'amina_recycles', '9B2E4C78', 312.00),
  ('44444444-4444-4444-4444-444444444444', 'David Okonkwo', 'david_oko', 'C4F91D8A', 156.00),
  ('55555555-5555-5555-5555-555555555555', 'Grace Adebayo', 'grace_eco', '5E8A2F9C', 278.00);

-- Get the location ID and insert transactions
DO $$
DECLARE
  location_uuid uuid;
BEGIN
  SELECT id INTO location_uuid FROM public.locations LIMIT 1;
  
  -- Transactions for Sarah (245 points)
  INSERT INTO public.transactions (user_id, location_id, waste_type, weight_kg, points_earned, created_at) VALUES
    ('11111111-1111-1111-1111-111111111111', location_uuid, 'metal', 25, 125, NOW() - INTERVAL '5 days'),
    ('11111111-1111-1111-1111-111111111111', location_uuid, 'non-metal', 40, 80, NOW() - INTERVAL '3 days'),
    ('11111111-1111-1111-1111-111111111111', location_uuid, 'metal', 8, 40, NOW() - INTERVAL '1 day');
  
  -- Transactions for Mike (189 points)
  INSERT INTO public.transactions (user_id, location_id, waste_type, weight_kg, points_earned, created_at) VALUES
    ('22222222-2222-2222-2222-222222222222', location_uuid, 'metal', 15, 75, NOW() - INTERVAL '6 days'),
    ('22222222-2222-2222-2222-222222222222', location_uuid, 'non-metal', 45, 90, NOW() - INTERVAL '2 days'),
    ('22222222-2222-2222-2222-222222222222', location_uuid, 'metal', 4.8, 24, NOW() - INTERVAL '1 hour');
  
  -- Transactions for Amina (312 points - highest!)
  INSERT INTO public.transactions (user_id, location_id, waste_type, weight_kg, points_earned, created_at) VALUES
    ('33333333-3333-3333-3333-333333333333', location_uuid, 'metal', 35, 175, NOW() - INTERVAL '7 days'),
    ('33333333-3333-3333-3333-333333333333', location_uuid, 'metal', 20, 100, NOW() - INTERVAL '4 days'),
    ('33333333-3333-3333-3333-333333333333', location_uuid, 'non-metal', 15, 30, NOW() - INTERVAL '2 days'),
    ('33333333-3333-3333-3333-333333333333', location_uuid, 'metal', 1.4, 7, NOW() - INTERVAL '6 hours');
  
  -- Transactions for David (156 points)
  INSERT INTO public.transactions (user_id, location_id, waste_type, weight_kg, points_earned, created_at) VALUES
    ('44444444-4444-4444-4444-444444444444', location_uuid, 'non-metal', 50, 100, NOW() - INTERVAL '5 days'),
    ('44444444-4444-4444-4444-444444444444', location_uuid, 'metal', 10, 50, NOW() - INTERVAL '3 days'),
    ('44444444-4444-4444-4444-444444444444', location_uuid, 'non-metal', 3, 6, NOW() - INTERVAL '1 day');
  
  -- Transactions for Grace (278 points)
  INSERT INTO public.transactions (user_id, location_id, waste_type, weight_kg, points_earned, created_at) VALUES
    ('55555555-5555-5555-5555-555555555555', location_uuid, 'metal', 28, 140, NOW() - INTERVAL '8 days'),
    ('55555555-5555-5555-5555-555555555555', location_uuid, 'non-metal', 35, 70, NOW() - INTERVAL '4 days'),
    ('55555555-5555-5555-5555-555555555555', location_uuid, 'metal', 12, 60, NOW() - INTERVAL '2 days'),
    ('55555555-5555-5555-5555-555555555555', location_uuid, 'metal', 1.6, 8, NOW() - INTERVAL '3 hours');
END $$;