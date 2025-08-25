-- EdVerse Sample Data
-- This file contains realistic sample data for all database tables
-- Run this in your Supabase SQL Editor to populate your database

-- =====================================================
-- USERS TABLE SAMPLE DATA
-- =====================================================

INSERT INTO users (id, email, first_name, last_name, address, role, created_at) VALUES
-- Administrators
('550e8400-e29b-41d4-a716-446655440001', 'admin@edverse.edu', 'Sarah', 'Johnson', '123 Admin Street, City, State 12345', 'Administrator', '2024-01-15 09:00:00+00'),
('550e8400-e29b-41d4-a716-446655440002', 'director@edverse.edu', 'Michael', 'Chen', '456 Management Ave, City, State 12345', 'Administrator', '2024-01-15 09:00:00+00'),

-- Instructors
('550e8400-e29b-41d4-a716-446655440003', 'dr.smith@edverse.edu', 'Dr. Emily', 'Smith', '789 Faculty Lane, City, State 12345', 'Instructor', '2024-01-15 10:00:00+00'),
('550e8400-e29b-41d4-a716-446655440004', 'prof.wilson@edverse.edu', 'Prof. James', 'Wilson', '321 Academic Blvd, City, State 12345', 'Instructor', '2024-01-15 10:00:00+00'),
('550e8400-e29b-41d4-a716-446655440005', 'ms.garcia@edverse.edu', 'Ms. Maria', 'Garcia', '654 Teacher Way, City, State 12345', 'Instructor', '2024-01-15 10:00:00+00'),
('550e8400-e29b-41d4-a716-446655440006', 'mr.brown@edverse.edu', 'Mr. David', 'Brown', '987 Education Dr, City, State 12345', 'Instructor', '2024-01-15 10:00:00+00'),
('550e8400-e29b-41d4-a716-446655440007', 'dr.lee@edverse.edu', 'Dr. Jennifer', 'Lee', '147 Scholar St, City, State 12345', 'Instructor', '2024-01-15 10:00:00+00'),

-- Students
('550e8400-e29b-41d4-a716-446655440008', 'alex.thompson@student.edverse.edu', 'Alex', 'Thompson', '258 Student Ave, City, State 12345', 'Student', '2024-01-15 11:00:00+00'),
('550e8400-e29b-41d4-a716-446655440009', 'sophia.rodriguez@student.edverse.edu', 'Sophia', 'Rodriguez', '369 College Blvd, City, State 12345', 'Student', '2024-01-15 11:00:00+00'),
('550e8400-e29b-41d4-a716-446655440010', 'ethan.patel@student.edverse.edu', 'Ethan', 'Patel', '741 University Way, City, State 12345', 'Student', '2024-01-15 11:00:00+00'),
('550e8400-e29b-41d4-a716-446655440011', 'olivia.kim@student.edverse.edu', 'Olivia', 'Kim', '852 Campus Dr, City, State 12345', 'Student', '2024-01-15 11:00:00+00'),
('550e8400-e29b-41d4-a716-446655440012', 'noah.anderson@student.edverse.edu', 'Noah', 'Anderson', '963 Learning Lane, City, State 12345', 'Student', '2024-01-15 11:00:00+00'),
('550e8400-e29b-41d4-a716-446655440013', 'ava.martinez@student.edverse.edu', 'Ava', 'Martinez', '159 Knowledge St, City, State 12345', 'Student', '2024-01-15 11:00:00+00'),
('550e8400-e29b-41d4-a716-446655440014', 'william.taylor@student.edverse.edu', 'William', 'Taylor', '357 Wisdom Ave, City, State 12345', 'Student', '2024-01-15 11:00:00+00'),
('550e8400-e29b-41d4-a716-446655440015', 'isabella.clark@student.edverse.edu', 'Isabella', 'Clark', '486 Success Blvd, City, State 12345', 'Student', '2024-01-15 11:00:00+00'),
('550e8400-e29b-41d4-a716-446655440016', 'james.white@student.edverse.edu', 'James', 'White', '753 Achievement Way, City, State 12345', 'Student', '2024-01-15 11:00:00+00'),
('550e8400-e29b-41d4-a716-446655440017', 'emma.harris@student.edverse.edu', 'Emma', 'Harris', '951 Excellence Dr, City, State 12345', 'Student', '2024-01-15 11:00:00+00'),
('550e8400-e29b-41d4-a716-446655440018', 'benjamin.lewis@student.edverse.edu', 'Benjamin', 'Lewis', '264 Growth St, City, State 12345', 'Student', '2024-01-15 11:00:00+00'),
('550e8400-e29b-41d4-a716-446655440019', 'mia.robinson@student.edverse.edu', 'Mia', 'Robinson', '837 Progress Ave, City, State 12345', 'Student', '2024-01-15 11:00:00+00'),
('550e8400-e29b-41d4-a716-446655440020', 'lucas.walker@student.edverse.edu', 'Lucas', 'Walker', '429 Future Blvd, City, State 12345', 'Student', '2024-01-15 11:00:00+00'),

