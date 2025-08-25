import { createClient } from '@supabase/supabase-js';

// Test configuration for Supabase
const supabaseTestUrl =
  process.env.REACT_APP_SUPABASE_TEST_URL || 'http://localhost:54321';
const supabaseTestAnonKey =
  process.env.REACT_APP_SUPABASE_TEST_ANON_KEY || 'your-test-anon-key';

// Create test client
export const supabaseTest = createClient(supabaseTestUrl, supabaseTestAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Test utilities
export const testUtils = {
  // Clear all test data
  async clearTestData() {
    const tables = [
      'user_profiles',
      'courses',
      'students',
      'instructors',
      'notifications',
      'auth.users',
    ];

    for (const table of tables) {
      try {
        await supabaseTest
          .from(table)
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000');
      } catch (error) {
        console.warn(`Could not clear table ${table}:`, error);
      }
    }
  },

  // Create test user
  async createTestUser(userData: {
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
    role?: string;
  }) {
    const { data: authData, error: authError } = await supabaseTest.auth.signUp(
      {
        email: userData.email,
        password: userData.password,
      }
    );

    if (authError) throw authError;

    if (authData.user) {
      const { error: profileError } = await supabaseTest
        .from('user_profiles')
        .insert({
          id: authData.user.id,
          email: userData.email,
          first_name: userData.first_name || 'Test',
          last_name: userData.last_name || 'User',
          role: userData.role || 'Student',
        });

      if (profileError) throw profileError;
    }

    return authData;
  },

  // Sign in test user
  async signInTestUser(email: string, password: string) {
    const { data, error } = await supabaseTest.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  // Sign out test user
  async signOutTestUser() {
    const { error } = await supabaseTest.auth.signOut();
    if (error) throw error;
  },

  // Get test user profile
  async getTestUserProfile(userId: string) {
    const { data, error } = await supabaseTest
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  // Create test course
  async createTestCourse(courseData: {
    title: string;
    description?: string;
    instructor_id?: string;
    credits?: number;
  }) {
    const { data, error } = await supabaseTest
      .from('courses')
      .insert({
        title: courseData.title,
        description: courseData.description || 'Test course description',
        instructor_id: courseData.instructor_id || null,
        credits: courseData.credits || 3,
        status: 'active',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Create test notification
  async createTestNotification(notificationData: {
    title: string;
    message: string;
    type?: string;
    target_role?: string;
  }) {
    const { data, error } = await supabaseTest
      .from('notifications')
      .insert({
        title: notificationData.title,
        message: notificationData.message,
        type: notificationData.type || 'info',
        priority: 'normal',
        target_role: notificationData.target_role || null,
        read_by: [],
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// Test setup and teardown helpers
export const testSetup = {
  async beforeAll() {
    // Clear any existing test data
    await testUtils.clearTestData();
  },

  async afterAll() {
    // Clean up test data
    await testUtils.clearTestData();
  },

  async beforeEach() {
    // Sign out any existing user
    await testUtils.signOutTestUser();
  },

  async afterEach() {
    // Sign out after each test
    await testUtils.signOutTestUser();
  },
};

// Mock data generators
export const mockData = {
  users: [
    {
      email: 'test.student@example.com',
      password: 'testpassword123',
      first_name: 'Test',
      last_name: 'Student',
      role: 'Student',
    },
    {
      email: 'test.instructor@example.com',
      password: 'testpassword123',
      first_name: 'Test',
      last_name: 'Instructor',
      role: 'Instructor',
    },
    {
      email: 'test.admin@example.com',
      password: 'testpassword123',
      first_name: 'Test',
      last_name: 'Admin',
      role: 'Administrator',
    },
  ],

  courses: [
    {
      title: 'Introduction to Computer Science',
      description: 'Learn the basics of programming and computer science',
      credits: 3,
    },
    {
      title: 'Advanced Mathematics',
      description: 'Advanced mathematical concepts and applications',
      credits: 4,
    },
    {
      title: 'English Literature',
      description: 'Study of classic and contemporary literature',
      credits: 3,
    },
  ],

  notifications: [
    {
      title: 'Welcome to EdVerse',
      message: 'Welcome to your new learning management system!',
      type: 'info',
    },
    {
      title: 'Course Registration Open',
      message: 'Course registration for the new semester is now open.',
      type: 'announcement',
      target_role: 'Student',
    },
  ],
};

export default {
  supabaseTest,
  testUtils,
  testSetup,
  mockData,
};
