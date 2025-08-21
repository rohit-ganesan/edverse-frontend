import { User } from '@supabase/supabase-js';

export interface UserProfile {
  first_name?: string;
  last_name?: string;
  address?: string;
  role?: string;
}

export interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    profile?: Partial<UserProfile>
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
}

export interface AuthFormData {
  email: string;
  password: string;
  confirmPassword?: string;
  first_name?: string;
  last_name?: string;
  role?: string;
}

export type UserRole = 'Student' | 'Instructor' | 'Administrator';
