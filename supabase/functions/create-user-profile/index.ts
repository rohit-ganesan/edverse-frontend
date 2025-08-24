import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface UserData {
  first_name?: string;
  firstName?: string;
  lastName?: string;
  last_name?: string;
  email: string;
  address?: string;
  role?: string;
  grade?: string;
}

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  role: string;
  created_at: string;
  updated_at: string;
}

interface Instructor {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  subjects: string[];
  courses: string[];
  created_at: string;
  updated_at: string;
}

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  grade: string;
  enrolled_courses: string[];
  created_at: string;
  updated_at: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the Auth context of the function
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the user from the auth context
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const { userData }: { userData: UserData } = await req.json()

    // Create user profile in PostgreSQL
    const userProfile: Partial<UserProfile> = {
      id: user.id,
      first_name: userData.first_name || userData.firstName || '',
      last_name: userData.last_name || userData.lastName || '',
      email: userData.email,
      address: userData.address || '',
      role: userData.role || 'Student',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data: createdUser, error: userError } = await supabaseClient
      .from('users')
      .insert(userProfile)
      .select()
      .single()

    if (userError) {
      console.error('Error creating user profile:', userError)
      return new Response(
        JSON.stringify({ error: userError.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Create role-specific document
    if (userData.role === 'Instructor') {
      const instructorData: Partial<Instructor> = {
        id: user.id,
        first_name: userData.first_name || userData.firstName || '',
        last_name: userData.last_name || userData.lastName || '',
        email: userData.email,
        subjects: [],
        courses: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const { error: instructorError } = await supabaseClient
        .from('instructors')
        .insert(instructorData)

      if (instructorError) {
        console.error('Error creating instructor profile:', instructorError)
        return new Response(
          JSON.stringify({ error: instructorError.message }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
    } else if (userData.role === 'Student') {
      const studentData: Partial<Student> = {
        id: user.id,
        first_name: userData.first_name || userData.firstName || '',
        last_name: userData.last_name || userData.lastName || '',
        email: userData.email,
        grade: userData.grade || '',
        enrolled_courses: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const { error: studentError } = await supabaseClient
        .from('students')
        .insert(studentData)

      if (studentError) {
        console.error('Error creating student profile:', studentError)
        return new Response(
          JSON.stringify({ error: studentError.message }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
    }

    console.log(`Successfully created user profile: ${user.id}`)
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        userId: user.id, 
        data: createdUser 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in create-user-profile:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
