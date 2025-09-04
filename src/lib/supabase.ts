import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL!;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file.'
  );
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'X-Client-Info': 'edverse-frontend',
    },
  },
  realtime: {
    params: {
      eventsPerSecond: 2,
    },
  },
});

// Export types for better TypeScript support
export type {
  User,
  Session,
  AuthError,
  PostgrestError,
} from '@supabase/supabase-js';

// Database type definitions matching our PostgreSQL schema
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          address: string;
          role: 'owner' | 'admin' | 'teacher' | 'student' | 'parent';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          first_name: string;
          last_name: string;
          address?: string;
          role?: 'owner' | 'admin' | 'teacher' | 'student' | 'parent';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string;
          last_name?: string;
          address?: string;
          role?: 'owner' | 'admin' | 'teacher' | 'student' | 'parent';
          created_at?: string;
          updated_at?: string;
        };
      };
      instructors: {
        Row: {
          id: string;
          subjects: string[];
          courses: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          subjects?: string[];
          courses?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          subjects?: string[];
          courses?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      students: {
        Row: {
          id: string;
          grade: string;
          parent_email: string | null;
          enrolled_courses: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          grade?: string;
          parent_email?: string | null;
          enrolled_courses?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          grade?: string;
          parent_email?: string | null;
          enrolled_courses?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      courses: {
        Row: {
          id: string;
          name: string;
          description: string;
          instructor_id: string;
          instructor_name: string;
          subject: string;
          grade: string;
          students: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          instructor_id: string;
          instructor_name: string;
          subject: string;
          grade: string;
          students?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          instructor_id?: string;
          instructor_name?: string;
          subject?: string;
          grade?: string;
          students?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          title: string;
          message: string;
          type: 'info' | 'success' | 'warning' | 'error';
          target_role: string;
          created_by: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          message: string;
          type?: 'info' | 'success' | 'warning' | 'error';
          target_role: string;
          created_by: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          message?: string;
          type?: 'info' | 'success' | 'warning' | 'error';
          target_role?: string;
          created_by?: string;
          is_active?: boolean;
          created_at?: string;
        };
      };
      grades: {
        Row: {
          id: string;
          student_id: string;
          course_id: string;
          instructor_id: string;
          assignment_id: string | null;
          score: number;
          max_score: number;
          graded_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          course_id: string;
          instructor_id: string;
          assignment_id?: string | null;
          score: number;
          max_score: number;
          graded_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          course_id?: string;
          instructor_id?: string;
          assignment_id?: string | null;
          score?: number;
          max_score?: number;
          graded_at?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      attendance: {
        Row: {
          id: string;
          student_id: string;
          course_id: string;
          instructor_id: string;
          date: string;
          status: 'present' | 'absent' | 'late' | 'excused';
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          course_id: string;
          instructor_id: string;
          date: string;
          status?: 'present' | 'absent' | 'late' | 'excused';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          course_id?: string;
          instructor_id?: string;
          date?: string;
          status?: 'present' | 'absent' | 'late' | 'excused';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      assignments: {
        Row: {
          id: string;
          title: string;
          description: string;
          course_id: string;
          instructor_id: string;
          due_date: string;
          max_score: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          course_id: string;
          instructor_id: string;
          due_date: string;
          max_score: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          course_id?: string;
          instructor_id?: string;
          due_date?: string;
          max_score?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      submissions: {
        Row: {
          id: string;
          assignment_id: string;
          student_id: string;
          instructor_id: string;
          content: string;
          submitted_at: string;
          grade: number | null;
          feedback: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          assignment_id: string;
          student_id: string;
          instructor_id: string;
          content: string;
          submitted_at?: string;
          grade?: number | null;
          feedback?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          assignment_id?: string;
          student_id?: string;
          instructor_id?: string;
          content?: string;
          submitted_at?: string;
          grade?: number | null;
          feedback?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          sender_id: string;
          recipient_id: string;
          subject: string;
          content: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          sender_id: string;
          recipient_id: string;
          subject: string;
          content: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          sender_id?: string;
          recipient_id?: string;
          subject?: string;
          content?: string;
          is_read?: boolean;
          created_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          event_date: string;
          end_date: string | null;
          location: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          event_date: string;
          end_date?: string | null;
          location?: string | null;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          event_date?: string;
          end_date?: string | null;
          location?: string | null;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: 'owner' | 'admin' | 'teacher' | 'student' | 'parent';
      attendance_status: 'present' | 'absent' | 'late' | 'excused';
      notification_type: 'info' | 'success' | 'warning' | 'error';
    };
  };
};

export default supabase;