-- Parents
('550e8400-e29b-41d4-a716-446655440021', 'parent.thompson@edverse.edu', 'Robert', 'Thompson', '258 Student Ave, City, State 12345', 'Parent', '2024-01-15 12:00:00+00'),
('550e8400-e29b-41d4-a716-446655440022', 'parent.rodriguez@edverse.edu', 'Carmen', 'Rodriguez', '369 College Blvd, City, State 12345', 'Parent', '2024-01-15 12:00:00+00');

-- =====================================================
-- INSTRUCTORS TABLE SAMPLE DATA
-- =====================================================

INSERT INTO instructors (id, subjects, courses, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440003', ARRAY['Mathematics', 'Calculus', 'Linear Algebra'], ARRAY['MATH101', 'MATH201', 'MATH301'], '2024-01-15 10:00:00+00'),
('550e8400-e29b-41d4-a716-446655440004', ARRAY['Physics', 'Mechanics', 'Thermodynamics'], ARRAY['PHYS101', 'PHYS201', 'PHYS301'], '2024-01-15 10:00:00+00'),
('550e8400-e29b-41d4-a716-446655440005', ARRAY['English Literature', 'Creative Writing', 'Poetry'], ARRAY['ENG101', 'ENG201', 'ENG301'], '2024-01-15 10:00:00+00'),
('550e8400-e29b-41d4-a716-446655440006', ARRAY['Computer Science', 'Programming', 'Data Structures'], ARRAY['CS101', 'CS201', 'CS301'], '2024-01-15 10:00:00+00'),
('550e8400-e29b-41d4-a716-446655440007', ARRAY['Biology', 'Chemistry', 'Anatomy'], ARRAY['BIO101', 'CHEM101', 'BIO201'], '2024-01-15 10:00:00+00');

-- =====================================================
-- STUDENTS TABLE SAMPLE DATA
-- =====================================================

INSERT INTO students (id, grade, parent_email, enrolled_courses, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440008', 'Grade 10', 'parent.thompson@edverse.edu', ARRAY['MATH101', 'PHYS101', 'ENG101'], '2024-01-15 11:00:00+00'),
('550e8400-e29b-41d4-a716-446655440009', 'Grade 11', 'parent.rodriguez@edverse.edu', ARRAY['MATH201', 'PHYS201', 'CS101'], '2024-01-15 11:00:00+00'),
('550e8400-e29b-41d4-a716-446655440010', 'Grade 10', 'parent.patel@edverse.edu', ARRAY['MATH101', 'BIO101', 'ENG101'], '2024-01-15 11:00:00+00'),
('550e8400-e29b-41d4-a716-446655440011', 'Grade 12', 'parent.kim@edverse.edu', ARRAY['MATH301', 'PHYS301', 'CS201'], '2024-01-15 11:00:00+00'),
('550e8400-e29b-41d4-a716-446655440012', 'Grade 11', 'parent.anderson@edverse.edu', ARRAY['MATH201', 'CHEM101', 'ENG201'], '2024-01-15 11:00:00+00'),
('550e8400-e29b-41d4-a716-446655440013', 'Grade 10', 'parent.martinez@edverse.edu', ARRAY['MATH101', 'BIO101', 'CS101'], '2024-01-15 11:00:00+00'),
('550e8400-e29b-41d4-a716-446655440014', 'Grade 12', 'parent.taylor@edverse.edu', ARRAY['MATH301', 'PHYS301', 'ENG301'], '2024-01-15 11:00:00+00'),
('550e8400-e29b-41d4-a716-446655440015', 'Grade 11', 'parent.clark@edverse.edu', ARRAY['MATH201', 'CHEM101', 'CS201'], '2024-01-15 11:00:00+00'),
('550e8400-e29b-41d4-a716-446655440016', 'Grade 10', 'parent.white@edverse.edu', ARRAY['MATH101', 'PHYS101', 'BIO101'], '2024-01-15 11:00:00+00'),
('550e8400-e29b-41d4-a716-446655440017', 'Grade 12', 'parent.harris@edverse.edu', ARRAY['MATH301', 'PHYS301', 'CS301'], '2024-01-15 11:00:00+00'),
('550e8400-e29b-41d4-a716-446655440018', 'Grade 11', 'parent.lewis@edverse.edu', ARRAY['MATH201', 'BIO201', 'ENG201'], '2024-01-15 11:00:00+00'),
('550e8400-e29b-41d4-a716-446655440019', 'Grade 10', 'parent.robinson@edverse.edu', ARRAY['MATH101', 'CHEM101', 'CS101'], '2024-01-15 11:00:00+00'),
('550e8400-e29b-41d4-a716-446655440020', 'Grade 12', 'parent.walker@edverse.edu', ARRAY['MATH301', 'BIO201', 'ENG301'], '2024-01-15 11:00:00+00');

-- =====================================================
-- COURSES TABLE SAMPLE DATA
-- =====================================================

INSERT INTO courses (id, name, description, instructor_id, instructor_name, subject, grade, students, created_at) VALUES
-- Mathematics Courses
('660e8400-e29b-41d4-a716-446655440001', 'MATH101 - Introduction to Algebra', 'Fundamental concepts of algebra including linear equations, inequalities, and basic functions.', '550e8400-e29b-41d4-a716-446655440003', 'Dr. Emily Smith', 'Mathematics', 'Grade 10', ARRAY['alex.thompson@student.edverse.edu', 'ethan.patel@student.edverse.edu', 'ava.martinez@student.edverse.edu', 'james.white@student.edverse.edu', 'mia.robinson@student.edverse.edu'], '2024-01-15 13:00:00+00'),
('660e8400-e29b-41d4-a716-446655440002', 'MATH201 - Advanced Algebra', 'Advanced algebraic concepts including quadratic equations, polynomials, and complex numbers.', '550e8400-e29b-41d4-a716-446655440003', 'Dr. Emily Smith', 'Mathematics', 'Grade 11', ARRAY['sophia.rodriguez@student.edverse.edu', 'noah.anderson@student.edverse.edu', 'isabella.clark@student.edverse.edu', 'benjamin.lewis@student.edverse.edu'], '2024-01-15 13:00:00+00'),
('660e8400-e29b-41d4-a716-446655440003', 'MATH301 - Calculus I', 'Introduction to differential calculus including limits, derivatives, and applications.', '550e8400-e29b-41d4-a716-446655440003', 'Dr. Emily Smith', 'Mathematics', 'Grade 12', ARRAY['olivia.kim@student.edverse.edu', 'william.taylor@student.edverse.edu', 'emma.harris@student.edverse.edu', 'lucas.walker@student.edverse.edu'], '2024-01-15 13:00:00+00'),

-- Physics Courses
('660e8400-e29b-41d4-a716-446655440004', 'PHYS101 - Introduction to Physics', 'Basic principles of physics including mechanics, energy, and waves.', '550e8400-e29b-41d4-a716-446655440004', 'Prof. James Wilson', 'Physics', 'Grade 10', ARRAY['alex.thompson@student.edverse.edu', 'james.white@student.edverse.edu'], '2024-01-15 13:00:00+00'),
('660e8400-e29b-41d4-a716-446655440005', 'PHYS201 - Mechanics and Dynamics', 'Advanced study of classical mechanics including Newtonian dynamics and energy conservation.', '550e8400-e29b-41d4-a716-446655440004', 'Prof. James Wilson', 'Physics', 'Grade 11', ARRAY['sophia.rodriguez@student.edverse.edu'], '2024-01-15 13:00:00+00'),
('660e8400-e29b-41d4-a716-446655440006', 'PHYS301 - Advanced Physics', 'Advanced topics in physics including thermodynamics, electromagnetism, and modern physics.', '550e8400-e29b-41d4-a716-446655440004', 'Prof. James Wilson', 'Physics', 'Grade 12', ARRAY['olivia.kim@student.edverse.edu', 'william.taylor@student.edverse.edu', 'emma.harris@student.edverse.edu'], '2024-01-15 13:00:00+00'),

-- English Courses
('660e8400-e29b-41d4-a716-446655440007', 'ENG101 - English Composition', 'Fundamental writing skills including essay structure, grammar, and critical thinking.', '550e8400-e29b-41d4-a716-446655440005', 'Ms. Maria Garcia', 'English Literature', 'Grade 10', ARRAY['alex.thompson@student.edverse.edu', 'ethan.patel@student.edverse.edu'], '2024-01-15 13:00:00+00'),
('660e8400-e29b-41d4-a716-446655440008', 'ENG201 - Creative Writing', 'Advanced writing techniques including fiction, poetry, and creative expression.', '550e8400-e29b-41d4-a716-446655440005', 'Ms. Maria Garcia', 'English Literature', 'Grade 11', ARRAY['noah.anderson@student.edverse.edu', 'isabella.clark@student.edverse.edu', 'benjamin.lewis@student.edverse.edu'], '2024-01-15 13:00:00+00'),
('660e8400-e29b-41d4-a716-446655440009', 'ENG301 - Advanced Literature', 'Study of classic and contemporary literature with critical analysis and interpretation.', '550e8400-e29b-41d4-a716-446655440005', 'Ms. Maria Garcia', 'English Literature', 'Grade 12', ARRAY['william.taylor@student.edverse.edu', 'lucas.walker@student.edverse.edu'], '2024-01-15 13:00:00+00'),

-- Computer Science Courses
('660e8400-e29b-41d4-a716-446655440010', 'CS101 - Introduction to Programming', 'Basic programming concepts using Python including variables, loops, and functions.', '550e8400-e29b-41d4-a716-446655440006', 'Mr. David Brown', 'Computer Science', 'Grade 10', ARRAY['ava.martinez@student.edverse.edu', 'mia.robinson@student.edverse.edu'], '2024-01-15 13:00:00+00'),
('660e8400-e29b-41d4-a716-446655440011', 'CS201 - Data Structures', 'Advanced programming concepts including data structures, algorithms, and object-oriented programming.', '550e8400-e29b-41d4-a716-446655440006', 'Mr. David Brown', 'Computer Science', 'Grade 11', ARRAY['sophia.rodriguez@student.edverse.edu', 'isabella.clark@student.edverse.edu', 'benjamin.lewis@student.edverse.edu'], '2024-01-15 13:00:00+00'),
('660e8400-e29b-41d4-a716-446655440012', 'CS301 - Advanced Computer Science', 'Advanced topics including software engineering, databases, and web development.', '550e8400-e29b-41d4-a716-446655440006', 'Mr. David Brown', 'Computer Science', 'Grade 12', ARRAY['olivia.kim@student.edverse.edu', 'emma.harris@student.edverse.edu'], '2024-01-15 13:00:00+00'),

-- Biology Courses
('660e8400-e29b-41d4-a716-446655440013', 'BIO101 - Introduction to Biology', 'Basic biological concepts including cell structure, genetics, and evolution.', '550e8400-e29b-41d4-a716-446655440007', 'Dr. Jennifer Lee', 'Biology', 'Grade 10', ARRAY['ethan.patel@student.edverse.edu', 'ava.martinez@student.edverse.edu', 'james.white@student.edverse.edu', 'mia.robinson@student.edverse.edu'], '2024-01-15 13:00:00+00'),
('660e8400-e29b-41d4-a716-446655440014', 'BIO201 - Advanced Biology', 'Advanced biological concepts including molecular biology, ecology, and human anatomy.', '550e8400-e29b-41d4-a716-446655440007', 'Dr. Jennifer Lee', 'Biology', 'Grade 12', ARRAY['benjamin.lewis@student.edverse.edu', 'lucas.walker@student.edverse.edu'], '2024-01-15 13:00:00+00'),

-- Chemistry Course
('660e8400-e29b-41d4-a716-446655440015', 'CHEM101 - Introduction to Chemistry', 'Basic chemical concepts including atomic structure, bonding, and reactions.', '550e8400-e29b-41d4-a716-446655440007', 'Dr. Jennifer Lee', 'Chemistry', 'Grade 11', ARRAY['noah.anderson@student.edverse.edu', 'isabella.clark@student.edverse.edu'], '2024-01-15 13:00:00+00');

-- =====================================================
-- NOTIFICATIONS TABLE SAMPLE DATA
-- =====================================================

INSERT INTO notifications (id, title, message, type, target_role, created_by, is_active, created_at) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'Welcome to EdVerse!', 'Welcome to the new academic year. Please review your course schedules and check for any updates.', 'info', 'Student', '550e8400-e29b-41d4-a716-446655440001', true, '2024-01-15 14:00:00+00'),
('770e8400-e29b-41d4-a716-446655440002', 'Faculty Meeting Reminder', 'Monthly faculty meeting scheduled for Friday at 3:00 PM in the conference room.', 'info', 'Instructor', '550e8400-e29b-41d4-a716-446655440001', true, '2024-01-15 14:00:00+00'),
('770e8400-e29b-41d4-a716-446655440003', 'Parent-Teacher Conference', 'Parent-teacher conferences will be held next week. Please schedule your appointments.', 'info', 'Parent', '550e8400-e29b-41d4-a716-446655440001', true, '2024-01-15 14:00:00+00'),
('770e8400-e29b-41d4-a716-446655440004', 'System Maintenance', 'The EdVerse platform will be under maintenance this weekend. Please save your work.', 'warning', 'Student', '550e8400-e29b-41d4-a716-446655440001', true, '2024-01-15 14:00:00+00'),
('770e8400-e29b-41d4-a716-446655440005', 'Assignment Due Reminder', 'Your MATH101 assignment is due tomorrow. Please submit before the deadline.', 'warning', 'Student', '550e8400-e29b-41d4-a716-446655440003', true, '2024-01-15 14:00:00+00'),
('770e8400-e29b-41d4-a716-446655440006', 'Grade Update', 'Your grades have been updated. Please check your academic dashboard.', 'success', 'Student', '550e8400-e29b-41d4-a716-446655440003', true, '2024-01-15 14:00:00+00'),
('770e8400-e29b-41d4-a716-446655440007', 'Emergency Alert', 'Due to weather conditions, all classes are cancelled today.', 'error', 'Student', '550e8400-e29b-41d4-a716-446655440001', true, '2024-01-15 14:00:00+00');

-- =====================================================
-- ASSIGNMENTS TABLE SAMPLE DATA
-- =====================================================

INSERT INTO assignments (id, title, description, course_id, instructor_id, due_date, max_score, created_at) VALUES
('880e8400-e29b-41d4-a716-446655440001', 'Algebra Quiz 1', 'Quiz covering linear equations and inequalities', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', '2024-02-15 23:59:00+00', 100.00, '2024-01-20 10:00:00+00'),
('880e8400-e29b-41d4-a716-446655440002', 'Physics Lab Report', 'Lab report on motion and velocity experiments', '660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', '2024-02-20 23:59:00+00', 50.00, '2024-01-20 10:00:00+00'),
('880e8400-e29b-41d4-a716-446655440003', 'Essay Assignment', 'Write a 1000-word essay on a topic of your choice', '660e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440005', '2024-02-25 23:59:00+00', 100.00, '2024-01-20 10:00:00+00'),
('880e8400-e29b-41d4-a716-446655440004', 'Programming Project', 'Create a simple calculator program in Python', '660e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440006', '2024-02-28 23:59:00+00', 75.00, '2024-01-20 10:00:00+00'),
('880e8400-e29b-41d4-a716-446655440005', 'Biology Research Paper', 'Research paper on cell biology and genetics', '660e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440007', '2024-03-05 23:59:00+00', 150.00, '2024-01-20 10:00:00+00');

-- =====================================================
-- GRADES TABLE SAMPLE DATA
-- =====================================================

INSERT INTO grades (id, student_id, course_id, instructor_id, assignment_id, score, max_score, graded_at, created_at) VALUES
('990e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440008', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440001', 85.00, 100.00, '2024-02-16 14:30:00+00', '2024-02-16 14:30:00+00'),
('990e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440010', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440001', 92.00, 100.00, '2024-02-16 14:30:00+00', '2024-02-16 14:30:00+00'),
('990e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440008', '660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', '880e8400-e29b-41d4-a716-446655440002', 45.00, 50.00, '2024-02-21 16:00:00+00', '2024-02-21 16:00:00+00'),
('990e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440008', '660e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440005', '880e8400-e29b-41d4-a716-446655440003', 88.00, 100.00, '2024-02-26 12:00:00+00', '2024-02-26 12:00:00+00'),
('990e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440013', '660e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440006', '880e8400-e29b-41d4-a716-446655440004', 70.00, 75.00, '2024-03-01 15:30:00+00', '2024-03-01 15:30:00+00');

-- =====================================================
-- ATTENDANCE TABLE SAMPLE DATA
-- =====================================================

INSERT INTO attendance (id, student_id, course_id, instructor_id, date, status, notes, created_at) VALUES
('aa0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440008', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', '2024-01-15', 'present', NULL, '2024-01-15 09:00:00+00'),
('aa0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440010', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', '2024-01-15', 'present', NULL, '2024-01-15 09:00:00+00'),
('aa0e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440008', '660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', '2024-01-15', 'present', NULL, '2024-01-15 10:00:00+00'),
('aa0e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440016', '660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', '2024-01-15', 'late', 'Arrived 10 minutes late', '2024-01-15 10:00:00+00'),
('aa0e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440008', '660e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440005', '2024-01-15', 'present', NULL, '2024-01-15 11:00:00+00'),
('aa0e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440010', '660e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440005', '2024-01-15', 'absent', 'Called in sick', '2024-01-15 11:00:00+00'),
('aa0e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440013', '660e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440006', '2024-01-15', 'present', NULL, '2024-01-15 12:00:00+00'),
('aa0e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440019', '660e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440006', '2024-01-15', 'present', NULL, '2024-01-15 12:00:00+00');

-- =====================================================
-- EVENTS TABLE SAMPLE DATA
-- =====================================================

INSERT INTO events (id, title, description, event_date, end_date, location, created_by, created_at) VALUES
('bb0e8400-e29b-41d4-a716-446655440001', 'Back to School Night', 'Annual back to school night for parents and students to meet teachers', '2024-01-25 18:00:00+00', '2024-01-25 20:00:00+00', 'Main Auditorium', '550e8400-e29b-41d4-a716-446655440001', '2024-01-15 15:00:00+00'),
('bb0e8400-e29b-41d4-a716-446655440002', 'Science Fair', 'Annual science fair showcasing student projects and experiments', '2024-02-15 14:00:00+00', '2024-02-15 17:00:00+00', 'Gymnasium', '550e8400-e29b-41d4-a716-446655440001', '2024-01-15 15:00:00+00'),
('bb0e8400-e29b-41d4-a716-446655440003', 'Parent-Teacher Conference', 'Individual meetings between parents and teachers to discuss student progress', '2024-02-28 16:00:00+00', '2024-02-28 19:00:00+00', 'Classrooms', '550e8400-e29b-41d4-a716-446655440001', '2024-01-15 15:00:00+00'),
('bb0e8400-e29b-41d4-a716-446655440004', 'Spring Concert', 'Annual spring music concert featuring student performances', '2024-03-20 19:00:00+00', '2024-03-20 21:00:00+00', 'Main Auditorium', '550e8400-e29b-41d4-a716-446655440001', '2024-01-15 15:00:00+00'),
('bb0e8400-e29b-41d4-a716-446655440005', 'Graduation Ceremony', 'Class of 2024 graduation ceremony', '2024-06-15 14:00:00+00', '2024-06-15 16:00:00+00', 'Football Stadium', '550e8400-e29b-41d4-a716-446655440001', '2024-01-15 15:00:00+00');

-- =====================================================
-- MESSAGES TABLE SAMPLE DATA
-- =====================================================

INSERT INTO messages (id, sender_id, recipient_id, subject, content, is_read, created_at) VALUES
('cc0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440008', 'Assignment Extension Request', 'Hi Alex, I understand you need more time for the algebra quiz. I can extend the deadline by 2 days. Please let me know if this works for you.', false, '2024-01-16 10:00:00+00'),
('cc0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440003', 'Re: Assignment Extension Request', 'Thank you Dr. Smith! That would be very helpful. I will submit it by the extended deadline.', true, '2024-01-16 11:00:00+00'),
('cc0e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440016', 'Physics Lab Schedule', 'Hi James, I wanted to confirm our physics lab session for tomorrow. We will be conducting the motion experiments. Please bring your lab notebook.', false, '2024-01-16 14:00:00+00'),
('cc0e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440010', 'Essay Feedback', 'Hi Ethan, I have reviewed your essay and provided detailed feedback. You can find my comments in the document. Great work on the structure!', false, '2024-01-16 16:00:00+00'),
('cc0e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440013', 'Programming Project Help', 'Hi Ava, I noticed you might need some help with the Python calculator project. I am available for office hours tomorrow if you would like to discuss it.', false, '2024-01-16 17:00:00+00');

-- =====================================================
-- SUBMISSIONS TABLE SAMPLE DATA
-- =====================================================

INSERT INTO submissions (id, assignment_id, student_id, instructor_id, content, submitted_at, grade, feedback, created_at) VALUES
('dd0e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440003', 'Completed algebra quiz with solutions for all problems. Showed good understanding of linear equations.', '2024-02-15 22:30:00+00', 85.00, 'Good work! Minor errors in problem 3 and 7. Review quadratic formula.', '2024-02-15 22:30:00+00'),
('dd0e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440003', 'Excellent work on the algebra quiz. All problems solved correctly with clear explanations.', '2024-02-15 21:45:00+00', 92.00, 'Outstanding work! Your solutions are very clear and well-organized.', '2024-02-15 21:45:00+00'),
('dd0e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440004', 'Lab report on motion experiments. Included data analysis and conclusions.', '2024-02-20 23:15:00+00', 45.00, 'Good data collection. Need to improve analysis section and include error calculations.', '2024-02-20 23:15:00+00'),
('dd0e8400-e29b-41d4-a716-446655440004', '880e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440005', 'Essay on the impact of technology on education. Well-structured with good arguments.', '2024-02-25 22:00:00+00', 88.00, 'Excellent essay! Strong arguments and good use of evidence. Minor grammar issues.', '2024-02-25 22:00:00+00'),
('dd0e8400-e29b-41d4-a716-446655440005', '880e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440006', 'Python calculator program with basic arithmetic operations. Code is functional but could be more efficient.', '2024-02-28 23:45:00+00', 70.00, 'Good functionality! Consider adding input validation and error handling for better user experience.', '2024-02-28 23:45:00+00');

-- =====================================================
-- SAMPLE DATA INSERTION COMPLETE
-- =====================================================

-- This completes the sample data insertion for all EdVerse tables.
-- The data includes:
-- - 22 users (2 admins, 5 instructors, 13 students, 2 parents)
-- - 5 instructors with their subjects and courses
-- - 13 students with their grades and enrolled courses
-- - 15 courses across different subjects and grade levels
-- - 7 notifications of various types
-- - 5 assignments with due dates
-- - 5 grades with scores and feedback
-- - 8 attendance records
-- - 5 school events
-- - 5 internal messages
-- - 5 assignment submissions

-- All data is interconnected with proper foreign key relationships
-- and realistic academic scenarios for a comprehensive LMS demonstration.
