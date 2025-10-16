-- Insert test locations
INSERT INTO public.locations (name, address, latitude, longitude, capacity_kg, current_weight_kg, status) VALUES
('Lagos Island Collection Center', '15 Marina Road, Lagos Island, Lagos', 6.4541, 3.3947, 500, 125.5, 'available'),
('Ikeja Smart Bin', '42 Allen Avenue, Ikeja, Lagos', 6.5964, 3.3515, 300, 45.2, 'available'),
('Victoria Island Station', '23 Ahmadu Bello Way, Victoria Island, Lagos', 6.4281, 3.4219, 450, 289.8, 'available'),
('Lekki Recycling Hub', '10 Freedom Way, Lekki Phase 1, Lagos', 6.4474, 3.4739, 600, 450.0, 'full'),
('Surulere Drop Point', '5 Adeniran Ogunsanya Street, Surulere, Lagos', 6.4969, 3.3611, 250, 78.3, 'available');

-- Insert test transactions (using the first user's ID if exists, otherwise we'll create dummy ones)
-- Note: These will only be visible if you're logged in as the user with the matching user_id
DO $$
DECLARE
    test_user_id uuid;
    test_location_id uuid;
BEGIN
    -- Get a test user ID (if any exists in auth.users)
    SELECT id INTO test_user_id FROM auth.users LIMIT 1;
    
    -- Get first location ID
    SELECT id INTO test_location_id FROM public.locations LIMIT 1;
    
    -- Only insert if we have a user
    IF test_user_id IS NOT NULL AND test_location_id IS NOT NULL THEN
        INSERT INTO public.transactions (user_id, location_id, weight_kg, points_earned, is_valid, created_at) VALUES
        (test_user_id, test_location_id, 5.5, 55, true, NOW() - INTERVAL '5 days'),
        (test_user_id, test_location_id, 12.3, 123, true, NOW() - INTERVAL '3 days'),
        (test_user_id, test_location_id, 8.7, 87, true, NOW() - INTERVAL '1 day'),
        (test_user_id, test_location_id, 3.2, 32, true, NOW() - INTERVAL '12 hours');
        
        -- Update user's points in profile
        UPDATE public.profiles 
        SET points = points + 297
        WHERE id = test_user_id;
        
        -- Insert a test withdrawal
        INSERT INTO public.withdrawals (user_id, amount_naira, points_deducted, status, created_at) VALUES
        (test_user_id, 100, 100, 'pending', NOW() - INTERVAL '2 days');
    END IF;
END $$;