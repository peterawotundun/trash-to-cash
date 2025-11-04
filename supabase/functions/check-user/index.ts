import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.74.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CheckUserRequest {
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

    const { unique_code }: CheckUserRequest = await req.json();

    if (!unique_code || unique_code.trim().length === 0) {
      return new Response(
        JSON.stringify({ exists: false, error: 'unique_code is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user exists
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, unique_code, full_name, is_registered')
      .eq('unique_code', unique_code)
      .single();

    if (profile) {
      console.log(`User found with code ${unique_code}`);
      return new Response(
        JSON.stringify({ 
          exists: true, 
          user_id: profile.id,
          full_name: profile.full_name,
          is_registered: profile.is_registered
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`No user found with code ${unique_code}`);
    return new Response(
      JSON.stringify({ exists: false }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in check-user function:', error);
    return new Response(
      JSON.stringify({ exists: false, error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
