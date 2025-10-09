-- Add transactions for Peter Awotundun
DO $$
DECLARE
  peter_id uuid := '96d3b770-340d-4254-a37b-d5c2c3bca446';
  location_uuid uuid;
BEGIN
  -- Get a location
  SELECT id INTO location_uuid FROM public.locations LIMIT 1;
  
  -- Add various transactions (total: 420 points)
  INSERT INTO public.transactions (user_id, location_id, waste_type, weight_kg, points_earned, created_at) VALUES
    (peter_id, location_uuid, 'metal', 30, 150, NOW() - INTERVAL '10 days'),
    (peter_id, location_uuid, 'non-metal', 60, 120, NOW() - INTERVAL '8 days'),
    (peter_id, location_uuid, 'metal', 18, 90, NOW() - INTERVAL '5 days'),
    (peter_id, location_uuid, 'non-metal', 20, 40, NOW() - INTERVAL '3 days'),
    (peter_id, location_uuid, 'metal', 4, 20, NOW() - INTERVAL '1 day');
  
  -- Update Peter's total points to 420
  UPDATE public.profiles SET points = 420.00 WHERE id = peter_id;
  
  -- Add withdrawal history (2 withdrawals: 1 completed, 1 pending)
  -- Completed withdrawal: 100 points = ₦10 (rate: 10 points = ₦1)
  INSERT INTO public.withdrawals (user_id, points_deducted, amount_naira, status, created_at, processed_at) VALUES
    (peter_id, 100, 10, 'completed', NOW() - INTERVAL '6 days', NOW() - INTERVAL '5 days');
  
  -- Pending withdrawal: 50 points = ₦5
  INSERT INTO public.withdrawals (user_id, points_deducted, amount_naira, status, created_at) VALUES
    (peter_id, 50, 5, 'pending', NOW() - INTERVAL '2 days');
    
END $$;