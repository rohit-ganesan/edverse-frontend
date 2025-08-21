import React from 'react';
import { supabase } from '../supabase';
import { UserProfile } from 'features/auth/AuthContext';

// Dashboard Statistics
export interface DashboardStats {
  totalStudents: number;
  totalInstructors: number;
  totalCourses: number;
  totalAdmins: number;
}

// API Service for Supabase operations
export class SupabaseApiService {
  // Dashboard operations
  static async getDashboardStats(): Promise<DashboardStats> {
    try {
      // Get counts from each table
      const [studentsResult, instructorsResult, coursesResult, adminsResult] =
        await Promise.all([
          supabase
            .from('students')
            .select('id', { count: 'exact', head: true }),
          supabase
            .from('instructors')
            .select('id', { count: 'exact', head: true }),
          supabase.from('courses').select('id', { count: 'exact', head: true }),
          supabase
            .from('users')
            .select('id', { count: 'exact', head: true })
            .eq('role', 'Administrator'),
        ]);

      return {
        totalStudents: studentsResult.count || 0,
        totalInstructors: instructorsResult.count || 0,
        totalCourses: coursesResult.count || 0,
        totalAdmins: adminsResult.count || 0,
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  // Test connection
  static async testConnection(
    data?: any
  ): Promise<{ message: string; timestamp: string }> {
    try {
      // Simple query to test connection
      const { data: result, error } = await supabase
        .from('users')
        .select('count')
        .limit(1);

      if (error) throw error;

      return {
        message: 'Supabase connection successful',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error testing Supabase connection:', error);
      throw error;
    }
  }

  // User operations
  static async getUsers(role?: string): Promise<UserProfile[]> {
    try {
      let query = supabase.from('users').select('*');

      if (role) {
        query = query.eq('role', role);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  static async getUserById(id: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw error;
    }
  }

  static async updateUser(
    id: string,
    updates: Partial<UserProfile>
  ): Promise<UserProfile> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  static async deleteUser(id: string): Promise<void> {
    try {
      const { error } = await supabase.from('users').delete().eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  // Course operations (placeholder for future implementation)
  static async getCourses(): Promise<any[]> {
    try {
      const { data, error } = await supabase.from('courses').select('*');

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  }

  // Student operations (placeholder for future implementation)
  static async getStudents(): Promise<any[]> {
    try {
      const { data, error } = await supabase.from('students').select(`
          *,
          users!inner(*)
        `);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  }

  // Instructor operations (placeholder for future implementation)
  static async getInstructors(): Promise<any[]> {
    try {
      const { data, error } = await supabase.from('instructors').select(`
          *,
          users!inner(*)
        `);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching instructors:', error);
      throw error;
    }
  }

  // Notification operations (placeholder for future implementation)
  static async getNotifications(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }
}

// React hook for API calls (replacing the old Firebase useApiCall)
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

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await queryFn();
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, deps);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
