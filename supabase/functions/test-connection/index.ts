import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    // Test Supabase connection
    const { data, error } = await supabaseClient
      .from('users')
      .select('count', { count: 'exact', head: true })

    const testResult = {
      message: 'Supabase connection successful',
      timestamp: new Date().toISOString(),
      database: error ? 'disconnected' : 'connected',
      userCount: data || 0,
      services: {
        supabase_edge_functions: 'operational',
        supabase_database: error ? 'error' : 'operational',
        supabase_auth: 'operational',
      },
      environment: {
        supabase_url: Deno.env.get('SUPABASE_URL') ? 'configured' : 'missing',
        supabase_anon_key: Deno.env.get('SUPABASE_ANON_KEY') ? 'configured' : 'missing',
      }
    }

    if (error) {
      console.warn('Supabase connection test failed:', error)
      return new Response(
        JSON.stringify({
          ...testResult,
          message: 'Supabase connection failed',
          error: error.message
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify(testResult),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Test connection failed:', error)
    return new Response(
      JSON.stringify({
        message: 'Test connection failed',
        timestamp: new Date().toISOString(),
        error: 'Failed to connect to Supabase'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
