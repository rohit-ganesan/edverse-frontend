import { User } from 'firebase/auth';

export interface UserProfile {
  firstName?: string;
  lastName?: string;
  address?: string;
  role?: string;
}

export interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
}

export interface AuthFormData {
  email: string;
  password: string;
  confirmPassword?: string;
}
