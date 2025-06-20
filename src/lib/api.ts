import { httpsCallable, HttpsCallable } from 'firebase/functions';
import { getFunctions } from 'firebase/functions';
import app from './firebase';

// =============================================================================
// React Hooks for API Integration
// =============================================================================

import { useState, useEffect } from 'react';

// Initialize Cloud Functions
const functions = getFunctions(app);

// Configure for local development if needed
if (process.env.NODE_ENV === 'development') {
  // Uncomment the line below to use local emulator
  // connectFunctionsEmulator(functions, 'localhost', 5001);
}

// Types
export interface DashboardStats {
  totalStudents: number;
  totalInstructors: number;
  totalCourses: number;
  totalAdmins: number;
}

export interface Course {
  id?: string;
  name: string;
  description: string;
  instructorId: string;
  instructorName: string;
  subject: string;
  grade: string;
  students: string[];
  createdAt: any;
  updatedAt: any;
}

export interface Student {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  grade: string;
  parentEmail?: string;
  enrolledCourses: string[];
  createdAt: any;
  updatedAt: any;
}

export interface Instructor {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  subjects: string[];
  courses: string[];
  createdAt: any;
  updatedAt: any;
}

export interface Notification {
  id?: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  targetRole: string;
  createdBy: string;
  createdAt: any;
  isActive: boolean;
}

// =============================================================================
// Cloud Functions References
// =============================================================================

// User Management Functions
const updateUserProfileFn: HttpsCallable = httpsCallable(
  functions,
  'updateUserProfile'
);
const getDashboardStatsFn: HttpsCallable = httpsCallable(
  functions,
  'getDashboardStats'
);

// Course Management Functions
const createCourseFn: HttpsCallable = httpsCallable(functions, 'createCourse');
const getUserCoursesFn: HttpsCallable = httpsCallable(
  functions,
  'getUserCourses'
);

// Student Management Functions
const getStudentsFn: HttpsCallable = httpsCallable(functions, 'getStudents');
const enrollStudentInCourseFn: HttpsCallable = httpsCallable(
  functions,
  'enrollStudentInCourse'
);

// Instructor Management Functions
const getInstructorsFn: HttpsCallable = httpsCallable(
  functions,
  'getInstructors'
);

// Notification Functions
const createNotificationFn: HttpsCallable = httpsCallable(
  functions,
  'createNotification'
);
const getUserNotificationsFn: HttpsCallable = httpsCallable(
  functions,
  'getUserNotifications'
);

// Test Function
const testFunctionFn: HttpsCallable = httpsCallable(functions, 'testFunction');

// =============================================================================
// API Service Class
// =============================================================================

export class ApiService {
  // =============================================================================
  // User Management
  // =============================================================================

  static async updateUserProfile(
    userId: string,
    profileData: any
  ): Promise<{ success: boolean }> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    if (!profileData || typeof profileData !== 'object') {
      throw new Error('Profile data is required and must be an object');
    }

    try {
      const result = await updateUserProfileFn({ userId, profileData });

      if (!result?.data) {
        throw new Error('No response data received from server');
      }

      return result.data as { success: boolean };
    } catch (error) {
      console.error('Error updating user profile:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to update user profile';
      throw new Error(errorMessage);
    }
  }

  static async getDashboardStats(): Promise<DashboardStats> {
    try {
      const result = await getDashboardStatsFn();

      if (!result?.data) {
        throw new Error('No response data received from server');
      }

      const responseData = result.data as { stats?: DashboardStats };

      if (!responseData.stats) {
        // Return default stats if none provided
        return {
          totalStudents: 0,
          totalInstructors: 0,
          totalCourses: 0,
          totalAdmins: 0,
        };
      }

      return responseData.stats;
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to get dashboard statistics';
      throw new Error(errorMessage);
    }
  }

  // =============================================================================
  // Course Management
  // =============================================================================

