import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.74.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RegisterRequest {
  unique_code: string
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { unique_code }: RegisterRequest = await req.json();

    if (!unique_code || unique_code.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'unique_code is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id, unique_code, is_registered')
      .eq('unique_code', unique_code)
      .single();

    if (existingUser) {
      console.log(`User with code ${unique_code} already exists`);
      return new Response(
        JSON.stringify({ 
          success: true, 
          user_id: existingUser.id,
          message: 'User already exists',
          is_registered: existingUser.is_registered
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate UUID for the new user
    const userId = crypto.randomUUID();

    // Create new hardware-only user profile
    const { data: newProfile, error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        full_name: 'Hardware User',
        username: `user_${unique_code.substring(0, 8)}`,
        unique_code: unique_code,
        points: 0,
        is_registered: false
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating profile:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to create user profile', details: insertError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Created new hardware-only user with code ${unique_code}`);
    return new Response(
      JSON.stringify({ 
        success: true, 
        user_id: newProfile.id,
        message: 'Hardware user created successfully. Complete registration online to access full features.',
        is_registered: false
      }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in register-user function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
