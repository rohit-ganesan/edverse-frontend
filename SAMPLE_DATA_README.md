# 📚 EdVerse Sample Data

This document explains how to populate your EdVerse Supabase database with realistic sample data for testing and demonstration purposes.

## 🎯 Overview

The `sample-data.sql` file contains comprehensive sample data for all EdVerse database tables, providing a realistic academic environment with:

- **22 Users**: Administrators, instructors, students, and parents
- **15 Courses**: Across multiple subjects and grade levels
- **Complete Academic Records**: Grades, attendance, assignments, and submissions
- **School Events**: Calendar events and activities
- **Communication**: Internal messages and notifications

## 🚀 How to Use

### Step 1: Access Supabase SQL Editor

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your EdVerse project
3. Navigate to **SQL Editor** in the left sidebar
4. Click **New Query**

### Step 2: Run the Sample Data

1. Copy the entire contents of `sample-data.sql`
2. Paste it into the SQL Editor
3. Click **Run** to execute all the INSERT statements

### Step 3: Verify Data

1. Go to **Table Editor** in your Supabase dashboard
2. Check each table to confirm data has been inserted:
   - `users` - Should have 22 records
   - `instructors` - Should have 5 records
   - `students` - Should have 13 records
   - `courses` - Should have 15 records
   - `notifications` - Should have 7 records
   - `assignments` - Should have 5 records
   - `grades` - Should have 5 records
   - `attendance` - Should have 8 records
   - `events` - Should have 5 records
   - `messages` - Should have 5 records
   - `submissions` - Should have 5 records

## 📊 Sample Data Structure

### 👥 Users (22 total)

#### Administrators (2)
- **Sarah Johnson** (`admin@edverse.edu`) - Main administrator
- **Michael Chen** (`director@edverse.edu`) - Director

#### Instructors (5)
- **Dr. Emily Smith** - Mathematics (Algebra, Calculus, Linear Algebra)
- **Prof. James Wilson** - Physics (Mechanics, Thermodynamics)
- **Ms. Maria Garcia** - English Literature (Creative Writing, Poetry)
- **Mr. David Brown** - Computer Science (Programming, Data Structures)
- **Dr. Jennifer Lee** - Biology & Chemistry (Anatomy, Molecular Biology)

#### Students (13)
- **Grade 10**: Alex Thompson, Ethan Patel, Ava Martinez, James White, Mia Robinson
- **Grade 11**: Sophia Rodriguez, Noah Anderson, Isabella Clark, Benjamin Lewis
- **Grade 12**: Olivia Kim, William Taylor, Emma Harris, Lucas Walker

#### Parents (2)
- **Robert Thompson** - Parent of Alex Thompson
- **Carmen Rodriguez** - Parent of Sophia Rodriguez

### 📚 Courses (15 total)

#### Mathematics (3 courses)
- **MATH101** - Introduction to Algebra (Grade 10)
- **MATH201** - Advanced Algebra (Grade 11)
- **MATH301** - Calculus I (Grade 12)

#### Physics (3 courses)
- **PHYS101** - Introduction to Physics (Grade 10)
- **PHYS201** - Mechanics and Dynamics (Grade 11)
- **PHYS301** - Advanced Physics (Grade 12)

#### English Literature (3 courses)
- **ENG101** - English Composition (Grade 10)
- **ENG201** - Creative Writing (Grade 11)
- **ENG301** - Advanced Literature (Grade 12)

#### Computer Science (3 courses)
- **CS101** - Introduction to Programming (Grade 10)
- **CS201** - Data Structures (Grade 11)
- **CS301** - Advanced Computer Science (Grade 12)

#### Biology & Chemistry (3 courses)
- **BIO101** - Introduction to Biology (Grade 10)
- **BIO201** - Advanced Biology (Grade 12)
- **CHEM101** - Introduction to Chemistry (Grade 11)

### 📋 Academic Records

#### Assignments (5)
- Algebra Quiz 1 (MATH101)
- Physics Lab Report (PHYS101)
- Essay Assignment (ENG101)
- Programming Project (CS101)
- Biology Research Paper (BIO101)

#### Grades (5)
- Sample grades with realistic scores and feedback
- Connected to specific assignments and students

#### Attendance (8)
- Various attendance statuses (present, absent, late, excused)
- Realistic notes and scenarios

### 📅 Events (5)
- Back to School Night
- Science Fair
- Parent-Teacher Conference
- Spring Concert
- Graduation Ceremony

### 💬 Communication
- **Notifications (7)**: Various types (info, success, warning, error)
- **Messages (5)**: Internal communication between users

## 🔗 Data Relationships

All data is properly interconnected with:

- **Foreign Key Relationships**: Students linked to courses, grades linked to assignments
- **Realistic Scenarios**: Academic situations like late assignments, attendance issues
- **Proper Timestamps**: Chronological order of events and submissions
- **Role-Based Access**: Data structured for different user roles

## 🧪 Testing Scenarios

This sample data enables testing of:

### For Students
- View enrolled courses and assignments
- Check grades and attendance
- Submit assignments
- Send/receive messages
- View notifications

### For Instructors
- Manage course content
- Grade assignments
- Track attendance
- Communicate with students
- Create notifications

### For Administrators
- View all user data
- Manage courses and enrollments
- Monitor academic performance
- Create school-wide events
- Send system notifications

## 🚨 Important Notes

### Authentication
- **Sample users do NOT have authentication accounts**
- You'll need to create actual Supabase Auth users for testing
- Use the email addresses from the sample data to create auth accounts

### Data Integrity
- All foreign key relationships are maintained
- UUIDs are consistent across related records
- Timestamps follow a logical chronological order

### Customization
- Feel free to modify the data to match your specific needs
- Add more records or change existing ones as required
- Update email addresses to match your domain

## 🔄 Resetting Data

To clear all sample data and start fresh:

```sql
-- Clear all tables (run in reverse dependency order)
DELETE FROM submissions;
DELETE FROM grades;
DELETE FROM attendance;
DELETE FROM assignments;
DELETE FROM messages;
DELETE FROM events;
DELETE FROM notifications;
DELETE FROM courses;
DELETE FROM students;
DELETE FROM instructors;
DELETE FROM users;
```

## 📈 Next Steps

After populating the sample data:

1. **Create Auth Users**: Set up Supabase Auth accounts for testing
2. **Test Edge Functions**: Verify all API endpoints work with the data
3. **Test Frontend**: Ensure all components display data correctly
4. **Customize**: Modify data to match your specific requirements

## 🎉 Success!

Once the sample data is loaded, your EdVerse application will have a fully functional academic environment with realistic data for comprehensive testing and demonstration.

---

**Need Help?** Check the main [README.md](./README.md) for additional setup instructions and troubleshooting.
