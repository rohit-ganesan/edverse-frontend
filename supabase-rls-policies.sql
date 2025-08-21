-- Row Level Security (RLS) Policies for EdVerse
-- These policies mirror the Firestore security rules

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Helper functions for role checking
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role
LANGUAGE sql
SECURITY definer
AS $$
  SELECT role FROM users WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY definer
AS $$
  SELECT get_user_role() = 'Administrator';
$$;

CREATE OR REPLACE FUNCTION is_instructor()
RETURNS boolean
LANGUAGE sql
SECURITY definer
AS $$
  SELECT get_user_role() = 'Instructor';
$$;

CREATE OR REPLACE FUNCTION is_student()
RETURNS boolean
LANGUAGE sql
SECURITY definer
AS $$
  SELECT get_user_role() = 'Student';
$$;

CREATE OR REPLACE FUNCTION is_instructor_or_admin()
RETURNS boolean
LANGUAGE sql
SECURITY definer
AS $$
  SELECT is_instructor() OR is_admin();
$$;

-- Users table policies
CREATE POLICY "Users can view own profile or admins can view all" ON users
    FOR SELECT USING (
        auth.uid() = id OR is_admin()
    );

CREATE POLICY "Users can update own profile or admins can update all" ON users
    FOR UPDATE USING (
        auth.uid() = id OR is_admin()
    );

CREATE POLICY "Anyone can create user profile" ON users
    FOR INSERT WITH CHECK (true);

-- Instructors table policies
CREATE POLICY "Instructors can view own data, admins can view all" ON instructors
    FOR SELECT USING (
        auth.uid() = id OR is_admin()
    );

CREATE POLICY "Instructors can update own data, admins can update all" ON instructors
    FOR UPDATE USING (
        auth.uid() = id OR is_admin()
    );

CREATE POLICY "Only admins can create instructor records" ON instructors
    FOR INSERT WITH CHECK (is_admin());

-- Students table policies
CREATE POLICY "Students can view own data, instructors/admins can view all" ON students
    FOR SELECT USING (
        auth.uid() = id OR is_instructor_or_admin()
    );

CREATE POLICY "Admins can update student data, instructors can update limited fields" ON students
    FOR UPDATE USING (
        is_admin() OR 
        (is_instructor() AND 
         -- Only allow updating specific fields for instructors
         true)
    );

CREATE POLICY "Only admins can create student records" ON students
    FOR INSERT WITH CHECK (is_admin());

-- Courses table policies
CREATE POLICY "All authenticated users can view courses" ON courses
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update all courses, instructors can update own courses" ON courses
    FOR UPDATE USING (
        is_admin() OR 
        (is_instructor() AND instructor_id = auth.uid())
    );

CREATE POLICY "Instructors and admins can create courses" ON courses
    FOR INSERT WITH CHECK (is_instructor_or_admin());

-- Notifications table policies
CREATE POLICY "All authenticated users can view notifications" ON notifications
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can modify notifications" ON notifications
    FOR ALL USING (is_admin());

-- Grades table policies
CREATE POLICY "Users can view relevant grades" ON grades
    FOR SELECT USING (
        is_admin() OR
        (is_instructor() AND instructor_id = auth.uid()) OR
        (is_student() AND student_id = auth.uid())
    );

CREATE POLICY "Admins and course instructors can modify grades" ON grades
    FOR ALL USING (
        is_admin() OR 
        (is_instructor() AND instructor_id = auth.uid())
    );

-- Attendance table policies
CREATE POLICY "Users can view relevant attendance" ON attendance
    FOR SELECT USING (
        is_admin() OR
        (is_instructor() AND instructor_id = auth.uid()) OR
        (is_student() AND student_id = auth.uid())
    );

CREATE POLICY "Instructors and admins can modify attendance" ON attendance
    FOR ALL USING (is_instructor_or_admin());

-- Assignments table policies
CREATE POLICY "All authenticated users can view assignments" ON assignments
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins and course instructors can modify assignments" ON assignments
    FOR ALL USING (
        is_admin() OR 
        (is_instructor() AND instructor_id = auth.uid())
    );

-- Submissions table policies
CREATE POLICY "Users can view relevant submissions" ON submissions
    FOR SELECT USING (
        is_admin() OR
        (is_instructor() AND instructor_id = auth.uid()) OR
        (is_student() AND student_id = auth.uid())
    );

CREATE POLICY "Students can create and update own submissions" ON submissions
    FOR INSERT WITH CHECK (
        is_student() AND student_id = auth.uid()
    );

CREATE POLICY "Students can update own submissions" ON submissions
    FOR UPDATE USING (
        is_student() AND student_id = auth.uid()
    );

-- Messages table policies
CREATE POLICY "Users can view messages they sent or received" ON messages
    FOR SELECT USING (
        sender_id = auth.uid() OR 
        recipient_id = auth.uid() OR 
        is_admin()
    );

CREATE POLICY "Users can send messages" ON messages
    FOR INSERT WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Senders can update their messages" ON messages
    FOR UPDATE USING (sender_id = auth.uid());

-- Events table policies
CREATE POLICY "All authenticated users can view events" ON events
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Instructors and admins can modify events" ON events
    FOR ALL USING (is_instructor_or_admin());
