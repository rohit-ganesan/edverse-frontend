import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ProfileData {
  firstName?: string;
  lastName?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  address?: string;
  role?: string;
  avatar_url?: string;
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

    const { userId, profileData }: { userId?: string, profileData: ProfileData } = await req.json()
    const targetUserId = userId || user.id // Default to current user if no userId provided

    // Users can update their own profile, or check admin privileges for others
    if (user.id !== targetUserId) {
      const { data: userProfile, error: profileError } = await supabaseClient
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profileError || userProfile?.role !== 'Administrator') {
        return new Response(
          JSON.stringify({ error: 'Permission denied' }),
          { 
            status: 403, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
    }

    // Prepare update data with proper field mapping
    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    // Map fields from camelCase to snake_case if needed
    if (profileData.firstName) updateData.first_name = profileData.firstName
    if (profileData.lastName) updateData.last_name = profileData.lastName
    if (profileData.first_name) updateData.first_name = profileData.first_name
    if (profileData.last_name) updateData.last_name = profileData.last_name
    if (profileData.email) updateData.email = profileData.email
    if (profileData.address) updateData.address = profileData.address
    if (profileData.role) updateData.role = profileData.role
    if (profileData.avatar_url) updateData.avatar_url = profileData.avatar_url

    // Update the user profile
    const { data: updatedProfile, error: updateError } = await supabaseClient
      .from('users')
      .update(updateData)
      .eq('id', targetUserId)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating user profile:', updateError)
      return new Response(
        JSON.stringify({ error: updateError.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // If role is being updated, also update role-specific table
    if (profileData.role) {
      const { data: currentProfile } = await supabaseClient
        .from('users')
        .select('role')
        .eq('id', targetUserId)
        .single()

      if (currentProfile && profileData.role !== currentProfile.role) {
        const roleUpdateData = {
          first_name: updateData.first_name,
          last_name: updateData.last_name,
          email: updateData.email,
          updated_at: new Date().toISOString(),
        }

        if (profileData.role === 'Instructor') {
          // Update or create instructor record
          const { error: instructorError } = await supabaseClient
            .from('instructors')
            .upsert({
              id: targetUserId,
              subjects: [],
              courses: [],
              ...roleUpdateData,
            })

          if (instructorError) {
            console.error('Error updating instructor profile:', instructorError)
          }
        } else if (profileData.role === 'Student') {
          // Update or create student record
          const { error: studentError } = await supabaseClient
            .from('students')
            .upsert({
              id: targetUserId,
              grade: profileData.grade || '',
              enrolled_courses: [],
              ...roleUpdateData,
            })

          if (studentError) {
            console.error('Error updating student profile:', studentError)
          }
        }
      }
    }

    console.log(`User profile updated: ${targetUserId}`)
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        data: updatedProfile 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in update-user-profile:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
