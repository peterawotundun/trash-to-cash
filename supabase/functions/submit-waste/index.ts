import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WasteSubmission {
  unique_code: string;
  weight_kg: number;
  location_id?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { unique_code, weight_kg, location_id }: WasteSubmission = await req.json();

    console.log('Received waste submission:', { unique_code, weight_kg, location_id });

    // Validate input
    if (!unique_code || weight_kg === undefined || weight_kg === null) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: unique_code, weight_kg' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (weight_kg < 0) {
      return new Response(
        JSON.stringify({ error: 'Weight cannot be negative' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Find user by unique code
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('id, username, full_name, points')
      .eq('unique_code', unique_code)
      .single();

    if (profileError || !profile) {
      console.error('Profile not found:', profileError);
      return new Response(
        JSON.stringify({ error: 'Invalid unique code' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Found profile:', profile);

    // Determine if submission is valid (weight > 0.1 kg)
    const is_valid = weight_kg > 0.1;
    
    // Calculate points - only if valid (50 points per kg = ₦200 per kg)
    const points_earned = is_valid ? weight_kg * 50 : 0;

    console.log('Points calculation:', { is_valid, points_earned, weight_kg });

    // Create transaction
    const { data: transaction, error: transactionError } = await supabaseClient
      .from('transactions')
      .insert({
        user_id: profile.id,
        location_id: location_id || null,
        is_valid,
        weight_kg,
        points_earned,
      })
      .select()
      .single();

    if (transactionError) {
      console.error('Transaction error:', transactionError);
      throw transactionError;
    }

    console.log('Created transaction:', transaction);

    // Update user points
    const new_points = Number(profile.points) + points_earned;
    const { error: updateError } = await supabaseClient
      .from('profiles')
      .update({ points: new_points })
      .eq('id', profile.id);

    if (updateError) {
      console.error('Points update error:', updateError);
      throw updateError;
    }

    console.log('Updated points:', { old: profile.points, new: new_points });

    // Update location capacity if provided
    if (location_id) {
      const { data: location, error: locationFetchError } = await supabaseClient
        .from('locations')
        .select('current_weight_kg, capacity_kg, status')
        .eq('id', location_id)
        .single();

      if (!locationFetchError && location) {
        const new_weight = Number(location.current_weight_kg) + weight_kg;
        const new_status = new_weight >= location.capacity_kg ? 'full' : 'available';

        await supabaseClient
          .from('locations')
          .update({ 
            current_weight_kg: new_weight,
            status: new_status
          })
          .eq('id', location_id);

        console.log('Updated location:', { location_id, new_weight, new_status });

        // TODO: Send notification to recycling company if status changed to 'full'
        if (new_status === 'full' && location.status === 'available') {
          console.log('ALERT: Location is now full! Notify recycling company:', location_id);
          // Future: Call notification edge function or webhook here
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        transaction: {
          id: transaction.id,
          user: {
            full_name: profile.full_name,
            username: profile.username,
          },
          is_valid,
          weight_kg,
          points_earned,
          new_balance: new_points,
          message: is_valid ? 'Waste accepted! Points credited.' : 'Weight too low (< 0.1kg). No points awarded.'
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error processing waste submission:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
