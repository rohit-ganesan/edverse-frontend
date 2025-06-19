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
  totalTeachers: number;
  totalCourses: number;
  totalAdmins: number;
}

export interface Course {
  id?: string;
  name: string;
  description: string;
  teacherId: string;
  teacherName: string;
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

export interface Teacher {
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

// Teacher Management Functions
const getTeachersFn: HttpsCallable = httpsCallable(functions, 'getTeachers');

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
    try {
      const result = await updateUserProfileFn({ userId, profileData });
      return result.data as { success: boolean };
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw new Error('Failed to update user profile');
    }
  }

  static async getDashboardStats(): Promise<DashboardStats> {
    try {
      const result = await getDashboardStatsFn();
      return (result.data as { stats: DashboardStats }).stats;
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      throw new Error('Failed to get dashboard statistics');
    }
  }

  // =============================================================================
  // Course Management
  // =============================================================================

  static async createCourse(
    courseData: Omit<Course, 'id' | 'students' | 'createdAt' | 'updatedAt'>
  ): Promise<{ success: boolean; courseId: string }> {
    try {
      const result = await createCourseFn({ courseData });
      return result.data as { success: boolean; courseId: string };
    } catch (error) {
      console.error('Error creating course:', error);
      throw new Error('Failed to create course');
    }
  }

  static async getUserCourses(): Promise<Course[]> {
    try {
      const result = await getUserCoursesFn();
      return (result.data as { courses: Course[] }).courses;
    } catch (error) {
      console.error('Error getting user courses:', error);
      throw new Error('Failed to get courses');
    }
  }

  // =============================================================================
  // Student Management
  // =============================================================================

  static async getStudents(): Promise<Student[]> {
    try {
      const result = await getStudentsFn();
      return (result.data as { students: Student[] }).students;
    } catch (error) {
      console.error('Error getting students:', error);
      throw new Error('Failed to get students');
    }
  }

  static async enrollStudentInCourse(
    studentId: string,
    courseId: string
  ): Promise<{ success: boolean }> {
    try {
      const result = await enrollStudentInCourseFn({ studentId, courseId });
      return result.data as { success: boolean };
    } catch (error) {
      console.error('Error enrolling student in course:', error);
      throw new Error('Failed to enroll student in course');
    }
  }

  // =============================================================================
  // Teacher Management
  // =============================================================================

  static async getTeachers(): Promise<Teacher[]> {
    try {
      const result = await getTeachersFn();
      return (result.data as { teachers: Teacher[] }).teachers;
    } catch (error) {
      console.error('Error getting teachers:', error);
      throw new Error('Failed to get teachers');
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
    try {
      const result = await createNotificationFn({
        title,
        message,
        type,
        targetRole,
      });
      return result.data as { success: boolean; notificationId: string };
    } catch (error) {
      console.error('Error creating notification:', error);
      throw new Error('Failed to create notification');
    }
  }

  static async getUserNotifications(): Promise<Notification[]> {
    try {
      const result = await getUserNotificationsFn();
      return (result.data as { notifications: Notification[] }).notifications;
    } catch (error: any) {
      console.error('Error getting notifications:', error);

      // Log more detailed error information for debugging
      if (error.code) {
        console.error('Error code:', error.code);
      }
      if (error.details) {
        console.error('Error details:', error.details);
      }

      // Provide more specific error messages based on error type
      if (error.code === 'functions/unauthenticated') {
        throw new Error('Please sign in to view notifications');
      } else if (error.code === 'functions/not-found') {
        throw new Error('Notification service is not available');
      } else if (error.code === 'functions/internal') {
        throw new Error('Server error occurred while fetching notifications');
      } else if (error.code === 'functions/unavailable') {
        throw new Error('Notification service is temporarily unavailable');
      } else {
        throw new Error('Unable to load notifications at this time');
      }
    }
  }

  // =============================================================================
  // Development & Testing
  // =============================================================================

  static async testConnection(
    testData?: any
  ): Promise<{ message: string; timestamp: string; data?: any }> {
    try {
      const result = await testFunctionFn(
        testData || { test: 'Hello from frontend!' }
      );
      return result.data as { message: string; timestamp: string; data?: any };
    } catch (error: any) {
      console.error('Error testing connection:', error);
      throw new Error('Failed to test backend connection');
    }
  }

  // Initialize user profile and sample data for development
  static async initializeUserData(): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      // Get the current user from auth context - we'll need to pass this from the component
      // For now, let's create a simpler approach that doesn't require updateUserProfile

      // Just create some sample notifications
      await this.createNotification(
        'Welcome to EdVerse!',
        'Your educational management system is ready to use.',
        'success',
        'all'
      );

      await this.createNotification(
        'System Maintenance',
        'Scheduled maintenance will occur this weekend.',
        'info',
        'all'
      );

      return {
        success: true,
        message: 'Sample notifications created successfully',
      };
    } catch (error: any) {
      console.error('Error initializing user data:', error);
      return {
        success: false,
        message: `Failed to initialize user data: ${error.message}`,
      };
    }
  }
}

// =============================================================================
// Error Handling Utilities
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
  if (error.code === 'functions/unauthenticated') {
    return new ApiError(
      'Authentication required. Please sign in.',
      'AUTH_REQUIRED'
    );
  } else if (error.code === 'functions/permission-denied') {
    return new ApiError(
      'You do not have permission to perform this action.',
      'PERMISSION_DENIED'
    );
  } else if (error.code === 'functions/not-found') {
    return new ApiError('The requested resource was not found.', 'NOT_FOUND');
  } else if (error.code === 'functions/internal') {
    return new ApiError(
      'An internal server error occurred. Please try again later.',
      'INTERNAL_ERROR'
    );
  } else {
    return new ApiError(
      error.message || 'An unexpected error occurred.',
      'UNKNOWN_ERROR'
    );
  }
};

export const useApiCall = <T>(
  apiFunction: () => Promise<T>,
  dependencies: any[] = []
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiFunction();
        setData(result);
      } catch (err: any) {
        setError(handleApiError(err).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction();
      setData(result);
    } catch (err: any) {
      setError(handleApiError(err).message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};

export default ApiService;
