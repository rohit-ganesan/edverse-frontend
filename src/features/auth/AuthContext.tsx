import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import { authAPI } from '../../lib/supabase-api';
import { useAccess } from '../../context/AccessContext';

// Types
export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  address: string;
  role: 'Administrator' | 'Instructor' | 'Student' | 'Parent';
  created_at?: string;
  updated_at?: string;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

// Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Provider Component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // State
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Get access context
  const { initializeAccess } = useAccess();

  // Simple logging utility
  const log = useCallback((message: string, data?: any) => {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    console.log(`🔵 [${timestamp}] AuthContext: ${message}`, data || '');
  }, []);

  // STEP 4: Profile creation function
  const createDefaultProfile = useCallback(
    async (userId: string): Promise<void> => {
      log(`Creating default profile for user: ${userId}`);

      try {
        const { data: userData } = await supabase.auth.getUser();

        if (!userData.user?.email) {
          throw new Error('No email found for user');
        }

        const userProfileData = {
          email: userData.user.email,
          first_name: userData.user.user_metadata?.first_name || '',
          last_name: userData.user.user_metadata?.last_name || '',
          address: '',
          role: 'Administrator', // Default role
        };

        log('Creating profile via Edge Function', userProfileData);

        const { data, error } =
          await authAPI.createUserProfile(userProfileData);

        if (error) {
          throw new Error(`Profile creation error: ${error}`);
        }

        if (data) {
          setUserProfile(data as UserProfile);
          log('Default profile created successfully via Edge Function', {
            email: data.email,
            role: data.role,
          });
        }
      } catch (error: any) {
        log('Failed to create default profile', {
          error: error.message,
          userId,
        });
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    },
    [log]
  );

  // STEP 2: Profile loading function
  const loadUserProfile = useCallback(
    async (userId: string): Promise<void> => {
      log(`Loading profile for user: ${userId}`);

      try {
        const { data: profile, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();

        log('Profile query result:', {
          hasProfile: !!profile,
          hasError: !!error,
          errorCode: error?.code,
          errorMessage: error?.message,
        });

        if (error) {
          if (error.code === 'PGRST116') {
            log('No profile found, creating default profile');
            await createDefaultProfile(userId);
            return;
          } else {
            throw new Error(`Database error: ${error.message}`);
          }
        }

        if (profile) {
          setUserProfile(profile as UserProfile);
          log('Profile loaded successfully', {
            email: profile.email,
            role: profile.role,
          });

          // Initialize access data after profile is loaded
          try {
            await initializeAccess();
            log('Access data initialized successfully');
          } catch (accessError) {
            log('Failed to initialize access data', { error: accessError });
          }
        }
      } catch (error: any) {
        log('Failed to load user profile', {
          error: error.message,
          userId,
        });
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    },
    [log, createDefaultProfile, initializeAccess]
  );

  // STEP 1: Basic auth state management
  useEffect(() => {
    log('AuthProvider mounted');

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      log(`Auth state changed: ${event}`, {
        hasSession: !!session,
        hasUser: !!session?.user,
        userEmail: session?.user?.email,
      });

      setSession(session);
      setUser(session?.user ?? null);

      // Load profile if we have a user
      if (session?.user?.id) {
        loadUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Cleanup
    return () => {
      log('AuthProvider unmounting');
      subscription.unsubscribe();
    };
  }, [log, loadUserProfile]);

  // STEP 3: Authentication functions
  const signUp = useCallback(
    async (email: string, password: string, userData: any): Promise<void> => {
      log('Starting sign up process', { email });

      try {
        setLoading(true);

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: userData,
          },
        });

        if (error) {
          throw error;
        }

        if (data.user && !data.session) {
          log('Sign up successful, email verification required');
          return;
        }

        log('Sign up completed successfully');
      } catch (error: any) {
        log('Sign up failed', { error: error.message });
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [log]
  );

  const signIn = useCallback(
    async (email: string, password: string): Promise<void> => {
      log('Starting sign in process', { email });

      try {
        setLoading(true);

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message.includes('Email not confirmed')) {
            throw new Error(
              'Please verify your email address before signing in. Check your inbox for a verification link.'
            );
          }
          throw error;
        }

        log('Sign in successful', {
          userId: data.user?.id,
          email: data.user?.email,
        });
      } catch (error: any) {
        log('Sign in failed', { error: error.message });
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [log]
  );

  const signOut = useCallback(async (): Promise<void> => {
    log('Starting sign out process');

    try {
      // Clear local state immediately (React way)
      setUser(null);
      setUserProfile(null);
      setSession(null);
      setLoading(false);

      // Let Supabase handle its own cleanup
      const { error } = await supabase.auth.signOut();
      if (error) {
        log('Supabase signOut error (local state cleared)', {
          error: error.message,
        });
      }

      log('Sign out completed successfully');
    } catch (error: any) {
      log('Sign out error', { error: error.message });
      // Ensure local state is cleared even on error
      setUser(null);
      setUserProfile(null);
      setSession(null);
      setLoading(false);
    }
  }, [log]);

  const updateUserProfile = useCallback(
    async (updates: Partial<UserProfile>): Promise<void> => {
      if (!user?.id) {
        throw new Error('No authenticated user');
      }

      log('Updating user profile via Edge Function', { updates });

      try {
        const { data, error } = await authAPI.updateUserProfile(
          user.id,
          updates
        );

        if (error) {
          throw new Error(error);
        }

        if (data) {
          setUserProfile(data as UserProfile);
          log('Profile updated successfully via Edge Function');
        }
      } catch (error: any) {
        log('Failed to update profile', { error: error.message });
        throw error;
      }
    },
    [user?.id, log]
  );

  // Context value
  const value: AuthContextType = {
    user,
    session,
    userProfile,
    loading,
    signUp,
    signIn,
    signOut,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
