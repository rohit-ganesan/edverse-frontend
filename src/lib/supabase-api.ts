import React from 'react';
import { supabase } from './supabase';

// Base URL for Supabase Edge Functions
const getEdgeFunctionUrl = (functionName: string) => {
  const supabaseUrl = process.env.REACT_APP_SUPABASE_URL!;
  return `${supabaseUrl}/functions/v1/${functionName}`;
};

// Helper function to call Edge Functions
const callEdgeFunction = async (functionName: string, data?: any) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('No active session');
  }

  const response = await fetch(getEdgeFunctionUrl(functionName), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
    },
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`
    );
  }

  return response.json();
};

// Dashboard Statistics Interface
export interface DashboardStats {
  totalStudents: number;
  totalInstructors: number;
  totalCourses: number;
  totalAdmins: number;
  activeStudents?: number;
  activeCourses?: number;
  recentNotifications?: number;
}

// User Profile Interface
export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: 'Administrator' | 'Instructor' | 'Student';
  address?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

// Course Interface
export interface Course {
  id: string;
  name: string;
  description: string;
  instructor_id: string;
  instructor_name: string;
  subject: string;
  grade?: string;
  students: string[];
  max_students?: number;
  start_date?: string;
  end_date?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Student Interface
export interface Student {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  grade: string;
  enrolled_courses: string[];
  created_at: string;
  updated_at: string;
}

// Instructor Interface
export interface Instructor {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  subjects: string[];
  courses: string[];
  created_at: string;
  updated_at: string;
}

// Notification Interface
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  target_role: 'Administrator' | 'Instructor' | 'Student' | 'all';
  target_users?: string[];
  created_by: string;
  is_active: boolean;
  expires_at?: string;
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
}

// Auth API functions
export const authAPI = {
  createUserProfile: async (userData: any) => {
    return callEdgeFunction('create-user-profile', { userData });
  },

  updateUserProfile: async (userId: string, profileData: any) => {
    return callEdgeFunction('update-user-profile', { userId, profileData });
  },

  // Additional user operations (will need Edge Functions)
  getUsers: async (role?: string) => {
    return callEdgeFunction('get-users', { role });
  },

  getUserById: async (id: string) => {
    return callEdgeFunction('get-user-by-id', { id });
  },

  deleteUser: async (id: string) => {
    return callEdgeFunction('delete-user', { id });
  },
};

// Course API functions
export const courseAPI = {
  createCourse: async (courseData: any) => {
    return callEdgeFunction('create-course', { courseData });
  },

  getUserCourses: async (filters?: any) => {
    return callEdgeFunction('get-user-courses', { filters });
  },

  getCourses: async (filters?: any) => {
    return callEdgeFunction('get-courses', { filters });
  },

  updateCourse: async (courseId: string, courseData: any) => {
    return callEdgeFunction('update-course', { courseId, courseData });
  },

  deleteCourse: async (courseId: string) => {
    return callEdgeFunction('delete-course', { courseId });
  },

  enrollStudentInCourse: async (studentId: string, courseId: string) => {
    return callEdgeFunction('enroll-student-in-course', {
      studentId,
      courseId,
    });
  },
};

// Student API functions
export const studentAPI = {
  getStudents: async (filters?: any) => {
    return callEdgeFunction('get-students', { filters });
  },

  createStudent: async (studentData: any) => {
    return callEdgeFunction('create-student', { studentData });
  },

  updateStudent: async (studentId: string, studentData: any) => {
    return callEdgeFunction('update-student', { studentId, studentData });
  },

  deleteStudent: async (studentId: string) => {
    return callEdgeFunction('delete-student', { studentId });
  },
};

// Instructor API functions
export const instructorAPI = {
  getInstructors: async (filters?: any) => {
    return callEdgeFunction('get-instructors', { filters });
  },

  createInstructor: async (instructorData: any) => {
    return callEdgeFunction('create-instructor', { instructorData });
  },

  updateInstructor: async (instructorId: string, instructorData: any) => {
    return callEdgeFunction('update-instructor', {
      instructorId,
      instructorData,
    });
  },

  deleteInstructor: async (instructorId: string) => {
    return callEdgeFunction('delete-instructor', { instructorId });
  },
};

// Dashboard API functions
export const dashboardAPI = {
  getDashboardStats: async (dateRange?: any) => {
    return callEdgeFunction('get-dashboard-stats', { dateRange });
  },
};

// Notification API functions
export const notificationAPI = {
  getNotifications: async (filters?: any) => {
    return callEdgeFunction('get-notifications', { filters });
  },

  createNotification: async (notificationData: any) => {
    return callEdgeFunction('create-notification', { notificationData });
  },

  updateNotification: async (notificationId: string, notificationData: any) => {
    return callEdgeFunction('update-notification', {
      notificationId,
      notificationData,
    });
  },

  deleteNotification: async (notificationId: string) => {
    return callEdgeFunction('delete-notification', { notificationId });
  },
};

// Health check
export const healthAPI = {
  checkHealth: async () => {
    return callEdgeFunction('health-check');
  },

  testConnection: async () => {
    return callEdgeFunction('test-connection');
  },
};

// Access and Monetization API
export const getAccessData = async (): Promise<{
  plan: string;
  role: string;
  features: string[];
  capabilities: string[];
}> => {
  try {
    const response = await callEdgeFunction('get-access-data', {});

    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch access data');
    }

    return response.data;
  } catch (error) {
    // Don't log error for "No active session" as it's expected for unauthenticated users
    if (error instanceof Error && error.message !== 'No active session') {
      console.error('Error fetching access data:', error);
    }

    // Return default access data on error
    return {
      plan: 'free',
      role: 'teacher',
      features: [
        'attendance.view',
        'attendance.mark',
        'results.view',
        'classes.view',
        'courses.view',
        'students.view',
        'fees.view_overview',
        'fees.structures.basic',
        'fees.record_manual',
        'notices.view',
        'notices.send',
        'org.manage',
        'staff.invite',
        'settings.integrations',
      ],
      capabilities: [
        'classes.view',
        'classes.take_attendance',
        'results.enter',
        'notices.send',
      ],
    };
  }
};

// Export all APIs
export const supabaseAPI = {
  auth: authAPI,
  course: courseAPI,
  student: studentAPI,
  instructor: instructorAPI,
  dashboard: dashboardAPI,
  notification: notificationAPI,
  health: healthAPI,
};

// React hook for API calls
export function useSupabaseQuery<T>(
  queryFn: () => Promise<T>,
  deps: any[] = []
): {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
} {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);
  const [retryCount, setRetryCount] = React.useState(0);
  const maxRetries = 2; // Maximum number of retries

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Add timeout to the request
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 10000); // 10 second timeout
      });

      const result = await Promise.race([queryFn(), timeoutPromise]);
      setData(result);
      setRetryCount(0); // Reset retry count on success
    } catch (err) {
      const error = err as Error;
      console.error('API call failed:', error);

      // Only retry if we haven't exceeded max retries
      if (retryCount < maxRetries) {
        setRetryCount((prev) => prev + 1);
        console.log(`Retrying... Attempt ${retryCount + 1}/${maxRetries}`);
        // Retry after a delay
        setTimeout(
          () => {
            fetchData();
          },
          1000 * (retryCount + 1)
        ); // Exponential backoff
        return;
      }

      setError(error);
    } finally {
      setLoading(false);
    }
  }, [queryFn, retryCount, maxRetries]); // Remove deps from here to prevent infinite loops

  React.useEffect(() => {
    fetchData();
  }, deps); // Only depend on the deps array, not fetchData

  return { data, loading, error, refetch: fetchData };
}

export default supabaseAPI;
