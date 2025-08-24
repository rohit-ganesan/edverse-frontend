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

    // Get basic statistics using utility function
    const [
      studentsResult,
      instructorsResult,
      coursesResult,
      adminsResult
    ] = await Promise.all([
      supabaseClient.from('students').select('id', { count: 'exact', head: true }),
      supabaseClient.from('instructors').select('id', { count: 'exact', head: true }),
      supabaseClient.from('courses').select('id', { count: 'exact', head: true }),
      supabaseClient.from('users').select('id', { count: 'exact', head: true }).eq('role', 'Administrator')
    ])

    const basicStats = {
      totalStudents: studentsResult.count || 0,
      totalInstructors: instructorsResult.count || 0,
      totalCourses: coursesResult.count || 0,
      totalAdmins: adminsResult.count || 0,
    }

    // Enhanced stats based on user role
    let enhancedStats = { ...basicStats }

    if (userProfile.role === 'Administrator') {
      // Admin gets comprehensive stats
      const [activeStudentsResult, activeCoursesResult, recentNotificationsResult] = await Promise.all([
        // Active students (students enrolled in at least one course)
        supabaseClient
          .from('students')
          .select('id', { count: 'exact', head: true })
          .not('enrolled_courses', 'eq', '{}'),
        // Active courses
        supabaseClient
          .from('courses')
          .select('id', { count: 'exact', head: true })
          .eq('is_active', true),
        // Recent notifications
        supabaseClient
          .from('notifications')
          .select('id', { count: 'exact', head: true })
          .eq('is_active', true)
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // Last 7 days
      ])

      enhancedStats = {
        ...enhancedStats,
        activeStudents: activeStudentsResult.count || 0,
        activeCourses: activeCoursesResult.count || 0,
        recentNotifications: recentNotificationsResult.count || 0,
      }
    } else if (userProfile.role === 'Instructor') {
      // Instructor gets stats for their courses
      const [instructorCoursesResult] = await Promise.all([
        // Instructor's courses
        supabaseClient
          .from('courses')
          .select('id, students', { count: 'exact' })
          .eq('instructor_id', user.id)
          .eq('is_active', true)
      ])

      // Calculate total enrolled students across instructor's courses
      const totalEnrolledStudents = instructorCoursesResult.data?.reduce((total, course) => {
        return total + (course.students?.length || 0)
      }, 0) || 0

      enhancedStats = {
        totalStudents: totalEnrolledStudents,
        totalInstructors: 1, // Just the current instructor
        totalCourses: instructorCoursesResult.count || 0,
        totalAdmins: 0, // Not relevant for instructors
        activeCourses: instructorCoursesResult.count || 0,
      }
    } else if (userProfile.role === 'Student') {
      // Student gets personal stats
      const [studentCoursesResult] = await Promise.all([
        // Student's enrolled courses
        supabaseClient
          .from('courses')
          .select('id', { count: 'exact', head: true })
          .contains('students', [user.id])
          .eq('is_active', true)
      ])

      enhancedStats = {
        totalStudents: 1, // Just the current student
        totalInstructors: 0, // Not relevant for students
        totalCourses: studentCoursesResult.count || 0,
        totalAdmins: 0, // Not relevant for students
        activeCourses: studentCoursesResult.count || 0,
      }
    }

    console.log(`Dashboard stats retrieved for user ${user.id} (role: ${userProfile.role})`, enhancedStats)
    
    return new Response(
      JSON.stringify({ 
        stats: enhancedStats, 
        userRole: userProfile.role 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in get-dashboard-stats:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