  static async createCourse(
    courseData: Omit<Course, 'id' | 'students' | 'createdAt' | 'updatedAt'>
  ): Promise<{ success: boolean; courseId: string }> {
    if (!courseData) {
      throw new Error('Course data is required');
    }

    if (!courseData.name?.trim()) {
      throw new Error('Course name is required');
    }

    if (!courseData.instructorId?.trim()) {
      throw new Error('Instructor ID is required');
    }

    try {
      const result = await createCourseFn({ courseData });

      if (!result?.data) {
        throw new Error('No response data received from server');
      }

      return result.data as { success: boolean; courseId: string };
    } catch (error) {
      console.error('Error creating course:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to create course';
      throw new Error(errorMessage);
    }
  }

  static async getUserCourses(): Promise<Course[]> {
    try {
      const result = await getUserCoursesFn();

      if (!result?.data) {
        console.warn('No response data received from getUserCourses');
        return [];
      }

      const responseData = result.data as { courses?: Course[] };
      return responseData.courses || [];
    } catch (error) {
      console.error('Error getting user courses:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to get courses';
      throw new Error(errorMessage);
    }
  }

  // =============================================================================
  // Student Management
  // =============================================================================

  static async getStudents(): Promise<Student[]> {
    try {
      const result = await getStudentsFn();

      if (!result?.data) {
        console.warn('No response data received from getStudents');
        return [];
      }

      const responseData = result.data as { students?: Student[] };
      return responseData.students || [];
    } catch (error) {
      console.error('Error getting students:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to get students';
      throw new Error(errorMessage);
    }
  }

  static async enrollStudentInCourse(
    studentId: string,
    courseId: string
  ): Promise<{ success: boolean }> {
    if (!studentId?.trim()) {
      throw new Error('Student ID is required');
    }

    if (!courseId?.trim()) {
      throw new Error('Course ID is required');
    }

    try {
      const result = await enrollStudentInCourseFn({ studentId, courseId });

      if (!result?.data) {
        throw new Error('No response data received from server');
      }

      return result.data as { success: boolean };
    } catch (error) {
      console.error('Error enrolling student in course:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to enroll student in course';
      throw new Error(errorMessage);
    }
  }

  // =============================================================================
  // Instructor Management
  // =============================================================================

  static async getInstructors(): Promise<Instructor[]> {
    try {
      const result = await getInstructorsFn();

      if (!result?.data) {
        console.warn('No response data received from getInstructors');
        return [];
      }

      const responseData = result.data as { instructors?: Instructor[] };
      return responseData.instructors || [];
    } catch (error) {
      console.error('Error getting instructors:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to get instructors';
      throw new Error(errorMessage);
    }
  }

  // =============================================================================
  // Migration Functions
  // =============================================================================

  static async runTeacherToInstructorMigration(): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const migrationFn = httpsCallable(
        functions,
        'runTeacherToInstructorMigration'
      );
      const result = await migrationFn();

      if (!result?.data) {
        throw new Error('No response data received from migration');
      }

      return result.data as { success: boolean; message: string };
    } catch (error) {
      console.error('Error running teacher to instructor migration:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to run migration';
      throw new Error(errorMessage);
    }
  }

  // =============================================================================
  // Notification Management
  // =============================================================================

  static async createNotification(
    title: string,
    message: string,
    type: 'info' | 'warning' | 'success' | 'error' = 'info',
    targetRole: string = 'all'
  ): Promise<{ success: boolean; notificationId: string }> {
    if (!title?.trim()) {
      throw new Error('Notification title is required');
    }

    if (!message?.trim()) {
      throw new Error('Notification message is required');
    }

    try {
      const result = await createNotificationFn({
        title: title.trim(),
        message: message.trim(),
        type,
        targetRole: targetRole.trim(),
      });

      if (!result?.data) {
        throw new Error('No response data received from server');
      }

      return result.data as { success: boolean; notificationId: string };
    } catch (error) {
      console.error('Error creating notification:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to create notification';
      throw new Error(errorMessage);
    }
  }

  static async getUserNotifications(): Promise<Notification[]> {
    try {
      const result = await getUserNotificationsFn();

      if (!result?.data) {
        console.warn('No response data received from getUserNotifications');
        return [];
      }

      const responseData = result.data as { notifications?: Notification[] };
      return responseData.notifications || [];
    } catch (error) {
      console.error('Error getting user notifications:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to get notifications';
      throw new Error(errorMessage);
    }
  }

  // =============================================================================
  // Test Functions
  // =============================================================================

  /**
   * Test connection to Firebase Cloud Functions
   * @param testData Optional test data to send
   * @returns Promise with test result
   */
  static async testConnection(
    testData?: any
  ): Promise<{ message: string; timestamp: string; data?: any }> {
    try {
      const result = await testFunctionFn(testData || {});

      if (!result?.data) {
        return {
          message: 'Connection successful but no data returned',
          timestamp: new Date().toISOString(),
        };
      }

      return result.data as { message: string; timestamp: string; data?: any };
    } catch (error) {
      console.error('Error testing connection:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Connection test failed';
      throw new Error(errorMessage);
    }
  }

  // =============================================================================
  // Initialization Functions
  // =============================================================================

  /**
   * Initialize user data and collections
   * @returns Promise with initialization result
   */
  static async initializeUserData(): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const initializeFn = httpsCallable(functions, 'initializeUserData');
      const result = await initializeFn();

      if (!result?.data) {
        throw new Error('No response data received from initialization');
      }

      return result.data as { success: boolean; message: string };
    } catch (error) {
      console.error('Error initializing user data:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to initialize user data';
      throw new Error(errorMessage);
    }
  }
}

// =============================================================================
// Error Handling
// =============================================================================

export class ApiError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleApiError = (error: any): ApiError => {
  if (error instanceof ApiError) {
    return error;
  }

  let message = 'An unexpected error occurred';
  let code: string | undefined;
  let details: any;

  if (error?.code) {
    code = error.code;
    message = error.message || message;
  } else if (error?.message) {
    message = error.message;
  } else if (typeof error === 'string') {
    message = error;
  }

  if (error?.details) {
    details = error.details;
  }

  return new ApiError(message, code, details);
};

// =============================================================================
// React Hook for API Calls
// =============================================================================

export const useApiCall = <T>(
  apiFunction: () => Promise<T>,
  dependencies: any[] = []
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!apiFunction || typeof apiFunction !== 'function') {
        throw new Error('Invalid API function provided');
      }

      const result = await apiFunction();
      setData(result);
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
      console.error('API call failed:', apiError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  const refetch = async () => {
    await fetchData();
  };

  return { data, loading, error, refetch };
};

export default ApiService;
