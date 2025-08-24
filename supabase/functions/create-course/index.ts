import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CourseData {
  title?: string;
  name?: string;
  description: string;
  instructor_id?: string;
  instructorId?: string;
  instructor_name?: string;
  instructorName?: string;
  subject: string;
  grade?: string;
  max_students?: number;
  maxStudents?: number;
  start_date?: string;
  startDate?: string;
  end_date?: string;
  endDate?: string;
  is_active?: boolean;
  isActive?: boolean;
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

    const { courseData }: { courseData: CourseData } = await req.json()

    // Verify user is authorized to create courses
    const { data: userProfile, error: profileError } = await supabaseClient
      .from('users')
      .select('role, first_name, last_name')
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

    if (!['Administrator', 'Instructor'].includes(userProfile.role)) {
      return new Response(
        JSON.stringify({ error: 'Permission denied. Only administrators and instructors can create courses.' }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Prepare course data with proper field mapping
    const course = {
      name: courseData.title || courseData.name, // Support both field names for backward compatibility
      description: courseData.description,
      instructor_id: courseData.instructor_id || courseData.instructorId || user.id,
      instructor_name: courseData.instructor_name || courseData.instructorName || 
        `${userProfile.first_name} ${userProfile.last_name}`,
      subject: courseData.subject,
      grade: courseData.grade,
      students: [], // Changed from enrolled_students to students
      max_students: courseData.max_students || courseData.maxStudents,
      start_date: courseData.start_date || courseData.startDate,
      end_date: courseData.end_date || courseData.endDate,
      is_active: courseData.is_active ?? courseData.isActive ?? true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Create the course
    const { data: createdCourse, error: courseError } = await supabaseClient
      .from('courses')
      .insert(course)
      .select()
      .single()

    if (courseError) {
      console.error('Error creating course:', courseError)
      return new Response(
        JSON.stringify({ error: courseError.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Update instructor's courses list
    const { data: instructor, error: instructorError } = await supabaseClient
      .from('instructors')
      .select('courses')
      .eq('id', course.instructor_id)
      .single()

    if (instructor && !instructorError) {
      const updatedCourses = [...(instructor.courses || []), createdCourse.id]
      const { error: instructorUpdateError } = await supabaseClient
        .from('instructors')
        .update({
          courses: updatedCourses,
          updated_at: new Date().toISOString(),
        })
        .eq('id', course.instructor_id)

      if (instructorUpdateError) {
        console.error('Error updating instructor courses:', instructorUpdateError)
        // Don't fail the whole operation for this
      }
    }

    console.log(`Course created: ${createdCourse.id}`)
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        courseId: createdCourse.id, 
        data: createdCourse 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in create-course:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
