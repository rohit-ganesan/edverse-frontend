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

    const { filters = {} } = await req.json() || {}

    // Get user profile to determine role
    const { data: userProfile, error: profileError } = await supabaseClient
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError) {
      return new Response(
        JSON.stringify({ error: 'Failed to get user profile' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    let courses = []

    if (userProfile.role === 'Instructor') {
      // Get courses taught by this instructor
      const { data, error } = await supabaseClient
        .from('courses')
        .select('*')
        .eq('instructor_id', user.id)
        .eq('is_active', filters.active !== false) // Default to active only
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching instructor courses:', error)
        return new Response(
          JSON.stringify({ error: error.message }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
      courses = data || []
    } else if (userProfile.role === 'Student') {
      // Get courses the student is enrolled in
      const { data, error } = await supabaseClient
        .from('courses')
        .select('*')
        .contains('students', [user.id])
        .eq('is_active', filters.active !== false)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching student courses:', error)
        return new Response(
          JSON.stringify({ error: error.message }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
      courses = data || []
    } else if (userProfile.role === 'Administrator') {
      // Administrators can see all courses
      let query = supabaseClient
        .from('courses')
        .select('*')

      // Apply filters
      if (filters.active !== false) {
        query = query.eq('is_active', true)
      }
      if (filters.subject) {
        query = query.eq('subject', filters.subject)
      }
      if (filters.instructor_id) {
        query = query.eq('instructor_id', filters.instructor_id)
      }
      if (filters.grade) {
        query = query.eq('grade', filters.grade)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching all courses:', error)
        return new Response(
          JSON.stringify({ error: error.message }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
      courses = data || []
    }

    // Apply additional client-side filters if needed
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      courses = courses.filter(course => 
        course.name.toLowerCase().includes(searchTerm) ||
        course.description.toLowerCase().includes(searchTerm) ||
        course.subject.toLowerCase().includes(searchTerm)
      )
    }

    console.log(`Retrieved ${courses.length} courses for user ${user.id} (role: ${userProfile.role})`)
    
    return new Response(
      JSON.stringify({ 
        courses, 
        userRole: userProfile.role 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in get-user-courses:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
